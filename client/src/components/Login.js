import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/auth/google';
  };

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
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>Sign in to Focusopolis</h2>
      <form onSubmit={handleLogin} style={{ maxWidth: 320, margin: '0 auto' }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required style={{ width: '100%', marginBottom: 8 }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', marginBottom: 8 }} />
        <button type="submit" style={{ width: '100%' }}>Sign in</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ margin: '16px 0' }}>or</div>
      <button onClick={handleGoogleLogin} style={{
        padding: '12px 24px',
        fontSize: 18,
        borderRadius: 8,
        background: '#4285F4',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>
        Sign in or Register with Google
      </button>
      <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
        New users will be registered automatically.
      </div>
      <div style={{ marginTop: 16 }}>
        Don't have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Login; 