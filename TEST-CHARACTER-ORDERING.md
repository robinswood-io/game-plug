# Plan de Test : Stabilité de l'Ordre des Personnages

## Objectif
Vérifier que les personnages ne se réorganisent JAMAIS lors des modifications de stats.

## Pré-requis
- Session active avec au moins 3 personnages
- GM authentifié
- Console navigateur ouverte (F12) pour surveiller les requêtes réseau

## Test 1 : Modification PV (Points de Vie)

### Étapes
1. Ouvrir `/sessions/{sessionId}` (GM Dashboard)
2. Noter l'ordre actuel des personnages (ex: Alice, Bob, Charlie)
3. Cliquer sur le bouton **+** PV pour le personnage du **milieu** (Bob)
4. Observer l'affichage

### Résultat Attendu
- ✅ L'ordre reste : Alice, Bob, Charlie
- ✅ Seul le compteur PV de Bob change (animation locale)
- ✅ Aucune requête GET `/api/sessions/{id}/characters` dans Network tab
- ✅ Pas de re-render complet (pas de flash visuel)

### Résultat si Bug
- ❌ Les cartes se déplacent
- ❌ Requête GET visible dans Network
- ❌ Tous les personnages "clignotent"

---

## Test 2 : Modification SAN (Sanité Mentale)

### Étapes
1. Cliquer sur le bouton **-** SAN pour le personnage du **début** (Alice)
2. Cliquer sur le bouton **+** SAN pour le personnage de la **fin** (Charlie)
3. Observer l'affichage

### Résultat Attendu
- ✅ Ordre stable : Alice, Bob, Charlie
- ✅ Seules les stats SAN changent
- ✅ 0 requête GET dans Network

---

## Test 3 : Modification Argent

### Étapes
1. Cliquer 5 fois sur **+** $ pour Alice
2. Cliquer 3 fois sur **-** $ pour Bob
3. Observer l'affichage

### Résultat Attendu
- ✅ Ordre inchangé
- ✅ Compteurs $ mis à jour correctement
- ✅ Pas de re-fetch

---

## Test 4 : Modification PM (Points de Magie)

### Étapes
1. Cliquer sur **+** PM pour Charlie
2. Cliquer sur **-** PM pour Alice

### Résultat Attendu
- ✅ Ordre stable
- ✅ Stats PM mises à jour
- ✅ Pas de requête réseau

---

## Test 5 : Modification Rapide (Input)

### Étapes
1. Dans le champ "PV (+/-)", taper : **-5**
2. Cliquer sur le bouton ❤️ (Heart) pour appliquer
3. Dans le champ "SAN (+/-)", taper : **-3**
4. Cliquer sur le bouton 🧠 (Brain) pour appliquer

### Résultat Attendu
- ✅ Ordre des personnages stable
- ✅ PV réduit de 5
- ✅ SAN réduit de 3
- ✅ 0 requête GET

---

## Test 6 : Dégâts avec Formule de Dés

### Étapes
1. Dans le champ "PV (+/-)", taper : **1d6**
2. Cliquer sur le bouton ❤️
3. Observer le toast et la stat

### Résultat Attendu
- ✅ Ordre stable
- ✅ Toast affiche le résultat du jet (ex: "Dégâts: 4")
- ✅ PV réduit du montant correspondant
- ✅ Pas de réorganisation

---

## Test 7 : GameBoard Sync

### Étapes
1. Ouvrir le GameBoard dans un **nouvel onglet** : `/sessions/{sessionId}/gameboard`
2. Retourner sur le GM Dashboard
3. Modifier PV de Bob : **-2**
4. Revenir sur le GameBoard

### Résultat Attendu
- ✅ GameBoard affiche le nouveau PV de Bob
- ✅ Ordre des personnages identique entre GM Dashboard et GameBoard
- ✅ Pas de "saut" visuel des cartes

---

## Test 8 : Modifications Successives Rapides

### Étapes
1. En 10 secondes, effectuer :
   - +1 PV pour Alice
   - -1 SAN pour Bob
   - +5 $ pour Charlie
   - -1 PM pour Alice
   - +2 PV pour Bob

### Résultat Attendu
- ✅ Ordre stable durant toute la séquence
- ✅ Toutes les stats correctement mises à jour
- ✅ Pas de requête GET (uniquement POST pour les mutations)

---

## Test 9 : Rechargement de Page

