#!/bin/bash
# Script de démarrage du backend Game Plug
# Usage: ./start-backend.sh [dev|prod]

MODE=${1:-dev}
BACKEND_DIR="/srv/workspace/game-plug/apps/backend"

cd "$BACKEND_DIR" || exit 1

# Charger les variables d'environnement
export $(cat ../../.env | grep -v '^#' | xargs)

echo "🚀 Démarrage du backend Game Plug en mode $MODE..."

if [ "$MODE" = "dev" ]; then
    echo "Mode développement (watch mode)"
    npm run start:dev
elif [ "$MODE" = "prod" ]; then
    echo "Mode production"
    # Build si nécessaire
    if [ ! -d "dist" ]; then
        echo "📦 Build du backend..."
        npm run build
    fi
    PORT=4000 node dist/apps/backend/src/main.js
else
    echo "❌ Mode invalide. Usage: ./start-backend.sh [dev|prod]"
    exit 1
fi
