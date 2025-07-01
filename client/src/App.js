import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import City from './components/City';
import FocusTimerPage from './components/FocusTimerPage';
import CityViewPage from './components/CityViewPage';
import './App.css';

const BUILDING_TYPES = [
  { min: 90, type: 'B4' },
  { min: 60, type: 'B3' },
  { min: 30, type: 'B2' },
  { min: 0, type: 'B1' },
];

function App() {
  const [buildings, setBuildings] = useState([
    { type: 'B1' },
    { type: 'B2' },
    { type: 'B3' },
    { type: 'B4' },
    { type: 'B1' },
    { type: 'B2' },
    { type: 'B3' },
    { type: 'B4' },
    { type: 'B1' },
    { type: 'B2' },
    { type: 'B3' },
    { type: 'B4' },
    { type: 'B1' },
    { type: 'B2' },
    { type: 'B3' },
    { type: 'B4' },
  ]);
  const [currentFocusTime, setCurrentFocusTime] = useState(0);
  const [lastSessionLength, setLastSessionLength] = useState(25);
  const [page, setPage] = useState('timer');

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

  return (
    <div className="app">
      <header>
        <h1>Focusopolis</h1>
        <div style={{ margin: '16px 0' }}>
          <button onClick={() => setPage('timer')} disabled={page === 'timer'}>Focus Timer</button>
          <button onClick={() => setPage('city')} disabled={page === 'city'} style={{ marginLeft: 8 }}>City View</button>
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

export default App;
