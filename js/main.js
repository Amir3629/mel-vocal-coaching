// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.main-nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(26, 26, 26, 0.95)';
    } else {
        nav.style.background = 'rgba(26, 26, 26, 0.9)';
    }
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

// Background music control
const music = document.getElementById('background-music');
const musicButton = document.createElement('button');
musicButton.innerHTML = '<i class="fas fa-music"></i>';
musicButton.className = 'music-toggle';
document.body.appendChild(musicButton);

musicButton.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicButton.classList.add('playing');
    } else {
        music.pause();
        musicButton.classList.remove('playing');
    }
}); 