# Documentation Bugs Game-Plug - Guide d'Utilisation

**Version:** 1.0 | **Date:** 2026-01-24

---

## 🎯 DÉMARRAGE RAPIDE

### Vous êtes développeur et voulez corriger un bug ?

1. **Ouvrir** `BUGS_QUICK_REFERENCE.md` → Section "P0 - BUGS CRITIQUES"
2. **Choisir** un bug non assigné dans `BUGS_TRACKING.csv`
3. **Consulter** `BUGS_REPORT.md` → Section détaillée du bug
4. **Suivre** la solution proposée (code exemple fourni)
5. **Tester** avec les commandes fournies
6. **Marquer** comme "Fixed" dans CSV + mettre à jour documentation

**Exemple:**
```bash
# 1. Lire le bug
cat BUGS_QUICK_REFERENCE.md | grep -A 10 "BUG-001"

# 2. Voir détails
cat BUGS_REPORT.md | grep -A 50 "BUG-001"

# 3. Créer branche
git checkout -b fix/bug-001-session-gmid

# 4. Appliquer fix (voir solution dans rapport)
# ... éditer fichiers ...

# 5. Tester
cd apps/backend && npx tsc --noEmit
npx playwright test e2e/07-api-routes.spec.ts

# 6. Commit
git add .
git commit -m "fix: BUG-001 - Add gmId extraction from JWT token

- Extract gmId from authenticated user in sessions.controller.ts
- Update CreateSessionDto to accept gmId
- All API tests pass (36/36)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Vous êtes Product Owner et voulez prioriser ?

1. **Ouvrir** `BUGS_QUICK_REFERENCE.md` → "Impact User Stories"
2. **Voir** quelles fonctionnalités sont bloquées (⛔) ou dégradées (⚠️)
3. **Consulter** `BUGS_TRACKING.csv` pour estimations temps
4. **Prioriser** selon business impact + temps de fix

**Exemple de décision:**
```
Question: "Peut-on lancer en production demain ?"
Réponse: NON ❌

Raisons:
- 7 user stories BLOQUÉES (9.3%)
- US-MJ01 (Créer session) ne fonctionne pas → MJ ne peut pas créer de parties
- 5 bugs P0 critiques à corriger AVANT déploiement

Action: Fixer bugs P0 (8h estimation) puis re-valider
```

---

### Vous êtes QA et voulez tester ?

1. **Ouvrir** `BUGS_REPORT.md` → Chercher le bug à valider
2. **Section "Symptômes"** → Voir erreur attendue
3. **Section "Tests à Effectuer"** → Utiliser commandes fournies
4. **Vérifier logs backend** avec commandes dans BUGS_QUICK_REFERENCE.md

**Exemple:**
```bash
# Reproduire BUG-001
cd /srv/workspace/game-plug

# Voir logs erreur
docker logs game-plug-backend --tail 200 | grep -i "gm_id"

# Expected:
# ERROR: null value in column "gm_id" violates not-null constraint

# Tester fix (après correction)
npx playwright test e2e/07-api-routes.spec.ts --grep "Create session"

