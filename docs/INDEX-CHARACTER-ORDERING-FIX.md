# Index : Documentation Correction Ordre des Personnages

## Vue d'Ensemble

Cette collection de documents détaille la correction d'un bug critique où les cartes de personnages se réorganisaient lors de la modification des stats (PV/SAN/PM/Argent).

**Date de correction :** 2026-01-25
**Impact :** Critique UX
**Status :** ✅ Déployé et testé

---

## Documents Disponibles

### 1. Pour les Utilisateurs / Product Managers

#### [CHANGELOG-CHARACTER-ORDERING-FIX.md](../CHANGELOG-CHARACTER-ORDERING-FIX.md)
**Résumé exécutif du fix**
- Métriques de performance avant/après
- Impact utilisateur
- Plan de tests
- Compatibilité

**Public :** PM, QA, Stakeholders

**Durée de lecture :** 5 minutes

---

### 2. Pour les Développeurs

#### [BUGFIX-CHARACTER-REORDERING.md](../BUGFIX-CHARACTER-REORDERING.md)
**Analyse technique complète du problème**
- Diagnostic de la cause racine
- Solutions implémentées (mutations optimistes + tri stable)
- Fichiers modifiés
- Validation TypeScript

**Public :** Développeurs frontend/backend

**Durée de lecture :** 10 minutes

