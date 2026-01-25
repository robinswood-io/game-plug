# User Stories Game Plug - Documentation Complète

**Date:** 24 Janvier 2026  
**Version:** 1.0 - Exhaustive  
**Statut:** 45 user stories joueur + 40+ user stories MJ

---

## Vue d'Ensemble

Cette documentation contient l'analyse complète des **user stories JOUEUR** et **user stories MJ** pour Game Plug (RPG Call of Cthulhu 7e).

### Fichiers de Documentation

| Fichier | Taille | Description |
|---------|--------|-------------|
| **USER_STORIES_JOUEUR.md** | 38K | Document principal: 45 stories joueur détaillées |
| **USER_STORIES_SUMMARY.md** | 9.5K | Résumé exécutif + statut implémentation |
| **USER_STORIES_INDEX.md** | 4.6K | Index rapide par domaine/catégorie |
| **FEATURE_ENDPOINT_MAPPING.md** | 14K | Mapping exhaustif stories → API → Components |
| **JOUEUR_STORIES_VISUAL_SUMMARY.txt** | 24K | Synthèse visuelle ASCII complète |
| **DEVELOPER_QUICK_START.md** | 11K | Guide rapide pour développeurs |
| **USER_STORIES_MJ.md** | 30K | Document principal: 40+ stories MJ |
| **USER_STORIES_MJ_SUMMARY.md** | 6.0K | Résumé MJ + statut implémentation |
| **ARCHITECTURE.md** | 24K | Architecture système générale |

---

## Organisation Documentation

### Pour les Managers/Product Owners

**Commencer par:**
1. `USER_STORIES_SUMMARY.md` - Vue d'ensemble et statut
2. `JOUEUR_STORIES_VISUAL_SUMMARY.txt` - Synthèse visuelle
3. `USER_STORIES_INDEX.md` - Navigation rapide

### Pour les Développeurs

**Commencer par:**
1. `DEVELOPER_QUICK_START.md` - Quick start
2. `FEATURE_ENDPOINT_MAPPING.md` - Mapping code
3. `USER_STORIES_JOUEUR.md` - Détails complets

### Pour les Testeurs

**Commencer par:**
1. `FEATURE_ENDPOINT_MAPPING.md` - Features à tester
2. `USER_STORIES_JOUEUR.md` - Critères d'acceptation

---

## Statistiques Clés

### User Stories JOUEUR

```
Total:        45 stories
Implémentées: 28 ✅ Done
En cours:      8 ⚠️ Partial
À faire:       9 ❌ Pending
Couverture:   62% fonctionnel
```

### User Stories MJ

```
Total:        40+ stories
Implémentées: 25+ ✅ Done
En cours:      5+ ⚠️ Partial
À faire:       10+ ❌ Pending
```

### Répartition par Catégorie (JOUEUR)

| Catégorie | Nombre | Status |
|-----------|--------|--------|
| Personnage/Feuille | 9 | 6✅ 2⚠️ 1❌ |
| Inventaire | 5 | 5✅ |
| Système Dés | 7 | 7✅ |
| Sanité Mentale | 4 | 3✅ 1⚠️ |
| Sessions Multijoueur | 4 | 3✅ 1⚠️ |
| GameBoard | 4 | 3✅ 1⚠️ |
| Historique/Journal | 3 | 1✅ 1⚠️ 1❌ |
| Interaction MJ | 3 | 2⚠️ 1❌ |
| Préférences | 4 | 4❌ |
| Statistiques | 2 | 2❌ |

---

## Architecture Backend (NestJS 11)

### 14 Modules Fonctionnels

```
Auth              ✅ JWT + Local GM accounts
Characters        ✅ CRUD personnages + Skills
Sessions          ✅ Gestion sessions multijoueur
Dice              ✅ Système lancers dés
Sanity            ✅ Sanité mentale + Phobies
Inventory         ✅ CRUD inventaire
Chapters          ✅ Chapitres/actes
ChapterEvents     ✅ Timeline événements
Effects           ✅ Buffs/debuffs
GameBoard         ✅ Projection MJ
Narrative         ✅ Notes MJ
WebSockets        ✅ Communication temps réel
AI                ✅ Avatar IA (DALL-E 3)
Database          ✅ Drizzle ORM
```

