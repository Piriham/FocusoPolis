import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import City from './components/City';
import './App.css';

function App() {
  const [buildings, setBuildings] = useState([]);
  const [currentFocusTime, setCurrentFocusTime] = useState(0);

  const handleTimerComplete = () => {
    setCurrentFocusTime(prev => prev + 30); // Add 30 minutes
    if (currentFocusTime % 30 === 0) {
      const buildingType = BUILDINGS[Math.floor(currentFocusTime / 30)];
      if (buildingType) {
        setBuildings(prev => [...prev, { type: buildingType, position: { x: 0, y: 0 } }]);
      }
    }
  };

  const addBuilding = (type, position) => {
    setBuildings(prev => [...prev, { type, position }]);
  };

  return (
    <div className="app">
      <header>
        <h1>Focusopolis</h1>
      </header>
      <main>
        <div className="timer-section">
          <h2>Focus Timer</h2>
          <Timer onTimerComplete={handleTimerComplete} />
        </div>
        <div className="city-section">
          <h2>Your City</h2>
          <City buildings={buildings} addBuilding={addBuilding} />
        </div>
      </main>
    </div>
  );
}

export default App;
