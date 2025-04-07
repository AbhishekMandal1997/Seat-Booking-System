const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

// Get all bookings
router.get('/seats', async (req, res) => {
    try {
        const bookings = await Booking.find();
        const bookedSeats = bookings.flatMap(b => b.seats);
        res.json(bookedSeats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Book seats
router.post('/book', auth, async (req, res) => {
    try {
        const { selectedSeats } = req.body;
        console.log('Received selectedSeats:', selectedSeats);
        const numSeatsParsed = selectedSeats.length;
        if (!selectedSeats || numSeatsParsed > 7 || numSeatsParsed < 1) {
            return res.status(400).json({ message: 'Invalid number of seats. Must be between 1 and 7.' });
        }

        const bookings = await Booking.find();
        const bookedSeats = bookings.flatMap((b) => b.seats);

        // Check for double-booking
        const alreadyBooked = selectedSeats.some((s) =>
            bookedSeats.some((bs) => bs.row === s.row && bs.seat === s.seat)
        );
        if (alreadyBooked) {
            return res.status(400).json({ message: 'Some selected seats are already booked' });
        }

        const booking = new Booking({
            userId: req.user.userId,
            seats: selectedSeats,
        });
        await booking.save();
        console.log('Booking saved:', booking);

        res.json({ message: 'Seats booked successfully', seats: selectedSeats });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset all bookings (admin only)
router.post('/reset', auth, async (req, res) => {
    try {
        // Delete all bookings
        await Booking.deleteMany({});
        res.json({ message: 'All bookings have been reset' });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ message: 'Server error during reset' });
    }
});

module.exports = router;