import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TotalRentalsPage.css";

function TotalRentalsPage() {
    const [rentals, setRentals] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchRentals();
    }, [page]);

    const fetchRentals = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/rentals/current?page=${page}&size=10`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch rentals.");
            }
            const data = await response.json();

            console.log("Fetched rentals data:", data); // Log the fetched data

            if (data.length === 0) {
                setHasMore(false); // No more rentals to load
            } else {
                setRentals((prevRentals) => [...prevRentals, ...data]);
            }
        } catch (error) {
            console.error("Error fetching rentals:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div className="rentals-container">
            <h1>All Rentals</h1>
            <table className="rentals-table">
                <thead>
                    <tr>
                        <th>Rental ID</th>
                        <th>Car Name</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Payment Mode</th>
                        <th>Total Amount</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map((rental) => {
                        console.log("Processing rental:", rental); // Log each rental
                        return (
                            <tr key={rental.id}>
                                <td>{rental.id}</td>
                                <td>{rental.car?.name || "N/A"}</td>
                                <td>{rental.customer?.name || "N/A"}</td>
                                <td>{rental.customer?.email || "N/A"}</td>
                                <td>{rental.paymentMode || "Unspecified"}</td>
                                <td>{rental.totalAmount.toFixed(2)}</td>
                                <td>{rental.startTime ? new Date(rental.startTime).toLocaleString() : "N/A"}</td>
                                <td>{rental.endTime ? new Date(rental.endTime).toLocaleString() : "Ongoing"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {loading && <p>Loading...</p>}
            {hasMore && (
                <button className="load-more-btn" onClick={loadMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    );
}

export default TotalRentalsPage;
