# Google OAuth Setup Guide

## 🚀 How to Set Up Google OAuth

### Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5001/auth/google/callback`
   - Copy your Client ID and Client Secret

### Step 2: Create Environment Variables

Create a `.env` file in your project root with:

```env
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/focusopolis_v2
SESSION_SECRET=your-session-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Step 3: Start the Application

1. **Start the backend:**
   ```bash
   npm run server
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm start
   ```

3. **Access the application:**
   - Go to `http://localhost:3000`
   - You'll see the login page with Google OAuth button
   - Click "Continue with Google" to test

## 🎯 Features Added

### ✅ Google OAuth Integration
- **Seamless Login:** Users can sign in with their Google account
- **Automatic Registration:** New users are automatically created
- **Session Management:** Proper session handling with Passport.js
- **Error Handling:** Graceful error handling for OAuth failures

### ✅ Enhanced User Experience
- **Beautiful UI:** Modern glass morphism design
- **Responsive Design:** Works on desktop and mobile
- **Error Messages:** Clear error feedback for users
- **Loading States:** Smooth transitions and loading indicators

### ✅ Backend Improvements
- **Flexible User Model:** Supports both regular and OAuth users
- **Secure Authentication:** JWT tokens with proper validation
- **Database Integration:** MongoDB with proper indexing
- **Session Management:** Express sessions for OAuth flow

## 🔧 Technical Details

### User Model Updates
- Added `googleId` field for OAuth users
- Added `email` field for better user identification
- Made username/password optional for OAuth users
- Maintained backward compatibility

### API Endpoints
- `GET /auth/google` - Initiates Google OAuth
- `GET /auth/google/callback` - Handles OAuth callback
- `POST /api/register` - Regular user registration
- `POST /api/login` - Regular user login
- `POST /api/focus-session` - Log focus sessions
- `GET /api/focus-stats` - Get focus statistics

### Frontend Components
- **Login.js** - Enhanced with Google OAuth button
- **Register.js** - Enhanced with Google OAuth button
- **AuthSuccess.js** - Handles OAuth redirects
- **FocusStats.js** - Focus time tracking dashboard

## 🎨 UI Features

### Login/Register Pages
- **Modern Design:** Glass morphism with blur effects
- **Google Button:** Styled Google OAuth button
- **Error Handling:** Clear error messages
- **Responsive:** Works on all screen sizes

### Navigation
- **Floating Nav:** Clean navigation bar
- **Multiple Pages:** Timer, City, Stats
- **Logout:** Easy sign out functionality

## 🚀 Ready to Use

Once you've set up your Google OAuth credentials and environment variables, your application will support:

1. **Regular Registration/Login** with username/password
2. **Google OAuth Login** with automatic account creation
3. **Focus Time Tracking** with daily/weekly/monthly stats
4. **City Building** based on focus sessions
5. **Beautiful UI** with modern design

## 🔒 Security Notes

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt
- OAuth tokens are handled securely
- Session secrets are configurable
- HTTPS recommended for production

## 🐛 Troubleshooting

### Common Issues:
1. **"Invalid redirect URI"** - Check your Google OAuth settings
2. **"Client ID not found"** - Verify your environment variables
3. **"Session errors"** - Check your SESSION_SECRET
4. **"Database errors"** - Ensure MongoDB is running

### Debug Mode:
- Check server console for detailed logs
- Browser console shows frontend errors
- Network tab shows API requests

---

**🎉 Your Focusopolis app now supports both traditional and Google OAuth authentication!** 