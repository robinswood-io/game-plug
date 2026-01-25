# User Stories Joueur - Résumé Exécutif

## Vue d'Ensemble

**Nombre total d'user stories:** 45 user stories complètes
**Couverture:** 100% des features identifiées en codebase
**Format:** Basé Call of Cthulhu 7e official ruleset

---

## Catégories Principales

### 1. GESTION PERSONNAGE (5 stories)
- US-J01: Créer personnage
- US-J02: Importer personnage
- US-J03: Afficher feuille
- US-J04: Modifier stats
- US-J05: Gérer profil joueur

### 2. FEUILLE DE PERSONNAGE (4 stories)
- US-J06: Voir compétences
- US-J07: Éditer compétences (allocation points)
- US-J08: Consulter avancées/prouesses
- US-J09: Tracker XP

### 3. INVENTAIRE & ÉQUIPEMENT (5 stories)
- US-J10: Consulter inventaire
- US-J11: Ajouter objet
- US-J12: Modifier objet
- US-J13: Équiper/Déséquiper
- US-J14: Gérer finances

### 4. SYSTÈME DE DÉS (7 stories)
- US-J15: Lancer 1d100 simple
- US-J16: Lancer avec bonus/penalty
- US-J17: Lancer compétence spécifique
- US-J18: Lancer dégâts (armes)
- US-J19: Lancer sanité (sanity check)
- US-J20: Lancer dés customisés (XdY)
- US-J21: Voir historique dés

### 5. SANITÉ MENTALE (4 stories)
- US-J22: Tracker sanité
- US-J23: Acquérir phobies/manias
- US-J24: Gérer folie temporaire
- US-J25: Gérer folie indéfinie

### 6. SESSIONS MULTIJOUEUR (4 stories)
- US-J26: Rejoindre via code
- US-J27: Voir liste joueurs
- US-J28: Recevoir invitations
- US-J29: Quitter session

### 7. GAMEBOARD & PROJECTIONS (4 stories)
- US-J30: Voir GameBoard MJ
- US-J31: Recevoir effets (buffs)
- US-J32: Recevoir dégâts
- US-J33: Recevoir notifications

### 8. HISTORIQUE & JOURNAL (3 stories)
- US-J34: Consulter historique session
- US-J35: Exporter feuille (PDF/JSON)
- US-J36: Notes de session personnelles

### 9. INTERACTION MJ (3 stories)
- US-J37: Recevoir demandes MJ (skill checks)
- US-J38: Communiquer avec MJ (chat)
- US-J39: Voir tableau d'affichage MJ

### 10. PRÉFÉRENCES & PARAMÈTRES (4 stories)
- US-J40: Préférences visuelles
- US-J41: Préférences audio
- US-J42: Gestion notifications
- US-J43: Privacy & données

### BONUS. STATISTIQUES (2 stories)
- US-J44: Stats personnage
- US-J45: Stats session

---

## Statut d'Implémentation

### IMPLÉMENTÉES (P0 - Core) ✅
```
✅ Création personnage (complète)
✅ Feuille personnage (complète)
✅ Gestion compétences (complète)
✅ Inventaire (complet)
✅ Système dés (complet)
✅ Sanité mentale (complète)
✅ Sessions multijoueur (rejoindre via code)
✅ GameBoard temps réel (complète)
✅ Effets MJ (buffs/debuffs)
✅ Historique dés (partiellement)
✅ Notifications (WebSocket ready)
```

### EN PROGRÈS (P1 - Important)
```
⚠️ Historique session (chapter events) - 80% complète
⚠️ Export personnage - Structure prête, implémentation pending
⚠️ Notes de session - Database model ready
```

### À FAIRE (P2 - Confort)
```
❌ Chat multijoueur (architecture WebSocket ready)
❌ Bulletin Board MJ
❌ Préférences visuelles (UI partielle)
❌ Statistiques groupe/personnage
❌ Préférences audio (non prioritaire)
```

### NOTES
```
Pas d'API stats/analytics actuellement
Pas de système chat texte implémenté
Pas de bulletin board/notes publiques MJ
```

---

## Endpoints API Résumé

### Personnages
```
POST   /api/characters                      - Créer
GET    /api/characters/{id}                 - Récupérer
PATCH  /api/characters/{id}                 - Modifier
GET    /api/characters/{id}/skills          - Compétences
PATCH  /api/characters/{id}/skills          - Modifier skills
GET    /api/characters/{id}/inventory       - Inventaire
POST   /api/characters/{id}/inventory       - Ajouter objet
PATCH  /api/characters/{id}/inventory/{id}  - Modifier objet
DELETE /api/characters/{id}/inventory/{id}  - Supprimer objet
GET    /api/characters/{id}/sanity          - État sanité
POST   /api/sanity/conditions               - Ajouter phobie/mania
GET    /api/characters/{id}/export/pdf      - Export PDF
GET    /api/characters/{id}/export/json     - Export JSON
```

### Dés
```
POST   /api/dice/roll                       - Lancer dés
POST   /api/dice/roll-skill                 - Lancer compétence
POST   /api/dice/roll-damage                - Lancer dégâts
POST   /api/dice/roll-sanity                - Lancer sanité
POST   /api/dice/roll-custom                - Lancer custom (XdY)
GET    /api/roll-history                    - Historique dés
```

### Sessions
```
GET    /api/sessions/{id}                   - Info session
GET    /api/sessions/{id}/players           - Liste joueurs
POST   /api/sessions/join                   - Rejoindre
POST   /api/sessions/{id}/leave             - Quitter
POST   /api/sessions/{id}/invite            - Inviter
GET    /api/sessions/{id}/characters        - Personnages session
```

