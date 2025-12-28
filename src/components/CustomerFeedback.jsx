import React, { useState } from "react";
import "./CustomerFeedback.css"; // Create and link a CSS file for styling

function CustomerFeedback() {
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);
    const [feedbackError, setFeedbackError] = useState(false);

    const sendFeedback = (e) => {
        e.preventDefault();

        if (!customerName || !email || !feedback) {
            alert("All fields are required!");
            return;
        }

        emailjs
            .send(
                "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
                "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
                {
                    from_name: customerName,
                    reply_to: email,
                    message: feedback,
                },
                "YOUR_USER_ID" // Replace with your EmailJS user ID
            )
            .then(
                (result) => {
                    console.log("Feedback sent:", result.text);
                    setFeedbackSuccess(true);
                    setFeedbackError(false);
                    setCustomerName("");
                    setEmail("");
                    setFeedback("");
                },
                (error) => {
                    console.error("Error sending feedback:", error.text);
                    setFeedbackError(true);
                    setFeedbackSuccess(false);
                }
            );
    };

    return (
        <div className="customer-feedback">
            <h3>We Value Your Feedback</h3>
            <form onSubmit={sendFeedback} className="feedback-form">
                <label>
                    Name:
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your Name"
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email"
                        required
                    />
                </label>
                <label>
                    Feedback:
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Your Feedback"
                        required
                    ></textarea>
                </label>
                <button type="submit" className="feedback-button">
                    Send Feedback
                </button>
            </form>
            {feedbackSuccess && <p className="success-message">Thank you for your feedback!</p>}
            {feedbackError && <p className="error-message">Failed to send feedback. Please try again.</p>}
        </div>
    );
}

export default CustomerFeedback;
