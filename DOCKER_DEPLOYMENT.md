# Documentation de Déploiement Docker - Rôle Plug

## 📋 Résumé du Déploiement

L'application **Rôle Plug** (Call of Cthulhu 7e RPG) est maintenant déployée avec Docker et accessible via :

**URL d'accès** : `https://work.robinswood.io/game-plug/`

## 🏗️ Architecture

### Services Docker

1. **role-plug-db** (PostgreSQL 16)
   - Port interne : 5432
   - Port hôte : 5433
   - Volumes : `role-plug-postgres` (données persistantes)
   - Healthcheck : ✅ Opérationnel

2. **role-plug-app** (Application Node.js)
   - Port interne : 5000
   - Port hôte : 5002
   - Volumes : `role-plug-avatars` (avatars générés par IA)
   - Healthcheck : ✅ Opérationnel

### Reverse Proxy Nginx

Configuration ajoutée : `/opt/ia-webdev/nginx/includes/game-plug.conf`

**Caractéristiques** :
- Authentification OAuth2 (Google @youcom.io)
- Support WebSocket pour synchronisation temps réel
- Limite d'upload : 100MB (pour avatars et images)
- Timeouts adaptés pour génération IA

## 🔐 Sécurité et Authentification

L'application est protégée par OAuth2 Proxy :
- Seuls les utilisateurs avec un compte @youcom.io peuvent accéder
- Authentification transparente via Google OAuth
- Session partagée avec l'ensemble de l'environnement work.robinswood.io

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# Base de données
POSTGRES_PASSWORD=roleplug_020a2db75da6b5674c084a09d4e22b14
POSTGRES_PORT=5433

# Application
APP_PORT=5002
NODE_ENV=production
SESSION_SECRET=LfEXk1eO4JclAyKKmchNTnTTpeiW0sqBLpLJ4owOYd4=

# OpenAI (⚠️ À CONFIGURER)
OPENAI_API_KEY=sk-placeholder-replace-with-real-key

# Replit
REPLIT_DOMAINS=work.robinswood.io
REPL_ID=docker-game-plug
```

### ⚠️ Action Requise : Clé OpenAI

La clé OpenAI actuelle est un **placeholder**. Pour activer la génération d'avatars et de scènes :

1. Obtenir une vraie clé API OpenAI
2. Mettre à jour `.env` :
   ```bash
   nano /home/workspace/game-plug/.env
   # Remplacer OPENAI_API_KEY par votre vraie clé
   ```
3. Redémarrer l'application :
   ```bash
   cd /home/workspace/game-plug
   docker compose restart app
   ```

## 🚀 Commandes de Gestion

### Démarrage/Arrêt

```bash
cd /home/workspace/game-plug

# Démarrer les services
docker compose up -d

# Arrêter les services
docker compose down

# Redémarrer
docker compose restart

# Voir les logs
docker compose logs -f app

# Voir l'état
docker compose ps
```

### Maintenance

```bash
# Reconstruire l'image après modifications
docker compose build --no-cache
docker compose up -d

# Accéder au conteneur
docker compose exec app sh

# Appliquer les migrations de schéma
docker compose exec app npm run db:push

# Backup de la base de données
docker compose exec postgres pg_dump -U roleplug roleplug > backup.sql

# Nettoyer les volumes (⚠️ SUPPRIME LES DONNÉES)
docker compose down -v
```

### Nginx

```bash
# Tester la configuration
docker exec rbw-nginx nginx -t

# Recharger Nginx
docker exec rbw-nginx nginx -s reload

