# User Stories MJ (Game Master) - Game-Plug

## Contexte
Le MJ est le maître de jeu qui contrôle la session de jeu, gère les joueurs, crée des chapitres scénaristiques, applique des effets aux personnages et crée une ambiance immersive pour les joueurs.

---

## I. GESTION DE SESSION

### US-MJ01: Créer une nouvelle session de jeu
**En tant que** MJ
**Je veux** créer une nouvelle session de jeu
**Afin de** inviter des joueurs et commencer une partie

**Critères d'acceptation:**
- Formulaire avec: nom de session (3-100 caractères), description optionnelle
- Validation des caractères (lettres, chiffres, espaces, tirets, accents uniquement)
- Génération automatique d'un code d'invitation unique
- Sauvegarde en base de données avec:
  - ID de session
  - ID du MJ (gmId) comme créateur
  - Status actif par défaut
  - Timestamps de création/mise à jour
- Redirection vers le tableau de bord MJ de la session
- Message de confirmation avec code d'invitation

**Endpoint backend:** `POST /api/sessions`
**Frontend:** `/apps/frontend/app/(dashboard)/sessions/page.tsx`

---

### US-MJ02: Voir la liste de mes sessions
**En tant que** MJ
**Je veux** voir toutes mes sessions de jeu
**Afin de** accéder rapidement à mes sessions actives et archivées

**Critères d'acceptation:**
- Affichage de la liste avec:
  - Nom de session
  - Code d'invitation
  - Status (Active / En pause)
  - Date de création
  - Heure de dernière modification
  - Nombre de joueurs connectés
- Statistiques globales:
  - Nombre total de sessions
  - Nombre de sessions actives
- Tri et filtrage (actives/pauses/archivées)
- Pagination ou scroll infini si nombreuses sessions
- Messages vides informatifs

**Endpoint backend:** `GET /api/sessions`
**Frontend:** `/apps/frontend/app/(dashboard)/sessions/page.tsx`

---

### US-MJ03: Gérer ma session (démarrer/arrêter)
**En tant que** MJ
**Je veux** activer ou désactiver ma session
**Afin de** contrôler le statut de jeu et mettre en pause quand nécessaire

**Critères d'acceptation:**
- Bouton Play/Pause sur chaque session
- Basculer le statut `isActive` (true/false)
- Feedback visuel: badge "Active" ou "En pause"
- Toast de confirmation
- Les joueurs ne peuvent rejoindre que les sessions actives
- L'état se met à jour en temps réel via WebSocket

**Endpoint backend:** `PATCH /api/sessions/{id}` avec `{ isActive: boolean }`
**Frontend:** Buttons dans `/apps/frontend/app/(dashboard)/sessions/page.tsx`

---

### US-MJ04: Copier le code d'invitation
**En tant que** MJ
**Je veux** copier facilement le code d'invitation de ma session
**Afin de** l'envoyer rapidement aux joueurs

**Critères d'acceptation:**
- Bouton "Copier" à côté du code de session
- Copie du code (6 caractères) dans le presse-papier
- Toast de confirmation "Code copié: XXXXXX"
- Format du code: alphanumérique, unique

**Frontend:** `/apps/frontend/app/(dashboard)/sessions/page.tsx`

---

### US-MJ05: Copier le lien d'invitation
**En tant que** MJ
**Je veux** copier un lien d'invitation pour que les joueurs la rejoignent facilement
**Afin de** partager un accès simple à ma session

**Critères d'acceptation:**
- Bouton "Partager" pour générer un lien complet
- Format: `{origin}/join/{sessionCode}`
- Copie du lien dans le presse-papier
- Toast de confirmation
- Les joueurs sans compte peuvent utiliser ce lien pour rejoindre

**Frontend:** `/apps/frontend/app/(dashboard)/sessions/page.tsx`

---

### US-MJ06: Afficher QR code d'invitation
**En tant que** MJ
**Je veux** afficher un QR code pour ma session
**Afin de** permettre aux joueurs de rejoindre rapidement en scannant

**Critères d'acceptation:**
- Dialog modale avec QR code généré
- QR code contient le lien d'invitation complet
- Bouton pour afficher/masquer le QR
- Option de télécharger le QR code
- QR code mis à jour si la session change

