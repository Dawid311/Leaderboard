#!/bin/bash

echo "🚀 Deploying Leaderboard API to Vercel..."

# Prüfe ob vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI nicht installiert. Installiere mit: npm i -g vercel"
    exit 1
fi

# Build das Projekt
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build erfolgreich"
    
    # Deploy zu Vercel
    echo "🚀 Deploying zu Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment erfolgreich!"
        echo ""
        echo "📝 Vergiss nicht, die Umgebungsvariablen zu setzen:"
        echo "   - GOOGLE_SHEETS_API_KEY"
        echo "   - GOOGLE_SHEET_ID"
        echo ""
        echo "🌐 Du kannst sie setzen mit:"
        echo "   vercel env add GOOGLE_SHEETS_API_KEY"
        echo "   vercel env add GOOGLE_SHEET_ID"
    else
        echo "❌ Deployment fehlgeschlagen"
        exit 1
    fi
else
    echo "❌ Build fehlgeschlagen"
    exit 1
fi
