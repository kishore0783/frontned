import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import CityDropdown from './components/CityDropdown';

function MainPage() {
    const navigate = useNavigate();
    const [searchLocation, setSearchLocation] = useState('');
    const [localInfo, setLocalInfo] = useState(null);
    const [error, setError] = useState(null);
    const [cities, setCities] = useState([]); // Holds all cities
    const [filteredCities, setFilteredCities] = useState([]); // Holds filtered cities
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleLogin = () => {
        navigate('/login'); // Redirect to the login page
    };

    const handleSearch = async () => {
        if (!searchLocation.trim()) {
            alert('Please enter a location!');
            return;
        }

        // Fetch local guidance (using an API, e.g., OpenWeatherMap for demonstration)
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&appid=YOUR_API_KEY`
            );
            if (!response.ok) throw new Error('Failed to fetch local information');
            const data = await response.json();
            setLocalInfo(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setLocalInfo(null);
        }
    };

    const handleInputChange = (e) => {
        const input = e.target.value;
        setSearchLocation(input);

        // Filter the cities based on user input
        if (input.trim() === "") {
            setFilteredCities(cities);
        } else {
            setFilteredCities(
                cities.filter((city) =>
                    city.cityName.toLowerCase().includes(input.toLowerCase())
                )
            );
        }

        // Show the dropdown if there's input
        setDropdownVisible(input.trim() !== "");
    };

    const handleCitySelect = (cityName) => {
        setSearchLocation(cityName); // Set selected city
        setDropdownVisible(false); // Close the dropdown
    };

    return (
        <div className="mainpage-container">
            {/* Header */}
            <header className="header">
                <div className="logo">G N</div>
                <nav className="navigation">
                    <a href="#features">Features</a>
                    <a href="#about">About Us</a>
                    <a href="#help">Help</a>
                    <a href="#contact">Contact</a>
                </nav>
                <div className="header-buttons">
                    <button className="header-btn add-cars">Add your cars</button>
                    <button className="header-btn login" onClick={handleLogin}>Login/Sign Up</button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to GN Rentals</h1>
                    <p>Your one-stop solution for car rentals and bookings.</p>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Find a Car Rental"
                            className="search-input"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                        <button className="search-btn" onClick={handleSearch}>Search</button>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://via.placeholder.com/600x400" alt="Hero Car" className="hero-car-img" />
                </div>
            </section>

            {/* Rental Search Section */}
            <section className="rental-search-section">
                <h2>Rent a car with GN Rentals</h2>
                <p>Get great prices from trusted rentals, check customer reviews, and book easily.</p>
                <div className="rental-search-form">
                    <input type="text" placeholder="Select City" className="rental-input" />
                    <input type="text" placeholder="Pick-up points" className="rental-input" />
                    <input type="date" placeholder="Pick-up day" className="rental-input" />
                    <input type="date" placeholder="Drop-off day" className="rental-input" />
                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" />
                            Same place of deposit
                        </label>
                        <label>
                            <input type="checkbox" />
                            Driver: 30 to 65 years old
                        </label>
                    </div>
                    <button className="rental-search-btn">Research</button>
                </div>
            </section>

            {/* Local Guidance Section */}
            {localInfo && (
                <section className="local-guidance">
                    <h2>Local Guidance for {localInfo.name}</h2>
                    <p><strong>Weather:</strong> {localInfo.weather[0].description}</p>
                    <p><strong>Temperature:</strong> {(localInfo.main.temp - 273.15).toFixed(2)}°C</p>
                    <p><strong>Humidity:</strong> {localInfo.main.humidity}%</p>
                </section>
            )}
            {error && <p className="error-message">Error: {error}</p>}

            {/* QR Code Section */}
            <section className="qr-section">
                <div className="qr-content">
                    <h2>Get the App</h2>
                    <p>Scan the QR code to download the GN Rentals App for convenient bookings.</p>
                    <div className="qr-codes">
                        <img src="https://via.placeholder.com/150" alt="Google Play QR" className="qr-img" />
                        <img src="https://via.placeholder.com/150" alt="App Store QR" className="qr-img" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-columns">
                    <div className="footer-column">
                        <h3>Company</h3>
                        <a href="#about">About Us</a>
                        <a href="#careers">Careers</a>
                        <a href="#privacy">Privacy Policy</a>
                    </div>
                    <div className="footer-column">
                        <h3>Support</h3>
                        <a href="#help">Help Center</a>
                        <a href="#contact">Contact Us</a>
                    </div>
                    <div className="footer-column">
                        <h3>Download</h3>
                        <img src="https://via.placeholder.com/150" alt="Play Store" className="store-img" />
                        <img src="https://via.placeholder.com/150" alt="App Store" className="store-img" />
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 GN Rentals. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default MainPage;
