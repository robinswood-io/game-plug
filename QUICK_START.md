# ⚡ QUICK START - Build Production en 5 Commandes

## Pour IA/Agent Automatique

```bash
# 1. Cloner
git clone https://github.com/robinswood-io/game-plug.git && cd game-plug

# 2. Installer (RACINE uniquement)
npm install

# 3. Vérifier (DOIT afficher >500)
ls node_modules | wc -l

# 4. Build Backend
cd apps/backend && npm run build && cd ../..

# 5. Build Frontend
cd apps/frontend && npm run build && cd ../..
```

## ⚠️ RÈGLE D'OR

**TOUJOURS installer depuis `/chemin/vers/game-plug` (racine)**
**JAMAIS depuis `apps/frontend` ou `apps/backend`**

## ✅ Succès si:
- `ls node_modules | wc -l` > 500 packages
- `ls apps/backend/dist` existe
- `ls apps/frontend/.next` existe
- Aucune erreur "Cannot find module"

## ❌ Échec si:
- Seulement 209-212 packages → Installation depuis mauvais dossier
- "Cannot find module tailwindcss" → Même problème
- "@shared/schema not found" → Même problème

## 🔧 Correction Rapide
```bash
cd /chemin/vers/game-plug  # Retour racine
rm -rf node_modules apps/*/node_modules
npm install  # Réinstaller depuis racine
```

## 📖 Documentation Complète
- README-DEPLOY-PROD.md - Guide détaillé
- BUILD_INSTRUCTIONS_FOR_AI.md - Instructions pour agents
- diagnose-build.sh - Script de diagnostic
- build-production.sh - Script de build automatique
