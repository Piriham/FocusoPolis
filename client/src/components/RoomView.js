import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const RoomView = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [members, setMembers] = useState([]);
  const [goalProgress, setGoalProgress] = useState(null);
  const [goalAmountInput, setGoalAmountInput] = useState('');
  const [goalPeriodInput, setGoalPeriodInput] = useState('weekly');
  const [goalLoading, setGoalLoading] = useState(false);

  // Get current user id from JWT
  const token = localStorage.getItem('token');
  let currentUserId = '';
  try {
    currentUserId = jwtDecode(token).id;
  } catch {}
  const isAdmin = room && room.createdBy === currentUserId;

  // Fetch goal progress
  const fetchGoalProgress = async () => {
    setGoalLoading(true);
    try {
      const res = await fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}/goal-progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGoalProgress(data);
        if (data.goal) {
          setGoalAmountInput(data.goal.amount || '');
          setGoalPeriodInput(data.goal.period || 'weekly');
        }
      }
    } finally {
      setGoalLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const [roomRes, leaderboardRes] = await Promise.all([
          fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}/leaderboard`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (!roomRes.ok) throw new Error('Failed to fetch room details');
        if (!leaderboardRes.ok) throw new Error('Failed to fetch leaderboard');
        const roomData = await roomRes.json();
        const leaderboardData = await leaderboardRes.json();
        setRoom(roomData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
    fetchGoalProgress();
  }, [roomId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const s = io('https://focusopolis.onrender.com', {
      auth: { token }
    });
    setSocket(s);
    s.emit('joinRoom', roomId);
    s.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    // Fetch chat history
    fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(history => {
        setMessages(history);
      });
    // Also update members state for moderation
    if (room && room.members) setMembers(room.members);
    return () => {
      s.disconnect();
    };
  }, [roomId, room]);

  const handleLeave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to leave room');
      history.push('/rooms');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleShareWhatsApp = (link) => {
    window.open(`https://wa.me/?text=Join%20my%20Focusopolis%20room!%20${encodeURIComponent(link)}`);
  };

  const handleShareEmail = (link) => {
    window.open(`mailto:?subject=Join%20my%20Focusopolis%20room&body=Join%20my%20room%20using%20this%20link:%20${encodeURIComponent(link)}`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    socket.emit('chat message', { roomId, message: chatInput.trim() });
    setChatInput('');
  };

  // Update description
  const handleDescriptionSave = async () => {
    try {
      const res = await fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}/description`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: descriptionInput })
      });
      if (res.ok) {
        setEditingDescription(false);
        setRoom({ ...room, description: descriptionInput });
      }
    } catch {}
  };

  // Remove member
  const handleRemoveMember = async (userId) => {
    try {
      const res = await fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}/remove-member`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== userId));
      }
    } catch {}
  };

  // Delete room
  const handleDeleteRoom = async () => {
    if (!window.confirm('Are you sure you want to delete this room? This cannot be undone.')) return;
    try {
      const res = await fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        history.push('/rooms');
      }
    } catch {}
  };

  // Set/update goal
  const handleGoalSave = async (e) => {
    e.preventDefault();
    if (!goalAmountInput || !goalPeriodInput) return;
    setGoalLoading(true);
    try {
      const res = await fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}/goal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: Number(goalAmountInput), period: goalPeriodInput })
      });
      if (res.ok) {
        fetchGoalProgress();
      }
    } finally {
      setGoalLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}>Loading room...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 100 }}>{error}</div>;
  if (!room) return null;

  const inviteLink = `${window.location.origin}/rooms/${room._id}`;

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0' }}>
      <div style={{ textAlign: 'left', marginBottom: 16 }}>
        <button onClick={() => history.push('/')} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: '#1976d2', color: 'white', cursor: 'pointer' }}>← Back to Dashboard</button>
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>{room.name}</h2>
      {/* Room description */}
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        {isAdmin && editingDescription ? (
          <>
            <input
              value={descriptionInput}
              onChange={e => setDescriptionInput(e.target.value)}
              style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc', width: 300 }}
            />
            <button onClick={handleDescriptionSave} style={{ marginLeft: 8, padding: '6px 16px', borderRadius: 8, border: 'none', background: '#1976d2', color: 'white' }}>Save</button>
            <button onClick={() => setEditingDescription(false)} style={{ marginLeft: 8, padding: '6px 16px', borderRadius: 8, border: 'none', background: '#eee', color: '#333' }}>Cancel</button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 16, color: '#555' }}>{room.description || <i>No description</i>}</span>
            {isAdmin && (
              <button onClick={() => { setEditingDescription(true); setDescriptionInput(room.description || ''); }} style={{ marginLeft: 8, padding: '6px 16px', borderRadius: 8, border: 'none', background: '#1976d2', color: 'white' }}>Edit</button>
            )}
          </>
        )}
      </div>
      {/* Room Goal/Challenge Section */}
      <div style={{ marginBottom: 32, background: '#f5f5f5', borderRadius: 12, padding: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Room Challenge</h3>
        {goalLoading ? (
          <div>Loading goal...</div>
        ) : goalProgress && goalProgress.goal ? (
          <>
            <div style={{ marginBottom: 8 }}>
              <b>Goal:</b> {goalProgress.goal.amount} min ({goalProgress.goal.period})
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Progress:</b> {goalProgress.progress} / {goalProgress.goal.amount} min
            </div>
            <div style={{ width: '100%', height: 16, background: '#e0e0e0', borderRadius: 8, marginBottom: 8 }}>
              <div style={{
                width: `${Math.min(100, (goalProgress.progress / goalProgress.goal.amount) * 100)}%`,
                height: '100%',
                background: '#1976d2',
                borderRadius: 8,
                transition: 'width 0.3s'
              }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Top Contributors:</b>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {goalProgress.topContributors.slice(0, 5).map((c, idx) => (
                  <li key={c.id} style={{ fontSize: 14 }}>{idx + 1}. {c.username} ({c.total} min)</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div>No goal set for this room.</div>
        )}
        {isAdmin && (
          <form onSubmit={handleGoalSave} style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="number"
              min={1}
              value={goalAmountInput}
              onChange={e => setGoalAmountInput(e.target.value)}
              placeholder="Goal (min)"
              style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc', width: 120 }}
            />
            <select
              value={goalPeriodInput}
              onChange={e => setGoalPeriodInput(e.target.value)}
              style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1976d2', color: 'white', fontWeight: 500 }}>Set Goal</button>
          </form>
        )}
      </div>
      <div style={{ background: '#e3f2fd', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'center' }}>
        <div style={{ marginBottom: 8 }}><b>Invite Link:</b> <span style={{ wordBreak: 'break-all' }}>{inviteLink}</span></div>
        <div style={{ marginBottom: 8 }}><b>Room Code:</b> {room._id}</div>
        <button onClick={() => handleCopy(inviteLink)} style={{ marginRight: 8, padding: '4px 12px', borderRadius: 6, border: 'none', background: '#1976d2', color: 'white' }}>Copy Link</button>
        <button onClick={() => handleCopy(room._id)} style={{ marginRight: 8, padding: '4px 12px', borderRadius: 6, border: 'none', background: '#1976d2', color: 'white' }}>Copy Code</button>
        <button onClick={() => handleShareWhatsApp(inviteLink)} style={{ marginRight: 8, padding: '4px 12px', borderRadius: 6, border: 'none', background: '#25D366', color: 'white' }}>Share WhatsApp</button>
        <button onClick={() => handleShareEmail(inviteLink)} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#1976d2', color: 'white' }}>Share Email</button>
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3>Room Chat</h3>
        <div style={{
          height: 200,
          overflowY: 'auto',
          background: '#f5f5f5',
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
          border: '1px solid #e0e0e0',
          fontSize: 15
        }}>
          {messages.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center' }}>No messages yet.</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 6 }}>
                <b>{msg.username || 'User'}:</b> <span>{msg.message}</span>
                <span style={{ color: '#aaa', fontSize: 12, marginLeft: 8 }}>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1976d2', color: 'white', fontWeight: 500 }}>Send</button>
        </form>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button onClick={handleLeave} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: '#ff5722', color: 'white', cursor: 'pointer' }}>Leave Room</button>
      </div>
      {isAdmin && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button onClick={handleDeleteRoom} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: '#ff1744', color: 'white', fontWeight: 500 }}>Delete Room</button>
        </div>
      )}
      <h3>Members</h3>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
        {members.map(member => (
          <li key={member.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{member.username} (Buildings: {member.buildings}, Focus: {member.totalFocus} min)</span>
            {isAdmin && member.id !== currentUserId && (
              <button onClick={() => handleRemoveMember(member.id)} style={{ marginLeft: 12, padding: '4px 12px', borderRadius: 8, border: 'none', background: '#ff5722', color: 'white' }}>Remove</button>
            )}
          </li>
        ))}
      </ul>
      <h3>Leaderboard</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Rank</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Username</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Total Focus (min)</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Buildings</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((member, idx) => (
            <tr key={member.id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafbfc' }}>
              <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{member.username}</td>
              <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}>{member.totalFocus}</td>
              <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}>{member.buildings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomView; 