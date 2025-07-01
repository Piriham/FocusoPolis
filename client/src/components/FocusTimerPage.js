import React from 'react';
import Timer from './Timer';

const FocusTimerPage = ({ lastSessionLength, setLastSessionLength, handleTimerComplete }) => (
  <div className="timer-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minWidth: 450, background: '#fafbfc', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', padding: 48, marginTop: 40 }}>
    <h2>Focus Timer</h2>
    <div className="session-length-slider" style={{ marginBottom: 32 }}>
      <label htmlFor="sessionLength">Session Length: {lastSessionLength} min</label>
      <input
        type="range"
        id="sessionLength"
        min={5}
        max={120}
        step={5}
        value={lastSessionLength}
        onChange={e => setLastSessionLength(Number(e.target.value))}
        style={{ width: 350 }}
      />
    </div>
    <Timer onTimerComplete={handleTimerComplete} sessionLength={lastSessionLength} />
  </div>
);

export default FocusTimerPage; 