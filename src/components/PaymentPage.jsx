import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDialog, setShowDialog] = useState(false); // Confirmation dialog

    const customerId = localStorage.getItem("customerId");
    const carId = location.state?.carId || localStorage.getItem("carId");
    const totalAmount = location.state?.totalAmount || 0;

    useEffect(() => {
        if (!carId || !customerId) {
            console.error("Missing carId or customerId.");
            alert("Missing required details. Redirecting to Return Car page.");
            navigate("/return-car");
        }
    }, [carId, customerId, navigate]);

    const handlePayment = async () => {
        const endTime = new Date().toISOString(); // Capture the current time
        const rentalUpdatePayload = {
            carId: parseInt(carId, 10),
            customerId: parseInt(customerId, 10),
            totalAmount: parseFloat(totalAmount),
            endTime,
        };
    
        console.log("Rental Update Payload:", rentalUpdatePayload);
    
        setIsProcessing(true);
    
        try {
            // Step 1: Process Payment
            const paymentResponse = await fetch("http://localhost:8080/payments/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId,
                    carId,
                    totalAmount,
                    paymentMethod,
                    endTime,
                }),
            });
    
            if (!paymentResponse.ok) {
                throw new Error("Payment processing failed.");
            }
    
            // Step 2: Update Rental Table
            const rentalResponse = await fetch("http://localhost:8080/rentals/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rentalUpdatePayload),
            });
    
            if (!rentalResponse.ok) {
                throw new Error("Failed to update rental details.");
            }
    
            alert("Payment successful and rental details updated!");
            navigate("/thank-you");
        } catch (error) {
            console.error("Error during payment or rental update:", error);
            alert("Failed to complete payment or update rental details. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };    

    const handleBackToCustomerPage = () => {
        setShowDialog(true);
    };

    const confirmBackNavigation = () => {
        setShowDialog(false);
        navigate("/customer");
    };

    return (
        <div className="payment-background">
            <div className="payment-container">
                <h2 className="payment-title">Complete Your Payment</h2>
                <p>
                    <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
                </p>
                <form>
                    <label htmlFor="payment-method">Choose Payment Method:</label>
                    <select
                        id="payment-method"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="payment-method"
                    >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Net Banking">Net Banking</option>
                    </select>
                    <button
                        type="button"
                        className="payment-button"
                        onClick={handlePayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>

            {/* Box to navigate to Customer Page */}
            <div className="back-box">
                <p>Need to cancel payment and go back?</p>
                <button className="back-box-button" onClick={handleBackToCustomerPage}>
                    Go to Customer Page
                </button>
            </div>

            {/* Confirmation Dialog */}
            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <p>Are you sure you want to cancel the payment and go back?</p>
                        <div className="dialog-buttons">
                            <button
                                className="dialog-confirm-button"
                                onClick={confirmBackNavigation}
                            >
                                Yes, Go Back
                            </button>
                            <button
                                className="dialog-cancel-button"
                                onClick={() => setShowDialog(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentPage;
