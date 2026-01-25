# Démarrage rapide - Scripts de Migration Drizzle

## ⚡ 30 secondes pour commencer

```bash
# 1. Définir DATABASE_URL (une seule fois)
export DATABASE_URL="postgresql://user:password@localhost:5432/gameplug"

# 2. Appliquer le schéma
bash scripts/db/apply-migrations.sh

# 3. Ajouter des données de test
bash scripts/db/run-seed.sh

# 4. C'est fait! 🎉
```

## 📋 Commandes essentielles

```bash
# Générer une migration (après modification de shared/schema.ts)
bash scripts/db/generate-migration.sh

# Appliquer les migrations
bash scripts/db/apply-migrations.sh

# Remplir avec données de test
bash scripts/db/run-seed.sh

# Réinitialiser complètement (⚠️ dev uniquement)
bash scripts/db/reset-db.sh

# Valider tous les scripts
bash scripts/db/test.sh
```

## 🔧 Configuration (une fois)

### Option 1: Via .env (recommandé)
```bash
# Copier l'exemple
cp .env.example .env

# Éditer .env
nano .env
# DATABASE_URL=postgresql://user:password@localhost:5432/gameplug
```

### Option 2: Via variable d'environnement
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/gameplug"
```

## 🚀 Workflows rapides

### Initialiser une nouvelle DB
```bash
bash scripts/db/apply-migrations.sh
bash scripts/db/run-seed.sh
```

### Modifier le schéma
```bash
# 1. Éditer shared/schema.ts

# 2. Générer migration
bash scripts/db/generate-migration.sh

# 3. Appliquer
bash scripts/db/apply-migrations.sh
```

### Nettoyer et recommencer
```bash
bash scripts/db/reset-db.sh
bash scripts/db/apply-migrations.sh
bash scripts/db/run-seed.sh
```

## ⚠️ Important

- **Ne jamais** exécuter `reset-db.sh` en production
- Toujours vérifier les migrations générées avant de les appliquer
- Les scripts supposent que PostgreSQL est en cours d'exécution

## 📚 Besoin de plus?

- `README.md` - Documentation complète
- `INDEX.md` - Vue d'ensemble des fichiers
- `test.sh` - Tester l'intégrité des scripts

## 🆘 Problèmes?

```bash
# 1. Vérifier DATABASE_URL
echo $DATABASE_URL

# 2. Vérifier PostgreSQL
docker-compose ps

# 3. Vérifier la connexion
psql $DATABASE_URL -c "SELECT 1"
```

---

[Documentation complète](README.md)
