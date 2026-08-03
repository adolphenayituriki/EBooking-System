require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const email = (process.argv[2] || '').toLowerCase();
if (!email) {
  console.log('Usage: node scripts/make-admin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
  if (!user) {
    console.log('No user found with email:', email);
    process.exit(1);
  }
  console.log(`${user.email} is now an admin (role=${user.role})`);
  process.exit(0);
}).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
