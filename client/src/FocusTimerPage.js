import React, { useState } from 'react';
import Timer from './Timer';
import { getBuildingTypeForDuration, buildingImages } from './buildingUtils';

const CitySkylineSVG = () => (
  <svg width="100%" height="180" viewBox="0 0 800 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 0 }}>
    <rect width="800" height="180" fill="url(#sky)" />
    <g opacity="0.7">
      <rect x="40" y="100" width="60" height="80" fill="#b0bec5" />
      <rect x="120" y="120" width="40" height="60" fill="#90a4ae" />
      <rect x="180" y="80" width="80" height="100" fill="#78909c" />
      <rect x="280" y="110" width="50" height="70" fill="#b0bec5" />
      <rect x="350" y="130" width="30" height="50" fill="#90a4ae" />
      <rect x="400" y="90" width="70" height="90" fill="#78909c" />
      <rect x="490" y="120" width="40" height="60" fill="#b0bec5" />
      <rect x="550" y="100" width="60" height="80" fill="#90a4ae" />
      <rect x="630" y="110" width="50" height="70" fill="#78909c" />
      <rect x="700" y="130" width="30" height="50" fill="#b0bec5" />
    </g>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1" gradientTransform="scale(800 180)">
        <stop offset="0%" stopColor="#e3f2fd" />
        <stop offset="100%" stopColor="#b3e5fc" />
      </linearGradient>
    </defs>
  </svg>
);

const FocusTimerPage = ({ lastSessionLength, setLastSessionLength, handleTimerComplete }) => {
  const [showSessionFinished, setShowSessionFinished] = useState(false);
  const buildingType = getBuildingTypeForDuration(lastSessionLength);
  const buildingImg = buildingImages[buildingType];

  // Wrap the timer complete handler to show the message
  const onTimerComplete = (sessionLength) => {
    handleTimerComplete(sessionLength);
    setShowSessionFinished(true);
    setTimeout(() => setShowSessionFinished(false), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(180deg, #e3f2fd 0%, #b3e5fc 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <CitySkylineSVG />
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 600,
        minHeight: 650,
        background: 'rgba(255,255,255,0.35)',
        borderRadius: 36,
        boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.18)',
        backdropFilter: 'blur(12px)',
        border: '2px solid rgba(255,255,255,0.25)',
        padding: 64,
        marginTop: 60,
      }}>
        <div style={{ marginBottom: 24 }}>
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none"><rect x="8" y="20" width="32" height="20" rx="4" fill="#90caf9" /><rect x="16" y="12" width="16" height="12" rx="4" fill="#1976d2" /><rect x="20" y="8" width="8" height="8" rx="4" fill="#fff" /></svg>
        </div>
        <h2 style={{ fontWeight: 700, fontSize: 40, marginBottom: 36, color: '#1976d2', letterSpacing: 1 }}>Focus Timer</h2>
        <label htmlFor="sessionLength" style={{ fontWeight: 500, color: '#1976d2', marginBottom: 12, display: 'block', fontSize: 22 }}>Session Length: {lastSessionLength} min</label>
        <input
          type="range"
          id="sessionLength"
          min={5}
          max={120}
          step={5}
          value={lastSessionLength}
          onChange={e => setLastSessionLength(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#1976d2', height: 12, borderRadius: 6 }}
        />
        {/* Building preview */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 14, fontSize: 22 }}>Building Preview</div>
          <img src={buildingImg} alt="Building preview" style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 18, background: '#fff', boxShadow: '0 2px 18px #0002' }} />
          <div style={{ fontSize: 20, color: '#78909c', marginTop: 16 }}>
            For a {lastSessionLength} min session, you'll add a new building to your city!
          </div>
        </div>
        <div style={{ marginBottom: 48, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Timer onTimerComplete={onTimerComplete} sessionLength={lastSessionLength} />
        </div>
        {showSessionFinished && (
          <div style={{
            marginBottom: 24,
            color: '#388e3c',
            background: '#e8f5e9',
            borderRadius: 8,
            padding: '12px 32px',
            fontWeight: 600,
            fontSize: 22,
            boxShadow: '0 2px 8px #0001',
            transition: 'opacity 0.3s',
            zIndex: 2
          }}>
            Session finished!
          </div>
        )}
        <div style={{ fontSize: 18, color: '#78909c', marginTop: 18 }}>
          Stay focused to build your dream city!
        </div>
      </div>
    </div>
  );
};

export default FocusTimerPage; 