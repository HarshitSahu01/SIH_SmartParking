import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";
import { getCSRFToken, backendUrl } from "../assets/scripts/utils";

const Book = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { carPrice, bikePrice, parkingName } = location.state || {};

  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const handlesubmit = () => {
    // Pass data to '/book-form'
    navigate("/book-form", {
      state: {
        carPrice,
        bikePrice,
        parkingName,
      },
    });
  };

  useEffect(() => {
    axios
      .get(`${backendUrl()}/ping`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.id != null) {
          alert("User already logged in!");
          navigate("/book-form");
        } else {
          console.log("Not logged in");
        }
      })
      .catch((error) => {
        console.log(error.response);
        setHasError(true); // Set error state when there is a failure
      });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    axios
      .post(
        `${backendUrl()}/login`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(), // Include CSRF token
          },
          withCredentials: true, // Include cookies (sessionid)
        }
      )
      .then((response) => {
        console.log("Login successful");
        console.log(response.data);
        navigate("/book-form");
      })
      .catch((error) => {
        setErrorMessage("Login failed. Please try again.");
        console.log(error.response);
        setHasError(true); // Handle error on login
      });
  };

  if (hasError) {
    return (
      <div className="error-container">
        <h2>Something went wrong. Please try again later.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-gradient flex flex-col">
      {/* Header */}
      <header className="w-full min-h-[8vh] rounded-b-2xl flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-12 md:w-16 md:h-10" />
          <span className="ml-2 text-2xl sm:text-2xl font-semibold text-white tracking-tighter">
            Park-N-Go
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
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate("/pay")}
              >
                Admin Controls
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-11/12 max-w-sm bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold text-center text-gray-700">Login</h1>
          {errorMessage && (
            <p className="mt-2 text-center text-red-600">{errorMessage}</p>
          )}
          <form className="mt-6" onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-[#68BBE3] focus:outline-none"
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-[#68BBE3] focus:outline-none"
                placeholder="Password"
              />
            </div>
            <button
              className="w-full px-4 py-2 bg-custom-gradient text-white font-semibold rounded-md shadow-md hover:bg-[#68BBE3] hover:shadow-lg transition"
              onClick={handlesubmit}
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register-user" className="text-[#003060] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full rounded-t-2xl text-center py-2 text-white text-xs sm:text-sm">
        © 2024 ParkSmart ~ All rights reserved
      </footer>
    </div>
  );
};

export default Book;
