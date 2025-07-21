import React from 'react';
import City from './City';

const CityViewPage = ({ buildings }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #232946 0%, #121629 100%)',
    paddingTop: 360,
  }}>
    <div className="city-section" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 700,
      background: '#232946',
      borderRadius: 16,
      boxShadow: '0 2px 8px #0008',
      border: '1.5px solid #393e5c',
      padding: 32,
      paddingTop: 180,
    }}>
      <h2 style={{ color: '#fff' }}>Your City</h2>
      <City buildings={buildings} />
    </div>
  </div>
);

export default CityViewPage; 