**Frontend:** `/apps/frontend/app/(dashboard)/sessions/[sessionId]/page.tsx`

---

### US-MJ07: Supprimer une session
**En tant que** MJ
**Je veux** supprimer une session de jeu
**Afin de** nettoyer mes sessions archivées ou non-désirées

**Critères d'acceptation:**
- Bouton "Supprimer" sur chaque session
- Confirmation de suppression avec warning
- Message: "Êtes-vous sûr de supprimer la session [nom]? Cette action est irréversible."
- Suppression en cascade de tous les personnages associés
- Suppression de l'historique des dés et chapitres
- Toast de confirmation de suppression
- Rechargement de la liste

**Endpoint backend:** `DELETE /api/sessions/{id}`
**Frontend:** `/apps/frontend/app/(dashboard)/sessions/page.tsx`

---

## II. GESTION DES JOUEURS ET PERSONNAGES

### US-MJ08: Voir la liste des joueurs connectés
**En tant que** MJ
**Je veux** voir tous les joueurs et leurs personnages dans la session
**Afin de** gérer la session et voir qui est présent

**Critères d'acceptation:**
- Affichage en temps réel via WebSocket
- Pour chaque joueur: nom, personnage, statut de connexion
- Indicateur visuel de connexion (vert = connecté, gris = déconnecté)
- Nombre total de joueurs
- Voir les personnages avec:
  - Nom, occupation
  - Avatar du personnage
  - Sanité actuelle/max
  - Points de vie actuels/max
  - Points de magie actuels/max
  - Statut de sanity (sain, choqué, fous)

**Endpoint backend:** `GET /api/sessions/{id}/characters`
**Frontend:** `/apps/frontend/app/(dashboard)/sessions/[sessionId]/page.tsx`

---

### US-MJ09: Importer des personnages depuis autres sessions
**En tant que** MJ
**Je veux** importer/copier des personnages depuis mes autres sessions
**Afin de** réutiliser des personnages existants

**Critères d'acceptation:**
- Dialog "Importer personnage"
- Affiche les personnages disponibles des autres sessions du MJ
- Option pour réinitialiser l'état du personnage (sanité, PV, etc.)
- Sélection de personnages à importer
- Confirmation d'import
- Toast de confirmation d'import
- Les personnages importés deviennent modifiables dans la session actuelle

**Endpoint backend:**
- `GET /api/sessions/{sessionId}/importable-characters`
- `POST /api/sessions/{sessionId}/import-character` avec `{ characterId, resetState }`

**Frontend:** `/apps/frontend/components/import-character-dialog.tsx`

---

### US-MJ10: Retirer un joueur de la session
**En tant que** MJ
**Je veux** retirer un personnage/joueur de ma session
**Afin de** gérer les joueurs non-participants

**Critères d'acceptation:**
- Bouton "Supprimer" sur chaque personnage
- Confirmation avant suppression
- Suppression du personnage de la session (GM only)
- Les données du personnage restent dans les autres sessions
- Toast de confirmation
- Notification au joueur via WebSocket qu'il a été retiré

**Endpoint backend:** `DELETE /api/sessions/{sessionId}/characters/{characterId}`
**Frontend:** `/apps/frontend/app/(dashboard)/sessions/[sessionId]/page.tsx`

---

### US-MJ11: Générer des avatars IA pour tous les personnages
**En tant que** MJ
**Je veux** générer des portraits IA pour tous les personnages d'une session
**Afin de** créer une ambiance visuelle cohérente rapidement

**Critères d'acceptation:**
- Bouton "Générer portraits" dans le dashboard
- Génère des avatars pour les personnages sans portrait
- Option pour forcer la régénération de tous les avatars
- Barre de progression pendant la génération
- Toast du nombre de portraits générés
- Utilise DALL-E 3 ou API équivalente
- Stockage local des images générées
- Mise à jour en temps réel des avatars dans l'UI

**Endpoint backend:** `POST /api/ai/sessions/{sessionId}/generate-all-avatars`
**Frontend:** `/apps/frontend/app/(dashboard)/sessions/[sessionId]/page.tsx`

