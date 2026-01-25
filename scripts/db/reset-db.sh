#!/bin/bash
# DANGER: Reset complet de la DB (dev uniquement)
set -e

echo "⚠️  ATTENTION: Ceci va supprimer TOUTES les données!"
echo "⚠️  Cette opération ne peut pas être annulée"
echo ""

read -p "Êtes-vous sûr? (tapez 'yes' pour confirmer): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Annulé."
  exit 0
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: DATABASE_URL non défini"
  echo "Assurez-vous que le fichier .env contient DATABASE_URL"
  exit 1
fi

echo "🔄 Réinitialisation de la base de données..."

cd /srv/workspace/game-plug

# Récupérer les informations de connexion à partir de DATABASE_URL
# Format: postgresql://user:password@host:port/database
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" || {
  echo "❌ Erreur lors de la suppression du schéma"
  exit 1
}

echo "✅ Base de données réinitialisée"
echo "📝 Appliquez les migrations avec: bash scripts/db/apply-migrations.sh"
