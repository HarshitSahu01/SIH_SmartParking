import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import marker from "./icons/marker-without-bg.png";
import userMarker from "./icons/marker-user-removebg.png";

const MergedComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { lat: initialLat, lng: initialLng } = location.state || {
    lat: 20.5937, // Default latitude (India)
    lng: 78.9629, // Default longitude (India)
  };

  const [username, setUsername] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [lat, setLat] = useState(initialLat); // Use initialLat as default
  const [lng, setLng] = useState(initialLng); // Use initialLng as default
  const [address, setAddress] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);

  const apiKey = "NVo2x7Bp_UDXwLmUwpWxzVm83NuM5uulbAXNsbtBgVE";

  const FlyToLocation = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) {
        map.flyTo([lat, lng], 14, { duration: 3 });
      }
    }, [lat, lng, map]);
    return null;
  };

  const getAddress = async (lat, lng) => {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?key=fe2a5bde17474d36bc4b2c31efb73ed5&q=${lat},${lng}&pretty=1&no_annotations=1`;
      const response = await fetch(url);
      const data = await response.json();
      setAddress(data.results[0]?.formatted || "Address not found");
    } catch (error) {
      console.error("Error fetching address: ", error);
    }
  };

  useEffect(() => {
    getAddress(lat, lng);
  }, [lat, lng]);

  const customIcon = new L.Icon({
    iconUrl: marker,
    iconSize: [30, 40],
  });

  const customIconUser = new L.Icon({
    iconUrl: userMarker,
    iconSize: [30, 40],
  });

  const isValidLatLng = (lat, lng) =>
    typeof lat === "number" && typeof lng === "number";

  const storeList = [
    {
      properties: {
        name: "Parking Space 1",
        address:
          "Besides Capitol Heights, Medical Chowk, Nagpur, Maharashtra 440024, India",
        phone: "23 2323 2323",
      },
      geometry: {
        coordinates: [79.09679, 21.14812],
      },
    },
    {
      properties: {
        name: "Parking Space 2",
        address:
          "Shop No 7, Ground Floor, Chemox House, Hospital Lane, Barrack Rd, New Marine Lines, Mumbai, Maharashtra 400020, India",
        phone: "23 2323 2323",
      },
      geometry: {
        coordinates: [72.82815459698692, 18.94324557965778],
      },
    },
  ];

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://autosuggest.search.hereapi.com/v1/autosuggest`,
        {
          params: {
            apiKey,
            q: value,
            at: `${lat},${lng}`, // Center suggestions around current location
            limit: 5,
          },
        }
      );
      setSuggestions(response.data.items || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setQuery(suggestion.title);
    setSuggestions([]);
    try {
      const response = await axios.get(
        `https://geocode.search.hereapi.com/v1/geocode`,
        {
          params: {
            apiKey,
            q: suggestion.title,
          },
        }
      );
      const locationDetails = response.data.items[0];
      setLat(locationDetails.position.lat);
      setLng(locationDetails.position.lng);
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  return (
    <div className="merged-component">
      <div className="data-up">
        <h1>Location Finder</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search for a location"
          value={query}
          onChange={handleInputChange}
        />
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.title}
            </li>
          ))}
        </ul>
        <button onClick={handleGetCurrentLocation}>Get Current Location</button>
        <button
          onClick={() => {
            navigate("/drop-pin");
          }}
        >
          Set Your Location
        </button>
        <p>Your Location: {address}</p>
      </div>
      <main style={{ display: "flex" }}>
        <div style={{ width: "100%", height: "100vh" }}>
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            />
            {storeList.map((shop, index) => (
              <Marker
                key={index}
                position={[
                  shop.geometry.coordinates[1],
                  shop.geometry.coordinates[0],
                ]}
                icon={customIcon}
                eventHandlers={{
                  click: () => setSelectedStore(shop),
                }}
              >
                <Popup>
                  {shop.properties.name}
                  <br />
                  {shop.properties.address}
                  <br />
                  {shop.properties.phone}
                </Popup>
              </Marker>
            ))}
            {isValidLatLng(lat, lng) && (
              <Marker position={[lat, lng]} icon={customIconUser}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {selectedStore && (
              <FlyToLocation
                lat={selectedStore.geometry.coordinates[1]}
                lng={selectedStore.geometry.coordinates[0]}
              />
            )}
            {/* Fly to the user's current location when they get it */}
            <FlyToLocation lat={lat} lng={lng} />
          </MapContainer>
        </div>
      </main>
    </div>
  );
};

export default MergedComponent;
