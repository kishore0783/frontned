import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";

function ProfilePage({ userType, loginId }) {
    const [profileData, setProfileData] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [formValue, setFormValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const endpoint = userType === "admin" 
                    ? `/admin/profile` 
                    : `/customer/profile`;
                const response = await fetch(
                    `http://localhost:8080${endpoint}?loginId=${loginId}`
                );
                if (!response.ok) throw new Error("Failed to fetch profile");
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfile();
    }, [userType, loginId]);

    const handleEdit = (field) => {
        setEditingField(field);
        setFormValue(profileData[field]);
    };

    const handleSave = async () => {
        try {
            const updatedData = { ...profileData, [editingField]: formValue };
            const response = await fetch(
                `http://localhost:8080/${userType === "admin" ? "admin" : "customer"}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                }
            );
            if (!response.ok) throw new Error("Failed to update profile");
            setProfileData(updatedData);
            setEditingField(null);
        } catch (error) {
            console.error("Error saving profile data:", error);
        }
    };

    if (!profileData) return <div>Loading...</div>;

    return (
        <div className="profile-page">
            <h2>My Account</h2>
            <p>Manage your account information.</p>
            <div className="profile-details">
                {Object.keys(profileData).map((key) => (
                    <div className="profile-row" key={key}>
                        <span className="field-name">
                            {key.replace(/([A-Z])/g, " $1")}:
                        </span>
                        {editingField === key ? (
                            <>
                                <input
                                    type="text"
                                    value={formValue}
                                    onChange={(e) => setFormValue(e.target.value)}
                                />
                                <button className="save-btn" onClick={handleSave}>
                                    Save
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => setEditingField(null)}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="field-value">
                                    {profileData[key] || "Not provided"}
                                </span>
                                <button className="edit-btn" onClick={() => handleEdit(key)}>
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfilePage;
