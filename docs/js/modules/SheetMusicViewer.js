import * as Tone from 'tone';
import * as Vex from 'vexflow';

export class SheetMusicViewer {
    constructor() {
        this.vf = null;
        this.context = null;
        this.stave = null;
        this.currentScore = null;
        this.synth = new Tone.Synth().toDestination();
        this.isPlaying = false;
        this.currentNoteIndex = 0;
        this.playbackSpeed = 1.0;
    }

    initialize(container) {
        this.container = container;
        this.container.innerHTML = `
            <div class="sheet-music-viewer">
                <div class="controls">
                    <button id="playBtn" class="btn-primary">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button id="stopBtn" class="btn-secondary">
                        <i class="fas fa-stop"></i> Stop
                    </button>
                    <div class="speed-control">
                        <label>Speed:</label>
                        <select id="speedSelect">
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1.0" selected>1.0x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                        </select>
                    </div>
                </div>
                <div id="sheetMusicContainer"></div>
                <div class="zoom-controls">
                    <button id="zoomInBtn">
                        <i class="fas fa-search-plus"></i>
                    </button>
                    <button id="zoomOutBtn">
                        <i class="fas fa-search-minus"></i>
                    </button>
                </div>
            </div>
        `;

        this.setupVexFlow();
        this.setupEventListeners();
    }

    setupVexFlow() {
        const renderer = new Vex.Flow.Renderer(
            document.getElementById('sheetMusicContainer'),
            Vex.Flow.Renderer.Backends.SVG
        );

        renderer.resize(800, 200);
        this.context = renderer.getContext();
        this.context.setFont('Arial', 10);
    }

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlayback());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopPlayback());
        document.getElementById('speedSelect').addEventListener('change', (e) => {
            this.playbackSpeed = parseFloat(e.target.value);
        });
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoom(1.1));
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoom(0.9));
    }

    loadScore(scoreData) {
        this.currentScore = scoreData;
        this.currentNoteIndex = 0;
        this.renderScore();
    }

    renderScore() {
        this.context.clear();
        
        const stave = new Vex.Flow.Stave(10, 40, 780);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(this.context).draw();

        if (!this.currentScore || !this.currentScore.notes) return;

        const notes = this.currentScore.notes.map(noteData => {
            const note = new Vex.Flow.StaveNote({
                clef: 'treble',
                keys: [noteData.key],
                duration: noteData.duration
            });

            if (noteData.accidental) {
                note.addAccidental(0, new Vex.Flow.Accidental(noteData.accidental));
            }

            return note;
        });

        const voice = new Vex.Flow.Voice({
            num_beats: 4,
            beat_value: 4
        });
        voice.addTickables(notes);

        const formatter = new Vex.Flow.Formatter();
        formatter.joinVoices([voice]).format([voice], 750);

        voice.draw(this.context, stave);
        this.highlightCurrentNote();
    }

    highlightCurrentNote() {
        if (!this.currentScore || !this.currentScore.notes) return;

        const notes = this.context.svg.getElementsByClassName('vf-stavenote');
        Array.from(notes).forEach((note, index) => {
            if (index === this.currentNoteIndex) {
                note.classList.add('highlighted');
            } else {
                note.classList.remove('highlighted');
            }
        });
    }

    async togglePlayback() {
        if (this.isPlaying) {
            this.pausePlayback();
        } else {
            await this.startPlayback();
        }
    }

    async startPlayback() {
        if (!this.currentScore || !this.currentScore.notes) return;

        this.isPlaying = true;
        document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i> Pause';

        while (this.isPlaying && this.currentNoteIndex < this.currentScore.notes.length) {
            const note = this.currentScore.notes[this.currentNoteIndex];
            this.highlightCurrentNote();
            
            await this.playNote(note);
            this.currentNoteIndex++;

            if (this.currentNoteIndex >= this.currentScore.notes.length) {
                this.stopPlayback();
            }
        }
    }

    pausePlayback() {
        this.isPlaying = false;
        document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i> Play';
    }

    stopPlayback() {
        this.isPlaying = false;
        this.currentNoteIndex = 0;
        document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i> Play';
        this.highlightCurrentNote();
    }

    async playNote(note) {
        await Tone.start();
        this.synth.triggerAttackRelease(note.key, note.duration);
    }

    calculateNoteDuration(duration) {
        const durationMap = {
            'w': 4.0,  // whole note
            'h': 2.0,  // half note
            'q': 1.0,  // quarter note
            '8': 0.5,  // eighth note
            '16': 0.25 // sixteenth note
        };
        return durationMap[duration] || 1.0;
    }

    convertKeyToFrequency(key) {
        // Convert VexFlow key notation to Tone.js frequency
        const [note, octave] = key.split('/');
        return `${note}${octave}`;
    }

    zoom(factor) {
        const container = document.getElementById('sheetMusicContainer');
        const currentWidth = container.offsetWidth;
        const currentHeight = container.offsetHeight;
        
        const renderer = new Vex.Flow.Renderer(
            container,
            Vex.Flow.Renderer.Backends.SVG
        );

        renderer.resize(currentWidth * factor, currentHeight * factor);
        this.context = renderer.getContext();
        this.context.scale(factor, factor);
        this.renderScore();
    }

    // Example method to load a simple score
    loadExampleScore() {
        this.loadScore({
            notes: [
                { key: 'c/4', duration: 'q' },
                { key: 'd/4', duration: 'q' },
                { key: 'e/4', duration: 'q' },
                { key: 'f/4', duration: 'q' },
                { key: 'g/4', duration: 'q' },
                { key: 'a/4', duration: 'q' },
                { key: 'b/4', duration: 'q' },
                { key: 'c/5', duration: 'q' }
            ]
        });
    }
} 