---

## III. CRÉATION DE CONTENU NARRATIF

### US-MJ12: Créer un chapitre (scénario)
**En tant que** MJ
**Je veux** créer des chapitres pour structurer mon scénario
**Afin de** organiser le jeu en sections narratives

**Critères d'acceptation:**
- Dialog de création avec champs:
  - Nom du chapitre (obligatoire)
  - Description (optionnel)
  - Notes privées du MJ (optionnel)
  - Status par défaut: "planned" (planned/active/completed)
- Validation: nom requis et non vide
- Sauvegarde en base avec:
  - sessionId associée
  - Vérification que l'utilisateur est bien le MJ de la session
  - orderIndex automatique (ajouté à la fin)
  - Timestamps de création
- Toast de confirmation
- Le chapitre apparaît dans la liste

**Endpoint backend:** `POST /api/sessions/{sessionId}/chapters`
**Frontend:** `/apps/frontend/components/chapter-manager.tsx`

---

### US-MJ13: Voir la liste des chapitres de ma session
**En tant que** MJ
**Je veux** voir tous les chapitres de ma session
**Afin de** naviguer dans la structure de mon scénario

**Critères d'acceptation:**
- Liste des chapitres avec:
  - Nom, description, statut
  - Badges colorés: "Planifié", "En cours", "Complété"
  - Icônes pour chaque statut
  - Ordre d'apparition dans la session
- Scroll area si nombreux chapitres
- Sélection d'un chapitre pour voir ses détails
- Tri automatique par orderIndex

**Endpoint backend:** `GET /api/sessions/{sessionId}/chapters`
**Frontend:** `/apps/frontend/components/chapter-manager.tsx`

---

### US-MJ14: Mettre à jour un chapitre
**En tant que** MJ
**Je veux** modifier les informations d'un chapitre
**Afin de** mettre à jour mon scénario au fur et à mesure

**Critères d'acceptation:**
- Click sur chapitre pour ouvrir form d'édition
- Champs modifiables: nom, description, notes, statut
- Sauvegarde en base de données
- Toast de confirmation
- Mise à jour immédiate dans la liste

**Endpoint backend:** `PATCH /api/chapters/{id}`
**Frontend:** `/apps/frontend/components/chapter-manager.tsx`

---

### US-MJ15: Réordonner les chapitres
**En tant que** MJ
**Je veux** réordonner mes chapitres
**Afin de** restructurer mon scénario

**Critères d'acceptation:**
- Boutons haut/bas pour déplacer les chapitres
- Déplacer un chapitre up/down dans la liste
- Mise à jour des orderIndex dans la base
- Réorganisation immédiate visuelle
- Toast de confirmation

**Endpoint backend:** `PATCH /api/chapters/{id}` avec `{ orderIndex: number }`
**Frontend:** `/apps/frontend/components/chapter-manager.tsx`

---

### US-MJ16: Supprimer un chapitre
**En tant que** MJ
**Je veux** supprimer un chapitre de ma session
**Afin de** nettoyer mes chapitres non-désirés

**Critères d'acceptation:**
- Bouton "Supprimer" sur chaque chapitre
- Confirmation avant suppression
- Suppression en cascade des événements du chapitre
- Toast de confirmation
- Rechargement de la liste

**Endpoint backend:** `DELETE /api/chapters/{id}`
**Frontend:** `/apps/frontend/components/chapter-manager.tsx`

---

### US-MJ17: Voir l'historique des événements d'un chapitre
**En tant que** MJ
**Je veux** voir tous les événements narratifs d'un chapitre
**Afin de** tracker la progression du scénario

**Critères d'acceptation:**
- Onglet "Historique" des chapitres
- Affiche événements avec:
  - Timestamp de création
  - Description
  - Type d'événement
- Liste chronologique (plus récent en haut)
- Scroll area pour nombreux événements

**Endpoint backend:** Implicite dans `GET /api/sessions/{sessionId}/chapters`
**Frontend:** `/apps/frontend/components/chapter-event-history.tsx`

---

## IV. PROJECTION SUR LE GAMEBOARD

