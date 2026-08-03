const router = require('express').Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');

router.get('/availability', async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.query;
    const filter = {};
    if (guests) filter.capacity = { $gte: Number(guests) };

    const [rooms, bookings] = await Promise.all([
      Room.find(filter),
      Booking.find({ bookingType: 'Room', status: { $ne: 'Cancelled' }, checkIn: { $exists: true }, checkOut: { $exists: true } }),
    ]);

    let available = rooms;
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;
      available = rooms.filter((room) =>
        !bookings.some((b) =>
          String(b.itemId) === String(room._id) &&
          overlaps(inDate, outDate, new Date(b.checkIn), new Date(b.checkOut))
        )
      );
    }
    res.json(available);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
