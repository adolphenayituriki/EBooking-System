const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'], required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 2 },
  description: String,
  amenities: [String],
  images: [String],
  available: { type: Boolean, default: true },
  floor: Number,
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
