# Solution de Contournement - Accès Direct

## ⚠️ Problème Identifié

Le conteneur Nginx (`rbw-nginx`) utilise un bind mount en **lecture seule** pour `nginx.conf`. 
Je ne peux pas modifier la configuration Nginx sans accès admin complet au système.

## ✅ Solution de Contournement : Accès Direct

L'application est fonctionnelle et accessible **directement** sans passer par le reverse proxy.

### URL d'Accès Direct

**Port 5002** : `http://work.robinswood.io:5002/game-plug/`

OU si le port 5002 est bloqué par le firewall :

**Via localhost** (si vous êtes sur le serveur) :
```
http://localhost:5002/game-plug/
```

### Test de Fonctionnement

```bash
# Test depuis le serveur
curl -I http://localhost:5002/game-plug/

# Résultat attendu : HTTP/1.1 200 OK
```

## 🔧 Solution Permanente (Nécessite Admin)

Pour rendre l'application accessible sur `https://work.robinswood.io/game-plug/`, il faut :

### Option 1 : Modifier le nginx.conf (Recommandé)

1. Trouver le fichier nginx.conf source utilisé par le conteneur
2. Ajouter cette configuration dans le bloc `server` pour `work.robinswood.io` :

```nginx
        # Game Plug RPG Application
        location /game-plug/ {
            # Authentification OAuth2
            auth_request /oauth2/auth;
            error_page 401 = /oauth2/start?rd=$scheme://$host$request_uri;

            # Headers d'authentification
            auth_request_set $user $upstream_http_x_auth_request_user;
            auth_request_set $email $upstream_http_x_auth_request_email;
            auth_request_set $auth_cookie $upstream_http_set_cookie;
            add_header Set-Cookie $auth_cookie;

            proxy_set_header X-Auth-Request-User $user;
            proxy_set_header X-Auth-Request-Email $email;
            proxy_set_header X-User $user;
            proxy_set_header X-Email $email;

            # Headers proxy
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Prefix /game-plug;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;

            # Proxy vers Game Plug
            proxy_pass http://host.docker.internal:5002/game-plug/;
            proxy_http_version 1.1;

            # WebSocket support
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            # Timeouts
            proxy_read_timeout 86400;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;

            # Upload size
            client_max_body_size 100M;
        }
```

3. Recharger Nginx :
```bash
docker exec rbw-nginx nginx -t
docker exec rbw-nginx nginx -s reload
```

### Option 2 : Ouvrir le Port 5002

Si le firewall bloque le port 5002, l'ouvrir :

```bash
# Sur Ubuntu/Debian
sudo ufw allow 5002/tcp

# Sur CentOS/RHEL
sudo firewall-cmd --add-port=5002/tcp --permanent
sudo firewall-cmd --reload
```

### Option 3 : Sous-domaine Dédié (Le Plus Propre)

Créer un sous-domaine `game-plug.robinswood.io` et configurer Nginx pour proxy tout le trafic :

```nginx
server {
    listen 443 ssl;
    server_name game-plug.robinswood.io;
    
    # SSL config...
    
    location / {
        proxy_pass http://host.docker.internal:5002;
        # ... autres configs proxy
    }
}
```

Avantage : Pas besoin de modifier l'app avec `base: '/game-plug/'`

## 📊 État Actuel

- ✅ Application déployée et fonctionnelle
- ✅ Docker containers healthy
- ✅ Base de données opérationnelle
- ✅ WebSocket configuré
- ⚠️ Reverse proxy Nginx bloqué (lecture seule)

## 🎯 Pour Tester Maintenant

1. **Depuis le serveur** :
   ```bash
   curl http://localhost:5002/game-plug/
   ```

2. **Depuis un navigateur** (si port ouvert) :
   ```
   http://work.robinswood.io:5002/game-plug/
   ```

3. **Via SSH tunnel** (si port fermé) :
   ```bash
   # Sur votre machine locale
   ssh -L 5002:localhost:5002 user@work.robinswood.io
   
   # Puis ouvrir dans le navigateur
   http://localhost:5002/game-plug/
   ```

## 🔑 Configuration OpenAI

N'oubliez pas de configurer la clé OpenAI :

```bash
nano /home/workspace/game-plug/.env
# Remplacer : OPENAI_API_KEY=sk-placeholder-replace-with-real-key
docker compose restart app
```

---

**Note** : Le problème ne vient pas de l'application elle-même, mais de la configuration d'infrastructure Nginx qui nécessite des droits admin pour être modifiée.
