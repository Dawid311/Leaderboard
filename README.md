# Leaderboard API

Eine Leaderboard-API die Daten aus Google Sheets liest und Rankings basierend auf ExpTotal-Werten erstellt.

## Features

- 📊 Automatisches Ranking basierend auf ExpTotal (Spalte H)
- 🏆 Verwaltung von Gewinnerpreisen über Admin-Interface
- 📱 Social Media Integration (Instagram, TikTok, Facebook)
- 🚀 Optimiert für Vercel Deployment
- ⚡ Real-time Updates über Google Sheets API

## Setup

### 1. Google Sheets API Setup

1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes
3. Aktivieren Sie die Google Sheets API
4. Erstellen Sie einen API-Schlüssel
5. Kopieren Sie Ihren API-Schlüssel

### 2. Umgebungsvariablen

Erstellen Sie eine `.env.local` Datei:

```env
GOOGLE_SHEETS_API_KEY=Ihr_Google_API_Schlüssel
GOOGLE_SHEET_ID=159BP31mnBsZXyseTP36tBooaeCnVCHSoI3kvrV-UntQ
```

### 3. Installation

```bash
npm install
```

### 4. Entwicklung

```bash
npm run dev
```

Die Anwendung läuft dann auf http://localhost:3000

## Deployment auf Vercel

### 1. Vercel CLI Installation

```bash
npm i -g vercel
```

### 2. Deployment

```bash
vercel
```

### 3. Umgebungsvariablen in Vercel setzen

```bash
vercel env add GOOGLE_SHEETS_API_KEY
vercel env add GOOGLE_SHEET_ID
```

Oder über das Vercel Dashboard unter Settings → Environment Variables.

## API Endpunkte

### GET /api/leaderboard
Gibt das komplette Leaderboard mit Rankings und Preisen zurück.

**Response:**
```json
{
  "entries": [
    {
      "instagram": "username",
      "tiktok": "username", 
      "facebook": "username",
      "expTotal": 1500,
      "rank": 1
    }
  ],
  "prizes": [
    {
      "position": 1,
      "description": "1. Platz",
      "value": "1000€"
    }
  ],
  "lastUpdated": "2025-09-03T10:00:00.000Z"
}
```

### GET /api/prizes
Gibt alle konfigurierten Preise zurück.

### POST /api/prizes
Aktualisiert die Gewinnerpreise.

**Body:**
```json
[
  {
    "position": 1,
    "description": "1. Platz",
    "value": "1000€"
  }
]
```

## Datenstruktur

### Google Sheets Spalten
- **Spalte A**: Instagram-Namen
- **Spalte B**: TikTok-Namen  
- **Spalte C**: Facebook-Namen
- **Spalte H**: ExpTotal (für Ranking)

### Wichtige Hinweise
- Namen in den Spalten A, B, C sind optional
- ExpTotal (Spalte H) muss numerisch sein
- Ranking erfolgt automatisch nach höchstem ExpTotal

## Admin-Interface

Über `/admin` können Sie:
- ✏️ Gewinnerpreise bearbeiten
- ➕ Neue Preise hinzufügen
- 🗑️ Preise entfernen
- 💾 Änderungen speichern

## Verwendung

1. **Hauptseite** (`/`): Zeigt das aktuelle Leaderboard und die Preise
2. **Admin** (`/admin`): Verwaltung der Gewinnerpreise
3. **API**: Kann direkt in anderen Anwendungen verwendet werden

## Technologie Stack

- **Next.js 14** - React Framework
- **TypeScript** - Typsicherheit
- **Google Sheets API** - Datenquelle
- **Vercel** - Hosting und Deployment