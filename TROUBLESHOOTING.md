# 🔧 Guide de Dépannage - Build Production

## 🎯 Diagnostic Rapide

### Étape 1: Vérifier le Répertoire
```bash
pwd
# ✅ CORRECT: /chemin/vers/game-plug
# ❌ INCORRECT: /chemin/vers/game-plug/apps/frontend
# ❌ INCORRECT: /chemin/vers/game-plug/apps/backend
```

Si vous êtes dans apps/*, faites:
```bash
cd ../..  # Retour à la racine
```

### Étape 2: Compter les Packages
```bash
ls node_modules | wc -l
# ✅ CORRECT: 700-800 packages
# ❌ INCORRECT: <300 packages
```

### Étape 3: Vérifier Dépendances Critiques
```bash
ls node_modules/tailwindcss && echo "✅ OK" || echo "❌ MANQUANT"
ls node_modules/next && echo "✅ OK" || echo "❌ MANQUANT"
ls node_modules/react && echo "✅ OK" || echo "❌ MANQUANT"
```

---

## 🐛 ERREURS FRÉQUENTES ET SOLUTIONS

### 1. Cannot find module 'tailwindcss'

**Erreur complète:**
```
Error: Cannot resolve module 'tailwindcss'
Module not found: Can't resolve 'tailwindcss'
```

**Diagnostic:**
```bash
ls node_modules/tailwindcss
# Si erreur "No such file": Installation incomplète
```

**Causes possibles:**
1. npm install exécuté depuis apps/frontend/ au lieu de racine
2. Installation interrompue
3. Cache npm corrompu

**Solution:**
```bash
# 1. Retour à la racine
cd /chemin/vers/game-plug

# 2. Nettoyer complètement
rm -rf node_modules apps/*/node_modules package-lock.json

# 3. Nettoyer cache npm
npm cache clean --force

# 4. Réinstaller depuis racine
npm install

# 5. Vérifier
ls node_modules | wc -l  # Doit afficher >500
```

---

### 2. Only 209-212 packages installed

**Message:**
```
added 209 packages, and audited 212 packages in 3s
```

**Diagnostic:**
```bash
ls node_modules | wc -l  # Affiche ~200
```

**Cause:** Installation depuis apps/frontend/ ou apps/backend/

**Solution:**
```bash
# Vérifier où vous êtes
pwd  # Si vous êtes dans apps/*, remontez à la racine

# Solution
cd /chemin/vers/game-plug  # RACINE
rm -rf node_modules apps/*/node_modules
npm install
```

**Vérification:**
```bash
ls node_modules | wc -l  # Doit afficher 700-800
```

---

### 3. @shared/schema not found

**Erreur complète:**
```
Cannot find module '@shared/schema'
Error: Cannot find module '@shared/schema' or its corresponding type declarations.
```

**Causes possibles:**
1. Dépendances non installées
2. Alias TypeScript non configuré
3. Installation partielle

**Solution:**
```bash
# 1. Vérifier que shared/ existe
ls shared/schema.ts  # Doit exister

# 2. Réinstaller dépendances depuis racine
cd /chemin/vers/game-plug
npm install

# 3. Vérifier alias TypeScript
cat apps/frontend/tsconfig.json | grep -A 5 "paths"
# Doit contenir: "@shared/*": ["../../shared/*"]

# 4. Vérifier next.config.js
cat apps/frontend/next.config.js | grep -A 5 "webpack"
# Doit contenir: '@shared': path.resolve(__dirname, '../../shared')
```

---

### 4. Build Frontend Échoue (TypeScript)

**Erreur:**
```
Failed to compile.
Type error: ...
```

**Solution:**
```bash
# 1. Tester TypeScript directement
cd apps/frontend
npx tsc --noEmit

# 2. Si erreurs liées à @shared
cd ../..  # Retour racine
npm install  # Réinstaller

# 3. Si erreurs de types
npm install --save-dev @types/node @types/react @types/react-dom
```

---

### 5. Build Backend Échoue

**Erreur:**
```
Error: Cannot find module ...
```

**Solution:**
```bash
# 1. Vérifier installation
cd /chemin/vers/game-plug
ls node_modules/@nestjs/core  # Doit exister

# 2. Si manquant
npm install

# 3. Rebuild
cd apps/backend
rm -rf dist
npm run build
```

---

### 6. Erreur "EACCES: permission denied"

**Erreur complète:**
```
Error: EACCES: permission denied, mkdir '/app/node_modules/.cache'
```

**Solution:**
```bash
# Option 1: Corriger les permissions
sudo chown -R $USER:$USER /chemin/vers/game-plug

# Option 2: Nettoyer et réinstaller
rm -rf node_modules apps/*/node_modules
npm install
```

---

### 7. Erreur "Turbopack root should be absolute"

**Message:**
```
⚠ turbopack.root should be absolute, using: /srv/workspace/game-plug
```

**Note:** Ceci est juste un WARNING, pas une erreur. Le build continue.

**Pour corriger (optionnel):**
Modifier `apps/frontend/next.config.js`:
```javascript
turbopack: {
  root: '/srv/workspace/game-plug',  // Path absolu
},
```

---

### 8. Build Réussit Mais Manque des Fichiers

**Diagnostic:**
```bash
# Backend
ls apps/backend/dist/
# Doit contenir: apps/ shared/ tsconfig.build.tsbuildinfo

