import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import marker from "../components/icons/marker-without-bg.png";
import userMarker from "../components/icons/marker-user-removebg.png";

const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 14, { duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
};

const ParkingOnmap = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { lat: initialLat, lng: initialLng } = location.state || {
    lat: 20.5937, // Default latitude (India)
    lng: 78.9629, // Default longitude (India)
  };

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [lat, setLat] = useState(initialLat); // Use initialLat as default
  const [lng, setLng] = useState(initialLng); // Use initialLng as default
  const [address, setAddress] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // State for full-screen panel

  useEffect(() => {
    fetch("http://localhost:8000/getCords")
      .then((response) => response.json())
      .then((data) => {
        setStoreList(data.data);
        console.log(data);
      });
  }, []);

  const apiKey = "NVo2x7Bp_UDXwLmUwpWxzVm83NuM5uulbAXNsbtBgVE";

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
      setIsSearchExpanded(true); // Expand panel when searching
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setQuery(suggestion.title);
    setSuggestions([]);
    setIsSearchExpanded(false); // Collapse panel after selection
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
      <main className="relative">
        <div className="h-[100vh] w-[100vw]">
          {/* Map */}
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            />
            {/* Render Stores */}
            {storeList.map((shop, index) => (
              <Marker
                key={index}
                position={[
                  shop.geometry.coordinates[0],
                  shop.geometry.coordinates[1],
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
            {/* User Marker */}
            {isValidLatLng(lat, lng) && (
              <Marker position={[lat, lng]} icon={customIconUser}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {/* FlyTo */}
            <FlyToLocation lat={lat} lng={lng} />
            {selectedStore && (
              <FlyToLocation
                lat={selectedStore.geometry.coordinates[0]}
                lng={selectedStore.geometry.coordinates[1]}
              />
            )}
          </MapContainer>
        </div>

        {/* Location Confirmation Panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            isSearchExpanded
              ? "top-0 h-full bg-[#93B5F7]"
              : "min-h-[28vh] rounded-t-3xl bg-[#93B5F7]"
          } p-4 shadow-lg flex flex-col items-center gap-4 transition-all duration-300`}
          style={{ zIndex: 1000 }}
        >
          <p className="text-black text-3xl font-bold">Set your location</p>
          <div className="flex flex-col items-center gap-4">
            <button
              className="bg-white text-black px-4 py-2 rounded-lg border drop-shadow-lg border-gray-700 hover:bg-gray-100 flex justify-between items-center gap-2 w-96 h-[6vh] text-xl font-semibold"
              onClick={handleGetCurrentLocation}
            >
              <h1 className="ml-12 text-2xl">Use current location</h1>
              <svg
                width="44"
                height="44"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                  stroke="#1E1E1E"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M32.48 15.52L28.24 28.24L15.52 32.48L19.76 19.76L32.48 15.52Z"
                  stroke="#1E1E1E"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <div className="flex items-center bg-[#93B5F7] px-4 py-2 rounded-lg gap-1">
              <input
                type="text"
                placeholder="xyz street, some place"
                value={query}
                onChange={handleInputChange}
                onFocus={() => setIsSearchExpanded(true)} // Expand panel on focus
                className="text-black bg-white text-xl px-2 py-1 rounded-lg border border-gray-700 w-[80vw] h-14 focus:outline-none drop-shadow-2xl"
              />
              <div className="srchbutn rounded-lg border border-gray-700 bg-white h-14 flex items-center">
                <lord-icon
                  src="https://cdn.lordicon.com/wjyqkiew.json"
                  trigger="hover"
                  stroke="bold"
                  colors="primary:#121331,secondary:#00000"
                  style={{ height: "45px", width: "45px" }}
                ></lord-icon>
              </div>
            </div>
            <ul className="flex flex-col justify-center items-start mx-8 gap-1 drop-shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer hover:underline bg-white flex items-center w-96 h-12 text-lg font-semibold px-2 py-2 rounded-sm "
                >
                  {suggestion.title}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                console.log("Location confirmed:", lat, lng);
                setIsSearchExpanded(false);
                navigate("/drop-pin", {
                  state: { lat, lng },
                });
              }}
              className="bg-black text-white px-4  rounded-3xl text-2xl font-bold shadow-md hover:bg-gray-700 drop-shadow-2xl w-64 h-16"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParkingOnmap;

// <button
// onClick={() =>
//   navigate("/home", {
//     state: { lat, lng },
//   })
// }
//   className="text-black font-semibold bg-[#CFDFFF] px-4 py-2 rounded-lg border drop-shadow-lg border-gray-700 hover:bg-[#EAF2FF] text-2xl"
// >
//   Confirm
// </button>
