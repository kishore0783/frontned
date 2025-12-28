import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './EditCarPage.css';
import LogoutButton from './LogoutButton';

function EditCarPage() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:8080/cars');
                if (!response.ok) {
                    throw new Error('Failed to fetch cars');
                }
                const data = await response.json();
                setCars(data);
            } catch (error) {
                setErrorMessage('Error fetching cars: ' + error.message);
            }
        };

        fetchCars();
    }, []);

    const handleEditClick = (car) => {
        setSelectedCar({ ...car });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCar((prevCar) => ({ ...prevCar, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/cars/${selectedCar.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedCar),
            });

            if (!response.ok) {
                throw new Error('Failed to update car details');
            }

            const updatedCar = await response.json();
            setCars((prevCars) =>
                prevCars.map((car) => (car.id === updatedCar.id ? updatedCar : car))
            );
            setSuccessMessage('Car details updated successfully!');
            setSelectedCar(null);
        } catch (error) {
            setErrorMessage('Error updating car details: ' + error.message);
        }
    };

    const handleCancel = () => {
        setSelectedCar(null);
        setSelectedFile(null);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadPicture = async () => {
        if (selectedCar && selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await fetch(`http://localhost:8080/cars/${selectedCar.id}/upload-picture`, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.ok) {
                    alert('Picture uploaded successfully');
                    setSelectedFile(null);
                } else {
                    const errorText = await response.text();
                    alert('Error uploading picture: ' + errorText);
                }
            } catch (error) {
                alert('Error uploading picture: ' + error.message);
            }
        } else {
            alert('Please select a file to upload.');
        }
    };

    const fetchCarPicture = (carId) => {
        return `http://localhost:8080/cars/${carId}/picture`;
    };

    return (
        <div className="editcar-background">
            <LogoutButton />
            <div className="editcar-container">
                <h2 className="editcar-title">Edit Car Details</h2>

                {errorMessage && <p className="editcar-error-message">{errorMessage}</p>}
                {successMessage && <p className="editcar-success-message">{successMessage}</p>}

                <div className="editcar-grid">
                    {cars.map((car) => (
                        <div key={car.id} className="editcar-box">
                            <img
                                src={fetchCarPicture(car.id)}
                                alt="Car"
                                className="editcar-image"
                                onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                            />
                            <h3 className="editcar-car-title">{car.name}</h3>
                            <p><strong>Brand:</strong> {car.carBrand}</p>
                            <p><strong>Registration:</strong> {car.carRegistrationNumber}</p>
                            <p><strong>Color:</strong> {car.carColor}</p>
                            <p><strong>Type:</strong> {car.carType}</p>
                            <button
                                className="editcar-edit-button"
                                onClick={() => handleEditClick(car)}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>

                {selectedCar && (
                    <div className="editcar-modal">
                        <div className="editcar-modal-content zoom-in">
                            <h3>Edit Car Details</h3>
                            {Object.keys(selectedCar).map((key) => (
                                key !== 'id' && (
                                    <label key={key} className="editcar-label">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                        <input
                                            type="text"
                                            name={key}
                                            value={selectedCar[key]}
                                            onChange={handleInputChange}
                                            className="editcar-input"
                                        />
                                    </label>
                                )
                            ))}
                            <label className="editcar-label">
                                Upload Picture:
                                <input type="file" onChange={handleFileChange} className="editcar-input" />
                            </label>
                            <div className="editcar-modal-actions">
                                <button onClick={handleSave} className="editcar-save-button">
                                    Save
                                </button>
                                <button onClick={handleUploadPicture} className="editcar-upload-button">
                                    Upload Picture
                                </button>
                                <button onClick={handleCancel} className="editcar-cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="editcar-back-link-container">
                    <Link to="/admin" className="editcar-back-link">
                        Back to Admin Page
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EditCarPage;
