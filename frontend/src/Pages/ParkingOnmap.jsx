import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import marker from "../Components/icons/marker-without-bg.png";
import userMarker from "../Components/icons/marker-user-removebg.png";
import down from "../assets/down.png";
import ParkingBox from "../Components/ParkingBox";
import SearchComp from "../Pages/Search";
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
        className="map-head flex justify-center items-center h-20 rounded-b-3xl bg-[#003060] text-white absolute top-0 left-0 right-0 z-[1000]"
      >
        <h1 className="text-2xl font-bold">Parkings Available Near You!</h1>
      </div>
      <div className="h-[100vh] w-[100vw]">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex:"900" }}
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
          isSearchExpanded ? "top-0 pt-24 min-h-screen bg-white " : "min-h-[5vh] rounded-t-3xl bg-[#003060]"
        }  text-white py-4 shadow-lg flex flex-col items-center justify-center gap-2 transition-all duration-1000 overflow-scroll`}
        style={{zIndex:"2000"}}
      >
        <div className={`panel-head bg-[#003060] flex flex-col justify-center items-center gap-2 ${isSearchExpanded?"rounded-b-3xl drop-shadow-2xl":""} p-4`}>
        <div className="flex gap-3">
          <p
            className={` font-bold ${
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
                isSearchExpanded ? "w-8 h-8 rotate-0" : "w-8 h-8 rotate-180"
              }`}
            />
          </button>
        </div>
        <p className="text-md font-medium flex justify-center items-center gap-2 text-white ">
          <svg
            width="33"
            height="34"
            viewBox="0 0 33 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.5 31.1667C16.1792 31.1667 15.9042 31.0723 15.675 30.8834C15.4458 30.6945 15.274 30.4466 15.1594 30.1396C14.724 28.8174 14.174 27.5778 13.5094 26.4209C12.8677 25.2639 11.9625 23.9063 10.7938 22.348C9.625 20.7896 8.67396 19.3021 7.94062 17.8855C7.23021 16.4688 6.875 14.757 6.875 12.75C6.875 9.98754 7.80312 7.65004 9.65937 5.73754C11.5385 3.80143 13.8188 2.83337 16.5 2.83337C19.1813 2.83337 21.45 3.80143 23.3062 5.73754C25.1854 7.65004 26.125 9.98754 26.125 12.75C26.125 14.8987 25.724 16.6931 24.9219 18.1334C24.1427 19.55 23.2375 20.9549 22.2063 22.348C20.9688 24.048 20.0292 25.4646 19.3875 26.598C18.7688 27.7077 18.2531 28.8882 17.8406 30.1396C17.726 30.4702 17.5427 30.7299 17.2906 30.9188C17.0615 31.0841 16.7979 31.1667 16.5 31.1667ZM16.5 16.2917C17.4625 16.2917 18.276 15.9493 18.9406 15.2646C19.6052 14.5799 19.9375 13.7417 19.9375 12.75C19.9375 11.7584 19.6052 10.9202 18.9406 10.2355C18.276 9.55073 17.4625 9.20837 16.5 9.20837C15.5375 9.20837 14.724 9.55073 14.0594 10.2355C13.3948 10.9202 13.0625 11.7584 13.0625 12.75C13.0625 13.7417 13.3948 14.5799 14.0594 15.2646C14.724 15.9493 15.5375 16.2917 16.5 16.2917Z"
              fill="#FEF7FF"
            />
          </svg>{" "}
          <span className="font-semibold">{address}</span>
        </p>
        </div>
        {isSearchExpanded && (
          <div className="main-panel bg-white w-[100%]">
            <SearchComp />
          </div>
        )}
        <div className={`changeLoc flex justify-end ${isSearchExpanded?"text-black":"text-white"}`}>
          <button
            onClick={() => {
              navigate("/maps");
            }}
          >
            Change Location.
          </button>
        </div>
      </div>
    </main>
  </div>
  
  );
};

export default ParkingOnmap;
