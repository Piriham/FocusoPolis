import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
    const res = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
    });
    const data = await res.json();
      
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
      } else {
        if (res.status === 409) {
          setError(`Username "${username}" is already taken. Please choose a different username.`);
    } else {
      setError(data.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 320, margin: '100px auto', textAlign: 'center' }}>
      <h2>Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required style={{ width: '100%', marginBottom: 8 }} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', marginBottom: 8 }} />
      <button type="submit" style={{ width: '100%' }}>Register</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 16 }}>
        Already have an account? <a href="/login">Sign in</a>
      </div>
    </form>
  );
};

export default Register; 