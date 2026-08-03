const router = require('express').Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Service = require('../models/Service');
const Hall = require('../models/Hall');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
const items = { rooms: Room, services: Service, halls: Hall };

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [bookings, rooms, services, halls, users, revenueAgg] = await Promise.all([
      Booking.countDocuments(),
      Room.countDocuments(),
      Service.countDocuments(),
      Hall.countDocuments(),
      User.countDocuments(),
      Booking.aggregate([
        { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);
    res.json({ bookings, rooms, services, halls, users, revenue: revenueAgg[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recent bookings
router.get('/recent-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(8).populate('itemId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Booking management
router.get('/bookings', async (req, res) => {
  try {
    const { status, bookingType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (bookingType) filter.bookingType = bookingType;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).populate('itemId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!BOOKING_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('itemId');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Items CRUD (rooms / services / halls)
router.post('/items/:type', async (req, res) => {
  try {
    const Model = items[req.params.type];
    if (!Model) return res.status(400).json({ error: 'Invalid item type' });
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/items/:type/:id', async (req, res) => {
  try {
    const Model = items[req.params.type];
    if (!Model) return res.status(400).json({ error: 'Invalid item type' });
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/items/:type/:id', async (req, res) => {
  try {
    const Model = items[req.params.type];
    if (!Model) return res.status(400).json({ error: 'Invalid item type' });
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
