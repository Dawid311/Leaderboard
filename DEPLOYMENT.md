# Deployment-Anleitung für Vercel

## 🚀 Deployment Schritte

### 1. Vercel CLI installieren (falls nicht vorhanden)
```bash
npm i -g vercel
```

### 2. Build testen
```bash
npm run build
```

### 3. Deploy zu Vercel
```bash
vercel --prod
```

### 4. Umgebungsvariablen setzen

Nach dem ersten Deployment über das Vercel Dashboard oder CLI:

#### Option A: Über Vercel Dashboard
1. Gehe zu vercel.com → dein Projekt → Settings → Environment Variables
2. Füge hinzu:

**Variable:** `GOOGLE_SERVICE_ACCOUNT_KEY`
**Wert:** 
```json
[IHRE_SERVICE_ACCOUNT_CREDENTIALS_JSON_HIER_EINFÜGEN]
```

**Variable:** `GOOGLE_SHEET_ID`
**Wert:** `159BP31mnBsZXyseTP36tBooaeCnVCHSoI3kvrV-UntQ`

### 5. Vercel Blob aktivieren (für Preise-Speicherung)

1. Gehe zu Vercel Dashboard → dein Projekt → Storage → Create Database
2. Wähle "Blob" aus
3. Bestätige die Einrichtung
4. Der `BLOB_READ_WRITE_TOKEN` wird automatisch gesetzt

#### Option B: Über Vercel CLI
```bash
vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
# Dann den JSON-String einfügen

vercel env add GOOGLE_SHEET_ID
# Dann: 159BP31mnBsZXyseTP36tBooaeCnVCHSoI3kvrV-UntQ
```

### 5. Redeploy nach Umgebungsvariablen-Setup
```bash
vercel --prod
```

## ✅ Nach dem Deployment

Ihre Leaderboard-API ist dann verfügbar unter:
- `https://your-domain.vercel.app/` - Hauptseite mit Leaderboard
- `https://your-domain.vercel.app/admin` - Admin-Interface für Preise
- `https://your-domain.vercel.app/api/leaderboard` - API-Endpunkt

## 🔧 Funktionen

### Automatisches Ranking
- Liest das "Globaluser" Sheet aus Ihrer Google Tabelle
- Sortiert nach ExpTotal (Spalte H) absteigend
- Zeigt Instagram, TikTok und Facebook Namen an

### Admin-Interface
- Unter `/admin` können Sie die Gewinnerpreise verwalten
- Preise werden in einer JSON-Datei gespeichert
- Einfache Bearbeitung über Web-Interface

### API
- RESTful API für externe Nutzung
- JSON-Format für einfache Integration
- Automatische Updates bei Änderungen im Google Sheet
