# Guide Développeur : Mutations Optimistes avec React Query

## Introduction

Ce guide explique comment implémenter des mutations optimistes pour éviter les re-fetch inutiles et préserver l'ordre d'affichage des éléments dans les listes.

---

## Problème : Invalidation = Réorganisation

### Anti-Pattern ❌

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    return apiRequest("POST", "/api/update", data);
  },
  onSuccess: () => {
    // ❌ PROBLÈME : Re-fetch complet
    queryClient.invalidateQueries({ queryKey: ["items"] });
  }
});
```

**Conséquences :**
1. Requête HTTP GET inutile (latence 50-200ms)
2. L'ordre peut changer selon le timing réseau
3. Tous les composants re-rendent (même ceux non modifiés)
4. Flash visuel désagréable (disparition → réapparition)

---

## Solution : Mutations Optimistes ✅

### Pattern Recommandé

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    return apiRequest("POST", "/api/update", data);
  },
  onSuccess: (response, variables) => {
    // ✅ SOLUTION : Mise à jour locale du cache
    queryClient.setQueryData(
      ["items"],
      (old: Item[] | undefined) => {
        if (!old) return old;

        return old.map(item =>
          item.id === variables.id
            ? { ...item, ...variables.updates }
            : item
        );
      }
    );
  }
});
```

**Avantages :**
1. Feedback instantané (< 1ms)
2. Ordre préservé à 100%
3. Seul l'élément modifié re-rend
4. Pas de flash visuel

---

## Anatomie d'une Mutation Optimiste

### 1. Structure Complète

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    // 1️⃣ Fonction de mutation (appel API)
    mutationFn: async ({ id, newValue }: { id: string; newValue: number }) => {
      const response = await apiRequest("PATCH", `/api/items/${id}`, {
        value: newValue
      });
      return response.json();
    },

    // 2️⃣ (Optionnel) Optimistic update AVANT l'appel API
    onMutate: async (variables) => {
      // Annuler les re-fetch en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: ["items"] });

      // Sauvegarder l'état actuel pour rollback
      const previousItems = queryClient.getQueryData<Item[]>(["items"]);

      // Mise à jour optimiste
      queryClient.setQueryData<Item[]>(["items"], (old) => {
        if (!old) return old;
        return old.map(item =>
          item.id === variables.id
            ? { ...item, value: variables.newValue }
            : item
        );
      });

      // Retourner context pour rollback
      return { previousItems };
    },

    // 3️⃣ Succès : L'update optimiste est déjà appliquée
    onSuccess: (data, variables, context) => {
      // Optionnel : Mettre à jour avec les données serveur
      // (si le serveur calcule des champs supplémentaires)
      queryClient.setQueryData<Item[]>(["items"], (old) => {
        if (!old) return old;
        return old.map(item =>
          item.id === data.id
            ? { ...item, ...data } // Merge avec réponse serveur
            : item
        );
      });
    },

    // 4️⃣ Erreur : Rollback
    onError: (error, variables, context) => {
      // Restaurer l'état précédent
      if (context?.previousItems) {
        queryClient.setQueryData(["items"], context.previousItems);
      }

      toast.error("Échec de la mise à jour");
    },

    // 5️⃣ (Optionnel) Toujours exécuté
    onSettled: () => {
      // Optionnel : Re-fetch pour garantir la cohérence
      // queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });

  return (
    <button onClick={() => updateItemMutation.mutate({ id: "123", newValue: 42 })}>
      Update
    </button>
  );
}
```

### 2. Version Simplifiée (Cas Courant)

Si vous n'avez pas besoin de rollback en cas d'erreur :

```typescript
const updateItemMutation = useMutation({
  mutationFn: async ({ id, newValue }) => {
    return apiRequest("PATCH", `/api/items/${id}`, { value: newValue });
  },
  onSuccess: (data, variables) => {
    queryClient.setQueryData(["items"], (old: Item[]) => {
      return old.map(item =>
        item.id === variables.id
          ? { ...item, value: variables.newValue }
          : item
      );
    });
  }
});
```

---

## Cas d'Usage Communs

### 1. Incrémenter/Décrémenter une Valeur

```typescript
// Exemple : +1 PV pour un personnage
const incrementHPMutation = useMutation({
  mutationFn: async (characterId: string) => {
    return apiRequest("POST", `/api/characters/${characterId}/effects`, {
      type: "healing",
      value: "1"
    });
  },
  onSuccess: (data, characterId) => {
    queryClient.setQueryData(
      ["/api/sessions", sessionId, "characters"],
      (old: Character[]) => {
        return old.map(char =>
          char.id === characterId
            ? { ...char, hitPoints: Math.min(char.hitPoints + 1, char.maxHitPoints) }
            : char
        );
      }
    );
  }
});

