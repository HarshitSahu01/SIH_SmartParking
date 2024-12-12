import React, { useState } from "react";
import axios from "axios";

const ParkingBookingForm = () => {
    const [amount, setAmount] = useState("");
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // try {
        //     // Call the backend API to simulate booking and payment
        //     const res = await axios.post("/api/book-parking/", {
        //         amount,
        //     });

        //     const data = res.data;

        //     if (data.ticket_id) {
        //         // Payment was successful, and ticket is generated
        //         setTicket({
        //             ticket_id: data.ticket_id,
        //             qr_code_url: data.qr_code_url,
        //             slot_number: data.slot_number,
        //         });
        //     } else {
        //         alert("Booking or payment failed.");
        //     }
        // } catch (error) {
        //     console.error("Error during booking:", error);
        //     alert("An error occurred. Please try again.");
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Book Your Parking Slot
            </h2>
            <form onSubmit={handleBookingSubmit}>
                <label className="block text-sm font-medium text-gray-700">
                    Amount
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter amount"
                    required
                />
                <button
                    type="submit"
                    className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Book Slot"}
                </button>
            </form>

            {ticket && (
                <div className="mt-8 p-6 bg-gray-100 rounded-md">
                    <h3 className="text-xl font-semibold">Booking Successful</h3>
                    <p className="mt-2 text-sm">
                        <strong>Slot Number:</strong> {ticket.slot_number}
                    </p>
                    <p className="mt-2 text-sm">
                        <strong>Ticket ID:</strong> {ticket.ticket_id}
                    </p>
                    <img
                        src={ticket.qr_code_url}
                        alt="QR Code"
                        className="mt-4 w-32 h-32"
                    />
                </div>
            )}
        </div>
    );
};

export default ParkingBookingForm;
