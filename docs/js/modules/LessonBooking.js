import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

export class LessonBooking {
    constructor(firebaseApp) {
        this.calendar = null;
        this.db = firebaseApp.firestore();
        this.auth = firebaseApp.auth();
        this.availableSlots = [];
        this.bookedLessons = [];
    }

    async initialize(container) {
        this.calendar = new Calendar(container, {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            slotMinTime: '09:00:00',
            slotMaxTime: '21:00:00',
            selectable: true,
            selectMirror: true,
            eventClick: (info) => this.handleEventClick(info),
            select: (info) => this.handleDateSelect(info),
            events: (info, successCallback) => this.loadEvents(info, successCallback)
        });

        this.calendar.render();
        await this.loadAvailableSlots();
        await this.loadBookedLessons();
    }

    async loadAvailableSlots() {
        try {
            const snapshot = await this.db.collection('availableSlots').get();
            this.availableSlots = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.calendar.refetchEvents();
        } catch (error) {
            console.error('Error loading available slots:', error);
        }
    }

    async loadBookedLessons() {
        try {
            const snapshot = await this.db.collection('bookedLessons').get();
            this.bookedLessons = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.calendar.refetchEvents();
        } catch (error) {
            console.error('Error loading booked lessons:', error);
        }
    }

    async handleDateSelect(selectInfo) {
        const start = selectInfo.start;
        const end = selectInfo.end;

        if (!this.auth.currentUser) {
            await Swal.fire({
                title: 'Login Required',
                text: 'Please log in to book a lesson',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Login'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Book Lesson',
            html: `
                <div class="booking-form">
                    <select id="lessonType" class="swal2-input">
                        <option value="vocal">Vocal Lesson</option>
                        <option value="piano">Piano Lesson</option>
                        <option value="theory">Music Theory</option>
                    </select>
                    <textarea id="notes" class="swal2-textarea" placeholder="Additional notes..."></textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Book',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return {
                    lessonType: document.getElementById('lessonType').value,
                    notes: document.getElementById('notes').value
                };
            }
        });

        if (result.isConfirmed) {
            try {
                await this.bookLesson({
                    start,
                    end,
                    userId: this.auth.currentUser.uid,
                    ...result.value
                });

                this.calendar.addEvent({
                    title: `${result.value.lessonType} Lesson`,
                    start,
                    end,
                    allDay: false
                });

                await Swal.fire(
                    'Booked!',
                    'Your lesson has been scheduled successfully.',
                    'success'
                );
            } catch (error) {
                console.error('Error booking lesson:', error);
                await Swal.fire(
                    'Error',
                    'There was an error booking your lesson. Please try again.',
                    'error'
                );
            }
        }
    }

    async handleEventClick(info) {
        const event = info.event;
        const lesson = this.bookedLessons.find(l => l.id === event.id);

        if (!lesson) return;

        if (lesson.userId === this.auth.currentUser?.uid) {
            const result = await Swal.fire({
                title: 'Lesson Details',
                html: `
                    <div>
                        <p><strong>Type:</strong> ${lesson.lessonType}</p>
                        <p><strong>Date:</strong> ${event.start.toLocaleString()}</p>
                        <p><strong>Notes:</strong> ${lesson.notes || 'No notes'}</p>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Cancel Lesson',
                cancelButtonText: 'Close'
            });

            if (result.isConfirmed) {
                await this.cancelLesson(lesson.id);
                event.remove();
                await Swal.fire(
                    'Cancelled',
                    'Your lesson has been cancelled.',
                    'success'
                );
            }
        }
    }

    async bookLesson(lessonData) {
        try {
            const docRef = await this.db.collection('bookedLessons').add({
                ...lessonData,
                createdAt: new Date(),
                status: 'booked'
            });
            this.bookedLessons.push({ id: docRef.id, ...lessonData });
        } catch (error) {
            console.error('Error booking lesson:', error);
            throw error;
        }
    }

    async cancelLesson(lessonId) {
        try {
            await this.db.collection('bookedLessons').doc(lessonId).delete();
            this.bookedLessons = this.bookedLessons.filter(l => l.id !== lessonId);
        } catch (error) {
            console.error('Error cancelling lesson:', error);
            throw error;
        }
    }

    loadEvents(info, successCallback) {
        const events = [
            ...this.availableSlots.map(slot => ({
                id: slot.id,
                title: 'Available',
                start: slot.start.toDate(),
                end: slot.end.toDate(),
                color: '#4CAF50'
            })),
            ...this.bookedLessons.map(lesson => ({
                id: lesson.id,
                title: `${lesson.lessonType} Lesson`,
                start: lesson.start.toDate(),
                end: lesson.end.toDate(),
                color: lesson.userId === this.auth.currentUser?.uid ? '#2196F3' : '#F44336'
            }))
        ];
        successCallback(events);
    }
} 