# 🚀 COMMENCEZ ICI - Scripts de Migration Drizzle

Bienvenue! Ce dossier contient tous les outils pour gérer votre base de données avec Drizzle ORM.

## ⚡ 1 minute pour commencer

```bash
# Étape 1: Copier la configuration
cp .env.example .env

# Étape 2: Appliquer le schéma
bash scripts/db/apply-migrations.sh

# Étape 3: Ajouter des données de test
bash scripts/db/run-seed.sh

# ✅ C'est terminé! Votre DB est prête.
```

## 📂 Fichiers dans ce dossier

| Fichier | Objectif |
|---------|----------|
| **00-START-HERE.md** | Ce fichier - commencez ici |
| **QUICKSTART.md** | Démarrage rapide (30 sec) |
| **README.md** | Documentation complète |
| **INDEX.md** | Vue d'ensemble des fichiers |
| **manifest.json** | Métadonnées de tous les scripts |
| **generate-migration.sh** | Générer une migration |
| **apply-migrations.sh** | Appliquer les migrations |
| **reset-db.sh** | Réinitialiser la DB (⚠️ dev only) |
| **run-seed.sh** | Remplir avec données de test |
| **seed.ts** | Logique TypeScript du seed |
| **test.sh** | Valider tous les scripts |

## 🎯 Ce que vous pouvez faire

### ✅ Setup initial
```bash
bash scripts/db/apply-migrations.sh
bash scripts/db/run-seed.sh
npm run dev
```

### ✅ Ajouter une colonne au schéma
```bash
# 1. Modifier shared/schema.ts
nano shared/schema.ts

# 2. Générer migration
bash scripts/db/generate-migration.sh

# 3. Appliquer
bash scripts/db/apply-migrations.sh
```

### ✅ Nettoyer et recommencer (dev)
```bash
bash scripts/db/reset-db.sh
bash scripts/db/apply-migrations.sh
bash scripts/db/run-seed.sh
```

### ✅ Vérifier que tout fonctionne
```bash
bash scripts/db/test.sh
```

## 📚 Documentation complète

Besoin de plus? Consultez:
- **QUICKSTART.md** - Démarrage rapide en 30 secondes
- **README.md** - Documentation complète avec workflows, dépannage, FAQ
- **INDEX.md** - Commandes courantes et flux de travail
- **manifest.json** - Métadonnées techniques de tous les scripts

## 🔐 Règles importantes

### ✅ À faire
- Vérifier les migrations avant de les appliquer
- Tester sur une copie de la DB
- Documenter les changements majeurs
- Utiliser la variable d'environnement DATABASE_URL

### ❌ À ne pas faire
- **Ne JAMAIS** exécuter `reset-db.sh` en production
- Ne pas modifier les fichiers de migration générés
- Ne pas ignorer les erreurs
- Ne pas committer le mot de passe dans le code

## ⚙️ Configuration requise

Avant de commencer:
```bash
# 1. PostgreSQL doit être en cours d'exécution
docker-compose up -d postgres

# 2. DATABASE_URL doit être défini
cp .env.example .env
nano .env  # Éditer DATABASE_URL

# 3. npm install doit être exécuté
npm install
```

## 🆘 Problèmes?

```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Vérifier PostgreSQL
docker-compose ps

# Vérifier la connexion
psql $DATABASE_URL -c "SELECT 1"

# Exécuter tous les tests
bash scripts/db/test.sh
```

## 🗂️ Structure de votre DB

Après avoir appliqué les migrations, vous aurez les tables suivantes:

```
Base de données: gameplug
├── users (comptes GM)
├── sessions (sessions de jeu)
├── characters (personnages)
├── chapters (chapitres)
├── chapterEvents (événements)
├── inventory (inventaire des personnages)
├── sanityConditions (phobies, manies)
├── activeEffects (buffs, débuffs)
├── rollHistory (historique des dés)
├── narrativeEntries (journal du GM)
└── sessions (sessions web)
```

## 📊 Données de test créées

Après `bash scripts/db/run-seed.sh`:

```
Utilisateur GM:
  Email: gm@example.com
  Mot de passe: password123

Session de jeu:
  Nom: Session de test
  Code: TEST01

Personnage:
  Nom: Détective Noir
  Profession: Détective privé

Inventaire:
  Revolver .38 (équipé)

Chapitre:
  Chapitre 1: Le début
```

## 🔄 Cycle de vie typical

```
Jour 1: Setup initial
  └─> apply-migrations.sh
  └─> run-seed.sh
  └─> npm run dev ✅

Jour N: Ajouter une colonne
  └─> Modifier shared/schema.ts
  └─> generate-migration.sh
  └─> apply-migrations.sh
  └─> npm run dev ✅

Jour X: Redémarrer de zéro (dev)
  └─> reset-db.sh
  └─> apply-migrations.sh
  └─> run-seed.sh
  └─> npm run dev ✅

Jour Y: Déployer
  └─> test.sh
  └─> Sauvegarde DB
  └─> generate-migration.sh (si changements)
  └─> apply-migrations.sh
  └─> Production ✅
```

## 📖 Prochaines étapes

1. **Commencez par QUICKSTART.md** (30 secondes)
2. **Puis consultez README.md** (documentation complète)
3. **Posez des questions** (consultez la section FAQ)

---

## 🚀 Prêt? Allez-y!

```bash
bash scripts/db/apply-migrations.sh
bash scripts/db/run-seed.sh
npm run dev
```

Bon développement! 🎉
