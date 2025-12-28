import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, AlertCircle, Eye, EyeOff, ArrowLeft, Car } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userType = localStorage.getItem('userType');
        if (isLoggedIn) {
            if (userType === 'admin') {
                navigate('/admin');
            } else if (userType === 'customer') {
                navigate('/customer');
            }
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8080/login',
                { 
                    username: formData.username, 
                    password: formData.password 
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data === 'admin') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', 'admin');
                localStorage.setItem('loginId', formData.username);
                navigate('/admin');
            } else if (response.data === 'customer') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', 'customer');
                localStorage.setItem('loginId', formData.username);
                navigate('/customer');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <nav className="login-nav">
                <Link to="/" className="nav-brand">
                    <Car className="brand-icon" size={24} />
                    <span className="brand-text">LuxeWheels</span>
                </Link>
                <Link to="/" className="nav-back">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>
            </nav>

            <div className="login-container">
                <div className="login-card">
                    <div className="card-header">
                        <h1 className="card-title">Welcome Back</h1>
                        <p className="card-subtitle">Your premium car rental experience awaits</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    placeholder=" "
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label className="input-label">Username</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
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
                            className={`login-button ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? <span className="loader"></span> : 'Sign In'}
                        </button>
                    </form>

                    <div className="card-footer">
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot your password?
                        </Link>
                        <p className="signup-text">
                            Don't have an account?{' '}
                            <Link to="/signup" className="signup-link">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;