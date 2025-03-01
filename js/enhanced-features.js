// Enhanced features for the website

// Virtual Piano Feature
function initializeVirtualPiano() {
    const pianoContainer = document.createElement('div');
    pianoContainer.id = 'virtual-piano';
    pianoContainer.className = 'virtual-piano-container';

    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    notes.forEach((note, index) => {
        const key = document.createElement('div');
        key.className = 'piano-key';
        key.dataset.note = note;
        
        key.addEventListener('mousedown', () => playNote(note, index));
        pianoContainer.appendChild(key);
    });

    function playNote(note, index) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequency = 440 * Math.pow(2, (index - 9) / 12); // A4 = 440Hz
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    document.querySelector('.hero').appendChild(pianoContainer);
}

// Lesson Booking System
function initializeLessonBooking() {
    const bookingSection = document.createElement('section');
    bookingSection.id = 'lesson-booking';
    bookingSection.innerHTML = `
        <h2>Unterricht buchen</h2>
        <div class="booking-calendar">
            <div class="calendar-header">
                <button id="prev-month">&lt;</button>
                <h3 id="current-month"></h3>
                <button id="next-month">&gt;</button>
            </div>
            <div class="calendar-grid" id="calendar-days"></div>
        </div>
        <div class="time-slots" id="time-slots"></div>
    `;

    document.querySelector('main').appendChild(bookingSection);
    initializeCalendar();
}

// Progress Tracking System
function initializeProgressTracking() {
    const progressSection = document.createElement('section');
    progressSection.id = 'progress-tracking';
    progressSection.innerHTML = `
        <h2>Mein Fortschritt</h2>
        <div class="progress-charts">
            <canvas id="skills-chart"></canvas>
            <canvas id="practice-chart"></canvas>
        </div>
        <div class="practice-log">
            <h3>Übungsprotokoll</h3>
            <form id="practice-log-form">
                <input type="date" required>
                <input type="number" placeholder="Minuten geübt" required>
                <textarea placeholder="Notizen zur Übung"></textarea>
                <button type="submit">Eintragen</button>
            </form>
        </div>
    `;

    document.querySelector('main').appendChild(progressSection);
    initializeCharts();
}

// Sheet Music Viewer
function initializeSheetMusicViewer() {
    const sheetMusicSection = document.createElement('section');
    sheetMusicSection.id = 'sheet-music';
    sheetMusicSection.innerHTML = `
        <h2>Notenblätter</h2>
        <div class="sheet-music-viewer">
            <div class="controls">
                <button id="prev-page">Vorherige Seite</button>
                <button id="next-page">Nächste Seite</button>
                <button id="zoom-in">+</button>
                <button id="zoom-out">-</button>
            </div>
            <div class="score-container">
                <div id="osmd"></div>
            </div>
        </div>
    `;

    document.querySelector('main').appendChild(sheetMusicSection);
    initializeOSMD();
}

// Performance Recording
function initializeRecording() {
    const recordingSection = document.createElement('section');
    recordingSection.id = 'recording-studio';
    recordingSection.innerHTML = `
        <h2>Aufnahmestudio</h2>
        <div class="recording-controls">
            <button id="start-recording">Aufnahme starten</button>
            <button id="stop-recording" disabled>Aufnahme stoppen</button>
            <button id="play-recording" disabled>Wiedergabe</button>
            <div class="visualizer">
                <canvas id="audio-visualizer"></canvas>
            </div>
        </div>
        <div class="recordings-list">
            <h3>Meine Aufnahmen</h3>
            <ul id="recordings"></ul>
        </div>
    `;

    document.querySelector('main').appendChild(recordingSection);
    setupRecording();
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize new features after main website loads
    setTimeout(() => {
        initializeVirtualPiano();
        initializeLessonBooking();
        initializeProgressTracking();
        initializeSheetMusicViewer();
        initializeRecording();
    }, 2000);
});

// Helper functions for calendar
function initializeCalendar() {
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    updateCalendar();
    
    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
}

// Helper functions for charts
function initializeCharts() {
    // Implementation using Chart.js would go here
    console.log('Charts initialized');
}

// Helper functions for sheet music viewer
function initializeOSMD() {
    // Implementation using OpenSheetMusicDisplay would go here
    console.log('Sheet music viewer initialized');
}

// Helper functions for recording
function setupRecording() {
    let mediaRecorder;
    let audioChunks = [];
    
    document.getElementById('start-recording').addEventListener('click', async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            saveRecording(audioUrl);
        };
        
        mediaRecorder.start();
        updateRecordingUI(true);
    });
    
    document.getElementById('stop-recording').addEventListener('click', () => {
        mediaRecorder.stop();
        updateRecordingUI(false);
    });
}

function updateRecordingUI(isRecording) {
    document.getElementById('start-recording').disabled = isRecording;
    document.getElementById('stop-recording').disabled = !isRecording;
    document.getElementById('play-recording').disabled = isRecording;
}

function saveRecording(audioUrl) {
    const recordingsList = document.getElementById('recordings');
    const listItem = document.createElement('li');
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.controls = true;
    listItem.appendChild(audio);
    recordingsList.appendChild(listItem);
} 