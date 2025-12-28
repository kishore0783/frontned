import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Mail, Home, Phone, Key, Lock, AlertCircle, ArrowLeft, Car } from 'lucide-react';
import "./SignupPage.css";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phnumber: "",
        loginId: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:8080/signup", formData, {
                headers: { "Content-Type": "application/json" },
            });
            navigate("/login", { 
                state: { message: "Account created successfully! Please login." }
            });
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <nav className="signup-nav">
                <Link to="/" className="nav-brand">
                    <Car className="brand-icon" size={24} />
                    <span className="brand-text">LuxeWheels</span>
                </Link>
                <Link to="/" className="nav-back">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>
            </nav>

            <div className="signup-container">
                <div className="signup-card">
                    <div className="card-header">
                        <h1 className="card-title">Create Account</h1>
                        <p className="card-subtitle">Join us for premium car rental experience</p>
                    </div>

                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-group">
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    placeholder=" "
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label className="input-label">Full Name</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder=" "
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label className="input-label">Email Address</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <Home className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="address"
                                    className="form-input"
                                    placeholder=" "
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                                <label className="input-label">Address</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={20} />
                                <input
                                    type="tel"
                                    name="phnumber"
                                    className="form-input"
                                    placeholder=" "
                                    value={formData.phnumber}
                                    onChange={handleInputChange}
                                />
                                <label className="input-label">Phone Number</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <Key className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="loginId"
                                    className="form-input"
                                    placeholder=" "
                                    value={formData.loginId}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label className="input-label">Login ID</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder=" "
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label className="input-label">Password</label>
                            </div>
                        </div>

                        {error && (
                            <div className="error-alert">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`signup-button ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? <span className="loader"></span> : 'Create Account'}
                        </button>
                    </form>

                    <div className="card-footer">
                        <p className="login-text">
                            Already have an account?{' '}
                            <Link to="/login" className="login-link">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;