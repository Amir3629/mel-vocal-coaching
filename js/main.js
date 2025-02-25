document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add YouTube background music with autoplay (muted initially)
    const musicContainer = document.createElement('div');
    musicContainer.style.display = 'none';
    musicContainer.innerHTML = `
        <iframe id="youtube-audio" 
                src="https://www.youtube.com/embed/AWsarzdZ1u8?autoplay=1&loop=1&playlist=AWsarzdZ1u8&mute=1" 
                allow="autoplay" 
                style="display: none">
        </iframe>
    `;
    document.body.appendChild(musicContainer);

    // Show unmute button immediately
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Start with muted icon
    musicButton.className = 'music-toggle';
    musicButton.title = "Click to play music";
    document.body.appendChild(musicButton);

    // Add pulsing animation to draw attention
    musicButton.classList.add('pulse-attention');
    
    // Background music control
    musicButton.addEventListener('click', () => {
        const iframe = document.getElementById('youtube-audio');
        
        if (iframe.src.includes('mute=1')) {
            // Unmute the audio
            iframe.src = iframe.src.replace('mute=1', 'mute=0');
            musicButton.innerHTML = '<i class="fas fa-music"></i>';
            musicButton.classList.add('playing');
            musicButton.classList.remove('pulse-attention');
            musicButton.title = "Music is playing";
        } else {
            // Mute the audio
            iframe.src = iframe.src.replace('mute=0', 'mute=1');
            musicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicButton.classList.remove('playing');
            musicButton.title = "Music is muted";
        }
    });

    // Initialize AOS animation library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            easing: 'ease-in-out',
            once: false,
            mirror: true
        });
    }

    // Create piano keys animation in footer
    const keysContainer = document.querySelector('.keys-animation');
    if (keysContainer) {
        for (let i = 0; i < 12; i++) {
            const key = document.createElement('div');
            key.className = i % 2 === 0 ? 'white-key' : 'black-key';
            key.style.animationDelay = `${i * 0.2}s`;
            keysContainer.appendChild(key);
        }
    }

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(26, 26, 26, 0.95)';
        } else {
            nav.style.background = 'rgba(26, 26, 26, 0.9)';
        }
    });
});

// Simple testimonial slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function showNextTestimonial() {
    if (testimonials.length <= 1) return;
    testimonials[currentTestimonial].style.display = 'none';
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].style.display = 'block';
}

// Change testimonial every 5 seconds
if (document.querySelectorAll('.testimonial').length > 1) {
    setInterval(showNextTestimonial, 5000);
}

// Form submission handling
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
}); 