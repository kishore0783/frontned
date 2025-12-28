import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RemoveCarPage.css';
import LogoutButton from './LogoutButton';

function RemoveCarPage() {
    const [cars, setCars] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedCar, setSelectedCar] = useState(null); // For zoom effect
    const [isZoomOut, setIsZoomOut] = useState(false); // For zoom out animation
    const [countdown, setCountdown] = useState(null); // Countdown for redirect
    const navigate = useNavigate();

    // Fetch existing cars from the backend
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:8080/cars');
                if (!response.ok) {
                    throw new Error('Failed to fetch cars');
                }
                const data = await response.json();
                setCars(data); // Store car data in state
            } catch (error) {
                setErrorMessage('Error fetching cars: ' + error.message);
            }
        };

        fetchCars();
    }, []);

    // Handle car removal
    const handleRemoveCar = async (carId) => {
        setSuccessMessage('');
        setErrorMessage('');
        setCountdown(3); // Start countdown for redirect
        try {
            const response = await fetch(`http://localhost:8080/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const message = await response.text(); // Retrieve success message
                setSuccessMessage(message); // Display success message
                setCars((prevCars) => prevCars.filter((car) => car.id !== carId)); // Remove car from UI
                setTimeout(() => navigate('/admin'), 3000); // Redirect to admin page after countdown
            } else {
                const errorText = await response.text();
                setErrorMessage(errorText || 'Failed to remove car');
            }
        } catch (error) {
            setErrorMessage('Error removing car: ' + error.message);
        }
    };

    // Cancel zoom or removal confirmation
    const handleCancel = () => {
        setIsZoomOut(true); // Trigger zoom out animation
        setTimeout(() => {
            setSelectedCar(null);
            setIsZoomOut(false); // Reset zoom-out state
        }, 300); // Match the animation duration
    };

    return (
        <div className="removepage-background">
            <LogoutButton />
            <div className="removepage-container">
                <h2 className="removepage-title">Remove a Car</h2>
                {successMessage && <p className="removepage-success-message">{successMessage}</p>}
                {errorMessage && <p className="removepage-error-message">{errorMessage}</p>}
                {cars.length === 0 && !errorMessage ? (
                    <p className="removepage-no-cars-message">No cars available for removal.</p>
                ) : (
                    <div className="removepage-car-grid">
                        {cars.map((car) => (
                            <div
                                key={car.id}
                                className="removepage-car-box"
                                onClick={() => setSelectedCar(car)}
                            >
                                <div className="removepage-car-details">
                                    <h3>{car.name}</h3>
                                    <p><strong>Brand:</strong> {car.carBrand}</p>
                                    <p><strong>Registration:</strong> {car.carRegistrationNumber}</p>
                                    <p><strong>Color:</strong> {car.carColor}</p>
                                    <p><strong>Type:</strong> {car.carType}</p>
                                </div>
                                <button className="removepage-remove-button">REMOVE</button>
                            </div>
                        ))}
                    </div>
                )}

                {selectedCar && (
                    <div className="removepage-zoomed-view">
                        <div
                            className={`removepage-zoomed-content ${
                                isZoomOut ? 'zoom-out' : 'zoom-in'
                            }`}
                        >
                            <h2>{selectedCar.name}</h2>
                            <p><strong>Brand:</strong> {selectedCar.carBrand}</p>
                            <p><strong>Registration:</strong> {selectedCar.carRegistrationNumber}</p>
                            <p><strong>Color:</strong> {selectedCar.carColor}</p>
                            <p><strong>Type:</strong> {selectedCar.carType}</p>
                            <div className="removepage-zoom-links">
                                <button
                                    className="removepage-back-button"
                                    onClick={handleCancel}
                                >
                                    Back to Car List
                                </button>
                                <button
                                    className="removepage-remove-confirm-button"
                                    onClick={() => handleRemoveCar(selectedCar.id)}
                                >
                                    Confirm Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {countdown !== null && (
                    <div className="removepage-countdown-dialog">
                        <div className="removepage-dialog-content">
                            <p>Redirecting in {countdown}...</p>
                        </div>
                    </div>
                )}

                <div className="removepage-back-to-admin">
                    <Link to="/admin" className="removepage-back-link">
                        Back to Admin Page
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RemoveCarPage;
