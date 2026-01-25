# 🤖 README POUR AGENTS IA AUTOMATIQUES

## ⚡ COMMANDES À EXÉCUTER (COPIER-COLLER)

```bash
# 1. Clone
git clone https://github.com/robinswood-io/game-plug.git
cd game-plug

# 2. CRITICAL: Vérifier que vous êtes à la RACINE
pwd
# DOIT afficher: /quelque-part/game-plug
# NE DOIT PAS afficher: /quelque-part/game-plug/apps/frontend
# NE DOIT PAS afficher: /quelque-part/game-plug/apps/backend

# 3. Install (SEULEMENT depuis cette racine)
npm install

# 4. Vérifier (CRITICAL)
ls node_modules | wc -l
# DOIT afficher: 700-800
# SI <300: ERREUR - Retour étape 2

# 5. Build Backend
cd apps/backend
npm run build
cd ../..

# 6. Build Frontend
cd apps/frontend
npm run build
cd ../..
```

## ⚠️ RÈGLES ABSOLUES

### ❌ NE JAMAIS FAIRE
```bash
cd apps/frontend && npm install  # ❌ FAUX
cd apps/backend && npm install   # ❌ FAUX
npm install --prefix apps/frontend  # ❌ FAUX
```

### ✅ TOUJOURS FAIRE
```bash
cd /chemin/vers/game-plug  # Racine
npm install  # Depuis racine uniquement
```

## 🔴 ERREURS CRITIQUES ET FIXES

### Erreur 1: "Cannot find module 'tailwindcss'"
**FIX:**
```bash
cd /chemin/vers/game-plug  # RACINE
rm -rf node_modules apps/*/node_modules
npm install
```

### Erreur 2: "Only 209 packages installed"
**FIX:** Même solution que Erreur 1

### Erreur 3: "@shared/schema not found"
**FIX:** Même solution que Erreur 1

## ✅ VALIDATION

```bash
# Test 1: Packages
test $(ls node_modules | wc -l) -gt 500 && echo "✅ OK" || echo "❌ FAIL"

# Test 2: tailwindcss
test -d node_modules/tailwindcss && echo "✅ OK" || echo "❌ FAIL"

# Test 3: Backend build
test -d apps/backend/dist && echo "✅ OK" || echo "❌ FAIL"

# Test 4: Frontend build
test -d apps/frontend/.next && echo "✅ OK" || echo "❌ FAIL"
```

## 📊 MÉTRIQUES DE SUCCÈS

| Métrique | Valeur Attendue | Commande |
|----------|----------------|----------|
| Packages | >700 | `ls node_modules \| wc -l` |
| Backend dist | Existe | `ls apps/backend/dist` |
| Frontend .next | ~19M | `du -sh apps/frontend/.next` |
| TypeScript | 0 erreurs | `cd apps/frontend && npx tsc --noEmit` |

## 🔧 SCRIPT AUTO-DIAGNOSTIC

```bash
#!/bin/bash
set -e  # Exit on error

echo "🤖 AI Agent Build Script"

# 1. Vérifier répertoire
if [ ! -f "package.json" ] || ! grep -q "workspaces" package.json; then
  echo "❌ ERREUR: Pas à la racine du projet"
  exit 1
fi
echo "✅ Répertoire racine confirmé"

# 2. Nettoyer (si rebuild)
if [ "$1" = "clean" ]; then
  rm -rf node_modules apps/*/node_modules apps/*/.next apps/*/dist
  echo "✅ Nettoyage effectué"
fi

# 3. Installer
npm install
PKGS=$(ls node_modules | wc -l)
if [ $PKGS -lt 500 ]; then
  echo "❌ ERREUR: Seulement $PKGS packages installés"
  exit 1
fi
echo "✅ $PKGS packages installés"

# 4. Build Backend
cd apps/backend
npm run build
cd ../..
echo "✅ Backend build"

# 5. Build Frontend
cd apps/frontend
npm run build
cd ../..
echo "✅ Frontend build"

# 6. Validation finale
if [ ! -d "apps/backend/dist" ]; then
  echo "❌ ERREUR: Backend dist manquant"
  exit 1
fi

if [ ! -d "apps/frontend/.next" ]; then
  echo "❌ ERREUR: Frontend .next manquant"
  exit 1
fi

echo "✅ BUILD RÉUSSI"
```

Sauvegarder dans `ai-build.sh`:
```bash
chmod +x ai-build.sh
./ai-build.sh        # Build normal
./ai-build.sh clean  # Build avec nettoyage
```

## 📚 DOCUMENTATION COMPLÈTE

- **QUICK_START.md** - 5 commandes essentielles
- **README-DEPLOY-PROD.md** - Guide complet
- **TROUBLESHOOTING.md** - Résolution d'erreurs
- **BUILD_INSTRUCTIONS_FOR_AI.md** - Instructions détaillées

## 🎯 SI BLOCAGE

1. Lire **TROUBLESHOOTING.md**
2. Exécuter `./diagnose-build.sh`
3. Vérifier `node --version` ≥ 20
4. Vérifier `npm --version` ≥ 10

## 🔑 POINTS CLÉS

1. **NPM WORKSPACES** - Installation UNIQUEMENT depuis racine
2. **VÉRIFIER** - `ls node_modules | wc -l` > 700
3. **NE PAS** - Installer depuis apps/frontend ou apps/backend
4. **TOUJOURS** - pwd doit afficher la racine, pas apps/*

---

**Version:** 1.0.0
**Testé:** Ubuntu 24.04, Node 24, npm 10
**Build time:** ~20 secondes (après installation)
