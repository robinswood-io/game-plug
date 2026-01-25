# Guide de Test - Interface de Sélection des Personnages

## Checklist de Validation

### Interface Visuelle

- [ ] **Hauteur de la zone :** La ScrollArea affiche maintenant 6-8 personnages sans scrolling
- [ ] **Layout grille :** Les personnages sont arrangés en 2 colonnes
- [ ] **Avatars :** Chaque avatar est visible et centré (12×12px)
- [ ] **Noms :** Les noms des personnages sont affichés et tronqués si trop longs
- [ ] **Stats :** Sanité et Points de Vie s'affichent avec icônes colorées

### Sélection et Interaction

- [ ] **Clic sur personnage :** Sélectionne/désélectionne le personnage
- [ ] **Checkmark :** Apparaît en haut-à-droite de l'avatar quand sélectionné
- [ ] **Feedback couleur :** Fond change pour indiquer la sélection
- [ ] **Bouton "Tous":** Sélectionne tous les personnages
- [ ] **Bouton "Aucun":** Désélectionne tous les personnages (désactivé si aucun sélectionné)

### Compteur et Infos

- [ ] **Compteur :** Affiche "Personnages cibles (X/Y)" correctement
- [ ] **Mise à jour :** Le compteur change quand on sélectionne/désélectionne
- [ ] **Pluriel :** Le libellé gère le pluriel correctement

### Cas d'Utilisation

#### Session à 7 joueurs (VLAD01)

1. **Scroll minimal :**
   - [ ] Ouvrir les outils MJ avec 7 personnages
   - [ ] Vérifier que 6-7 personnages sont visibles sans scrolling
   - [ ] Confirmer que le scroll n'est nécessaire QUE si 8+ personnages

2. **Sélection rapide :**
   - [ ] Cliquer sur "Tous" → tous les 7 sont sélectionnés
   - [ ] Vérifier le compteur affiche "7/7"
   - [ ] Cliquer sur "Aucun" → tous désélectionnés
   - [ ] Vérifier le compteur affiche "0/7"

3. **Sélection partielle :**
   - [ ] Cliquer sur 3 personnages aléatoires
   - [ ] Vérifier les checkmarks apparaissent
   - [ ] Vérifier le compteur affiche "3/7"
   - [ ] Cliquer sur un personnage sélectionné pour le désélectionner
   - [ ] Vérifier le checkmark disparaît

4. **Lancement de jet :**
   - [ ] Sélectionner 5 personnages
   - [ ] Lancer un jet de dés (ex: 1d100)
   - [ ] Vérifier que le jet s'applique aux 5 personnages sélectionnés
   - [ ] Confirmer les résultats s'affichent bien pour chaque personnage

#### Session à 4 joueurs (Compact)

- [ ] Les 4 personnages tiennent en 2×2 sans scrolling
- [ ] L'interface ne semble pas vide/wasting space

#### Session à 12 joueurs (Large)

- [ ] ScrollArea est nécessaire mais fonctionnelle
- [ ] Chaque personnage reste cliquable et lisible
- [ ] Pas de lag ou ralentissement

### Responsiveness

- [ ] **Desktop (1920px) :** Grille 2 colonnes optimale
- [ ] **Tablet (768px) :** Les 2 colonnes sont bien espacées
- [ ] **Mobile (360px) :** Les colonnes changent en 1 colonne (à vérifier via responsive design)

### Animations

- [ ] **Apparition :** Chaque personnage apparaît avec fade-in + scale smooth
- [ ] **Sélection checkmark :** Apparaît avec animation scale de 0 → 1
- [ ] **Hover state :** Transition smooth du fond et bordure
- [ ] **Pas de lag :** Les animations sont fluides (pas de jank)

### Accessibilité

- [ ] **Clavier :** Peut tab entre les personnages (grâce à onClick)
- [ ] **Couleur :** Les checkmarks sont visibles (doré sur couleurs sombres)
- [ ] **Contraste :** Les textes (noms, stats) sont lisibles
- [ ] **Data-testid :** Les éléments ont les bons testid pour E2E

### Compatibilité TypeScript

```bash
# À la racine du projet
npx tsc --noEmit
# Devrait retourner: 0 erreurs
```

### Tests Unitaires

```bash
npm test -- gm-roll-with-effects
# Devrait passer tous les tests existants
```

---

## Cas de Débogage

### Si les personnages ne s'affichent pas
- [ ] Vérifier que `characters` prop est passée correctement
- [ ] Vérifier que chaque character a un `id` unique
- [ ] Ouvrir DevTools → Console pour voir les erreurs

### Si les animations ne fonctionnent pas
- [ ] Vérifier que Framer Motion est installé (`import { motion }`)
- [ ] Vérifier que le composant utilise `<motion.div>` pas `<div>`

### Si le scroll ne fonctionne pas
- [ ] Vérifier que `ScrollArea` a la classe `h-64`
- [ ] Vérifier que le contenu intérieur dépasse la hauteur (test avec 8+ persos)

### Si le layout est mal aligné
- [ ] Vérifier les classes Tailwind : `grid grid-cols-2 gap-2`
- [ ] Vérifier `pr-4` pour le padding droit (évite overlap avec scrollbar)

---

## Métriques de Succès

| Métrique | Avant | Après | Cible |
|----------|-------|-------|--------|
| Personnages visibles (session 7) | 2-3 | 6-7 | 6-7 ✓ |
| Hauteur ScrollArea | 128px | 256px | 256px ✓ |
| Nombre de colonnes | 1 | 2 | 2 ✓ |
| Taille avatar | 8×8 | 12×12 | 12×12 ✓ |
| Indicateur sélection | Checkbox | Checkmark | Checkmark ✓ |
| Boutons rapides | 1 | 2 | 2 ✓ |
| Compteur visible | Non | Oui | Oui ✓ |
| Temps pour sélectionner 5/7 | ~8s | ~3s | <5s ✓ |

---

## Notes de Test

**Date testée:** [À remplir lors du test]
**Testeur:** [À remplir]
**Navigateur:** [À remplir: Chrome, Firefox, Safari, etc.]
**Résolution:** [À remplir: 1920×1080, etc.]

### Observations
```
[À remplir lors du test]
```

### Issues rencontrées
```
[À remplir lors du test]
```

### Validations
- [ ] Fonctionnalité complète
- [ ] Pas de regressions
- [ ] Conforme aux standards d'accessibilité
- [ ] Performance acceptable
- [ ] TypeScript strict passé

