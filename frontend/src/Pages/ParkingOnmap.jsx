import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import marker from "../components/icons/marker-without-bg.png";
import userMarker from "../components/icons/marker-user-removebg.png";
import down from "../assets/down.png";
import ParkingBox from "../Components/ParkingBox";

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
  const [lat, setLat] = useState(initialLat); // Use initialLat as default
  const [lng, setLng] = useState(initialLng); // Use initialLng as default
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // State for full-screen panel
  const panelRef = useRef(null); // Reference for the panel container

  useEffect(() => {
    fetch("http://localhost:8000/getCords")
      .then((response) => response.json())
      .then((data) => {
        setStoreList(data.data);
        console.log(data);
      });
  }, []);

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

  const toggleSearchPanel = () => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsSearchExpanded((prev) => !prev); // Toggle the expanded state
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
              attribution=''
            />
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
                  <ParkingBox />
                </Popup>
              </Marker>
            ))}
            {isValidLatLng(lat, lng) && (
              <Marker position={[lat, lng]} icon={customIconUser}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            <FlyToLocation lat={lat} lng={lng} />
            {selectedStore && (
              <FlyToLocation
                lat={selectedStore.geometry.coordinates[0]}
                lng={selectedStore.geometry.coordinates[1]}
              />
            )}
          </MapContainer>
        </div>
        <div
  ref={panelRef}
  className={`absolute bottom-0 left-0 right-0 ${
    isSearchExpanded ? "top-0 h-full" : "min-h-[5vh] rounded-t-3xl"
  } bg-[#93B5F7]/90 p-4 shadow-lg flex flex-col items-center justify-center gap-2 transition-all duration-1000`}
  style={{ zIndex: 1000 }}
>
  <div className="flex gap-2">
    
  <p
    className={`text-black font-bold ${
      isSearchExpanded ? "text-xl" : "text-3xl"
    }`}
  >
    {isSearchExpanded ? "View on Map" : "View All"}
  </p>
  <button onClick={toggleSearchPanel}>
        <img
          src={down}
          alt=""
          className={`transition-transform duration-500 ${
            isSearchExpanded ? "w-8 h-8 rotate-0" : "w-12 h-12 rotate-180"
          }`}
          />
      </button>
  </div>

  <div className="flex flex-col items-center gap-4">
    <div className="flex flex-col items-center bg-[#93B5F7] px-4 py-2 rounded-lg gap-1">
          {isSearchExpanded && (
            <div className="main-panel z-[2000]">
              <ParkingBox />
            </div>
          )}
    </div>
  </div>
</div>

      </main>
    </div>
  );
};

export default ParkingOnmap;
