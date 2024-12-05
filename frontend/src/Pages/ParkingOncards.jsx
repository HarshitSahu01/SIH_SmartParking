import React, { useState, useEffect } from "react";
import Search from "./Search";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
const ParkingOnCards = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract latitude and longitude from route state or use default values
  const { lat: initialLat, lng: initialLng } = location.state || {
    lat: 20.5937, // Default latitude (India)
    lng: 78.9629, // Default longitude (India)
  };

  // State variables
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [address, setAddress] = useState("");

  // Function to fetch address from coordinates
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      setAddress(response.data.display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Fetch address whenever lat or lng changes
  useEffect(() => {
    fetchAddress(lat, lng);
  }, [lat, lng]);

  return (
    <div
      className="absolute left-0 right-0 min-h-screen bg-white rounded-b-3xl text-black drop-shadow-2xl flex flex-col items-center justify-start overflow-scroll"
      style={{ zIndex: 2000 }}
    >
      {/* Header Section */}
      <div className="panel-head bg-custom-gradient flex flex-col justify-center items-center gap-2 rounded-b-3xl p-4">
        <div className="flex gap-3">
          <p className="font-bold text-xl">View All Parking Locations</p>
        </div>
        {/* Display the fetched address */}
        {address && (
          <p className="text-white text-sm mt-2">
            <strong>Address:</strong> {address}
          </p>
        )}
        <div className="goback">
           
                <Link to="/parkings-maps" state={{ lat, lng }}>See on map</Link>
         
        </div>
      </div>

      {/* Main Content */}
      <div className="main-panel bg-white w-full p-4">
        <Search />
      </div>

      {/* Footer Section */}
      <div className="changeLoc flex justify-center items-center py-2 font-bold text-gray-600">
        <button
          onClick={() => {
            navigate("/maps"); // Replace this with your navigation logic
          }}
        >
          ← Change Location
        </button>
      </div>
    </div>
  );
};

export default ParkingOnCards;
