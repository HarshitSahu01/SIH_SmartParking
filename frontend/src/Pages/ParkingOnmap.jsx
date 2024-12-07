import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import marker from "../Components/icons/marker-without-bg.png";
import userMarker from "../Components/icons/marker-user-removebg.png";
import P from "../assets/P.png";  // Import missing image
import clock from "../assets/clock.png";  // Import missing image
import addressicon from "../assets/address.png";  // Import missing image
import priceicon from "../assets/price.png";  // Import missing image
import Car from "../assets/car.png";  // Import missing image
import bike from "../assets/bike.png";  // Import missing image
import axios from "axios";
import backarr from "../assets/back-arrow.png"
// ParkingBox component as provided
const ParkingBox = ({ name, price, distance, carspots, bikespots, address, image }) => {
  return (
    <div className="flex flex-col w-[80vw] sm:w-[300px] border border-gray-300 rounded-3xl overflow-hidden bg-white shadow-md transform transition-transform duration-50 hover:scale-100 active:scale-110 hover:bg-gray-100">
      <img src={image} alt="Parking" className="w-full h-[220px] object-cover p-3 rounded-3xl" />
      <div className="pt-1 px-4 pb-4">
        <div className="flex flex-row mx-2 sm:flex-row justify-between items-start sm:items-center">
          <div className="c11 flex flex-col gap-3">
            <div className="c1 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
              <img src={P} alt="P" className="w-7" />
              <p>{name}</p>
            </div>
            <div className="c2 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
              <img src={clock} alt="" className="w-7" />
              <p>{distance}</p>
            </div>
            <div className="c3 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
              <img src={addressicon} alt="" className="w-7" />
              <p>{address}</p>
            </div>
          </div>

          <div className="c22 flex flex-col gap-3">
            <div className="c4 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
              <img src={priceicon} alt="" className="w-7" />
              <p>Rs {price}</p>
            </div>
            <div className="c5 flex items-center text-sm font-bold text-gray-600 gap-2">
              <img src={Car} alt="" className="w-7" />
              <p>{carspots} spots</p>
            </div>
            <div className="c6 flex items-center text-sm font-bold text-gray-600 gap-2">
              <img src={bike} alt="" className="w-7" />
              <p>{bikespots} spots</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom component to fly to a location
const FlyToLocation = ({ lat, lng }) => {
  const map = useMap(); // Access the map instance
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { animate: true, duration: 0.5 }); // Fly to the location with animation
    }
  }, [lat, lng, map]); // Run this effect when lat or lng changes
  return null; // This component does not render anything itself
};

