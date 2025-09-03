'use client';
import { useEffect, useState } from 'react';
import { LeaderboardData } from '../types';

export default function HomePage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard');
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
                <th>Namen</th>
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