---

## Architecture Frontend (React 19 + Next.js 16)

### Pages Principales

```
PUBLIC:
  /                      Home
  /join/{code}           Rejoindre session
  /gm-login              Authentification MJ

DASHBOARD:
  /dashboard             Hub central
  /characters/new        Création personnage
  /characters/{id}       Feuille personnage (lecture)
  /characters/{id}/edit  Feuille personnage (édition)
  /sessions              Liste sessions
  /sessions/{id}         Session MJ
  /sessions/{id}/gameboard GameBoard temps réel
```

### Composants Clés

- ✅ CharacterCreationForm
- ✅ CharacterSheet
- ✅ DiceRoller
- ✅ SanityTracker
- ✅ CharacterInventoryDisplay
- ✅ GameBoard
- ✅ RollHistoryVisual
- ⚠️ NotificationCenter
- ❌ ChatPanel
- ❌ BulletinBoard

---

## Endpoints API (REST + WebSocket)

### REST Endpoints Principaux

**Characters:**
- `POST /api/characters` - Créer
- `GET /api/characters/{id}` - Récupérer
- `PATCH /api/characters/{id}` - Modifier
- `GET /api/characters/{id}/skills` - Compétences
- `GET /api/characters/{id}/inventory` - Inventaire

**Dice:**
- `POST /api/dice/roll` - Lancer dés
- `POST /api/dice/roll-skill` - Lancer compétence
- `POST /api/dice/roll-damage` - Lancer dégâts
- `POST /api/dice/roll-sanity` - Lancer sanité
- `GET /api/roll-history` - Historique

**Sessions:**
- `POST /api/sessions/join` - Rejoindre
- `GET /api/sessions/{id}` - Info session
- `GET /api/sessions/{id}/players` - Liste joueurs

### WebSocket Events

- `join_session` - Rejoindre room session
- `gameboard:content` - Contenu GameBoard
- `notification:*` - Notifications
- `active-effects:*` - Changements buffs
- `chat:message` - Messages (à implémenter)

---

## Règles Call of Cthulhu 7e Implémentées

### Génération Personnage
- ✅ Caractéristiques STR, CON, SIZ, DEX, APP, INT, POW, EDU (3d6×5)
- ✅ LUCK séparé (3d6×5)
- ✅ Stats dérivées auto-calculées
- ✅ 40+ occupations avec bonus compétences

### Système Dés
- ✅ Résolutions 1d100 vs compétence
- ✅ Succès critiques (≤ compétence/10)
- ✅ Succès difficiles (≤ compétence/2)
- ✅ Sanity checks (1d100 vs POW×5)
- ✅ Dégâts avec formules dés

### Sanité
- ✅ Perte mentale
- ✅ Phobies/Manias
- ✅ Folie temporaire (sanité = 0)
- ✅ Folie indéfinie

### Avancées
- ✅ Armes (bonus dégâts)
- ✅ Compétences (+1% après succès)

---

## Statut d'Implémentation Détaillé

### P0 - CRITIQUE (28 Done) ✅
Core features essentielles - Tous implémentés
- Création/gestion personnage
- Compétences et inventaire
- Système dés complet
- Sanité tracker
- Sessions multijoueur

### P1 - IMPORTANT (8 Partial) ⚠️
Enhanced features - En cours
- Historique session
- Notifications temps réel
- Invitations
- Demandes MJ
- Folie temporaire/indéfinie

### P2 - CONFORT (6 Pending) ❌
Quality of life - À faire
- Chat texte
- Bulletin board
- Préférences visuelles
- Profil joueur
- Export PDF

### P3 - BONUS (3 Pending) ❌
Nice to have - À faire
- Statistiques
- Privacy GDPR
- Analytics avancées

