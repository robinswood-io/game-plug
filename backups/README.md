# Répertoire Backups - Game Plug

Ce répertoire contient les sauvegardes automatiques et manuelles de la base de données PostgreSQL.

## 📁 Types de Fichiers

### Backups Automatiques
- **Format:** `auto-backup-YYYYMMDD-HHMMSS.sql`
- **Fréquence:** Quotidiens à 3h du matin
- **Rétention:** 30 jours (suppression automatique après)
- **Taille moyenne:** ~2.5 MB

### Backups Manuels
- **Format:** Variable selon le contexte
- **Exemples:**
  - `pre-cleanup-backup-*.sql` - Avant nettoyage
  - `post-cleanup-backup-*.sql` - Après nettoyage
  - `final-backup-*.sql` - Backups finaux de sessions importantes
  - `pre-restore-backup-*.sql` - Backup de sécurité avant restauration

### Lien Symbolique
- **`latest-backup.sql`** → Pointe vers le dernier backup automatique

## 🔄 Utilisation

### Créer un Backup Manuel
```bash
cd /srv/workspace/game-plug
POSTGRES_PASSWORD=roleplug_020a2db75da6b5674c084a09d4e22b14 ./scripts/backup-database.sh
```

### Restaurer un Backup
```bash
cd /srv/workspace/game-plug

# Dernier backup
./scripts/restore-database.sh backups/latest-backup.sql

# Backup spécifique
./scripts/restore-database.sh backups/auto-backup-20260104-120000.sql
```

## 📊 Statistiques Actuelles

Vérifier avec:
```bash
# Nombre de backups
ls auto-backup-*.sql | wc -l

# Espace total utilisé
du -sh .

# Dernier backup créé
ls -lt auto-backup-*.sql | head -1
```

## 📜 Logs

**Fichier:** `backup.log`
**Contenu:** Historique de tous les backups automatiques
**Format:** `[timestamp] [level] message`

## ⚠️ Important

- **NE PAS supprimer** les backups manuellement sans raison
- Les backups automatiques sont nettoyés automatiquement après 30 jours
- Toujours vérifier qu'un backup récent existe avant toute opération risquée
- Les backups `pre-restore-*` sont créés automatiquement avant chaque restauration

## 📖 Documentation Complète

Voir: `/srv/workspace/game-plug/PERSISTENCE-DATABASE.md`
