# Persistance et Sauvegarde Base de Données - Game Plug

## 📦 Volume Docker Persistant

### Configuration Actuelle

La base de données PostgreSQL utilise un **volume Docker nommé** qui persiste les données même après l'arrêt des containers.

```yaml
volumes:
  postgres_data_dev:
    name: game-plug-postgres-dev
```

**Emplacement physique:** `/var/lib/docker/volumes/game-plug-postgres-dev/_data`
**Taille actuelle:** ~83 MB
**Créé le:** 2026-01-02

### ✅ Protection du Volume

Le volume est automatiquement préservé lors de:
- `docker compose down` (SANS le flag `-v`)
- `docker compose restart`
- Redémarrages du serveur
- Mises à jour des containers

### ⚠️ DANGER - Commandes qui EFFACENT le volume

**NE JAMAIS exécuter sans backup:**
```bash
# ❌ DÉTRUIT TOUTES LES DONNÉES
docker compose down -v

# ❌ DÉTRUIT LE VOLUME
docker volume rm game-plug-postgres-dev
```

**Toujours utiliser:**
```bash
# ✅ Arrête les containers SANS supprimer le volume
docker compose down

# ✅ Redémarre les containers (volume intact)
docker compose restart postgres
```

---

## 🔄 Système de Backup Automatique

### Configuration

**Script:** `/srv/workspace/game-plug/scripts/backup-database.sh`
**Fréquence:** Tous les jours à 3h du matin
**Rétention:** 30 jours (backups plus anciens supprimés automatiquement)
**Logs:** `/srv/workspace/game-plug/backups/backup.log`

### Backups Créés

Chaque backup automatique contient:
- Toutes les tables (users, game_sessions, characters, etc.)
- Toutes les données
- Structure complète de la base
- Format: `auto-backup-YYYYMMDD-HHMMSS.sql`

**Lien symbolique:** `latest-backup.sql` pointe toujours vers le backup le plus récent

### Vérifications Automatiques

Chaque backup est automatiquement:
1. ✅ Vérifié (fichier non vide, SQL valide)
2. ✅ Testé (présence des tables principales)
3. ✅ Compté (nombre de lignes)
4. ✅ Logué (date, taille, résultat)

---

## 🛠️ Opérations Manuelles

### Créer un Backup Manuel

```bash
cd /srv/workspace/game-plug
POSTGRES_PASSWORD=roleplug_020a2db75da6b5674c084a09d4e22b14 ./scripts/backup-database.sh
```

**Sortie:**
```
[INFO] Backup créé avec succès: auto-backup-20260104-204546.sql (2.5M)
[INFO] Backup vérifié: 24094 lignes
[INFO]   ✓ Table 'users' présente
[INFO]   ✓ Table 'game_sessions' présente
[INFO]   ✓ Table 'characters' présente
```

### Restaurer un Backup

**⚠️ ATTENTION:** La restauration ÉCRASE toutes les données actuelles!

```bash
cd /srv/workspace/game-plug

# Utiliser le dernier backup
./scripts/restore-database.sh backups/latest-backup.sql

# Ou un backup spécifique
./scripts/restore-database.sh backups/auto-backup-20260104-120000.sql
```

**Le script:**
1. Demande confirmation (taper "OUI" en majuscules)
2. Crée un backup de sécurité avant restauration
3. Restaure les données
4. Vérifie le résultat

### Lister les Backups Disponibles

```bash
ls -lh /srv/workspace/game-plug/backups/auto-backup-*.sql
```

### Voir les Statistiques

```bash
cd /srv/workspace/game-plug
tail -50 backups/backup.log
```

---

## 📊 Monitoring et Vérification

### Vérifier l'État du Volume

```bash
# Vérifier que le volume existe
docker volume ls | grep game-plug-postgres

# Inspecter le volume
docker volume inspect game-plug-postgres-dev

# Vérifier l'espace utilisé
sudo du -sh /var/lib/docker/volumes/game-plug-postgres-dev/_data
```

### Vérifier l'État de la Base

```bash
# Se connecter à la base
docker exec -it game-plug-db-dev psql -U roleplug roleplug

# Compter les enregistrements
SELECT
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM game_sessions) as sessions,
  (SELECT COUNT(*) FROM characters) as characters;
```

### Vérifier les Cron Jobs

```bash
# Voir tous les cron jobs
crontab -l

# Voir uniquement le backup automatique
crontab -l | grep backup-database
```

### Tester le Backup Manuellement

