import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logout from '../Components/icons/logout.png';
import P from "../assets/P.png";
import clock from "../assets/clock.png";
import addressicon from "../assets/address.png";
import priceicon from "../assets/price.png";
import Car from "../assets/car.png";
import bike from "../assets/bike.png";
import siren from "../Components/icons/siren.png";
import map from "../Conponents/icons/map22.png";
import home from "../Components/icons/home.png";
const Ghar = () => {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleInputClick = () => {
    navigate('/maps');
  };

  // ParkingBox Component
  const ParkingBox = ({
    name,
    carprice,
    bikeprice,
    distance,
    carspots,
    bikespots,
    address,
    image,
  }) => {
    return (
      <div className="flex flex-col w-[80vw] sm:w-[300px] border border-gray-300 rounded-3xl overflow-hidden bg-white shadow-md transform transition-transform duration-50 hover:scale-100 active:scale-110 hover:bg-gray-100">
        <img
          src={image ? image : P}
          alt="Parking"
          className="w-full h-[220px] object-cover p-3 rounded-3xl"
        />
        <div className="pt-1 px-4 pb-4">
          <div className="flex flex-row mx-2 sm:flex-row justify-between items-start sm:items-center">
            <div className="c11 flex flex-col gap-3">
              <div className="c1 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
                <img src={P} alt="P" className="w-7" />
                <p>{name}</p>
              </div>
              <div className="c2 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
                <img src={clock} alt="" className="w-7" />
                <p>{distance} km</p>
              </div>
              <div className="c3 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
                <img src={addressicon} alt="" className="w-7" />
                <p>{address}</p>
              </div>
            </div>

            <div className="c22 flex flex-col gap-3">
              <div className="c4 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
                <img src={priceicon} alt="" className="w-7" />
                <p>Rs {carprice}</p>
                <p>Rs {bikeprice}</p>
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

  return (
    <div className="App bg-white-100 min-h-screen">
      {/* Logout icon */}
      <div className="relative">
        <img
          src={logout}
          alt="Logout"
          className="absolute z-[1000] top-0 right-0 p-4 w-8 h-8 cursor-pointer"
        />
      </div>

      {/* SVG */}
      <svg className='z-0' width="440" height="162" viewBox="0 0 440 162" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="219.5" cy="18.5" rx="244.5" ry="87.5" fill="#C087C4"/>
        <ellipse opacity="0.78" cx="219.5" cy="74.5" rx="244.5" ry="87.5" fill="#C087C4"/>
        <ellipse opacity="0.6" cx="214.5" cy="49" rx="244.5" ry="94" fill="#6159B7"/>
      </svg>

      {/* Welcome Message */}
      <span className="flex justify-center items-center mt-5 text-4xl font-bold text-center">Hi, User!</span>

      {/* Location input */}
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-2xl font-semibold">Where do you wanna park today?</h2>
        <input 
          type="text" 
          placeholder="Set your Location"
          className="mt-4 p-4 rounded-lg w-3/4 border bg-gray-200 text-black"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onClick={handleInputClick} // Navigate to /maps when clicked
        />
      </div>

      {/* Recently Booked Button */}
      <div className="flex justify-start ml-9 mt-8">
        <button className="flex justify-start bg-custom-gradient text-white p-2 rounded-md">Recently booked</button>
      </div>

      {/* Parking Box Example */}
      <div className="flex justify-start mt-4 ml-9">
        <ParkingBox
          name="Parking Spot A"
          carprice="30"
          bikeprice="15"
          distance="2"
          carspots="10"
          bikespots="5"
          address="Location A"
          image={P} // You can replace with actual image if available
        />
      </div>
        <button className='flex bg-red-400'>Cancel booking</button>
      <footer className="bg-custom-gradient text-white py-3 mt-7">
      <div className="container mx-auto flex justify-between px-4">
        {/* Division 1 */}
        <div className="flex flex-col space-y-2 gap-6">
          <p>Home</p>
        </div>

        <div className="flex flex-col space-y-2">
          <p>Maps</p>
        </div>
       
        {/* Division 1 */}
        <div className="flex flex-col space-y-2">
          <p>Contact</p>

        </div>
      </div>


    </footer>

    </div>
  );
};

export default Ghar;
