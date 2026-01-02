# ✅ Déploiement Final - Rôle Plug

## 🎉 Application Déployée et Fonctionnelle

L'application **Rôle Plug** est maintenant accessible sur :

**https://role-plug.robinswood.io/**

## ✅ Status

- **Application** : Running ✅
- **Base de données** : PostgreSQL 16 (healthy) ✅
- **Port** : 5002 ✅
- **SSL** : Configuré ✅
- **WebSocket** : Supporté ✅
- **Personnages** : 49 chargés ✅

## 🔧 Configuration Finale

### Backend (Docker)
- **Container** : `role-plug-app`
- **Image** : Built from Dockerfile
- **Port interne** : 5000
- **Port exposé** : 5002
- **Réseau** : role-plug-network
- **Base path** : `/` (racine, pas de sous-chemin)

### Frontend
- **Build** : Production optimisé (Vite)
- **Bundle size** : ~5.27 kB (gzipped entry point)
- **Router** : Wouter (pas de base path)
- **Assets** : Servis depuis `/assets/`

### Nginx
- **Fichier** : `/etc/nginx/conf.d/public-subdomains.conf`
- **Domaine** : role-plug.robinswood.io
- **Proxy** : http://host.docker.internal:5002 (résolu vers 172.18.0.1)
- **SSL** : Certificat wildcard (robinswood.io)
- **Authentification** : Désactivée (public access)

### Base de données
- **Container** : `role-plug-db`
- **Version** : PostgreSQL 16 Alpine
- **Port** : 5432 (interne), 5433 (exposé)
- **Database** : roleplug
- **User** : roleplug
- **Connexion** : Via réseau Docker (postgres:5432)

## 🐛 Problèmes Résolus

### 1. Erreur 404 "Cannot GET /"

**Problème** : L'ordre des middlewares Express était incorrect. Le middleware d'erreur était enregistré AVANT `serveStatic()`, interceptant toutes les requêtes.

**Solution** : Déplacé l'appel à `serveStatic()` AVANT l'enregistrement du middleware d'erreur dans `server/index.ts`.

```typescript
// AVANT (incorrect)
await registerRoutes(app);
app.use(errorHandler); // ❌ Bloque tout
server.listen(() => {
  serveStatic(app); // Jamais atteint
});

// APRÈS (correct)
await registerRoutes(app);
// Setup static files BEFORE error handler
if (isProduction) {
  serveStatic(app); // ✅
}
app.use(errorHandler); // ✅ En dernier
server.listen(() => { ... });
```

### 2. Problème de réseau Docker

**Problème** : Dans l'environnement, `localhost:5433` n'est pas accessible pour la connexion PostgreSQL depuis l'hôte.

**Solution** : Utilisé Docker Compose pour lancer toute la stack. L'application accède à PostgreSQL via le nom de service `postgres:5432` dans le réseau Docker interne.

### 3. Configuration DNS/Nginx

**Problème** : Confusion entre `game-plug.robinswood.io` et `role-plug.robinswood.io`.

**Solution** : Utilisation du domaine existant `role-plug.robinswood.io` qui était déjà configuré dans Nginx.

## 📊 Tests de Vérification

```bash
# 1. Status des conteneurs
docker ps --filter "name=role-plug"
# ✅ role-plug-app: Up (healthy)
# ✅ role-plug-db: Up (healthy)

# 2. API Health Check
curl -sk https://role-plug.robinswood.io/api/health
# ✅ {"status":"ok","message":"Server is running"}

# 3. Page HTML
curl -skL https://role-plug.robinswood.io/ | head -10
# ✅ <!DOCTYPE html> ... Rôle Plug ...

# 4. Assets
curl -skI https://role-plug.robinswood.io/assets/index-aZoJGR05.js
# ✅ HTTP/2 200

# 5. WebSocket (depuis la console navigateur)
# ✅ Connexion établie

# 6. Base de données
docker exec role-plug-db pg_isready -U roleplug
# ✅ accepting connections
```

