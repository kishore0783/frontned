import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUser,
  faLifeRing,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

function LogoutButton() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching the logged-in user's name
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.name) {
      setUserName(userData.name);
    } else {
      setUserName("Guest");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <div className="logout-container">
      <FontAwesomeIcon icon={faBell} className="notification-icon" />
      <div
        className="profile-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="profile-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="profile-name">{userName}</span>
      </div>
      {showDropdown && (
        <div className="dropdown-wrapper">
          <ul className="profile-dropdown">
            <li onClick={() => handleNavigate("/profile")}>
              <FontAwesomeIcon icon={faUser} className="dropdown-icon" />
              Profile
            </li>
            <li onClick={() => handleNavigate("/support")}>
              <FontAwesomeIcon icon={faLifeRing} className="dropdown-icon" />
              Contact Support
            </li>
            <li onClick={handleLogout}>
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="dropdown-icon logout-icon"
              />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default LogoutButton;