```bash
# Exécuter le backup immédiatement
cd /srv/workspace/game-plug
POSTGRES_PASSWORD=roleplug_020a2db75da6b5674c084a09d4e22b14 ./scripts/backup-database.sh

# Vérifier le résultat
ls -lh backups/auto-backup-*.sql | tail -1
```

---

## 🚨 Procédures d'Urgence

### En Cas de Perte de Données

1. **NE PAS PANIQUER** - Les backups automatiques sont là pour ça
2. Arrêter l'application si elle tourne
3. Vérifier les backups disponibles
4. Restaurer le backup le plus récent
5. Vérifier l'intégrité des données

```bash
# 1. Arrêter l'application
cd /srv/workspace/game-plug
docker compose down

# 2. Lister les backups
ls -lh backups/auto-backup-*.sql

# 3. Redémarrer uniquement PostgreSQL
docker compose up -d postgres

# 4. Restaurer
./scripts/restore-database.sh backups/latest-backup.sql
# Taper: OUI

# 5. Redémarrer toute l'application
docker compose up -d
```

### Migrer vers un Nouveau Serveur

```bash
# Sur l'ancien serveur
cd /srv/workspace/game-plug
POSTGRES_PASSWORD=... ./scripts/backup-database.sh
scp backups/latest-backup.sql nouveau-serveur:/tmp/

# Sur le nouveau serveur
cd /srv/workspace/game-plug
docker compose up -d postgres
./scripts/restore-database.sh /tmp/latest-backup.sql
```

### Volume Corrompu

Si le volume Docker est corrompu:

```bash
# 1. Créer un backup depuis le container actuel (si possible)
docker exec game-plug-db-dev pg_dumpall -U roleplug > /tmp/emergency-backup.sql

# 2. Arrêter et supprimer le volume corrompu
docker compose down
docker volume rm game-plug-postgres-dev

# 3. Recréer le volume
docker compose up -d postgres

# 4. Attendre que PostgreSQL soit prêt
docker logs -f game-plug-db-dev

# 5. Restaurer depuis le backup
./scripts/restore-database.sh backups/latest-backup.sql
```

---

## 📋 Checklist Sécurité

- [x] Volume Docker persistant configuré
- [x] Backups automatiques quotidiens (3h du matin)
- [x] Rétention 30 jours des backups
- [x] Vérification automatique de l'intégrité
- [x] Script de restauration avec confirmation
- [x] Backup de sécurité avant toute restauration
- [x] Logs des opérations de backup
- [x] Lien symbolique vers dernier backup
- [x] Protection contre `docker compose down -v`
- [x] Documentation complète de restauration

---

## 🔧 Configuration Cron

### Modifier la Fréquence des Backups

```bash
# Éditer le crontab
crontab -e

# Exemples de planifications:
0 3 * * *     # Tous les jours à 3h du matin (défaut)
0 */6 * * *   # Toutes les 6 heures
0 2 * * 0     # Tous les dimanches à 2h du matin
*/30 * * * *  # Toutes les 30 minutes (pour tests)
```

### Modifier la Rétention

Éditer `/srv/workspace/game-plug/scripts/backup-database.sh`:

```bash
# Ligne à modifier (défaut: 30 jours)
RETENTION_DAYS="${1:-30}"

# Pour 60 jours de rétention
RETENTION_DAYS="${1:-60}"
```

---

## 📞 Support

### Fichiers Importants

- **Protection DB:** `.claude-db-protection.md`
- **Identifiants:** `IDENTIFIANTS-TEST.md`
- **Cette doc:** `PERSISTENCE-DATABASE.md`
- **Backups:** `backups/`
- **Scripts:** `scripts/backup-database.sh`, `scripts/restore-database.sh`

### Vérifications Régulières Recommandées

**Hebdomadaire:**
- Vérifier que les backups automatiques se créent bien
- Vérifier l'espace disque des backups

**Mensuel:**
- Tester une restauration sur environnement de test
- Vérifier l'intégrité d'un backup aléatoire

**Commandes utiles:**
```bash
# Taille répertoire backups
du -sh /srv/workspace/game-plug/backups/

# Nombre de backups
ls /srv/workspace/game-plug/backups/auto-backup-*.sql | wc -l

# Dernier backup créé
ls -lt /srv/workspace/game-plug/backups/auto-backup-*.sql | head -1
```

---

*Dernière mise à jour: 2026-01-04*
*Système de persistance configuré et testé ✅*
