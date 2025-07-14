const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/focusopolis_v2')
  .then(() => {
    console.log('MongoDB is running and accessible!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 