import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pin from "../assets/dropPin.png"
// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl:pin, // URL to marker icon
  iconSize: [40, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
});

const Pin = () => {
  const [pin, setPin] = useState(null); // State to store a single pin
  const navigate = useNavigate(); // For navigation

  // Handle map click to drop a pin
  const MapClickHandler = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        // Update pin state and fly to the clicked location
        setPin({ lat, lng });
        map.flyTo([lat, lng], 14, { duration: 1.5 });
      },
    });
    return null;
  };

  // Handle confirm button click
  const handleConfirmLocation = () => {
    if (pin) {
      navigate("/parkings-maps", { state: { lat: pin.lat, lng: pin.lng } }); // Navigate with state
    } else {
      alert("Please drop a pin to select your location first!");
    }
  };

  return (
    <div className="relative">
      <div className="panel flex flex-col justify-center items-center absolute bottom-0 left-0 right-0 bg-custom-gradient rounded-t-2xl z-[2000] h-36 gap-4">
      <h1 className="text-xl font-semibold">
        {/* {pin
          ? `Dropped Pin Coordinates: Latitude ${pin.lat.toFixed(
              4
            )}, Longitude ${pin.lng.toFixed(4)}`
          : ""} */}
      Tap on the map to drop a pin

      </h1>
      <button
        onClick={handleConfirmLocation}
        className="py-3 px-5 bg-black/80 text-white drop-shadow-2xl  rounded-3xl"
      >
        Confirm My Location
      </button>
      </div>
      <MapContainer
        center={[20.5937, 78.9629]} // Default center (India)
        zoom={5}
        style={{ height: "100vh", width: "100vw" }}
      >
        {/* Tile Layer from OpenStreetMap */}
        <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution=''
            />

        {/* Add click handler to the map */}
        <MapClickHandler />

        {/* Render a single pin */}
        {pin && (
          <Marker
            position={[pin.lat, pin.lng]}
            icon={customIcon} // Custom icon for the marker
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Pin;
