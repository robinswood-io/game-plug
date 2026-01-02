# ✅ Déploiement sur Sous-Domaine - Game Plug

## 🎉 Application Déployée

L'application **Rôle Plug** est maintenant accessible sur son propre sous-domaine :

**https://game-plug.robinswood.io/**

## 📋 Changements Effectués

### 1. Configuration Vite (Retrait du Base Path)

Le fichier `vite.config.ts` a été modifié :
```typescript
export default defineConfig({
  base: '/',  // Changé de '/game-plug/' à '/'
  // ... reste de la config
});
```

### 2. Configuration Router Wouter

Le fichier `client/src/App.tsx` a été modifié :
```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DiceSoundProvider>
        <TooltipProvider>
          <WouterRouter>  {/* Retiré base="/game-plug" */}
            <Toaster />
            <Router />
          </WouterRouter>
        </TooltipProvider>
      </DiceSoundProvider>
    </QueryClientProvider>
  );
}
```

### 3. Configuration Nginx pour Sous-Domaine

Un nouveau fichier `nginx-game-plug-subdomain.conf` a été créé et déployé :
- **Serveur**: game-plug.robinswood.io (HTTPS)
- **Redirection HTTP → HTTPS**: Automatique
- **Proxy**: Vers 172.18.0.1:5002
- **WebSocket**: Support complet pour temps réel
- **SSL**: Certificats Let's Encrypt partagés (robinswood.io)
- **Sécurité**: Headers de sécurité complets
- **Cache**: Assets et avatars mis en cache
- **Authentification**: Désactivée (auth_request off)

### 4. Rebuild Docker

L'application a été reconstruite complètement avec :
```bash
docker compose build --no-cache app
docker compose up -d
```

## 🚀 Processus de Déploiement Complet

### Fichiers Importants

- `/home/workspace/game-plug/nginx-game-plug-subdomain.conf` - Config Nginx
- `/opt/ia-webdev/nginx/conf.d/game-plug.robinswood.io.conf` - Config déployée
- `vite.config.ts` - Config Vite avec base: '/'
- `client/src/App.tsx` - Router sans base path

### Commandes de Déploiement

```bash
# 1. Modifier les configurations
# vite.config.ts: base: '/'
# App.tsx: <WouterRouter> sans base

# 2. Rebuild l'application
cd /home/workspace/game-plug
docker compose down
docker compose build --no-cache app
docker compose up -d

# 3. Déployer la configuration Nginx
sudo mkdir -p /opt/ia-webdev/nginx/conf.d
sudo cp nginx-game-plug-subdomain.conf \
    /opt/ia-webdev/nginx/conf.d/game-plug.robinswood.io.conf
sudo chmod 644 /opt/ia-webdev/nginx/conf.d/game-plug.robinswood.io.conf

# 4. Tester et recharger Nginx
docker exec rbw-nginx nginx -t
docker exec rbw-nginx nginx -s reload

# 5. Vérifier le déploiement
docker ps --filter "name=role-plug"
docker logs role-plug-app --tail 20
```

## 🌐 Configuration DNS

**IMPORTANT**: Vous devez configurer le DNS pour pointer le sous-domaine vers votre serveur.

### Chez votre registrar DNS (ex: Cloudflare, OVH, etc.)

Ajoutez un enregistrement A ou CNAME :

**Option 1 - Enregistrement A** :
```
Type: A
Nom: game-plug
Valeur: [IP du serveur robinswood.io]
TTL: Auto ou 3600
```

**Option 2 - Enregistrement CNAME** :
```
Type: CNAME
Nom: game-plug
Valeur: robinswood.io
TTL: Auto ou 3600
```

### Certificat SSL

Le certificat SSL actuel couvre `robinswood.io` mais pourrait ne pas couvrir `*.robinswood.io` (wildcard).

**Si le certificat ne couvre pas le sous-domaine**, vous devrez :

1. Renouveler le certificat avec wildcard :
```bash
sudo certbot certonly --nginx -d robinswood.io -d *.robinswood.io
```

2. Ou créer un certificat spécifique :
```bash
sudo certbot certonly --nginx -d game-plug.robinswood.io
```

3. Puis mettre à jour la config Nginx :
```nginx
ssl_certificate /etc/letsencrypt/live/game-plug.robinswood.io/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/game-plug.robinswood.io/privkey.pem;
```

## 📊 Vérifications Post-Déploiement

```bash
# 1. Statut des conteneurs
docker ps --filter "name=role-plug"
# Attendu: Up X seconds (healthy)

# 2. API Health
curl -sk https://game-plug.robinswood.io/api/health
# Attendu: {"status":"ok","message":"Server is running"}

# 3. Page HTML
curl -s https://game-plug.robinswood.io/ -k | grep title
# Attendu: <title>Rôle Plug - Plateforme de jeu de rôle Call of Cthulhu</title>

# 4. Vérifier les assets (après DNS configuré)
curl -I https://game-plug.robinswood.io/assets/ -k 2>&1 | grep HTTP
# Attendu: HTTP/2 200

# 5. Logs application
docker logs role-plug-app --tail 20
# Pas d'erreurs

# 6. Test DNS
nslookup game-plug.robinswood.io
# Doit résoudre vers l'IP du serveur

# 7. Test WebSocket (en local d'abord)
# Ouvrir la console développeur sur https://game-plug.robinswood.io/
# Vérifier les connexions WebSocket
```

