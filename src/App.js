import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminPage from './components/AdminPage';
import CustomerPage from './components/CustomerPage';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RentalPage from './components/RentalPage';
import CarPage from './components/CarPage';
import AddCarPage from './components/AddCarPage';
import RemoveCarPage from './components/RemoveCarPage'; // Updated component
import AdvancePaymentPage from './components/AdvancePaymentPage';
import EditCarPage from './components/EditCarPage';
import ProtectedRoute from './components/ProtectedRoute';
import ReturnCarPage from './components/ReturnCarPage'; // Adjust the path as per your folder structure
import ThankYouPage from './components/ThankYouPage';
import PaymentPage from './components/PaymentPage';
import HelpPage from './components/HelpPage';
import ViewCustomersPage from './components/ViewCustomersPage';
import ViewAvailableCarsPage from './components/ViewAvailableCarsPage';
import ViewCurrentRentalsPage from './components/ViewCurrentRentalsPage';
import AddLocationPage from './components/AddLocationPage';
import TotalRentalsPage from './components/TotalRentalsPage';
import ProfilePage from './components/ProfilePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/customer" element={<CustomerPage />} />
                <Route path="/rental" element={<RentalPage />} />
                <Route path="/cars" element={<CarPage />} />
                <Route path="/admin/add-car" element={<AddCarPage />} />
                <Route path="/admin/remove-car" element={<RemoveCarPage />} /> {/* Updated route */}
                <Route path="/advance-payment" element={<AdvancePaymentPage />} />
                <Route path="/admin/edit-car" element={<EditCarPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin"element={<ProtectedRoute><LoginPage /> </ProtectedRoute>}/>
                <Route path="/return-car" element={<ReturnCarPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/help" element={<HelpPage />} />                
                <Route path="/admin/view-customers" element={<ViewCustomersPage />} />
                <Route path="/admin/view-current-rentals" element={<ViewCurrentRentalsPage />} />
                <Route path="/admin/available-cars" element={<ViewAvailableCarsPage />} />
                <Route path="/admin/add-location" element={<AddLocationPage />} />   
                <Route path="/admin/total-rentals" element={<TotalRentalsPage />} /> 
                <Route path="/profile" element={<ProfilePage />} /> 
            </Routes>
        </Router>
    );
}

export default App;
