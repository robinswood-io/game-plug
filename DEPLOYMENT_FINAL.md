# ✅ Déploiement Final - Game Plug

## 🎉 Application Opérationnelle

L'application **Rôle Plug** est maintenant pleinement fonctionnelle sur :

**https://work.robinswood.io/game-plug/**

## 🔧 Corrections Appliquées

### 1. Configuration Vite (Base Path)

Le fichier `vite.config.ts` doit contenir :
```typescript
export default defineConfig({
  base: '/game-plug/',  // ESSENTIEL pour le déploiement sous-chemin
  // ... reste de la config
});
```

### 2. Configuration Router Wouter

Le fichier `client/src/App.tsx` doit wrapper le router avec :
```typescript
import { Router as WouterRouter } from "wouter";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DiceSoundProvider>
        <TooltipProvider>
          <WouterRouter base="/game-plug">
            <Toaster />
            <Router />
          </WouterRouter>
        </TooltipProvider>
      </DiceSoundProvider>
    </QueryClientProvider>
  );
}
```

### 3. Configuration Nginx

Le fichier `/opt/ia-webdev/nginx/includes/game-plug.conf` contient :
- `auth_request off` : Pas d'OAuth2
- Rewrite rules pour enlever `/game-plug` avant proxy
- Support WebSocket
- Support Vite HMR

## 🚀 Processus de Déploiement Complet

### Première Installation

```bash
# 1. Cloner/accéder au projet
cd /home/workspace/game-plug

# 2. Vérifier la configuration
cat vite.config.ts | grep "base:"
# Doit afficher: base: '/game-plug/',

cat client/src/App.tsx | grep "WouterRouter base"
# Doit afficher: <WouterRouter base="/game-plug">

# 3. Configurer les variables d'environnement
cp .env.example .env
nano .env
# Remplir : POSTGRES_PASSWORD, SESSION_SECRET, OPENAI_API_KEY

# 4. Build et démarrer
docker compose down
docker compose build --no-cache app
docker compose up -d

# 5. Vérifier
docker ps --filter "name=role-plug"
curl https://work.robinswood.io/game-plug/api/health -k
```

### Mise à Jour Après Modification du Code

```bash
# 1. Vérifier que les configs sont OK
cat vite.config.ts | grep "base:"
cat client/src/App.tsx | grep "WouterRouter base"

# 2. Rebuild Docker (inclut npm run build)
docker compose down
docker compose build --no-cache app
docker compose up -d

# 3. Attendre que le conteneur soit healthy
sleep 15
docker ps --filter "name=role-plug"

# 4. Tester
curl https://work.robinswood.io/game-plug/api/health -k
```

## 🐛 Dépannage des Problèmes Courants

### Problème : Page Blanche

**Symptôme** : La page charge mais ne contient rien (page blanche)

**Cause** : `base: '/game-plug/'` manquant dans `vite.config.ts`

**Solution** :
```bash
# Vérifier le fichier
cat vite.config.ts | grep "base:"

# Si absent, ajouter base: '/game-plug/', puis rebuild
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### Problème : 404 Page Not Found (message React)

**Symptôme** : Message "404 Page Not Found - Did you forget to add the page to the router?"

**Cause** : Wouter router n'est pas configuré avec le base path

**Solution** :
```bash
# Vérifier le fichier
cat client/src/App.tsx | grep "WouterRouter base"

# Si absent, ajouter <WouterRouter base="/game-plug">, puis rebuild
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### Problème : Assets 404 (JS/CSS ne chargent pas)

**Symptôme** : La console navigateur montre des erreurs 404 pour `/assets/...`

**Cause** : Les assets ne sont pas générés avec le bon base path

**Solution** :
```bash
# 1. Vérifier vite.config.ts
cat vite.config.ts | grep "base:"

# 2. Rebuild complet
npm run build

# 3. Vérifier le HTML généré
cat dist/public/index.html | grep "src="
# Doit montrer: src="/game-plug/assets/..."

# 4. Rebuild Docker
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### Problème : Redirection OAuth2

**Symptôme** : Redirigé vers Google OAuth

**Cause** : Configuration nginx incorrecte

**Solution** :
```bash
# Vérifier la config nginx
docker exec rbw-nginx cat /opt/ia-webdev/nginx/includes/game-plug.conf | grep auth_request
# Doit afficher: auth_request off;

# Si incorrect, recréer le fichier et copier
docker cp /opt/ia-webdev/nginx/includes/game-plug.conf \
  rbw-nginx:/opt/ia-webdev/nginx/includes/game-plug.conf

