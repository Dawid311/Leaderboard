'use client';
import { useEffect, useState } from 'react';
import { LeaderboardData } from '../types';
import CountdownTimer from '../components/CountdownTimer';

export default function HomePage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [timerData, setTimerData] = useState<any>(null);

  useEffect(() => {
    fetchLeaderboard();
    fetchTimerData();
    
    // Aktualisiere Leaderboard-Daten alle 60 Sekunden
    const leaderboardInterval = setInterval(() => {
      fetchLeaderboard();
    }, 60000);

    // Aktualisiere Timer-Daten alle 10 Sekunden für schnellere Updates
    const timerInterval = setInterval(() => {
      fetchTimerData();
    }, 10000);

    return () => {
      clearInterval(leaderboardInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const fetchTimerData = async () => {
    try {
      // Cache-Busting mit Timestamp
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/leaderboard?action=timer&t=${timestamp}`);
      if (response.ok) {
        const timer = await response.json();
        setTimerData(timer);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Timer-Daten:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // Cache-Busting mit Timestamp
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/leaderboard?t=${timestamp}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError('Fehler beim Laden der Leaderboard-Daten');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Lade Leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button className="btn" onClick={fetchLeaderboard}>
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Leaderboard</h1>
      
      <div className="navigation">
        <a href="/" className="nav-link">Leaderboard</a>
        <a href="/admin" className="nav-link">Preise verwalten</a>
      </div>

      {data && (
        <>
          {/* Timer Section */}
          <CountdownTimer timer={timerData || data.timer} />

          <div style={{ marginBottom: '20px' }}>
            <small>Letzte Aktualisierung: {new Date(data.lastUpdated).toLocaleString('de-DE')}</small>
          </div>

          {/* Prizes Section */}
          <h2>Gewinnerpreise</h2>
          <div style={{ marginBottom: '30px' }}>
            {data.prizes.map((prize) => (
              <div key={prize.position} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px', 
                backgroundColor: '#f8f9fa',
                marginBottom: '5px',
                borderRadius: '4px'
              }}>
                <span>{prize.description}</span>
                <strong>{prize.value}</strong>
              </div>
            ))}
          </div>

          {/* Leaderboard Table */}
          <h2>Ranking</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Social Media Accounts</th>
                <th>ExpTotal</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((entry) => (
                <tr key={`${entry.rank}-${entry.expTotal}`} 
                    className={
                      entry.rank === 1 ? 'rank-1' : 
                      entry.rank === 2 ? 'rank-2' : 
                      entry.rank === 3 ? 'rank-3' : ''
                    }>
                  <td><strong>{entry.rank}</strong></td>
                  <td>
                    <div className="social-names">
                      {entry.instagram && (
                        <span className="social-name instagram">
                          📸 {entry.instagram}
                        </span>
                      )}
                      {entry.tiktok && (
                        <span className="social-name tiktok">
                          🎵 {entry.tiktok}
                        </span>
                      )}
                      {entry.facebook && (
                        <span className="social-name facebook">
                          👥 {entry.facebook}
                        </span>
                      )}
                      {entry.youtube && (
                        <span className="social-name youtube">
                          🎬 {entry.youtube}
                        </span>
                      )}
                    </div>
                  </td>
                  <td><strong>{entry.expTotal.toLocaleString('de-DE')}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn" onClick={fetchLeaderboard}>
            🔄 Aktualisieren
          </button>
        </>
      )}
    </div>
  );
}
