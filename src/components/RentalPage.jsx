import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RentalPage.css';
import LogoutButton from './LogoutButton';
import axios from 'axios';

function RentalPage() {
    const navigate = useNavigate();
    const { state } = useLocation(); // Retrieve state passed from AdvancePaymentPage

    // State Variables
    const [carDetails, setCarDetails] = useState(state?.carDetails || null);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [quote, setQuote] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic quotes
    const quotes = [
        "Life is a journey, enjoy the ride.",
        "The best way to explore is on the road.",
        "Drive safe, drive happy!",
        "Adventure awaits!",
        "Cars bring freedom, explore the world!",
    ];

    // Fetch data when component mounts
    useEffect(() => {
        const currentDateTime = new Date().toISOString().slice(0, 16);
        setStartTime(currentDateTime);

        // Rotate Quotes
        const quoteInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setQuote(quotes[randomIndex]);
        }, 3000);

        // Fetch customer details only if passed
        const fetchCustomerDetails = async () => {
            try {
                if (!state || !state.customerId) {
                    throw new Error('Missing customer ID.');
                }
                const response = await axios.get(`http://localhost:8080/customer/profilebyid?id=${state.customerId}`);
                setCustomerDetails(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCustomerDetails();
        return () => clearInterval(quoteInterval);
    }, [state]);

    const handleConfirmRental = async () => {
        try {
            if (!state || !state.paymentData) {
                alert('Required rental details are missing.');
                return;
            }

            const { licenseNumber } = state.paymentData;

            // Post rental data
            await axios.post('http://localhost:8080/rentals', {
                carId: carDetails.id,
                customerId: state.customerId,
                licenseNumber,
                startTime,
            });

            alert('Rental confirmed successfully!');
            navigate('/thank-you');
        } catch (error) {
            console.error('Rental confirmation failed:', error);
            alert('Failed to confirm rental. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="rentalpage-background">
            <LogoutButton />
            <div className="rentalpage-container">
                {error ? (
                    <p className="rentalpage-error-message">Error: {error}</p>
                ) : (
                    <>
                        {customerDetails && (
                            <h2 className="rentalpage-title">Welcome, {customerDetails.name}!</h2>
                        )}
                        <div className="rentalpage-quote">
                            <p>{quote}</p>
                        </div>
                        {carDetails && (
                            <div className="rentalpage-car-details">
                                <div className="rentalpage-car-text">
                                    <p><strong>Car Name:</strong> {carDetails.name}</p>
                                    <p><strong>Brand:</strong> {carDetails.carBrand}</p>
                                    <p><strong>Registration:</strong> {carDetails.carRegistrationNumber}</p>
                                    <p><strong>Color:</strong> {carDetails.carColor}</p>
                                    <p><strong>Type:</strong> {carDetails.carType}</p>
                                    <p><strong>Hourly Rate:</strong> ${carDetails.hourlyRate}</p>
                                    <p><strong>License Number:</strong> {state.paymentData.licenseNumber}</p>
                                    <p><strong>Amount:</strong> ${state.paymentData.amount}</p>
                                    <p><strong>Payment Method:</strong> {state.paymentData.method}</p>
                                </div>
                                <img
                                    src="https://via.placeholder.com/300x200" // Placeholder for car image
                                    alt={carDetails.name}
                                    className="rentalpage-car-image"
                                />
                            </div>
                        )}
                        <div className="rentalpage-funfacts">
                            <h3>Fun Fact</h3>
                            <p>Did you know? The first speeding ticket was issued in 1902!</p>
                        </div>
                        <button className="rentalpage-button" onClick={handleConfirmRental}>
                            Confirm Rental
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default RentalPage;
