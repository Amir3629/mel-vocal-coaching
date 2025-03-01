import RecordRTC from 'recordrtc';
import WaveSurfer from 'wavesurfer.js';
import { Tone } from 'tone';
import * as ml5 from 'ml5';

export class PerformanceRecorder {
    constructor(firebaseApp) {
        this.db = firebaseApp.auth();
        this.storage = firebaseApp.storage();
        this.recorder = null;
        this.stream = null;
        this.wavesurfer = null;
        this.isRecording = false;
        this.recordedBlob = null;
        this.pitchDetector = null;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    async initialize(container) {
        this.container = container;
        this.container.innerHTML = `
            <div class="performance-recorder">
                <div class="controls">
                    <button id="recordBtn" class="btn-primary">
                        <i class="fas fa-microphone"></i> Record
                    </button>
                    <button id="stopBtn" class="btn-secondary" disabled>
                        <i class="fas fa-stop"></i> Stop
                    </button>
                    <button id="playBtn" class="btn-secondary" disabled>
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button id="saveBtn" class="btn-success" disabled>
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
                <div class="visualization">
                    <div id="waveform"></div>
                    <div id="pitchDisplay" class="pitch-display"></div>
                </div>
                <div class="performance-metrics">
                    <div class="metric">
                        <h4>Pitch Accuracy</h4>
                        <div id="pitchAccuracy">-</div>
                    </div>
                    <div class="metric">
                        <h4>Rhythm Accuracy</h4>
                        <div id="rhythmAccuracy">-</div>
                    </div>
                    <div class="metric">
                        <h4>Overall Score</h4>
                        <div id="overallScore">-</div>
                    </div>
                </div>
                <div class="recording-list">
                    <h3>Your Recordings</h3>
                    <div id="recordingsList"></div>
                </div>
            </div>
        `;

        this.setupWaveSurfer();
        this.setupEventListeners();
        await this.loadRecordings();
        await this.initializePitchDetection();
    }

    setupWaveSurfer() {
        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#4CAF50',
            progressColor: '#2196F3',
            cursorColor: '#FF5722',
            height: 100,
            responsive: true,
            normalize: true,
            plugins: []
        });

