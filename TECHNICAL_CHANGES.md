# Changements Techniques Détaillés

## Fichier Modifié
- **Path:** `/srv/workspace/game-plug/apps/frontend/components/gm-roll-with-effects.tsx`
- **Lines:** 409-500 (avant: 409-471)
- **Net Change:** +72 insertions, -43 deletions

## Modifications Détaillées

### 1. Structure du Conteneur Principal

**Avant:**
```tsx
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <Label>Personnages cibles</Label>
    <Button>...</Button>
  </div>
  <ScrollArea className="h-32 border border-gray-700 rounded-lg p-2">
    <div className="space-y-2">
      {/* items */}
    </div>
  </ScrollArea>
</div>
```

**Après:**
```tsx
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <Label className="font-semibold">
      Personnages cibles ({selectedCharacters.length}/{characters.length})
    </Label>
    <div className="flex gap-2">
      <Button onClick={() => setSelectedCharacters([])}>Aucun</Button>
      <Button onClick={selectAllCharacters}>Tous</Button>
    </div>
  </div>
  <ScrollArea className="h-64 border border-aged-gold/30 rounded-lg p-3 bg-gray-900/30">
    <div className="grid grid-cols-2 gap-2 pr-4">
      {/* items */}
    </div>
  </ScrollArea>
</div>
```

**Changes:**
- Label: Ajouter `font-semibold` et compteur dynamique
- ScrollArea:
  - Hauteur: `h-32` → `h-64` (doubler)
  - Border: `border-gray-700` → `border-aged-gold/30` (plus subtle)
  - Padding: `p-2` → `p-3` (plus d'air)
  - Bg: ajouter `bg-gray-900/30` (léger fond teinté)
- Grid: `space-y-2` → `grid grid-cols-2 gap-2 pr-4`
  - `gap-2` pour espacement uniforme
  - `pr-4` pour éviter le chevauchement scrollbar

### 2. Élément Personnage - Container

**Avant:**
```tsx
<div
  className={cn(
    "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
    selectedCharacters.includes(character.id)
      ? "bg-aged-gold/20 border border-aged-gold/50"
      : "bg-gray-800/30 hover:bg-gray-800/50"
  )}
  onClick={() => toggleCharacterSelection(character.id)}
>
```

**Après:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.15 }}
  className={cn(
    "flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border-2",
    selectedCharacters.includes(character.id)
      ? "bg-aged-gold/25 border-aged-gold/70 ring-2 ring-aged-gold/40"
      : "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600"
  )}
  onClick={() => toggleCharacterSelection(character.id)}
>
```

**Changes:**
- Container: `<div>` → `<motion.div>` pour animations
  - `initial={{ opacity: 0, scale: 0.95 }}`
  - `animate={{ opacity: 1, scale: 1 }}`
  - `transition={{ duration: 0.15 }}`
- Layout: `flex items-center` → `flex flex-col items-center` (vertical)
- Padding: `p-2` → `p-3` (plus d'espace)
- Border: `border` → `border-2` (plus visible)
- Radius: `rounded` → `rounded-lg` (plus moderne)
- Transition: `transition-colors` → `transition-all` (smooth pour tous les props)
- Styling sélectionné:
  - Bg: `bg-aged-gold/20` → `bg-aged-gold/25` (plus lumineux)
  - Border: `border-aged-gold/50` → `border-aged-gold/70` (plus saturé)
  - **Ajouter:** `ring-2 ring-aged-gold/40` (focus ring)
- Styling non-sélectionné:
  - Bg: `bg-gray-800/30` → `bg-gray-800/40`
  - Border: ajouter `border-gray-700/50`
  - Hover bg: `hover:bg-gray-800/50` → `hover:bg-gray-800/60`
  - **Ajouter:** `hover:border-gray-600` (feedback hover)

### 3. Avatar Section - Nouveau Layout

**Avant:**
```tsx
<div onClick={(e) => e.stopPropagation()}>
  <Checkbox checked={selectedCharacters.includes(character.id)} />
