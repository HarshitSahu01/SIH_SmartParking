import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import SmallScreenErrorComponent from "../Components/SmallScreenError";

const ParkingSpaceForm = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 640);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (isSmallScreen) {
        return <SmallScreenErrorComponent />;
    }

    return (
        <div className="min-h-screen bg-custom-gradient flex flex-col">
            {/* Header */}
            <header className="w-full rounded-b-2xl flex justify-between items-center px-4 py-3">
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="w-12 h-8 md:w-16 md:h-10 rounded-full" />
                    <span className="ml-2 text-lg sm:text-2xl font-bold text-white tracking-tighter">
                        ParkSmart
                    </span>
                </div>
                <div className="cursor-pointer" onClick={() => setMenuOpen((prev) => !prev)}>
                    <svg
                        fill="none"
                        viewBox="0 0 50 50"
                        height="28"
                        width="28"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 md:w-12 md:h-12"
                    >
                        <path
                            className="lineTop line"
                            strokeLinecap="round"
                            strokeWidth="4"
                            stroke="white"
                            d="M6 11L44 11"
                        ></path>
                        <path
                            strokeLinecap="round"
                            strokeWidth="4"
                            stroke="white"
                            d="M6 24H43"
                            className="lineMid line"
                        ></path>
                        <path
                            strokeLinecap="round"
                            strokeWidth="4"
                            stroke="white"
                            d="M6 37H43"
                            className="lineBottom line"
                        ></path>
                    </svg>
                </div>
                {menuOpen && (
                    <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-32 sm:w-40">
                        <ul className="text-gray-800">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Admin Controls</li>
                        </ul>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center">
                <div className="w-11/12 max-w-4xl bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-xl font-semibold text-center text-gray-700 mb-6">
                        Parking Space Details
                    </h1>
                    <form className="grid grid-cols-3 gap-6">
                        {[
                            { id: "firstName", label: "First Name", placeholder: "Enter first name" },
                            { id: "middleName", label: "Middle Name", placeholder: "Enter middle name" },
                            { id: "lastName", label: "Last Name", placeholder: "Enter last name" },
                            { id: "phone", label: "Phone Number", placeholder: "Enter phone number" },
                            { id: "email", label: "Email", placeholder: "Enter email" },
                            { id: "org", label: "Select Organisation", placeholder: "Organisation" },
                            { id: "parkingName", label: "Parking Space Name", placeholder: "Enter name" },
                            { id: "address", label: "Address", placeholder: "Enter address" },
                            { id: "area", label: "Area", placeholder: "Enter area" },
                            { id: "city", label: "City", placeholder: "Enter city" },
                            { id: "state", label: "State", placeholder: "Enter state" },
                            { id: "slots", label: "Slots Provided", placeholder: "Enter slots provided" },
                            { id: "cost2w", label: "Cost of 2 Wheeler", placeholder: "Enter cost" },
                            { id: "cost4w", label: "Cost of 4 Wheeler", placeholder: "Enter cost" },
                        ].map((field) => (
                            <div key={field.id} className="col-span-1">
                                <label
                                    htmlFor={field.id}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    {field.label}
                                </label>
                                <input
                                    type="text"
                                    id={field.id}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#68BBE3] focus:outline-none"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                        <div className="col-span-3">
                            <button
                                type="submit"
                                className="w-full py-2 bg-custom-gradient text-white font-semibold rounded-md hover:bg-[#68BBE3] transition"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full rounded-t-2xl text-center py-2 text-white text-xs sm:text-sm">
                © 2024 ParkSmart ~ All rights reserved
            </footer>
        </div>
    );
};

export default ParkingSpaceForm;
