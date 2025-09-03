# 🏆 Leaderboard API

Eine vollständige Leaderboard-API, die Daten aus Google Sheets liest, Preisverwaltung und Timer-Funktionalität bietet.

## 🌐 Live Demo

**Website:** https://leaderboard-pi-liard.vercel.app/

## 📋 Features

- ✅ **Leaderboard**: Automatische Rankings basierend auf ExpTotal-Werten aus Google Sheets
- ✅ **Preisverwaltung**: Dynamische Preise für beliebig viele Plätze
- ✅ **Timer/Countdown**: Einstellbarer Contest-Timer mit Deadline
- ✅ **Admin-Interface**: Einfache Verwaltung über Web-Interface
- ✅ **RESTful API**: Vollständige API für alle Funktionen
- ✅ **Responsive Design**: Funktioniert auf Desktop und Mobile

## 🚀 API Endpoints

### Einheitliche Leaderboard API

Alle Funktionen sind jetzt in einer API zusammengefasst!

#### Komplette Leaderboard-Daten abrufen
```bash
GET https://leaderboard-pi-liard.vercel.app/api/leaderboard
```

#### Nur Preise abrufen
```bash
GET https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=prizes
```

#### Nur Timer abrufen  
```bash
GET https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=timer
```

#### Preise aktualisieren
```bash
POST https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=prizes
Content-Type: application/json

[
  {"position": 1, "description": "🏆 1. Platz - Champion", "value": "10000€"},
  {"position": 2, "description": "🥈 2. Platz - Runner-up", "value": "5000€"},
  {"position": 3, "description": "🥉 3. Platz - Third Place", "value": "2500€"},
  {"position": 4, "description": "4. Platz", "value": "1000€"},
  {"position": 5, "description": "5. Platz", "value": "500€"}
]
```

#### Timer aktualisieren
```bash
POST https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=timer
Content-Type: application/json

{
  "title": "Contest endet in:",
  "description": "Preisauszahlung erfolgt nach Ablauf",
  "endDate": "2025-12-31T23:59:59"
}
```

**Response für alle POST-Operationen:**
```json
{"success": true}
```

**Response für GET (komplette Daten):**
```json
{
  "entries": [
    {
      "instagram": "kolan",
      "tiktok": "@kolan", 
      "expTotal": 1500,
      "rank": 1
    }
  ],
  "prizes": [
    {
      "position": 1,
      "description": "🏆 CHAMPION",
      "value": "10000€"
    }
  ],
  "timer": {
    "endDate": "2025-10-03T20:00",
    "title": "Contest endet in:",
    "description": "Preisauszahlung erfolgt nach Ablauf des Timers", 
    "isActive": true
  },
  "lastUpdated": "2025-09-03T17:13:38.533Z"
}
```

## 🖥️ Web-Interface

### Hauptseite (Leaderboard anzeigen)
```
https://leaderboard-pi-liard.vercel.app/
```
- Zeigt aktuelle Rankings
- Countdown-Timer
- Preise für alle Plätze
- Automatische Aktualisierung

### Admin-Panel (Preise & Timer verwalten)
```
https://leaderboard-pi-liard.vercel.app/admin
```
- Preise hinzufügen/bearbeiten/löschen
- Timer-Datum und -Beschreibung setzen
- Einfache Formular-Oberfläche

## 📝 Verwendungsbeispiele

### Preise mit cURL setzen

```bash
# Neue Preise für 5 Plätze setzen
curl -X POST "https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=prizes" 
  -H "Content-Type: application/json" 
  -d '[
    {"position":1,"description":"🥇 1. Platz - Gold","value":"5000€"},
    {"position":2,"description":"🥈 2. Platz - Silber","value":"2500€"},
    {"position":3,"description":"🥉 3. Platz - Bronze","value":"1250€"},
    {"position":4,"description":"4. Platz","value":"625€"},
    {"position":5,"description":"5. Platz","value":"300€"}
  ]'
```

### Timer mit cURL setzen

```bash
# Contest-Ende auf 7 Tage in der Zukunft setzen
curl -X POST "https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=timer" 
  -H "Content-Type: application/json" 
  -d '{
    "title": "Contest Ende",
    "description": "Bis zur Preisausschüttung",
    "endDate": "2025-12-31T20:00:00"
  }'
```

### Daten mit JavaScript abrufen