## 🔄 Commandes de Maintenance

### Redémarrer l'application
```bash
cd /home/workspace/game-plug
docker compose restart role-plug-app
```

### Voir les logs
```bash
docker logs role-plug-app --tail 50 -f
```

### Rebuild après modification du code
```bash
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### Accéder à la base de données
```bash
docker exec -it role-plug-db psql -U roleplug -d roleplug
```

### Backup de la base de données
```bash
docker exec role-plug-db pg_dump -U roleplug roleplug > backup-$(date +%Y%m%d).sql
```

## 📁 Fichiers Importants

```
/home/workspace/game-plug/
├── vite.config.ts                 # base: '/' (racine)
├── client/src/App.tsx             # Router sans base path
├── server/
│   ├── index.ts                   # Ordre middlewares corrigé
│   ├── vite.ts                    # serveStatic() pour production
│   └── routes.ts                  # API endpoints
├── docker-compose.yml             # Stack complète
├── Dockerfile                     # Multi-stage build
├── .env                           # DATABASE_URL=postgres:5432
└── DEPLOYMENT_FINAL_RESOLUTION.md # Ce fichier
```

## 🌐 URLs

- **Production** : https://role-plug.robinswood.io/
- **API Health** : https://role-plug.robinswood.io/api/health
- **API Base** : https://role-plug.robinswood.io/api/

## 🎮 Utilisation

### Pour les Game Masters (GM)
1. Accédez à https://role-plug.robinswood.io/
2. Créez un compte GM via "GM Sign Up"
3. Créez une session de jeu
4. Partagez le code de session (6 caractères) avec vos joueurs

### Pour les Joueurs
1. Accédez à https://role-plug.robinswood.io/
2. Cliquez sur "Join Session"
3. Entrez le code fourni par le GM
4. Créez votre investigateur Call of Cthulhu

## 🔒 Sécurité

- ✅ HTTPS avec SSL/TLS
- ✅ Headers de sécurité (HSTS, X-Frame-Options, etc.)
- ✅ Conteneur non-root (user nodejs)
- ✅ Secrets dans .env (git-ignored)
- ✅ Session cookies (httpOnly, secure)
- ✅ Pas d'authentification OAuth2 (accès public)

## ⚡ Performance

- **Bundle Entry** : ~5.27 kB (gzipped)
- **Vendor Chunks** : Code splitting optimal
- **Lazy Loading** : Toutes les pages
- **Minification** : Terser (drop_console: true)
- **Cache** : Assets (1 jour), Avatars (7 jours)

## 🐛 Dépannage

### L'application ne démarre pas
```bash
# Vérifier les logs
docker logs role-plug-app --tail 100

# Vérifier la connexion DB
docker exec role-plug-app node -e "console.log(process.env.DATABASE_URL)"
```

### Page blanche
```bash
# Vérifier que serveStatic est appelé
docker logs role-plug-app | grep "serveStatic"

# Vérifier que dist/public existe
docker exec role-plug-app ls -la /app/dist/public/
```

### 502 Bad Gateway
```bash
# Vérifier que l'app tourne
curl http://172.18.0.1:5002/api/health

# Vérifier la config Nginx
docker exec rbw-nginx nginx -T | grep role-plug
```

## 📅 Historique

- **2025-12-04 17:00** : Démarrage du déploiement
- **2025-12-04 18:00** : Résolution problème base path
- **2025-12-04 18:30** : Correction ordre middlewares (404 fix)
- **2025-12-04 18:45** : ✅ Application fonctionnelle sur role-plug.robinswood.io

## 📝 Notes

- Le domaine `game-plug.robinswood.io` n'est pas configuré (configuration Nginx centralisée)
- Utiliser `role-plug.robinswood.io` (avec tiret) comme URL officielle
- L'authentification Replit a été retirée, seule l'auth locale GM reste
- Les avatars sont générés par DALL-E 3 (nécessite OPENAI_API_KEY)

---

**L'application est maintenant en production et pleinement opérationnelle ! 🎉**
