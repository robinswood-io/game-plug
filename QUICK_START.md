# Quick Start - game-plug v2.0 (NestJS + Next.js)

## 🚀 Démarrage Rapide Staging

```bash
cd /opt/workspace/game-plug
docker compose -f docker-compose.staging.yml up -d
```

**URLs:**
- Backend: http://localhost:15001
- Frontend: http://localhost:13000
- Health: http://localhost:15001/api/health

## ⚙️ Initialisation Database (Première fois uniquement)

Si vous démarrez avec une database vierge :

```bash
# Initialiser le schéma
docker exec -i game-plug-db-staging psql -U postgres -d game_plug < /tmp/init-schema.sql

# Vérifier tables créées
docker exec -i game-plug-db-staging psql -U postgres -d game_plug -c "\dt"
```

**Résultat attendu :** 11 tables (users, game_sessions, characters, etc.)

## ✅ Vérifications

```bash
# Status containers
docker ps --filter "name=game-plug"

# Logs
docker logs game-plug-backend-staging --tail 50
docker logs game-plug-frontend-staging --tail 50

# Tests
curl http://localhost:15001/api/health
curl http://localhost:13000 | head -1

# Test signup (database initialisée)
curl -X POST http://localhost:15001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123","firstName":"Test","lastName":"User"}'
```

## 📚 Documentation

- **Migration complète:** `MIGRATION_COMPLETE.md` (détails techniques)
- **Production:** `PRODUCTION_READINESS.md` (déploiement prod)
- **Quick start:** Ce fichier

## 🔧 Commandes Utiles

```bash
# Rebuild
docker compose -f docker-compose.staging.yml up --build -d

# Logs temps réel
docker logs -f game-plug-backend-staging

# Stop
docker compose -f docker-compose.staging.yml down

# Restart backend uniquement
docker restart game-plug-backend-staging
```

## 🧪 Tests Manuels

### Flow GM
1. http://localhost:13000
2. Signup → `/gm-signup`
3. Login → `/gm-login`
4. Créer session
5. Obtenir code (6 chars)

### Flow Joueur
1. http://localhost:13000/join
2. Entrer code session
3. Sélectionner personnage

## ⚠️ Troubleshooting

**Backend ne répond pas:**
```bash
docker logs game-plug-backend-staging | tail -50
docker restart game-plug-backend-staging
```

**Frontend 502:**
```bash
curl http://localhost:15001/api/health
docker restart game-plug-backend-staging
```

**DB erreur:**
```bash
docker logs game-plug-db-staging
docker exec game-plug-db-staging psql -U postgres -l
```

## 📞 Support

- Logs: `docker logs <container>`
- Health: http://localhost:15001/api/health
- Docs: `MIGRATION_COMPLETE.md`
