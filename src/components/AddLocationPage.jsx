import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./AddLocationPage.css";
import LogoutButton from "./LogoutButton";
import L from "leaflet";

// Fix for default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationSelector({ onLocationChange }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationChange(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
}

function AddLocationPage() {
    const [locationDetails, setLocationDetails] = useState({
        cityName: "",
        locationName: "",
        address: "",
        area: "",
        landmark: "",
        state: "",
        pincode: "",
        latitude: "",
        longitude: "",
    });
    const [cars, setCars] = useState([]);
    const [selectedCars, setSelectedCars] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("http://localhost:8080/cities");
                if (!response.ok) {
                    throw new Error("Failed to fetch cities");
                }
                const cityData = await response.json();
                setCities(cityData);
            } catch (error) {
                console.error("Error fetching cities:", error.message);
            }
        };

        const fetchCars = async () => {
            try {
                const response = await fetch("http://localhost:8080/cars");
                if (!response.ok) {
                    throw new Error("Failed to fetch cars");
                }
                const carData = await response.json();
                setCars(carData);
            } catch (error) {
                console.error("Error fetching cars:", error.message);
            }
        };

        fetchCities();
        fetchCars();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocationDetails({ ...locationDetails, [name]: value });
    };

    const handleLocationChange = (coords) => {
        setLocationDetails({
            ...locationDetails,
            latitude: coords.lat,
            longitude: coords.lng,
        });
    };

    const handleCarSelection = (carId) => {
        setSelectedCars((prev) =>
            prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check if the city exists
            let city = cities.find((c) => c.cityName === locationDetails.cityName);
            if (!city) {
                const cityResponse = await fetch("http://localhost:8080/cities", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cityName: locationDetails.cityName,
                        noOfLocations: 0,
                    }),
                });

                if (!cityResponse.ok) throw new Error("Failed to add city");
                city = await cityResponse.json();
            }

            // Add location
            const locationResponse = await fetch("http://localhost:8080/locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cityId: city.id,
                    locationName: locationDetails.locationName,
                    address: locationDetails.address,
                    area: locationDetails.area,
                    landmark: locationDetails.landmark,
                    state: locationDetails.state,
                    pincode: locationDetails.pincode,
                    latitude: locationDetails.latitude,
                    longitude: locationDetails.longitude,
                }),
            });

            if (!locationResponse.ok) throw new Error("Failed to add location");

            const locationData = await locationResponse.json();

            // Increment city's location count
          

            console.log("locationId:",locationData.id);
            console.log("Cars id:",selectedCars);

            // Add cars to location
            await fetch("http://localhost:8080/cars-in-location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locationId: locationData.id,
                    carIds: selectedCars,
                }),
            });

            setSuccessMessage("Location and cars added successfully!");
            setLocationDetails({
                cityName: "",
                locationName: "",
                address: "",
                area: "",
                landmark: "",
                state: "",
                pincode: "",
                latitude: "",
                longitude: "",
            });
            setSelectedCars([]);
        } catch (error) {
            setErrorMessage("Error: " + error.message);
        }
    };

    return (
        <div className="addlocation-background">
            <LogoutButton />
            <div className="addlocation-container">
                <h2 className="addlocation-title">Add a New Location</h2>
                <p className="addlocation-subtitle">Fill in the details below to add a new location.</p>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit} className="addlocation-form">
                    {["locationName", "address", "area", "landmark", "state", "pincode"].map((field) => (
                        <div key={field} className="addlocation-input-container">
                            <input
                                type={field === "pincode" ? "number" : "text"}
                                name={field}
                                placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                value={locationDetails[field]}
                                onChange={handleChange}
                                className="addlocation-input"
                                required
                            />
                            <span className="addlocation-input-focus-effect" />
                        </div>
                    ))}

                    <div className="addlocation-input-container">
                        <select
                            name="cityName"
                            value={locationDetails.cityName}
                            onChange={handleChange}
                            className="addlocation-input"
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.cityName}>
                                    {city.cityName}
                                </option>
                            ))}
                        </select>
                        <span className="addlocation-input-focus-effect" />
                    </div>

                    <div className="map-container">
                        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "300px", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationSelector onLocationChange={handleLocationChange} />
                        </MapContainer>
                    </div>

                    <div className="addlocation-input-container">
                        <input
                            type="text"
                            name="latitude"
                            placeholder="Latitude"
                            value={locationDetails.latitude}
                            readOnly
                            className="addlocation-input"
                        />
                        <span className="addlocation-input-focus-effect" />
                    </div>
                    <div className="addlocation-input-container">
                        <input
                            type="text"
                            name="longitude"
                            placeholder="Longitude"
                            value={locationDetails.longitude}
                            readOnly
                            className="addlocation-input"
                        />
                        <span className="addlocation-input-focus-effect" />
                    </div>

                    <div className="addlocation-input-container">
                        <label>Select Cars:</label>
                        <ul className="car-list">
                            {cars.map((car) => (
                                <li key={car.id} className="car-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedCars.includes(car.id)}
                                        onChange={() => handleCarSelection(car.id)}
                                    />
                                    {car.name} ({car.carBrand}) - {car.carRegistrationNumber}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button type="submit" className="addlocation-button">Add Location</button>
                </form>

                <div className="addlocation-back-link-container">
                    <Link to="/admin" className="addlocation-back-link">
                        Back to Admin Page
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AddLocationPage;
