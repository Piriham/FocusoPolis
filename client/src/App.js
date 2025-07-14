import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import City from './components/City';
import FocusTimerPage from './components/FocusTimerPage';
import CityViewPage from './components/CityViewPage';
import FocusStats from './components/FocusStats';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import './App.css';

const BUILDING_TYPES = [
  { min: 90, type: 'B4' },
  { min: 60, type: 'B3' },
  { min: 30, type: 'B2' },
  { min: 0, type: 'B1' },
];

function MainApp() {
  const [buildings, setBuildings] = useState([]);
  const [currentFocusTime, setCurrentFocusTime] = useState(0);
  const [lastSessionLength, setLastSessionLength] = useState(25);
  const [page, setPage] = useState('timer');
  const history = useHistory();

  // Fetch city data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:5001/api/city', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.buildings) setBuildings(data.buildings);
      });
  }, []);

  // Save city data when buildings change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || buildings.length === 0) return;
    fetch('http://localhost:5001/api/city', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ city: { buildings } })
    });
  }, [buildings]);

  const getBuildingType = (minutes) => {
    for (let b of BUILDING_TYPES) {
      if (minutes >= b.min) return b.type;
    }
    return null;
  };

  const handleTimerComplete = (sessionLength) => {
    setCurrentFocusTime(prev => prev + sessionLength);
    const buildingType = getBuildingType(sessionLength);
    if (buildingType) {
      setBuildings(prev => [...prev, {
        type: buildingType,
        position: {
          x: Math.random() * 600,
          y: Math.random() * 300
        }
      }]);
    }
  };

  const addBuilding = (buildingType) => {
    setBuildings(prev => [...prev, {
      type: buildingType,
      position: {
        x: Math.random() * 600,
        y: Math.random() * 300
      }
    }]);
  };

  const renderNavigation = () => (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 10,
      zIndex: 1000,
      background: 'rgba(255,255,255,0.9)',
      padding: '10px 20px',
      borderRadius: 25,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <button
        onClick={() => setPage('timer')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: page === 'timer' ? '#1976d2' : '#e3f2fd',
          color: page === 'timer' ? 'white' : '#1976d2',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        ⏱️ Timer
      </button>
      <button
        onClick={() => setPage('city')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: page === 'city' ? '#1976d2' : '#e3f2fd',
          color: page === 'city' ? 'white' : '#1976d2',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        🏙️ City
      </button>
      <button
        onClick={() => setPage('stats')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: page === 'stats' ? '#1976d2' : '#e3f2fd',
          color: page === 'stats' ? 'white' : '#1976d2',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        📊 Stats
      </button>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          history.push('/login');
        }}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: '#ff5722',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        🚪 Logout
      </button>
    </div>
  );

  if (page === 'city') {
    return (
      <div>
        {renderNavigation()}
        <CityViewPage buildings={buildings} />
      </div>
    );
  }

  if (page === 'stats') {
    return (
      <div>
        {renderNavigation()}
        <FocusStats />
      </div>
    );
  }

  return (
    <div>
      {renderNavigation()}
      <FocusTimerPage
        lastSessionLength={lastSessionLength}
        setLastSessionLength={setLastSessionLength}
        handleTimerComplete={handleTimerComplete}
      />
    </div>
  );
}

function App() {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" render={() => (token ? <MainApp /> : <Redirect to="/login" />)} />
      </Switch>
    </Router>
  );
}

export default App;
