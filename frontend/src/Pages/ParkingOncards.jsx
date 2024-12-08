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
  const [cityUser, setcityUser] = useState("");
  const [stateUser, setstateUser] = useState("");

  // Function to fetch address from coordinates
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      // Extract relevant address fields
      const addressData = response.data.address;
      const formattedAddress = `${addressData.neighbourhood}, ${addressData.city}, ${addressData.postcode}`;

      // Set the formatted address
      setAddress(formattedAddress);
      console.log(formattedAddress);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const fetchUserAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const addressData = response.data.address;
      setcityUser(addressData.city);
      setstateUser(addressData.state);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    fetchUserAddress(lat, lng);
  }, [lat, lng]);

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
      <div className="panel-head motion-preset-slide-down motion-duration-1000 bg-custom-gradient flex flex-col justify-center items-center gap-2 rounded-b-3xl p-4 min-h-[16vh] min-w-[100vw] border border-black">
        <div className="flex gap-3">
          <p className="font-bold text-xl">View All Parking Locations</p>
        </div>
        {/* Display the fetched address */}
        {address && (
          <p className="text-white text-sm mt-2 motion-preset-fade-sm">
            <strong>Address:</strong> {address}
          </p>
        )}
        <div className="goback">
          <Link to="/parkings-maps" state={{ lat, lng }}>
            See on map
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-panel motion-preset-blur-up motion-duration-1000 bg-white w-full p-4">
        {/* Pass cityUser and stateUser to Search component */}
        <Search lat={lat} lng={lng} cityUser={cityUser} stateUser={stateUser} />
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