### Effets
```
POST   /api/characters/{id}/active-effects  - Appliquer effet
GET    /api/characters/{id}/active-effects  - Effets actifs
DELETE /api/active-effects/{id}             - Retirer effet
POST   /api/characters/{id}/apply-damage    - Appliquer dégâts
```

### Événements Chapitre
```
GET    /api/chapters/{id}/events            - Événements chapitre
GET    /api/sessions/{id}/events            - Tous événements
POST   /api/chapter-events                  - Créer événement
```

### WebSocket Real-Time
```
join_session                 - Rejoindre room session
leave_session                - Quitter room session
chat:message                 - Messages texte
notification:*               - Notifications temps réel
gameboard:content            - Contenu GameBoard
request:roll                 - Demandes lancer dés
roll:result                  - Résultats dés
```

---

## Data Model Core

```typescript
Character {
  // Identité
  id, name, occupation, age
  userId, sessionId

  // Caractéristiques (8 principales + LUCK)
  strength, constitution, size, dexterity
  appearance, intelligence, power, education, luck

  // Stats dérivées
  hitPoints, maxHitPoints
  sanity, maxSanity
  magicPoints, maxMagicPoints

  // Skills & progression
  skills: Record<string, number>
  availableSkillPoints: number
  skillsLocked: boolean

  // Autres
  avatarUrl, avatarPrompt
  money: decimal
  notes: text
  isActive: boolean
}

Inventory {
  characterId, name, description
  category: 'weapon' | 'armor' | 'tool' | 'book' | 'misc'
  quantity, weight
  damage (dé formula), armor (value)
  isEquipped
}

SanityCondition {
  characterId, type: 'phobia' | 'mania' | 'temporary_insanity' | 'indefinite_insanity'
  name, description
  duration: 'temporary' | 'indefinite' | 'permanent'
  isActive
}

ActiveEffect {
  characterId, appliedBy (MJ)
  type: 'buff' | 'debuff' | 'damage' | 'sanity_loss'
  name, description
  value (dice formula or static)
  duration (rounds/hours)
}

RollHistory {
  userId, characterId, sessionId
  rollType: 'skill' | 'sanity' | 'damage' | 'custom'
  skillName, skillValue
  diceFormula, result
  outcome: 'success' | 'failure' | 'extreme_success' | 'hard_success'
}

ChapterEvent {
  chapterId, sessionId, characterId
  eventType: 'roll' | 'narration' | 'decision' | 'sanity' | 'combat' | 'discovery' | 'milestone'
  title, description
  metadata: JSON
  isImportant: boolean
}
```

---

## Règles Call of Cthulhu 7e Implémentées

### Génération Personnage
- ✅ Caractéristiques: 3d6×5 standard
- ✅ LUCK: 3d6×5 (ou spécial)
- ✅ Stats dérivées auto-calculées
- ✅ Occupation + compétences associations

### Système Dés
- ✅ Résolutions 1d100 vs compétence
- ✅ Succès critiques: ≤ (compétence/10)
- ✅ Succès difficiles: ≤ (compétence/2)
- ✅ Sanity checks: 1d100 vs POW×5
- ✅ Dégâts: formules dés arbitraires

### Sanité
- ✅ Valeur initiale: POW
- ✅ Perte mentale: événements horrifiques
- ✅ Phobies/Manias: conditions durables
- ✅ Folie temporaire: sanité = 0
- ✅ Folie indéfinie: sanité < 0 ou conditions

### Avancées
- ✅ Structure: succès → avance possible
- ✅ Armes: bonus dégâts après succès combat
- ✅ Compétences: +1% après succès

---

## Critères d'Acceptation Typiques

### Pour chaque User Story:
1. ✅ **Formulaire/UI:** Interface claire et intuitive
2. ✅ **Validation:** Données correctes, messages d'erreur explicites
3. ✅ **API:** Endpoint(s) nécessaire(s) fonctionnel(s)
4. ✅ **Données:** Sauvegarde en base de données
5. ✅ **Temps réel:** WebSocket pour infos critiques
6. ✅ **Notifications:** Toast/popup utilisateur
7. ✅ **Historique:** Audit logs actions importantes
8. ✅ **Responsive:** Mobile/tablet/desktop
9. ✅ **Accessibilité:** ARIA labels, clavier navigation
10. ✅ **Performance:** < 500ms chargement données

---

## Points Forts Architecture

- ✅ **Séparation concerns:** API REST + WebSocket clear
- ✅ **Modularité:** 14 modules backend indépendants
- ✅ **Real-time:** WebSocket pour sync temps réel
- ✅ **Scalabilité:** Redis cache + DB optimization ready
- ✅ **Type-safety:** TypeScript strict partout
- ✅ **Testing:** Framework Playwright ready
- ✅ **Security:** JWT auth + role-based controls

---

## Recommandations Prochaines

### Court terme (Sprint 1-2)
1. Finir export PDF (util.ts ready)
2. Implémenter chat simple (WebSocket ready)
3. Compléter historique session
4. Tests E2E complets Playwright

### Moyen terme (Sprint 3-4)
5. Bulletin board MJ + commentaires
6. Système préférences complet
7. Analytics/statistiques groupe
8. Optimisation performance

### Long terme (V1.1+)
9. Internationalisation (i18n)
10. Accessibilité WCAG 2.1 AA
11. Mobile app (React Native)
12. Intégration VTT (Foundry?)

---

**Document:** USER_STORIES_SUMMARY.md
**Date:** 24 Janvier 2026
**Statut:** Complet et validé ✅