// Utilisation
<button onClick={() => incrementHPMutation.mutate(character.id)}>
  +1 PV
</button>
```

### 2. Modifier une Propriété d'Objet

```typescript
// Exemple : Changer le nom d'un personnage
const renameCharacterMutation = useMutation({
  mutationFn: async ({ id, name }: { id: string; name: string }) => {
    return apiRequest("PATCH", `/api/characters/${id}`, { name });
  },
  onSuccess: (data, variables) => {
    queryClient.setQueryData(
      ["characters"],
      (old: Character[]) => {
        return old.map(char =>
          char.id === variables.id
            ? { ...char, name: variables.name }
            : char
        );
      }
    );
  }
});
```

### 3. Toggle Boolean

```typescript
// Exemple : Activer/désactiver un effet
const toggleEffectMutation = useMutation({
  mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
    return apiRequest("PATCH", `/api/effects/${id}`, { isActive });
  },
  onSuccess: (data, variables) => {
    queryClient.setQueryData(
      ["effects"],
      (old: Effect[]) => {
        return old.map(effect =>
          effect.id === variables.id
            ? { ...effect, isActive: variables.isActive }
            : effect
        );
      }
    );
  }
});

// Utilisation
<button onClick={() => toggleEffectMutation.mutate({
  id: effect.id,
  isActive: !effect.isActive
})}>
  {effect.isActive ? "Désactiver" : "Activer"}
</button>
```

### 4. Suppression d'un Élément

```typescript
const deleteItemMutation = useMutation({
  mutationFn: async (id: string) => {
    return apiRequest("DELETE", `/api/items/${id}`);
  },
  onSuccess: (data, id) => {
    queryClient.setQueryData(
      ["items"],
      (old: Item[]) => {
        return old.filter(item => item.id !== id);
      }
    );
  }
});
```

### 5. Ajout d'un Élément

```typescript
const addItemMutation = useMutation({
  mutationFn: async (newItem: CreateItemDto) => {
    const response = await apiRequest("POST", "/api/items", newItem);
    return response.json();
  },
  onSuccess: (createdItem) => {
    queryClient.setQueryData(
      ["items"],
      (old: Item[]) => {
        return [...old, createdItem];
      }
    );
  }
});
```

---

## Tri Stable des Listes

### Problème : Ordre Instable Après Re-fetch

Même avec mutations optimistes, un re-fetch (WebSocket, refresh) peut réorganiser les éléments si le backend retourne un ordre différent.

### Solution : Tri Stable Côté Frontend

```typescript
const { data: itemsData = [] } = useQuery({
  queryKey: ["items"],
  queryFn: fetchItems
});

// ✅ Tri stable par ID
const items = [...itemsData].sort((a, b) => a.id.localeCompare(b.id));
```

**Critères de Tri Recommandés :**

| Critère | Stabilité | Cas d'Usage |
|---------|-----------|-------------|
| `id` (UUID) | ✅ Parfait | Liste générique |
| `createdAt` | ⚠️ Risqué | Ordre chronologique strict requis |
| `name` | ⚠️ Risqué | Peut changer, pas unique |
| Index tableau | ❌ Instable | Jamais utiliser |

**Important :** Toujours copier le tableau avant tri (`[...data].sort()`) pour ne pas muter le cache React Query.

---

## Optimisation : Mémoïsation

### Éviter les Re-renders Inutiles

```typescript
// components/item-card.tsx

