import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import City from './components/City';
import FocusTimerPage from './components/FocusTimerPage';
import CityViewPage from './components/CityViewPage';
import Login from './components/Login';
import AuthSuccess from './components/AuthSuccess';
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
      setBuildings(prev => [...prev, { type: buildingType, position: { x: 0, y: 0 } }]);
    }
  };

  const addBuilding = (type, position) => {
    setBuildings(prev => [...prev, { type, position }]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div className="app">
      <header>
        <h1>Focusopolis</h1>
        <div style={{ margin: '16px 0' }}>
          <button onClick={() => setPage('timer')} disabled={page === 'timer'}>Focus Timer</button>
          <button onClick={() => setPage('city')} disabled={page === 'city'} style={{ marginLeft: 8 }}>City View</button>
          <button onClick={handleLogout} style={{ marginLeft: 16 }}>Logout</button>
        </div>
      </header>
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        {page === 'timer' ? (
          <FocusTimerPage
            lastSessionLength={lastSessionLength}
            setLastSessionLength={setLastSessionLength}
            handleTimerComplete={handleTimerComplete}
          />
        ) : (
          <CityViewPage buildings={buildings} />
        )}
      </main>
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
        <Route path="/auth-success" component={AuthSuccess} />
        <Route path="/" render={() => (token ? <MainApp /> : <Redirect to="/login" />)} />
      </Switch>
    </Router>
  );
}

export default App;
