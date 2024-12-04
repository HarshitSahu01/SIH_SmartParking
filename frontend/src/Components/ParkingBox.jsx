import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import P from "../assets/P.png";
import Car from "../assets/car.png";
import clock from "../assets/clock.png";
import priceicon from "../assets/price.png";
import bike from "../assets/bike.png"
import addressicon from "../assets/address.png"
// Import worker file
const ParkingBox = ({ name, price, distance, carspots, bikespots, address, image }) => {
  const [showModal, setShowModal] = useState(false); 
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [carspotsLeft, setCarSpotsLeft] = useState(carspots); // Correct initialization
  const [bikespotsLeft, setBikeSpotsLeft] = useState(bikespots); // Correct initialization
  const [isTracking, setIsTracking] = useState(false);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const newWorker = new Worker(new URL("../parkingWorker.worker.js", import.meta.url));
    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  useEffect(() => {
    if (worker) {
      worker.onmessage = (event) => {
        const { message } = event.data;
        toast.info(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      };
    }
  }, [worker]);

  const startTracking = () => {
    if (worker) {
      worker.postMessage({
        action: "startTracking",
        carspotsLeft,
        bikespotsLeft,
        parkingName: name,
      });
    }
    setIsTracking(true);
    setShowModal(false);
    setShowTrackingModal(false);
  };

  const stopTracking = () => {
    if (worker) {
      worker.postMessage({ action: "stopTracking" });
    }
    setIsTracking(false);
    toast.dismiss();
  };
  return (
    <div className="flex mx-2 mt-4 relative">
      {isTracking && (
        <div className="notstopbtn absolute top-0 right-0 z-[1000] bg-red-500 text-white  px-2 py-1 rounded-lg ">
          <button onClick={stopTracking}>Stop notifications</button>
        </div>
      )}
      <div
        className="flex flex-col w-full sm:w-[300px] border border-gray-300 rounded-3xl overflow-hidden bg-white shadow-md transform transition-transform duration-50 hover:scale-100 active:scale-110 hover:bg-gray-100 "
        onClick={() => {
          if (isTracking) {
            setShowTrackingModal(true); // Show modal if already tracked
          } else {
            setShowModal(true); // Show confirmation modal if not tracked
          }
        }} // Show the modal when clicked
      >
        <img
          src={image}
          alt="Parking"
          className="w-full h-[220px] object-cover p-3 rounded-3xl"
        />
        <div className="pt-1 px-4 pb-4">
          <div className="flex flex-row mx-2 sm:flex-row justify-between items-start sm:items-center">
            <div className="c11 flex flex-col gap-3">
              <div className="c1 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
              <div className="icon1">
                  <img src={P} alt="P" className="w-7" />
              </div>
                <p>{name}</p>
              </div>
              <div className="c2 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
              <div className="icon2">
                  <img src={clock} alt="" className="w-7" />
                </div>
                <p>{distance}</p>
              </div>
              <div className="c3 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
              <div className="icon3">
                  <img src={addressicon} alt="" className="w-7" />
                </div>
                <p>{address}</p>
              </div>
            </div>

            <div className="c22 flex flex-col gap-3">
              <div className="c4 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2">
              <div className="icon4">
                  <img src={priceicon} alt="" className="w-7" />
                </div>
                <p>Rs {price}</p>
              </div>
              <div className="c5 flex items-center text-sm font-bold text-gray-600 gap-2">
              <div className="icon5">
                  <img src={Car} alt="" className="w-7" />
                </div>
                <p>{carspotsLeft} spots</p>
              </div>
              <div className="c6 flex items-center text-sm font-bold text-gray-600 gap-2">
              <div className="icon6">
                  <img src={bike} alt="" className="w-7" />
                </div>
                <p>{bikespotsLeft} spots</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Initial Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px]">
            <h2 className="text-xl text-black font-bold mb-4">
              Do you want to track this parking?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={startTracking}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)} // Close the modal without tracking
                className="bg-red-300 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for already tracked parking */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-bold mb-4">
              This parking is already being tracked.
            </h2>
            <div className="flex justify-between">
              <button
                onClick={() => setShowTrackingModal(false)} // Close the modal
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ParkingBox;
