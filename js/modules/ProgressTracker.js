import Chart from 'chart.js/auto';
import moment from 'moment';

export class ProgressTracker {
    constructor(firebaseApp) {
        this.db = firebaseApp.firestore();
        this.auth = firebaseApp.auth();
        this.charts = {};
        this.progressData = [];
    }

    async initialize(container) {
        this.container = container;
        await this.loadProgressData();
        this.createProgressDashboard();
    }

    async loadProgressData() {
        try {
            const userId = this.auth.currentUser?.uid;
            if (!userId) return;

            const snapshot = await this.db.collection('studentProgress')
                .where('userId', '==', userId)
                .orderBy('date', 'asc')
                .get();

            this.progressData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading progress data:', error);
        }
    }

    createProgressDashboard() {
        this.container.innerHTML = `
            <div class="progress-dashboard">
                <div class="progress-header">
                    <h2>Your Progress Dashboard</h2>
                    <button id="addProgressBtn" class="btn-primary">Add Progress Entry</button>
                </div>
                <div class="progress-charts">
                    <div class="chart-container">
                        <canvas id="pitchAccuracyChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="breathControlChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="rhythmAccuracyChart"></canvas>
                    </div>
                </div>
                <div class="progress-metrics">
                    <div class="metric-card">
                        <h3>Practice Time</h3>
                        <div id="practiceTimeMetric"></div>
                    </div>
                    <div class="metric-card">
                        <h3>Songs Mastered</h3>
                        <div id="songsMasteredMetric"></div>
                    </div>
                    <div class="metric-card">
                        <h3>Overall Progress</h3>
                        <div id="overallProgressMetric"></div>
                    </div>
                </div>
                <div class="progress-history">
                    <h3>Recent Progress</h3>
                    <div id="progressHistory"></div>
                </div>
            </div>
        `;

        this.initializeCharts();
        this.updateMetrics();
        this.displayProgressHistory();
        this.setupEventListeners();
    }

    initializeCharts() {
        const dateLabels = this.progressData.map(entry => 
            moment(entry.date.toDate()).format('MMM D')
        );

        this.charts.pitchAccuracy = new Chart(
            document.getElementById('pitchAccuracyChart'),
            {
                type: 'line',
                data: {
                    labels: dateLabels,
                    datasets: [{
                        label: 'Pitch Accuracy',
                        data: this.progressData.map(entry => entry.pitchAccuracy),
                        borderColor: '#2196F3',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            }
        );

        this.charts.breathControl = new Chart(
            document.getElementById('breathControlChart'),
            {
                type: 'line',
                data: {
                    labels: dateLabels,
                    datasets: [{
                        label: 'Breath Control',
                        data: this.progressData.map(entry => entry.breathControl),
                        borderColor: '#4CAF50',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            }
        );

        this.charts.rhythmAccuracy = new Chart(
            document.getElementById('rhythmAccuracyChart'),
            {
                type: 'line',
                data: {
                    labels: dateLabels,
                    datasets: [{
                        label: 'Rhythm Accuracy',
                        data: this.progressData.map(entry => entry.rhythmAccuracy),
                        borderColor: '#FF9800',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            }
        );
    }

    updateMetrics() {
        if (this.progressData.length === 0) return;

        const latestEntry = this.progressData[this.progressData.length - 1];
        const totalPracticeTime = this.progressData.reduce((sum, entry) => 
            sum + entry.practiceMinutes, 0
        );

        document.getElementById('practiceTimeMetric').textContent = 
            `${Math.round(totalPracticeTime / 60)} hours`;
        
        document.getElementById('songsMasteredMetric').textContent = 
            latestEntry.songsMastered || '0';

        const overallProgress = Math.round(
            (latestEntry.pitchAccuracy + 
             latestEntry.breathControl + 
             latestEntry.rhythmAccuracy) / 3
        );
        document.getElementById('overallProgressMetric').textContent = 
            `${overallProgress}%`;
    }

    displayProgressHistory() {
        const historyContainer = document.getElementById('progressHistory');
        const recentEntries = this.progressData.slice(-5).reverse();

        historyContainer.innerHTML = recentEntries.map(entry => `
            <div class="progress-entry">
                <div class="entry-date">
                    ${moment(entry.date.toDate()).format('MMM D, YYYY')}
                </div>
                <div class="entry-details">
                    <p><strong>Notes:</strong> ${entry.notes || 'No notes'}</p>
                    <p><strong>Practice Time:</strong> ${entry.practiceMinutes} minutes</p>
                    <div class="entry-metrics">
                        <span>Pitch: ${entry.pitchAccuracy}%</span>
                        <span>Breath: ${entry.breathControl}%</span>
                        <span>Rhythm: ${entry.rhythmAccuracy}%</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        document.getElementById('addProgressBtn').addEventListener('click', 
            () => this.showAddProgressForm()
        );
    }

    async showAddProgressForm() {
        const { value: formData } = await Swal.fire({
            title: 'Add Progress Entry',
            html: `
                <div class="progress-form">
                    <input type="number" id="practiceMinutes" class="swal2-input" placeholder="Practice time (minutes)">
                    <input type="number" id="pitchAccuracy" class="swal2-input" placeholder="Pitch accuracy (0-100)">
                    <input type="number" id="breathControl" class="swal2-input" placeholder="Breath control (0-100)">
                    <input type="number" id="rhythmAccuracy" class="swal2-input" placeholder="Rhythm accuracy (0-100)">
                    <input type="number" id="songsMastered" class="swal2-input" placeholder="Songs mastered">
                    <textarea id="notes" class="swal2-textarea" placeholder="Notes about today's practice..."></textarea>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
            preConfirm: () => {
                return {
                    practiceMinutes: parseInt(document.getElementById('practiceMinutes').value),
                    pitchAccuracy: parseInt(document.getElementById('pitchAccuracy').value),
                    breathControl: parseInt(document.getElementById('breathControl').value),
                    rhythmAccuracy: parseInt(document.getElementById('rhythmAccuracy').value),
                    songsMastered: parseInt(document.getElementById('songsMastered').value),
                    notes: document.getElementById('notes').value,
                    date: new Date(),
                    userId: this.auth.currentUser.uid
                };
            }
        });

        if (formData) {
            try {
                await this.addProgressEntry(formData);
                await this.loadProgressData();
                this.updateCharts();
                this.updateMetrics();
                this.displayProgressHistory();

                await Swal.fire(
                    'Saved!',
                    'Your progress has been recorded.',
                    'success'
                );
            } catch (error) {
                console.error('Error saving progress:', error);
                await Swal.fire(
                    'Error',
                    'There was an error saving your progress. Please try again.',
                    'error'
                );
            }
        }
    }

    async addProgressEntry(data) {
        try {
            await this.db.collection('studentProgress').add(data);
            this.progressData.push(data);
        } catch (error) {
            console.error('Error adding progress entry:', error);
            throw error;
        }
    }

    updateCharts() {
        const dateLabels = this.progressData.map(entry => 
            moment(entry.date.toDate()).format('MMM D')
        );

        Object.values(this.charts).forEach(chart => {
            chart.data.labels = dateLabels;
            chart.update();
        });

        this.charts.pitchAccuracy.data.datasets[0].data = 
            this.progressData.map(entry => entry.pitchAccuracy);
        this.charts.breathControl.data.datasets[0].data = 
            this.progressData.map(entry => entry.breathControl);
        this.charts.rhythmAccuracy.data.datasets[0].data = 
            this.progressData.map(entry => entry.rhythmAccuracy);

        Object.values(this.charts).forEach(chart => chart.update());
    }
} 