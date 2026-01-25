#!/bin/bash

set -e  # Exit on error

echo "==================================="
echo "Game Plug - Production Build Script"
echo "==================================="
echo ""

# Vérifier qu'on est à la racine
if [ ! -f "package.json" ] || [ ! -d "apps/frontend" ]; then
    echo "❌ ERREUR: Ce script doit être exécuté depuis la racine du projet"
    echo "   Répertoire actuel: $(pwd)"
    echo "   Attendu: /srv/workspace/game-plug (ou équivalent)"
    exit 1
fi

echo "✓ Répertoire racine confirmé: $(pwd)"
echo ""

# Nettoyer les anciens builds
echo "🧹 Nettoyage des anciens builds..."
rm -rf apps/frontend/.next
rm -rf apps/backend/dist
echo "✓ Nettoyage terminé"
echo ""

# Installer les dépendances depuis la racine
echo "📦 Installation des dépendances (npm workspaces)..."
echo "   Ceci peut prendre quelques minutes..."
npm install
echo "✓ Dépendances installées"
echo ""

# Vérifier que tailwindcss est installé
if [ ! -d "node_modules/tailwindcss" ]; then
    echo "❌ ERREUR: tailwindcss n'est pas installé dans node_modules/"
    echo "   npm install a échoué ou package.json est incorrect"
    exit 1
fi
echo "✓ tailwindcss confirmé présent"
echo ""

# Compter les packages
PACKAGE_COUNT=$(ls node_modules | wc -l)
echo "📊 Nombre de packages installés: $PACKAGE_COUNT"
if [ "$PACKAGE_COUNT" -lt 300 ]; then
    echo "⚠️  ATTENTION: Seulement $PACKAGE_COUNT packages installés"
    echo "   Attendu: 300+ packages"
    echo "   Il se peut que l'installation soit incomplète"
fi
echo ""

# Build backend
echo "🔨 Build backend..."
cd apps/backend
npm run build
if [ $? -eq 0 ]; then
    echo "✓ Backend build réussi"
else
    echo "❌ Backend build échoué"
    exit 1
fi
cd ../..
echo ""

# Build frontend
echo "🔨 Build frontend..."
cd apps/frontend
npm run build
if [ $? -eq 0 ]; then
    echo "✓ Frontend build réussi"
else
    echo "❌ Frontend build échoué"
    exit 1
fi
cd ../..
echo ""

# Vérifier les builds
echo "🔍 Vérification des artifacts de build..."

if [ -d "apps/frontend/.next" ]; then
    echo "✓ Frontend: .next/ généré"
else
    echo "❌ Frontend: .next/ manquant"
    exit 1
fi

if [ -d "apps/backend/dist" ]; then
    echo "✓ Backend: dist/ généré"
else
    echo "❌ Backend: dist/ manquant"
    exit 1
fi

echo ""
echo "==================================="
echo "✅ BUILD PRODUCTION RÉUSSI"
echo "==================================="
echo ""
echo "Artifacts générés:"
echo "  - apps/frontend/.next/"
echo "  - apps/backend/dist/"
echo ""
echo "Prochaines étapes:"
echo "  1. Vérifier les variables d'environnement"
echo "  2. Lancer docker compose ou PM2"
echo "  3. Tester l'application"
echo ""
