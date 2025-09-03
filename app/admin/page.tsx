'use client';
import { useEffect, useState } from 'react';
import { Prize, TimerSettings } from '../../types';

export default function AdminPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [timer, setTimer] = useState<TimerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prizeResponse, timerResponse] = await Promise.all([
        fetch('/api/prizes'),
        fetch('/api/timer')
      ]);
      
      if (prizeResponse.ok) {
        const prizeData = await prizeResponse.json();
        setPrizes(prizeData);
      }
      
      if (timerResponse.ok) {
        const timerData = await timerResponse.json();
        setTimer(timerData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Fehler beim Laden der Daten' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePrizes = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/prizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prizes),
      });

      if (!response.ok) {
        throw new Error('Failed to save prizes');
      }

      setMessage({ type: 'success', text: 'Preise erfolgreich gespeichert!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Fehler beim Speichern der Preise' });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveTimer = async () => {
    if (!timer) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/timer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timer),
      });

      if (!response.ok) {
        throw new Error('Failed to save timer');
      }

      setMessage({ type: 'success', text: 'Timer erfolgreich gespeichert!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Fehler beim Speichern des Timers' });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updatePrize = (index: number, field: keyof Prize, value: string | number) => {
    const newPrizes = [...prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setPrizes(newPrizes);
  };

  const addPrize = () => {
    const newPosition = Math.max(...prizes.map(p => p.position), 0) + 1;
    setPrizes([...prizes, {
      position: newPosition,
      description: `${newPosition}. Platz`,
      value: '0€'
    }]);
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const handleTimerUpdate = (field: keyof TimerSettings, value: string) => {
    if (!timer) return;
    setTimer({ ...timer, [field]: value });
  };

  const setTimerTo7Days = () => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const isoString = sevenDaysFromNow.toISOString().slice(0, 16);
    
    if (timer) {
      setTimer({ ...timer, endDate: isoString });
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Lade Admin-Panel...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      
      <div className="navigation">
        <a href="/" className="nav-link">Leaderboard</a>
        <a href="/admin" className="nav-link">Preise verwalten</a>
      </div>

      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </div>
      )}

      {/* Timer Management Section */}
      <div className="admin-section" style={{ marginBottom: '40px' }}>
        <h2>Contest Timer verwalten</h2>
        {timer && (
          <div className="timer-form" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Titel:</label>
              <input
                type="text"
                value={timer.title}
                onChange={(e) => handleTimerUpdate('title', e.target.value)}
                placeholder="Contest Ende"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Beschreibung:</label>
              <input
                type="text"
                value={timer.description}
                onChange={(e) => handleTimerUpdate('description', e.target.value)}
                placeholder="Bis zur Preisausschüttung"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End-Datum und Zeit:</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="datetime-local"
                  value={timer.endDate}
                  onChange={(e) => handleTimerUpdate('endDate', e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button 
                  type="button"
                  className="btn"
                  onClick={setTimerTo7Days}
                  style={{ padding: '8px 12px', fontSize: '14px' }}
                >
                  +7 Tage
                </button>
              </div>
            </div>
            
            <button 
              className="btn"
              onClick={saveTimer}
              disabled={saving}
              style={{ backgroundColor: '#007bff', color: 'white' }}
            >
              {saving ? 'Speichere...' : 'Timer speichern'}
            </button>
          </div>
        )}
      </div>

      {/* Prize Management Section */}
      <div className="admin-section">
        <h2>Preise verwalten</h2>
        
        <div className="prize-form">
          {prizes
            .sort((a, b) => a.position - b.position)
            .map((prize, index) => (
            <div key={index} className="prize-item">
              <input
                type="number"
                value={prize.position}
                onChange={(e) => updatePrize(index, 'position', parseInt(e.target.value) || 1)}
                placeholder="Position"
                style={{ width: '80px' }}
              />
              <input
                type="text"
                value={prize.description}
                onChange={(e) => updatePrize(index, 'description', e.target.value)}
                placeholder="Beschreibung"
                style={{ flex: 1 }}
              />
              <input
                type="text"
                value={prize.value}
                onChange={(e) => updatePrize(index, 'value', e.target.value)}
                placeholder="Wert"
                style={{ width: '120px' }}
              />
              <button 
                className="btn btn-danger" 
                onClick={() => removePrize(index)}
                type="button"
              >
                Entfernen
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn" onClick={addPrize} type="button">
              + Preis hinzufügen
            </button>
            <button 
              className="btn" 
              onClick={savePrizes} 
              disabled={saving}
              type="button"
            >
              {saving ? 'Speichere...' : 'Preise speichern'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Anleitung</h3>
        <ul>
          <li><strong>Timer:</strong> Setze das End-Datum für den Contest - der Countdown wird auf der Hauptseite angezeigt</li>
          <li><strong>Position:</strong> Die Platzierung (1, 2, 3, ...)</li>
          <li><strong>Beschreibung:</strong> Name/Beschreibung des Preises</li>
          <li><strong>Wert:</strong> Der Gewinn (z.B. "1000€", "Gutschein", etc.)</li>
          <li>Nach Änderungen auf "Speichern" klicken</li>
        </ul>
      </div>
    </div>
  );
}
