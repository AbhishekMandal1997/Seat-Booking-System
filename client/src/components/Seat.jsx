function Seat({ row, seat, isBooked, isSelected, onSelect }) {
    return (
        <button
            onClick={() => onSelect(row, seat)}
            disabled={isBooked}
            className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}

        >
            {seat + 1}
        </button>
    );
}

export default Seat;