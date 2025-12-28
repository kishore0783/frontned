import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarPage.css';
import LogoutButton from './LogoutButton';

function CarPage() {
    const [cars, setCars] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [carStatus, setCarStatus] = useState({});
    const [wishlist, setWishlist] = useState([]);
    const customerId = localStorage.getItem('customerId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const customerResponse = await fetch(`http://localhost:8080/customer/profilebyid?id=${customerId}`);
                if (!customerResponse.ok) throw new Error('Failed to fetch customer details');
                const customerData = await customerResponse.json();
                setCustomer(customerData);

                const carResponse = await fetch('http://localhost:8080/cars');
                if (!carResponse.ok) throw new Error('Failed to fetch car details');
                const carData = await carResponse.json();

                const statusPromises = carData.map(async (car) => {
                    const rentalResponse = await fetch(`http://localhost:8080/rentals/check-active?carId=${car.id}`);
                    if (rentalResponse.ok) {
                        const rentalStatus = await rentalResponse.json();
                        return { carId: car.id, isBooked: rentalStatus.booked };
                    }
                    return { carId: car.id, isBooked: false };
                });

                const statusResults = await Promise.all(statusPromises);
                const statusMap = statusResults.reduce((acc, { carId, isBooked }) => {
                    acc[carId] = isBooked;
                    return acc;
                }, {});
                setCarStatus(statusMap);
                setCars(carData);

                // Fetch wishlist
                const wishlistResponse = await fetch(`http://localhost:8080/wishlist?customerId=${customerId}`);
                if (wishlistResponse.ok) {
                    setWishlist(await wishlistResponse.json());
                }
            } catch (err) {
                setError(err.message);
            }
        };

        if (customerId) fetchDetails();
        else setError('Customer ID not found in localStorage');
    }, [customerId]);

    const fetchCarPicture = (carId) => {
        return `http://localhost:8080/cars/${carId}/picture`;
    };

    const handleAddToWishlist = async (car) => {
        try {
            const response = await fetch('http://localhost:8080/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId, carId: car.id }),
            });

            if (response.ok) {
                setWishlist((prev) => [...prev, car]);
            } else {
                throw new Error('Failed to add to wishlist');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const isCarInWishlist = (carId) => wishlist.some((car) => car.id === carId);

    return (
        <div className="carpage-background">
            <LogoutButton />
            <div className="carpage-container">
                {error ? (
                    <p className="carpage-error-message">Error: {error}</p>
                ) : (
                    <>
                        {customer && <h2 className="carpage-title">Welcome, {customer.name}!</h2>}
                        <h3 className="carpage-subtitle">Click on a car to see details:</h3>
                        <div className="carpage-grid">
                            {cars.map((car) => (
                                <div
                                    key={car.id}
                                    className={`carpage-box ${carStatus[car.id] ? 'booked' : ''}`}
                                    onClick={() => !carStatus[car.id] && setSelectedCar(car)}
                                >
                                    <img
                                        src={fetchCarPicture(car.id)}
                                        alt="Car"
                                        className="carpage-image"
                                        onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                                    />
                                    <h3 className="carpage-box-title">{car.name}</h3>
                                    <p><strong>Brand:</strong> {car.carBrand}</p>
                                    <p><strong>Registration:</strong> {car.carRegistrationNumber}</p>
                                    <p><strong>Color:</strong> {car.carColor}</p>
                                    <p><strong>Type:</strong> {car.carType}</p>
                                    <div
                                        className={`wishlist-icon ${isCarInWishlist(car.id) ? 'wishlist-added' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering car details
                                            handleAddToWishlist(car);
                                        }}
                                    >
                                        {isCarInWishlist(car.id) ? '❤️' : '🤍'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <button
                    className="back-to-customer-button"
                    onClick={() => navigate('/customer')}
                >
                    Back to Customer Page
                </button>
            </div>

            {selectedCar && (
                <div className="carpage-zoomed-view">
                    <div className="carpage-zoomed-content">
                        <img
                            src={fetchCarPicture(selectedCar.id)}
                            alt="Car"
                            className="zoomed-car-image"
                            onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                        />
                        <h2>{selectedCar.name}</h2>
                        <p><strong>Brand:</strong> {selectedCar.carBrand}</p>
                        <p><strong>Registration:</strong> {selectedCar.carRegistrationNumber}</p>
                        <p><strong>Color:</strong> {selectedCar.carColor}</p>
                        <p><strong>Type:</strong> {selectedCar.carType}</p>
                        <div className="carpage-zoom-links">
                            <button className="back-button" onClick={() => setSelectedCar(null)}>
                                Back to Car List
                            </button>
                            <button
                                onClick={() => {
                                    if (carStatus[selectedCar.id]) {
                                        alert('This car is already booked!');
                                    } else {
                                        navigate('/advance-payment', { state: selectedCar });
                                    }
                                }}
                                className="proceed-button"
                                disabled={carStatus[selectedCar.id]}
                            >
                                {carStatus[selectedCar.id] ? 'Already Booked' : 'Proceed with this Car'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarPage;
