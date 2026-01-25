# Scripts de Migration Base de Données

Ce dossier contient tous les scripts de gestion de la base de données pour le projet Game-Plug utilisant Drizzle ORM.

## 📋 Vue d'ensemble

| Script | Rôle | Environnement |
|--------|------|---------------|
| `generate-migration.sh` | Génère une migration depuis le schéma TypeScript | Dev/Prod |
| `apply-migrations.sh` | Applique toutes les migrations pendantes | Dev/Prod |
| `run-seed.sh` | Exécute le script de seed pour créer des données de test | Dev |
| `seed.ts` | Logique TypeScript du seed (GM, session, personnage) | Dev |
| `reset-db.sh` | Réinitialise complètement la DB (DEV ONLY) | Dev uniquement |
| `test.sh` | Valide l'intégrité de tous les scripts | Dev |

## 🔧 Configuration préalable

Assurez-vous que:

1. **PostgreSQL 16+** est installé et en cours d'exécution
2. **Variables d'environnement** sont définies dans `.env`:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/gameplug
   ```
3. **Dépendances** sont installées:
   ```bash
   npm install
   # ou
   bun install
   ```

## 📖 Utilisation détaillée

### 1. Générer une migration

```bash
bash scripts/db/generate-migration.sh
```

**Quand l'utiliser:**
- Après avoir modifié le fichier `shared/schema.ts`
- Avant d'appliquer les migrations à la production

**Exemple de workflow:**
```bash
# 1. Modifier shared/schema.ts
# 2. Générer la migration
bash scripts/db/generate-migration.sh

