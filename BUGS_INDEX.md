# BUGS DOCUMENTATION INDEX - Game-Plug

**Date:** 2026-01-24
**Version:** 1.0

---

## 📚 STRUCTURE DOCUMENTATION

```
game-plug/
├── BUGS_REPORT.md          ← Rapport détaillé complet (26KB)
├── BUGS_QUICK_REFERENCE.md ← Référence rapide visuelle
├── BUGS_TRACKING.csv       ← Tableau de suivi (Excel/LibreOffice)
└── BUGS_INDEX.md           ← Ce fichier (navigation)
```

---

## 🎯 GUIDE D'UTILISATION

### Pour les Développeurs

**Vous voulez corriger un bug ?**
1. Lire **BUGS_QUICK_REFERENCE.md** (vue d'ensemble)
2. Ouvrir **BUGS_TRACKING.csv** (choisir bug non assigné)
3. Consulter **BUGS_REPORT.md** section détaillée du bug
4. Suivre la solution proposée
5. Marquer bug comme "Fixed" dans CSV

---

### Pour le Product Owner / Manager

**Vous voulez prioriser les corrections ?**
1. Ouvrir **BUGS_QUICK_REFERENCE.md** (statut global)
2. Section "Impact User Stories" (voir fonctionnalités bloquées)
3. Section "Plan de Correction" (estimations temps)
4. **BUGS_TRACKING.csv** pour suivre avancement

---

### Pour les Testeurs QA

**Vous voulez reproduire/valider un bug ?**
1. **BUGS_REPORT.md** sections "Symptômes" et "Tests à Effectuer"
2. Utiliser commandes fournies dans rapport
3. Vérifier logs backend mentionnés
4. Valider avec tests E2E associés

---

## 📖 CONTENU DES FICHIERS

### 1. BUGS_REPORT.md (Rapport Principal)

**Sections:**
- Résumé Exécutif (stats globales)
- Bugs Critiques (P0) - 5 bugs détaillés
- Bugs Majeurs (P1) - 8 bugs détaillés
- Bugs Mineurs (P2-P3) - 4 bugs détaillés
- Bugs Résolus - 2 bugs archivés
- Recommandations de priorisation
- Stratégie de validation
- Métriques (couverture user stories)
- Fichiers analysés
- Références

**Détails par bug:**
- Status (❌ Non fixé / ✅ Fixé)
- Priority (P0/P1/P2/P3)
- User Story Bloquée/Affectée
- Symptômes (messages d'erreur)
- Cause Racine (analyse technique)
- Fichiers Concernés (chemins absolus)
- Solution Proposée (code exemple)
- Tests à Effectuer (commandes bash)
- Impact User Stories

**Taille:** 26KB
**Format:** Markdown avec code blocks

---

### 2. BUGS_QUICK_REFERENCE.md (Référence Rapide)

**Sections:**
- Statut Global (diagramme ASCII)
- P0 - Bugs Critiques (5 fiches rapides)
- P1 - Bugs Majeurs (tableau résumé)
- P2-P3 - Bugs Mineurs (tableau résumé)
- Impact User Stories (listes bloquées/dégradées)
- Plan de Correction (semaines 1-3)
- Commandes Utiles (bash)
- Checklist Validation
- Fichiers Clés (chemins)

**Utilisation:**
- Impression rapide (5 pages)
- Affichage moniteur secondaire
- Référence pendant développement

**Taille:** 10KB
**Format:** Markdown avec emojis visuels

---

### 3. BUGS_TRACKING.csv (Suivi)

**Colonnes:**
- Bug ID (BUG-001, BUG-002, ...)
- Priority (P0/P1/P2/P3)
- Status (Open/In Progress/Fixed)
- Endpoint (API route affectée)
- Error Type (catégorie)
- User Story (US-XXX)
- Impact (description courte)
- Estimated Fix Time (heures)
- Assigned To (nom développeur)
- Fixed Date (YYYY-MM-DD)
- Notes (infos supplémentaires)

**Utilisation:**
- Ouvrir dans Excel/LibreOffice/Google Sheets
- Trier par Priority/Status
- Filtrer bugs Open
- Assigner développeurs
- Tracker progression

**Taille:** 19 lignes (17 bugs + 2 fixes)
**Format:** CSV (comma-separated values)

---

## 🔗 DOCUMENTS ASSOCIÉS

### User Stories
- **USER_STORIES_JOUEUR.md** - 45 user stories joueur
- **USER_STORIES_MJ.md** - 30 user stories MJ
- **USER_STORIES_SUMMARY.md** - Résumé exécutif
- **FEATURE_ENDPOINT_MAPPING.md** - Mapping stories → endpoints

### Tests
- **E2E_TESTS_SUMMARY.md** - 101 tests Playwright
- **e2e/07-api-routes.spec.ts** - Tests API (36 endpoints)
- **e2e/02-character-creation.spec.ts** - Tests création personnage

### Corrections Appliquées
- **BUG_FIX_CHAPTER_CREATION.md** - Fix authentification chapitre ✅
- **VALIDATION_TEST.md** - Tests de validation

### Architecture
- **ARCHITECTURE.md** - Architecture système
- **DEVELOPER_QUICK_START.md** - Guide développeur
- **CLAUDE.md** - Règles développement

---

## 📊 MÉTRIQUES CONSOLIDÉES

### Par Priorité
```
P0 (Critiques):     5 bugs  |  8h  estimation
P1 (Majeurs):       8 bugs  | 15h  estimation
P2-P3 (Mineurs):    4 bugs  |  8h  estimation
─────────────────────────────────────────────
TOTAL À CORRIGER:  15 bugs  | 31h  estimation
RÉSOLUS:            2 bugs  |  5h  déjà corrigés
```

### Par Catégorie
```
Database Constraints:  5 bugs (NOT NULL, Foreign Keys)
DTO Validation:        7 bugs (Field validation, types)
Business Logic:        2 bugs (HP <= 0, session status)
Error Handling:        1 bug  (OpenAI fallback)
Tests E2E:             1 bug  (Flaky tests)
```

### Impact Business
```
User Stories Bloquées:       7  (9.3%)
User Stories Dégradées:     14  (18.7%)
User Stories Fonctionnelles: 54  (72.0%)
─────────────────────────────────────────
Total User Stories:         75  (100%)
```

---

## 🚀 PROCHAINES ÉTAPES

### Semaine 1 (Critique)
1. Review bugs P0 avec équipe dev
2. Assigner bugs dans `BUGS_TRACKING.csv`
3. Créer branches `fix/bug-XXX`
4. Fixer bugs P0 (8h développement)
5. Valider tests E2E API passent 100%

### Semaine 2 (Important)
1. Fixer bugs P1 (15h développement)
2. Mettre à jour tests E2E
3. Validation QA complète
4. Mettre à jour documentation

### Semaine 3 (Optionnel)
1. Fixer bugs P2-P3 selon priorité business
2. Refactoring si nécessaire
3. Documentation finale

---

## 📞 CONTACTS & SUPPORT

**Questions sur un bug spécifique ?**
→ Consulter section détaillée dans `BUGS_REPORT.md`

**Besoin d'aide pour reproduire ?**
→ Utiliser commandes dans section "Tests à Effectuer"

**Proposer une solution alternative ?**
→ Ajouter notes dans `BUGS_TRACKING.csv` colonne "Notes"

**Reporter un nouveau bug ?**
→ Créer BUG-018 dans CSV + ajouter section dans BUGS_REPORT.md

---

## 📝 NOTES DE MAINTENANCE

### Mise à Jour de la Documentation

**Quand un bug est fixé:**
1. Mettre à jour `BUGS_TRACKING.csv`:
   - Status: Open → Fixed
   - Assigned To: (nom développeur)
   - Fixed Date: YYYY-MM-DD
   - Notes: (référence commit/PR)

2. Mettre à jour `BUGS_REPORT.md`:
   - Déplacer bug de section "Non Fixé" vers "Résolus"
   - Ajouter détails du fix appliqué

3. Mettre à jour `BUGS_QUICK_REFERENCE.md`:
   - Retirer de tableau P0/P1/P2
   - Mettre à jour compteurs

4. Commit avec message:
   ```
   fix: BUG-XXX - Description courte

   - Détails fix
   - Tests validés
   - Closes #issue-number
   ```

### Ajouter un Nouveau Bug

1. Identifier bug (symptômes, logs, reproduction)
2. Ajouter ligne dans `BUGS_TRACKING.csv` (ID suivant)
3. Ajouter section détaillée dans `BUGS_REPORT.md`
4. Mettre à jour compteurs dans `BUGS_QUICK_REFERENCE.md`
5. Commit documentation

---

## 🔍 INDEX RAPIDE

**Chercher par Endpoint:**
- Sessions: BUG-001, BUG-002, BUG-015
- Characters: BUG-005, BUG-006, BUG-007, BUG-012, BUG-014
- Chapters: BUG-003, BUG-010
- Chapter Events: BUG-004
- Effects: BUG-005
- Dice/Rolls: BUG-008
- Sanity: BUG-011
- Notes: BUG-009
- Avatar: BUG-013
- WebSocket: BUG-016
- Tests: BUG-017

**Chercher par User Story:**
- US-MJ01: BUG-001, BUG-002
- US-MJ07: BUG-003, BUG-010
- US-MJ09: BUG-004
- US-MJ12: BUG-005
- US-J01: BUG-006, BUG-007, BUG-012, BUG-013
- US-J04: BUG-014
- US-J15-J20: BUG-008
- US-J23: BUG-011
- US-J32: BUG-014
- US-J36: BUG-009

**Chercher par Type d'Erreur:**
- Database NOT NULL: BUG-001, BUG-003, BUG-004
- Foreign Key: BUG-005, BUG-010
- Validation DTO: BUG-002, BUG-006, BUG-007, BUG-008, BUG-009, BUG-011, BUG-012
- Error Handling: BUG-013
- Business Logic: BUG-014, BUG-015
- Infrastructure: BUG-016
- Tests: BUG-017

---

**Créé par:** Claude Code (Sonnet 4.5)
**Dernière mise à jour:** 2026-01-24 22:10
**Version:** 1.0
**Statut:** Ready for Review
