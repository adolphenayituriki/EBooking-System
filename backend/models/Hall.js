const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Conference', 'Wedding', 'Banquet', 'Meeting', 'Garden'], required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: String,
  amenities: [String],
  images: [String],
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Hall', hallSchema);
