function Seat({ row, seat, isBooked, isSelected, onSelect }) {
    return (
        <button
            onClick={() => onSelect(row, seat)}
            disabled={isBooked}
            className={`w-12 h-12 m-1 rounded-full flex items-center justify-center text-white font-semibold transition-all ${isBooked
                    ? 'bg-red-500 cursor-not-allowed'
                    : isSelected
                        ? 'bg-green-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                }`}
        >
            {seat + 1}
        </button>
    );
}

export default Seat;