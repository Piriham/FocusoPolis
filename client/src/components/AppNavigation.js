import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AppNavigation = () => {
  const history = useHistory();
  const location = useLocation();

  // Get username from JWT
  let username = '';
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      username = decoded.username || decoded.name || decoded.user || '';
    }
  } catch {}

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      zIndex: 1000,
      background: 'rgba(255,255,255,0.7)',
      padding: '14px 38px 14px 24px',
      borderRadius: 32,
      boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10)',
      backdropFilter: 'blur(18px)',
      border: '1.5px solid #e0e7ff',
      minWidth: 600,
      maxWidth: 900,
    }}>
      {/* Logo/Title */}
      <div style={{ fontWeight: 700, fontSize: 22, color: '#6366f1', letterSpacing: 1, marginRight: 28, userSelect: 'none', cursor: 'pointer' }} onClick={() => history.push('/')}>FocusoPolis</div>
      {/* Navigation Buttons */}
      <button
        onClick={() => history.push('/')}
        style={{
          padding: '10px 22px',
          borderRadius: 16,
          background: location.pathname === '/' ? 'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)' : 'rgba(236,239,255,0.7)',
          color: location.pathname === '/' ? '#fff' : '#232946',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: location.pathname === '/' ? '0 2px 12px #6366f133' : 'none',
          border: 'none',
          transition: 'all 0.18s',
        }}
      >
        ⏱️ Timer
      </button>
      <button
        onClick={() => history.push('/city')}
        style={{
          padding: '10px 22px',
          borderRadius: 16,
          background: location.pathname === '/city' ? 'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)' : 'rgba(236,239,255,0.7)',
          color: location.pathname === '/city' ? '#fff' : '#232946',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: location.pathname === '/city' ? '0 2px 12px #6366f133' : 'none',
          border: 'none',
          transition: 'all 0.18s',
        }}
      >
        🏙️ City
      </button>
      <button
        onClick={() => history.push('/stats')}
        style={{
          padding: '10px 22px',
          borderRadius: 16,
          background: location.pathname === '/stats' ? 'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)' : 'rgba(236,239,255,0.7)',
          color: location.pathname === '/stats' ? '#fff' : '#232946',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: location.pathname === '/stats' ? '0 2px 12px #6366f133' : 'none',
          border: 'none',
          transition: 'all 0.18s',
        }}
      >
        📊 Stats
      </button>
      <button
        onClick={() => history.push('/rooms')}
        style={{
          padding: '10px 22px',
          borderRadius: 16,
          background: location.pathname.startsWith('/rooms') ? 'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)' : 'rgba(236,239,255,0.7)',
          color: location.pathname.startsWith('/rooms') ? '#fff' : '#232946',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: location.pathname.startsWith('/rooms') ? '0 2px 12px #6366f133' : 'none',
          border: 'none',
          transition: 'all 0.18s',
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
          padding: '10px 22px',
          borderRadius: 16,
          background: 'linear-gradient(90deg,#f59e42 60%,#f43f5e 100%)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 15,
          marginLeft: 18,
          boxShadow: '0 2px 12px #f59e4233',
          border: 'none',
          transition: 'all 0.18s',
        }}
      >
        🚪 Logout
      </button>
      {/* User info at the far right as a profile chip */}
      {username && (
        <div style={{
          marginLeft: 'auto',
          fontWeight: 600,
          color: '#6366f1',
          fontSize: 17,
          background: 'rgba(236,239,255,0.85)',
          borderRadius: 18,
          padding: '7px 18px',
          boxShadow: '0 2px 8px #6366f122',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 20, marginRight: 7 }}>👤</span> {username}
        </div>
      )}
    </div>
  );
};

export default AppNavigation; 