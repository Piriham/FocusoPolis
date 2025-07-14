require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focusopolis_v2', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    const users = await User.find({}, { username: 1, _id: 0 });
    console.log('Usernames in database:');
    users.forEach(u => console.log(u.username));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

listUsers(); 