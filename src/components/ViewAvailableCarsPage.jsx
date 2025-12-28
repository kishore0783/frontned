import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar component
import "./ViewAvailableCarsPage.css";

function ViewAvailableCarsPage() {
    const [availableCars, setAvailableCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for Sidebar
    const navigate = useNavigate();

    // Toggle sidebar state
    const handleSidebarToggle = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch("http://localhost:8080/rentals/available-cars");
                if (!response.ok) {
                    throw new Error("Failed to fetch available cars.");
                }
                const data = await response.json();
                setAvailableCars(data);
            } catch (err) {
                console.error("Error fetching available cars:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) {
        return (
            <div className="loading-message">
                <p>Loading available cars...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="sidebar-layout">
            {/* Sidebar Component */}
            <Sidebar onToggle={handleSidebarToggle} />
            <div className={`content ${isSidebarOpen ? "shrink" : ""}`}>
                <div className="view-cars-container">
                    <h1 className="cars-title">Available Cars</h1>
                    {availableCars.length > 0 ? (
                        <table className="cars-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Hourly Rate</th>
                                    <th>Brand</th>
                                    <th>Registration Number</th>
                                    <th>Color</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableCars.map((car) => (
                                    <tr key={car.id}>
                                        <td>{car.id}</td>
                                        <td>{car.name || "N/A"}</td>
                                        <td>${car.hourlyRate ? car.hourlyRate.toFixed(2) : "N/A"}</td>
                                        <td>{car.carBrand || "N/A"}</td>
                                        <td>{car.carRegistrationNumber || "N/A"}</td>
                                        <td>{car.carColor || "N/A"}</td>
                                        <td>{car.carType || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-cars-message">No available cars found.</p>
                    )}
                    <button
                        className="back-button"
                        onClick={() => navigate("/admin")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewAvailableCarsPage;
