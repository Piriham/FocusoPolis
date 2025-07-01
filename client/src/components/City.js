import React, { useState } from 'react';
import './City.css';

const BUILDINGS = {
    '30': 'garden',
    '60': 'cafe',
    '90': 'library',
    '120': 'skyscraper'
};

const City = ({ buildings, addBuilding }) => {
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const handleBuildingClick = (building) => {
        setSelectedBuilding(building);
    };

    const handlePlaceBuilding = (e) => {
        if (selectedBuilding) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            addBuilding(selectedBuilding, { x, y });
            setSelectedBuilding(null);
        }
    };

    return (
        <div className="city-container" onClick={handlePlaceBuilding}>
            {buildings.map((building, index) => (
                <div
                    key={index}
                    className={`building ${building.type}`}
                    style={{
                        left: `${building.position.x}px`,
                        top: `${building.position.y}px`
                    }}
                />
            ))}
            
            <div className="building-selector">
                {Object.entries(BUILDINGS).map(([time, type]) => (
                    <button
                        key={time}
                        onClick={() => handleBuildingClick(type)}
                        className={`building-button ${type}`}
                        disabled={selectedBuilding === type}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default City;
