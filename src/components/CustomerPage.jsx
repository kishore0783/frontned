import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerPage.css";
import emailjs from "emailjs-com";
import LogoutButton from "./LogoutButton";

function CustomerPage() {
    const [customerName, setCustomerName] = useState("");
    const [currentRentals, setCurrentRentals] = useState([]);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [loyaltyLevel, setLoyaltyLevel] = useState("Bronze");
    const [expanded, setExpanded] = useState(false); // To toggle rental history
    const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode toggle
    const [filters, setFilters] = useState({}); // Advanced filter state
    const [isChatOpen, setIsChatOpen] = useState(false); // State for live chat
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId");
    const [expandedWishlist, setExpandedWishlist] = useState(false);
    const backgroundImage = "https://i.imgur.com/3DcarImage.jpg"; // Replace with your preferred 3D car image URL
    const [mostBookedCar, setMostBookedCar] = useState(null);
    const [feedbackText, setFeedbackText] = useState(""); // Declare feedback state here
    const [ExpandedRecommendedForYou, setExpandedRecommendedForYou] = useState(false);


    useEffect(() => {
        const fetchCustomerData = async () => {
            setLoading(true);
            setError(null);
            try {
                const loginId = localStorage.getItem("loginId");
                if (!loginId) {
                    navigate("/login");
                    return;
                }
        
                // Fetch customer profile
                const profileResponse = await fetch(
                    `http://localhost:8080/customer/profile?loginId=${loginId}` // Use backticks
                );
                if (!profileResponse.ok) {
                    throw new Error("Failed to fetch customer profile.");
                }
                const profileData = await profileResponse.json();
                localStorage.setItem("customerId", profileData.id);
                setCustomerName(profileData.name || "Customer");
        
                const customerId = profileData.id;
                console.log("c.id: ", customerId);
        
                // Fetch active rentals
                const activeRentalsResponse = await fetch(
                    `http://localhost:8080/rentals/active?customerId=${customerId}` // Use backticks
                );
                if (activeRentalsResponse.ok) {
                    setCurrentRentals(await activeRentalsResponse.json());
                }
        
                // Fetch rental history
                const historyResponse = await fetch(
                    `http://localhost:8080/rentals/rental-history/${customerId}` // Use backticks
                );
                if (historyResponse.ok) {
                    setRentalHistory(await historyResponse.json());
                }
        
                // Fetch wishlist
                const wishlistResponse = await fetch(
                    `http://localhost:8080/wishlist?customerId=${customerId}` // Use backticks
                );
                if (wishlistResponse.ok) {
                    setWishlist(await wishlistResponse.json());
                } else {
                    console.error("Failed to fetch wishlist");
                }
        
                // Fetch recommendations
                const mostBookedCarResponse = await fetch(
                    `http://localhost:8080/rentals/most-booked-car/${customerId}` // Use backticks
                );
                if (mostBookedCarResponse.ok) {
                    const mostBookedCarData = await mostBookedCarResponse.json();
                    setMostBookedCar(mostBookedCarData);
                    console.log("mostBookedcar :",mostBookedCarData);
                } else {
                    console.error("Failed to fetch most booked car");
                }
        
                // Fetch loyalty points
                const loyaltyResponse = await fetch(
                    `http://localhost:8080/loyalty?customerId=${customerId}` // Use backticks
                );
                if (loyaltyResponse.ok) {
                    const loyaltyData = await loyaltyResponse.json();
                    setLoyaltyPoints(loyaltyData.points);
                    setLoyaltyLevel(loyaltyData.level);
                }
            } catch (error) {
                console.error("Error fetching customer data:", error.message);
                setError("Failed to load customer data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        
          fetchCustomerData();
        }, [navigate]);

    const fetchCarPicture = (carId) => {
            // Log the carId being used to fetch the picture
            console.log(`Fetching picture for car ID: ${carId}`);
            
            // Correct the template string to include carId
            const url = `http://localhost:8080/cars/${carId}/picture`;
            
            // Log the URL being called
            console.log(`Fetching picture from URL: ${url}`);

            return url;
        //return 'http://localhost:8080/cars/${carId}/picture';
    };

    const toggleRentalHistory = () => {
        setExpanded((prevState) => !prevState);
    };

    const toggleWishlist = () => {
        setExpandedWishlist((prevState) => !prevState);
    };

    const toggleRecommendedForYou = () => {
        setExpandedRecommendedForYou((prevState) => !prevState);
    };

    const handleAddToWishlist = async (car) => {
        try {
            if (wishlist.some((wishlistCar) => wishlistCar.id === car.id)) {
                alert("This car is already in your wishlist!");
                return;
            }

            const response = await fetch("http://localhost:8080/wishlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerId: parseInt(customerId),
                    carId: car.id,
                }),
            });

            if (response.ok) {
                const updatedWishlist = await fetch(
                    'http://localhost:8080/wishlist?customerId=${customerId}'
                ).then((res) => res.json());
                setWishlist(updatedWishlist);
                alert("Car added to wishlist!");
            } else {
                alert("Failed to add car to wishlist.");
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleChat = () => {
        setIsChatOpen((prevState) => !prevState);
    };

    const applyFilters = () => {
        console.log("Filters applied:", filters);
    };

    const resetFilters = () => {
        setFilters({});
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();

        const feedback = {
            customerId: customerId,
            feedbackText,
        };

        try {
            const response = await fetch("http://localhost:8080/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedback),
            });

            if (response.ok) {
                alert("Feedback submitted successfully!");
                setFeedbackText(""); // Clear feedback box on success
            } else {
                alert("Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error.message);
        }
    };

    return (
        <div className={'customer-background ${isDarkMode ? "dark-mode" : ""}'}>
            <LogoutButton />
            <div className="customer-main-container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <h1 className="welcome-title">
                        Welcome,{" "}
                        <span className="customer-name">
                            {customerName.split("").map((letter, index) => (
                                <span key={index} className="letter">{letter}</span>
                            ))}
                        </span>
                        !
                    </h1>
                    <p className="welcome-quote">
                        "Discover premium rentals and rewards just for you!"
                    </p>
                </div>

                {/* Advanced Filters */}
                <div className="filter-container">
                    <h3>Advanced Filters</h3>
                    <label>
                        Car Type:
                        <input
                            type="text"
                            value={filters.carType || ""}
                            onChange={(e) =>
                                setFilters({ ...filters, carType: e.target.value })
                            }
                        />
                    </label>
                    <label>
                        Date Range:
                        <input
                            type="date"
                            value={filters.startDate || ""}
                            onChange={(e) =>
                                setFilters({ ...filters, startDate: e.target.value })
                            }
                        />
                        to
                        <input
                            type="date"
                            value={filters.endDate || ""}
                            onChange={(e) =>
                                setFilters({ ...filters, endDate: e.target.value })
                            }
                        />
                    </label>
                    <label>
                        Price Range:
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice || ""}
                            onChange={(e) =>
                                setFilters({ ...filters, minPrice: e.target.value })
                            }
                        />
                        to
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice || ""}
                            onChange={(e) =>
                                setFilters({ ...filters, maxPrice: e.target.value })
                            }
                        />
                    </label>
                    <button onClick={applyFilters}>Apply</button>
                    <button onClick={resetFilters}>Reset</button>
                </div>

                {/* Current Rentals Section */}
                <div className="current-rentals-section">
                    <h3 className="section-title">Current Rentals</h3>
                    {currentRentals.length > 0 ? (
                        <div className="rental-box-container">
                            {currentRentals.map((rental) => (
                                <div key={rental.id} className="rental-box">
                                    <img
                                        src={fetchCarPicture(rental.carId)}
                                        alt="Car"
                                        className="car-image"
                                        style={{ width: "200px", height: "150px" }} // Fixed dimensions
                                        onError={(e) => { 
                                            //console.error(`Failed to load image for car ID: ${car.id}`);
                                            e.target.src = "/placeholder-image.png"; 
                                        }}
                                    />
                                    <h4>{rental.carName}</h4>
                                    <p><strong>Brand:</strong> {rental.carBrand}</p>
                                    <p><strong>Start Time:</strong> {new Date(rental.startTime).toLocaleString()}</p>
                                    <p><strong>Total Amount:</strong> ${rental.totalAmount.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-rentals-box">
                            <p>You have no active rentals at the moment.</p>
                        </div>
                    )}
                </div>


                {/* Rent and Return Car Options */}
                <div className="customer-options-container">
                    <div className="customer-option-box" onClick={() => navigate("/cars")}>
                        <h3>🚗 Rent a Car</h3>
                        <p>Explore our premium car collection for your next trip.</p>
                        <p className="blue-text">Click to Rent a Car</p>
                    </div>
                    <div className="customer-option-box" onClick={() => navigate("/return-car")}>
                        <h3>🔄 Return a Car</h3>
                        <p>Complete your trip by returning your rented car.</p>
                        <p className="blue-text">Click to Return the Rented Car</p>
                    </div>
                </div>

                {/* Rental History */}
                <div className="customer-feature-box">
                    <h3 className="section-title">
                        Rental History{" "}
                        <button onClick={toggleRentalHistory} className="toggle-button">
                            {expanded ? <span>↑</span> : <span>↓</span>}
                        </button>
                    </h3>
                    {expanded && rentalHistory.length > 0 && (
                        <div className="rental-history-container">
                            {rentalHistory.map((car) => (
                                <div key={car.id} className="rental-box">
                                    <img
                                        src={fetchCarPicture(car.id)}
                                        alt="Car"
                                        className="car-image"
                                        onError={(e) => { e.target.src = "/placeholder-image.png"; }}
                                    />
                                    <h4>{car.name}</h4>
                                    <p><strong>Brand:</strong> {car.carBrand}</p>
                                    <p><strong>Registration:</strong> {car.carRegistrationNumber}</p>
                                    <p><strong>Color:</strong> {car.carColor}</p>
                                    <p><strong>Type:</strong> {car.carType}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {expanded && rentalHistory.length === 0 && (
                        <p>No rental history available.</p>
                    )}
                </div>

                {/* Wishlist */}
                <div className="customer-feature-box">
                    <h3 className="section-title">
                        Wishlist{" "}
                        <button onClick={toggleWishlist} className="toggle-button">
                            {expandedWishlist ? "↑" : "↓"}
                        </button>
                    </h3>
                    {expandedWishlist && wishlist.length > 0 && (
                        <div className="rental-history-container">
                            {wishlist.map((car) => (
                                <div key={car.id} className="rental-box">
                                    <img
                                        src={fetchCarPicture(car.id)}
                                        alt="Car"
                                        className="car-image"
                                    />
                                    <h4>{car.name}</h4>
                                    <p><strong>Brand:</strong> {car.carBrand}</p>
                                    <p><strong>Registration:</strong> {car.carRegistrationNumber}</p>
                                    <p><strong>Color:</strong> {car.carColor}</p>
                                    <p><strong>Type:</strong> {car.carType}</p>
                                </div>
                            ))}
                        </div>
                    )}
                     </div>

               {/* Recommended Section */}
                <div className="customer-feature-box">
                    <h3 className="section-title">
                        Recommended for You {" "}
                        <button onClick={toggleRecommendedForYou} className="toggle-button">
                                     {expanded ? <span>↑</span> : <span>↓</span>}
                        </button>
                        </h3>
                    {   expandedWishlist && wishlist.length > 0 && (
                        mostBookedCar ? (
                        <div className="rental-box">
                            <h4>Most Booked Car</h4>
                            <img
                                src={fetchCarPicture(mostBookedCar.id)}
                                //{'http://localhost:8080/cars/${mostBookedCar.id}/picture'}
                                alt={mostBookedCar.name}
                                className="car-image"
                                onError={(e) => { e.target.src = "/placeholder-image.png"; }}
                            />
                            <p><strong>Name:</strong> {mostBookedCar.name}</p>
                            <p><strong>Brand:</strong> {mostBookedCar.carBrand}</p>
                            <p><strong>Type:</strong> {mostBookedCar.carType}</p>
                        </div>
                    ) : (
                        <p>Loading recommendations...</p>
                    ))}
                </div>


                {/* Loyalty Rewards */}
                <div className="customer-feature-box">
                    <h3>Loyalty Rewards</h3>
                    <p><strong>Points:</strong> {loyaltyPoints}</p>
                    <p><strong>Level:</strong> {loyaltyLevel}</p>
                    <p>Earn more points to unlock exciting discounts and offers!</p>
                </div>

                {/* Dark Mode Toggle */}
                <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                    {isDarkMode ? "☀️" : "🌙"}
                </button>
            </div>
            {/* Feedback Section */}
            <div className="customer-support-chat">
                    <h3>Customer Feedback</h3>
                    <form className="feedback-form" onSubmit={handleSubmitFeedback}>
                        <label>
                            Feedback:
                            <textarea
                                name="feedback"
                                placeholder="Write your feedback here"
                                required
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                            ></textarea>
                        </label>
                        <button type="submit" className="submit-feedback-btn">
                            Send Feedback
                        </button>
                    </form>
                </div>


            {/* Footer Section */}
            <div className="footer">
                <div className="footer-column">
                    <h3>Language</h3>
                    <select>
                        <option>English (United States)</option>
                    </select>
                    <h3>Currency</h3>
                    <select>
                        <option>Indian Rupee (₹)</option>
                    </select>
                </div>
                <div className="footer-column">
                    <h3>Support</h3>
                    <a href="#">Contact</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">General Terms</a>
                </div>
                <div className="footer-column">
                    <h3>Company</h3>
                    <a href="#">About Us</a>
                    <a href="#">Careers</a>
                </div>
                <div className="footer-column">
                    <h3>Work With Us</h3>
                    <a href="#">As a Supply Partner</a>
                    <a href="#">As a Content Creator</a>
                    <a href="#">As an Affiliate Partner</a>
                </div>
                <div className="footer-column">
                    <h3>Ways You Can Pay</h3>
                    <img src="path-to-payment-icons.png" alt="Payment Methods" />
                </div>
                <div className="footer-icons">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-pinterest"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                </div>
                <div className="footer-bottom">
                    &copy; 2008 — 2024 Car Rentals Inc. Made in Zurich & Berlin.
                </div>
                    {/* Floating Chat */}
                    <button className="chat-button" onClick={toggleChat}>
                    💬 Chat <i className="chat-icon fas fa-comment-alt"></i> {/* Font Awesome icon */}
                </button>
                {isChatOpen && (
                    <div className="chat-box">
                        <div className="chat-box-header">
                            <h4>Live Chat</h4>
                            <button onClick={toggleChat}>✖</button>
                        </div>
                        <iframe
                            src="https://your-live-chat-url.com/chat" // Replace with your service's chat URL
                            title="Customer Support Chat"
                            className="chat-widget"
                            allow="microphone; camera"
                        ></iframe>

                    </div>
                )}
            </div>
            </div>
);
}

export default CustomerPage;