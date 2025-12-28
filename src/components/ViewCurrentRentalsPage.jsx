import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar component
import "./ViewCurrentRentalsPage.css";

function ViewCurrentRentalsPage() {
    const [currentRentals, setCurrentRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for Sidebar
    const navigate = useNavigate();

    // Toggle sidebar open state
    const handleSidebarToggle = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await fetch("http://localhost:8080/rentals/current");
                if (!response.ok) {
                    throw new Error("Failed to fetch current rentals.");
                }
                const data = await response.json();
                setCurrentRentals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    if (loading) {
        return (
            <div className="loading-indicator">
                <p>Loading current rentals...</p>
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
                <div className="view-rentals-container">
                    <h1>Current Rentals</h1>
                    {currentRentals.length > 0 ? (
                        <table className="rentals-table">
                            <thead>
                                <tr>
                                    <th>Rental ID</th>
                                    <th>Customer Name</th>
                                    <th>Car Name</th>
                                    <th>Start Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRentals.map((rental) => (
                                    <tr key={rental.id}>
                                        <td>{rental.id}</td>
                                        <td>{rental.customer.name}</td>
                                        <td>{rental.car.name}</td>
                                        <td>{new Date(rental.startTime).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No current rentals found.</p>
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

export default ViewCurrentRentalsPage;
