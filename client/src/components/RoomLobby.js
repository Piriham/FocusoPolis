import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const RoomLobby = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomName, setRoomName] = useState('');
  const [invite, setInvite] = useState(null); // { id, link }
  const [joinCode, setJoinCode] = useState('');
  const history = useHistory();

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://focusopolis.onrender.com/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoin = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://focusopolis.onrender.com/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to join room');
      history.push(`/rooms/${roomId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    setInvite(null);
    if (!roomName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://focusopolis.onrender.com/api/rooms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: roomName.trim() })
      });
      if (!res.ok) throw new Error('Failed to create room');
      const data = await res.json();
      setInvite({
        id: data._id,
        link: `${window.location.origin}/rooms/${data._id}`
      });
      setRoomName('');
      fetchRooms();
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}>Loading rooms...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 100 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Room Lobby</h2>
      <form onSubmit={handleCreateRoom} style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
        <input
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
          placeholder="Room name"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1976d2', color: 'white', fontWeight: 500 }}>Create Room</button>
      </form>
      <form onSubmit={e => { e.preventDefault(); if (joinCode.trim()) { handleJoin(joinCode.trim()); setJoinCode(''); } else { setError('Please enter a room code.'); } }} style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
        <input
          value={joinCode}
          onChange={e => setJoinCode(e.target.value)}
          placeholder="Enter room code"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1976d2', color: 'white', fontWeight: 500 }}>Join by Code</button>
      </form>
      {invite && (
        <div style={{ background: '#e3f2fd', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ marginBottom: 8 }}><b>Invite Link:</b> <span style={{ wordBreak: 'break-all' }}>{invite.link}</span></div>
          <div style={{ marginBottom: 8 }}><b>Room Code:</b> {invite.id}</div>
          <button onClick={() => handleCopy(invite.link)} style={{ marginRight: 8, padding: '4px 12px', borderRadius: 6, border: 'none', background: '#1976d2', color: 'white' }}>Copy Link</button>
          <button onClick={() => handleCopy(invite.id)} style={{ marginRight: 8, padding: '4px 12px', borderRadius: 6, border: 'none', background: '#1976d2', color: 'white' }}>Copy Code</button>
          <button onClick={() => handleShareWhatsApp(invite.link)} style={{ marginRight: 8, padding: '4px 12px', borderRadius: 6, border: 'none', background: '#25D366', color: 'white' }}>Share WhatsApp</button>
          <button onClick={() => handleShareEmail(invite.link)} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#1976d2', color: 'white' }}>Share Email</button>
        </div>
      )}
      {rooms.length === 0 ? (
        <div style={{ textAlign: 'center' }}>No rooms available.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {rooms.map(room => (
            <li key={room._id} style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 12 }}>
              <span style={{ fontWeight: 500 }}>{room.name}</span>
              <button onClick={() => handleJoin(room._id)} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: '#1976d2', color: 'white', cursor: 'pointer' }}>Join</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomLobby; 