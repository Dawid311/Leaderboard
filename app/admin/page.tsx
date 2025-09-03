'use client';
import { useEffect, useState } from 'react';
import { Prize } from '../../types';

export default function AdminPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prizes');
      if (!response.ok) {
        throw new Error('Failed to fetch prizes');
      }
      const data = await response.json();
      setPrizes(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Fehler beim Laden der Preise' });
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

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Lade Preise...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Preise verwalten</h1>
      
      <div className="navigation">
        <a href="/" className="nav-link">Leaderboard</a>
        <a href="/admin" className="nav-link">Preise verwalten</a>
      </div>

      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </div>
      )}

      <div className="prize-form">
        <h2>Preise bearbeiten</h2>
        
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

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Anleitung</h3>
        <ul>
          <li>Position: Die Platzierung (1, 2, 3, ...)</li>
          <li>Beschreibung: Name/Beschreibung des Preises</li>
          <li>Wert: Der Gewinn (z.B. "1000€", "Gutschein", etc.)</li>
          <li>Nach Änderungen auf "Preise speichern" klicken</li>
        </ul>
      </div>
    </div>
  );
}
