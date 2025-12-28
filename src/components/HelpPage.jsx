import React from 'react';
import './HelpPage.css';

function HelpPage() {
    return (
        <div className="help-container">
            <h1>Help & Support</h1>
            <p>If you have any issues or questions, we're here to help!</p>
            <div className="help-sections">
                <div className="help-section">
                    <h3>FAQs</h3>
                    <p>Find answers to commonly asked questions.</p>
                </div>
                <div className="help-section">
                    <h3>Contact Us</h3>
                    <p>Email: support@company.com</p>
                    <p>Phone: +123-456-7890</p>
                </div>
                <div className="help-section">
                    <h3>Live Chat</h3>
                    <p>Chat with a support representative in real time.</p>
                </div>
            </div>
            <button className="back-button" onClick={() => window.history.back()}>
                Back to Previous Page
            </button>
        </div>
    );
}

export default HelpPage;
