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

function MainApp() {
  const [buildings, setBuildings] = useState([]);
  const [currentFocusTime, setCurrentFocusTime] = useState(0);
  const [lastSessionLength, setLastSessionLength] = useState(25);
  const [page, setPage] = useState('timer');
  const history = useHistory();
  const location = useLocation();

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
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/rooms/:roomId" render={props => (
          token ? <AuthenticatedLayout><RoomView {...props} /></AuthenticatedLayout> : <Redirect to="/login" />
        )} />
        <Route path="/rooms" render={props => (
          token ? <AuthenticatedLayout><RoomLobby {...props} /></AuthenticatedLayout> : <Redirect to="/login" />
        )} />
        <Route path="/" render={() => (
          token ? <AuthenticatedLayout><MainApp /></AuthenticatedLayout> : <Redirect to="/login" />
        )} />
      </Switch>
    </Router>
  );
}

export default App;
