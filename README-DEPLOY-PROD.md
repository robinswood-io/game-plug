# 🚀 DÉPLOIEMENT PRODUCTION - INSTRUCTIONS POUR IA/AGENT

## ⚠️ LIRE EN PRIORITÉ

**Ce projet utilise NPM WORKSPACES - L'installation DOIT se faire depuis la RACINE**

Si vous installez depuis `apps/frontend/` ou `apps/backend/`, vous aurez seulement 209-212 packages au lieu de 1430, et le build ÉCHOUERA.

---

## 📋 PROCÉDURE COMPLÈTE (COPIER-COLLER)

### Étape 1: Cloner le Projet
```bash
git clone https://github.com/robinswood-io/game-plug.git
cd game-plug
```

### Étape 2: Installer TOUTES les Dépendances (RACINE UNIQUEMENT)
```bash
# ⚠️ IMPORTANT: Vous devez être à la RACINE du projet
pwd  # Doit afficher: /chemin/vers/game-plug (PAS /game-plug/apps/frontend)

# Installation depuis la racine (NPM Workspaces)
npm install

# Vérification: Compter les packages installés
ls node_modules | wc -l
# ✅ Résultat attendu: 700-800 packages
# ❌ Si <300 packages: Vous êtes dans le mauvais dossier!
```

### Étape 3: Vérifier les Dépendances Critiques
```bash
# Ces commandes DOIVENT toutes réussir
ls node_modules/tailwindcss       # ✅ Doit exister
ls node_modules/@tailwindcss/typography  # ✅ Doit exister
ls node_modules/qrcode.react      # ✅ Doit exister
ls node_modules/next              # ✅ Doit exister
ls node_modules/@tanstack/react-query-devtools  # ✅ Doit exister
```

### Étape 4: Build Backend
```bash
cd apps/backend
npm run build
# ✅ Résultat attendu: dist/ créé avec ~118 fichiers .js
ls dist/  # Doit afficher: apps/ shared/ tsconfig.build.tsbuildinfo
cd ../..
```

### Étape 5: Build Frontend
```bash
cd apps/frontend
npm run build
# ✅ Résultat attendu:
# - ✓ Compiled successfully
# - ✓ Generating static pages (10/10)
# - .next/ créé avec ~19M

ls .next/  # Doit exister
du -sh .next/  # Doit afficher: ~19M
cd ../..
```

---

## 🔍 DIAGNOSTIC EN CAS D'ERREUR

### Erreur: "Cannot find module 'tailwindcss'"

**Cause:** npm install exécuté depuis `apps/frontend/` au lieu de la racine

**Solution:**
```bash
cd /chemin/vers/game-plug  # Retour à la RACINE
rm -rf node_modules apps/*/node_modules  # Nettoyer
npm install  # Réinstaller depuis racine
```

### Erreur: "Only 209 packages installed"

**Cause:** Installation partielle depuis sous-dossier

**Solution:**
```bash
pwd  # Vérifier que vous êtes à la racine
# Si vous êtes dans apps/frontend ou apps/backend:
cd ../..  # Remonter à la racine
npm install
```

### Erreur: "@shared/schema not found"

**Cause:** Dépendances non installées ou alias non configuré

**Solution:**
```bash
cd /chemin/vers/game-plug
npm install  # Toujours depuis racine
# L'alias est déjà configuré dans:
# - apps/frontend/tsconfig.json
# - apps/frontend/next.config.js
```

### Erreur de build TypeScript

**Solution:**
```bash
cd apps/frontend
npx tsc --noEmit  # Vérifier TypeScript
# Si erreurs: consulter les logs et corriger
```

---

## 📊 VÉRIFICATIONS POST-BUILD

```bash
# 1. Backend build
test -d apps/backend/dist && echo "✅ Backend OK" || echo "❌ Backend FAIL"

# 2. Frontend build
test -d apps/frontend/.next && echo "✅ Frontend OK" || echo "❌ Frontend FAIL"

# 3. Nombre de packages
PACKAGES=$(ls node_modules | wc -l)
if [ $PACKAGES -gt 500 ]; then
  echo "✅ Packages OK ($PACKAGES)"
else
  echo "❌ Packages insuffisants ($PACKAGES, attendu >500)"
fi

# 4. Dépendances critiques
for PKG in tailwindcss next react drizzle-orm @tanstack/react-query; do
  if [ -d "node_modules/$PKG" ]; then
    echo "✅ $PKG"
  else
    echo "❌ $PKG MANQUANT"
  fi
done
```

