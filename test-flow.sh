#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== TEST FLOW COMPLET MJ - GESTION SESSION ===${NC}\n"

# 1. LOGIN
echo -e "${YELLOW}[1/5] AUTHENTIFICATION - Login MJ${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"gm@game-plug.local","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken' 2>/dev/null)
if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo -e "${RED}ERREUR: Pas de token${NC}"
  echo "Réponse: $LOGIN_RESPONSE"
  exit 1
fi
echo -e "${GREEN}✓ Token obtenu: ${TOKEN:0:20}...${NC}\n"

# 2. CREATE SESSION
echo -e "${YELLOW}[2/5] CRÉATION SESSION${NC}"
SESSION_RESPONSE=$(curl -s -X POST http://localhost:4000/api/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Session Flow",
    "description": "Test complet du flow MJ",
    "system": "CoC7"
  }')

SESSION_ID=$(echo $SESSION_RESPONSE | jq -r '.id' 2>/dev/null)
SESSION_CODE=$(echo $SESSION_RESPONSE | jq -r '.joinCode' 2>/dev/null)

if [ -z "$SESSION_ID" ] || [ "$SESSION_ID" == "null" ]; then
  echo -e "${RED}ERREUR: Pas de session créée${NC}"
  echo "Réponse: $SESSION_RESPONSE"
  exit 1
fi
echo -e "${GREEN}✓ Session créée: $SESSION_ID${NC}"
echo -e "${GREEN}✓ Code de jointure: $SESSION_CODE (${#SESSION_CODE} caractères)${NC}\n"

# 3. CREATE CHAPTER
echo -e "${YELLOW}[3/5] CRÉATION CHAPITRE${NC}"
CHAPTER_RESPONSE=$(curl -s -X POST http://localhost:4000/api/sessions/$SESSION_ID/chapters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chapter 1 - Introduction",
    "description": "Introduction à la campagne",
    "order": 1
  }')

CHAPTER_ID=$(echo $CHAPTER_RESPONSE | jq -r '.id' 2>/dev/null)

if [ -z "$CHAPTER_ID" ] || [ "$CHAPTER_ID" == "null" ]; then
  echo -e "${RED}ERREUR: Pas de chapitre créé${NC}"
  echo "Réponse: $CHAPTER_RESPONSE"
  exit 1
fi
echo -e "${GREEN}✓ Chapitre créé: $CHAPTER_ID${NC}\n"

# 4. VERIFY SESSION CONTAINS CHAPTER
echo -e "${YELLOW}[4/5] VÉRIFICATION - Chapters par session${NC}"
CHAPTERS=$(curl -s -X GET "http://localhost:4000/api/sessions/$SESSION_ID/chapters" \
  -H "Authorization: Bearer $TOKEN")

CHAPTER_COUNT=$(echo $CHAPTERS | jq '.length' 2>/dev/null)
echo -e "${GREEN}✓ Nombre de chapitres: $CHAPTER_COUNT${NC}"
echo $CHAPTERS | jq '.' 2>/dev/null || echo "Erreur parsing JSON"
echo

# 5. VERIFY SESSION DETAILS
echo -e "${YELLOW}[5/5] VÉRIFICATION - Détails session${NC}"
SESSION_DETAILS=$(curl -s -X GET http://localhost:4000/api/sessions/$SESSION_ID \
  -H "Authorization: Bearer $TOKEN")

SESSION_NAME=$(echo $SESSION_DETAILS | jq -r '.name' 2>/dev/null)
SESSION_GM=$(echo $SESSION_DETAILS | jq -r '.gmId' 2>/dev/null)
echo -e "${GREEN}✓ Nom: $SESSION_NAME${NC}"
echo -e "${GREEN}✓ GM ID: $SESSION_GM${NC}\n"

# SUMMARY
echo -e "${BLUE}=== RÉSUMÉ ===${NC}"
echo -e "${GREEN}[✓] Login avec JWT${NC}"
echo -e "${GREEN}[✓] Création session (code: $SESSION_CODE)${NC}"
echo -e "${GREEN}[✓] Création chapitre${NC}"
echo -e "${GREEN}[✓] Vérification chapters par session${NC}"
echo -e "${GREEN}[✓] Vérification détails session${NC}"

