const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  goal: {
    amount: { type: Number },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    setBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    setAt: { type: Date }
  },
  messages: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: String,
    message: String,
    timestamp: Date
  }]
});

module.exports = mongoose.model('Room', roomSchema); 