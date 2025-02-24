// Smooth scrolling
... (full JavaScript content) ...

// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Piano Navigation Sound Effects
    const pianoKeys = document.querySelectorAll('.white-key, .black-key');
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'];
    
    pianoKeys.forEach((key, index) => {
        const note = notes[index];
        const audio = new Audio(`https://awiclass.monoame.com/pianosound/${note}.mp3`);
        
        key.addEventListener('mouseenter', () => {
            audio.currentTime = 0;
            audio.play();
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Background Music Control
    const musicToggle = document.querySelector('.music-toggle');
    const backgroundMusic = new Audio('https://example.com/path/to/jazz-background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    musicToggle?.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.classList.add('playing');
        } else {
            backgroundMusic.pause();
            musicToggle.classList.remove('playing');
        }
    });

    // Dynamic Gallery Loading
    const galleryGrid = document.querySelector('.gallery-grid');
    const images = [
        'piano-1.jpg',
        'performance-1.jpg',
        'studio-1.jpg',
        'workshop-1.jpg'
    ];

    images.forEach(image => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="assets/images/${image}" alt="Gallery Image">
            <div class="gallery-overlay">
                <i class="fas fa-expand"></i>
            </div>
        `;
        galleryGrid.appendChild(div);
    });

    // Form Submission
    const contactForm = document.querySelector('.contact-form');
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            alert('Thank you for your message! I will contact you soon.');
            contactForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again.');
        }
    });

    // Scroll-based Animations
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.piano-nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(0,0,0,0.95)';
        } else {
            nav.style.background = 'rgba(0,0,0,0.7)';
        }
    });
});

// Form handling
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your booking request! I will contact you soon.');
    });
}
