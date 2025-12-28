import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar"; // Sidebar component
import "./AdminPage.css";
import LogoutButton from "./LogoutButton";

function AdminPage() {
  const [statistics, setStatistics] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/statistics");
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    const fetchRecentBookings = async () => {
      try {
        const response = await fetch("http://localhost:8080/recent-bookings");
        const data = await response.json();
        setRecentBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
      }
    };

    fetchStatistics();
    fetchRecentBookings();
  }, []);

  return (
    <div className="sidebar-layout">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`content ${isSidebarOpen ? "shrink" : ""}`}>
        <div className="admin-container">
          <h2 className="header">Admin Dashboard</h2>
          <LogoutButton />
          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-box">
              <h4>Total Car Owners</h4>
              <p className="stat-number">{statistics.totalCarOwners || "0"}</p>
              <small>
                Today: {statistics.todayCarOwners || "0"} | This Month:{" "}
                {statistics.monthCarOwners || "0"}
              </small>
            </div>
            <div className="stat-box">
              <h4>Total Passengers</h4>
              <p className="stat-number">{statistics.totalPassengers || "0"}</p>
              <small>
                Today: {statistics.todayPassengers || "0"} | This Month:{" "}
                {statistics.monthPassengers || "0"}
              </small>
            </div>
            <div className="stat-box">
              <h4>Total Cars</h4>
              <p className="stat-number">{statistics.totalCars || "0"}</p>
              <small>
                Today: {statistics.todayCars || "0"} | This Year:{" "}
                {statistics.yearCars || "0"}
              </small>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="platform-stats">
            <div className="platform-box">
              <h4>Email</h4>
              <p className="stat-number">50%</p>
              <small>49 Users</small>
            </div>
            <div className="platform-box">
              <h4>Facebook</h4>
              <p className="stat-number">20%</p>
              <small>20 Users</small>
            </div>
            <div className="platform-box">
              <h4>LinkedIn</h4>
              <p className="stat-number">10%</p>
              <small>11 Users</small>
            </div>
            <div className="platform-box">
              <h4>Gmail</h4>
              <p className="stat-number">10%</p>
              <small>11 Users</small>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="recent-bookings">
            <h3>Recent Bookings</h3>
            <table>
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings && Array.isArray(recentBookings) ? (
                  recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.subject}</td>
                      <td className={`status ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </td>
                      <td>{booking.date}</td>
                      <td>{booking.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No recent bookings available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
