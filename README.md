# FocusoPolis - Gamified Focus Timer

## Project Overview
A gamified focus timer application that transforms productivity into a virtual city-building experience. Users complete focus sessions to earn buildings that populate their digital city, with social features for collaboration and competition. The system combines Pomodoro technique with gamification to motivate users to stay focused and build productive habits.

## Features

### Core Focus Features
- **Customizable Timer**: Adjustable session lengths from 5-120 minutes
- **Visual Countdown**: Real-time timer display with MM:SS format
- **Session Logging**: Automatic tracking of completed focus sessions
- **Progress Statistics**: Daily, weekly, and monthly focus analytics

### Gamification System
- **Building Rewards**: Earn buildings based on session duration
  - B2 (Small): 5-29 minute sessions
  - B4 (Medium): 30-59 minute sessions  
  - B1 (Large): 60-89 minute sessions
  - B3 (Tall): 90+ minute sessions
- **City Building**: Visual city grid showing earned buildings
- **Interactive Buildings**: Click to view session details (duration, date)
- **Building Preview**: See what building you'll earn before starting

### Social Features
- **Focus Rooms**: Create and join collaborative focus groups
- **Real-time Chat**: Live messaging within rooms
- **Room Leaderboards**: Compare focus stats with room members
- **Goal Setting**: Set and track group focus challenges
- **Member Management**: Add/remove members and manage room settings

### User Management
- **JWT Authentication**: Secure user registration and login
- **User Profiles**: Track individual focus history and city progress
- **Session History**: Detailed logs of all focus sessions
- **Statistics Dashboard**: Comprehensive analytics and progress tracking

## Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Real-time**: Socket.IO for live chat functionality
- **Deployment**: Render.com hosting

### Frontend
- **Framework**: React.js 17.0.2
- **Routing**: React Router DOM
- **Styling**: Inline styles with modern CSS features
- **Real-time**: Socket.IO client for live updates
- **Build Tools**: Create React App with custom webpack config

### Development Tools
- **Package Manager**: npm
- **Development Server**: nodemon for backend, react-scripts for frontend
- **Concurrent Development**: concurrently for running both servers
- **Environment**: dotenv for configuration management

## Project Structure
```
FocusoPolis/
├── server.js                 # Express.js backend server
├── package.json              # Backend dependencies
├── models/                   # MongoDB data models
│   ├── User.js              # User schema and authentication
│   └── Room.js              # Room/group schema for social features
├── client/                   # React frontend application
│   ├── public/              # Static assets and building models
│   │   ├── BuildingsIsometric/  # Building preview images
│   │   ├── Models/          # 3D building models (FBX, GLB, OBJ)
│   │   └── Previews/        # Building thumbnail images
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Timer.js     # Core countdown timer
│   │   │   ├── FocusTimerPage.js  # Main timer interface
│   │   │   ├── City.js      # City grid display
│   │   │   ├── Login.js     # User authentication
│   │   │   ├── Register.js  # User registration
│   │   │   ├── AppNavigation.js  # Navigation bar
│   │   │   ├── FocusStats.js     # Statistics dashboard
│   │   │   ├── RoomLobby.js      # Room management
│   │   │   ├── RoomView.js       # Room interface with chat
│   │   │   ├── CityViewPage.js   # City display page
│   │   │   └── buildingUtils.js  # Building type utilities
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── config-overrides.js  # Custom webpack configuration
└── docs/                    # Documentation
```

## Installation & Setup

### Prerequisites
- Node.js 14+
- npm or yarn
- MongoDB database (local or cloud)
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Piriham/FocusoPolis.git
cd FocusoPolis

# Install backend dependencies
npm install

# Create .env file with your configuration
echo "MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key" > .env

