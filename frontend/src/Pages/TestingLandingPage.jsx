import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import car from "../assets/CarTest.gif";
import logo from "../assets/parking_logo.svg";
import arr from "../assets/getStartedArr.gif";
import test from "../assets/test.svg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="lan-main min-h-screen bg-[#fff] flex flex-col items-center">
  {/* Header */}
  <header className="w-full rounded-b-2xl flex justify-between items-center px-4 py-3 bg-blue-400/60 relative">
    <div className="flex items-center">
      <img src={logo} alt="Logo" className="w-16 h-10 md:w-20 sm:h-12 rounded-full" />
      <span className="ml-2 text-lg sm:text-2xl font-bold text-gray-800 tracking-tighter">
        ParkSmart
      </span>
    </div>
    <div
      className="cursor-pointer"
      onClick={() => setMenuOpen((prev) => !prev)}
    >
      <svg
        fill="none"
        viewBox="0 0 50 50"
        height="28"
        width="28"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 md:w-16 md:-16"
      >
        <path
          className="lineTop line"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="black"
          d="M6 11L44 11"
        ></path>
        <path
          strokeLinecap="round"
          strokeWidth="4"
          stroke="black"
          d="M6 24H43"
          className="lineMid line"
        ></path>
        <path
          strokeLinecap="round"
          strokeWidth="4"
          stroke="black"
          d="M6 37H43"
          className="lineBottom line"
        ></path>
      </svg>
    </div>
    {menuOpen && (
      <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-32 sm:w-40">
        <ul className="text-gray-800">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            Admin Controls
          </li>
        </ul>
      </div>
    )}
  </header>

  {/* Main Content */}
  <main className="flex flex-col items-center gap-3 mx-auto h-[89vh] md:h-[93vh] text-center">
    <div className="motion-preset-slide-right motion-opacity-in-[50%] motion-blur-in-[2px] motion-duration-[1.13s]/opacity motion-delay-[0.75s]/blur">
      <img src={test} alt="Illustration" className="w-[75vw] md:w-[60vw]" />
    </div>

    <img
      src={car}
      alt="Car animation"
      className="motion-opacity-in-[50%] motion-duration-[1.13s]/opacity motion-delay-[0.75s]/blur rounded-full w-[80vw] sm:w-[60vw] motion-preset-shake"
    />
    <p className="mt-3 mx-auto motion-preset-slide-right motion-delay-1000  text-xl md:text-2xl font-bold">
      Discover nearby parkings, save time, and park smartly.
    </p>
    <div className="get-started mt-3 flex justify-center items-center gap-5 pb-4">
      <button className="w-56 h-16 motion-opacity-in-[50%] motion-blur-in-[2px] motion-duration-[1.13s]/opacity motion-delay-[0.75s]/blur motion-preset-expand drop-shadow-lg text-lg sm:text-xl font-semibold px-4 sm:px-5 py-2 border-2 border-blue-950 rounded-full relative text-black transition-all overflow-hidden bg-blue-200/75 shadow-sm shadow-white hover:text-white group">
        <a
          href="#getstarted"
          className="pl-2 flex gap relative z-10 text-xl font-bold no-underline transition-colors"
        >
          Get Started <img className="opacity-70 w-14 md:w-16" src={arr} alt="Arrow" />
        </a>
        <span className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 rounded-full transition-all"></span>
      </button>
    </div>
  </main>

  {/* Footer */}
  <footer className="w-full rounded-t-2xl sticky bottom-0 text-center py-2  bg-blue-300/75 text-gray-700 text-xs sm:text-sm">
    © 2024 ParkSmart ~ All rights reserved
  </footer>
</div>

  );
};

export default LandingPage;