# Expected après fix: ✓ Test passes
```

---

## 📚 STRUCTURE DOCUMENTATION

```
/srv/workspace/game-plug/
├── BUGS_INDEX.md              ← Navigation complète (COMMENCER ICI)
├── BUGS_REPORT.md             ← Rapport détaillé (26KB, 17 bugs)
├── BUGS_QUICK_REFERENCE.md    ← Référence rapide (10KB, visual)
├── BUGS_TRACKING.csv          ← Suivi Excel (19 lignes)
└── BUGS_README.md             ← Ce fichier (guide utilisation)
```

---

## 📖 DESCRIPTION DES FICHIERS

### 1. BUGS_INDEX.md (Navigation)
**Utilisation:** Premier fichier à lire
**Contenu:**
- Structure documentation
- Guide d'utilisation par rôle (Dev/PO/QA)
- Contenu détaillé de chaque fichier
- Documents associés (user stories, tests)
- Métriques consolidées
- Prochaines étapes
- Index rapide (chercher par endpoint/user story/erreur)

**Ouvrir quand:**
- Première fois que vous consultez la documentation bugs
- Besoin de comprendre l'organisation
- Chercher un bug spécifique par endpoint/user story

---

### 2. BUGS_REPORT.md (Rapport Principal)
**Utilisation:** Documentation technique complète
**Contenu:**
- Résumé exécutif (stats)
- 5 bugs critiques P0 (détails complets)
- 8 bugs majeurs P1 (détails complets)
- 4 bugs mineurs P2-P3 (détails complets)
- 2 bugs résolus (archive)
- Recommandations priorisation
- Stratégie validation
- Métriques impact business
- Fichiers analysés
- Références

**Détails par bug:**
- ✅ Status (fixé/non fixé)
- ✅ Priority (P0/P1/P2/P3)
- ✅ User Story bloquée
- ✅ Symptômes (logs erreur)
- ✅ Cause racine (analyse technique)
- ✅ Fichiers concernés (chemins absolus)
- ✅ Solution proposée (code TypeScript)
- ✅ Tests à effectuer (bash commands)
- ✅ Impact user stories

**Ouvrir quand:**
- Besoin de comprendre la cause d'un bug
- Chercher solution technique détaillée
- Analyser impact d'un bug sur le système

---

### 3. BUGS_QUICK_REFERENCE.md (Référence Rapide)
**Utilisation:** Consultation rapide pendant développement
**Contenu:**
- Statut global (diagramme ASCII)
- Bugs P0 (5 fiches courtes)
- Bugs P1 (tableau résumé)
- Bugs P2-P3 (tableau résumé)
- Impact user stories (listes)
- Plan correction (semaines 1-3)
- Commandes utiles (bash)
- Checklist validation
- Fichiers clés (chemins)

**Format:** Markdown optimisé pour impression/écran secondaire

**Ouvrir quand:**
- Besoin d'une vue d'ensemble rapide
- Pendant le développement (référence à côté)
- Impression pour réunion d'équipe

---

### 4. BUGS_TRACKING.csv (Suivi)
**Utilisation:** Gestion projet (Excel/Sheets)
**Colonnes:**
- Bug ID
- Priority
- Status (Open/In Progress/Fixed)
- Endpoint
- Error Type
- User Story
- Impact
- Estimated Fix Time
- Assigned To
- Fixed Date
- Notes

**Ouvrir quand:**
- Assigner bugs aux développeurs
- Suivre progression équipe
- Générer rapports avancement
- Filtrer bugs par status/priorité

**Ouvrir avec:** Excel, LibreOffice Calc, Google Sheets, VS Code

---

### 5. BUGS_README.md (Ce fichier)
**Utilisation:** Guide d'utilisation documentation
**Contenu:**
- Démarrage rapide par rôle
- Description fichiers
- Workflows typiques
- Exemples d'utilisation
- FAQ

---

## 🔄 WORKFLOWS TYPIQUES

### Workflow 1: Corriger un Bug P0

```
1. Lire BUGS_QUICK_REFERENCE.md → Section P0
2. Choisir bug dans BUGS_TRACKING.csv (Status=Open)
3. Marquer Status="In Progress" + Assigned To={votre nom}
4. Lire BUGS_REPORT.md → Section détaillée du bug
5. Créer branche git: fix/bug-XXX-{description}
6. Appliquer solution proposée (code exemple fourni)
7. Tester:
   - TypeScript compile (npx tsc --noEmit)
   - Tests E2E passent (npx playwright test)
   - Logs backend sans ERROR
8. Commit avec message standardisé (voir exemple ci-dessus)
9. Mettre à jour BUGS_TRACKING.csv:
   - Status="Fixed"
   - Fixed Date={today}
   - Notes="Commit {hash}"
10. Mettre à jour BUGS_REPORT.md (déplacer vers "Résolus")
```

**Temps estimé:** 2-4h par bug P0

---

### Workflow 2: Prioriser Sprint

```
1. Ouvrir BUGS_QUICK_REFERENCE.md
2. Section "Impact User Stories" → Voir bloquées/dégradées
3. Ouvrir BUGS_TRACKING.csv
4. Filtrer Priority=P0 AND Status=Open
5. Calculer total "Estimated Fix Time"
6. Décider:
   - Si total < capacité sprint → Inclure tous P0
   - Si total > capacité → Prioriser par Impact business
7. Assigner bugs dans CSV colonne "Assigned To"
8. Partager CSV avec équipe
```

---

### Workflow 3: Valider Fix (QA)

```
1. Récupérer bug ID depuis commit/PR
2. Lire BUGS_REPORT.md → Section du bug
3. Vérifier "Symptômes" (logs avant fix)
4. Exécuter "Tests à Effectuer" (commandes fournies)
5. Vérifier:
   ✓ Erreur disparue des logs
   ✓ Tests E2E passent
   ✓ Cas nominal fonctionne
   ✓ Cas edge cases fonctionnent
6. Si OK:
   - Valider PR
   - Vérifier CSV Status=Fixed
7. Si KO:
   - Rouvrir bug (Status=Open)
   - Ajouter notes dans CSV
   - Créer issue GitHub
