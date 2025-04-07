function SeatRow({ row, seats, bookedSeats, selectedSeats, onSeatClick }) {
    return (
        <div className="flex justify-center">
            {Array(seats)
                .fill()
                .map((_, seat) => {
                    const seatId = `${row}-${seat}`;
                    const isBooked = bookedSeats.some(
                        (s) => s.row === row && s.seat === seat
                    );
                    const isSelected = selectedSeats.includes(seatId);
                    console.log('Rendering seat:', { row, seat, seatId, isBooked, isSelected }); // Debug log
                    return (
                        <button
                            key={seat}
                            onClick={() => onSeatClick(row, seat)}
                            disabled={isBooked}
                            className={`w-10 h-10 m-1 rounded-full flex items-center justify-center text-white font-semibold transition-all ${isBooked
                                    ? "bg-red-500 cursor-not-allowed"
                                    : isSelected
                                        ? "bg-green-500"
                                        : "bg-gray-300 hover:bg-gray-400"
                                }`}
                        >
                            {seat + 1}
                        </button>
                    );
                })}
        </div>
    );
}

export default SeatRow;