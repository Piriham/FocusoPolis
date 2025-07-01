import React from 'react';
import City from './City';

const CityViewPage = ({ buildings }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
    <div className="city-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 700, background: '#fafbfc', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', padding: 32 }}>
      <h2>Your City</h2>
      <City buildings={buildings} />
    </div>
  </div>
);

export default CityViewPage; 