---

## 🐳 DÉPLOIEMENT DOCKER

### Option 1: Docker Compose (Recommandé)
```bash
# À la racine du projet
docker compose up -d
```

### Option 2: Docker Build Manuel

**Backend:**
```bash
cd apps/backend
docker build -t game-plug-backend .
docker run -d -p 4000:4000 game-plug-backend
```

**Frontend:**
```bash
cd apps/frontend
docker build -t game-plug-frontend .
docker run -d -p 5000:3000 game-plug-frontend
```

---

## 🔧 VARIABLES D'ENVIRONNEMENT

### Backend (.env)
```env
NODE_ENV=production
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=game_plug
DB_USER=game_plug_user
DB_PASSWORD=<votre_mot_de_passe>
JWT_SECRET=<générer_un_secret_aléatoire>
OPENAI_API_KEY=<votre_clé_openai>
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 📝 STRUCTURE DU PROJET

```
game-plug/                          ← RACINE (npm install ICI)
├── package.json                    ← Définit workspaces
├── package-lock.json               ← Lock file principal
├── node_modules/                   ← TOUTES les dépendances (1430+ packages)
│   ├── tailwindcss/               ← Doit être ICI
│   ├── next/                      ← Doit être ICI
│   ├── react/                     ← Doit être ICI
│   └── ...
├── apps/
│   ├── frontend/
│   │   ├── package.json           ← Déclare dépendances frontend
│   │   ├── node_modules/          ← Vide ou liens symboliques
│   │   ├── .next/                 ← Créé par build
│   │   └── ...
│   └── backend/
│       ├── package.json           ← Déclare dépendances backend
│       ├── node_modules/          ← Vide ou liens symboliques
│       ├── dist/                  ← Créé par build
│       └── ...
├── shared/
│   └── schema.ts                  ← Schéma partagé
└── README-DEPLOY-PROD.md          ← Ce fichier
```

---

## ⚡ COMMANDES RAPIDES

### Installation Complète
```bash
cd /chemin/vers/game-plug && npm install && cd apps/backend && npm run build && cd ../frontend && npm run build
```

### Vérification Rapide
```bash
./diagnose-build.sh  # Script de diagnostic automatique
```

### Build Production (Script)
```bash
./build-production.sh  # Script testé et fonctionnel
```

---

## 🆘 SUPPORT

### En cas de problème:

1. **Vérifier le répertoire:**
   ```bash
   pwd  # Doit être à la racine, PAS dans apps/
   ```

2. **Nettoyer et réinstaller:**
   ```bash
   rm -rf node_modules apps/*/node_modules
   npm install  # Depuis racine
   ```

3. **Utiliser le diagnostic:**
   ```bash
   ./diagnose-build.sh
   ```

4. **Vérifier les logs:**
   ```bash
   npm run build 2>&1 | tee build.log
   ```

---

## ✅ CHECKLIST FINALE

- [ ] `pwd` affiche la racine du projet (pas apps/frontend)
- [ ] `npm install` exécuté depuis racine
- [ ] `ls node_modules | wc -l` affiche >500
- [ ] `ls node_modules/tailwindcss` existe
- [ ] `ls node_modules/next` existe
- [ ] `cd apps/backend && npm run build` réussit
- [ ] `ls apps/backend/dist` existe
- [ ] `cd apps/frontend && npm run build` réussit
- [ ] `ls apps/frontend/.next` existe
- [ ] Aucune erreur TypeScript
- [ ] Variables d'environnement configurées

---

## 🎯 RÉSUMÉ POUR IA

**SI VOUS ÊTES UNE IA/AGENT AUTOMATIQUE:**

1. Clone le repo
2. `cd game-plug` (RACINE)
3. `npm install` (DEPUIS RACINE, pas apps/*)
4. Vérifier `ls node_modules | wc -l` >500
5. `cd apps/backend && npm run build`
6. `cd ../frontend && npm run build`
7. Vérifier `.next/` et `dist/` créés

**NE JAMAIS:**
- Faire `cd apps/frontend && npm install`
- Faire `cd apps/backend && npm install`
- Installer depuis un sous-dossier

**TOUJOURS:**
- Installer depuis la racine (`/chemin/vers/game-plug`)
- Vérifier le nombre de packages (>500)
- Utiliser les scripts fournis (`diagnose-build.sh`, `build-production.sh`)

---

**Dernière mise à jour:** 2026-01-25
**Version:** 1.0.0
**Testé sur:** Ubuntu 24.04, Node.js 24, npm 10.x
