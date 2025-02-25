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

    // Add YouTube background music (autoplay)
    const musicContainer = document.createElement('div');
    musicContainer.style.display = 'none';
    musicContainer.innerHTML = `
        <iframe id="youtube-audio" 
                src="https://www.youtube.com/embed/AWsarzdZ1u8?autoplay=1&loop=1&playlist=AWsarzdZ1u8" 
                allow="autoplay" 
                style="display: none">
        </iframe>
    `;
    document.body.appendChild(musicContainer);

    // Initialize AOS animation library with smoother settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            easing: 'ease-in-out',
            once: false,
            mirror: true
        });
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

    // Background music control with better styling
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '<i class="fas fa-music"></i>';
    musicButton.className = 'music-toggle';
    musicButton.classList.add('playing'); // Start as playing
    document.body.appendChild(musicButton);

    musicButton.addEventListener('click', () => {
        const iframe = document.getElementById('youtube-audio');
        if (iframe.src.includes('autoplay=1')) {
            iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
            musicButton.classList.remove('playing');
        } else {
            iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
            musicButton.classList.add('playing');
        }
    });
});

// Simple testimonial slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function showNextTestimonial() {
    testimonials[currentTestimonial].style.display = 'none';
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].style.display = 'block';
}

// Change testimonial every 5 seconds
setInterval(showNextTestimonial, 5000);

// Form submission handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
}); 