        this.wavesurfer.on('finish', () => {
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i> Play';
        });
    }

    setupEventListeners() {
        document.getElementById('recordBtn').addEventListener('click', () => this.toggleRecording());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopRecording());
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlayback());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveRecording());
    }

    async initializePitchDetection() {
        try {
            this.pitchDetector = await ml5.pitchDetection(
                '/models/crepe',
                this.audioContext,
                this.stream,
                this.onPitch.bind(this)
            );
        } catch (error) {
            console.error('Error initializing pitch detection:', error);
        }
    }

    async toggleRecording() {
        if (this.isRecording) {
            await this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recorder = new RecordRTC(this.stream, {
                type: 'audio',
                mimeType: 'audio/wav',
                sampleRate: 44100,
                desiredSampRate: 16000,
                numberOfAudioChannels: 1
            });

            this.recorder.startRecording();
            this.isRecording = true;
            
            document.getElementById('recordBtn').innerHTML = '<i class="fas fa-stop"></i> Stop';
            document.getElementById('recordBtn').classList.add('recording');
            document.getElementById('stopBtn').disabled = false;
            document.getElementById('playBtn').disabled = true;
            document.getElementById('saveBtn').disabled = true;

            this.startPitchDetection();
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }

    async stopRecording() {
        if (!this.recorder) return;

        return new Promise(resolve => {
            this.recorder.stopRecording(() => {
                this.recordedBlob = this.recorder.getBlob();
                this.wavesurfer.loadBlob(this.recordedBlob);
                
                this.isRecording = false;
                document.getElementById('recordBtn').innerHTML = '<i class="fas fa-microphone"></i> Record';
                document.getElementById('recordBtn').classList.remove('recording');
                document.getElementById('stopBtn').disabled = true;
                document.getElementById('playBtn').disabled = false;
                document.getElementById('saveBtn').disabled = false;

                this.stopPitchDetection();
                this.analyzePerformance();
                
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }
                
                resolve();
            });
        });
    }

    togglePlayback() {
        if (this.wavesurfer.isPlaying()) {
            this.wavesurfer.pause();
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i> Play';
        } else {
            this.wavesurfer.play();
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    }

    async saveRecording() {
        if (!this.recordedBlob) return;

        try {
            const fileName = `recording_${Date.now()}.wav`;
            const storageRef = this.storage.ref(`recordings/${this.auth.currentUser.uid}/${fileName}`);
            
            await storageRef.put(this.recordedBlob);
            const url = await storageRef.getDownloadURL();

            const recordingData = {
                userId: this.auth.currentUser.uid,
                fileName,
                url,
                timestamp: new Date(),
                metrics: {
                    pitchAccuracy: document.getElementById('pitchAccuracy').textContent,
                    rhythmAccuracy: document.getElementById('rhythmAccuracy').textContent,
                    overallScore: document.getElementById('overallScore').textContent
                }
            };

            await this.db.collection('recordings').add(recordingData);
            await this.loadRecordings();

            await Swal.fire(
                'Saved!',
                'Your recording has been saved successfully.',
                'success'
            );
        } catch (error) {
            console.error('Error saving recording:', error);
            await Swal.fire(
                'Error',
                'There was an error saving your recording. Please try again.',
                'error'
            );
        }
    }

    async loadRecordings() {
        try {
            const snapshot = await this.db.collection('recordings')
                .where('userId', '==', this.auth.currentUser.uid)
                .orderBy('timestamp', 'desc')
                .get();

            const recordingsList = document.getElementById('recordingsList');
            recordingsList.innerHTML = '';

            snapshot.docs.forEach(doc => {
                const recording = doc.data();
                const recordingElement = document.createElement('div');
                recordingElement.className = 'recording-item';
                recordingElement.innerHTML = `
                    <div class="recording-info">
                        <span class="recording-date">
                            ${moment(recording.timestamp.toDate()).format('MMM D, YYYY HH:mm')}
                        </span>
                        <div class="recording-metrics">
                            <span>Pitch: ${recording.metrics.pitchAccuracy}</span>
                            <span>Rhythm: ${recording.metrics.rhythmAccuracy}</span>
                            <span>Score: ${recording.metrics.overallScore}</span>
                        </div>
                    </div>
                    <div class="recording-actions">
                        <button class="btn-link" onclick="window.open('${recording.url}', '_blank')">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-link" onclick="this.deleteRecording('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                recordingsList.appendChild(recordingElement);
            });
        } catch (error) {
            console.error('Error loading recordings:', error);
        }
    }

    async deleteRecording(recordingId) {
        try {
            const doc = await this.db.collection('recordings').doc(recordingId).get();
            const recording = doc.data();

            await this.storage.ref(recording.url).delete();
            await this.db.collection('recordings').doc(recordingId).delete();
            await this.loadRecordings();

            await Swal.fire(
                'Deleted!',
                'Your recording has been deleted.',
                'success'
            );
        } catch (error) {
            console.error('Error deleting recording:', error);
            await Swal.fire(
                'Error',
                'There was an error deleting your recording. Please try again.',
                'error'
            );
        }
    }

    startPitchDetection() {
        if (!this.pitchDetector) return;

        const analyser = this.audioContext.createAnalyser();
        const source = this.audioContext.createMediaStreamSource(this.stream);
        source.connect(analyser);

        this.pitchDetectionInterval = setInterval(() => {
            this.pitchDetector.getPitch((err, frequency) => {
                if (frequency) {
                    const note = this.frequencyToNote(frequency);
                    document.getElementById('pitchDisplay').textContent = 
                        `Current Note: ${note} (${Math.round(frequency)} Hz)`;
                }
            });
        }, 100);
    }

    stopPitchDetection() {
        if (this.pitchDetectionInterval) {
            clearInterval(this.pitchDetectionInterval);
            this.pitchDetectionInterval = null;
        }
    }

    frequencyToNote(frequency) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const midiNumber = Math.round(12 * Math.log2(frequency / 440) + 69);
        const octave = Math.floor((midiNumber - 12) / 12);
        const noteIndex = (midiNumber - 12) % 12;
        return `${noteNames[noteIndex]}${octave}`;
    }

    analyzePerformance() {
        // This is a simplified analysis. In a real application,
        // you would want to implement more sophisticated analysis
        const pitchAccuracy = Math.round(Math.random() * 30 + 70); // Simulated score
        const rhythmAccuracy = Math.round(Math.random() * 30 + 70); // Simulated score
        const overallScore = Math.round((pitchAccuracy + rhythmAccuracy) / 2);

        document.getElementById('pitchAccuracy').textContent = `${pitchAccuracy}%`;
        document.getElementById('rhythmAccuracy').textContent = `${rhythmAccuracy}%`;
        document.getElementById('overallScore').textContent = `${overallScore}%`;
    }
} 