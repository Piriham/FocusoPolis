require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const Room = require('./models/Room');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focusopolis_v2', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Socket.IO authentication and chat logic
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return next(new Error('Authentication error'));
    socket.user = user;
    next();
  });
});

io.on('connection', (socket) => {
  // Join a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  // Handle chat messages
  socket.on('chat message', async ({ roomId, message }) => {
    if (!roomId || !message) return;
    const chatMsg = {
      userId: socket.user.id,
      username: socket.user.username || 'User',
      message,
      timestamp: new Date()
    };
    // Save to DB
    try {
      const room = await Room.findById(roomId);
      if (room) {
        room.messages.push(chatMsg);
        // Limit to last 100 messages
        if (room.messages.length > 100) {
          room.messages = room.messages.slice(-100);
        }
        await room.save();
      }
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
    io.to(roomId).emit('chat message', { ...chatMsg, timestamp: chatMsg.timestamp.toISOString() });
  });
});

// JWT middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Example protected route
app.get('/api/city', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.city);
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/city', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.city = req.body; // Save the city as { buildings: [...] }
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Registration endpoint with better error handling
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Missing fields:', { username: !!username, password: !!password });
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    // Check if user already exists (only by username since email is not required)
    const existingUser = await User.findOne({ username });
    console.log('User existence check for username:', username, 'Result:', existingUser);
    
    if (existingUser) {
      console.log('User already exists:', username);
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const user = await User.create({ 
      username, 
      password,
      city: { buildings: [] } 
    });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    console.log('User created successfully:', username);
    res.json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Login endpoint with better error handling
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    const user = await User.findOne({ username });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    console.log('Login successful:', username);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// Focus session logging endpoint
app.post('/api/focus-session', authenticateJWT, async (req, res) => {
  try {
    console.log('Logging focus session:', req.body);
    const { duration, status = 'completed' } = req.body;
    
    if (!duration || duration <= 0) {
      return res.status(400).json({ error: 'Invalid duration' });
    }

    const user = await User.findById(req.user.id);
    user.focusHistory.push({
      duration,
      status,
      timestamp: new Date()
    });
    await user.save();
    
    console.log('Focus session logged successfully');
    res.json({ success: true, message: 'Focus session logged' });
  } catch (error) {
    console.error('Error logging focus session:', error);
    res.status(500).json({ error: 'Failed to log focus session: ' + error.message });
  }
});

// Get focus statistics endpoint
app.get('/api/focus-stats', authenticateJWT, async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    const user = await User.findById(req.user.id);
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToSubtract);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }
    
    const sessions = user.focusHistory.filter(session => 
      new Date(session.timestamp) >= startDate
    );
    
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    const completedSessions = sessions.filter(session => session.status === 'completed');
    const averageSession = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;
    
    // Default goals (can be made configurable)
    const goals = {
      daily: 240, // 4 hours
      weekly: 1200, // 20 hours
      monthly: 4800 // 80 hours
    };
    
    const stats = {
      total: totalMinutes,
      sessions: sessions.length,
      average: averageSession,
      goal: goals[period],
      completedSessions: completedSessions.length,
      recentSessions: sessions.slice(-10).reverse().map(session => ({
        duration: session.duration,
        status: session.status,
        timestamp: session.timestamp
      }))
    };
    
    console.log(`Focus stats for ${period}:`, stats);
    res.json(stats);
  } catch (error) {
    console.error('Error getting focus stats:', error);
    res.status(500).json({ error: 'Failed to get focus stats: ' + error.message });
  }
});

// Create a new room
app.post('/api/rooms', authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }
    // Create the room with the current user as creator and first member
    const room = await Room.create({
      name,
      members: [req.user.id],
      createdBy: req.user.id
    });
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// List all rooms
app.get('/api/rooms', authenticateJWT, async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    console.error('Error listing rooms:', error);
    res.status(500).json({ error: 'Failed to list rooms' });
  }
});

// Join a room
app.post('/api/rooms/:roomId/join', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Leave a room
app.post('/api/rooms/:roomId/leave', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    room.members = room.members.filter(
      memberId => memberId.toString() !== req.user.id
    );
    await room.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({ error: 'Failed to leave room' });
  }
});

