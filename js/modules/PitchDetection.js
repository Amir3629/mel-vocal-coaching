import * as Pitchy from 'pitchy';
import * as Tone from 'tone';

export class PitchDetection {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.detector = null;
        this.isListening = false;
        this.onPitchCallback = null;
        this.synth = new Tone.Synth().toDestination();
    }

    async initialize() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            this.detector = new Pitchy.PitchDetector();
            return true;
        } catch (error) {
            console.error('Error initializing pitch detection:', error);
            return false;
        }
    }

    startListening(callback) {
        this.onPitchCallback = callback;
        this.isListening = true;
        this.analyze();
    }

    stopListening() {
        this.isListening = false;
    }

    analyze() {
        if (!this.isListening) return;

        const buffer = new Float32Array(2048);
        this.analyser.getFloatTimeDomainData(buffer);
        const [pitch, clarity] = this.detector.findPitch(buffer, this.audioContext.sampleRate);

        if (clarity > 0.8) {
            const note = this.frequencyToNote(pitch);
            if (this.onPitchCallback) {
                this.onPitchCallback({ pitch, note, clarity });
            }
        }

        requestAnimationFrame(() => this.analyze());
    }

    frequencyToNote(frequency) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const midiNumber = Math.round(12 * Math.log2(frequency / 440) + 69);
        const octave = Math.floor((midiNumber - 12) / 12);
        const noteIndex = (midiNumber - 12) % 12;
        return `${noteNames[noteIndex]}${octave}`;
    }

    async playReferenceNote(note, duration = 1) {
        await Tone.start();
        this.synth.triggerAttackRelease(note, duration);
    }

    getAccuracyScore(targetNote, detectedNote) {
        const targetFreq = this.noteToFrequency(targetNote);
        const detectedFreq = this.noteToFrequency(detectedNote);
        const cents = 1200 * Math.log2(detectedFreq / targetFreq);
        return Math.max(0, 100 - Math.abs(cents));
    }

    noteToFrequency(note) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const [, noteName, octave] = note.match(/([A-G]#?)(\d+)/);
        const noteIndex = noteNames.indexOf(noteName);
        return 440 * Math.pow(2, (noteIndex - 9 + (octave - 4) * 12) / 12);
    }
} 