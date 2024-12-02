import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import car from "../assets/Car.mp4";

const LandingPage = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    const handleButtonClick = () => {
        setButtonClicked(true);
        setTimeout(() => {
            setButtonClicked(false);
            navigate("/next-page");
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#B0BEC5] flex flex-col items-center justify-center">
            <header className="w-full flex justify-between items-center px-4 py-3 bg-white bg-opacity-60 relative">
                <div className="flex items-center">
                    <img
                        src="../assets/green-circle.png"
                        alt="Logo"
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="ml-2 text-lg font-semibold text-gray-800 tracking-tighter">
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
                        height="30"
                        width="30"
                        xmlns="http://www.w3.org/2000/svg"
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
                    <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-40">
                        <ul className="text-gray-800">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                Admin Controls
                            </li>
                        </ul>
                    </div>
                )}
            </header>

            <main className="flex-grow flex flex-col items-center justify-center text-center">
                <video
                    className="h-80 w-80 rounded-full"
                    autoPlay
                    loop
                    muted
                >
                    <source src={car} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <button
                    onClick={handleButtonClick}
                    className={`mt-6 bg-red-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg ${
                        buttonClicked ? "animate-bounce" : ""
                    }`}
                    style={{
                        transition: "box-shadow 0.3s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.8)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.boxShadow = "none";
                    }}
                >
                    GET STARTED
                </button>
            </main>

            <footer className="w-full text-center py-2 bg-white bg-opacity-60 text-gray-700 text-sm">
                Copyright © ParkSmart ~ All rights reserved
            </footer>
        </div>
    );
};

export default LandingPage;
