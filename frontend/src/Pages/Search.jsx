import React from "react";
import SearchHeader from "../Components/search";
import ParkingBox from "../Components/ParkingBox";

const Search = () => {
  return (
    <div className="bg-[#B2C9FF] min-h-screen">
      <SearchHeader />

      <div className="p-4 space-y-6 bg-gray-100">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Nearby Parkings
          </h2>
          <ParkingBox
            name="Abdul Parking Boom"
            price="30/hr"
            distance="5 mins"
            spots="28"
            image="nearby-parking.jpg"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Liked Parkings
          </h2>
          <ParkingBox
            name="Ram Parking Not Boom"
            price="29/hr"
            distance="7 mins"
            spots="15"
            image="liked-parking.jpg"
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