# Voir les logs Nginx
docker logs rbw-nginx --tail=100 -f
```

## 🐛 Limitations Connues

### 1. Sous-chemin (/game-plug/)

L'application n'a **pas été conçue** pour fonctionner sous un sous-chemin. Cela peut causer :
- Problèmes de routing frontend (liens cassés)
- Assets statiques non chargés correctement
- WebSocket connections qui échouent

**Solutions possibles** :
1. Configurer Vite avec `base: '/game-plug/'` (nécessite rebuild)
2. Utiliser un sous-domaine dédié (ex: `game-plug.robinswood.io`)
3. Servir à la racine d'un domaine

### 2. Clé OpenAI

Sans clé OpenAI valide, les fonctionnalités suivantes ne fonctionneront pas :
- Génération d'avatars de personnages
- Génération de scènes pour le GameBoard
- Suggestions narratives IA
- Descriptions de phobies/manies

L'application reste utilisable pour tout le reste.

## 📊 Tests Effectués

### ✅ Tests Réussis

- [x] Construction de l'image Docker
- [x] Démarrage des conteneurs (app + PostgreSQL)
- [x] Application des migrations Drizzle
- [x] Healthcheck de l'application
- [x] Healthcheck de PostgreSQL
- [x] Connectivité depuis Nginx vers l'app
- [x] Configuration Nginx valide
- [x] Rechargement Nginx sans erreur

### ⏳ Tests Restants

Les tests suivants nécessitent une **clé OpenAI valide** et un **accès navigateur** :

- [ ] Accès via `https://work.robinswood.io/game-plug/`
- [ ] Authentification GM (signup/login)
- [ ] Création de session de jeu
- [ ] Création de personnage (sans IA)
- [ ] Génération d'avatar IA
- [ ] Synchronisation WebSocket entre GM et joueurs
- [ ] GameBoard avec projection d'images
- [ ] Génération de scènes IA

## 🔧 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs
docker compose logs app --tail=50

# Problème de base de données ?
docker compose exec postgres psql -U roleplug -d roleplug -c "\dt"

# Recréer depuis zéro
docker compose down -v
docker compose up -d
docker compose exec app npm run db:push
```

### Nginx ne redirige pas correctement

```bash
# Vérifier la configuration
docker exec rbw-nginx cat /opt/ia-webdev/nginx/includes/game-plug.conf

# Vérifier que le fichier est bien inclus
docker exec rbw-nginx nginx -T | grep game-plug

# Tester la connectivité depuis Nginx
docker exec rbw-nginx curl http://host.docker.internal:5002/api/health
```

### Les avatars ne se génèrent pas

1. Vérifier la clé OpenAI dans `.env`
2. Redémarrer l'application : `docker compose restart app`
3. Vérifier les logs : `docker compose logs app | grep -i openai`

### Problèmes de WebSocket

Les WebSockets nécessitent :
- Nginx configuré avec `Upgrade` et `Connection` headers (✅ déjà fait)
- L'application accessible via HTTPS (✅ via work.robinswood.io)
- Pas de timeouts trop courts (✅ timeout = 86400s)

## 📈 Prochaines Étapes

1. **Configurer la clé OpenAI** pour activer les fonctionnalités IA
2. **Tester l'accès via navigateur** à `https://work.robinswood.io/game-plug/`
3. **Corriger les problèmes de routing** (si nécessaire, reconfigurer Vite avec base path)
4. **Tester une session complète** GM + joueurs avec WebSockets
5. **Configurer un domaine dédié** (optionnel mais recommandé)

## 🎮 Utilisation

### Pour les Game Masters (GM)

1. Accéder à `https://work.robinswood.io/game-plug/`
2. S'authentifier via Google OAuth
3. Créer un compte GM (signup)
4. Créer une session de jeu
5. Partager le code de session avec les joueurs

### Pour les Joueurs

1. Recevoir le code de session du GM
2. Accéder à `https://work.robinswood.io/game-plug/join`
3. Entrer le code de session
4. Créer ou sélectionner un personnage

## 📝 Notes Techniques

- **Build size** : Entry point ~5.27 kB gzipped (excellent !)
- **Performance** : Chunks vendor séparés pour cache optimal
- **Base de données** : PostgreSQL 16 avec Drizzle ORM
- **Temps réel** : WebSocket Server (ws) pour synchronisation
- **UI** : React 18 + Radix UI + Tailwind CSS
- **Routing** : Wouter (léger, 2.9kB)
- **State** : TanStack Query (pas de Redux/Zustand)

## 🆘 Support

En cas de problème, vérifier :
1. Les logs Docker : `docker compose logs -f`
2. Les logs Nginx : `docker logs rbw-nginx -f`
3. Le statut des conteneurs : `docker compose ps`
4. La configuration Nginx : `docker exec rbw-nginx nginx -T`

---

**Déploiement effectué le** : 2025-12-04
**Environnement** : RBW (Robinswood Development Workspace)
**Statut** : ✅ Opérationnel (clé OpenAI à configurer)
