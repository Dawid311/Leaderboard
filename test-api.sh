#!/bin/bash

echo "🧪 Teste Leaderboard API..."

# Test Prizes API
echo "📋 Teste Prizes API..."
curl -s http://localhost:3000/api/prizes | jq '.' || echo "❌ Prizes API nicht erreichbar"

echo ""
echo "🏆 Teste Leaderboard API..."
curl -s http://localhost:3000/api/leaderboard | jq '.' || echo "❌ Leaderboard API nicht erreichbar"

echo ""
echo "✅ API-Tests abgeschlossen"
