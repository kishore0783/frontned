import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AddCarPage.css';
import LogoutButton from './LogoutButton';

function AddCarPage() {
    const [carDetails, setCarDetails] = useState({
        name: '',
        hourlyRate: '',
        carBrand: '',
        carRegistrationNumber: '',
        carColor: '',
        carType: '',
    });
    const [selectedFile, setSelectedFile] = useState(null); // File for car picture
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarDetails({ ...carDetails, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate that a picture is selected
        if (!selectedFile) {
            setErrorMessage('Please select a picture to upload.');
            return;
        }

        setShowModal(true); // Show confirmation modal
    };

    const handleConfirmAdd = async () => {
        setShowModal(false); // Close modal
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Append car details to FormData
            Object.keys(carDetails).forEach((key) => {
                formData.append(key, carDetails[key]);
            });

            const response = await fetch('http://localhost:8080/cars/add-with-picture', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSuccessMessage('Car added successfully!');
                setCarDetails({
                    name: '',
                    hourlyRate: '',
                    carBrand: '',
                    carRegistrationNumber: '',
                    carColor: '',
                    carType: '',
                });
                setSelectedFile(null); // Clear the file input
            } else {
                throw new Error('Failed to add car');
            }
        } catch (error) {
            setErrorMessage('Error: ' + error.message);
        }
    };

    const handleCancel = () => {
        setShowModal(false); // Close modal without adding car
    };

    return (
        <div className="addcar-background">
            <LogoutButton />
            <div className="addcar-container">
                <h2 className="addcar-title">Add a New Car</h2>
                <p className="addcar-subtitle">Fill in the details below to add a new car to the inventory.</p>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit} className="addcar-form">
                    {Object.keys(carDetails).map((key) => (
                        <div key={key} className="addcar-input-container">
                            <input
                                type={key === 'hourlyRate' ? 'number' : 'text'}
                                name={key}
                                placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                value={carDetails[key]}
                                onChange={handleChange}
                                className="addcar-input"
                                required
                            />
                            <span className="addcar-input-focus-effect" />
                        </div>
                    ))}
                    <div className="addcar-input-container">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="addcar-file-input"
                            required
                        />
                        <span className="addcar-input-focus-effect" />
                    </div>
                    <button type="submit" className="addcar-button">Add Car</button>
                </form>

                <div className="addcar-back-link-container">
                    <Link to="/admin" className="addcar-back-link">
                        Back to Admin Page
                    </Link>
                </div>

                {showModal && (
                    <div className="addcar-modal">
                        <div className="addcar-modal-content zoom-in">
                            <p>Are you sure you want to add this car?</p>
                            <div className="addcar-modal-actions">
                                <button className="addcar-confirm-button" onClick={handleConfirmAdd}>
                                    Confirm
                                </button>
                                <button className="addcar-cancel-button" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddCarPage;
