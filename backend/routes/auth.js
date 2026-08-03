const router = require('express').Router();
const crypto = require('crypto');
const User = require('../models/User');

const hash = (pw, salt = crypto.randomBytes(16).toString('hex')) =>
  salt + ':' + crypto.pbkdf2Sync(pw, salt, 1000, 64, 'sha512').toString('hex');

const verify = (pw, hashed) => {
  const [salt, key] = hashed.split(':');
  return hash(pw, salt) === hashed;
};

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

router.get('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, phone, password: hash(password) });
    res.status(201).json({ user: sanitize(user) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !verify(password, user.password)) return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/guest', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.json({ user: sanitize(user) });
    const newUser = await User.create({ name, email, phone, password: hash('guest-' + crypto.randomBytes(8).toString('hex')) });
    res.status(201).json({ user: sanitize(newUser) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
