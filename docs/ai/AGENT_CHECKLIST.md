# Agent Workflow Checklist

Ce document sert de **workflow contract** pour tous les agents travaillant sur ce projet. Il définit les étapes obligatoires et les garde-fous à respecter.

---

## 📋 Utilisation

1. **Obligatoire** : Créé automatiquement au bootstrap de chaque repo
2. **Cockpit** : Affiché dans le cockpit avec cases à cocher
3. **Gate** : L'agent ne peut pas passer à une nouvelle feature tant que les gates ne sont pas validés

---

## 🚀 Phase 1 : Analyse & Compréhension

### 1.1 Exploration du Contexte
- [ ] Lire la structure du projet (architecture, dossiers principaux)
- [ ] Identifier les technologies utilisées (stack, frameworks, outils)
- [ ] Comprendre les conventions de code existantes
- [ ] Vérifier l'existence de documentation technique

### 1.2 Analyse de la Demande
- [ ] Clarifier les objectifs avec l'utilisateur si ambiguïté
- [ ] Identifier les fichiers/modules impactés
- [ ] Évaluer la complexité de la tâche
- [ ] Détecter les dépendances avec d'autres composants

### 1.3 État Initial
- [ ] Vérifier l'état TypeScript (`npm run check`)
- [ ] Vérifier l'état ESLint (`npm run lint`)
- [ ] Documenter le nombre d'erreurs initial
- [ ] Identifier les tests existants à maintenir

**🚪 GATE 1** : Ne pas passer à la phase suivante sans avoir complété 1.1, 1.2 et 1.3

---

## 🔨 Phase 2 : Planification & Design

### 2.1 Plan d'Action
- [ ] Créer une todo list avec `TodoWrite` (si tâche > 3 étapes)
- [ ] Décomposer en sous-tâches atomiques
- [ ] Identifier les points de risque
- [ ] Définir l'ordre d'exécution optimal

### 2.2 Design Technique
- [ ] Choisir l'approche technique appropriée
- [ ] Identifier les patterns de code existants à suivre
- [ ] Planifier les modifications de types/interfaces
- [ ] Anticiper les impacts sur les tests

### 2.3 Validation Utilisateur
- [ ] Utiliser `AskUserQuestion` si plusieurs approches possibles
- [ ] Obtenir confirmation pour changements architecturaux
- [ ] Clarifier les exigences de performance/sécurité
- [ ] Valider le scope avant d'implémenter

**🚪 GATE 2** : Ne pas implémenter sans plan validé et todo list créée

---

## 💻 Phase 3 : Implémentation

### 3.1 Lecture Avant Écriture
- [ ] **TOUJOURS** lire le fichier avec `Read` avant de modifier
- [ ] Comprendre le code existant et son contexte
- [ ] Identifier les dépendances internes
- [ ] Noter les patterns à respecter

### 3.2 Modifications Incrémentales
- [ ] Faire des changements atomiques et testables
- [ ] Marquer les todos comme `in_progress` puis `completed`
- [ ] Utiliser `Edit` pour modifications ciblées
- [ ] Éviter les changements non demandés (no over-engineering)

### 3.3 Qualité du Code
- [ ] Respecter les conventions du projet
- [ ] Ajouter les types TypeScript appropriés
- [ ] Gérer les cas d'erreur (null checks, try/catch)
- [ ] Commenter uniquement le code non-évident

### 3.4 Sécurité
- [ ] Vérifier les injections (SQL, XSS, Command)
- [ ] Valider les inputs utilisateur
- [ ] Ne pas exposer de secrets/credentials
- [ ] Respecter les principes du moindre privilège

**🚪 GATE 3** : Chaque modification doit être précédée d'une lecture du fichier

---

## ✅ Phase 4 : Vérification & Tests

### 4.1 Vérifications Automatiques
- [ ] Exécuter `npm run check` (0 erreurs TypeScript)
- [ ] Exécuter `npm run lint` (conformité ESLint)
- [ ] Exécuter `npm run build` (compilation réussie)
- [ ] Vérifier que tous les tests passent

### 4.2 Revue de Code
- [ ] Relire les changements effectués
- [ ] Vérifier qu'aucun fichier non pertinent n'a été modifié
- [ ] S'assurer que les todos sont tous `completed`
- [ ] Valider que le scope initial est respecté

### 4.3 Tests Manuels
- [ ] Tester les fonctionnalités modifiées
- [ ] Vérifier les cas limites (edge cases)
- [ ] Tester les cas d'erreur
- [ ] Valider l'UX si changements UI

**🚪 GATE 4** : Ne pas marquer la tâche comme terminée avec des erreurs TypeScript/ESLint

---

## 📝 Phase 5 : Documentation & Finalisation

### 5.1 Documentation Code
- [ ] Ajouter JSDoc pour fonctions publiques si nécessaire
- [ ] Documenter les choix techniques non-évidents
- [ ] Mettre à jour les types exportés
- [ ] Ajouter des exemples d'utilisation si API publique

### 5.2 Documentation Projet
- [ ] Mettre à jour README si changements architecturaux
- [ ] Documenter les nouveaux scripts npm
- [ ] Ajouter migration guide si breaking changes
- [ ] Créer/mettre à jour les diagrammes si nécessaire