## 🔧 Architecture de Déploiement

```
Internet (HTTPS)
    ↓ DNS: game-plug.robinswood.io
Nginx (rbw-nginx:443)
    ↓ SSL Termination
    ↓ proxy_pass http://172.18.0.1:5002
Docker Host (172.18.0.1:5002)
    ↓
role-plug-app Container (role-plug-network)
    ├── Express Server (port 5000)
    ├── Static Files (React SPA)
    └── WebSocket Server
    ↓
role-plug-db Container (role-plug-network)
    └── PostgreSQL 16 (port 5432)
```

## 🐛 Dépannage

### Problème : ERR_NAME_NOT_RESOLVED

**Cause** : DNS non configuré

**Solution** :
1. Configurez le DNS comme indiqué ci-dessus
2. Attendez la propagation DNS (peut prendre jusqu'à 24h, souvent 15min)
3. Testez avec `nslookup game-plug.robinswood.io`

### Problème : SSL Certificate Error

**Cause** : Le certificat ne couvre pas le sous-domaine

**Solution** :
```bash
# Vérifier le certificat actuel
docker exec rbw-nginx openssl x509 -in /etc/letsencrypt/live/robinswood.io/fullchain.pem -text -noout | grep DNS

# Si game-plug n'est pas listé, créer un nouveau certificat
sudo certbot certonly --nginx -d game-plug.robinswood.io

# Mettre à jour nginx-game-plug-subdomain.conf avec le nouveau chemin
# Puis redéployer
```

### Problème : 502 Bad Gateway

**Cause** : L'application Docker n'est pas accessible

**Solutions** :
```bash
# Vérifier que les conteneurs tournent
docker ps --filter "name=role-plug"

# Vérifier que l'app est accessible depuis l'hôte
curl http://172.18.0.1:5002/api/health

# Si l'IP a changé, mettre à jour nginx-game-plug-subdomain.conf
docker network inspect role-plug-network | grep -A 10 "role-plug-app"

# Redémarrer les conteneurs
docker compose restart
```

### Problème : WebSocket ne se connecte pas

**Cause** : Headers WebSocket incorrects

**Solution** :
```bash
# Vérifier la config Nginx
docker exec rbw-nginx cat /etc/nginx/conf.d/game-plug.robinswood.io.conf | grep -A 2 Upgrade

# Doit contenir:
# proxy_set_header Upgrade $http_upgrade;
# proxy_set_header Connection "upgrade";

# Si absent, corriger et recharger
docker exec rbw-nginx nginx -s reload
```

## 📝 Notes Importantes

1. **DNS** : La configuration DNS est OBLIGATOIRE pour que le sous-domaine fonctionne
2. **SSL** : Vérifiez que votre certificat couvre le sous-domaine
3. **Firewall** : Assurez-vous que les ports 80 et 443 sont ouverts
4. **Cache** : Les assets sont mis en cache (1 jour), les avatars (7 jours)
5. **Base Path** : L'application n'utilise plus de base path, elle est à la racine du domaine

## ✨ Fonctionnalités Actives

- ✅ Sous-domaine dédié (game-plug.robinswood.io)
- ✅ Pas de base path (/game-plug/)
- ✅ Interface React complète
- ✅ Authentification GM + joueurs
- ✅ Création/édition de personnages CoC 7e
- ✅ Système de santé mentale
- ✅ Lancers de dés
- ✅ GameBoard avec projection
- ✅ Génération d'avatars AI
- ✅ Synchronisation temps réel (WebSocket)
- ✅ Interface lovecraftienne responsive

## 🔄 Mise à Jour Après Modification du Code

```bash
# 1. Vérifier les configurations
cat vite.config.ts | grep "base:"  # Doit être: base: '/'
cat client/src/App.tsx | grep WouterRouter  # Doit être: <WouterRouter>

# 2. Rebuild Docker
cd /home/workspace/game-plug
docker compose down
docker compose build --no-cache app
docker compose up -d

# 3. Vérifier
docker ps --filter "name=role-plug"
docker logs role-plug-app --tail 20
curl -sk https://game-plug.robinswood.io/api/health
```

## 📅 Historique

- **2025-12-04 18:00** : Migration du path /game-plug/ vers sous-domaine
- **2025-12-04 18:10** : Configuration Nginx sous-domaine
- **2025-12-04 18:15** : Rebuild application sans base path
- **2025-12-04 18:20** : ✅ Déploiement sous-domaine complété

---

**L'application est prête côté serveur. Configurez maintenant le DNS pour rendre le site accessible publiquement.**
