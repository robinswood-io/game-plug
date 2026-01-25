#!/bin/bash
# =============================================================================
# Script de déploiement - Game Plug Backend (NestJS)
# =============================================================================
# Usage: ./deploy-backend.sh
# Description: Build et deploy du backend NestJS dans Docker

set -e  # Exit on error

echo "========================================"
echo "Game Plug Backend - Deployment Script"
echo "========================================"
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "/srv/workspace/docker-compose.apps.yml" ]; then
    echo "❌ Error: docker-compose.apps.yml not found in /srv/workspace"
    exit 1
fi

cd /srv/workspace

echo "📦 Building game-plug-backend Docker image..."
docker compose -f docker-compose.apps.yml build game-plug-backend

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🚀 Starting game-plug-backend container..."
docker compose -f docker-compose.apps.yml up -d game-plug-backend

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully!"
else
    echo "❌ Failed to start container!"
    exit 1
fi

echo ""
echo "📊 Container status:"
docker compose -f docker-compose.apps.yml ps game-plug-backend

echo ""
echo "📝 Following logs (Ctrl+C to exit)..."
echo "----------------------------------------"
docker compose -f docker-compose.apps.yml logs -f game-plug-backend
