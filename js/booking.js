document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("bookingForm");
    const bookingButtons = document.querySelectorAll(".book-now");

    // Dynamic form generation
    function generateForm(type) {
        return `
            <h3>${type.charAt(0).toUpperCase() + type.slice(1)} Lesson Booking</h3>
            <div class="form-grid">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <input type="tel" placeholder="Phone Number" required>
                <select name="experience" required>
                    <option value="">Your Experience Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                <input type="date" required>
                <select name="time" required>
                    <option value="">Preferred Time</option>
                    <option value="morning">Morning (9-12)</option>
                    <option value="afternoon">Afternoon (12-5)</option>
                    <option value="evening">Evening (5-8)</option>
                </select>
                <textarea placeholder="Additional Notes"></textarea>
            </div>
            <button type="submit" class="submit-btn">Confirm Booking</button>
        `;
    }

    // Handle booking button clicks
    bookingButtons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.type;
            bookingForm.innerHTML = generateForm(type);
            bookingForm.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Form submission
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            // Add your booking submission logic here
            alert("Booking request received! We will confirm your slot soon.");
            bookingForm.reset();
        } catch (error) {
            console.error("Booking error:", error);
            alert("There was an error processing your booking. Please try again.");
        }
    });
});
