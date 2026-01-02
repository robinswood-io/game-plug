# ✅ Déploiement Réussi - Game Plug

## 🌐 URL d'Accès

**https://work.robinswood.io/game-plug/**

✅ **Statut** : Opérationnel
✅ **Authentification** : Gérée par l'application (pas d'OAuth2)
✅ **WebSocket** : Configuré pour la synchronisation temps réel
✅ **Uploads** : Jusqu'à 100MB supportés

## 🧪 Tests de Vérification

```bash
# Test API Health
curl https://work.robinswood.io/game-plug/api/health -k
# ✅ Résultat : {"status":"ok","message":"Server is running"}

# Test interface web
curl -I https://work.robinswood.io/game-plug/ -k
# ✅ Résultat : HTTP/2 200
```

## 🐳 Docker

### Conteneurs Actifs
- **Application** : `role-plug-app` (port 5002 → exposé via nginx)
- **Base de données** : `role-plug-db` (PostgreSQL sur port 5433)

### Commandes Utiles

```bash
# Démarrer les conteneurs
docker-compose up -d

# Arrêter les conteneurs
docker-compose down

# Voir les logs en temps réel
docker logs role-plug-app -f
docker logs role-plug-db -f

# Redémarrer l'application
docker restart role-plug-app
```

## ⚙️ Configuration Nginx

### Fichier de Configuration
**Chemin** : `/opt/ia-webdev/nginx/includes/game-plug.conf`

### Caractéristiques
- ✅ `auth_request off` : Pas d'OAuth2, l'application gère sa propre authentification
- ✅ Support WebSocket via upgrade HTTP
- ✅ Support Vite HMR pour le développement
- ✅ Timeouts étendus (600s) pour les connexions longues
- ✅ Taille max uploads : 100MB
- ✅ Rewrites : Supprime le préfixe `/game-plug` avant proxy

### Modifier la Configuration Nginx

**Important** : Le répertoire `/opt/ia-webdev/nginx/includes/` n'est PAS monté automatiquement dans le conteneur nginx.

Après toute modification, il faut copier manuellement le fichier :

```bash
# 1. Modifier le fichier sur l'hôte
nano /opt/ia-webdev/nginx/includes/game-plug.conf

# 2. Copier dans le conteneur
docker cp /opt/ia-webdev/nginx/includes/game-plug.conf \
  rbw-nginx:/opt/ia-webdev/nginx/includes/game-plug.conf

# 3. Tester la config
docker exec rbw-nginx nginx -t

# 4. Recharger nginx
docker exec rbw-nginx nginx -s reload
```

## 🔧 Dépannage

### L'application ne répond pas

```bash
# Vérifier que les conteneurs tournent
docker ps | grep role-plug

# Vérifier les logs
docker logs role-plug-app --tail 50

# Redémarrer
docker restart role-plug-app
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que l'app écoute sur le port 5002
curl http://172.18.0.1:5002/api/health

# Vérifier nginx
docker logs rbw-nginx --tail 50

# Redémarrer nginx
docker restart rbw-nginx
```

### Erreur 401 / Redirection OAuth

Si vous êtes redirigé vers Google OAuth :

```bash
# Vérifier la config nginx
docker exec rbw-nginx cat /opt/ia-webdev/nginx/includes/game-plug.conf | grep auth_request
# Doit afficher : auth_request off;

# Si nécessaire, re-copier la config
docker cp /opt/ia-webdev/nginx/includes/game-plug.conf \
  rbw-nginx:/opt/ia-webdev/nginx/includes/game-plug.conf

docker exec rbw-nginx nginx -s reload
```

### WebSocket ne fonctionne pas

```bash
# Vérifier les headers WebSocket dans nginx
docker exec rbw-nginx cat /opt/ia-webdev/nginx/includes/game-plug.conf | grep -A 2 Upgrade

# Doit afficher :
# proxy_set_header Upgrade $http_upgrade;
# proxy_set_header Connection "upgrade";
```

### Base de données inaccessible

```bash
# Vérifier PostgreSQL
docker exec role-plug-db pg_isready -U roleplug

# Voir les logs de la base
docker logs role-plug-db --tail 50

# Se connecter à la base
docker exec -it role-plug-db psql -U roleplug -d roleplug
```

## 🔑 Configuration OpenAI (Optionnel)

Pour activer la génération d'avatars et de scènes AI :

```bash
# Éditer le fichier .env
nano /home/workspace/game-plug/.env

# Remplacer la ligne :
# OPENAI_API_KEY=sk-placeholder-replace-with-real-key
# Par votre vraie clé OpenAI

# Redémarrer l'application
docker restart role-plug-app
```

## 📁 Structure des URLs

| Route | Description |
|-------|-------------|
| `/game-plug/` | Interface principale (React SPA) |
| `/game-plug/api/*` | API REST (Express.js) |
| `/game-plug/avatars/*` | Avatars générés (DALL-E 3) |
| `/game-plug/assets/*` | Assets statiques |
| `/game-plug/@vite/*` | Vite HMR (dev uniquement) |
| WebSocket | Upgrade automatique HTTP → WS |

## 📊 Architecture

```
Internet (HTTPS)
    ↓
Nginx (rbw-nginx:443)
    ↓ [reverse proxy /game-plug]
Docker Host (172.18.0.1:5002)
    ↓
role-plug-app (Express + Vite)
    ↓
role-plug-db (PostgreSQL)
```

## ✨ Fonctionnalités Actives

- ✅ Création de personnages Call of Cthulhu 7e
- ✅ Gestion de sessions de jeu (GM + joueurs)
- ✅ Système de santé mentale (Sanity)
- ✅ Système de compétences et caractéristiques
- ✅ Lancers de dés avec historique
- ✅ GameBoard avec projection d'images (GM)
- ✅ Génération d'avatars AI (si OpenAI configuré)
- ✅ Synchronisation temps réel (WebSocket)
- ✅ Interface lovecraftienne responsive

## 🛠️ Configuration Technique du Base Path

L'application est déployée sous le chemin `/game-plug/` et nécessite une configuration spéciale :

### Vite Configuration

Le fichier `vite.config.ts` DOIT contenir :
```typescript
export default defineConfig({
  base: '/game-plug/',  // IMPORTANT: Ne pas oublier ce paramètre!
  // ... reste de la config
});
```

### Rebuild après modification

Si vous modifiez le code et devez redéployer :

```bash
# 1. Vérifier que vite.config.ts a bien base: '/game-plug/'
cat vite.config.ts | grep "base:"

# 2. Arrêter les conteneurs
docker compose down

# 3. Rebuild l'image Docker (inclut npm run build)
docker compose build --no-cache app

# 4. Redémarrer
docker compose up -d

# 5. Vérifier le statut
docker ps --filter "name=role-plug"
```

**IMPORTANT** : Sans `base: '/game-plug/'` dans vite.config.ts, l'application affichera une page blanche car les assets seront cherchés aux mauvais chemins.

## 📅 Date de Déploiement

**Configuré le** : 2025-12-04
**Par** : Claude Code (Anthropic)

---

**Note** : L'application est prête pour une utilisation en production. Assurez-vous de configurer une vraie clé OpenAI pour profiter de toutes les fonctionnalités.
