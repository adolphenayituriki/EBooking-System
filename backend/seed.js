require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Service = require('./models/Service');
const Hall = require('./models/Hall');

const rooms = [
  { name: 'Standard Single', type: 'Single', price: 80, capacity: 1, description: 'Cozy room with modern amenities for solo travelers.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'], floor: 1 },
  { name: 'Classic Double', type: 'Double', price: 130, capacity: 2, description: 'Spacious room with queen bed and city view.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe'], floor: 2 },
  { name: 'Luxury Suite', type: 'Suite', price: 250, capacity: 2, description: 'Elegant suite with separate living area and panoramic views.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Bathtub', 'Balcony'], floor: 4 },
  { name: 'Deluxe Room', type: 'Deluxe', price: 180, capacity: 2, description: 'Premium room with top-tier comfort and elegance.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Coffee Maker'], floor: 3 },
  { name: 'Presidential Suite', type: 'Presidential', price: 500, capacity: 4, description: 'The ultimate luxury experience with private butler service.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Bathtub', 'Balcony', 'Jacuzzi', 'Private Pool'], floor: 5 },
];

const services = [
  { name: 'Swedish Massage', category: 'Massage', description: 'Full body relaxation massage with essential oils.', price: 60, duration: '60 min' },
  { name: 'Deep Tissue Massage', category: 'Massage', description: 'Therapeutic massage targeting deep muscle tension.', price: 80, duration: '75 min' },
  { name: 'Hot Stone Therapy', category: 'Massage', description: 'Heated stone massage for ultimate relaxation.', price: 90, duration: '90 min' },
  { name: 'Couples Massage', category: 'Massage', description: 'Relax together with our signature couples treatment.', price: 140, duration: '60 min' },
  { name: 'Full Body Spa Treatment', category: 'Spa', description: 'Complete spa experience with scrub, wrap, and facial.', price: 120, duration: '120 min' },
  { name: 'Facial Rejuvenation', category: 'Spa', description: 'Premium facial treatment for glowing skin.', price: 50, duration: '45 min' },
  { name: 'Fine Dining Experience', category: 'Dining', description: '5-course meal at our rooftop restaurant.', price: 75, duration: '2 hours' },
  { name: 'Poolside Bar', category: 'Dining', description: 'Refreshing cocktails and light bites by the pool.', price: 20, duration: 'Open' },
  { name: 'Personal Training', category: 'Fitness', description: 'One-on-one fitness session with expert trainer.', price: 40, duration: '60 min' },
  { name: 'Pool Access', category: 'Swimming', description: 'Full day access to our infinity pool.', price: 15, duration: 'Full Day' },
  { name: 'Airport Transfer', category: 'Transport', description: 'Luxury sedan airport pickup/drop-off.', price: 50, duration: 'One Way' },
  { name: 'Express Laundry', category: 'Laundry', description: 'Same-day laundry and dry cleaning service.', price: 25, duration: '4 hours' },
];

const halls = [
  { name: 'Victory Conference Hall', type: 'Conference', capacity: 100, price: 500, description: 'State-of-the-art conference hall with projector and sound system.', amenities: ['Projector', 'Sound System', 'WiFi', 'Whiteboard', 'Mic'] },
  { name: 'Golden Garden', type: 'Wedding', capacity: 200, price: 1500, description: 'Beautiful outdoor garden venue for dream weddings.', amenities: ['Stage', 'Lighting', 'Sound System', 'Parking', 'Bridal Suite'] },
  { name: 'Royal Banquet Hall', type: 'Banquet', capacity: 150, price: 800, description: 'Elegant indoor banquet hall for grand celebrations.', amenities: ['Stage', 'Lighting', 'Sound System', 'Kitchen Access', 'Parking'] },
  { name: 'Executive Meeting Room', type: 'Meeting', capacity: 20, price: 150, description: 'Intimate meeting room for corporate discussions.', amenities: ['Projector', 'WiFi', 'Whiteboard', 'Coffee Service'] },
  { name: 'Sunset Terrace', type: 'Garden', capacity: 80, price: 600, description: 'Open-air terrace with stunning sunset views.', amenities: ['Lighting', 'Sound System', 'Bar Service', 'Parking'] },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Room.deleteMany({});
  await Service.deleteMany({});
  await Hall.deleteMany({});
  await Room.insertMany(rooms);
  await Service.insertMany(services);
  await Hall.insertMany(halls);
  console.log('Database seeded!');
  process.exit();
};

seedDB();
