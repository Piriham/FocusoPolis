import React, { useState } from 'react';
import './City.css';

const buildingImages = {
  B1: process.env.PUBLIC_URL + '/BuildingsIsometric/B1-bg.png',
  B2: process.env.PUBLIC_URL + '/BuildingsIsometric/B2-bg.png',
  B3: process.env.PUBLIC_URL + '/BuildingsIsometric/B3-bg.png',
  B4: process.env.PUBLIC_URL + '/BuildingsIsometric/B4-bg.png',
};

const GRID_SIZE = 5;
const TOTAL_BUILDINGS = GRID_SIZE * GRID_SIZE;

// Map session duration to building type
function getBuildingType(duration) {
  if (duration < 30) return 'B2';
  if (duration < 60) return 'B4';
  if (duration < 90) return 'B3';
  return 'B1'; // 90-120 min
}

// Generate placeholder session data
function getRandomSession(i) {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const duration = 15 + Math.floor(Math.random() * 105); // 15-120 min
  const type = getBuildingType(duration);
  return {
    duration,
    date: date.toLocaleDateString(),
    img: buildingImages[type],
    type,
  };
}

const sessions = Array.from({ length: TOTAL_BUILDINGS }, (_, i) => getRandomSession(i));

function FlippableBuilding({ session, idx }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flippable-card${flipped ? ' flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      /* Only flips on mouse click */
    >
      <div className="flippable-card-inner">
        <div className="flippable-card-front">
          <img src={session.img} alt={`Building ${session.type}`} className="building-img" />
        </div>
        <div className="flippable-card-back">
          <div className="session-info">
            <div><b>Session:</b> {session.duration} min</div>
            <div><b>Date:</b> {session.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const City = () => {
  return (
    <div className="city-grid city-grid-large">
      {sessions.map((session, i) => (
        <FlippableBuilding key={i} session={session} idx={i} />
      ))}
    </div>
  );
};

export default City;
