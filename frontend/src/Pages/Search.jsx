import React, { useState, useEffect } from "react";
import ParkingBox from "../Components/ParkingBox";
import P from "../assets/P.png";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");

  // Sample data for parking spots
  const parkingData = [
    {
      name: "Abdul Parking Boom",
      price: "30/hr",
      distance: "5 mins",
      carspots: 35,
      bikespots: 12,
      address: "Lapataganj, Ganj, Ga",
      image: P,
    },
    {
      name: "Ram Parking Not Boom",
      price: "29/hr",
      distance: "7 mins",
      carspots: 30,
      bikespots: 15,
      address: "PappuPapa, Papa, Pa",
      image: P,
    },
    {
      name: "Bheem Parking Not Chutki",
      price: "15/hr",
      distance: "17 mins",
      carspots: 50,
      bikespots: 32,
      address: "DholuBholu, DhoBho, LuLu",
      image: P,
    },
  ];

  const [filteredParkingData, setFilteredParkingData] = useState(parkingData);

  // Filter and sort parking data
  useEffect(() => {
    const filteredData = parkingData
      .filter((parking) => {
        const matchesSearch =
          parking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parking.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (!filterBy) return 0; // No sorting if no filter selected

        switch (filterBy) {
          case "distance":
            return parseInt(a.distance) - parseInt(b.distance); // Sorting by distance (ascending)
          case "price":
            return parseInt(a.price) - parseInt(b.price); // Sorting by price (ascending)
          case "carspots":
            return parseInt(b.carspots) - parseInt(a.carspots); // Sorting by carspots (descending)
          case "bikespots":
            return parseInt(b.bikespots) - parseInt(a.bikespots); // Sorting by bikespots (descending)
          default:
            return 0;
        }
      });

    setFilteredParkingData(filteredData);
  }, [searchTerm, filterBy]);

  return (
    <div className="bg-transparent">
      <div className="p-4 space-y-6 bg-transparent">
        <div>
          <div className="search-filter flex gap-4 mb-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by name or address"
              className="border rounded-lg p-2 flex-grow text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Dropdown */}
            <select
              className="border rounded-lg p-2 text-black"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="">Filter By</option>
              <option value="distance">Distance</option>
              <option value="price">Price</option>
              <option value="carspots">Car Spots</option>
              <option value="bikespots">Bike Spots</option>
            </select>
          </div>

          <h1 className="text-2xl text-gray-800 font-bold">
            Parkings Available Near You!
          </h1>

          {filteredParkingData.length > 0 ? (
            filteredParkingData.map((parking, index) => (
              <ParkingBox
                key={index}
                name={parking.name}
                price={parking.price}
                distance={parking.distance}
                carspots={parking.carspots}
                bikespots={parking.bikespots}
                address={parking.address}
                image={parking.image}
              />
            ))
          ) : (
            <p className="text-gray-500">No parking spots match your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