### US-MJ18: Projeter une image sur le GameBoard (DALL-E 3)
**En tant que** MJ
**Je veux** générer et projeter une image IA sur le tableau de jeu
**Afin de** créer une ambiance visuelle immersive pour les joueurs

**Critères d'acceptation:**
- Dialog "Projection visuelle"
- Tab "Générer une image IA"
- Champ "Description" (prompt)
- Bouton "Générer"
- Barre de progression pendant génération
- Affichage de l'image générée
- Envoi via WebSocket à tous les joueurs
- L'image s'affiche sur le GameBoard en temps réel
- Toast de confirmation

**Endpoint backend:** `POST /api/gameboard/generate-scene` ou `/api/ai/generate-scene`
**Frontend:** `/apps/frontend/components/visual-projection-dialog.tsx`

---

### US-MJ19: Projeter une image depuis URL
**En tant que** MJ
**Je veux** projeter une image externe sur le GameBoard
**Afin de** utiliser des images trouvées en ligne

**Critères d'acceptation:**
- Dialog "Projection visuelle"
- Tab "Charger depuis URL"
- Champ URL avec validation
- Prévisualisation de l'image
- Bouton "Projeter"
- Envoi via WebSocket
- Toast de confirmation
- Gestion des erreurs (URL invalide, image non accessible)

**Frontend:** `/apps/frontend/components/visual-projection-dialog.tsx`

---

### US-MJ20: Uploader une image
**En tant que** MJ
**Je veux** uploader mes propres images
**Afin de** utiliser des ressources personnalisées

**Critères d'acceptation:**
- Dialog "Projection visuelle"
- Tab "Uploader fichier"
- Drag & drop ou sélecteur fichier
- Formats acceptés: PNG, JPG, WebP (max 5MB)
- Prévisualisation
- Bouton "Projeter"
- Upload en base ou stockage cloud
- Envoi via WebSocket
- Toast de confirmation

**Frontend:** `/apps/frontend/components/visual-projection-dialog.tsx`

---

### US-MJ21: Effacer la projection courante
**En tant que** MJ
**Je veux** effacer l'image projetée
**Afin de** revenir à un écran vierge

**Critères d'acceptation:**
- Bouton "Effacer" dans le projecteur
- Envoi du message `{ type: 'none' }` via WebSocket
- L'écran des joueurs devient vierge
- Toast de confirmation

**Frontend:** `/apps/frontend/components/visual-projection-dialog.tsx`

---

## V. DÉS ET JETS DE SORT

### US-MJ22: Faire un jet de dés public
**En tant que** MJ
**Je veux** faire un jet de dés visible par tous les joueurs
**Afin de** résoudre les actions du scénario

**Critères d'acceptation:**
- Component "GMRollWithEffects"
- Champ formule dés (ex: "1d100", "2d6+3")
- Validation de la formule
- Bouton "Lancer les dés"
- Calcul du résultat côté serveur
- Affichage du résultat avec:
  - Formule lancée
  - Dés individuels (ex: [4, 5, 1])
  - Résultat total
  - Icône dé animée
- Son de dés (option)
- Envoi via WebSocket à tous les joueurs
- Historique des lancers

**Endpoint backend:** `POST /api/dice/roll`
**Frontend:** `/apps/frontend/components/gm-roll-with-effects.tsx`

---

### US-MJ23: Faire un jet de dés secret
**En tant que** MJ
**Je veux** faire un jet de dés que seul je vois
**Afin de** résoudre des actions cachées

**Critères d'acceptation:**
- Toggle "Secret" dans le roller
- Quand activé: `isSecret = true`
- Résultat visible uniquement au MJ
- Les joueurs reçoivent un message: "Le MJ a lancé un dé secret"
- Historique du MJ contient les résultats secrets
- Historique public masque les résultats secrets

**Endpoint backend:** `POST /api/dice/roll` avec `{ isSecret: true }`
**Frontend:** `/apps/frontend/components/gm-roll-with-effects.tsx`

---

### US-MJ24: Faire un jet de sanité
**En tant que** MJ
**Je veux** lancer un test de sanité sur plusieurs personnages
**Afin de** appliquer les effets de choc/folie

**Critères d'acceptation:**
- Presets de sanité dans le roller:
  - Sanité mineure: 1d4
  - Sanité modérée: 1d8
  - Sanité majeure: 2d10
