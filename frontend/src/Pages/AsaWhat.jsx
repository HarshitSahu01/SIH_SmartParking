import React from 'react';
import { useNavigate } from 'react-router-dom';
import car from "../assets/marker-user-removebg.png"
import truck from "../assets/boxtruck.png"
export default function AsaWhat() {
  const router = useNavigate();

  const handleChoice = (choice) => {
    if (choice === 'city') {
      router('/maps');
    } else if (choice === 'logistics') {
      router('/logistics');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-custom-gradient">
     <div className="main w-80 flex flex-col justify-center items-center h-3/4 bg-white backdrop-blur-2xl border-4 p-5 mx-auto drop-shadow-2xl rounded-lg border-white shadow-sm shadow-white motion-preset-shrink">

      <h1 className="mb-6 text-3xl font-bold text-black ">
        How do you want to access the parking?
      </h1>
      <div className="flex space-x-4 flex-col justify-center items-center gap-4">
        <button
          onClick={() => handleChoice('city')}
           className="px-6 py-3 bg-gray-300 text-black text-xl font-medium rounded-lg  focus:outline-none focus:ring-2 focus:ring-purple-500 motion-preset-fade-lg"
          >
         <img src={car} alt="" className='m-2 w-32 h-32'/> As a City User
        </button>
        <button
          onClick={() => handleChoice('logistics')}
          className="px-6 py-3 bg-gray-300 text-black text-xl font-medium rounded-lg  focus:outline-none focus:ring-2 focus:ring-purple-500 motion-preset-fade-lg"
          >
         <img src={truck} alt="" className='m-2 w-32 h-32'/>
          As a Logistics User
        </button>
      </div>
            </div>
    </div>
  );
}