# 3. Vérifier le fichier généré dans ./migrations/
cat migrations/*_*.sql

# 4. Appliquer la migration
bash scripts/db/apply-migrations.sh
```

**Sortie attendue:**
```
📝 Génération de la migration Drizzle...
✅ Migration générée avec succès dans ./migrations/
📋 Prochaines étapes:
   1. Vérifier le fichier de migration généré
   2. Exécuter: bash scripts/db/apply-migrations.sh
```

### 2. Appliquer les migrations

```bash
bash scripts/db/apply-migrations.sh
```

**Quand l'utiliser:**
- Pour mettre à jour le schéma de la DB en production
- Après avoir généré une nouvelle migration
- Lors du déploiement d'une nouvelle version

**Caractéristiques:**
- Idempotent: peut être exécuté plusieurs fois sans danger
- Applique uniquement les migrations pendantes
- Crée les tables, colonnes et index nécessaires

**Sortie attendue:**
```
🚀 Application des migrations Drizzle...
✅ Migrations appliquées avec succès
📊 Base de données mise à jour
```

### 3. Seed des données de test

```bash
bash scripts/db/run-seed.sh
```

**Quand l'utiliser:**
- Configuration initiale du projet en développement
- Tests et prototypage
- Création d'un environnement de démo

**Données créées:**
```
👤 GM de test
   Email: gm@example.com
   Mot de passe: password123
   Nom: Test GM

🎮 Session de test
   Nom: Session de test
   Code: TEST01

🎭 Personnage de test
   Nom: Détective Noir
   Profession: Détective privé
   Stats complètes (STR, CON, DEX, etc.)

🎒 Inventaire
   Revolver .38 (arme équipée)

📖 Chapitre
   Chapitre 1: Le début

📝 Entrée narrative

⚡ Événement de chapitre
```

**Sortie attendue:**
```
🌱 Démarrage du seed...
👤 Création du GM de test...
  ✓ GM créé: gm@example.com (ID: xxxxxxxx-xxxx...)
🎮 Création de la session de test...
  ✓ Session créée: Session de test (Code: TEST01)
🎭 Création du personnage de test...
  ✓ Personnage créé: Détective Noir (ID: xxxxxxxx-xxxx...)
📖 Création du chapitre de test...
  ✓ Chapitre créé: Chapitre 1: Le début
🎒 Création d'objets d'inventaire de test...
  ✓ Arme créée: Revolver .38
📝 Création d'une entrée narrative...
  ✓ Entrée narrative créée
⚡ Création d'un événement de chapitre...
  ✓ Événement créé: Le mystérieux appel téléphonique

✅ Seed complété avec succès!
```

### 4. Réinitialiser la base de données (DEV ONLY)

```bash
bash scripts/db/reset-db.sh
```

**⚠️ ATTENTION: Cette opération est DESTRUCTIVE**

**Quand l'utiliser:**
- En développement local uniquement
- Pour effacer toutes les données et recommencer
- Ne jamais exécuter en production

**Processus:**
```bash
bash scripts/db/reset-db.sh

# Confirmation requise:
# ⚠️  ATTENTION: Ceci va supprimer TOUTES les données!
# ⚠️  Cette opération ne peut pas être annulée
#
# Êtes-vous sûr? (tapez 'yes' pour confirmer): yes
```

**Après la réinitialisation:**
```bash
# 1. Réappliquer les migrations
bash scripts/db/apply-migrations.sh

# 2. (Optionnel) Remplir avec des données de test
npx tsx scripts/db/seed.ts
```

## 🔄 Workflows courants

### Workflow 1: Développement initial

```bash
# 1. Appliquer le schéma initial
bash scripts/db/apply-migrations.sh

# 2. Remplir avec des données de test
bash scripts/db/run-seed.sh

# 3. Vérifier dans votre application
npm run dev
```

### Workflow 2: Ajouter une colonne

```bash
# 1. Modifier shared/schema.ts
# Exemple: ajouter un champ à la table users
# export const users = pgTable("users", {
#   ...
#   lastLoginAt: timestamp("last_login_at"),  // Nouvelle colonne
# });

# 2. Générer la migration
bash scripts/db/generate-migration.sh

# 3. Examiner le fichier généré
cat migrations/*_*.sql

# 4. Appliquer
bash scripts/db/apply-migrations.sh

# 5. Tester avec votre application
npm run dev
```

### Workflow 3: Nettoyer et recommencer (Dev)

```bash
# ATTENTION: Ceci supprime TOUTES les données!
bash scripts/db/reset-db.sh

# Réappliquer le schéma
bash scripts/db/apply-migrations.sh

# Remplir avec données de test
bash scripts/db/run-seed.sh
```

## 🔐 Sécurité et bonnes pratiques

### ✅ À faire

- ✓ Toujours vérifier les migrations avant de les appliquer
- ✓ Sauvegarder la DB avant les opérations destructives
- ✓ Exécuter les migrations sur un environnement de test en premier
- ✓ Documenter les changements de schéma importants
- ✓ Utiliser des transactions pour les migrations
- ✓ Tester les scripts dans Docker

### ❌ À ne pas faire

- ✗ Ne JAMAIS exécuter `reset-db.sh` en production
- ✗ Ne pas modifier manuellement les fichiers de migration générés
- ✗ Ne pas ignorer les erreurs de migration
- ✗ Ne pas committer des données de seed en production
- ✗ Ne pas utiliser le mot de passe de seed en production

## 🐛 Dépannage

### Erreur: "DATABASE_URL non défini"

```bash
# Assurez-vous que .env existe
ls -la .env

# Vérifiez le contenu
cat .env | grep DATABASE_URL

# Si absent, créez-le depuis l'exemple
cp .env.example .env
# Puis éditez .env avec vos paramètres
```

### Erreur: "Connection refused"

```bash
# Vérifiez que PostgreSQL est en cours d'exécution
docker-compose ps

# ou avec systemctl
systemctl status postgresql

# Redémarrez PostgreSQL
docker-compose restart postgres
```

### Erreur: "relation already exists"

Cela signifie que les migrations ont déjà été appliquées. C'est normal si vous exécutez le script plusieurs fois.

```bash
# Vous pouvez relancer sans danger
bash scripts/db/apply-migrations.sh
```

### Erreur lors du seed: "Duplicate key value"

Cela signifie que les données de seed ont déjà été ajoutées.

```bash
# Option 1: Ignorer et continuer
bash scripts/db/run-seed.sh

# Option 2: Réinitialiser et recommencer (dev uniquement)
bash scripts/db/reset-db.sh
bash scripts/db/apply-migrations.sh
bash scripts/db/run-seed.sh
```

## 📊 Structure des migrations

Les migrations sont stockées dans le dossier `./migrations/` avec le format:

```
migrations/
├── 0000_brave_spiderman.sql         # Migration 1
├── 0001_icy_nightcrawler.sql        # Migration 2
├── 0002_fluffy_captain_marvel.sql   # Migration 3
└── meta/
    ├── _journal.json                # Historique des migrations
    └── _snapshot.json               # Snapshot du schéma
```

Chaque fichier `.sql` contient les instructions de modification du schéma.

## 🔍 Vérification post-migration

Après avoir appliqué les migrations, vérifiez:

```bash
# 1. Connectez-vous à la DB
psql $DATABASE_URL

# 2. Listez les tables créées
\dt

# 3. Vérifiez la structure d'une table
\d users

# 4. Quittez
\q
```

## 📚 Ressources

- [Documentation Drizzle ORM](https://orm.drizzle.team/)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview/)
- [PostgreSQL 16 Documentation](https://www.postgresql.org/docs/16/)
- [Guide des migrations](../../../MIGRATION_PLAN.md)

## ❓ Questions fréquentes

### Q: Puis-je modifier les migrations générées?
**R:** Non, modifiez plutôt le schéma (`shared/schema.ts`) et régénérez la migration.

### Q: Comment revenir à une migration précédente?
**R:** Avec Drizzle, il n'y a pas de "rollback". À la place, créez une nouvelle migration qui annule les changements.

### Q: Puis-je utiliser les migrations en production?
**R:** Oui, mais avec prudence. Testez d'abord en développement et faites une sauvegarde.

### Q: Quelle est la fréquence recommandée des migrations?
**R:** Après chaque changement significatif du schéma. Regroupez les petits changements si possible.

### Q: Le seed modifie-t-il la structure de la DB?
**R:** Non, le seed n'ajoute que des données. Il ne modifie pas le schéma.

## 📞 Support

Pour les problèmes:
1. Consultez les logs: `docker-compose logs postgres`
2. Vérifiez les permissions: `ls -la scripts/db/`
3. Testez la connexion: `psql $DATABASE_URL -c "SELECT 1"`
4. Consultez la documentation Drizzle
