const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Massage', 'Spa', 'Dining', 'Fitness', 'Swimming', 'Laundry', 'Transport', 'Other'], required: true },
  description: String,
  price: { type: Number, required: true },
  duration: String,
  available: { type: Boolean, default: true },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
