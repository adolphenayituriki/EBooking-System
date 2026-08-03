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
  { name: 'Swedish Massage', category: 'Massage', description: 'Full body relaxation massage with essential oils, inspired by Rwandan wellness traditions.', price: 60, duration: '60 min', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  { name: 'Deep Tissue Massage', category: 'Massage', description: 'Therapeutic massage targeting deep muscle tension, perfect after a day exploring Kigali.', price: 80, duration: '75 min', image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80' },
  { name: 'Hot Stone Therapy', category: 'Massage', description: 'Heated stone massage using locally sourced volcanic stones for deep relaxation.', price: 90, duration: '90 min', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80' },
  { name: 'Full Body Spa Treatment', category: 'Spa', description: 'Complete spa experience with Rwandan coffee scrub, body wrap, and rejuvenating facial.', price: 120, duration: '120 min', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80' },
  { name: 'Facial Rejuvenation', category: 'Spa', description: 'Premium facial treatment using natural Rwandan ingredients for glowing skin.', price: 50, duration: '45 min', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80' },
  { name: 'Fine Dining Experience', category: 'Dining', description: '5-course meal featuring Rwandan cuisine at our rooftop restaurant overlooking Kigali.', price: 75, duration: '2 hours', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
  { name: 'Personal Training', category: 'Fitness', description: 'One-on-one fitness session with an expert trainer in our hillside-view gym.', price: 40, duration: '60 min', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  { name: 'Pool Access', category: 'Swimming', description: 'Full day access to our infinity pool overlooking the Kigali hills.', price: 15, duration: 'Full Day', image: 'https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?w=600&q=80' },
];

const halls = [
  { name: 'Victory Conference Hall', type: 'Conference', capacity: 100, price: 500, description: 'State-of-the-art conference hall with projector and sound system.', amenities: ['Projector', 'Sound System', 'WiFi', 'Whiteboard', 'Mic'], images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80'] },
  { name: 'Golden Garden', type: 'Wedding', capacity: 200, price: 1500, description: 'Beautiful outdoor garden venue for dream weddings.', amenities: ['Stage', 'Lighting', 'Sound System', 'Parking', 'Bridal Suite'], images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80'] },
  { name: 'Royal Banquet Hall', type: 'Banquet', capacity: 150, price: 800, description: 'Elegant indoor banquet hall for grand celebrations.', amenities: ['Stage', 'Lighting', 'Sound System', 'Kitchen Access', 'Parking'], images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80'] },
  { name: 'Executive Meeting Room', type: 'Meeting', capacity: 20, price: 150, description: 'Intimate meeting room for corporate discussions.', amenities: ['Projector', 'WiFi', 'Whiteboard', 'Coffee Service'], images: ['https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&q=80'] },
  { name: 'Sunset Terrace', type: 'Garden', capacity: 80, price: 600, description: 'Open-air terrace overlooking Kigali with stunning sunset views.', amenities: ['Lighting', 'Sound System', 'Bar Service', 'Parking'], images: ['https://images.unsplash.com/photo-1526047932273-34113c170e08?w=600&q=80'] },
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
