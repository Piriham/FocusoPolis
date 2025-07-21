import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #b3e5fc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        padding: '48px 36px',
        minWidth: 350,
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 24 }}>
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none"><rect x="8" y="20" width="32" height="20" rx="4" fill="#90caf9" /><rect x="16" y="12" width="16" height="12" rx="4" fill="#1976d2" /><rect x="20" y="8" width="8" height="8" rx="4" fill="#fff" /></svg>
        </div>
        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 18, color: '#1976d2', letterSpacing: 1 }}>Sign in to Focusopolis</h2>
        <form onSubmit={handleLogin} style={{ maxWidth: 320, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px solid #b3e5fc',
              fontSize: 16,
              outline: 'none',
              background: '#f5faff',
              marginBottom: 2,
              transition: 'border 0.2s',
            }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px solid #b3e5fc',
              fontSize: 16,
              outline: 'none',
              background: '#f5faff',
              marginBottom: 2,
              transition: 'border 0.2s',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 0',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: 1,
              boxShadow: '0 2px 8px #1976d233',
              cursor: 'pointer',
              marginTop: 8,
              transition: 'background 0.2s',
            }}
          >
            Sign in
          </button>
          {error && <div style={{ color: '#f44336', marginTop: 8, fontWeight: 500 }}>{error}</div>}
        </form>
        <div style={{ marginTop: 24, fontSize: 15, color: '#1976d2' }}>
          Don&apos;t have an account?{' '}
          <a href="/register" style={{ color: '#1565c0', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login; 