```javascript
// Leaderboard-Daten abrufen
async function getLeaderboard() {
  const response = await fetch('https://leaderboard-pi-liard.vercel.app/api/leaderboard');
  const data = await response.json();
  
  console.log('Rankings:', data.entries);
  console.log('Preise:', data.prizes);
  console.log('Timer:', data.timer);
}

// Nur Preise abrufen
async function getPrizes() {
  const response = await fetch('https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=prizes');
  const prizes = await response.json();
  return prizes;
}

// Preise aktualisieren
async function updatePrizes(prizes) {
  const response = await fetch('https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=prizes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prizes)
  });
  
  return response.json();
}

// Timer aktualisieren
async function updateTimer(timer) {
  const response = await fetch('https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=timer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(timer)
  });
  
  return response.json();
}
```

## 🔧 Datenstruktur

### LeaderboardEntry
```typescript
{
  instagram?: string;    // Instagram-Handle
  tiktok?: string;       // TikTok-Handle  
  facebook?: string;     // Facebook-Name
  expTotal: number;      // Experience-Punkte
  rank: number;          // Berechnung: Position im Ranking
}
```

### Prize
```typescript
{
  position: number;      // Platzierung (1, 2, 3, ...)
  description: string;   // Beschreibung des Preises
  value: string;         // Wert (z.B. "1000€", "Gutschein")
}
```

### TimerSettings
```typescript
{
  title: string;         // Timer-Titel
  description: string;   // Timer-Beschreibung
  endDate: string;       // ISO-String: "2025-12-31T23:59:59"
  isActive: boolean;     // Automatisch: true wenn endDate in der Zukunft
}
```

## 🎯 Häufige Anwendungsfälle

### 1. Contest mit 5 Preisen einrichten

1. **Preise setzen** (über Admin-Panel oder API)
2. **Timer setzen** auf Contest-Ende
3. **Link teilen**: https://leaderboard-pi-liard.vercel.app/

### 2. Preise während Contest ändern

```bash
# Preisgeld erhöhen
curl -X POST "https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=prizes" 
  -H "Content-Type: application/json" 
  -d '[{"position":1,"description":"🏆 GRAND PRIZE","value":"15000€"},
    {"position":2,"description":"🥈 RUNNER-UP","value":"7500€"},
    {"position":3,"description":"🥉 THIRD PLACE","value":"3000€"}
  ]'
```

### 3. Contest verlängern

```bash
# Timer um 7 Tage verlängern
curl -X POST "https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=timer" 
  -H "Content-Type: application/json" 
  -d '{
    "title": "Contest VERLÄNGERT!",
    "description": "Neue Deadline - Noch eine Woche Zeit!",
    "endDate": "2025-12-31T23:59:59"
  }'
```

## 📱 Mobile Optimierung

Die Anwendung ist vollständig responsive und funktioniert optimal auf:
- 📱 Smartphones 
- 📱 Tablets
- 💻 Desktop
- 🖥️ Large Screens

## 🔄 Automatische Updates

- **Leaderboard**: Daten werden automatisch aus Google Sheets geladen
- **Rankings**: Automatische Sortierung nach ExpTotal-Werten
- **Timer**: Live-Countdown mit Sekunden-Genauigkeit
- **Storage**: Persistente Speicherung in Vercel Blob

## 🚨 Fehlerbehebung

### Preise werden nicht gespeichert
```bash
# Prüfe ob API erreichbar ist
curl https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=prizes

# Teste einfaches Beispiel
curl -X POST "https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=prizes" 
  -H "Content-Type: application/json" 
  -d '[{"position":1,"description":"Test","value":"100€"}]'
```

### Timer funktioniert nicht
```bash
# Prüfe Timer-Status
curl https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=timer

# Setze neuen Timer
curl -X POST "https://leaderboard-pi-liard.vercel.app/api/leaderboard?action=timer" 
  -H "Content-Type: application/json" 
  -d '{"title":"Test Timer","description":"Test","endDate":"2025-12-31T20:00:00"}'
```

## 📞 Support

Bei Problemen oder Fragen:
1. Prüfe die API-Endpoints direkt
2. Schaue in die Browser-Konsole für JavaScript-Fehler
3. Teste mit einfachen cURL-Befehlen

---

**Erstellt mit Next.js, TypeScript, Google Sheets API und Vercel** 🚀