#### [DEV-GUIDE-OPTIMISTIC-UPDATES.md](./DEV-GUIDE-OPTIMISTIC-UPDATES.md)
**Guide complet pour implémenter des mutations optimistes**
- Patterns recommandés
- Exemples de code (10+ cas d'usage)
- Anti-patterns à éviter
- Checklist d'utilisation

**Public :** Développeurs React/React Query

**Durée de lecture :** 20 minutes

**Réutilisable :** Oui, pour tout projet React Query

#### [TECHNICAL-NOTES-CHARACTER-ORDERING.md](./TECHNICAL-NOTES-CHARACTER-ORDERING.md)
**Architecture technique de la solution**
- Flux de données détaillé
- Optimisations de performance
- Mémoïsation React
- Extensions futures possibles

**Public :** Lead dev, architectes

**Durée de lecture :** 15 minutes

---

### 3. Pour les QA / Testeurs

#### [TEST-CHARACTER-ORDERING.md](../TEST-CHARACTER-ORDERING.md)
**Plan de test complet avec 12 scénarios**
- Tests unitaires (modifications PV/SAN/PM/Argent)
- Tests d'intégration (GameBoard sync, WebSocket)
- Tests de performance
- Bugs potentiels à surveiller

**Public :** QA, testeurs

**Durée de lecture :** 15 minutes

**Format :** Checklist exécutable

---

### 4. Pour les Visuels / Onboarding

#### [VISUAL-GUIDE-CHARACTER-ORDERING.md](./VISUAL-GUIDE-CHARACTER-ORDERING.md)
**Guide visuel avec schémas ASCII**
- Schéma du problème (avant/après)
- Comparaison des flux de données
- Timeline détaillée
- Diagrammes de tri stable

**Public :** Tous (accessible)

**Durée de lecture :** 10 minutes

**Format :** Visuel (schémas + comparaisons)

---

## Arbre de Documentation

```
game-plug/
├── BUGFIX-CHARACTER-REORDERING.md              ← Analyse technique
├── CHANGELOG-CHARACTER-ORDERING-FIX.md         ← Résumé exécutif
├── TEST-CHARACTER-ORDERING.md                  ← Plan de test
│
└── docs/
    ├── INDEX-CHARACTER-ORDERING-FIX.md         ← Ce fichier
    ├── DEV-GUIDE-OPTIMISTIC-UPDATES.md         ← Guide dev (réutilisable)
    ├── TECHNICAL-NOTES-CHARACTER-ORDERING.md   ← Architecture technique
    └── VISUAL-GUIDE-CHARACTER-ORDERING.md      ← Schémas visuels
```

---

## Par Rôle : Quels Documents Lire ?

### Product Manager / Stakeholder
1. [CHANGELOG-CHARACTER-ORDERING-FIX.md](../CHANGELOG-CHARACTER-ORDERING-FIX.md) ⭐ Priorité
2. [VISUAL-GUIDE-CHARACTER-ORDERING.md](./VISUAL-GUIDE-CHARACTER-ORDERING.md) (pour comprendre visuellement)

**Temps total :** 15 minutes

---

### Développeur Frontend (Nouveau sur le Projet)
1. [VISUAL-GUIDE-CHARACTER-ORDERING.md](./VISUAL-GUIDE-CHARACTER-ORDERING.md) (pour comprendre le contexte)
2. [BUGFIX-CHARACTER-REORDERING.md](../BUGFIX-CHARACTER-REORDERING.md) ⭐ Priorité
3. [DEV-GUIDE-OPTIMISTIC-UPDATES.md](./DEV-GUIDE-OPTIMISTIC-UPDATES.md) (guide réutilisable)

**Temps total :** 45 minutes

---

### Développeur Frontend (Expérimenté React Query)
1. [BUGFIX-CHARACTER-REORDERING.md](../BUGFIX-CHARACTER-REORDERING.md) ⭐ Priorité
2. [TECHNICAL-NOTES-CHARACTER-ORDERING.md](./TECHNICAL-NOTES-CHARACTER-ORDERING.md)

**Temps total :** 25 minutes

---

### Lead Developer / Architecte
1. [TECHNICAL-NOTES-CHARACTER-ORDERING.md](./TECHNICAL-NOTES-CHARACTER-ORDERING.md) ⭐ Priorité
2. [BUGFIX-CHARACTER-REORDERING.md](../BUGFIX-CHARACTER-REORDERING.md)
3. [DEV-GUIDE-OPTIMISTIC-UPDATES.md](./DEV-GUIDE-OPTIMISTIC-UPDATES.md) (pour standardiser)

**Temps total :** 50 minutes

---

### QA / Testeur
1. [TEST-CHARACTER-ORDERING.md](../TEST-CHARACTER-ORDERING.md) ⭐ Priorité
2. [VISUAL-GUIDE-CHARACTER-ORDERING.md](./VISUAL-GUIDE-CHARACTER-ORDERING.md) (pour comprendre attendu)
3. [CHANGELOG-CHARACTER-ORDERING-FIX.md](../CHANGELOG-CHARACTER-ORDERING-FIX.md) (métriques)

**Temps total :** 30 minutes

---

### Designer / UX
1. [VISUAL-GUIDE-CHARACTER-ORDERING.md](./VISUAL-GUIDE-CHARACTER-ORDERING.md) ⭐ Priorité
2. [CHANGELOG-CHARACTER-ORDERING-FIX.md](../CHANGELOG-CHARACTER-ORDERING-FIX.md) (impact utilisateur)

**Temps total :** 15 minutes

---

## Parcours Recommandés

### Parcours 1 : Comprendre le Problème (15 min)
```
VISUAL-GUIDE → Section "Schéma du Problème"
       ↓
CHANGELOG → Section "Métriques de Performance"
       ↓
Compris ! ✅
```

### Parcours 2 : Implémenter un Fix Similaire (30 min)
```
DEV-GUIDE → Lire "Pattern Recommandé"
       ↓
DEV-GUIDE → Copier exemple "Incrémenter/Décrémenter"
       ↓
BUGFIX → Voir les fichiers modifiés dans game-plug
       ↓
Implémenter ! ✅
```

### Parcours 3 : Tester la Correction (20 min)
```
TEST-CHARACTER-ORDERING → Scénarios 1-8
       ↓
Exécuter les tests manuellement
       ↓
Cocher la checklist
       ↓
Validé ! ✅
```

### Parcours 4 : Review Code (25 min)
```
BUGFIX → Lire "Analyse de la Cause Racine"
       ↓
TECHNICAL-NOTES → Lire "Architecture de la Solution"
       ↓
Voir le code dans :
  - apps/frontend/app/(dashboard)/sessions/[sessionId]/page.tsx
  - apps/frontend/app/(dashboard)/sessions/[sessionId]/gameboard/page.tsx
       ↓
Review complet ! ✅
```

---

## Mots-Clés pour Recherche

| Mot-clé | Documents Pertinents |
|---------|---------------------|
| **Mutations optimistes** | DEV-GUIDE, TECHNICAL-NOTES |
| **React Query** | DEV-GUIDE, BUGFIX |
| **setQueryData** | DEV-GUIDE (exemples), TECHNICAL-NOTES |
| **Tri stable** | BUGFIX, TECHNICAL-NOTES, VISUAL-GUIDE |
| **Performance** | CHANGELOG, TECHNICAL-NOTES, VISUAL-GUIDE |
| **Tests** | TEST-CHARACTER-ORDERING |
| **UX** | CHANGELOG, VISUAL-GUIDE |
| **Ordre des éléments** | Tous |
| **invalidateQueries** | DEV-GUIDE (anti-patterns), BUGFIX |
| **Réorganisation** | VISUAL-GUIDE, BUGFIX, CHANGELOG |

---

## FAQs

### Q1 : Pourquoi ne pas juste trier par `createdAt` côté backend ?
**R :** Le tri `createdAt` est correct et utile pour l'historique. Le problème est le timing réseau asynchrone côté frontend qui peut altérer l'ordre lors des re-fetch. Voir [BUGFIX § Analyse de la Cause Racine](../BUGFIX-CHARACTER-REORDERING.md#analyse-de-la-cause-racine).

### Q2 : Les mutations optimistes sont-elles toujours la meilleure solution ?
**R :** Non. Voir [DEV-GUIDE § Checklist](./DEV-GUIDE-OPTIMISTIC-UPDATES.md#checklist--quand-utiliser-optimistic-updates) pour les cas où l'invalidation est préférable.

### Q3 : Comment tester que l'ordre est stable ?
**R :** Suivre les 12 scénarios de [TEST-CHARACTER-ORDERING.md](../TEST-CHARACTER-ORDERING.md), notamment les tests 1-6 (modifications de stats).

### Q4 : Y a-t-il un impact sur les performances backend ?
**R :** Non. Le backend est inchangé. Le gain de performance est côté frontend (suppression des re-fetch inutiles).

### Q5 : Peut-on personnaliser l'ordre des personnages ?
**R :** Actuellement non (tri fixe par ID). Voir [TECHNICAL-NOTES § Extension Future](./TECHNICAL-NOTES-CHARACTER-ORDERING.md#extension-future) pour les options possibles.

---

## Références Externes

### React Query
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [setQueryData API](https://tanstack.com/query/latest/docs/react/reference/QueryClient#queryclientsetquerydata)
- [TkDodo Blog - Optimistic Updates in React Query](https://tkdodo.eu/blog/optimistic-updates-in-react-query)

### React
- [React memo()](https://react.dev/reference/react/memo)
- [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

---

## Changelog de l'Index

| Date | Version | Changements |
|------|---------|------------|
| 2026-01-25 | 1.0 | Création initiale de l'index |

---

## Contributions

Pour toute question ou amélioration de cette documentation :

- **Technique :** Ouvrir une issue sur le repo
- **Contenu :** Proposer une PR avec modifications
- **Bugs doc :** Contacter l'équipe Robinswood AI

---

**Auteur :** Équipe Robinswood AI
**Date de création :** 2026-01-25
**Dernière mise à jour :** 2026-01-25
