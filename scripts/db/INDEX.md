# Index des Scripts de Migration Drizzle

## 📁 Fichiers

```
scripts/db/
├── README.md                  # Documentation complète
├── INDEX.md                   # Ce fichier
├── generate-migration.sh       # Générer une migration
├── apply-migrations.sh         # Appliquer les migrations
├── reset-db.sh                # Réinitialiser la DB (DEV ONLY)
├── run-seed.sh                # Exécuter le seed
├── seed.ts                    # Logique du seed (TypeScript)
└── test.sh                    # Tester tous les scripts
```

## 🚀 Démarrage rapide

### 1. Configuration initiale
```bash
# Copier l'exemple d'env
cp .env.example .env

# Éditer .env avec vos paramètres PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/gameplug
```

### 2. Appliquer le schéma
```bash
bash scripts/db/apply-migrations.sh
```

### 3. Remplir avec des données de test
```bash
bash scripts/db/run-seed.sh
```

## 📖 Commandes courantes

```bash
# Vérifier que tous les scripts sont OK
bash scripts/db/test.sh

# Générer une migration après modification de shared/schema.ts
bash scripts/db/generate-migration.sh

# Appliquer les migrations
bash scripts/db/apply-migrations.sh

# Remplir la DB avec données de test
bash scripts/db/run-seed.sh

# ⚠️ Réinitialiser complètement (dev uniquement)
bash scripts/db/reset-db.sh
bash scripts/db/apply-migrations.sh
bash scripts/db/run-seed.sh
```

## 🔄 Flux de travail typique

### Jour 1: Configuration initiale
```bash
# 1. Appliquer migrations
bash scripts/db/apply-migrations.sh

# 2. Ajouter données de test
bash scripts/db/run-seed.sh

# 3. Démarrer l'app
npm run dev
```

### Jour N: Ajouter une colonne
```bash
# 1. Modifier shared/schema.ts

# 2. Générer migration
bash scripts/db/generate-migration.sh

# 3. Appliquer
bash scripts/db/apply-migrations.sh

# 4. Tester
npm run dev
```

## ✅ Vérifications essentielles

Avant de committer:
```bash
# 1. Vérifier les migrations
bash scripts/db/test.sh

# 2. Vérifier TypeScript
npx tsc --noEmit

# 3. Vérifier la DB
psql $DATABASE_URL -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'"
```

## 📚 Documentation complète

Consultez `README.md` pour:
- Configuration détaillée
- Workflows complets
- Dépannage
- Questions fréquentes
- Ressources

## 🔐 Règles importantes

✅ À faire:
- Vérifier les migrations avant application
- Tester sur un clone de DB
- Documenter les changements majeurs

❌ À ne pas faire:
- Ne JAMAIS exécuter `reset-db.sh` en production
- Ne pas modifier les fichiers de migration générés
- Ne pas ignorer les erreurs TypeScript

## 📞 Besoin d'aide?

1. Consultez `README.md` (section "Dépannage")
2. Vérifiez que DATABASE_URL est défini
3. Vérifiez que PostgreSQL est en cours d'exécution
4. Vérifiez les logs: `docker-compose logs postgres`

## 🎯 Objectifs des scripts

| Script | Objectif | Fréquence |
|--------|----------|-----------|
| generate-migration | Créer une migration depuis modifications | Chaque changement schema |
| apply-migrations | Mettre à jour la DB | Déploiement, setup initial |
| run-seed | Créer données de test | Setup initial dev |
| reset-db | Nettoyer et recommencer | Debug en dev |
| test | Valider intégrité | Avant commit |

---

Pour plus de détails, consultez [README.md](README.md)
