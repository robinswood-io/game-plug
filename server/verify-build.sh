#!/bin/bash

# Script de vérification post-build NestJS
# Vérifie que le build est complet et fonctionnel

set -e

echo "=== Vérification Build NestJS ==="
echo ""

# 1. Vérifier que dist/ existe
if [ ! -d "dist" ]; then
  echo "❌ Erreur: dist/ n'existe pas"
  exit 1
fi
echo "✅ dist/ existe"

# 2. Vérifier que main.js existe
if [ ! -f "dist/main.js" ]; then
  echo "❌ Erreur: dist/main.js n'existe pas"
  exit 1
fi
echo "✅ dist/main.js existe"

# 3. Vérifier la taille du dist
DIST_SIZE=$(du -sh dist | cut -f1)
echo "✅ Taille dist/: $DIST_SIZE"

# 4. Compter les fichiers .js
JS_COUNT=$(find dist -name "*.js" | wc -l)
echo "✅ Fichiers JS compilés: $JS_COUNT"

# 5. Vérifier modules critiques
echo ""
echo "=== Modules Critiques ==="
MODULES=("app.module" "main" "database.service" "auth.controller" "sessions.controller" "characters.controller" "sessions.gateway")
for module in "${MODULES[@]}"; do
  if find dist -name "$module.js" | grep -q .; then
    echo "✅ $module.js"
  else
    echo "❌ $module.js MANQUANT"
  fi
done

echo ""
echo "=== Build Vérification Complète ==="
