:root {
    --primary-color: #1a1a1a;
    --accent-color: #c4a661;
    --piano-white: #f5f5f5;
    --piano-black: #333;
    --text-color: #ffffff;
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Montserrat', sans-serif;
}

/* Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-body);
    background-color: var(--primary-color);
    color: var(--text-color);
    line-height: 1.6;
    overflow-x: hidden;
}

/* Piano Navigation */
.piano-nav {
    position: fixed;
    top: 0;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    background: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.7));
    z-index: 1000;
}

.white-key, .black-key {
    position: relative;
    height: 100%;
}

.white-key {
    width: 100px;
    background: var(--piano-white);
    border: 1px solid #ddd;
    transition: all 0.3s ease;
}

.black-key {
    width: 60px;
    background: var(--piano-black);
    margin: 0 -30px;
    z-index: 1;
    height: 60%;
}

.white-key a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--piano-black);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.white-key:hover {
    background: var(--accent-color);
}

/* Hero Section */
.hero {
    height: 100vh;
    position: relative;
    overflow: hidden;
}

.hero-video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.hero-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding-top: 40vh;
}

.hero h1 {
    font-family: var(--font-heading);
    font-size: 4rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* Buttons */
.cta-button {
    display: inline-block;
    padding: 1rem 2rem;
    border-radius: 30px;
    text-decoration: none;
    transition: all 0.3s ease;
    margin: 0.5rem;
}

.cta-button.primary {
    background: var(--accent-color);
    color: var(--text-color);
}

.cta-button.secondary {
    background: transparent;
    border: 2px solid var(--accent-color);
    color: var(--text-color);
}

.cta-button:hover {
    transform: scale(1.05);
}

/* Services Section */
.services {
    padding: 5rem 2rem;
}

.services h2 {
    text-align: center;
    font-family: var(--font-heading);
    font-size: 2.5rem;
    margin-bottom: 3rem;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.service-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.card-image {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.service-card:hover .card-image img {
    transform: scale(1.1);
}

.price-tag {
    position: absolute;
    top: 20px;
    right: -20px;
    background: var(--accent-color);
    padding: 0.5rem 1.5rem;
    transform: rotate(45deg);
}

.card-content {
    padding: 2rem;
}

/* About Section */
.about {
    background: linear-gradient(45deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7)),
                url('../assets/images/piano-bg.jpg') center/cover;
    padding: 5rem 2rem;
}

.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
}

.experience-highlights {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
}

.highlight {
    text-align: center;
}

.number {
    font-size: 3rem;
    color: var(--accent-color);
    font-family: var(--font-heading);
}

/* Gallery Section */
.gallery {
    padding: 5rem 2rem;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 2rem;
}

.gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.gallery-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
    opacity: 1;
}

.gallery-item:hover img {
    transform: scale(1.1);
}

/* Contact Section */
.contact {
    padding: 5rem 2rem;
    background: rgba(255,255,255,0.02);
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
}

.contact-form {
    display: grid;
    gap: 1rem;
}

.contact-form input,
.contact-form select,
.contact-form textarea {
    padding: 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    color: var(--text-color);
}

/* Piano Footer */
.piano-footer {
    height: 100px;
    background: linear-gradient(to bottom, var(--piano-black), var(--primary-color));
    position: relative;
    overflow: hidden;
}

.keys-animation {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: repeating-linear-gradient(
        90deg,
        var(--piano-white) 0,
        var(--piano-white) 40px,
        var(--piano-black) 40px,
        var(--piano-black) 60px
    );
    animation: slideKeys 20s linear infinite;
}

@keyframes slideKeys {
    from { transform: translateX(0); }
    to { transform:
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Piano Navigation Sound Effects
    const pianoKeys = document.querySelectorAll(".white-key, .black-key");
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G"];
    
    pianoKeys.forEach((key, index) => {
        const note = notes[index];
        const audio = new Audio(`https://awiclass.monoame.com/pianosound/${note}.mp3`);
        
        key.addEventListener("mouseenter", () => {
            audio.currentTime = 0;
            audio.play();
        });
    });

    // Background Music Control
    const musicToggle = document.querySelector(".music-toggle");
    const backgroundMusic = new Audio("assets/audio/jazz-background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    musicToggle.addEventListener("click", () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.classList.add("playing");
        } else {
            backgroundMusic.pause();
            musicToggle.classList.remove("playing");
        }
    });

    // Dynamic Gallery Loading
    const galleryGrid = document.querySelector(".gallery-grid");
    const images = [
        "piano-1.jpg",
        "performance-1.jpg",
        "studio-1.jpg",
        "workshop-1.jpg"
    ];

    images.forEach(image => {
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.innerHTML = `
            <img src="assets/images/${image}" alt="Gallery Image">
            <div class="gallery-overlay">
                <i class="fas fa-expand"></i>
            </div>
        `;
        galleryGrid.appendChild(div);
    });

    // Form Submission
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                // Add your form submission logic here
                alert("Thank you for your message! I will contact you soon.");
                contactForm.reset();
            } catch (error) {
                console.error("Error:", error);
                alert("There was an error sending your message. Please try again.");
            }
        });
    }

    // Scroll-based Animations
    window.addEventListener("scroll", () => {
        const nav = document.querySelector(".piano-nav");
        if (window.scrollY > 100) {
            nav.style.background = "rgba(0,0,0,0.95)";
        } else {
            nav.style.background = "rgba(0,0,0,0.7)";
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
