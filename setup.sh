#!/bin/bash

echo "🎯 Leaderboard API Setup"
echo "========================"

# Prüfe Node.js Version
echo "📋 Checking Node.js version..."
node --version

# Prüfe npm
echo "📋 Checking npm version..."
npm --version

# Installiere Abhängigkeiten falls nicht vorhanden
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Erstelle .env.local falls nicht vorhanden
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOL
# Google Sheets API Konfiguration
GOOGLE_SHEETS_API_KEY=your_google_api_key_here
GOOGLE_SHEET_ID=159BP31mnBsZXyseTP36tBooaeCnVCHSoI3kvrV-UntQ

# Vercel
VERCEL_URL=
EOL
    echo "✅ .env.local erstellt"
else
    echo "✅ .env.local bereits vorhanden"
fi

# Erstelle data Ordner falls nicht vorhanden
if [ ! -d "data" ]; then
    mkdir -p data
    echo "✅ data Ordner erstellt"
fi

echo ""
echo "🎉 Setup abgeschlossen!"
echo ""
echo "📝 Nächste Schritte:"
echo "   1. Google Sheets API-Schlüssel in .env.local eintragen"
echo "   2. 'npm run dev' zum Starten des Entwicklungsservers"
echo "   3. './deploy.sh' für Vercel Deployment"
echo ""
echo "🌐 URLs:"
echo "   - Leaderboard: http://localhost:3000"
echo "   - Admin: http://localhost:3000/admin"
echo "   - API: http://localhost:3000/api/leaderboard"
