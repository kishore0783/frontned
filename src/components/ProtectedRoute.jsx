import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please log in to access this page.');
        return <Navigate to="/" />; // Redirect to login page
    }
    return children;
};

export default ProtectedRoute;
