// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation
    showLoadingAnimation();
    
    // Initialize all components after loading
    setTimeout(() => {
        hideLoadingAnimation();
        initializeWebsite();
    }, 1500);
});

// Loading animation
function showLoadingAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    
    const animation = document.createElement('div');
    animation.className = 'loading-animation';
    
    // Create loading bars
    for (let i = 0; i < 4; i++) {
        const bar = document.createElement('div');
        bar.className = 'loading-bar';
        bar.style.animationDelay = `${i * 0.2}s`;
        animation.appendChild(bar);
    }
    
    overlay.appendChild(animation);
    document.body.appendChild(overlay);
}

function hideLoadingAnimation() {
    const overlay = document.querySelector('.loading-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
}

function initializeWebsite() {
    // Initialize all components
    initializeAnimations();
    initializeForms();
    initializeNavigation();
    initializeMusic();
    initializeTestimonials();
    initializePianoKeys();
    
    // Add scroll animations
    initializeScrollAnimations();
}

// Animation initialization
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => observer.observe(element));
}

// Scroll animations
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Form initialization and validation
function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                // Show loading state
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showMessage('Vielen Dank für Ihre Nachricht!', 'success');
                form.reset();
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        });
    });
}

// Input validation
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Dieses Feld ist erforderlich';
    } else if (input.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        }
    } else if (input.type === 'tel' && value) {
        const phonePattern = /^[\d\s+()-]+$/;
        if (!phonePattern.test(value)) {
            isValid = false;
            errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein';
        }
    }

    if (!isValid) {
        showInputError(input, errorMessage);
        input.classList.add('invalid');
    } else {
        removeInputError(input);
        input.classList.remove('invalid');
        input.classList.add('valid');
    }

    return isValid;
}

// Navigation initialization
function initializeNavigation() {
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Hide/show navigation on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add background when scrolling
        if (currentScroll > 50) {
            nav.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
        } else {
            nav.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
        }
        
        // Hide/show navigation
        if (currentScroll <= 0) {
            nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
}

// Music player initialization
function initializeMusic() {
    const musicButton = document.createElement('button');
    musicButton.className = 'music-toggle';
    musicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    musicButton.title = 'Background Music';
    document.body.appendChild(musicButton);
    
    let isPlaying = false;
    const audio = new Audio('assets/background-music.mp3');
    audio.loop = true;
    
    musicButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicButton.classList.remove('playing');
        } else {
            audio.play();
            musicButton.innerHTML = '<i class="fas fa-music"></i>';
            musicButton.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

// Piano keys animation
function initializePianoKeys() {
    const footer = document.querySelector('footer');
    const keysContainer = document.createElement('div');
    keysContainer.className = 'keys-animation';
    
    for (let i = 0; i < 12; i++) {
        const key = document.createElement('div');
        key.className = i % 2 === 0 ? 'white-key' : 'black-key';
        key.style.animationDelay = `${i * 0.1}s`;
        keysContainer.appendChild(key);
    }
    
    footer.insertBefore(keysContainer, footer.firstChild);
}

// Testimonials carousel
function initializeTestimonials() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const testimonials = carousel.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((card, i) => {
            const offset = (i - index) * 120;
            card.style.transform = `translateX(${offset}%)`;
            card.style.opacity = i === index ? '1' : '0.3';
        });
    }
    
    // Show first testimonial
    showTestimonial(0);
    
    // Add navigation buttons
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.className = 'carousel-nav prev';
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.className = 'carousel-nav next';
    
    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);
    
    // Navigation handlers
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    });
    
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}

// Utility functions
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '5px',
        backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
        color: 'white',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

function showInputError(input, message) {
    removeInputError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    Object.assign(errorDiv.style, {
        color: '#ff4444',
        fontSize: '0.8em',
        marginTop: '5px',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'all 0.3s ease'
    });
    
    input.parentNode.appendChild(errorDiv);
    
    // Animate in
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 10);
}

function removeInputError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
} 