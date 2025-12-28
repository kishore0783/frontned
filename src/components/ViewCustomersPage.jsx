import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Ensure Sidebar is imported correctly
import "./ViewCustomersPage.css";

function ViewCustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added state for sidebar
    const navigate = useNavigate();

    // Handle sidebar toggle
    const handleSidebarToggle = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch("http://localhost:8080/customer/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch customer data.");
                }
                const data = await response.json();

                // Ensure consistency in data fields
                const updatedCustomers = data.map((customer) => ({
                    ...customer,
                    phone: customer.phnumber || "N/A",
                }));

                setCustomers(updatedCustomers);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Loading state
    if (loading) {
        return <div className="loading-message">Loading customer data...</div>;
    }

    // Error state
    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    // No customers state
    if (customers.length === 0) {
        return <div className="no-customers-message">No customers found.</div>;
    }

    return (
        <div className="sidebar-layout">
            {/* Sidebar Component */}
            <Sidebar
                onToggle={handleSidebarToggle}
            />
            <div className={`content ${isSidebarOpen ? "shrink" : ""}`}>
                <div className="view-customers-background">
                    <div className="view-customers-container">
                        <h1 className="view-customers-title">Customer List</h1>
                        <table className="customers-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="back-button"
                            onClick={() => navigate("/admin")}
                        >
                            Back to Admin Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewCustomersPage;