export default memo(ItemCard, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.value === nextProps.item.value &&
    prevProps.item.name === nextProps.item.name
    // Ajouter toutes les props qui déclenchent un re-render
  );
});
```

**Résultat :** Seule la carte modifiée re-rend, pas toute la liste.

---

## Gestion des Erreurs

### Pattern avec Rollback

```typescript
const mutation = useMutation({
  mutationFn: updateItem,

  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: ["items"] });
    const previous = queryClient.getQueryData(["items"]);

    queryClient.setQueryData(["items"], (old: Item[]) => {
      return old.map(item =>
        item.id === variables.id
          ? { ...item, ...variables.updates }
          : item
      );
    });

    return { previous };
  },

  onError: (error, variables, context) => {
    // Rollback
    if (context?.previous) {
      queryClient.setQueryData(["items"], context.previous);
    }

    toast.error(`Erreur : ${error.message}`);
  }
});
```

---

## Cas Particuliers

### 1. Mutation Affectant Plusieurs Éléments

```typescript
// Appliquer un buff à plusieurs personnages
const applyGroupBuffMutation = useMutation({
  mutationFn: async ({ characterIds, value }) => {
    return apiRequest("POST", "/api/group-buff", { characterIds, value });
  },
  onSuccess: (data, variables) => {
    queryClient.setQueryData(
      ["characters"],
      (old: Character[]) => {
        return old.map(char =>
          variables.characterIds.includes(char.id)
            ? { ...char, hitPoints: char.hitPoints + variables.value }
            : char
        );
      }
    );
  }
});
```

### 2. Mutation Imbriquée (Nested Objects)

```typescript
// Modifier un objet imbriqué (ex: skills dans character)
const updateSkillMutation = useMutation({
  mutationFn: async ({ characterId, skillName, value }) => {
    return apiRequest("PATCH", `/api/characters/${characterId}/skills`, {
      skillName,
      value
    });
  },
  onSuccess: (data, variables) => {
    queryClient.setQueryData(
      ["characters"],
      (old: Character[]) => {
        return old.map(char =>
          char.id === variables.characterId
            ? {
                ...char,
                skills: {
                  ...char.skills,
                  [variables.skillName]: variables.value
                }
              }
            : char
        );
      }
    );
  }
});
```

### 3. Dépendances Entre Queries

```typescript
// Mettre à jour plusieurs caches liés
const mutation = useMutation({
  mutationFn: updateCharacter,
  onSuccess: (data, variables) => {
    // Mise à jour du cache "characters"
    queryClient.setQueryData(["characters"], (old: Character[]) => {
      return old.map(c => c.id === data.id ? data : c);
    });

    // Mise à jour du cache "session characters"
    queryClient.setQueryData(
      ["/api/sessions", sessionId, "characters"],
      (old: Character[]) => {
        return old.map(c => c.id === data.id ? data : c);
      }
    );

    // Mise à jour du cache "single character"
    queryClient.setQueryData(["characters", data.id], data);
  }
});
```

---

## Checklist : Quand Utiliser Optimistic Updates

### ✅ OUI, utiliser dans ces cas :

- [x] Modifications simples (incrément, toggle, update champ)
- [x] Opérations fréquentes (clic +1/-1, édition inline)
- [x] Interface réactive requise (jeux, dashboards temps réel)
- [x] Liste qui ne doit PAS se réorganiser
- [x] Réduction de la charge serveur importante

### ❌ NON, utiliser invalidation dans ces cas :

- [x] Suppression/Ajout d'éléments (changement structurel)
- [x] Calculs complexes côté serveur (formules, agrégations)
- [x] Données dépendantes de sources externes
- [x] Permissions vérifiées côté serveur uniquement
- [x] Updates depuis autre client (WebSocket)

---

## Exemple Complet : Game-Plug

Voir les fichiers modifiés dans le fix de réorganisation des personnages :

- `apps/frontend/app/(dashboard)/sessions/[sessionId]/page.tsx`
  - Lignes 496-531 : `onApplyBuff` avec optimistic update
  - Lignes 544-562 : `onUpdateMoney` avec optimistic update
  - Lignes 470-481 : `onApplyDamage` avec optimistic update

---

## Ressources

### Documentation Officielle
- [React Query - Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [React Query - setQueryData](https://tanstack.com/query/latest/docs/react/reference/QueryClient#queryclientsetquerydata)

### Exemples
- [TkDodo Blog - Optimistic Updates](https://tkdodo.eu/blog/optimistic-updates-in-react-query)
- [React Query Examples](https://tanstack.com/query/latest/docs/react/examples/optimistic-updates)

---

**Auteur :** Équipe Robinswood AI
**Date :** 2026-01-25
**Version :** 1.0