---

## Prochaines Étapes (Roadmap)

### Sprint 1 (Court Terme)
1. Compléter historique session (ChapterTimeline UI)
2. Finaliser notifications (NotificationCenter)
3. Implémenter chat texte (ChatPanel + WebSocket)
4. Export PDF/JSON personnage

### Sprint 2 (Moyen Terme)
5. Bulletin board MJ
6. Système préférences (mode sombre, taille police)
7. Profil joueur management
8. Statistiques groupe/personnage

### Sprint 3+ (Long Terme)
9. Internationalisation (i18n)
10. Accessibilité WCAG 2.1 AA
11. Mobile app (React Native)
12. Intégration VTT (Foundry)

---

## Ressources Utiles

### Documentation
- `ARCHITECTURE.md` - Architecture complète (14 modules)
- `DEVELOPER_QUICK_START.md` - Commands et exemples
- `/opt/ia-webdev/rulebook-ai/` - Rulebook Robinswood

### Outils
- **API Docs:** http://localhost:5002/api-docs (Swagger)
- **Frontend:** http://localhost:5173
- **Database:** PostgreSQL 16
- **Cache:** Redis 7

### Technologies
- Backend: NestJS 11, Express, TypeScript 5.7+
- Frontend: React 19, Next.js 16, TailwindCSS
- Database: PostgreSQL 16, Drizzle ORM
- Real-time: Socket.io + WebSocket
- AI: DALL-E 3, GPT-4

---

## Navigation Rapide

### Chercher une Feature Spécifique?

```bash
# Par nom user story
grep -r "US-J01" /srv/workspace/game-plug/USER_STORIES*

# Par catégorie
grep -A 5 "DÉGÂTS" /srv/workspace/game-plug/USER_STORIES_JOUEUR.md

# Par API endpoint
grep "GET /api/characters" /srv/workspace/game-plug/FEATURE_ENDPOINT_MAPPING.md

# Par component
grep "DiceRoller" /srv/workspace/game-plug/FEATURE_ENDPOINT_MAPPING.md
```

### Accéder à la Documentation Complète

```bash
# Document principal (45 stories)
cat /srv/workspace/game-plug/USER_STORIES_JOUEUR.md

# Résumé exécutif
cat /srv/workspace/game-plug/USER_STORIES_SUMMARY.md

# Index par domaine
cat /srv/workspace/game-plug/USER_STORIES_INDEX.md

# Synthèse visuelle
cat /srv/workspace/game-plug/JOUEUR_STORIES_VISUAL_SUMMARY.txt

# Quick start développeurs
cat /srv/workspace/game-plug/DEVELOPER_QUICK_START.md

# Mapping features → code
cat /srv/workspace/game-plug/FEATURE_ENDPOINT_MAPPING.md
```

---

## Qualité Documentation

✅ **Couverture:** 100% des features identifiées  
✅ **Détail:** Chaque story avec critères acceptation  
✅ **Code Mapping:** Story → API → Component  
✅ **Priorisation:** P0 (Critical) à P3 (Bonus)  
✅ **Exemples:** Exemples API cURL inclus  
✅ **Statut:** Live tracking implémentation (28/45 Done)

---

## Support

**Questions/Issues?**
1. Consulter `DEVELOPER_QUICK_START.md` (Quick FAQ)
2. Chercher dans `FEATURE_ENDPOINT_MAPPING.md` (Mapping)
3. Voir `USER_STORIES_JOUEUR.md` (Détails complets)
4. Vérifier `/opt/ia-webdev/rulebook-ai/` (Context global)

---

## Historique Documentation

| Date | Version | Changes |
|------|---------|---------|
| 24 Jan 2026 | 1.0 | Initial release: 45 user stories joueur exhaustives |

---

**État de la Documentation:** COMPLET ET À JOUR ✅

Pour naviguer la documentation user stories, consultez les fichiers listés ci-dessus selon votre rôle (Manager, Développeur, Testeur).