# Frontend
ls apps/frontend/.next/
# Doit contenir: server/ static/ cache/ etc.
du -sh apps/frontend/.next/  # Doit être ~19M
```

**Si fichiers manquants:**
```bash
# Nettoyer et rebuild
cd apps/frontend
rm -rf .next
npm run build

cd ../backend
rm -rf dist
npm run build
```

---

## 🔍 SCRIPT DE DIAGNOSTIC AUTOMATIQUE

```bash
#!/bin/bash
echo "=== DIAGNOSTIC BUILD ==="

# 1. Répertoire
echo "1. Répertoire actuel:"
pwd

# 2. Packages
PKGS=$(ls node_modules 2>/dev/null | wc -l)
echo "2. Packages installés: $PKGS"
if [ $PKGS -lt 500 ]; then
  echo "   ❌ ERREUR: Trop peu de packages"
  echo "   Solution: cd à la racine et npm install"
fi

# 3. Dépendances critiques
echo "3. Dépendances critiques:"
for PKG in tailwindcss next react @nestjs/core drizzle-orm; do
  if [ -d "node_modules/$PKG" ]; then
    echo "   ✅ $PKG"
  else
    echo "   ❌ $PKG MANQUANT"
  fi
done

# 4. Builds
echo "4. Artifacts de build:"
if [ -d "apps/backend/dist" ]; then
  echo "   ✅ Backend dist/"
else
  echo "   ❌ Backend dist/ manquant"
fi

if [ -d "apps/frontend/.next" ]; then
  SIZE=$(du -sh apps/frontend/.next/ 2>/dev/null | cut -f1)
  echo "   ✅ Frontend .next/ ($SIZE)"
else
  echo "   ❌ Frontend .next/ manquant"
fi

echo ""
echo "=== FIN DIAGNOSTIC ==="
```

Enregistrer dans `diagnose-build.sh` et exécuter:
```bash
chmod +x diagnose-build.sh
./diagnose-build.sh
```

---

## 📝 CHECKLIST DE RÉSOLUTION

Pour chaque erreur de build:

- [ ] Vérifier répertoire: `pwd` → doit être racine
- [ ] Compter packages: `ls node_modules | wc -l` → >500
- [ ] Vérifier tailwindcss: `ls node_modules/tailwindcss`
- [ ] Nettoyer si besoin: `rm -rf node_modules apps/*/node_modules`
- [ ] Réinstaller: `npm install` (depuis racine)
- [ ] Vérifier: `ls node_modules | wc -l`
- [ ] Build backend: `cd apps/backend && npm run build`
- [ ] Build frontend: `cd apps/frontend && npm run build`
- [ ] Vérifier artifacts: `ls apps/backend/dist` et `ls apps/frontend/.next`

---

## 🆘 EN CAS DE BLOCAGE

Si aucune solution ne fonctionne:

1. **Sauvegarder le fichier .env:**
   ```bash
   cp apps/backend/.env /tmp/backend.env.backup
   cp apps/frontend/.env.local /tmp/frontend.env.backup
   ```

2. **Nettoyage complet:**
   ```bash
   cd /chemin/vers/game-plug
   rm -rf node_modules apps/*/node_modules apps/*/.next apps/*/dist
   rm -rf package-lock.json apps/*/package-lock.json
   npm cache clean --force
   ```

3. **Réinstallation fraîche:**
   ```bash
   npm install
   ```

4. **Rebuild tout:**
   ```bash
   ./build-production.sh
   ```

5. **Restaurer .env:**
   ```bash
   cp /tmp/backend.env.backup apps/backend/.env
   cp /tmp/frontend.env.backup apps/frontend/.env.local
   ```

---

## 📞 CONTACT / SUPPORT

Si le problème persiste, vérifier:
- Version Node.js: `node --version` (doit être 20+)
- Version npm: `npm --version` (doit être 10+)
- Espace disque: `df -h` (>2GB libre recommandé)
- Permissions: `ls -la node_modules | head` (doit être votre user)

Documentation complémentaire:
- README-DEPLOY-PROD.md
- BUILD_INSTRUCTIONS_FOR_AI.md
- QUICK_START.md