- Sélection des personnages affectés
- Lance la formule pour chaque personnage
- Affiche résultats détaillés par personnage
- Option pour appliquer directement les dégâts de sanité
- Toast de confirmation

**Frontend:** `/apps/frontend/components/gm-roll-with-effects.tsx`

---

### US-MJ25: Faire un jet de dégâts
**En tant que** MJ
**Je veux** lancer un jet de dégâts rapidement
**Afin de** appliquer les dégâts aux personnages

**Critères d'acceptation:**
- Presets de dégâts:
  - Légers: 1d6
  - Moyens: 2d6
  - Lourds: 3d6+2
- Sélection des personnages affectés
- Lance pour chaque personnage
- Option pour appliquer automatiquement
- Toast de confirmation

**Frontend:** `/apps/frontend/components/gm-roll-with-effects.tsx`

---

### US-MJ26: Voir l'historique des dés de la session
**En tant que** MJ
**Je veux** voir tous les dés lancés dans la session
**Afin de** référencer les résultats antérieurs

**Critères d'acceptation:**
- View "Historique des dés"
- Liste avec:
  - Timestamp
  - Formule lancée
  - Résultats détaillés (dés individuels)
  - Résultat total
  - Statut (public/secret)
  - Statut des effets appliqués
- Filtrer par: tous/publics/secrets
- Limit: derniers 50 lancers
- Scroll area

**Endpoint backend:** `GET /api/dice/sessions/{sessionId}/rolls`
**Frontend:** `/apps/frontend/components/roll-history-visual.tsx`

---

## VI. EFFETS SUR LES PERSONNAGES

### US-MJ27: Appliquer un effet à un personnage
**En tant que** MJ
**Je veux** appliquer des effets (buffs/debuffs) aux personnages
**Afin de** modifier leurs statuts et capacités

**Critères d'acceptation:**
- Dialog ou formulaire "Appliquer effet"
- Sélection du personnage
- Type d'effet:
  - Sanité (perte de points)
  - Santé (dégâts/guérison)
  - Chance (bonus/malus)
  - Magie (bonus/malus)
  - Personnalisé (texte libre)
- Valeur (nombre de points)
- Description optionnelle
- Durée optionnelle (temporaire/permanent)
- Bouton "Appliquer"
- L'effet est enregistré en base
- Toast de confirmation
- Mise à jour en temps réel du personnage

**Endpoint backend:** `POST /api/characters/{id}/effects` ou `POST /api/effects`
**Frontend:** Intégré dans `/apps/frontend/components/gm-roll-with-effects.tsx`

---

### US-MJ28: Voir les effets actifs d'un personnage
**En tant que** MJ
**Je veux** voir tous les effets actuels sur un personnage
**Afin de** gérer ses statuts

**Critères d'acceptation:**
- Affichage des effets actifs sur chaque personnage:
  - Nom/type de l'effet
  - Valeur du modificateur
  - Description
  - Durée restante (si temporaire)
- Affichage dans la card du personnage
- Ou dans un panneau détail du personnage

**Endpoint backend:** Inclus dans `GET /api/sessions/{id}/characters`
**Frontend:** `/apps/frontend/components/enhanced-character-card.tsx`

---

### US-MJ29: Retirer un effet
**En tant que** MJ
**Je veux** enlever un effet d'un personnage
**Afin de** corriger ou mettre fin à un effet

**Critères d'acceptation:**
- Bouton X sur chaque effet affiché
- Confirmation optionnelle
- Suppression en base de données
- Toast de confirmation
- Mise à jour immédiate du personnage

**Endpoint backend:** `DELETE /api/effects/{id}` ou `PATCH /api/effects/{id}` avec `{ active: false }`
**Frontend:** `/apps/frontend/components/enhanced-character-card.tsx`

---

## VII. GESTION DE L'AMBIANCE

### US-MJ30: Gérer la musique et les ambiances sonores
**En tant que** MJ
**Je veux** contrôler l'ambiance sonore de la session
**Afin de** créer une atmosphère immersive

