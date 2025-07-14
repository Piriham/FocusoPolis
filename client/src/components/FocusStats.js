import React, { useState, useEffect } from 'react';

const FocusStats = ({ focusData }) => {
  const [activeTab, setActiveTab] = useState('daily');
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async (period) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/focus-stats?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatsData(data);
        setError(null);
      } else {
        setError('Failed to fetch stats');
      }
    } catch (err) {
      setError('Error fetching stats: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(activeTab);
  }, [activeTab]);

  // Mock data as fallback
  const mockData = {
    daily: {
      total: 180,
      sessions: 4,
      average: 45,
      goal: 240
    },
    weekly: {
      total: 840,
      sessions: 18,
      average: 47,
      goal: 1200
    },
    monthly: {
      total: 3240,
      sessions: 72,
      average: 45,
      goal: 4800
    }
  };

  const data = statsData || mockData[activeTab] || mockData.daily;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#4caf50';
    if (percentage >= 75) return '#8bc34a';
    if (percentage >= 50) return '#ffc107';
    return '#ff5722';
  };

  const renderProgressBar = (current, goal, label) => {
    const percentage = getProgressPercentage(current, goal);
    const color = getProgressColor(percentage);
    
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 500, color: '#1976d2' }}>{label}</span>
          <span style={{ color: '#666' }}>{formatTime(current)} / {formatTime(goal)}</span>
        </div>
        <div style={{
          width: '100%',
          height: 8,
          backgroundColor: '#e0e0e0',
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ 
          fontSize: 12, 
          color: '#666', 
          marginTop: 4,
          textAlign: 'right'
        }}>
          {percentage.toFixed(1)}% complete
        </div>
      </div>
    );
  };

  const renderStatsCard = (title, value, subtitle, icon) => (
    <div style={{
      background: 'rgba(255,255,255,0.8)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: '#e3f2fd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 14, color: '#666', fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1976d2' }}>{value}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#666' }}>{subtitle}</div>
    </div>
  );

  const formatSessionTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e3f2fd 0%, #b3e5fc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        color: '#1976d2'
      }}>
        Loading statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e3f2fd 0%, #b3e5fc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        color: '#f44336'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #e3f2fd 0%, #b3e5fc 100%)',
      padding: 20,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: 30,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            color: '#1976d2',
            marginBottom: 8
          }}>
            Focus Statistics
          </h1>
          <p style={{ color: '#666', fontSize: 16 }}>
            Track your productivity and build your city
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          marginBottom: 30,
          background: '#f5f5f5',
          borderRadius: 12,
          padding: 4
        }}>
          {[
            { key: 'daily', label: 'Today', icon: '📅' },
            { key: 'weekly', label: 'This Week', icon: '📊' },
            { key: 'monthly', label: 'This Month', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: 8,
                background: activeTab === tab.key ? '#1976d2' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#666',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: 14
              }}
            >
              <span style={{ marginRight: 6 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Progress Section */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ 
            fontSize: 20, 
            fontWeight: 600, 
            color: '#1976d2',
            marginBottom: 20
          }}>
            Progress Overview
          </h3>
          {renderProgressBar(
            data.total,
            data.goal,
            `Focus Time Goal (${activeTab === 'daily' ? 'Today' : activeTab === 'weekly' ? 'This Week' : 'This Month'})`
          )}
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
          {renderStatsCard(
            'Total Focus Time',
            formatTime(data.total),
            `${data.sessions} sessions completed`,
            '⏱️'
          )}
          {renderStatsCard(
            'Average Session',
            `${data.average} min`,
            'Per focus session',
            '📊'
          )}
          {renderStatsCard(
            'Sessions Completed',
            data.sessions,
            'Focus sessions',
            '✅'
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h3 style={{ 
            fontSize: 20, 
            fontWeight: 600, 
            color: '#1976d2',
            marginBottom: 20
          }}>
            Recent Sessions
          </h3>
          <div style={{
            background: '#f8f9fa',
            borderRadius: 12,
            padding: 20
          }}>
            {data.recentSessions && data.recentSessions.length > 0 ? (
              data.recentSessions.map((session, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < data.recentSessions.length - 1 ? '1px solid #e0e0e0' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: 500, color: '#333' }}>
                      {formatSessionTime(session.timestamp)}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {session.duration} minutes
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: session.status === 'completed' ? '#e8f5e8' : '#fff3cd',
                    color: session.status === 'completed' ? '#2e7d32' : '#856404'
                  }}>
                    {session.status === 'completed' ? '✓ Completed' : '⚠ Interrupted'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>
                No sessions recorded yet. Start a focus timer to see your progress!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusStats; 