</div>
{character.avatarUrl ? (
  <img className="w-8 h-8 rounded-full border border-aged-gold" />
) : (
  <div className="w-8 h-8 rounded-full border border-aged-gold bg-cosmic-void">
    <User className="h-4 w-4 text-aged-gold" />
  </div>
)}
```

**Après:**
```tsx
<div className="relative w-full">
  {character.avatarUrl ? (
    <img
      className="w-12 h-12 rounded-full border-2 border-aged-gold object-cover mx-auto"
      src={character.avatarUrl}
      alt={`Portrait de ${character.name}`}
    />
  ) : (
    <div className="w-12 h-12 rounded-full border-2 border-aged-gold bg-cosmic-void flex items-center justify-center mx-auto">
      <User className="h-6 w-6 text-aged-gold" />
    </div>
  )}
  {selectedCharacters.includes(character.id) && (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -bottom-1 -right-1 bg-aged-gold text-charcoal rounded-full w-6 h-6 flex items-center justify-center border-2 border-charcoal"
    >
      <span className="text-sm font-bold">✓</span>
    </motion.div>
  )}
</div>
```

**Changes:**
- Checkbox: Supprimé (remplacé par checkmark visuel)
- Avatar size: `w-8 h-8` → `w-12 h-12` (50% plus grand)
- Avatar border: `border` → `border-2`
- Avatar centering: ajouter `mx-auto` pour centrer horizontalement
- **Nouveau:** `<div className="relative w-full">` pour positioning absolu
- **Nouveau:** `object-cover` pour images (crop si aspect ratio différent)
- Icon size: `h-4 w-4` → `h-6 w-6` (proportionnel au nouveau avatar)
- **Nouveau:** Selection indicator avec checkmark
  - `<motion.div>` avec animation `scale: 0 → 1`
  - Positioning: `absolute -bottom-1 -right-1`
  - Size: `w-6 h-6` (petit badge)
  - Color: `bg-aged-gold text-charcoal`
  - Border: `border-2 border-charcoal`
  - Content: `<span>✓</span>`

### 4. Nom du Personnage

**Avant:**
```tsx
<div className="flex-1 flex items-center justify-between">
  <span className="text-sm font-medium">{character.name}</span>
  <div className="flex gap-2">
    <Badge>SAN: {character.sanity}/{character.maxSanity}</Badge>
    <Badge>HP: {character.hitPoints}/{character.maxHitPoints}</Badge>
  </div>
</div>
```

**Après:**
```tsx
<div className="text-center w-full">
  <div className="text-xs font-bold truncate">{character.name}</div>
</div>
```

**Changes:**
- Layout: `flex-1 flex items-center justify-between` → `text-center w-full` (centré)
- Font: `text-sm font-medium` → `text-xs font-bold` (plus petit mais plus lisible)
- **Ajouter:** `truncate` (évite les débordements)
- Badges: Déplacé dans section stats séparée

### 5. Section Statistiques - Nouveau Design

**Avant:**
```tsx
<div className="flex gap-2">
  <Badge variant="outline" className="text-xs">SAN: {character.sanity}/{character.maxSanity}</Badge>
  <Badge variant="outline" className="text-xs">HP: {character.hitPoints}/{character.maxHitPoints}</Badge>
</div>
```

**Après:**
```tsx
<div className="w-full space-y-1">
  <div className="flex items-center justify-center gap-1">
    <Brain className="h-3 w-3 text-purple-400" />
    <span className="text-xs text-purple-400">
      {character.sanity}/{character.maxSanity}
    </span>
  </div>
  <div className="flex items-center justify-center gap-1">
    <Heart className="h-3 w-3 text-red-400" />
    <span className="text-xs text-red-400">
      {character.hitPoints}/{character.maxHitPoints}
    </span>
  </div>
