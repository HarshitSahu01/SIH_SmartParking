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
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [address, setAddress] = useState(""); // Store user's address
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/getCords")
      .then((response) => {
        setStoreList(response.data.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetchAddress(lat, lng);
  }, [lat, lng]);
  

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

  const customIcon = new L.Icon({
    iconUrl: marker,
    iconSize: [30, 40],
  });

  const customIconUser = new L.Icon({
    iconUrl: userMarker,
    iconSize: [30, 40],
  });

  const toggleSearchPanel = () => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsSearchExpanded((prev) => !prev);
  };

  return (
    <div className="merged-component">
      <main className="relative">
        <div
          className="map-head flex justify-center items-center h-20 rounded-b-3xl bg-[#93B5F7]/90 absolute top-0 left-0 right-0"
          style={{ zIndex: 1100 }}
        >
          <h1 className="text-2xl font-bold">Parkings Available Near You!</h1>
        </div>
        <div className="h-[100vh] w-[100vw]">
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution=""
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
            <Marker position={[lat, lng]} icon={customIconUser}>
              <Popup>Your Location</Popup>
            </Marker>
            <FlyToLocation lat={lat} lng={lng} />
          </MapContainer>
        </div>
        <div
          ref={panelRef}
          className={`absolute bottom-0 left-0 right-0 ${
            isSearchExpanded ? "top-0 h-full" : "min-h-[5vh] rounded-t-3xl"
          } bg-[#93B5F7]/90 p-4 shadow-lg flex flex-col items-center justify-center gap-2 transition-all duration-1000`}
          style={{ zIndex: 1200 }}
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
          <p className="text-md font-medium">
            Your Location : <span className="font-semibold">{address}</span>
          </p>
          {isSearchExpanded && (
            <div className="main-panel z-[2000]">
              <ParkingBox />
            </div>
          )}
          <div className="changeLoc flex justify-end items-end">
              <button onClick={()=>{
                navigate("/maps");
              }}>
                Change Location.
              </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParkingOnmap;
