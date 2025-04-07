import { useEffect, useState } from "react";
import axios from "axios";
import SeatRow from "../components/SeatRow";
import Alert from "../components/Alert";

export const Booking = () => {
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [numSeats, setNumSeats] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const fetchSeats = async () => {
        try {
            const res = await axios.get("/api/booking/seats");
            console.log("Fetched booked seats:", res.data);
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
        
        if (isBooked) {
            console.log('Seat is booked, cannot select:', seatId);
            return;
        }

        setSelectedSeats(prevSelected => {
            if (prevSelected.includes(seatId)) {
                return prevSelected.filter(id => id !== seatId);
            } else if (prevSelected.length < numSeats) {
                return [...prevSelected, seatId];
            }
            console.log('Selection limit reached:', { numSeats, current: prevSelected.length });
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
            console.log("Booking payload:", payload);
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
            const { data } = await axios.post("/api/booking/reset");
            setMessage({ text: data.message, type: "success" });
            setSelectedSeats([]);
            fetchSeats();
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Reset failed",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderSeatRows = () => {
        const rows = [];
        for (let row = 0; row < 12; row++) {
            const seatsInRow = row === 11 ? 3 : 7;
            rows.push(
                <SeatRow
                    key={row}
                    row={row}
                    seats={seatsInRow}
                    bookedSeats={bookedSeats}
                    selectedSeats={selectedSeats}
                    onSeatClick={handleSeatClick}
                />
            );
        }
        return rows;
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
                    Number of Seats (1-7)
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
            <div className="grid gap-3">{renderSeatRows()}</div>
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