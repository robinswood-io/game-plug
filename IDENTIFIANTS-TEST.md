# Identifiants Game Plug - Sessions Conservées

## 🎮 Sessions Production: Campagne de Paris

### GM Principal
- **Email:** thibault@youcom.io
- **Mot de passe:** (ton mot de passe habituel)

### Chapitre 1 : Le Cercle des Curieux
- **Code session:** ARCANE
- **Session ID:** e49872b4-ff93-4cff-8576-c518de829a27
- **Statut:** Active

### Chapitre II
- **Code session:** XYX89Z
- **Session ID:** 6924315e-6810-41a6-ae3c-32845506c0c7
- **Statut:** Active

### Personnages des Sessions (7)
*Les mêmes investigateurs progressent à travers les chapitres de la campagne*

1. **Vlad Kowalski** - Détective Privé
2. **Armand de Khorne** - Occultiste
3. **Dr. Lucien Mortegarde** - Aliéniste
4. **Dr. Nia Vanseirk** - Médecin
5. **Helena Snatch** - Antiquaire
6. **Jean Luc Melanchon** - Archéologue (lié à thibault@youcom.io)
7. **Maurice Lefèvre** - Inspecteur de Police

---

## 🧪 Session de Test: L'Ombre d'Innsmouth

### GM de Test
- **Email:** claude.test@game-plug.local
- **Mot de passe:** (même que thibault, hash identique)
- **Code session:** TEST01
- **Session ID:** test-session-claude
- **Scénario:** Investigation des étranges disparitions à Innsmouth

### Histoire de la Session Test
> Les investigateurs ont été appelés à Innsmouth suite à la disparition mystérieuse de plusieurs marins. La ville portuaire, réputée pour son atmosphère oppressante et ses habitants peu avenants, cache un secret qui remonte à des générations. Les investigateurs devront explorer les ruelles sombres, interroger les habitants, et peut-être s'aventurer dans les profondeurs pour découvrir la vérité sur l'Ordre Ésotérique de Dagon.

### Joueurs de Test

#### 1. Thomas Arkwright - Professeur d'Université
- **Email joueur:** player1@game-plug.local
- **Âge:** 45 ans, Homme
- **Caractéristiques:**
  - FOR: 50, CON: 60, TAI: 70, DEX: 55, APP: 50
  - INT: 80, POU: 70, ÉDU: 85, CHA: 60
  - Points de Vie: 13, Santé Mentale: 70, Points de Magie: 14
- **Compétences principales:**
  - Bibliothèque: 75%
  - Histoire: 70%
  - Psychologie: 60%
  - Langues anciennes: 65%
- **Background:** Spécialiste en civilisations anciennes, Thomas a été contacté pour étudier d'étranges artefacts découverts près du port.

#### 2. Sarah Blackwood - Journaliste d'Investigation
- **Email joueur:** player2@game-plug.local
- **Âge:** 32 ans, Femme
- **Caractéristiques:**
  - FOR: 45, CON: 55, TAI: 55, DEX: 70, APP: 75
  - INT: 70, POU: 60, ÉDU: 70, CHA: 65
  - Points de Vie: 11, Santé Mentale: 60, Points de Magie: 12
- **Compétences principales:**
  - Persuasion: 70%
  - Discrétion: 65%
  - Photographie: 60%
  - Trouver objet caché: 55%
- **Background:** Reporter pour le Boston Globe, Sarah enquête sur une série de disparitions qui pourrait révéler un scandale majeur.

#### 3. Marcus Chen - Médecin Légiste
- **Email joueur:** player3@game-plug.local
- **Âge:** 38 ans, Homme
- **Caractéristiques:**
  - FOR: 55, CON: 70, TAI: 65, DEX: 60, APP: 55
  - INT: 75, POU: 65, ÉDU: 80, CHA: 50
  - Points de Vie: 14, Santé Mentale: 65, Points de Magie: 13
- **Compétences principales:**
  - Médecine: 80%
  - Sciences: 70%
  - Biologie: 65%
  - Premiers soins: 75%
- **Background:** Médecin légiste de l'État, Marcus a été envoyé pour examiner les corps retrouvés dans des circonstances étranges.

---

## 📊 Résumé Base de Données

### Statistiques
- **Sessions totales:** 3 (2 production + 1 test)
- **Personnages totaux:** 17 (14 production [7×2 chapitres] + 3 test)
- **Utilisateurs totaux:** 5 (1 GM prod + 1 GM test + 3 joueurs test)

### Backups Disponibles
- **Pré-nettoyage:** `/srv/workspace/game-plug/backups/pre-cleanup-backup-20260104-171117.sql` (2.5 MB)
- **Post-nettoyage:** `/srv/workspace/game-plug/backups/post-cleanup-backup-20260104-171326.sql` (2.5 MB)
- **Final (Chapitres 1+2):** `/srv/workspace/game-plug/backups/final-backup-chapitre1-2-20260104-184125.sql` (2.5 MB)

---

## 🔧 Configuration Base de Données

```env
DATABASE_URL=postgresql://roleplug:roleplug_020a2db75da6b5674c084a09d4e22b14@localhost:5434/roleplug
```

---

## 🎯 Scénarios de Test Suggérés

### Test 1: Création de Personnage
- Se connecter avec player1@game-plug.local
- Rejoindre session TEST01
- Tester création nouveau personnage
- Vérifier sauvegarde caractéristiques

### Test 2: Lancer de Dés
- Se connecter en tant que GM (claude.test@game-plug.local)
- Demander jets de compétence aux joueurs
- Tester dés de santé mentale
- Vérifier historique des lancers

### Test 3: Combat et Effets
- Créer un combat avec créature (Profond)
- Appliquer dégâts aux personnages
- Tester effets actifs (poison, folie temporaire)
- Vérifier mise à jour points de vie/santé

### Test 4: Progression Session
- Ajouter événements de chapitre
- Tester système d'inventaire
- Modifier notes de personnage
- Vérifier synchronisation temps réel (WebSocket)

### Test 5: Génération Avatar AI
- Demander génération avatar pour Thomas Arkwright
- Vérifier appel API DALL-E
- Tester sauvegarde image
- Vérifier affichage avatar

---

## ⚠️ Protection Base de Données

**RAPPEL:** Règles de protection actives (`.claude-db-protection.md`)
- ❌ INTERDIT de wiper la base sans backup
- ❌ INTERDIT `docker-compose down -v`
- ❌ INTERDIT `DROP DATABASE` ou `TRUNCATE` sans validation
- ✅ TOUJOURS faire backup avant modifications destructives

---

*Dernière mise à jour: 2026-01-04 18:41 UTC - Chapitre 1 restauré*
