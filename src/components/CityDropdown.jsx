import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SignupPage.css";

function CityDropdown() {
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // Fetch all cities initially
        const fetchCities = async () => {
            try {
                const response = await axios.get("http://localhost:8080/search");
                setCities(response.data);
                setFilteredCities(response.data);
            } catch (error) {
                console.error("Error fetching cities", error);
            }
        };
        fetchCities();
    }, []);

    const handleSearch = (e) => {
        const input = e.target.value;
        setQuery(input);

        // Filter cities based on user input
        if (input.trim() === "") {
            setFilteredCities(cities);
        } else {
            setFilteredCities(
                cities.filter((city) =>
                    city.cityName.toLowerCase().includes(input.toLowerCase())
                )
            );
        }
    };

    const handleSelectCity = (cityName) => {
        setQuery(cityName); // Set the selected city in the input box
        setFilteredCities([]); // Close the dropdown
    };

    return (
        <div className="city-dropdown">
            {filteredCities.length > 0 && (
                <ul className="city-dropdown-list">
                    {filteredCities.map((city) => (
                        <li
                            key={city.id}
                            onClick={() => handleSelectCity(city.cityName)}
                            className="city-dropdown-item"
                        >
                            {city.cityName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default CityDropdown;
