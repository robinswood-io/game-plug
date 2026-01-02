# Guide de Tests Manuels - game-plug v2.0

**Date :** 2025-12-30
**Version :** NestJS 11 + Next.js 15.5.9

---

## 🚀 Démarrage Rapide

```bash
cd /opt/workspace/game-plug
docker compose -f docker-compose.staging.yml up -d
```

**URLs :**
- Frontend : http://localhost:13000
- Backend API : http://localhost:15001
- Database : localhost:15432

---

## ✅ Tests Pré-Requis (Automatiques)

### 1. Vérifier les Containers

```bash
docker ps --filter "name=game-plug"
```

**Résultat attendu :**
```
game-plug-frontend-staging   Up X seconds                 0.0.0.0:13000->3000/tcp
game-plug-backend-staging    Up X seconds (healthy)       0.0.0.0:15001->5001/tcp
game-plug-db-staging         Up X seconds (healthy)       0.0.0.0:15432->5432/tcp
```

### 2. Vérifier Backend Health

```bash
curl http://localhost:15001/api/health
```

**Résultat attendu :**
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T...",
  "service": "game-plug-backend"
}
```

### 3. Vérifier Frontend

```bash
curl http://localhost:13000 | head -20
```

**Résultat attendu :** HTML contenant "Rôle Plug"

---

## 🧪 Tests Manuels Frontend

### Flow 1 : Game Master (GM)

#### 1.1 Inscription GM

1. Ouvrir http://localhost:13000
2. Cliquer sur **"S'inscrire"** (carte "Nouveau MJ")
3. Remplir le formulaire :
   - Email : `gm-test@example.com`
   - Mot de passe : `TestPassword123`
   - Prénom : `Test`
   - Nom : `GameMaster`
4. Cliquer sur **"S'inscrire"**

**✅ Résultat attendu :**
- Redirection automatique vers le dashboard
- Message de bienvenue affiché
- Menu GM visible

**❌ Si erreur :**
- Vérifier logs backend : `docker logs game-plug-backend-staging --tail 50`
- Vérifier que la database est initialisée

#### 1.2 Connexion GM

1. Ouvrir http://localhost:13000
2. Cliquer sur **"Se connecter"** (carte "MJ Existant")
3. Entrer identifiants :
   - Email : `gm-test@example.com`
   - Mot de passe : `TestPassword123`
4. Cliquer sur **"Se connecter"**

**✅ Résultat attendu :**
- Redirection vers dashboard
- Session persistante (recharger la page → toujours connecté)

#### 1.3 Créer une Session de Jeu

1. Dans le dashboard, cliquer sur **"Créer une session"**
2. Remplir :
   - Nom : `L'Appel de Cthulhu - Test`
   - Description (optionnel)
3. Cliquer sur **"Créer"**

**✅ Résultat attendu :**
- Session créée avec code à 6 caractères (ex: `ABC123`)
- Affichage du code de session
- Options pour gérer la session

**📝 Noter le code :** `__________` (à utiliser pour le flow joueur)

#### 1.4 Gérer la Session

1. Cliquer sur la session créée
2. Vérifier les onglets :
   - Personnages
   - Chapitres
   - Événements
   - Paramètres

**✅ Résultat attendu :**
- Interface GM complète
- Pas d'erreurs console browser

---

### Flow 2 : Joueur

#### 2.1 Rejoindre une Session

1. Ouvrir http://localhost:13000/join (dans un autre navigateur ou incognito)
2. Entrer le **code de session** (noté en 1.3)
3. Cliquer sur **"Rejoindre"**

**✅ Résultat attendu :**
- Redirection vers sélection de personnage
- Nom de la session affiché

#### 2.2 Créer un Personnage

1. Cliquer sur **"Créer un nouveau personnage"**
2. Remplir les informations :
   - Nom : `Harvey Walters`
   - Occupation : `Professeur`
   - Âge : `45`
3. Répartir les caractéristiques (CoC 7e)
4. Répartir les compétences
5. Cliquer sur **"Créer le personnage"**

**✅ Résultat attendu :**
- Personnage créé
- Fiche personnage affichée
- Stats calculées (HP, Santé mentale, etc.)

#### 2.3 Générer Avatar IA (Optionnel)

**Pré-requis :** `OPENAI_API_KEY` configurée dans `.env.staging`

1. Dans la fiche personnage, cliquer sur **"Générer avatar IA"**
2. Attendre génération (10-20 secondes)

**✅ Résultat attendu :**
- Avatar DALL-E affiché
- Image sauvegardée

**❌ Si erreur :**
- Vérifier que `OPENAI_API_KEY` est configurée
- Vérifier logs backend pour erreurs OpenAI API

---

### Flow 3 : WebSocket Real-Time

#### 3.1 Setup Multi-Clients

- **Client 1 (GM) :** http://localhost:13000 (browser normal)
- **Client 2 (Joueur) :** http://localhost:13000/join (incognito/autre browser)

#### 3.2 Tester Synchronisation

**Test A : Lancer de Dés GM**

1. **GM** : Aller dans la session → Personnages
2. **GM** : Sélectionner un personnage → Lancer un dé
3. **Joueur** : Vérifier que le résultat apparaît en temps réel

