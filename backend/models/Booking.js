const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  bookingType: { type: String, enum: ['Room', 'Service', 'Hall'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'bookingType', required: true },
  checkIn: Date,
  checkOut: Date,
  date: Date,
  time: String,
  guests: { type: Number, default: 1 },
  specialRequests: String,
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
  totalPrice: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isGuest: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