### 5.3 Rapport Final
- [ ] Résumer les changements effectués
- [ ] Lister les fichiers modifiés
- [ ] Documenter les décisions techniques prises
- [ ] Fournir les commandes de test au besoin

### 5.4 Nettoyage
- [ ] Supprimer les console.log de debug
- [ ] Retirer les commentaires TODO/FIXME résolus
- [ ] Nettoyer les imports inutilisés
- [ ] Vérifier qu'aucun fichier temporaire ne reste

**🚪 GATE 5** : La tâche n'est complète que si documentée et nettoyée

---

## 🔴 Règles Critiques - TOUJOURS Respecter

### ❌ Interdictions Absolues

1. **Ne JAMAIS modifier un fichier sans l'avoir lu d'abord**
2. **Ne JAMAIS utiliser `@ts-ignore` ou `@ts-expect-error` sans justification**
3. **Ne JAMAIS commit des secrets/credentials**
4. **Ne JAMAIS désactiver ESLint pour masquer des erreurs**
5. **Ne JAMAIS over-engineer** (rester simple et focalisé)
6. **Ne JAMAIS créer de fichiers non nécessaires**
7. **Ne JAMAIS utiliser `any` sans raison valable**
8. **Ne JAMAIS skip les tests existants**

### ✅ Obligations Absolues

1. **TOUJOURS utiliser TodoWrite** pour tâches > 3 étapes
2. **TOUJOURS lire avant d'écrire** avec `Read`
3. **TOUJOURS vérifier TypeScript** (`npm run check`)
4. **TOUJOURS vérifier ESLint** (`npm run lint`)
5. **TOUJOURS tester les modifications**
6. **TOUJOURS documenter les choix complexes**
7. **TOUJOURS respecter les conventions du projet**
8. **TOUJOURS finaliser les todos** (marquer `completed`)

---

## 🎯 Workflow Optimal

```
1. Lire la demande utilisateur
2. Explorer le contexte du projet
3. ✅ GATE 1: Contexte compris
4. Créer todo list si nécessaire
5. Planifier l'approche technique
6. ✅ GATE 2: Plan validé
7. Lire les fichiers à modifier
8. Implémenter les changements
9. ✅ GATE 3: Lecture avant chaque écriture
10. Vérifier TypeScript + ESLint
11. Tester les modifications
12. ✅ GATE 4: 0 erreurs
13. Documenter et nettoyer
14. ✅ GATE 5: Tâche complète
15. Fournir rapport final à l'utilisateur
```

---

## 🚦 Signaux d'Alerte

Si vous rencontrez ces situations, **STOP et demandez clarification** :

- 🔴 Plus de 50 erreurs TypeScript après modifications
- 🔴 Changement architectural majeur non prévu
- 🔴 Suppression de tests existants nécessaire
- 🔴 Breaking changes sur API publique
- 🔴 Modifications dans > 20 fichiers pour une seule feature
- 🔴 Utilisation d'une nouvelle dépendance externe
- 🔴 Changements de configuration de build/déploiement
- 🔴 Modifications de schéma de base de données

---

## 📊 Métriques de Qualité

### Targets à Respecter

- **TypeScript**: 0 erreurs (strict)
- **ESLint**: 0 erreurs (warnings acceptables si justifiés)
- **Couverture de tests**: Ne pas diminuer
- **Complexité cyclomatique**: ≤ 20 par fonction
- **Profondeur max**: ≤ 4 niveaux d'imbrication
- **Lignes par fonction**: ≤ 150 (skipBlankLines: true)
- **Paramètres par fonction**: ≤ 6

### Indicateurs de Santé

- ✓ **Excellent**: 0 erreurs TS, 0 erreurs ESLint, tous tests passent
- ⚠ **Acceptable**: 0 erreurs TS, quelques warnings ESLint justifiés
- **Inacceptable**: Erreurs TS présentes ou erreurs ESLint critiques

---

## 🔄 Processus de Révision

Si le travail n'est pas à la hauteur:

1. **Auto-révision**: Relire cette checklist point par point
2. **Correction**: Appliquer les corrections nécessaires
3. **Re-vérification**: Exécuter tous les checks
4. **Validation**: Confirmer que tous les gates sont passés
5. **Rapport**: Documenter les corrections apportées

---

## 📚 Ressources Complémentaires

- Configuration TypeScript: `tsconfig.json`
- Configuration ESLint: `eslint.config.js`
- Git Hooks: `.husky/pre-commit`
- CI/CD: `.gitea/workflows/ci-quality.yml`
- Documentation: `QUALITY_TOOLING_IMPLEMENTATION.md`

---

## 🤝 Contrat d'Agent

En suivant cette checklist, je m'engage à:

1. ✓ Respecter toutes les phases et gates
2. ✓ Ne jamais skip une vérification critique
3. ✓ Demander clarification en cas de doute
4. ✓ Produire du code de qualité production
5. ✓ Documenter mes décisions techniques
6. ✓ Maintenir la qualité du projet
7. ✓ Respecter les contraintes de temps et scope
8. ✓ Communiquer clairement avec l'utilisateur

**Date de dernière mise à jour**: 12 décembre 2025
**Version**: 1.0.0
**Statut**: Actif

---

**Note**: Cette checklist est un document vivant. Elle peut être mise à jour en fonction de l'évolution du projet et des retours d'expérience.
