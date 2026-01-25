# Instructions de Build pour IA/Agent de Déploiement

## ⚠️ ATTENTION: Ce projet utilise NPM WORKSPACES

**NE PAS** faire `cd apps/frontend && npm install`
**NE PAS** faire `cd apps/backend && npm install`

## Procédure Correcte (3 étapes)

### Étape 1: Aller à la RACINE du projet
```bash
cd /srv/workspace/game-plug
# OU le chemin où le projet a été cloné
```

### Étape 2: Installer TOUTES les dépendances depuis la racine
```bash
npm install
```

**Résultat attendu:**
- `1430 packages` installés (pas 209-212)
- Dossier `node_modules/` créé à la RACINE
- `node_modules/tailwindcss/` doit exister
- `node_modules/@tanstack/` doit exister

### Étape 3: Build les applications
```bash
# Option A: Script automatique (recommandé)
./build-production.sh

# Option B: Build manuel
cd apps/backend && npm run build && cd ../..
cd apps/frontend && npm run build && cd ../..
```

## Vérifications de Santé

### 1. Vérifier le nombre de packages
```bash
cd /srv/workspace/game-plug
ls node_modules | wc -l
# Doit afficher: 700+ (pas 209)
```

### 2. Vérifier tailwindcss
```bash
cd /srv/workspace/game-plug
ls node_modules/tailwindcss
# Doit afficher: bin lib package.json ...
```

### 3. Vérifier que le build réussit
```bash
cd /srv/workspace/game-plug/apps/frontend
npm run build
# Doit afficher: ✓ Compiled successfully
#                ✓ Generating static pages (10/10)
```

## Diagnostic Problèmes Courants

### Erreur: "Cannot find module 'tailwindcss'"
**Cause:** npm install exécuté dans `apps/frontend` au lieu de la racine
**Solution:**
```bash
cd /srv/workspace/game-plug
rm -rf apps/*/node_modules node_modules
npm install
```

### Erreur: "Only 209 packages installed"
**Cause:** Installation partielle depuis sous-dossier
**Solution:** Suivre Étape 1 et 2 ci-dessus

### Erreur: "@shared/schema not found"
**Cause:** Compilation TypeScript avant installation complète
**Solution:**
```bash
cd /srv/workspace/game-plug
npm install  # D'abord installer
cd apps/frontend
npm run build  # Ensuite build
```

## Structure du Monorepo

```
/srv/workspace/game-plug/          ← RACINE (exécuter npm install ICI)
├── package.json                   ← Définit workspaces
├── package-lock.json              ← Lock file principal
├── node_modules/                  ← TOUTES les dépendances
│   ├── tailwindcss/              ← Doit être ICI
│   ├── @tanstack/                ← Doit être ICI
│   ├── next/                     ← Doit être ICI
│   └── ... (1430+ packages)
├── apps/
│   ├── frontend/
│   │   ├── package.json          ← Déclare dépendances
│   │   ├── node_modules/         ← Vide ou symlinks
│   │   └── .next/                ← Généré par build
│   └── backend/
│       ├── package.json          ← Déclare dépendances
│       ├── node_modules/         ← Vide ou symlinks
│       └── dist/                 ← Généré par build
└── shared/
    └── schema.ts                  ← Schéma partagé
```

## Commandes npm INTERDITES

❌ `cd apps/frontend && npm install`
❌ `cd apps/backend && npm install`
❌ `npm install --prefix apps/frontend`
❌ `npm install --prefix apps/backend`

## Commandes npm AUTORISÉES

✅ `cd /srv/workspace/game-plug && npm install`
✅ `./build-production.sh` (depuis racine)
✅ `npm install --workspace=game-plug-frontend <package>` (depuis racine)

## Checklist Avant Build

- [ ] `pwd` affiche `/srv/workspace/game-plug` (ou équivalent racine)
- [ ] `cat package.json | grep workspaces` affiche les workspaces
- [ ] `npm install` exécuté depuis la racine (pas depuis apps/*)
- [ ] `ls node_modules/tailwindcss` affiche des fichiers
- [ ] `ls node_modules | wc -l` affiche 700+

## Checklist Après Build

- [ ] Frontend: `ls apps/frontend/.next` affiche des fichiers
- [ ] Backend: `ls apps/backend/dist` affiche des fichiers
- [ ] Aucune erreur "Cannot find module"
- [ ] Aucune erreur TypeScript
- [ ] Build affiche "✓ Compiled successfully"

## Script de Diagnostic Rapide

```bash
#!/bin/bash
cd /srv/workspace/game-plug

echo "=== DIAGNOSTIC ==="
echo "Répertoire actuel: $(pwd)"
echo "Nombre de packages: $(ls node_modules 2>/dev/null | wc -l)"
echo "tailwindcss installé: $([ -d node_modules/tailwindcss ] && echo OUI || echo NON)"
echo "Frontend .next existe: $([ -d apps/frontend/.next ] && echo OUI || echo NON)"
echo "Backend dist existe: $([ -d apps/backend/dist ] && echo OUI || echo NON)"
```

## En cas de doute

**TOUJOURS** exécuter depuis la racine:
```bash
cd /srv/workspace/game-plug
./build-production.sh
```

Ce script vérifie tout et build automatiquement.
