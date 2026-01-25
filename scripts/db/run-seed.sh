#!/bin/bash
# Wrapper pour exécuter le seed TypeScript
set -e

echo "🌱 Exécution du script de seed..."

cd /srv/workspace/game-plug

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: DATABASE_URL non défini"
  echo "Assurez-vous que le fichier .env contient DATABASE_URL"
  exit 1
fi

# Exécuter le seed avec tsx
npx tsx scripts/db/seed.ts

echo "✅ Script de seed exécuté avec succès"