// ParkingOnmap Component where the map and parking data is displayed
const ParkingOnmap = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { lat: initialLat, lng: initialLng } = location.state || {
    lat: 20.5937, // Default latitude (India)
    lng: 78.9629, // Default longitude (India)
  };
  const [lat, setLat] = useState(initialLat);  // User's current latitude
  const [lng, setLng] = useState(initialLng);  // User's current longitude
  const [storeLat, setStoreLat] = useState(initialLat); // For store's latitude
  const [storeLng, setStoreLng] = useState(initialLng); // For store's longitude

  const [address, setAddress] = useState(""); // Store user's address
  const [selectedStore, setSelectedStore] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const panelRef = useRef(null);

  // Instead of fetching from an API, using the const storeList directly.
  const storeList = [
    {
      id: 1,
      name: 'Parking Lot 1',
      lat: 21.1458,
      lng: 79.0882,
      price: 70,
      distance: '5 km',
      carspots: 15,
      bikespots: 5,
      address: 'Address 1',
      image: 'https://via.placeholder.com/300x220?text=Parking+1',
    },
    {
      id: 2,
      name: 'Parking Lot 2',
      lat: 21.1450,
      lng: 79.0900,
      price: 80,
      distance: '3 km',
      carspots: 20,
      bikespots: 10,
      address: 'Address 2',
      image: 'https://via.placeholder.com/300x220?text=Parking+2',
    },
    {
      id: 3,
      name: 'Parking Lot 3',
      lat: 21.1400,
      lng: 79.0850,
      price: 90,
      distance: '6 km',
      carspots: 25,
      bikespots: 8,
      address: 'Address 3',
      image: 'https://via.placeholder.com/300x220?text=Parking+3',
    },
    {
      id: 4,
      name: 'Parking Lot 4',
      lat: 21.1480,
      lng: 79.1000,
      price: 100,
      distance: '7 km',
      carspots: 30,
      bikespots: 12,
      address: 'Address 4',
      image: 'https://via.placeholder.com/300x220?text=Parking+4',
    },
    {
      id: 5,
      name: 'Parking Lot 5',
      lat: 21.1500,
      lng: 79.1100,
      price: 110,
      distance: '4 km',
      carspots: 35,
      bikespots: 15,
      address: 'Address 5',
      image: 'https://via.placeholder.com/300x220?text=Parking+5',
    },
    {
      id: 6,
      name: 'Parking Lot 6',
      lat: 21.1550,
      lng: 79.1200,
      price: 120,
      distance: '2 km',
      carspots: 40,
      bikespots: 18,
      address: 'Address 6',
      image: 'https://via.placeholder.com/300x220?text=Parking+6',
    },
  ];

  // Fetch address for the current lat, lng
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

  // Custom icon for parking markers
  const customIcon = new L.Icon({
    iconUrl: marker,
    iconSize: [30, 40],
  });

  // Custom icon for the user's current location marker
  const customIconUser = new L.Icon({
    iconUrl: userMarker,
    iconSize: [30, 40],
  });

  // Function to handle the click on ParkingBox card and fly to the corresponding location
  const handleCardClick = (lat, lng) => {
    setLat(lat);
    setLng(lng);
  };

  return (
    <div className="merged-component">
      <main className="relative z-0">
        {/* Go back button */}
        <div className="back absolute top-2 right-2 bg-white rounded-full  text-white  z-[2000] motion-preset-slide-left">
          <button
            onClick={() => {
              navigate("/parkings-cards", {
                state: { lat, lng }, // Properly wrap `state` inside an object
              });
            }}
          >
            <img src={backarr} alt="" className="w-6 h-7 mx-2 my-1"/>
          </button>
        </div>

        {/* Map container */}
        <div className="h-[100vh] w-[100vw]">
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: "60%", width: "100%", zIndex: "900" }}
          >
            <TileLayer
              url="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=b3a0689a59104875a48e7b0370951490"
              attribution=''
            />
            {/* Markers for stores */}
            {storeList && storeList.length > 0 && storeList.map((shop, index) => {
              return (
                <Marker position={[shop.lat, shop.lng]} icon={customIcon} key={index}>
                  <Popup>{shop.name}</Popup>
                </Marker>
              );
            })}

            {/* Marker for user's current location */}
            {/* Marker for user's current location */}
<Marker position={[initialLat, initialLng]} icon={customIconUser}>
  <Popup>Your Location</Popup>
</Marker>


            {/* Fly to the user's current location */}
            <FlyToLocation lat={lat} lng={lng} />
          </MapContainer>
        </div>

        {/* Parking Slider */}
      <div
  ref={panelRef}
  className={`absolute left-0 right-0 motion-preset-slide-up ${isSearchExpanded ? "top-0 min-h-screen rounded-b-3xl bg-transparent  " : "min-h-[5vh] bottom-0 rounded-t-3xl bg-transparent"} text-white drop-shadow-2xl flex flex-col items-center justify-center gap transition-all duration-1000 overflow-scroll`}
  style={{ zIndex: "2000" }}
>

          {/* Parking Cards as Slider */}
          <div className="w-full mt-4 flex overflow-x-scroll gap-24 bg-custom-gradient p-4 rounded-t-2xl">
            {storeList.map((store) => (
              <div
                key={store.id}
                onClick={() => handleCardClick(store.lat, store.lng)}
                className="flex flex-col w-64 cursor-pointer"
              >
                <ParkingBox
                  name={store.name}
                  price={store.price}
                  distance={store.distance}
                  carspots={store.carspots}
                  bikespots={store.bikespots}
                  address={store.address}
                  image={store.image}
                />
              </div>
            ))}
          </div>
          <div
            className={`changeLoc flex justify-center items-center py-1 font-bold ${isSearchExpanded ? "text-black" : "text-black"} h-full w-full bg-[#6159B7]`}
          >
            <button
              onClick={() => {
                navigate("/maps");
              }}
            >
              ← Change Location.
            </button>
          </div>

          {/* Change location button */}
        </div>
      </main>
    </div>
  );
};

export default ParkingOnmap;
