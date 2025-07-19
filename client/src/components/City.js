import React, { useState } from 'react';
import './City.css';
import { buildingImages } from './buildingUtils';

const GRID_SIZE = 5;
const TOTAL_BUILDINGS = GRID_SIZE * GRID_SIZE;

function FlippableBuilding({ building, idx }) {
  const [flipped, setFlipped] = useState(false);
  const img = buildingImages[building.type] || buildingImages['B1'];
  return (
    <div
      className={`flippable-card${flipped ? ' flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
    >
      <div className="flippable-card-inner">
        <div className="flippable-card-front">
          <img src={img} alt={`Building ${building.type}`} className="building-img" />
        </div>
        <div className="flippable-card-back">
          <div className="session-info">
            {building.duration && <div><b>Session:</b> {building.duration} min</div>}
            {building.date && <div><b>Date:</b> {building.date}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

const City = ({ buildings = [] }) => {
  // Only show up to TOTAL_BUILDINGS
  const displayedBuildings = buildings.slice(0, TOTAL_BUILDINGS);
  // Fill the rest with empty slots if needed
  const emptySlots = Array.from({ length: TOTAL_BUILDINGS - displayedBuildings.length });

  return (
    <div className="city-grid city-grid-large">
      {displayedBuildings.map((building, i) => (
        <FlippableBuilding key={i} building={building} idx={i} />
      ))}
      {emptySlots.map((_, i) => (
        <div key={`empty-${i}`} className="flippable-card" style={{ background: 'transparent', boxShadow: 'none' }} />
      ))}
    </div>
  );
};

export default City;