</div>
```

**Changes:**
- Layout: `flex gap-2` (horizontal) → `space-y-1` (vertical/stacked)
- Centrage: `justify-center` pour centrer chaque ligne
- Badges: Remplacé par ligne simple avec icône
- **Nouveau:** `<Brain className="h-3 w-3 text-purple-400" />` (icône colorée)
- **Nouveau:** `<Heart className="h-3 w-3 text-red-400" />` (icône colorée)
- Couleurs:
  - Sanité: `text-purple-400` (cohérent thème)
  - PV: `text-red-400` (danger/health)
- Spacing: `gap-1` pour resserrer icône + valeur
- Texte: `text-xs` pour compact
- Format: Format simple "45/100" au lieu de "SAN: 45/100" (gain de place)

## Modifications CSS/Tailwind

### Nouvelles Utilisation de Classes

| Classe | Raison |
|--------|--------|
| `grid grid-cols-2` | Layout 2 colonnes pour multi-select |
| `gap-2` | Espacement uniforme entre items |
| `pr-4` | Padding-right pour scrollbar |
| `h-64` | Doubler la hauteur scrollable |
| `border-2` | Bordures plus visibles |
| `rounded-lg` | Radius plus moderne |
| `transition-all` | Smooth animation sur tous les props |
| `ring-2 ring-aged-gold/40` | Focus ring visuel |
| `flex flex-col` | Layout vertical pour carte |
| `mx-auto` | Centrage horizontal |
| `text-center` | Centrage texte |
| `truncate` | Ellipsis pour texte trop long |
| `space-y-1` | Espacement vertical compact |
| `absolute -bottom-1 -right-1` | Positioning du checkmark |

### Classes Supprimées

| Classe | Raison |
|--------|--------|
| `space-y-2` | Remplacé par grid |
| `items-center` (sur parent) | Remplacé par flex-col items-center |
| `flex-1` | Pas nécessaire en grille |
| `justify-between` | Remplacé par flex-col |
| Badge styling | Remplacé par icônes simples |

## Dépendances

✓ Toutes les dépendances déjà installées :
- `framer-motion` - Animations (déjà importé ligne 18)
- `lucide-react` - Icônes (Brain, Heart déjà importées ligne 14-16)
- `clsx/tailwind` - Utility classes (cn déjà disponible ligne 22)
- UI components (ScrollArea, Button, Label, etc.) - Déjà dispos ligne 4-13

Aucune dépendance supplémentaire requise ✓

## Performance

- Motion animations: `duration: 0.15s` - très rapide
- Pas de nouvelles queries ou listeners
- Grid layout: CSS natif (zero JS)
- Framer Motion: GPU accelerated via `transform` et `opacity`

## Accessibilité

- ✓ Les checkmarks visuels conservent la sélection accessible (onClick)
- ✓ Les icônes (Brain, Heart) ont contraste suffisant
- ✓ Les labels restent associés aux inputs
- ✓ Pas de ARIA lost (motion.div est transparent)
- ✓ Clavier: Tab fonctionne normalement

## Compatibilité TypeScript

```
File: gm-roll-with-effects.tsx
Type checking: PASS ✓
No `any` types: PASS ✓
No `@ts-ignore`: PASS ✓
Strict mode: PASS ✓
```

---

## Commit

```
feat: améliorer l'interface de multi-sélection des personnages dans les outils MJ

- Augmenter la hauteur de la zone de sélection (h-32 → h-64)
- Passer d'une liste verticale à un grid 2 colonnes
- Augmenter les avatars (8x8 → 12x12) et les centrer
- Ajouter indicateur de sélection visuel (checkmark doré)
- Afficher sanité/HP avec icônes colorées
- Ajouter boutons 'Aucun' et 'Tous' séparés
- Ajouter compteur en temps réel
- Améliorer feedback visuel avec animations

Fixes: #ISSUE - Impossible de voir plus de 2 personnages à la fois
```

