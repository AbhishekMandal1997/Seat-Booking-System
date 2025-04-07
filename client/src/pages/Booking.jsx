import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";
import "./Booking.css"; // Make sure to import your CSS if separate

export const Booking = () => {
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [numSeats, setNumSeats] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const fetchSeats = async () => {
        try {
            const res = await axios.get("/api/booking/seats");
            setBookedSeats(res.data);
        } catch (error) {
            setMessage({
                text: `Error fetching seats: ${error.message}`,
                type: "error",
            });
        }
    };

    useEffect(() => {
        fetchSeats();
    }, []);

    const handleSeatClick = (row, seat) => {
        const seatId = `${row}-${seat}`;
        const isBooked = bookedSeats.some((s) => s.row === row && s.seat === seat);

        if (isBooked) return;

        setSelectedSeats((prevSelected) => {
            if (prevSelected.includes(seatId)) {
                return prevSelected.filter((id) => id !== seatId);
            } else if (prevSelected.length < numSeats) {
                return [...prevSelected, seatId];
            }
            return prevSelected;
        });
    };

    const bookSeats = async () => {
        if (selectedSeats.length === 0) {
            setMessage({ text: "Please select seats to book", type: "warning" });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Please log in first");
            const payload = {
                selectedSeats: selectedSeats.map((id) => {
                    const [row, seat] = id.split("-").map(Number);
                    return { row, seat };
                }),
            };
            const { data } = await axios.post("/api/booking/book", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage({ text: data.message, type: "success" });
            setSelectedSeats([]);
            fetchSeats();
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Something went wrong during booking",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Please log in first");
            
            const { data } = await axios.post("/api/booking/reset", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: data.message, type: "success" });
            setSelectedSeats([]);
            fetchSeats();
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || err.message || "Reset failed",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderSeatGrid = () => {
        const seats = [];
        for (let i = 0; i < 80; i++) {
            const row = Math.floor(i / 7);
            const seat = i % 7;
            if (row === 11 && seat > 2) continue;

            const seatId = `${row}-${seat}`;
            const isBooked = bookedSeats.some((s) => s.row === row && s.seat === seat);
            const isSelected = selectedSeats.includes(seatId);

            seats.push(
                <button
                    key={seatId}
                    className={`seat ${isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                    onClick={() => handleSeatClick(row, seat)}
                    disabled={isBooked}
                >
                    {row * 7 + seat + 1}
                </button>
            );
        }
        return seats;
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                Train Seat Booking
            </h1>
            {message.text && (
                <Alert
                    message={message.text}
                    type={message.type}
                    onClose={() => setMessage({ text: "", type: "" })}
                />
            )}
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                    Number of Seats (1–7)
                </label>
                <input
                    type="number"
                    min="1"
                    max="7"
                    value={numSeats}
                    onChange={(e) => {
                        const value = Number(e.target.value) || 1;
                        setNumSeats(Math.min(7, Math.max(1, value)));
                        setSelectedSeats([]);
                    }}
                    className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="seat-container">{renderSeatGrid()}</div>
            <div className="mt-6 flex justify-between items-center">
                <div>
                    Selected:{" "}
                    <span className="font-semibold">
                        {selectedSeats.join(", ") || "None"}
                    </span>
                </div>
                <div className="space-x-4">
                    <button
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        disabled={loading || selectedSeats.length !== numSeats}
                        onClick={bookSeats}
                    >
                        {loading ? "Booking..." : "Book Seats"}
                    </button>
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        disabled={loading}
                        onClick={resetBookings}
                    >
                        Reset All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;
