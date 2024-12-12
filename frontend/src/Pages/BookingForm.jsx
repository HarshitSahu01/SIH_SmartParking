import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // import useNavigate
import { QRCodeCanvas } from 'qrcode.react';

function TicketGenerator() {
  const location = useLocation();
  const navigate = useNavigate(); // initialize useNavigate hook

  const { id, carPrice, bikePrice, parkingName } = location.state || {};
  console.log(carPrice);
  const [isClicked, setIsClicked] = useState(false);
  const [userName, setUserName] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [ticket, setTicket] = useState(null);
  const [payComp, setPayComp] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(carPrice); // Set initial price based on carPrice
  const [vehicleType, setVehicleType] = useState('car'); // Default vehicle type

  const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  };
  const handleClick = () => {
    // Perform your action here
    console.log('Button clicked!');
    setIsClicked(true); // Disable the button after clicking
  };
  // Update the price whenever the time slot or vehicle type changes
  useEffect(() => {
    if (vehicleType === 'car') {
      setSelectedPrice(carPrice);
    } else if (vehicleType === 'bike') {
      setSelectedPrice(bikePrice);
    }
  }, [vehicleType, carPrice, bikePrice]);

  const handleGenerateTicket = () => {
    if (!userName || !timeSlot || !vehicleNo) {
      alert('Please fill all the fields: Name, Time Slot, and Vehicle Number.');
      return;
    }

    const currentDate = new Date().toLocaleString();
    const randomNumber = generateRandomNumber();

    const generatedTicket = {
      name: userName,
      date: currentDate,
      slot: timeSlot,
      vehicleNo: vehicleNo,
      price: selectedPrice, // Include price in the ticket data
      qrCode: randomNumber,
    };

    setTicket(generatedTicket);
  };

  const handleMakePayment = () => {
    // Set payComp to true when user clicks Make Payment
    setPayComp(true);
    setTicket(null); // Hide the ticket display when payment starts

    // Navigate to the Pay component and pass selectedPrice as state
    navigate('/pay', { state: { carPrice: selectedPrice } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-custom-gradient p-6">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-md motion-preset-slide-right">
        <h1 className="text-2xl tracking-tight font-bold text-black mb-4">Generate Your Parking Ticket</h1>
        
        {/* Vehicle Type Select Dropdown */}
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>
        
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter your vehicle number"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a time slot</option>
          <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
          <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
          <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
          <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
          <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
          <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
          <option value="6:00 PM - 7:00 PM">7:00 PM - 8:00 PM</option>
          <option value="7:00 PM - 8:00 PM">8:00 PM - 9:00 PM</option>
        </select>

        {/* Display the price automatically when a slot is selected */}
        <div className="mb-4 w-full px-4 py-2 border rounded-lg bg-gray-100">
          <p className="text-gray-700">{vehicleType === 'car' ? 'Car Slot Price' : 'Bike Slot Price'}: Rs {selectedPrice}</p>
        </div>

        {/* Generate Ticket Button */}
        <button
      onClick={() => {
        handleClick(); // First function
        handleGenerateTicket(); // Second function
      }}
      disabled={isClicked} // Disable the button based on state
      className={`mb-4 w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        isClicked ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
         Generate Ticket
        </button>

        {ticket && !payComp && (
          <div className="mt-6 bg-gray-50 shadow-md p-4 rounded-lg text-center flex flex-col justify-center items-center motion-preset-slide-up">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Parking Ticket of {parkingName}</h2>
            <h2 className="text-lg font-bold text-gray-800 mb-2"> {id}</h2>
            <p className="text-gray-700">Name: {ticket.name}</p>
            <p className="text-gray-700">Vehicle No: {ticket.vehicleNo}</p>
            <p className="text-gray-700">Date: {ticket.date}</p>
            <p className="text-gray-700">Time Slot: {ticket.slot}</p>
            <p className="text-gray-700">Price: Rs {ticket.price}</p>
            <div className="mt-4">
              <QRCodeCanvas value={String(ticket.qrCode)} size={150} />
            </div>
            <p className="mt-2 text-gray-600">Ticket ID: {ticket.qrCode}</p>
            <button
              onClick={handleMakePayment}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Make Payment
            </button>
            <h1>Take a SnapShot!</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketGenerator;
