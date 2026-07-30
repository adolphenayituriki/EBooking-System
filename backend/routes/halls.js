const router = require('express').Router();
const Hall = require('../models/Hall');

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const halls = await Hall.find(filter);
    res.json(halls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) return res.status(404).json({ error: 'Hall not found' });
    res.json(hall);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const hall = await Hall.create(req.body);
    res.status(201).json(hall);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hall);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Hall.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hall deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
