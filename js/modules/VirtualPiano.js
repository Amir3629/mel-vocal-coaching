import * as Tone from 'tone';

export class VirtualPiano {
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.keys = [];
        this.isRecording = false;
        this.recording = [];
        this.recordingStartTime = null;
    }

    initialize(container) {
        const pianoContainer = document.createElement('div');
        pianoContainer.className = 'piano-container';
        
        // Create piano keys (2 octaves)
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        for (let octave = 4; octave <= 5; octave++) {
            notes.forEach(note => {
                const key = document.createElement('div');
                const isSharp = note.includes('#');
                key.className = `piano-key ${isSharp ? 'black' : 'white'}`;
                key.dataset.note = `${note}${octave}`;
                
                key.addEventListener('mousedown', () => this.playNote(`${note}${octave}`));
                key.addEventListener('mouseup', () => this.stopNote(`${note}${octave}`));
                key.addEventListener('mouseleave', () => this.stopNote(`${note}${octave}`));
                
                pianoContainer.appendChild(key);
                this.keys.push(key);
            });
        }
        
        container.appendChild(pianoContainer);
        this.setupKeyboardControls();
    }

    playNote(note) {
        this.synth.triggerAttack(note);
        const key = this.keys.find(k => k.dataset.note === note);
        if (key) key.classList.add('active');

        if (this.isRecording) {
            const time = Date.now() - this.recordingStartTime;
            this.recording.push({ note, time, type: 'start' });
        }
    }

    stopNote(note) {
        this.synth.triggerRelease(note);
        const key = this.keys.find(k => k.dataset.note === note);
        if (key) key.classList.remove('active');

        if (this.isRecording) {
            const time = Date.now() - this.recordingStartTime;
            this.recording.push({ note, time, type: 'stop' });
        }
    }

    setupKeyboardControls() {
        const keyMap = {
            'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
            'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
            'u': 'A#4', 'j': 'B4', 'k': 'C5', 'o': 'C#5', 'l': 'D5',
            'p': 'D#5', ';': 'E5'
        };

        document.addEventListener('keydown', (e) => {
            if (!e.repeat && keyMap[e.key]) {
                this.playNote(keyMap[e.key]);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (keyMap[e.key]) {
                this.stopNote(keyMap[e.key]);
            }
        });
    }

    startRecording() {
        this.isRecording = true;
        this.recording = [];
        this.recordingStartTime = Date.now();
    }

    stopRecording() {
        this.isRecording = false;
        return this.recording;
    }

    playRecording(recording) {
        recording.forEach(event => {
            setTimeout(() => {
                if (event.type === 'start') {
                    this.playNote(event.note);
                } else {
                    this.stopNote(event.note);
                }
            }, event.time);
        });
    }

    setVolume(volume) {
        this.synth.volume.value = Tone.gainToDb(volume);
    }

    setInstrument(type) {
        const options = {
            piano: {
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
            },
            organ: {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.3, decay: 0.3, sustain: 0.7, release: 0.8 }
            },
            synth: {
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.2 }
            }
        };

        this.synth.set(options[type] || options.piano);
    }
} 