**Critères d'acceptation:**
- Component "UnifiedAmbientController"
- Catégories de sons:
  - Atmosphère (cosmic void, caverne, vent, etc.)
  - Localisation (bibliothèque, crypte, manoir, etc.)
  - Événements (rituel, combat, découverte, etc.)
- Sélection de son ambiant
- Slider de volume (0-100)
- Bouton play/stop
- Affichage du son actuel
- Sons générés côté client via Web Audio API
- Multiple sons peuvent jouer simultanément
- Sauvegarde de la préférence de volume

**Frontend:** `/apps/frontend/components/unified-ambient-controller.tsx`

---

### US-MJ31: Utiliser les presets d'ambiance narrative
**En tant que** MJ
**Je veux** avoir des descriptions d'ambiance pré-faites
**Afin de** établir rapidement l'atmosphère

**Critères d'acceptation:**
- Presets narrative:
  - Bibliothèque Interdite
  - Crypte Oubliée
  - Manoir Abandonné
  - Rituel Nocturne
  - Etc.
- Chaque preset a:
  - Description narrative (prose)
  - Suggestion de musique
  - Ambiance sonore suggérée
  - Mood tag
- Click sur preset envoie la description aux joueurs
- Ajout à l'historique narratif

**Frontend:** `/apps/frontend/components/narrative-tools.tsx`

---

### US-MJ32: Donner des accroches narratives (story hooks)
**En tant que** MJ
**Je veux** avoir accès à des accroches narratives
**Afin de** lancer des intrigues rapidement

**Critères d'acceptation:**
- Banque d'accroches pré-écrites (Lovecraft/CoC themed):
  - "Un télégramme urgent arrive..."
  - "Dans vos rêves récurrents..."
  - "Le journal titre: Disparitions mystérieuses..."
  - "Une étoile nouvelle brille..."
  - "Les animaux fuient vers le sud..."
- Click sur accroche la lit aux joueurs
- Envoi via WebSocket
- Ajout à l'historique narratif

**Frontend:** `/apps/frontend/components/narrative-tools.tsx`

---

### US-MJ33: Écrire une narration personnalisée
**En tant que** MJ
**Je veux** écrire ma propre narration et la lire aux joueurs
**Afin de** contrôler complètement le récit

**Critères d'acceptation:**
- Textarea "Narration personnalisée"
- Bouton "Lire aux joueurs"
- Envoi du texte via WebSocket
- Affichage en temps réel sur les écrans des joueurs
- Historique de toutes les narrations
- Mise en forme (couleur, italique, etc.)

**Frontend:** `/apps/frontend/components/narrative-tools.tsx`

---

## VIII. JOURNAL NARRATIF ET NOTES

### US-MJ34: Accéder au journal narratif de la session
**En tant que** MJ
**Je veux** voir l'historique complet des événements narratifs
**Afin de** tracker la progression du jeu

**Critères d'acceptation:**
- Component "NarrativeJournal"
- Affichage chronologique de:
  - Chapitres créés/modifiés
  - Événements narratifs importants
  - Dés lancés (publics)
  - Notes du MJ
  - Timestamp de chaque entrée
- Scroll area avec many entrées
- Filtrer par: tous/chapitres/dés/notes
- Ajouter des notes au journal

**Frontend:** `/apps/frontend/components/narrative-journal.tsx`

---

### US-MJ35: Ajouter des notes au journal
**En tant que** MJ
**Je veux** ajouter mes propres notes au journal
**Afin de** documenter ma session

**Critères d'acceptation:**
- Textarea pour ajouter une note
- Bouton "Ajouter au journal"
- Note enregistrée avec timestamp
- Affichée immédiatement dans le journal
- Visible uniquement au MJ
- Peut être modifiée ultérieurement

**Frontend:** `/apps/frontend/components/narrative-journal.tsx`

---

## IX. TABLEAU DE JEU (GAMEBOARD)

### US-MJ36: Voir le GameBoard pour les joueurs
**En tant que** MJ
**Je veux** afficher un tableau de jeu public aux joueurs
**Afin de** partager l'expérience visuelle

