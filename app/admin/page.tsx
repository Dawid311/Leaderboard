'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';

interface Prize {
  position: number;
  description: string;
  value: string;
}

interface TimerSettings {
  isActive: boolean;
  title: string;
  description: string;
  endDate: string;
  contestStartDate?: string;
  startExp?: Array<{
    instagram: number;
    tiktok: number;
    facebook: number;
    expTotal: number;
  }>;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface LeaderboardEntry {
  instagram: number;
  tiktok: number;
  facebook: number;
  expTotal: number;
}

export default function AdminPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [timer, setTimer] = useState<TimerSettings | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prizeResponse, timerResponse] = await Promise.all([
        fetch('/api/leaderboard?action=prizes'),
        fetch('/api/leaderboard?action=timer')
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

  useEffect(() => {
    // Prüfe Auth-Status und leite um
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  // Separater useEffect für das Laden der Daten
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      loadData();
    }
  }, []);

  // Entferne Nachrichten automatisch nach 5 Sekunden
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const savePrizes = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/leaderboard?action=prizes', {
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
      
      // Stelle sicher, dass isActive als Boolean gesetzt ist
      const timerToSave = {
        ...timer,
        isActive: Boolean(timer.isActive)
      };

      const response = await fetch('/api/leaderboard?action=timer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timerToSave),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to save timer');
      }

      setMessage({ type: 'success', text: 'Timer erfolgreich gespeichert!' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setMessage({ type: 'error', text: `Fehler beim Speichern des Timers: ${errorMessage}` });
      console.error('Timer save error:', err);
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

  const handleTimerUpdate = (field: keyof TimerSettings, value: string | boolean) => {
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

  const restartTimer = async () => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const isoString = sevenDaysFromNow.toISOString().slice(0, 16);
    
    try {
      // Hole aktuelle EXP-Werte als Startwerte
      const response = await fetch('/api/leaderboard');
      if (!response.ok) throw new Error('Failed to fetch current leaderboard');
      const data = await response.json();
      
      if (timer) {
        const newTimer = { 
          ...timer, 
          endDate: isoString,
          isActive: true,
          title: 'Contest endet in:',
          description: 'Preisauszahlung erfolgt nach Ablauf des Timers',
          contestStartDate: new Date().toISOString(),
          startExp: data.entries.map((entry: LeaderboardEntry) => ({
            instagram: entry.instagram,
            tiktok: entry.tiktok,
            facebook: entry.facebook,
            expTotal: entry.expTotal
          }))
        };

        // Speichere den Timer sofort
        const saveResponse = await fetch('/api/leaderboard?action=timer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTimer),
        });

        if (!saveResponse.ok) {
          throw new Error('Failed to save timer with start values');
        }

        setTimer(newTimer);
        setMessage({ 
          type: 'success', 
          text: 'Timer neu gestartet und Start-EXP-Werte erfolgreich gespeichert!' 
        });
        
        // Aktualisiere die Anzeige
        loadData();
      }
    } catch (error) {
      console.error('Error restarting timer:', error);
      setMessage({ 
        type: 'error', 
        text: 'Fehler beim Neustart des Timers. Bitte versuchen Sie es erneut.' 
      });
    }
  };

  const isTimerExpired = () => {
    if (!timer) return false;
    const endDate = new Date(timer.endDate);
    const now = new Date();
    return endDate.getTime() <= now.getTime();
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  if (!token) {
    return (
      <div className="container">
        <div className="loading">Überprüfe Authentifizierung...</div>
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
            {/* Timer Status Display */}
            <div className="timer-status" style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              borderRadius: '6px',
              backgroundColor: timer.isActive ? (isTimerExpired() ? '#fff3cd' : '#d4edda') : '#f8d7da',
              border: `1px solid ${timer.isActive ? (isTimerExpired() ? '#ffeaa7' : '#c3e6cb') : '#f5c6cb'}`
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                Status: {timer.isActive ? (isTimerExpired() ? '⏰ Abgelaufen' : '✅ Aktiv') : '❌ Inaktiv'}
              </h3>
              {isTimerExpired() && timer.isActive && (
                <p style={{ margin: '5px 0', color: '#856404' }}>
                  🎉 Der Contest ist beendet! Sie können den Timer neu starten für einen neuen Contest.
                </p>
              )}
              {!timer.isActive && (
                <p style={{ margin: '5px 0', color: '#721c24' }}>
                  Der Timer ist deaktiviert und wird nicht auf der Hauptseite angezeigt.
                </p>
              )}
            </div>

            {/* Timer Active Toggle */}
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={timer.isActive}
                  onChange={(e) => handleTimerUpdate('isActive', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                Timer aktiviert (wird auf der Hauptseite angezeigt)
              </label>
            </div>

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
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                {(isTimerExpired() || !timer.isActive) && (
                  <button 
                    type="button"
                    className="btn"
                    onClick={restartTimer}
                    style={{ 
                      padding: '8px 12px', 
                      fontSize: '14px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    🔄 Timer neu starten
                  </button>
                )}
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
            .sort((a: Prize, b: Prize) => a.position - b.position)
            .map((prize: Prize, index: number) => (
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
          <li><strong>Timer aktivieren/deaktivieren:</strong> Checkbox bestimmt, ob der Timer auf der Hauptseite angezeigt wird</li>
          <li><strong>Timer neu starten:</strong> Setzt automatisch ein neues End-Datum (7 Tage) und aktiviert den Timer</li>
          <li><strong>End-Datum:</strong> Setze das End-Datum für den Contest - der Countdown wird auf der Hauptseite angezeigt</li>
          <li><strong>+7 Tage Button:</strong> Setzt das End-Datum auf 7 Tage ab jetzt</li>
          <li><strong>Position:</strong> Die Platzierung (1, 2, 3, ...)</li>
          <li><strong>Beschreibung:</strong> Name/Beschreibung des Preises</li>
          <li><strong>Wert:</strong> Der Gewinn (z.B. "1000€", "Gutschein", etc.)</li>
          <li>Nach Änderungen auf "Speichern" klicken</li>
        </ul>
      </div>
    </div>
  );
}
