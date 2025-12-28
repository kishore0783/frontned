import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdvancePaymentPage.css';
import LogoutButton from './LogoutButton';
import axios from 'axios';

function AdvancePaymentPage() {
    const { state } = useLocation(); // Fetch data from navigation state
    const [licenseNumber, setLicenseNumber] = useState('');
    const securityAmount = 50;
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [quote, setQuote] = useState('Your journey begins here!');
    const [carDetails, setCarDetails] = useState(state || null); // Use state if available
    const navigate = useNavigate();
    const customerId = localStorage.getItem('customerId');
    const carId = state?.id || localStorage.getItem('carId'); // Use state ID first

    useEffect(() => {
        // Fetch car details if not passed via navigation state
        if (!carDetails && carId) {
            axios.get(`http://localhost:8080/cars/${carId}`)
                .then((response) => setCarDetails(response.data))
                .catch((error) => console.error('Error fetching car details:', error));
        }
    }, [carDetails, carId]);

    const handlePayment = async () => {
        if (!licenseNumber) {
            alert('Please enter your license number.');
            return;
        }

        setIsProcessing(true);

        try {
            const payload = {
                customerId: parseInt(customerId),
                carId: parseInt(carId),
                amount: securityAmount,
                method: paymentMethod,
                licenseNumber: licenseNumber.trim(),
            };

            console.log('Sending Payload:', payload);

            // Simulate server request
            await axios.post('http://localhost:8080/payments', payload);

            console.log('Payment successful');

            // Forward all required data to RentalPage
            navigate('/rental', {
                state: {
                    carDetails,
                    customerId,
                    paymentData: {
                        licenseNumber,
                        amount: securityAmount,
                        method: paymentMethod,
                    },
                },
            });
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="advancepayment-background">
            <LogoutButton />
            <div className="advancepayment-container">
                <h2 className="advancepayment-title">Advance Payment</h2>
                <p className="advancepayment-quote">{quote}</p>

                {carDetails && (
                    <div className="car-details">
                        <h3>Car Details:</h3>
                        <p><strong>Name:</strong> {carDetails.name}</p>
                        <p><strong>Brand:</strong> {carDetails.carBrand}</p>
                        <p><strong>Price Per hour</strong> ₹{carDetails.hourlyRate}</p>
                    </div>
                )}

                <div className="advancepayment-details">
                    <label htmlFor="license-number" className="advancepayment-label">License Number:</label>
                    <input
                        type="text"
                        id="license-number"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="advancepayment-input"
                        placeholder="Enter your license number"
                    />
                </div>

                <div className="advancepayment-method">
                    <label htmlFor="payment-method">Payment Method:</label>
                    <select
                        id="payment-method"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="advancepayment-input"
                    >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>

                <button
                    className="advancepayment-button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
            </div>
        </div>
    );
}

export default AdvancePaymentPage;
