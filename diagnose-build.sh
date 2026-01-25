#!/bin/bash

echo "=========================================="
echo "Game Plug - Diagnostic Build Environment"
echo "=========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Vérifier répertoire
echo "1. Vérification répertoire..."
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ ERREUR: package.json introuvable${NC}"
    echo "  Vous devez être à la racine du projet"
    echo "  Répertoire actuel: $(pwd)"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✓ Répertoire racine confirmé${NC}"
fi

# 2. Vérifier workspaces
echo ""
echo "2. Vérification configuration workspaces..."
if grep -q '"workspaces"' package.json; then
    echo -e "${GREEN}✓ Workspaces configurés dans package.json${NC}"
else
    echo -e "${RED}✗ ERREUR: workspaces non configurés${NC}"
    ERRORS=$((ERRORS+1))
fi

# 3. Vérifier node_modules
echo ""
echo "3. Vérification node_modules..."
if [ ! -d "node_modules" ]; then
    echo -e "${RED}✗ ERREUR: node_modules/ n'existe pas${NC}"
    echo "  Exécuter: npm install"
    ERRORS=$((ERRORS+1))
else
    PACKAGE_COUNT=$(ls node_modules 2>/dev/null | wc -l)
    if [ "$PACKAGE_COUNT" -lt 300 ]; then
        echo -e "${RED}✗ ERREUR: Seulement $PACKAGE_COUNT packages installés${NC}"
        echo "  Attendu: 700+ packages"
        echo "  Probable: npm install exécuté dans apps/* au lieu de racine"
        ERRORS=$((ERRORS+1))
    else
        echo -e "${GREEN}✓ node_modules OK ($PACKAGE_COUNT packages)${NC}"
    fi
fi

# 4. Vérifier packages critiques
echo ""
echo "4. Vérification packages critiques..."

check_package() {
    local pkg=$1
    if [ -d "node_modules/$pkg" ]; then
        echo -e "  ${GREEN}✓${NC} $pkg"
    else
        echo -e "  ${RED}✗${NC} $pkg ${RED}MANQUANT${NC}"
        ERRORS=$((ERRORS+1))
    fi
}

check_package "tailwindcss"
check_package "@tailwindcss/typography"
check_package "qrcode.react"
check_package "@tanstack/react-query-devtools"
check_package "next"
check_package "react"

# 5. Vérifier structure projet
echo ""
echo "5. Vérification structure projet..."
if [ -d "apps/frontend" ]; then
    echo -e "  ${GREEN}✓${NC} apps/frontend/"
else
    echo -e "  ${RED}✗${NC} apps/frontend/ ${RED}MANQUANT${NC}"
    ERRORS=$((ERRORS+1))
fi

if [ -d "apps/backend" ]; then
    echo -e "  ${GREEN}✓${NC} apps/backend/"
else
    echo -e "  ${RED}✗${NC} apps/backend/ ${RED}MANQUANT${NC}"
    ERRORS=$((ERRORS+1))
fi

if [ -d "shared" ]; then
    echo -e "  ${GREEN}✓${NC} shared/"
else
    echo -e "  ${RED}✗${NC} shared/ ${RED}MANQUANT${NC}"
    ERRORS=$((ERRORS+1))
fi

# 6. Test build (optionnel)
echo ""
echo "6. Test build rapide (optionnel)..."
read -p "Voulez-vous tester le build ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  Testing frontend build..."
    cd apps/frontend
    if npm run build > /tmp/build-test.log 2>&1; then
        echo -e "  ${GREEN}✓ Frontend build RÉUSSI${NC}"
    else
        echo -e "  ${RED}✗ Frontend build ÉCHOUÉ${NC}"
        echo "  Voir: /tmp/build-test.log"
        ERRORS=$((ERRORS+1))
    fi
    cd ../..
fi

# Résumé
echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ DIAGNOSTIC RÉUSSI - Environnement OK${NC}"
    echo ""
    echo "Vous pouvez lancer le build:"
    echo "  ./build-production.sh"
else
    echo -e "${RED}❌ DIAGNOSTIC ÉCHOUÉ - $ERRORS erreur(s)${NC}"
    echo ""
    echo "Actions recommandées:"
    echo "  1. Vérifier que vous êtes à la racine du projet"
    echo "  2. Supprimer node_modules: rm -rf node_modules apps/*/node_modules"
    echo "  3. Réinstaller: npm install (depuis racine)"
    echo "  4. Relancer: ./diagnose-build.sh"
fi
echo "=========================================="

exit $ERRORS
