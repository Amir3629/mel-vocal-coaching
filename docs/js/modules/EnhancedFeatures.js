import { PitchDetection } from './PitchDetection.js';
import { VirtualPiano } from './VirtualPiano.js';
import { LessonBooking } from './LessonBooking.js';
import { ProgressTracker } from './ProgressTracker.js';
import { SheetMusicViewer } from './SheetMusicViewer.js';
import { PerformanceRecorder } from './PerformanceRecorder.js';
import { Auth } from './Auth.js';
import { appSettings } from '../config.js';
import { domUtils, audioUtils } from '../utils.js';

export class EnhancedFeatures {
    constructor(firebaseApp) {
        this.firebaseApp = firebaseApp;
        this.modules = {
            auth: new Auth(firebaseApp),
            pitchDetection: new PitchDetection(),
            virtualPiano: new VirtualPiano(),
            lessonBooking: new LessonBooking(firebaseApp),
            progressTracker: new ProgressTracker(firebaseApp),
            sheetMusicViewer: new SheetMusicViewer(),
            performanceRecorder: new PerformanceRecorder(firebaseApp)
        };
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        // Initialize authentication first
        await this.modules.auth.initialize(document.getElementById('auth-container'));
        
        // Wait for auth state to be determined
        await new Promise(resolve => {
            this.modules.auth.onAuthStateChanged(() => resolve());
        });

        // Initialize other modules if user is authenticated
        if (this.modules.auth.isAuthenticated()) {
            await this.initializeAuthenticatedFeatures();
        }

        this.setupEventListeners();
        this.initialized = true;
    }

    async initializeAuthenticatedFeatures() {
        const containers = {
            piano: document.getElementById('virtual-piano-container'),
            booking: document.getElementById('lesson-booking-container'),
            progress: document.getElementById('progress-tracking-container'),
            sheetMusic: document.getElementById('sheet-music-container'),
            recorder: document.getElementById('performance-recorder-container')
        };

        // Initialize all modules in parallel
        await Promise.all([
            this.modules.pitchDetection.initialize(),
            this.modules.virtualPiano.initialize(containers.piano),
            this.modules.lessonBooking.initialize(containers.booking),
            this.modules.progressTracker.initialize(containers.progress),
            this.modules.sheetMusicViewer.initialize(containers.sheetMusic),
            this.modules.performanceRecorder.initialize(containers.recorder)
        ]);

        // Setup integrations between modules
        this.setupModuleIntegrations();
    }

    setupModuleIntegrations() {
        // Integrate pitch detection with virtual piano
        this.modules.pitchDetection.onPitchCallback = (data) => {
            this.modules.virtualPiano.highlightNote(data.note);
            if (this.modules.performanceRecorder.isRecording) {
                this.modules.performanceRecorder.recordPitch(data);
            }
        };

        // Integrate virtual piano with sheet music viewer
        this.modules.virtualPiano.onNotePlay = (note) => {
            this.modules.sheetMusicViewer.highlightNote(note);
        };

        // Integrate progress tracker with performance recorder
        this.modules.performanceRecorder.onRecordingSaved = (recording) => {
            this.modules.progressTracker.addPerformanceRecord(recording);
        };
    }

    setupEventListeners() {
        // Listen for auth state changes
        this.modules.auth.onAuthStateChanged(async (user) => {
            if (user) {
                await this.initializeAuthenticatedFeatures();
                this.showAuthenticatedUI();
            } else {
                this.hideAuthenticatedUI();
            }
        });

        // Setup navigation event listeners
        document.querySelectorAll('[data-view]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.dataset.view;
                this.showView(view);
            });
        });
    }

    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view-container').forEach(container => {
            domUtils.hideElement(container);
        });

        // Show requested view
        const viewContainer = document.getElementById(`${viewName}-container`);
        if (viewContainer) {
            domUtils.showElement(viewContainer);
            this.initializeViewSpecifics(viewName);
        }
    }

    async initializeViewSpecifics(viewName) {
        switch (viewName) {
            case 'practice':
                await this.modules.pitchDetection.initialize();
                this.modules.virtualPiano.resetState();
                break;
            case 'lessons':
                await this.modules.lessonBooking.loadAvailableSlots();
                break;
            case 'progress':
                await this.modules.progressTracker.loadProgressData();
                break;
            case 'recordings':
                await this.modules.performanceRecorder.loadRecordings();
                break;
        }
    }

    showAuthenticatedUI() {
        document.querySelectorAll('.authenticated-only').forEach(element => {
            domUtils.showElement(element);
        });
        document.querySelectorAll('.unauthenticated-only').forEach(element => {
            domUtils.hideElement(element);
        });
    }

    hideAuthenticatedUI() {
        document.querySelectorAll('.authenticated-only').forEach(element => {
            domUtils.hideElement(element);
        });
        document.querySelectorAll('.unauthenticated-only').forEach(element => {
            domUtils.showElement(element);
        });
    }

    getModule(moduleName) {
        return this.modules[moduleName];
    }
} 