# Correction du Bouton "Ajouter" Inventaire

## Problème Identifié
Le bouton "Ajouter" (classe `bg-eldritch-green`) ne permettait pas d'ajouter des objets à l'inventaire d'un personnage sans donner aucun feedback à l'utilisateur.

**Fichier Affecté**: `/srv/workspace/game-plug/apps/frontend/components/character-inventory-manager.tsx`

## Causes Potentielles Identifiées

### 1. Manque de Logs de Debug
- Pas de console.log pour tracer l'exécution du handler
- Impossible de savoir si le clic était détecté
- Impossible de vérifier les données envoyées

### 2. Manque de Gestion d'Erreur Visuelle
- La mutation `addItemMutation` n'avait pas de handler `onError`
- Les erreurs API étaient silencieuses (pas de toast)
- L'utilisateur ne savait pas si quelque chose s'était mal passé

### 3. Pas de Feedback Pendant le Chargement
- Le bouton ne montrait pas qu'une requête était en cours
- Pas d'indication visuelle de l'état de la mutation
- Risque de clics multiples accidentels

## Corrections Appliquées

### 1. Ajout de Console.log Complets

#### Dans le handler `handleAddItem` (Ligne 216-230):
```typescript
const handleAddItem = (item: any) => {
  console.log("[DEBUG] handleAddItem called with:", item);
  const inventoryItem = {
    // ... propriétés
  };
  console.log("[DEBUG] Prepared inventory item:", inventoryItem);
  addItemMutation.mutate(inventoryItem);
};
```

#### Dans le click du bouton (Ligne 479-481):
```typescript
onClick={() => {
  console.log("[DEBUG] Add button clicked for item:", item);
  handleAddItem(item);
}}
```

#### Dans la mutation (Ligne 109-118):
```typescript
mutationFn: async (item: any) => {
  console.log("[DEBUG] Adding inventory item:", {
    characterId,
    itemData: item,
    url: `/api/characters/${characterId}/inventory`
  });
  const response = await apiRequest("POST", `/api/characters/${characterId}/inventory`, item);
  console.log("[DEBUG] Add inventory response status:", response.status);
  const data = await response.json();
  console.log("[DEBUG] Add inventory response data:", data);
  return data;
}
```

### 2. Ajout de Gestion d'Erreur Robuste

#### Handler `onError` (Ligne 128-136):
```typescript
onError: (error: any) => {
  console.error("[DEBUG] Add item mutation error:", error);
  const errorMessage = error?.message || "Impossible d'ajouter l'objet";
  toast({
    title: "Erreur",
    description: errorMessage,
    variant: "destructive",
  });
}
```

### 3. Amélioration du Feedback Utilisateur

#### État du bouton (Ligne 477-488):
```typescript
<Button
  size="sm"
  onClick={() => {
    console.log("[DEBUG] Add button clicked for item:", item);
    handleAddItem(item);
  }}
  className="h-7 px-3 bg-eldritch-green hover:bg-green-700 text-bone-white"
  disabled={addItemMutation.isPending}  // ← Désactive pendant le chargement
>
  <Plus className="mr-1 h-3 w-3" />
  {addItemMutation.isPending ? "Ajout en cours..." : "Ajouter"}  // ← Texte dynamique
</Button>
```

## Résumé des Changements

| Aspect | Avant | Après |
|--------|------|-------|
| **Logs** | Aucun | 7 points de debug détaillés |
| **Erreurs** | Silencieuses | Toast d'erreur avec message |
| **État visuel** | Fixe | Dynamique (en cours/disponible) |
| **Clics multiples** | Possibles | Prévenus (bouton désactivé) |

## Comment Tester

1. **Ouvrir la console du navigateur**: F12 → Onglet Console
2. **Accéder à la session GM**: Aller à `/sessions/[sessionId]`
3. **Ouvrir l'inventaire**: Cliquer sur un personnage → Menu inventaire
4. **Cliquer sur "Ajouter"**: Sélectionner un objet du catalogue
5. **Vérifier les logs**:
   - Chercher `[DEBUG] Add button clicked`
   - Chercher `[DEBUG] Adding inventory item`
   - Chercher `[DEBUG] Add item mutation success` ou `[DEBUG] Add item mutation error`
6. **Vérifier les toasts**: Regarder si un toast de succès ou d'erreur apparaît

## Points d'Intégration

### Frontend → Backend
- **Route**: `POST /api/characters/{characterId}/inventory`
- **Proxy**: Next.js proxy rewrite de `/api/` vers `http://game-plug-backend:4000/api/`
- **Auth**: Token Bearer depuis localStorage

### Backend Validation
- **DTO**: `CreateInventoryDto` avec validation class-validator
- **Énumération**: `category` doit être l'une des valeurs: `weapon|armor|tool|book|consumable|misc`
- **Permissions**: Vérification que l'utilisateur est GM ou propriétaire du personnage

## Prochaines Étapes Recommandées

1. **Tests E2E**: Ajouter des tests Playwright pour le flux complet d'ajout d'objet
2. **Optimistic Updates**: Implémenter les mises à jour optimistes pour une meilleure UX
3. **Validation Frontend**: Ajouter Zod pour valider les données avant l'envoi
4. **Cleanup Logs**: Retirer les logs `[DEBUG]` en production (garder en dev seulement)

## Fichiers Modifiés

- `/srv/workspace/game-plug/apps/frontend/components/character-inventory-manager.tsx`
  - Lignes 107-137: Mutation avec logs et gestion d'erreur
  - Lignes 216-230: Handler avec logs
  - Lignes 477-488: Bouton avec état dynamique et logs

