const router = require('express').Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    console.log(`[Contact] ${name} (${email}) - ${subject}: ${message.substring(0, 50)}...`);
    res.json({ success: true, message: 'Your message has been received. We will get back to you within 24 hours.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
