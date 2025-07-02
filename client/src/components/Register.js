import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } else {
      setError(data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 320, margin: '100px auto', textAlign: 'center' }}>
      <h2>Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required style={{ width: '100%', marginBottom: 8 }} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', marginBottom: 8 }} />
      <button type="submit" style={{ width: '100%' }}>Register</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ margin: '16px 0' }}>or</div>
      <button type="button" onClick={() => window.location.href = 'http://localhost:5001/auth/google'} style={{
        padding: '12px 24px',
        fontSize: 18,
        borderRadius: 8,
        background: '#4285F4',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>
        Register or Sign in with Google
      </button>
      <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
        New users will be registered automatically.
      </div>
      <div style={{ marginTop: 16 }}>
        Already have an account? <a href="/login">Sign in</a>
      </div>
    </form>
  );
};

export default Register; 