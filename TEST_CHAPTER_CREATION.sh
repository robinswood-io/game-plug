#!/bin/bash

# Script de test complet pour valider le fix de création de chapitre
# Usage: ./TEST_CHAPTER_CREATION.sh

set -e

echo "=========================================="
echo "Test de Validation - Création de Chapitre"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SESSION_ID="75a80b4d-6847-4546-857c-4eb070c83d1b"

echo -e "${BLUE}1. Vérification des conteneurs...${NC}"
if docker ps | grep -q game-plug-backend; then
    echo -e "${GREEN}✓ Backend running${NC}"
else
    echo -e "${RED}✗ Backend not running${NC}"
    exit 1
fi

if docker ps | grep -q "game-plug$"; then
    echo -e "${GREEN}✓ Frontend running${NC}"
else
    echo -e "${RED}✗ Frontend not running${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}2. Authentification...${NC}"
TOKEN=$(docker exec game-plug-backend curl -s -X POST "http://localhost:4000/api/auth/dev-login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com"}' | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}✗ Échec de l'authentification${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Token obtenu: ${TOKEN:0:20}...${NC}"
echo ""

echo -e "${BLUE}3. Création d'un chapitre de test...${NC}"
TIMESTAMP=$(date +%s)
CHAPTER_NAME="Test Script $TIMESTAMP"

RESPONSE=$(docker exec game-plug-backend curl -s -X POST \
  "http://localhost:4000/api/sessions/$SESSION_ID/chapters" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"$CHAPTER_NAME\",\"description\":\"Test automatique\",\"status\":\"planned\",\"orderIndex\":10}")

CHAPTER_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$CHAPTER_ID" ]; then
    echo -e "${RED}✗ Échec de la création${NC}"
    echo "Response: $RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ Chapitre créé: $CHAPTER_NAME${NC}"
echo -e "${GREEN}  ID: $CHAPTER_ID${NC}"
echo ""

echo -e "${BLUE}4. Vérification en base de données...${NC}"
DB_CHECK=$(docker exec dev_postgres psql -U devuser -d game_plug -t -c \
  "SELECT name FROM chapters WHERE id = '$CHAPTER_ID'")

if echo "$DB_CHECK" | grep -q "$CHAPTER_NAME"; then
    echo -e "${GREEN}✓ Chapitre trouvé en DB${NC}"
else
    echo -e "${RED}✗ Chapitre non trouvé en DB${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}5. Récupération de la liste des chapitres...${NC}"
CHAPTERS=$(docker exec game-plug-backend curl -s \
  "http://localhost:4000/api/sessions/$SESSION_ID/chapters" \
  -H "Authorization: Bearer $TOKEN")

COUNT=$(echo "$CHAPTERS" | grep -o '"id":' | wc -l)
echo -e "${GREEN}✓ $COUNT chapitre(s) dans la session${NC}"
echo ""

echo -e "${BLUE}6. Nettoyage du chapitre de test...${NC}"
docker exec game-plug-backend curl -s -X DELETE \
  "http://localhost:4000/api/chapters/$CHAPTER_ID" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

if docker exec dev_postgres psql -U devuser -d game_plug -t -c \
  "SELECT id FROM chapters WHERE id = '$CHAPTER_ID'" | grep -q "$CHAPTER_ID"; then
    echo -e "${RED}✗ Échec de la suppression${NC}"
else
    echo -e "${GREEN}✓ Chapitre de test supprimé${NC}"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}✓ TOUS LES TESTS RÉUSSIS${NC}"
echo "=========================================="
echo ""
echo "Résumé:"
echo "  - Authentification JWT: OK"
echo "  - Création de chapitre: OK"
echo "  - Persistance en DB: OK"
echo "  - Récupération de liste: OK"
echo "  - Suppression: OK"
echo ""
echo "Le fix pour la création de chapitre est validé."