// Get room details with member stats
app.get('/api/rooms/:roomId', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).populate('members', 'username city focusHistory');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    // For each member, calculate stats
    const members = room.members.map(member => {
      const totalFocus = (member.focusHistory || []).reduce((sum, s) => sum + (s.duration || 0), 0);
      const buildings = (member.city && member.city.buildings) ? member.city.buildings.length : 0;
      return {
        id: member._id,
        username: member.username,
        totalFocus,
        buildings
      };
    });
    res.json({
      _id: room._id,
      name: room.name,
      createdBy: room.createdBy,
      createdAt: room.createdAt,
      members
    });
  } catch (error) {
    console.error('Error getting room details:', error);
    res.status(500).json({ error: 'Failed to get room details' });
  }
});

// Get room leaderboard
app.get('/api/rooms/:roomId/leaderboard', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).populate('members', 'username city focusHistory');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    // Calculate stats for leaderboard
    const leaderboard = room.members.map(member => {
      const totalFocus = (member.focusHistory || []).reduce((sum, s) => sum + (s.duration || 0), 0);
      const buildings = (member.city && member.city.buildings) ? member.city.buildings.length : 0;
      return {
        id: member._id,
        username: member.username,
        totalFocus,
        buildings
      };
    }).sort((a, b) => b.totalFocus - a.totalFocus); // Sort by total focus descending
    res.json(leaderboard);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Get last 100 chat messages for a room
app.get('/api/rooms/:roomId/messages', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const messages = (room.messages || []).slice(-100).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json(messages);
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ error: 'Failed to get chat messages' });
  }
});

// Remove a member from the room (admin only)
app.post('/api/rooms/:roomId/remove-member', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.createdBy.toString() !== req.user.id) return res.status(403).json({ error: 'Only the room creator can remove members' });
    if (userId === req.user.id) return res.status(400).json({ error: 'Creator cannot remove themselves' });
    room.members = room.members.filter(id => id.toString() !== userId);
    await room.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Update room description (admin only)
app.post('/api/rooms/:roomId/description', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { description } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.createdBy.toString() !== req.user.id) return res.status(403).json({ error: 'Only the room creator can update the description' });
    room.description = description || '';
    await room.save();
    res.json({ success: true, description: room.description });
  } catch (error) {
    console.error('Error updating description:', error);
    res.status(500).json({ error: 'Failed to update description' });
  }
});

// Delete room (admin only)
app.delete('/api/rooms/:roomId', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.createdBy.toString() !== req.user.id) return res.status(403).json({ error: 'Only the room creator can delete the room' });
    await room.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Set or update room goal (admin only)
app.post('/api/rooms/:roomId/goal', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { amount, period } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.createdBy.toString() !== req.user.id) return res.status(403).json({ error: 'Only the room creator can set the goal' });
    if (!amount || !period) return res.status(400).json({ error: 'Amount and period are required' });
    room.goal = {
      amount,
      period,
      setBy: req.user.id,
      setAt: new Date()
    };
    await room.save();
    res.json({ success: true, goal: room.goal });
  } catch (error) {
    console.error('Error setting goal:', error);
    res.status(500).json({ error: 'Failed to set goal' });
  }
});

// Get room goal progress
app.get('/api/rooms/:roomId/goal-progress', authenticateJWT, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).populate('members', 'username focusHistory');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (!room.goal || !room.goal.amount || !room.goal.period) return res.json({ goal: null, progress: 0, topContributors: [] });
    // Calculate period start
    const now = new Date();
    let startDate;
    switch (room.goal.period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToSubtract);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0);
    }
    // Calculate total and per-member focus
    let total = 0;
    const contributors = [];
    for (const member of room.members) {
      const sessions = (member.focusHistory || []).filter(s => new Date(s.timestamp) >= startDate);
      const memberTotal = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      total += memberTotal;
      contributors.push({ id: member._id, username: member.username, total: memberTotal });
    }
    contributors.sort((a, b) => b.total - a.total);
    res.json({
      goal: room.goal,
      progress: total,
      topContributors: contributors
    });
  } catch (error) {
    console.error('Error getting goal progress:', error);
    res.status(500).json({ error: 'Failed to get goal progress' });
  }
});

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

const PORT = 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
