import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const AppNavigation = () => {
  const history = useHistory();
  const location = useLocation();

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 10,
      zIndex: 1000,
      background: 'rgba(255,255,255,0.9)',
      padding: '10px 20px',
      borderRadius: 25,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <button
        onClick={() => history.push('/')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: location.pathname === '/' ? '#1976d2' : '#e3f2fd',
          color: location.pathname === '/' ? 'white' : '#1976d2',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        ⏱️ Timer
      </button>
      <button
        onClick={() => history.push('/city')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: location.pathname === '/city' ? '#1976d2' : '#e3f2fd',
          color: location.pathname === '/city' ? 'white' : '#1976d2',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        🏙️ City
      </button>
      <button
        onClick={() => history.push('/stats')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: location.pathname === '/stats' ? '#1976d2' : '#e3f2fd',
          color: location.pathname === '/stats' ? 'white' : '#1976d2',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        📊 Stats
      </button>
      <button
        onClick={() => history.push('/rooms')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: location.pathname.startsWith('/rooms') ? '#1976d2' : '#e3f2fd',
          color: location.pathname.startsWith('/rooms') ? 'white' : '#1976d2',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        🏆 Rooms
      </button>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          history.push('/login');
        }}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 20,
          background: '#ff5722',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default AppNavigation; 