**Critères d'acceptation:**
- Vue séparée: `/sessions/{sessionId}/gameboard`
- Page fullscreen dédiée aux joueurs
- Affichage:
  - Image projetée (grande et centrée)
  - Liste des personnages (sidebar)
  - Indicateur de connexion des joueurs
  - Nom de la session
- Mise à jour en temps réel via WebSocket
- Responsive: adaptée à grand écran/projecteur
- Option fullscreen browser
- Affichage basique sans contrôles MJ

**Frontend:** `/apps/frontend/app/(dashboard)/sessions/[sessionId]/gameboard/page.tsx`

---

### US-MJ37: Cacher/afficher la liste des joueurs
**En tant que** MJ
**Je veux** masquer la liste des joueurs du GameBoard
**Afin de** garder le focus sur l'image

**Critères d'acceptation:**
- Bouton toggle sur le GameBoard
- Masque/affiche la sidebar des personnages
- État sauvegardé pour la session
- Envoyé aux joueurs via WebSocket

**Frontend:** `/apps/frontend/app/(dashboard)/sessions/[sessionId]/gameboard/page.tsx`

---

## X. GESTION DES PERSONNAGES (CÔTÉ MJ)

### US-MJ38: Ajouter des points de compétence à un personnage
**En tant que** MJ
**Je veux** donner des points de compétence à un personnage
**Afin de** récompenser la progression

**Critères d'acceptation:**
- Bouton/dialog "Ajouter points de compétence"
- Champ nombre de points
- Bouton "Ajouter"
- Points ajoutés à la pool du personnage
- Toast de confirmation
- Historique des modifications

**Endpoint backend:** `POST /api/characters/{id}/skill-points`
**Frontend:** Integrated dans dashboard

---

### US-MJ39: Générer un avatar IA pour un personnage
**En tant que** MJ
**Je veux** générer un portrait IA pour un personnage spécifique
**Afin de** donner une face au personnage

**Critères d'acceptation:**
- Click sur personnage → "Générer portrait"
- Utilise description occupée + attributs
- Génère via DALL-E 3
- Affiche image générée
- Option pour régénérer
- Sauvegarde en base
- Toast de confirmation

**Endpoint backend:** `POST /api/characters/{characterId}/generate-avatar`
**Frontend:** `/apps/frontend/app/(dashboard)/sessions/[sessionId]/page.tsx`

---

### US-MJ40: Gérer l'inventaire des personnages
**En tant que** MJ
**Je veux** ajouter/modifier des objets dans l'inventaire d'un personnage
**Afin de** gérer son équipement

**Critères d'acceptation:**
- Dialog "Inventaire"
- Affichage des objets actuels
- Ajouter un objet: nom, description, quantité
- Modifier un objet
- Supprimer un objet
- Sauvegarde en base
- Toast de confirmation

**Endpoint backend:** `GET /api/characters/{id}/inventory`, `POST /api/characters/{id}/inventory`
**Frontend:** `/apps/frontend/components/character-inventory-manager.tsx`

---

## XI. CONTRÔLES DE SESSION EN TEMPS RÉEL

### US-MJ41: Notifications en temps réel via WebSocket
**En tant que** MJ
**Je veux** être notifié en temps réel des actions des joueurs
**Afin de** rester synchronisé

**Critères d'acceptation:**
- WebSocket room `session:{sessionId}`
- Types de messages:
  - `user_joined`: joueur connecté
  - `user_left`: joueur déconnecté
  - `character_updated`: personnage modifié
  - `effect_applied`: effet appliqué
  - `projection_update`: nouvelle projection
- Toasts/notifications pour chaque événement
- Invalidation des queries React Query pertinentes
- Logs de debug en console

**Backend:** WebSocket events via `/modules/websockets`

---

### US-MJ42: Voir l'indicateur de connexion
**En tant que** MJ
**Je veux** voir si ma connexion au serveur est active
**Afin de** savoir si les données se synchronisent

**Critères d'acceptation:**
- Indicateur visuel dans l'header
- Vert = connecté
- Gris/rouge = déconnecté
- Tooltip avec statut
- Reconnexion automatique
- Toast si déconnexion/reconnexion

**Frontend:** `/apps/frontend/components/connection-indicator.tsx`

---

## XII. API ENDPOINTS RÉSUMÉ

