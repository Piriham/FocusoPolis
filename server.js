require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const Room = require('./models/Room');

const app = express();

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
    user.city = req.body.city;
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

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
