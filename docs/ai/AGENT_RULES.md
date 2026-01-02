# Agent Rules - Technical Reference

> **Référence Technique Officielle - Instructions Strictes pour IA**
>
> Ce document définit les règles strictes et non négociables que toutes les IA doivent respecter pour générer, modifier ou maintenir ce projet. **Aucun écart n'est autorisé.**

---

## 1. Principes Généraux

### 1.1 Autonomie et Open Source
- ✓ **Projet totalement autonome** et auto-hébergé
- ✓ **Tous les outils doivent être open-source**
- ✗ **Aucun SaaS propriétaire** n'est autorisé
- ✓ **Données en France**, aucun transit par services externes
- ✓ **Code propre, lisible, structuré, cohérent et typé**
- ✗ **Aucune dépendance inutile**
- ✓ **Compatibilité long-terme prioritaire**
- ✓ **Les conventions de ce document prévalent toujours**

### 1.2 Qualité du Code
- **TypeScript ultra strict** (pas d'`any` sans raison valable)
- **ESLint + Prettier** configurés et respectés
- **Tests** obligatoires (unitaires + e2e)
- **Documentation** à jour automatiquement
- **Sécurité** par défaut (OWASP, rate-limit, CORS strict)

---

## 2. Structure Standard du Projet

```
project-name/
├── server/          # API Express
├── client/          # React + Vite
├── shared/          # Code partagé
├── docs/            # Documentation technique
│   └── ai/          # Documentation pour agents IA
├── .husky/          # Git hooks
├── .gitea/          # CI/CD workflows
│   └── workflows/
└── README.md
```

### 2.1 Dossiers Obligatoires
- `server/` : API Express avec architecture modulaire
- `client/` : Application React + TypeScript + Vite
- `shared/` : Code partagé entre server et client
- `docs/` : Documentation technique générée par l'IA
- `docs/ai/` : Documentation workflow agents

---

## 3. Backend – Règles Obligatoires

### 3.1 Stack Imposée
- **Framework** : Express
- **Langage** : TypeScript (strict mode)
- **Base de données** : PostgreSQL
- **Cache/Queue** : Redis (optionnel)

### 3.2 Architecture
- ✓ **Architecture modulaire** (un module = un dossier)
- ✓ **DTO + Validation** systématique
- ✓ **Middleware** pour cross-cutting concerns
- ✓ **Error handling** cohérent

### 3.3 Sécurité Backend
- ✓ **CORS strict** configuré
- ✓ **Headers OWASP** via reverse proxy
- ✗ **Aucune route publique** non documentée
- ✗ **Aucun secret** dans le code
- ✓ **Rate-limit** sur toutes les routes
- ✓ **Validation** de tous les inputs
- ✓ **Logs d'audit** pour actions critiques

### 3.4 Tests Backend
- ✓ **Tests unitaires** via Vitest ou Jest
- ✓ **Tests e2e** si applicable
- ✓ **Un test minimum** par module

---

## 4. Frontend – Règles Obligatoires

### 4.1 Stack Imposée
- **Framework** : React 18+
- **Langage** : TypeScript (strict)
- **Build** : Vite
- **UI** : Radix UI + Tailwind CSS
- **State** : TanStack Query (React Query)
- **Router** : Wouter

### 4.2 Conventions Strictes
- ✓ **Composants fonctionnels uniquement**
- ✓ **Hooks exclusifs** (pas de classes)
- ✗ **Pas de librairies lourdes** non nécessaires
- ✓ **Client API typé**

### 4.3 Structure Frontend
```
client/
├── src/
│   ├── components/    # Composants réutilisables
│   ├── pages/         # Pages/écrans
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilitaires
│   ├── api/           # Client API
│   └── App.tsx
```

### 4.4 Tests Frontend
- ✓ **React Testing Library** pour composants
- ✓ **Tests sur formulaires clés**

---

## 5. CI/CD – Règles Obligatoires

### 5.1 Plateforme
- **Git** : Gitea (self-hosted)
- **CI/CD** : Gitea Actions ou Woodpecker CI

### 5.2 Pipeline Minimal
```yaml
1. Installation (npm ci)
2. Lint (eslint + prettier)
3. Tests (unitaires)
4. Build (backend + frontend)
5. Build Docker (si applicable)
```

### 5.3 Sécurité CI/CD
- ✓ **Secrets chiffrés** via SOPS + AGE
- ✗ **Aucun secret dans les logs**
- ✓ **Blocage** sur erreurs TypeScript/ESLint
- ✓ **Tests obligatoires** avant merge

---

## 6. Tests et Qualité

### 6.1 Obligations Minimales
- ✓ **Un test unitaire** par module backend
- ✓ **Tests e2e** sur parcours métier critiques
- ✓ **Tests RTL** pour formulaires clés
- ✓ **Couverture de tests** ne doit pas diminuer

### 6.2 Métriques de Qualité
- **TypeScript** : 0 erreurs (strict)
- **ESLint** : 0 erreurs critiques
- **Complexité cyclomatique** : ≤ 20
- **Profondeur max** : ≤ 4 niveaux
- **Lignes par fonction** : ≤ 150
- **Paramètres par fonction** : ≤ 6

---

## 7. Sécurité – Règles Strictes

### 7.1 L'IA Doit Toujours
- ✓ Appliquer un **rate-limit strict**
- ✓ Verrouiller **CORS**
- ✓ Créer les **Guards nécessaires**
- ✓ Générer des **logs d'audit**
- ✓ Sécuriser **toutes les routes** par défaut
- ✗ Interdire **toute dépendance non open-source**

### 7.2 Checklist Sécurité
- [ ] Rate-limit configuré
- [ ] CORS strict
- [ ] Guards auth/roles en place
- [ ] Validation inputs
- [ ] Logs d'audit
- [ ] Headers OWASP
- [ ] Secrets chiffrés
- [ ] Aucune injection possible (SQL, XSS, Command)

---

## 8. Résumé Strict pour IA

### À Chaque Opération, l'IA Doit

1. ✓ **Suivre strictement la stack imposée**
2. ✓ **Mettre à jour la documentation** à chaque changement
3. ✗ **Ne jamais introduire** secret/identifiant non chiffré
4. ✓ **Privilégier la simplicité fonctionnelle**
5. ✓ **Respecter l'architecture modulaire**
6. ✓ **Vérifier cohérence long-terme** avant d'écrire du code
7. ✓ **Utiliser TodoWrite** pour tâches > 3 étapes
8. ✓ **Lire avant d'écrire** avec Read tool
9. ✓ **Vérifier TypeScript + ESLint** systématiquement
10. ✓ **Respecter les 5 phases** (AGENT_CHECKLIST.md)

---

## 9. Interdictions Absolues

### ✗ Ne JAMAIS

1. Modifier un fichier sans l'avoir lu d'abord
2. Utiliser `@ts-ignore`/`@ts-expect-error` sans justification
3. Commit des secrets/credentials
4. Désactiver ESLint pour masquer des erreurs
5. Over-engineer (rester simple et focalisé)
6. Créer des fichiers non nécessaires
7. Utiliser `any` sans raison valable
8. Skip des tests existants
9. Utiliser des SaaS propriétaires
10. Exposer des données sensibles

---

## 10. Obligations Absolues

### ✓ TOUJOURS

1. Utiliser TodoWrite pour tâches > 3 étapes
2. Lire avant d'écrire avec Read
3. Vérifier TypeScript (`npm run check`)
4. Vérifier ESLint (`npm run lint`)
5. Tester les modifications
6. Documenter les choix complexes
7. Respecter les conventions du projet
8. Finaliser les todos (marquer `completed`)
9. Suivre les 5 phases de AGENT_CHECKLIST.md
10. Mettre à jour AGENT_STATUS.yaml

---

## 11. Workflow Contract

Ce document constitue un **contrat technique** entre les développeurs et les agents IA.

**En suivant ces règles, l'agent s'engage à** :
- ✓ Produire du code de qualité production
- ✓ Respecter les standards de sécurité
- ✓ Maintenir la cohérence architecturale
- ✓ Documenter ses décisions
- ✓ Ne jamais compromettre la stabilité

**Sanction en cas de non-respect** :
- ⚠ Rejet du code produit
- ⚠ Rollback des modifications
- ⚠ Révision manuelle obligatoire

---

**Version** : 1.0.0
**Date** : 12 décembre 2025
**Statut** : Actif et obligatoire
**Révision** : Trimestrielle ou sur demande

---

**Note** : Ce document prévaut sur toute suggestion alternative. En cas de doute, demander clarification avant d'agir.
