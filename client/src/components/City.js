import React from 'react';
import './City.css';

// Grid settings (rectangle tile)
const GRID_COLS = 10;
const GRID_ROWS = 6;
const TILE_WIDTH = 34; // width of tile.jpeg
const TILE_HEIGHT = 122; // height of tile.jpeg

// Map building types to isometric building images
const buildingImages = {
  B1: '/Buildings Isometric/B1.jpg',
  B2: '/Buildings Isometric/B2.jpg',
  B3: '/Buildings Isometric/B3.jpg',
  B4: '/Buildings Isometric/B4.jpg',
};

// Helper to get isometric position
function getIsoPosition(row, col) {
  return {
    left: (col - row) * (TILE_WIDTH / 2) + (GRID_ROWS * TILE_WIDTH / 2),
    top: (col + row) * (TILE_HEIGHT / 2),
  };
}

// Convert buildings array (flat) to a 2D grid for demo
function getGridWithBuildings(buildings) {
  const grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
  buildings.forEach((b, i) => {
    const row = Math.floor(i / GRID_COLS);
    const col = i % GRID_COLS;
    if (row < GRID_ROWS && col < GRID_COLS) grid[row][col] = b.type;
  });
  return grid;
}

const City = ({ buildings }) => {
  const grid = getGridWithBuildings(buildings);
  return (
    <div
      className="city-container"
      style={{
        position: 'relative',
        width: GRID_COLS * TILE_WIDTH,
        height: GRID_ROWS * TILE_HEIGHT,
        background: 'none',
        margin: '0 auto',
        borderRadius: 12,
        boxSizing: 'content-box',
        border: '2px solid #e0e0e0',
        overflow: 'visible',
      }}
    >
      {/* Render tiles and buildings */}
      {grid.map((rowArr, row) =>
        rowArr.map((cell, col) => {
          const pos = getIsoPosition(row, col);
          return (
            <div
              key={`tile-${row}-${col}`}
              style={{
                position: 'absolute',
                ...pos,
                width: TILE_WIDTH,
                height: TILE_HEIGHT,
                zIndex: row + col,
              }}
            >
              {cell && (
                <span style={{ color: 'red', position: 'absolute', zIndex: 10, fontSize: 12 }}>{cell}</span>
              )}
              {cell && buildingImages[cell] && (
                <img
                  src={process.env.PUBLIC_URL + buildingImages[cell]}
                  alt={cell}
                  style={{
                    position: 'absolute',
                    left: '10%',
                    top: '5%',
                    width: '80%',
                    height: '80%',
                    objectFit: 'contain',
                    zIndex: 2,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default City;
