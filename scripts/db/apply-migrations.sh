#!/bin/bash
# Applique toutes les migrations pendantes
set -e

echo "🚀 Application des migrations Drizzle..."

cd /srv/workspace/game-plug

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: DATABASE_URL non défini"
  echo "Assurez-vous que le fichier .env contient DATABASE_URL"
  exit 1
fi

# Appliquer les migrations
npx drizzle-kit push:pg --schema=./shared/schema.ts

echo "✅ Migrations appliquées avec succès"
echo "📊 Base de données mise à jour"