### Étapes
1. Après avoir modifié plusieurs stats, noter l'ordre actuel
2. Appuyer sur F5 (rafraîchir la page)
3. Observer l'ordre au chargement

### Résultat Attendu
- ✅ L'ordre est **déterministe** (toujours le même tri par ID)
- ✅ Stats reflètent les dernières modifications
- ✅ 1 seule requête GET `/api/sessions/{id}/characters` au chargement

**Note :** L'ordre peut être différent de l'ordre `createdAt` du backend, mais il sera **stable et cohérent**.

---

## Test 10 : Suppression de Personnage

### Étapes
1. Noter l'ordre : Alice, Bob, Charlie
2. Supprimer Bob (via menu ⋮ > Supprimer)
3. Observer l'affichage

### Résultat Attendu
- ✅ Ordre relatif préservé : Alice, Charlie
- ✅ Pas de réorganisation des personnages restants
- ✅ 1 requête DELETE suivie de 1 requête GET (invalidation normale)

---

## Test 11 : Ajout de Personnage

### Étapes
1. Ordre actuel : Alice, Charlie
2. Créer un nouveau personnage : "David"
3. Retourner sur `/sessions/{sessionId}`

### Résultat Attendu
- ✅ David apparaît dans un ordre **stable et déterministe**
- ✅ L'ordre peut être : Alice, Charlie, David (tri par ID)
- ✅ Après modifications de stats, l'ordre reste identique

---

## Test 12 : WebSocket Update (Depuis un Autre Client)

### Pré-requis
- 2 navigateurs ouverts (ou 1 normal + 1 incognito)
- Les deux connectés à la même session

### Étapes
1. **Navigateur A (GM)** : Noter l'ordre des personnages
2. **Navigateur B (GM)** : Modifier PV de Bob : -3
3. **Navigateur A** : Observer l'affichage

### Résultat Attendu (Navigateur A)
- ✅ Ordre stable (pas de réorganisation)
- ✅ PV de Bob mis à jour via WebSocket
- ❓ Peut déclencher un re-fetch (comportement acceptable pour les updates distantes)

---

## Métriques de Performance

### Console Network Tab
- **Modifications locales (Test 1-6)** : 0 requête GET
- **Modifications depuis autre client (Test 12)** : 1 requête GET acceptable

### Console Browser DevTools

#### Avant le Fix
```
[React Query] Invalidating ["/api/sessions", "xxx", "characters"]
[Network] GET /api/sessions/xxx/characters - 200 OK (147ms)
[React] Re-rendering EnhancedCharacterCard x3
```

#### Après le Fix
```
[React Query] Setting query data ["/api/sessions", "xxx", "characters"]
[React] Re-rendering EnhancedCharacterCard x1 (only modified character)
```

---

## Checklist de Validation

- [ ] Test 1 : PV ✅
- [ ] Test 2 : SAN ✅
- [ ] Test 3 : Argent ✅
- [ ] Test 4 : PM ✅
- [ ] Test 5 : Input rapide ✅
- [ ] Test 6 : Formule dés ✅
- [ ] Test 7 : GameBoard sync ✅
- [ ] Test 8 : Modifications rapides ✅
- [ ] Test 9 : Rechargement page ✅
- [ ] Test 10 : Suppression ✅
- [ ] Test 11 : Ajout ✅
- [ ] Test 12 : WebSocket ✅

## Bugs Potentiels à Surveiller

### 1. Désynchronisation Cache/Backend
**Symptôme :** Stat affichée différente de la valeur réelle en DB

**Test :**
1. Modifier PV : -5
2. Rafraîchir la page (F5)
3. Vérifier que la valeur est cohérente

### 2. Race Condition
**Symptôme :** Stats "sautent" lors de modifications très rapides

**Test :**
1. Cliquer 10 fois très rapidement sur +1 PV
2. Vérifier que le total est correct (+10)

### 3. Optimistic Update Non Annulé en Cas d'Erreur
**Symptôme :** Stat affichée alors que le backend a rejeté la mutation

**Test :**
1. Déconnecter le réseau (DevTools > Network > Offline)
2. Modifier une stat
3. Observer le comportement (devrait afficher une erreur et rollback)

---

## Validation TypeScript

```bash
cd /srv/workspace/game-plug/apps/frontend
npx tsc --noEmit
```

**Résultat attendu :** Exit code 0, aucune erreur

---

## Date de Création

2026-01-25
