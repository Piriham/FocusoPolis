import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import City from './components/City';
import FocusTimerPage from './components/FocusTimerPage';
import CityViewPage from './components/CityViewPage';
import FocusStats from './components/FocusStats';
import Login from './components/Login';
import Register from './components/Register';
import RoomLobby from './components/RoomLobby';
import RoomView from './components/RoomView';
import AppNavigation from './components/AppNavigation';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom';
import './App.css';
import { jwtDecode } from 'jwt-decode';

function MainApp({ buildings, setBuildings, handleTimerComplete, lastSessionLength, setLastSessionLength }) {
  const [currentFocusTime, setCurrentFocusTime] = useState(0);
  const history = useHistory();
  const location = useLocation();

  const BUILDING_TYPES = [
    { min: 90, type: 'B4' },
    { min: 60, type: 'B3' },
    { min: 30, type: 'B2' },
    { min: 0, type: 'B1' },
  ];

  const getBuildingType = (minutes) => {
    for (let b of BUILDING_TYPES) {
      if (minutes >= b.min) return b.type;
    }
    return null;
  };

  // Only handleTimerComplete is needed here, logic is now in App

  if (location.pathname === '/city') {
    return <CityViewPage buildings={buildings} />;
  }
  if (location.pathname === '/stats') {
    return <FocusStats />;
  }
  return (
    <FocusTimerPage
      lastSessionLength={lastSessionLength}
      setLastSessionLength={setLastSessionLength}
      handleTimerComplete={handleTimerComplete}
    />
  );
}

function AuthenticatedLayout({ children }) {
  return (
    <>
      <AppNavigation />
      <div style={{ paddingTop: 80 }}>{children}</div>
    </>
  );
}

function App() {
  const [buildings, setBuildings] = useState([]);
  const [lastSessionLength, setLastSessionLength] = useState(25);
  let token = localStorage.getItem('token');
  let isTokenValid = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && Date.now() < decoded.exp * 1000) {
        isTokenValid = true;
      } else {
        localStorage.removeItem('token');
        token = null;
      }
    } catch {
      localStorage.removeItem('token');
      token = null;
    }
  }

  // Fetch city data on mount
  React.useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5001/api/city', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.buildings) setBuildings(data.buildings);
      });
  }, [token]);

  // Save city data when buildings change
  React.useEffect(() => {
    if (!token || buildings.length === 0) return;
    fetch('http://localhost:5001/api/city', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ buildings })
    });
  }, [buildings, token]);

  const BUILDING_TYPES = [
    { min: 90, type: 'B4' },
    { min: 60, type: 'B3' },
    { min: 30, type: 'B2' },
    { min: 0, type: 'B1' },
  ];

  const getBuildingType = (minutes) => {
    for (let b of BUILDING_TYPES) {
      if (minutes >= b.min) return b.type;
    }
    return null;
  };

  const handleTimerComplete = (sessionLength) => {
    // This is now the single source of truth for adding buildings
    const buildingType = getBuildingType(sessionLength);
    if (buildingType) {
      setBuildings(prev => [...prev, {
        type: buildingType,
        duration: sessionLength,
        date: new Date().toLocaleString(),
        position: {
          x: Math.random() * 600,
          y: Math.random() * 300
        }
      }]);
    }
  };

  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/rooms/:roomId" render={props => (
          isTokenValid ? <AuthenticatedLayout><RoomView {...props} /></AuthenticatedLayout> : <Redirect to="/login" />
        )} />
        <Route path="/rooms" render={props => (
          isTokenValid ? <AuthenticatedLayout><RoomLobby {...props} /></AuthenticatedLayout> : <Redirect to="/login" />
        )} />
        <Route path="/" render={() => (
          isTokenValid ? <AuthenticatedLayout><MainApp buildings={buildings} setBuildings={setBuildings} handleTimerComplete={handleTimerComplete} lastSessionLength={lastSessionLength} setLastSessionLength={setLastSessionLength} /></AuthenticatedLayout> : <Redirect to="/login" />
        )} />
      </Switch>
    </Router>
  );
}

export default App;
