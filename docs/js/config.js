// Firebase configuration
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Application settings
export const appSettings = {
    defaultLocale: 'de',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    lessonDuration: 60, // minutes
    maxLessonsPerDay: 8,
    workingHours: {
        start: 9, // 9 AM
        end: 21  // 9 PM
    },
    audioSettings: {
        sampleRate: 44100,
        channels: 1,
        format: 'audio/wav'
    },
    pianoSettings: {
        startOctave: 4,
        numOctaves: 2,
        defaultVolume: 0.7
    },
    progressTracking: {
        minPracticeTime: 5, // minutes
        maxPracticeTime: 240, // minutes
        metrics: [
            'pitchAccuracy',
            'rhythmAccuracy',
            'breathControl',
            'songsMastered'
        ]
    },
    sheetMusic: {
        defaultZoom: 1.0,
        maxZoom: 2.0,
        minZoom: 0.5
    }
};

// API endpoints
export const apiEndpoints = {
    sheetMusic: '/api/sheet-music',
    recordings: '/api/recordings',
    lessons: '/api/lessons',
    progress: '/api/progress'
};

// Cache settings
export const cacheSettings = {
    sheetMusic: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxSize: 100 * 1024 * 1024 // 100 MB
    },
    recordings: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxSize: 500 * 1024 * 1024 // 500 MB
    }
};

// Error messages
export const errorMessages = {
    auth: {
        invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        weakPassword: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
        emailInUse: 'Diese E-Mail-Adresse wird bereits verwendet.',
        wrongPassword: 'Falsches Passwort.',
        userNotFound: 'Benutzer nicht gefunden.'
    },
    booking: {
        slotUnavailable: 'Dieser Termin ist nicht mehr verfügbar.',
        pastDate: 'Termine in der Vergangenheit können nicht gebucht werden.',
        tooManyLessons: 'Sie haben die maximale Anzahl an Buchungen erreicht.'
    },
    recording: {
        noMicrophone: 'Kein Mikrofon gefunden.',
        recordingFailed: 'Aufnahme fehlgeschlagen.',
        saveFailed: 'Speichern der Aufnahme fehlgeschlagen.'
    },
    progress: {
        invalidData: 'Ungültige Übungsdaten.',
        saveFailed: 'Speichern des Fortschritts fehlgeschlagen.'
    }
};

// Success messages
export const successMessages = {
    auth: {
        registered: 'Registrierung erfolgreich.',
        loggedIn: 'Anmeldung erfolgreich.',
        passwordReset: 'Passwort-Reset-E-Mail wurde gesendet.'
    },
    booking: {
        confirmed: 'Ihre Buchung wurde bestätigt.',
        cancelled: 'Ihre Buchung wurde storniert.'
    },
    recording: {
        saved: 'Aufnahme wurde gespeichert.',
        deleted: 'Aufnahme wurde gelöscht.'
    },
    progress: {
        saved: 'Fortschritt wurde gespeichert.',
        updated: 'Fortschritt wurde aktualisiert.'
    }
}; 