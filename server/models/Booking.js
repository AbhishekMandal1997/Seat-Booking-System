const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seats: [{ row: Number, seat: Number }],
    bookedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);