```

---

### Workflow 4: Reporter Nouveau Bug

```
1. Reproduire bug localement
2. Capturer logs erreur (docker logs game-plug-backend)
3. Identifier endpoint/fichier concerné
4. Créer nouvelle ligne dans BUGS_TRACKING.csv:
   - Bug ID: BUG-018 (suivant)
   - Priority: P0/P1/P2 selon impact
   - Status: Open
   - Remplir toutes colonnes
5. Ajouter section dans BUGS_REPORT.md:
   - Copier template bug existant
   - Remplir symptômes, cause, solution
6. Mettre à jour compteurs BUGS_QUICK_REFERENCE.md
7. Commit documentation:
   git add BUGS_*.md BUGS_*.csv
   git commit -m "docs: Add BUG-018 - {description}"
```

---

## 📊 STATISTIQUES ACTUELLES

```
┌─────────────────────────────────────────┐
│  BUGS PAR PRIORITÉ                      │
├─────────────────────────────────────────┤
│  ⛔ P0 - CRITIQUES:      5 bugs (8h)    │
│  ⚠️  P1 - MAJEURS:       8 bugs (15h)   │
│  🐛 P2-P3 - MINEURS:    4 bugs (8h)    │
│  ✅ RÉSOLUS:            2 bugs (5h)    │
├─────────────────────────────────────────┤
│  TOTAL:                17 bugs (36h)    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  IMPACT USER STORIES                    │
├─────────────────────────────────────────┤
│  ⛔ BLOQUÉES:           7 (9.3%)        │
│  ⚠️  DÉGRADÉES:        14 (18.7%)       │
│  ✅ FONCTIONNELLES:    54 (72.0%)       │
├─────────────────────────────────────────┤
│  TOTAL:               75 user stories   │
└─────────────────────────────────────────┘
```

---

## ❓ FAQ

### Q1: Combien de temps pour corriger tous les bugs ?
**R:** 31 heures développement + 10 heures tests = **~5 jours** (1 sprint)

### Q2: Peut-on déployer en production maintenant ?
**R:** ❌ NON - 5 bugs P0 bloquent user stories critiques (création session MJ)

### Q3: Quel est le bug le plus urgent ?
**R:** BUG-001 (Session gmId) - Bloque US-MJ01 (créer session) = fonctionnalité core

### Q4: Les bugs sont-ils tous backend ?
**R:** Principalement backend (DTOs validation, database constraints). 2 bugs frontend (BUG-012 forms, BUG-017 tests).

### Q5: Combien de tests E2E sont cassés ?
**R:** 7 endpoints sur 36 échouent (81% succès) - Tests dans `e2e/07-api-routes.spec.ts`

### Q6: Y a-t-il des bugs de sécurité ?
**R:** Non. Ce sont des bugs fonctionnels (validation, database). Authentification JWT fonctionne.

### Q7: Comment suivre la progression ?
**R:** Ouvrir `BUGS_TRACKING.csv` dans Excel/Sheets → Filtrer Status="Fixed" → Calculer %

### Q8: Qui a créé cette documentation ?
**R:** Claude Code (Sonnet 4.5) le 2026-01-24 après analyse de:
- Logs backend (500 lignes)
- Tests E2E (36 endpoints)
- User Stories (75 stories)
- Rapports existants (5 fichiers)

---

## 🔗 RESSOURCES EXTERNES

### Documentation Projet
- **Architecture:** `ARCHITECTURE.md`
- **User Stories Joueur:** `USER_STORIES_JOUEUR.md`
- **User Stories MJ:** `USER_STORIES_MJ.md`
- **Mapping Endpoints:** `FEATURE_ENDPOINT_MAPPING.md`
- **Tests E2E:** `E2E_TESTS_SUMMARY.md`

### Fixes Appliqués
- **Fix Chapitre:** `BUG_FIX_CHAPTER_CREATION.md` ✅
- **Validation Tests:** `VALIDATION_TEST.md`

### Guides Développeur
- **Quick Start:** `DEVELOPER_QUICK_START.md`
- **Règles Dev:** `CLAUDE.md`
- **Contributing:** `CONTRIBUTING.md`

---

## 📞 SUPPORT

**Questions sur un bug spécifique ?**
→ Consulter `BUGS_REPORT.md` section du bug

**Besoin d'aide pour reproduire ?**
→ Utiliser commandes dans "Tests à Effectuer"

**Proposer solution alternative ?**
→ Ajouter dans `BUGS_TRACKING.csv` colonne "Notes"

**Reporter nouveau bug ?**
→ Suivre "Workflow 4: Reporter Nouveau Bug" ci-dessus

---

**Créé par:** Claude Code (Sonnet 4.5)
**Date:** 2026-01-24 22:15
**Version:** 1.0
**Licence:** Interne Game-Plug
