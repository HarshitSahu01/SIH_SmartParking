import React from "react";
import P from "../assets/P.png"
import Car from "../assets/car.png"
import clock from "../assets/clock.png"
import price from "../assets/price.png"
const ParkingBox = () => {
    return (
        <div className="flex mx-2 mt-4 ">
            <div className="flex flex-col w-full sm:w-[300px] border border-gray-300 rounded-3xl overflow-hidden bg-white shadow-md transform transition-transform duration-50 hover:scale-100 active:scale-110 hover:bg-gray-100">
                <img
                    src="https://img.freepik.com/premium-photo/parking-lot-with-car-parked-it-parking-lot-with-sign-that-says-no-parking_1023064-45887.jpg?semt=ais_hybrid"
                    alt="Parking"
                    className="w-full h-[220px] object-cover p-3 rounded-3xl"
                />
                <div className="pt-1 px-4 pb-4">
                    <div className="flex flex-row mx-2 sm:flex-row justify-between items-start sm:items-center">
                        <div className="c11 flex flex-col gap-3">
                            <div className="c1 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2 ">
                                <div className="icon1"><img src={P} alt="" className="w-7"/></div>
                                Abdul parking boom
                            </div>
                            <div className="c2 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2 ">
                                <div className="icon2"><img src={clock} alt="" className="w-7" /></div>
                                <p>
                                    5 mins
                                </p>
                            </div>
                        </div>

                        <div className="c22 flex flex-col gap-3">
                            <div className="c2 flex items-center text-sm font-bold text-gray-600 mb-2 sm:mb-0 gap-2 ">
                                <div className="icon3"><img src={price} alt="" className="w-7" /></div>
                                <p>
                                Rs 30/hr
                                </p>

                            </div>
                            <div className="c4 flex items-center text-sm font-bold text-gray-600 gap-2 ">
                                <div className="icon4"><img src={Car} alt="" className="w-7" /></div>
                                28 spots
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkingBox;
