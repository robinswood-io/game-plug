#!/bin/bash
# Génère une nouvelle migration Drizzle depuis le schema
set -e

echo "📝 Génération de la migration Drizzle..."

cd /srv/workspace/game-plug

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: DATABASE_URL non défini"
  echo "Assurez-vous que le fichier .env contient DATABASE_URL"
  exit 1
fi

# Générer la migration
npx drizzle-kit generate:pg --schema=./shared/schema.ts --out=./migrations

echo "✅ Migration générée avec succès dans ./migrations/"
echo "📋 Prochaines étapes:"
echo "   1. Vérifier le fichier de migration généré"
echo "   2. Exécuter: bash scripts/db/apply-migrations.sh"