# Recharger nginx
docker exec rbw-nginx nginx -s reload
```

### Problème : WebSocket ne fonctionne pas

**Symptôme** : Pas de synchronisation temps réel entre joueurs

**Cause** : WebSocket upgrade non configuré

**Solution** :
```bash
# Vérifier nginx
docker exec rbw-nginx cat /opt/ia-webdev/nginx/includes/game-plug.conf | grep -A 2 Upgrade

# Doit afficher:
# proxy_set_header Upgrade $http_upgrade;
# proxy_set_header Connection "upgrade";
```

## 📊 Vérifications Post-Déploiement

```bash
# 1. Statut des conteneurs
docker ps --filter "name=role-plug"
# Attendu: Up X seconds (healthy)

# 2. API Health
curl https://work.robinswood.io/game-plug/api/health -k
# Attendu: {"status":"ok","message":"Server is running"}

# 3. Page HTML
curl -s https://work.robinswood.io/game-plug/ -k | grep title
# Attendu: <title>Rôle Plug - Plateforme de jeu de rôle Call of Cthulhu</title>

# 4. Assets JS
curl -I https://work.robinswood.io/game-plug/assets/index-*.js -k 2>&1 | grep HTTP/2
# Attendu: HTTP/2 200

# 5. Logs application
docker logs role-plug-app --tail 20
# Pas d'erreurs critiques

# 6. Base de données
docker exec role-plug-db pg_isready -U roleplug
# Attendu: accepting connections
```

## 🔑 Configuration OpenAI (Optionnel)

Pour activer la génération d'avatars et scènes AI :

```bash
nano /home/workspace/game-plug/.env
# Remplacer: OPENAI_API_KEY=sk-your-real-key

docker restart role-plug-app
```

## 📁 Structure du Projet

```
/home/workspace/game-plug/
├── vite.config.ts              # ⚠️ DOIT contenir base: '/game-plug/'
├── client/
│   └── src/
│       └── App.tsx             # ⚠️ DOIT contenir <WouterRouter base="/game-plug">
├── server/
│   ├── index.ts                # Point d'entrée Express
│   └── routes.ts               # API routes
├── docker-compose.yml          # Configuration Docker
├── Dockerfile                  # Multi-stage build
├── .env                        # Variables d'environnement (git-ignored)
└── dist/                       # Build output (généré, git-ignored)
    └── public/
        └── index.html          # Assets avec /game-plug/ prefix
```

## 🌐 Architecture de Déploiement

```
Internet (HTTPS)
    ↓
Nginx (rbw-nginx:443)
    ↓ [/game-plug/ → rewrite → /]
Docker Host (172.18.0.1:5002)
    ↓
role-plug-app Container
    ├── Express Server (API)
    └── Static Files (React SPA)
    ↓
role-plug-db Container
    └── PostgreSQL 16
```

## ✨ Fonctionnalités Actives

- ✅ Interface React complète avec routing
- ✅ Authentification GM (local) + joueurs (sans auth)
- ✅ Création/édition de personnages CoC 7e
- ✅ Système de santé mentale (Sanity)
- ✅ Lancers de dés avec historique
- ✅ GameBoard avec projection d'images
- ✅ Génération d'avatars AI (avec OpenAI)
- ✅ Synchronisation temps réel (WebSocket)
- ✅ Interface lovecraftienne responsive

## 📅 Historique

- **2025-12-04 14:00** : Déploiement initial Docker
- **2025-12-04 15:00** : Configuration nginx reverse proxy
- **2025-12-04 16:00** : Correction base path (vite.config.ts)
- **2025-12-04 16:30** : Correction router base path (wouter)
- **2025-12-04 16:45** : ✅ Application pleinement fonctionnelle

## 🎮 Utilisation

1. Accédez à https://work.robinswood.io/game-plug/
2. **En tant que GM** :
   - Créez un compte via "GM Sign Up"
   - Créez une session de jeu
   - Partagez le code session avec vos joueurs
3. **En tant que Joueur** :
   - Cliquez sur "Join Session"
   - Entrez le code fourni par le GM
   - Créez votre investigateur

## 🛡️ Sécurité

- ✅ HTTPS via nginx
- ✅ Conteneur non-root (user nodejs)
- ✅ Variables sensibles dans .env (git-ignored)
- ✅ Session secrets configurés
- ✅ Headers de sécurité nginx (HSTS, X-Frame-Options, etc.)

---

**Note** : Cette documentation contient tous les pièges rencontrés et leurs solutions. Gardez-la à jour si vous modifiez la configuration.
