# Guide de Déploiement Production - Game Plug

## ⚠️ IMPORTANT: Structure Monorepo NPM Workspaces

Ce projet utilise **NPM Workspaces**. Les dépendances sont gérées à la **RACINE** du projet, pas dans les sous-dossiers `apps/frontend` ou `apps/backend`.

## Installation des Dépendances

### ❌ INCORRECT (Ne PAS faire)
```bash
cd apps/frontend && npm install  # ERREUR: seulement ~209 packages
cd apps/backend && npm install   # ERREUR: dépendances manquantes
```

### ✅ CORRECT
```bash
cd /srv/workspace/game-plug  # ou le chemin racine du projet
npm install                   # Installe TOUTES les dépendances (1430+ packages)
```

## Build Production

### Frontend
```bash
cd /srv/workspace/game-plug/apps/frontend
npm run build
```

**Prérequis:** npm install doit avoir été exécuté depuis la racine.

### Backend
```bash
cd /srv/workspace/game-plug/apps/backend
npm run build
```

## Vérifications

### 1. Vérifier que tailwindcss est installé
```bash
cd /srv/workspace/game-plug
ls node_modules/tailwindcss  # Doit exister
```

### 2. Vérifier le nombre de packages
```bash
cd /srv/workspace/game-plug
npm list --depth=0 | wc -l  # Doit afficher ~300+ lignes
```

### 3. Build frontend doit réussir
```bash
cd /srv/workspace/game-plug/apps/frontend
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (10/10)
```

## Structure des Dépendances

```
/srv/workspace/game-plug/
├── package.json              # Définit les workspaces
├── package-lock.json         # Lock file principal
├── node_modules/             # TOUTES les dépendances ici
│   ├── tailwindcss/
│   ├── @tanstack/
│   ├── next/
│   └── ...
├── apps/
│   ├── frontend/
│   │   ├── package.json      # Dépendances du workspace frontend
│   │   └── node_modules/     # Vide ou symlinks (géré par workspaces)
│   └── backend/
│       ├── package.json      # Dépendances du workspace backend
│       └── node_modules/     # Vide ou symlinks (géré par workspaces)
└── shared/
    └── schema.ts             # Schéma partagé
```

## Résolution de Problèmes

### Erreur: "Cannot find module 'tailwindcss'"
**Cause:** npm install exécuté dans apps/frontend au lieu de la racine
**Solution:**
```bash
cd /srv/workspace/game-plug
rm -rf apps/*/node_modules  # Nettoyer
npm install                  # Installer depuis racine
```

### Erreur: "@shared/schema not found"
**Cause:** Alias TypeScript non résolu
**Solution:** Déjà configuré dans:
- `apps/frontend/tsconfig.json` (paths)
- `apps/frontend/next.config.js` (webpack alias)

### Erreur: "Only 209 packages installed"
**Cause:** Installation partielle depuis sous-dossier
**Solution:** Toujours installer depuis `/srv/workspace/game-plug`

## Docker Build

Le Dockerfile doit copier le package.json racine ET faire npm install depuis la racine:

```dockerfile
# WORKDIR /app (racine du monorepo)
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

RUN npm install  # Depuis la racine

# Ensuite build les apps
WORKDIR /app/apps/frontend
RUN npm run build
```

## Commandes Utiles

```bash
# Lister tous les workspaces
npm list --workspaces --depth=0

# Installer nouvelle dépendance pour le frontend
npm install --workspace=game-plug-frontend <package>

# Installer nouvelle dépendance pour le backend
npm install --workspace=game-plug-backend <package>

# Clean install complet
rm -rf node_modules apps/*/node_modules package-lock.json
npm install
```

## Checklist Déploiement

- [ ] `cd /srv/workspace/game-plug` (racine projet)
- [ ] `npm install` (pas dans apps/*)
- [ ] Vérifier `ls node_modules/tailwindcss` existe
- [ ] `cd apps/frontend && npm run build` réussit
- [ ] `cd apps/backend && npm run build` réussit
- [ ] Variables d'environnement configurées
- [ ] Docker compose ou PM2 configuré

## Support

En cas de problème de build:
1. Vérifier que vous êtes à la racine: `pwd` doit afficher `/srv/workspace/game-plug`
2. Nettoyer: `rm -rf node_modules apps/*/node_modules`
3. Réinstaller: `npm install` (depuis racine)
4. Rebuild: `cd apps/frontend && npm run build`
