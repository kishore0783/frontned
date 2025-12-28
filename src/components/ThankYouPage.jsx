import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti'; // Import the confetti function
import './ThankYouPage.css';

function ThankYouPage() {
    const navigate = useNavigate();
    const customerName = localStorage.getItem('customerName') || 'Valued Customer';

    // Confetti effect
    useEffect(() => {
        const confettiScript = document.createElement('script');
        confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.min.js';
        confettiScript.onload = () => {
            const duration = 5 * 1000; // 5 seconds
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        };
        document.body.appendChild(confettiScript);
        return () => document.body.removeChild(confettiScript);
    }, []);

    const handleBackToHome = () => {
        navigate('/customer');
    };

    return (
        <div className="thankyoupage-background">
            <div className="thankyoupage-container">
                <h1 className="thankyoupage-title">Thank You, {customerName}!</h1>
                <p className="thankyoupage-message">
                    Your rental has been successfully booked. We hope you enjoy your journey!
                </p>
                <div className="thankyoupage-illustration">
                    <img 
                        src="https://via.placeholder.com/300x200" 
                        alt="Celebration Illustration" 
                        className="thankyoupage-image"
                    />
                </div>
                <div className="thankyoupage-encouragement">
                    <p>"Enjoy every mile, and let your adventures create memories!"</p>
                </div>
                <button className="thankyoupage-button" onClick={handleBackToHome}>
                    Back to Home
                </button>
            </div>
            <footer className="thankyoupage-footer">
                <p>Need help? Contact us at <a href="mailto:support@rentalservice.com">support@rentalservice.com</a></p>
            </footer>
        </div>
    );
}

export default ThankYouPage;
