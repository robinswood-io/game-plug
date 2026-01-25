#!/bin/bash
set -e  # Exit on error

echo "=========================================="
echo "🤖 Game Plug - AI Agent Build Script"
echo "=========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Vérifier répertoire racine
echo "1. Vérification répertoire..."
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERREUR: package.json introuvable${NC}"
    echo "   Vous devez être à la racine du projet"
    echo "   Répertoire actuel: $(pwd)"
    exit 1
fi

if ! grep -q "workspaces" package.json; then
    echo -e "${RED}❌ ERREUR: workspaces non configurés dans package.json${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Répertoire racine confirmé: $(pwd)${NC}"
echo ""

# 2. Nettoyer si demandé
if [ "$1" = "clean" ] || [ "$1" = "--clean" ]; then
    echo "2. Nettoyage complet..."
    rm -rf node_modules apps/*/node_modules apps/*/.next apps/*/dist
    rm -rf package-lock.json
    echo -e "${GREEN}✅ Nettoyage terminé${NC}"
    echo ""
fi

# 3. Installer dépendances
echo "3. Installation des dépendances (NPM Workspaces)..."
npm install

# Vérifier nombre de packages
PACKAGE_COUNT=$(ls node_modules 2>/dev/null | wc -l)
echo -e "${GREEN}✅ $PACKAGE_COUNT packages installés${NC}"

if [ "$PACKAGE_COUNT" -lt 500 ]; then
    echo -e "${RED}❌ ERREUR: Seulement $PACKAGE_COUNT packages installés${NC}"
    echo "   Attendu: 700+ packages"
    echo "   Probable: npm install exécuté dans mauvais dossier"
    exit 1
fi
echo ""

# 4. Vérifier dépendances critiques
echo "4. Vérification dépendances critiques..."
CRITICAL_DEPS=(
    "tailwindcss"
    "@tailwindcss/typography"
    "qrcode.react"
    "next"
    "react"
    "@nestjs/core"
    "drizzle-orm"
    "@tanstack/react-query"
)

for DEP in "${CRITICAL_DEPS[@]}"; do
    if [ -d "node_modules/$DEP" ]; then
        echo -e "  ${GREEN}✅${NC} $DEP"
    else
        echo -e "  ${RED}✗${NC} $DEP ${RED}MANQUANT${NC}"
        ERRORS=$((ERRORS+1))
    fi
done

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ $ERRORS dépendances critiques manquantes${NC}"
    exit 1
fi
echo ""

# 5. Build Backend
echo "5. Build Backend..."
cd apps/backend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build réussi${NC}"
else
    echo -e "${RED}❌ Backend build échoué${NC}"
    exit 1
fi
cd ../..
echo ""

# 6. Build Frontend
echo "6. Build Frontend..."
cd apps/frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build réussi${NC}"
else
    echo -e "${RED}❌ Frontend build échoué${NC}"
    exit 1
fi
cd ../..
echo ""

# 7. Vérification finale
echo "7. Vérification artifacts de build..."

if [ ! -d "apps/backend/dist" ]; then
    echo -e "${RED}✗ Backend: dist/ manquant${NC}"
    ERRORS=$((ERRORS+1))
else
    JS_COUNT=$(find apps/backend/dist -name "*.js" 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ Backend: dist/ généré ($JS_COUNT fichiers JS)${NC}"
fi

if [ ! -d "apps/frontend/.next" ]; then
    echo -e "${RED}✗ Frontend: .next/ manquant${NC}"
    ERRORS=$((ERRORS+1))
else
    NEXT_SIZE=$(du -sh apps/frontend/.next/ 2>/dev/null | cut -f1)
    echo -e "${GREEN}✅ Frontend: .next/ généré ($NEXT_SIZE)${NC}"
fi

echo ""

# Résumé final
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ BUILD RÉUSSI - Tous les checks passés${NC}"
    echo ""
    echo "Artifacts générés:"
    echo "  - apps/backend/dist/"
    echo "  - apps/frontend/.next/"
    echo ""
    echo "Prochaines étapes:"
    echo "  1. Configurer variables d'environnement (.env)"
    echo "  2. Lancer docker compose ou PM2"
    echo "  3. Tester l'application"
else
    echo -e "${RED}❌ BUILD ÉCHOUÉ - $ERRORS erreur(s)${NC}"
    echo ""
    echo "Actions recommandées:"
    echo "  1. Lire TROUBLESHOOTING.md"
    echo "  2. Exécuter: ./ai-build.sh clean"
    echo "  3. Vérifier: node --version (≥20) et npm --version (≥10)"
fi
echo "=========================================="

exit $ERRORS
