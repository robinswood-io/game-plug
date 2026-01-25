#!/bin/bash
# Script de test pour valider les scripts de migration
set -e

echo "🧪 Test des scripts de migration Drizzle"
echo "=========================================="

cd /srv/workspace/game-plug

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Compteurs
TESTS_PASSED=0
TESTS_FAILED=0

# Fonction de test
test_script() {
  local name=$1
  local script=$2
  local test_cmd=$3

  echo -ne "\n📋 Test: $name... "

  if eval "$test_cmd" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
  fi
}

# 1. Vérifier que tous les fichiers existent
echo -e "\n${YELLOW}1. Vérification de l'existence des fichiers${NC}"
test_script "generate-migration.sh existe" "generate-migration.sh" "test -f scripts/db/generate-migration.sh"
test_script "apply-migrations.sh existe" "apply-migrations.sh" "test -f scripts/db/apply-migrations.sh"
test_script "reset-db.sh existe" "reset-db.sh" "test -f scripts/db/reset-db.sh"
test_script "seed.ts existe" "seed.ts" "test -f scripts/db/seed.ts"
test_script "README.md existe" "README.md" "test -f scripts/db/README.md"

# 2. Vérifier les permissions d'exécution
echo -e "\n${YELLOW}2. Vérification des permissions d'exécution${NC}"
test_script "generate-migration.sh exécutable" "generate-migration.sh" "test -x scripts/db/generate-migration.sh"
test_script "apply-migrations.sh exécutable" "apply-migrations.sh" "test -x scripts/db/apply-migrations.sh"
test_script "reset-db.sh exécutable" "reset-db.sh" "test -x scripts/db/reset-db.sh"

# 3. Vérifier la syntaxe des scripts bash
echo -e "\n${YELLOW}3. Vérification de la syntaxe Bash${NC}"
test_script "generate-migration.sh syntaxe" "bash" "bash -n scripts/db/generate-migration.sh"
test_script "apply-migrations.sh syntaxe" "bash" "bash -n scripts/db/apply-migrations.sh"
test_script "reset-db.sh syntaxe" "bash" "bash -n scripts/db/reset-db.sh"

# 4. Vérifier la syntaxe TypeScript
echo -e "\n${YELLOW}4. Vérification de la syntaxe TypeScript${NC}"
test_script "seed.ts compile" "typescript" "npx tsc --noEmit scripts/db/seed.ts"

# 5. Vérifier les dépendances requises
echo -e "\n${YELLOW}5. Vérification des dépendances${NC}"
test_script "drizzle-orm installé" "drizzle-orm" "npm list drizzle-orm | grep -q drizzle-orm"
test_script "drizzle-kit installé" "drizzle-kit" "npm list drizzle-kit | grep -q drizzle-kit"
test_script "postgres installé" "postgres" "npm list postgres | grep -q postgres"
test_script "bcryptjs installé" "bcryptjs" "npm list bcryptjs | grep -q bcryptjs"

# 6. Vérifier la structure du contenu
echo -e "\n${YELLOW}6. Vérification du contenu des scripts${NC}"
test_script "generate-migration.sh contient drizzle-kit" "generate-migration" "grep -q 'drizzle-kit generate:pg' scripts/db/generate-migration.sh"
test_script "apply-migrations.sh contient drizzle-kit" "apply-migrations" "grep -q 'drizzle-kit push:pg' scripts/db/apply-migrations.sh"
test_script "reset-db.sh contient psql" "reset-db" "grep -q 'psql' scripts/db/reset-db.sh"
test_script "seed.ts contient drizzle" "seed" "grep -q 'drizzle-orm' scripts/db/seed.ts"
test_script "seed.ts contient bcryptjs" "seed" "grep -q 'bcryptjs' scripts/db/seed.ts"

# 7. Vérifier le README
echo -e "\n${YELLOW}7. Vérification du README${NC}"
test_script "README contient instructions" "readme" "grep -q 'Configuration préalable' scripts/db/README.md"
test_script "README contient workflows" "readme" "grep -q 'Workflows courants' scripts/db/README.md"
test_script "README contient dépannage" "readme" "grep -q 'Dépannage' scripts/db/README.md"

# Résumé
echo -e "\n${YELLOW}=========================================="
echo "Résumé des tests"
echo "==========================================${NC}"
echo -e "${GREEN}✓ Réussis: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
  echo -e "${RED}✗ Échoués: $TESTS_FAILED${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Tous les tests réussis!${NC}"
  echo ""
  echo "📚 Prochaines étapes:"
  echo "1. Assurez-vous que DATABASE_URL est défini dans .env"
  echo "2. Exécutez: bash scripts/db/apply-migrations.sh"
  echo "3. (Optionnel) Remplissez avec des données: npx tsx scripts/db/seed.ts"
  exit 0
fi