**✅ Résultat attendu :**
- Le résultat du dé apparaît instantanément pour le joueur
- Notification toast/message

**Test B : Modification de Stats**

1. **GM** : Appliquer des dégâts à un personnage
2. **Joueur** : Vérifier que les HP se mettent à jour en temps réel

**✅ Résultat attendu :**
- HP/Stats synchronisés en < 1 seconde

**Test C : Projection Gameboard**

1. **GM** : Activer projection gameboard
2. Ouvrir http://localhost:13000/gm/[sessionId]/gameboard (nouvel onglet)
3. **GM** : Changer de scène
4. **Gameboard** : Vérifier synchronisation

**✅ Résultat attendu :**
- Gameboard se met à jour en temps réel
- Plein écran fonctionnel

#### 3.3 Vérifier Console WebSocket

Ouvrir Console Développeur (F12) → Onglet Network → WS

**✅ Résultat attendu :**
- Connexion WebSocket établie (`ws://localhost:15001`)
- Messages échangés visibles
- Pas d'erreurs de connexion

**❌ Si erreurs :**
- Vérifier `NEXT_PUBLIC_WS_URL` dans docker-compose
- Vérifier logs backend WebSocket

---

## 🔍 Vérifications Console Browser

Ouvrir Console Développeur (F12) → Console

**✅ Aucune erreur ne devrait apparaître**

Erreurs acceptables (warnings) :
- `experimental.turbo` deprecated (Next.js)
- Warnings TypeScript build (déjà connus)

**❌ Erreurs bloquantes :**
- `Failed to fetch`
- `Network error`
- `WebSocket connection failed`
- Erreurs React/Next.js runtime

---

## 📊 Tests de Performance

### Temps de Chargement

1. Ouvrir DevTools → Network → Désactiver cache
2. Recharger page d'accueil
3. Vérifier :
   - **Time to Interactive** < 3s
   - **First Contentful Paint** < 1.5s
   - **Bundle size** < 500KB (initial)

### WebSocket Latency

1. Lancer un dé côté GM
2. Mesurer temps jusqu'à affichage côté joueur
3. **Latence attendue** < 500ms

---

## 🐛 Troubleshooting

### Problème : "Cannot connect to backend"

```bash
# Vérifier backend
docker logs game-plug-backend-staging --tail 50

# Vérifier database
docker logs game-plug-db-staging --tail 30

# Restart backend
docker restart game-plug-backend-staging
```

### Problème : "Session expired" / "401 Unauthorized"

```bash
# Vérifier sessions DB
docker exec -i game-plug-db-staging psql -U postgres -d game_plug -c "SELECT COUNT(*) FROM sessions;"

# Vérifier SESSION_SECRET
docker exec game-plug-backend-staging env | grep SESSION_SECRET
```

### Problème : WebSocket ne connecte pas

```bash
# Vérifier NEXT_PUBLIC_WS_URL
docker exec game-plug-frontend-staging env | grep NEXT_PUBLIC_WS_URL

# Résultat attendu : ws://localhost:15001
```

### Problème : Frontend 502 Bad Gateway

```bash
# Vérifier que backend répond
curl http://localhost:15001/api/health

# Si pas de réponse, restart
docker restart game-plug-backend-staging
sleep 15
curl http://localhost:15001/api/health
```

---

## ✅ Checklist Finale

Avant de passer en production, vérifier que **TOUS** ces tests passent :

### Backend
- [ ] Health endpoint répond (200 OK)
- [ ] Signup GM fonctionne
- [ ] Login GM fonctionne
- [ ] Création session fonctionne
- [ ] API retourne JSON valide
- [ ] Logs backend propres (pas d'erreurs)

### Frontend
- [ ] Page d'accueil charge
- [ ] Signup page accessible
- [ ] Login page accessible
- [ ] Dashboard GM accessible après login
- [ ] Formulaires fonctionnels
- [ ] Pas d'erreurs console

### Database
- [ ] 11 tables existent
- [ ] Connexions backend OK
- [ ] Sessions sauvegardées
- [ ] Données persistées après restart

### WebSocket
- [ ] Connexion WebSocket établie
- [ ] Messages synchronisés en temps réel
- [ ] Latence < 500ms
- [ ] Reconnexion automatique fonctionne

### Real-Time Features
- [ ] Dice rolls synchronisés
- [ ] Stats updates synchronisés
- [ ] Gameboard projection fonctionne
- [ ] Multi-clients (2+ joueurs) supportés

---

## 📞 Support

**Logs :**
```bash
# Backend
docker logs game-plug-backend-staging --tail 100

# Frontend
docker logs game-plug-frontend-staging --tail 100

# Database
docker logs game-plug-db-staging --tail 50
```

**Restart complet :**
```bash
cd /opt/workspace/game-plug
docker compose -f docker-compose.staging.yml restart
```

**Documentation :**
- Détails techniques : `MIGRATION_COMPLETE.md`
- Production : `PRODUCTION_READINESS.md`
- Quick start : `QUICK_START.md`

---

**Guide de tests - game-plug v2.0.0**
Dernière mise à jour : 2025-12-30
