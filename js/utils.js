import moment from 'moment';
import { appSettings } from './config.js';

// Date and time utilities
export const dateUtils = {
    formatDate(date) {
        return moment(date).format(appSettings.dateFormat);
    },

    formatTime(date) {
        return moment(date).format(appSettings.timeFormat);
    },

    formatDateTime(date) {
        return moment(date).format(`${appSettings.dateFormat} ${appSettings.timeFormat}`);
    },

    isValidDate(date) {
        return moment(date).isValid();
    },

    isPastDate(date) {
        return moment(date).isBefore(moment(), 'day');
    },

    getWeekDates(date = new Date()) {
        const start = moment(date).startOf('week');
        const dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(moment(start).add(i, 'days').toDate());
        }
        return dates;
    },

    getTimeSlots(date, duration = appSettings.lessonDuration) {
        const slots = [];
        const start = moment(date).hours(appSettings.workingHours.start).minutes(0);
        const end = moment(date).hours(appSettings.workingHours.end).minutes(0);

        while (start.isBefore(end)) {
            slots.push(start.toDate());
            start.add(duration, 'minutes');
        }
        return slots;
    }
};

// Audio utilities
export const audioUtils = {
    async createAudioContext() {
        return new (window.AudioContext || window.webkitAudioContext)();
    },

    async requestMicrophoneAccess() {
        try {
            return await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: appSettings.audioSettings.sampleRate,
                    channelCount: appSettings.audioSettings.channels
                }
            });
        } catch (error) {
            console.error('Error accessing microphone:', error);
            throw error;
        }
    },

    async createAudioBuffer(audioContext, audioData) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const arrayBuffer = reader.result;
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    resolve(audioBuffer);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(audioData);
        });
    }
};

// DOM utilities
export const domUtils = {
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    },

    removeAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    showElement(element) {
        element.style.display = '';
    },

    hideElement(element) {
        element.style.display = 'none';
    },

    toggleElement(element, show) {
        element.style.display = show ? '' : 'none';
    }
};

// Data utilities
export const dataUtils = {
    async fetchWithTimeout(resource, options = {}) {
        const { timeout = 5000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Validation utilities
export const validationUtils = {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPassword(password) {
        return password && password.length >= 6;
    },

    isValidPhoneNumber(phone) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    },

    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Storage utilities
export const storageUtils = {
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}; 