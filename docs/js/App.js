import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config.js';
import { EnhancedFeatures } from './modules/EnhancedFeatures.js';
import { domUtils } from './utils.js';

export class App {
    constructor() {
        // Initialize Firebase
        this.firebaseApp = initializeApp(firebaseConfig);
        
        // Initialize enhanced features
        this.enhancedFeatures = new EnhancedFeatures(this.firebaseApp);
        
        // Track current view
        this.currentView = 'home';
        
        // Track initialization state
        this.initialized = false;
    }

    async initialize() {
        try {
            // Show loading overlay
            this.showLoadingOverlay();

            // Initialize enhanced features
            await this.enhancedFeatures.initialize();

            // Setup navigation
            this.setupNavigation();

            // Load initial view
            await this.loadView('home');

            // Hide loading overlay
            this.hideLoadingOverlay();

            this.initialized = true;
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            domUtils.showElement(overlay);
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            domUtils.hideElement(overlay);
        }
    }

    setupNavigation() {
        // Handle navigation clicks
        document.querySelectorAll('[data-view]').forEach(element => {
            element.addEventListener('click', async (e) => {
                e.preventDefault();
                const view = e.target.closest('[data-view]').dataset.view;
                await this.loadView(view);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', async (e) => {
            if (e.state && e.state.view) {
                await this.loadView(e.state.view, false);
            }
        });
    }

    async loadView(viewName, updateHistory = true) {
        try {
            // Show loading overlay for view change
            this.showLoadingOverlay();

            // Update history if needed
            if (updateHistory) {
                history.pushState({ view: viewName }, '', `#${viewName}`);
            }

            // Hide all views
            document.querySelectorAll('.view-container').forEach(container => {
                domUtils.hideElement(container);
            });

            // Show requested view
            const viewContainer = document.getElementById(`${viewName}-container`);
            if (!viewContainer) {
                throw new Error(`View container not found: ${viewName}`);
            }

            // Update current view
            this.currentView = viewName;

            // Initialize view-specific content
            await this.initializeViewContent(viewName);

            // Show the view
            domUtils.showElement(viewContainer);

            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(`Error loading view ${viewName}:`, error);
            this.showError('Failed to load view. Please try again.');
        } finally {
            this.hideLoadingOverlay();
        }
    }

    async initializeViewContent(viewName) {
        switch (viewName) {
            case 'home':
                // Initialize home view animations
                this.initializeHomeAnimations();
                break;

            case 'practice':
                // Ensure user is authenticated
                if (!this.enhancedFeatures.getModule('auth').isAuthenticated()) {
                    this.showLoginPrompt();
                    return;
                }
                await this.enhancedFeatures.initializeViewSpecifics('practice');
                break;

            case 'lessons':
                if (!this.enhancedFeatures.getModule('auth').isAuthenticated()) {
                    this.showLoginPrompt();
                    return;
                }
                await this.enhancedFeatures.initializeViewSpecifics('lessons');
                break;

            case 'progress':
                if (!this.enhancedFeatures.getModule('auth').isAuthenticated()) {
                    this.showLoginPrompt();
                    return;
                }
                await this.enhancedFeatures.initializeViewSpecifics('progress');
                break;

            case 'recordings':
                if (!this.enhancedFeatures.getModule('auth').isAuthenticated()) {
                    this.showLoginPrompt();
                    return;
                }
                await this.enhancedFeatures.initializeViewSpecifics('recordings');
                break;

            case 'about':
                // Load about content if needed
                break;

            case 'contact':
                // Initialize contact form handlers
                this.initializeContactForm();
                break;
        }
    }

    initializeHomeAnimations() {
        // Add fade-in animation to hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('fade-in');
            setTimeout(() => heroContent.classList.add('visible'), 100);
        }
    }

    initializeContactForm() {
        const form = document.querySelector('#contact-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    // Get form data
                    const formData = new FormData(form);
                    // Process form submission
                    await this.processContactForm(formData);
                    this.showSuccess('Message sent successfully!');
                    form.reset();
                } catch (error) {
                    console.error('Error submitting contact form:', error);
                    this.showError('Failed to send message. Please try again.');
                }
            });
        }
    }

    async processContactForm(formData) {
        // Implement contact form submission logic
        // This could send an email, store in database, etc.
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    showLoginPrompt() {
        // Redirect to home and show login dialog
        this.loadView('home');
        this.enhancedFeatures.getModule('auth').showLoginForm();
    }

    showError(message) {
        // Show error message using SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#ffcc00'
        });
    }

    showSuccess(message) {
        // Show success message using SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: message,
            confirmButtonColor: '#ffcc00'
        });
    }

    getModule(moduleName) {
        return this.enhancedFeatures.getModule(moduleName);
    }
} 