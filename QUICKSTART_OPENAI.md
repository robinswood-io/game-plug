# QuickStart: Activation OpenAI en 5 Minutes

## Pour les Impatients

Vous avez 5 minutes? Voici comment obtenir les images générées par IA dans game-plug.

---

## Étape 1: Obtenir une clé API (2 min)

```bash
# Aller ici: https://platform.openai.com/api-keys
# Créer un compte ou se connecter
# Cliquer "Create new secret key"
# Copier la clé (elle ressemble à: sk-proj-...)
```

## Étape 2: Configurer Docker (1 min)

**Fichier:** `/srv/workspace/docker-compose.apps.yml`

**Trouvez:**
```yaml
game-plug-backend:
  environment:
    - PORT=4000
```

**Remplacez par:**
```yaml
game-plug-backend:
  environment:
    - PORT=4000
    - OPENAI_API_KEY=sk-YOUR_KEY_HERE
```

## Étape 3: Redémarrer (1 min)

```bash
cd /srv/workspace
docker compose -f docker-compose.apps.yml restart game-plug-backend
```

## Étape 4: Tester (1 min)

```bash
# Obtenir un token
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"email":"gm@example.com"}' | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Tester la génération d'avatar
curl -X POST http://localhost:4000/api/ai/generate-avatar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "characterName": "Dr. Armitage",
    "occupation": "Librarian",
    "age": "45"
  }' | grep imageUrl
```

**Si vous voyez une URL à la place de "null", c'est bon!**

---

## C'est Tout! 🎉

Les images sont maintenant générées automatiquement par DALL-E 3.

---

## Documentation Complète

Pour plus de détails:
- **Technique:** `OPENAI_INTEGRATION_TECHNICAL_GUIDE.md`
- **Complet:** `OPENAI_INTEGRATION_TEST_REPORT.md`
- **Résumé:** `OPENAI_TEST_RESULTS.md`

---

## Troubleshooting Rapide

### "Invalid API key"
→ Vérifier que la clé commence par `sk-`

### Toujours "imageUrl": null
→ Vérifier que la variable d'env est bien passée:
```bash
docker exec game-plug-backend printenv | grep OPENAI
```

### "rate limit exceeded"
→ Attendre 1 minute, puis réessayer

---

**Time:** 5 minutes
**Cost:** ~$0.01 per avatar
**Impact:** Avatars professionnels 1920s Call of Cthulhu