### Sessions
- `GET /api/sessions` - Lister toutes les sessions du MJ
- `POST /api/sessions` - Créer une nouvelle session
- `GET /api/sessions/{id}` - Détails d'une session
- `PATCH /api/sessions/{id}` - Mettre à jour (status, nom, etc.)
- `DELETE /api/sessions/{id}` - Supprimer une session
- `GET /api/sessions/{id}/characters` - Lister les personnages

### Chapters
- `GET /api/sessions/{sessionId}/chapters` - Lister chapitres
- `POST /api/sessions/{sessionId}/chapters` - Créer chapitre
- `PATCH /api/chapters/{id}` - Modifier chapitre
- `DELETE /api/chapters/{id}` - Supprimer chapitre

### Characters
- `GET /api/sessions/{id}/characters` - Lister personnages
- `DELETE /api/sessions/{sessionId}/characters/{characterId}` - Retirer joueur
- `POST /api/characters/{id}/effects` - Appliquer effet
- `POST /api/characters/{id}/skill-points` - Ajouter points compétence
- `POST /api/characters/{characterId}/generate-avatar` - Générer avatar
- `GET /api/characters/{id}/inventory` - Inventaire
- `POST /api/characters/{id}/inventory` - Ajouter objet inventaire

### Dice
- `POST /api/dice/roll` - Lancer dés
- `GET /api/dice/sessions/{sessionId}/rolls` - Historique dés

### Effects
- `POST /api/effects` - Créer effet
- `PATCH /api/effects/{id}` - Modifier effet

### GameBoard
- `GET /api/gameboards/{sessionId}` - Récupérer state
- `PATCH /api/gameboards/{id}` - Mettre à jour projection

### AI
- `POST /api/ai/generate-scene` - Générer image IA
- `POST /api/ai/generate-avatar` - Générer portrait
- `POST /api/ai/suggest-narrative` - Suggestions narratives
- `POST /api/ai/sessions/{sessionId}/generate-all-avatars` - Batch avatars

---

## XIII. FICHIERS CLÉS DU PROJET

### Frontend
- **Pages:** `/apps/frontend/app/(dashboard)/sessions/`
  - `page.tsx` - Gestion des sessions
  - `[sessionId]/page.tsx` - GM Dashboard principal
  - `[sessionId]/gameboard/page.tsx` - GameBoard public

### Components
- `chapter-manager.tsx` - Gestion des chapitres
- `gm-roll-with-effects.tsx` - Dice roller et effets
- `unified-ambient-controller.tsx` - Ambiance sonore
- `visual-projection-dialog.tsx` - Projection images
- `narrative-tools.tsx` - Outils narratifs
- `narrative-journal.tsx` - Journal de session
- `enhanced-character-card.tsx` - Affichage personnages
- `import-character-dialog.tsx` - Import de personnages

### Backend
- `/apps/backend/src/modules/sessions/` - Gestion sessions
- `/apps/backend/src/modules/chapters/` - Gestion chapitres
- `/apps/backend/src/modules/characters/` - Gestion personnages
- `/apps/backend/src/modules/effects/` - Gestion effets
- `/apps/backend/src/modules/dice/` - System de dés
- `/apps/backend/src/modules/gameboard/` - Tableau de jeu
- `/apps/backend/src/modules/ai/` - Services IA
- `/apps/backend/src/modules/websockets/` - Temps réel

---

## XIV. NOTES D'IMPLÉMENTATION

### WebSocket Events
Les messages WebSocket utilisent un pattern: `{ type: 'event_name', data: {...} }`

### Authentification
- JWT Bearer token requis pour tous les endpoints sauf gameboard publique
- Le MJ est vérifié via `req.user.id`
- Protection: vérifier `session.gmId === userId` avant modifications

### Validation
- Utiliser Zod pour validation frontend et DTO NestJS côté backend
- Never trust client-side validation seule

### Erreurs Courantes MJ
1. Oublier de vérifier les permissions du MJ
2. Pas de toast de confirmation après action
3. WebSocket non synchronisé en temps réel
4. Images projetées non responsive

---

**Total: 42 User Stories MJ**
**Statut: Complet et couvrant tous les modules disponibles**