# Start the backend server
npm run server
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start the frontend development server
npm start
```

### Development Mode
```bash
# From the root directory, run both servers concurrently
npm run dev
```

## Usage

### Getting Started
1. **Register/Login**: Create an account or sign in to your existing account
2. **Set Session Length**: Adjust the timer slider to your desired focus duration
3. **Start Timer**: Click "Start" to begin your focus session
4. **Stay Focused**: Complete the session to earn a building
5. **View Your City**: Check your city grid to see all earned buildings
6. **Join Rooms**: Create or join focus rooms for social collaboration

### Focus Timer
- **Session Length**: 5-120 minutes (adjustable in 5-minute increments)
- **Building Preview**: See what building you'll earn before starting
- **Visual Feedback**: Real-time countdown with MM:SS display
- **Session Logging**: Automatic tracking of completed sessions

### City Building
- **Building Types**: 4 different building types based on session duration
- **Interactive Cards**: Click buildings to see session details
- **City Grid**: 5x5 grid displaying up to 25 buildings
- **Visual Progress**: Watch your city grow as you complete sessions

### Social Features
- **Create Rooms**: Start focus groups with custom names
- **Join Rooms**: Enter room codes or browse available rooms
- **Real-time Chat**: Live messaging with room members
- **Leaderboards**: Compare focus stats with room members
- **Goal Setting**: Set group focus challenges and track progress

### Statistics Dashboard
- **Time Periods**: Daily, weekly, and monthly views
- **Progress Tracking**: Visual progress bars toward goals
- **Session History**: Recent focus sessions with completion status
- **Key Metrics**: Total focus time, average session length, session count

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Focus Sessions
- `POST /api/focus-session` - Log completed focus session
- `GET /api/focus-stats` - Get focus statistics by period

### City Management
- `GET /api/city` - Get user's city data
- `POST /api/city` - Save city data

### Room Management
- `POST /api/rooms` - Create new room
- `GET /api/rooms` - List all rooms
- `POST /api/rooms/:roomId/join` - Join a room
- `POST /api/rooms/:roomId/leave` - Leave a room
- `GET /api/rooms/:roomId` - Get room details
- `GET /api/rooms/:roomId/leaderboard` - Get room leaderboard
- `GET /api/rooms/:roomId/messages` - Get chat history
- `POST /api/rooms/:roomId/remove-member` - Remove member (admin)
- `POST /api/rooms/:roomId/description` - Update room description
- `DELETE /api/rooms/:roomId` - Delete room (admin)
- `POST /api/rooms/:roomId/goal` - Set room goal
- `GET /api/rooms/:roomId/goal-progress` - Get goal progress

### WebSocket Events
- `joinRoom` - Join a room for real-time updates
- `chat message` - Send/receive chat messages

## Development

### Scripts
```bash
# Backend scripts
npm start          # Start production server
npm run server     # Start development server with nodemon
npm run client     # Start frontend development server
npm run dev        # Run both servers concurrently
```

### Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

### Database Schema

#### User Model
```javascript
{
  username: String (unique),
  password: String (hashed),
  city: {
    buildings: [{
      type: String,
      duration: Number,
      date: String,
      position: { x: Number, y: Number }
    }]
  },
  focusHistory: [{
    duration: Number,
    timestamp: Date,
    status: String ('completed' | 'interrupted')
  }]
}
```

#### Room Model
```javascript
{
  name: String,
  members: [ObjectId],
  createdBy: ObjectId,
  description: String,
  goal: {
    amount: Number,
    period: String ('daily' | 'weekly' | 'monthly'),
    setBy: ObjectId,
    setAt: Date
  },
  messages: [{
    userId: ObjectId,
    username: String,
    message: String,
    timestamp: Date
  }]
}
```

## Deployment

### Backend Deployment (Render.com)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy the Node.js application

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm install && npm run build`
3. Set output directory: `client/build`

## Contributing

This is a personal project for learning and development purposes. The codebase demonstrates:

- **Full-stack Development**: React frontend with Node.js backend
- **Real-time Features**: Socket.IO for live chat functionality
- **Authentication**: JWT-based user management
- **Database Design**: MongoDB with Mongoose ODM
- **Gamification**: Building reward system for motivation
- **Social Features**: Room-based collaboration
- **Modern UI**: Responsive design with glass-morphism effects

## License

This project is for educational and personal use. The codebase demonstrates modern web development practices and can serve as a learning resource for:

- React.js development
- Node.js/Express.js backend development
- MongoDB database design
- Real-time web applications
- Gamification in productivity apps
- Social features in web applications

## Acknowledgments

- **Building Assets**: 3D models and images for the city-building gamification
- **React Community**: For the excellent documentation and ecosystem
- **Node.js Community**: For the robust backend framework
- **MongoDB**: For the flexible NoSQL database solution
