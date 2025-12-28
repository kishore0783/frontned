import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReturnCarPage.css";
import LogoutButton from "./LogoutButton";

function ReturnCarPage() {
    const [customerName, setCustomerName] = useState("");
    const [rentalDetails, setRentalDetails] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Retrieve customerId and carId from localStorage
    const customerId = localStorage.getItem("customerId");
    const carId = localStorage.getItem("carId"); // Fetch carId from localStorage

    console.log("Retrieved Customer ID:", customerId);
    console.log("Retrieved Car ID:", carId);

    // Fetch customer name
    useEffect(() => {
        const fetchCustomerName = async () => {
            try {
                const response = await fetch(`http://localhost:8080/customer/profilebyid?id=${customerId}`);
                if (!response.ok) throw new Error("Failed to fetch customer details");
                const data = await response.json();
                console.log("Fetched Customer Name:", data.name);
                setCustomerName(data.name);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        if (customerId) {
            fetchCustomerName();
        }
    }, [customerId]);

    // Fetch rental details based on customerId and carId
    useEffect(() => {
        const fetchRentalDetails = async () => {
            try {
                let url = `http://localhost:8080/rentals/active?customerId=${customerId}`;
                if (carId) {
                    url += `&carId=${carId}`; // Append carId to the query
                }
                console.log("Fetching Rental Details from:", url);

                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch rental details");

                const data = await response.json();
                console.log("Fetched Rental Details:", data);
                setRentalDetails(data);
            } catch (error) {
                console.error("Error fetching rental details:", error.message);
                setErrorMessage(error.message);
            }
        };

        if (customerId) {
            fetchRentalDetails();
        }
    }, [customerId, carId]);

    const redirectToPayment = (carId, totalAmount) => {
        console.log("Redirecting with Car ID:", carId, "Total Amount:", totalAmount);
        localStorage.setItem("carId", carId); // Save carId for the payment page
        navigate("/payment", {
            state: { carId, totalAmount, customerName },
        });
    };

    return (
        <div className="returncar-background">
            <LogoutButton />
            <div className="returncar-container">
                <h1 className="welcome-title">
                    Welcome, <span className="customer-name">{customerName}</span>!
                </h1>
                <h2 className="returncar-title">Return Your Car</h2>
                {errorMessage && <p className="returncar-error-message">{errorMessage}</p>}
                {rentalDetails.length > 0 ? (
                    rentalDetails.map((rental) => (
                        <div key={rental.id} className="rental-details">
                            <h3>{rental.carName} - {rental.carBrand}</h3>
                            <p><strong>Start Time:</strong> {new Date(rental.startTime).toLocaleString()}</p>
                            <p><strong>Total Amount:</strong> ${rental.totalAmount.toFixed(2)}</p>
                            <p><strong>Elapsed Time:</strong> {rental.elapsedTime}</p>
                            <button
                                className="returncar-button returncar-confirm-button"
                                onClick={() => redirectToPayment(rental.carId, rental.totalAmount)}
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="returncar-no-cars-message">No active rentals found.</p>
                )}
            </div>
        </div>
    );
}

export default ReturnCarPage;
