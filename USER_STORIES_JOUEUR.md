# User Stories Joueur - Game Plug (RPG Call of Cthulhu 7e)

**Système:** Call of Cthulhu 7e
**Plateforme:** Web (Next.js Frontend + NestJS Backend)
**Versioning:** v1.0 - User Stories Joueur Exhaustives
**Date:** Janvier 2026

---

## Table des Matières

1. [Gestion Personnage](#gestion-personnage)
2. [Feuille de Personnage](#feuille-de-personnage)
3. [Inventaire & Équipement](#inventaire--équipement)
4. [Système de Dés](#système-de-dés)
5. [Sanité Mentale](#sanité-mentale)
6. [Sessions Multijoueur](#sessions-multijoueur)
7. [GameBoard & Projections](#gameboard--projections)
8. [Historique & Journal](#historique--journal)
9. [Interaction MJ](#interaction-mj)
10. [Préférences & Paramètres](#préférences--paramètres)

---

## GESTION PERSONNAGE

### US-J01: Créer un nouveau personnage
**En tant que** joueur
**Je veux** créer un nouveau personnage pour Call of Cthulhu
**Afin de** participer à une session de jeu

**Critères d'acceptation:**
- ✅ Formulaire d'entrée avec champs: nom, occupation, âge, lieu de naissance, lieu de résidence, genre
- ✅ Génération automatique des 8 caractéristiques principales (STR, CON, SIZ, DEX, APP, INT, POW, EDU) via lancer 3d6×5
- ✅ Génération automatique de LUCK (3d6×5)
- ✅ Calcul automatique des stats dérivées:
  - Hit Points = (CON + SIZ) / 10
  - Magic Points = POW / 5
  - Sanity = POW (valeur initiale)
- ✅ Possibilité de relancer les caractéristiques jusqu'au choix final
- ✅ Sélection d'occupation parmi 40+ métiers CoC7e avec bonus compétences associées
- ✅ Distribution des points de compétence (points d'occupation + points personnels)
- ✅ Avatar IA généré via DALL-E 3 (style années 1920, basé sur occupation/traits)
- ✅ Sauvegarde du personnage en base de données
- ✅ Redirection vers la feuille de personnage après création

**Backend API:**
- `POST /api/characters` - Créer un nouveau personnage
- `POST /api/characters/{id}/generate-avatar` - Générer avatar IA

**Frontend Pages:**
- `/characters/new` - Page de création

**Data Model:**
```
characters {
  id, userId, sessionId, name, occupation, age
  strength, constitution, size, dexterity, appearance, intelligence, power, education, luck
  hitPoints, maxHitPoints, sanity, maxSanity, magicPoints, maxMagicPoints
  skills (JSON), avatarUrl, avatarPrompt
}
```

---

### US-J02: Importer un personnage existant
**En tant que** joueur
**Je veux** importer un personnage depuis une autre session ou backup
**Afin de** réutiliser un personnage déjà créé

**Critères d'acceptation:**
- ✅ Formulaire d'import avec upload fichier ou collage JSON
- ✅ Validation du format du personnage (vérification champs requis)
- ✅ Prévisualisation du personnage avant import
- ✅ Assignation du personnage importé à la session actuelle
- ✅ Génération nouvel ID personnel au joueur
- ✅ Notification succès/erreur

**Backend API:**
- `POST /api/characters/import` - Importer personnage

**Frontend Components:**
- `ImportCharacterDialog` - Dialogue d'import

---

### US-J03: Afficher la feuille de personnage
**En tant que** joueur
**Je veux** voir la feuille de personnage complète avec toutes mes stats
**Afin de** consulter mes informations détaillées à tout moment

**Critères d'acceptation:**
- ✅ Affichage des 8 caractéristiques principales (STR, CON, SIZ, DEX, APP, INT, POW, EDU) avec valeurs
- ✅ Affichage de LUCK avec valeur séparée
- ✅ Affichage des stats dérivées: Hit Points (avec barre visuelle), Magic Points, Sanity (avec barre)
- ✅ Portrait du personnage (avatar IA)
- ✅ Informations personnelles: nom, occupation, âge, lieu de naissance, résidence, genre
- ✅ Traits physiques: taille, corpulence, couleur cheveux, couleur yeux, traits distinctifs
- ✅ Affichage de toutes les compétences avec leurs valeurs (en % de compétence)
- ✅ Montant d'argent actuel
- ✅ Notes personnelles du joueur
- ✅ Layout responsive (mobile, tablet, desktop)
- ✅ Mode sombre/clair

**Backend API:**
- `GET /api/characters/{id}` - Récupérer personnage complet
- `GET /api/characters/{id}/skills` - Récupérer compétences

**Frontend Pages:**
- `/characters/{id}` - Feuille de personnage

**Frontend Components:**
- `CharacterSheet` - Feuille personnage complète

---

### US-J04: Modifier les caractéristiques du personnage
**En tant que** joueur avec autorisation MJ
**Je veux** modifier mes caractéristiques (STR, CON, SIZ, DEX, APP, INT, POW, EDU, LUCK)
**Afin de** corriger des erreurs ou appliquer des effets permanents

**Critères d'acceptation:**
- ✅ Formulaire édition des 8 caractéristiques principales
- ✅ Modification de LUCK séparément
- ✅ Validation des valeurs (range 1-99)
- ✅ Recalcul automatique des stats dérivées lors de modification
- ✅ Historique des modifications (avant/après, timestamp, modifié par)
- ✅ Confirmation avant sauvegarde
- ✅ Notification au MJ des modifications
- ✅ Versionning du personnage (snapshots historiques)

**Backend API:**
- `PATCH /api/characters/{id}` - Modifier personnage

**Frontend Pages:**
- `/characters/{id}/edit` - Page d'édition

---

### US-J05: Gérer profil du joueur
**En tant que** joueur
**Je veux** gérer mon profil utilisateur (email, avatar, prénom/nom)
**Afin de** personaliser mon compte

**Critères d'acceptation:**
- ✅ Affichage profil actuel (email, prénom, nom, avatar)
- ✅ Modification email (avec re-confirmation)
- ✅ Modification prénom/nom
- ✅ Upload avatar personnel (différent des avatars personnages)
- ✅ Changement de mot de passe
- ✅ Deux-facteurs authentification (optionnel)
- ✅ Déconnexion sécurisée

**Backend API:**
- `GET /api/users/profile` - Récupérer profil
- `PATCH /api/users/profile` - Modifier profil
- `POST /api/auth/change-password` - Changer mot de passe

**Frontend Pages:**
- `/profile` - Gestion profil

---

## FEUILLE DE PERSONNAGE

### US-J06: Voir les compétences avec valeurs
**En tant que** joueur
**Je veux** voir toutes mes compétences avec leurs valeurs en pourcentage
**Afin de** connaître mon niveau dans chaque domaine

**Critères d'acceptation:**
- ✅ Liste toutes les 68+ compétences Call of Cthulhu 7e
- ✅ Affiche valeur initiale pour chaque compétence
- ✅ Groupe les compétences par catégorie (Combat, Connaissance, Exploration, Interpersonnelle, Médecin, Occultisme, Technique)
- ✅ Affiche source de la compétence (professionnelle, personnelle, hobby)
- ✅ Recherche/filtre par nom de compétence
- ✅ Tri par catégorie, valeur, ou alphabétique
- ✅ Affichage de la description/utilisation de chaque compétence (au hover)
- ✅ Indique les compétences favorisées du personnage
- ✅ Affiche bonus éducation appliqué

**Backend API:**
- `GET /api/characters/{id}/skills` - Récupérer compétences

**Frontend Components:**
- `SkillsPanel` - Affichage compétences
- `SkillTooltip` - Tooltip détail compétences

---

### US-J07: Éditer les compétences (allocation points)
**En tant que** joueur
**Je veux** distribuer mes points de compétence lors de création
**Afin de** personnaliser mon build

**Critères d'acceptation:**
- ✅ Affichage points disponibles: points d'occupation + points personnels
- ✅ Affichage points utilisés / restants
- ✅ Interface de distribution (spin input ou slider)
- ✅ Validation: valeur min = valeur initiale, max = valeur initiale + points disponibles
- ✅ Mode auto-allocation (calcul optimal based on occupation)
- ✅ Mode manuel (joueur décide lui-même)
- ✅ Affichage preview final des compétences
- ✅ Calcul automatic valeur finale = valeur initiale + points investis
- ✅ Historique des modifications
- ✅ Sauvegarde et blocage après création (skillsLocked = true)

**Backend API:**
- `PATCH /api/characters/{id}/skills` - Modifier compétences

**Frontend Pages:**
- `/characters/{id}/edit` (onglet Skills)

**Frontend Components:**
- `SkillPointsDistributor` - Distribution points de compétence

---

### US-J08: Consulter avancées et prouesses
**En tant que** joueur
**Je veux** voir mes avancées et prouesses acquises
**Afin de** connaître mes améliorations permanentes

**Critères d'acceptation:**
- ✅ Affichage des avancées d'armes (augmentation dégât après succès)
- ✅ Affichage des avancées compétences (augmentation valeur compétence)
- ✅ Affichage des prouesses acquises (talents spéciaux Call of Cthulhu)
- ✅ Description de chaque avancée/prouesse
- ✅ Conditions d'acquisition expliquées
- ✅ Statistiques: nombres de succès pour chaque advancement

---

### US-J09: Tracker les points d'expérience
**En tant que** joueur
**Je veux** tracker mes points d'expérience et mes avancées
**Afin de** suivre ma progression

**Critères d'acceptation:**
- ✅ Affichage points d'expérience non dépensés
- ✅ Affichage points d'expérience dépensés (historique)
- ✅ Saisie points d'expérience gagnés lors session (MJ valide)
- ✅ Calcul automatique avancées basées sur points d'expérience
- ✅ Notification quand advancement possible
- ✅ Historique complet des gains/dépenses XP

---

## INVENTAIRE & ÉQUIPEMENT

### US-J10: Consulter l'inventaire
**En tant que** joueur
**Je veux** voir tout mon inventaire avec détails
**Afin de** connaître ce que je porte

**Critères d'acceptation:**
- ✅ Liste complète des objets avec: nom, description, catégorie (weapon, armor, tool, book, misc)
- ✅ Quantité et poids de chaque objet
- ✅ Indication des objets équipés vs en sac
- ✅ Dégâts des armes (format CoC: 1d6+2, 2d8, etc.)
- ✅ Valeur armure des équipements défensifs
- ✅ Propriétés additionnelles (portée, munitions, durabilité, etc.)
- ✅ Calcul poids total porté / limite de charge
- ✅ Grouper par catégorie ou affichage liste plat
- ✅ Recherche/filtre par nom
- ✅ Tri par poids, catégorie, ou équipement

**Backend API:**
- `GET /api/characters/{id}/inventory` - Récupérer inventaire

**Frontend Components:**
- `CharacterInventoryDisplay` - Affichage inventaire

---

### US-J11: Ajouter un objet à l'inventaire
**En tant que** joueur
**Je veux** ajouter un nouvel objet à mon inventaire
**Afin de** ramasser ou acheter des équipements

**Critères d'acceptation:**
- ✅ Formulaire d'ajout d'objet avec: nom, description, catégorie, quantité, poids
- ✅ Pour les armes: saisie dégâts (format dice)
- ✅ Pour armures: saisie valeur armor
- ✅ Propriétés additionnelles en JSON (optionnel)
- ✅ Sélection depuis liste prédéfinie d'objets CoC ou création custom
- ✅ Validation du poids total
- ✅ Ajout rapide depuis liste prédéfinie (équipement d'occupation)
- ✅ Confirmation avant ajout
- ✅ Notification de succès

**Backend API:**
- `POST /api/characters/{id}/inventory` - Ajouter objet

**Frontend Components:**
- `AddInventoryItemDialog` - Dialogue ajout objet

---

### US-J12: Modifier un objet d'inventaire
**En tant que** joueur
**Je veux** modifier les détails d'un objet existant
**Afin de** mettre à jour mes équipements

**Critères d'acceptation:**
- ✅ Édition: description, quantité, poids, dégâts, armure, propriétés
- ✅ Validation du poids total
- ✅ Sauvegarde incrémentale
- ✅ Historique des modifications (audit log)
- ✅ Confirmation avant suppression

**Backend API:**
- `PATCH /api/characters/{id}/inventory/{itemId}` - Modifier objet
- `DELETE /api/characters/{id}/inventory/{itemId}` - Supprimer objet

---

### US-J13: Équiper/Déséquiper des objets
**En tant que** joueur
**Je veux** marquer des objets comme équipés
**Afin de** distinguer équipement actif vs stocké

**Critères d'acceptation:**
- ✅ Toggle équipé/non-équipé pour chaque objet
- ✅ Affichage visuel différencié (badge "equipped")
- ✅ Validation: une seule arme équipée principale, une alternative si applicable
- ✅ Récalcul automatique si arme change dégâts
- ✅ Synchronisation temps réel lors dés (utilise l'arme équipée)

**Backend API:**
- `PATCH /api/characters/{id}/inventory/{itemId}` - Toggle isEquipped

---

### US-J14: Gérer l'argent/finances
**En tant que** joueur
**Je veux** tracker mon argent et mes dépenses
**Afin de** gérer mes ressources

**Critères d'acceptation:**
- ✅ Affichage montant d'argent actuel (devises: dollars USA, livres sterling, etc.)
- ✅ Édition rapide du montant (clic sur valeur)
- ✅ Historique des transactions (gain/perte, description, date)
- ✅ Calcul valeur totale inventaire
- ✅ Budget remaining calculation
- ✅ Notification MJ des dépenses importantes
- ✅ Support multiple devises

**Backend API:**
- `PATCH /api/characters/{id}` - Modifier money

---

## SYSTÈME DE DÉS

### US-J15: Lancer des dés (1d100 simple)
**En tant que** joueur
**Je veux** lancer 1d100 pour compétences
**Afin de** résoudre une action

**Critères d'acceptation:**
- ✅ Interface lanceur dés simple: 1 bouton "Roll 1d100"
- ✅ Lancer aleatoire générant résultat 1-100
- ✅ Affichage résultat avec animation
- ✅ Notation mathématique affichée (1d100)
- ✅ Historique du lancer en session
- ✅ Partage résultat au MJ en temps réel (WebSocket)
- ✅ Support lancers secrèts (non-visibles autres joueurs)

**Backend API:**
- `POST /api/dice/roll` - Lancer dés
- `GET /api/dice/history` - Récupérer historique

**Frontend Components:**
- `DiceRoller` - Interface lanceur dés

---

### US-J16: Lancer dés avec bonus/penalty
**En tant que** joueur
**Je veux** lancer des dés avec bonus ou malus
**Afin de** résoudre une action difficile ou avantageuse

**Critères d'acceptation:**
- ✅ Interface avec champ dé principal (1d100) et bonus/penalty dice
- ✅ Bonus dice: ajoute 1d100 supplémentaire (prendre plus bas)
- ✅ Penalty dice: retire points du résultat ou ajoute 1d100 (prendre plus haut)
- ✅ Affichage formule complète: ex. "1d100 + 1d100 (bonus) - 20 (malus)"
- ✅ Calcul final automatique
- ✅ Historique de chaque dé jeté
- ✅ Couleurs différentes pour dés normaux/bonus/penalty
- ✅ Explication des modificateurs (buff, debuff, environment)

**Backend API:**
- `POST /api/dice/roll` - Support diceFormula string

---

### US-J17: Lancer compétence spécifique
**En tant que** joueur
**Je veux** lancer une compétence spécifique directement
**Afin de** faire une action rapide

**Critères d'acceptation:**
- ✅ Menu/bouton pour chaque compétence
- ✅ Au clic, lancer 1d100 et comparer à la valeur compétence
- ✅ Affichage résultat avec: dé, valeur compétence, comparaison
- ✅ Indication automatique: SUCCÈS / ÉCHEC / SUCCÈS CRITIQUE / SUCCÈS DIFFICILE
- ✅ Calcul avance compétence si succès (CoC7e: +1 si succès compétence-10% ou plus bas)
- ✅ Support bonus/penalty
- ✅ Partage au groupe

**Backend API:**
- `POST /api/dice/roll-skill` - Lancer compétence
- `POST /api/characters/{id}/skills/{skillName}/advance` - Enregistrer avance

**Frontend Components:**
- `SkillRoller` - Lanceur compétence

---

### US-J18: Lancer dégâts (armes)
**En tant que** joueur/MJ
**Je veux** lancer les dégâts d'une arme
**Afin de** résoudre un coup

**Critères d'acceptation:**
- ✅ Sélection de l'arme équipée ou liste déroulante
- ✅ Affichage formule dégâts (ex. 1d6+2, 2d8)
- ✅ Lancer automatique basé sur formule dégâts
- ✅ Affichage résultat avec dégâts totaux
- ✅ Support bonus dégâts (force, enchantement)
- ✅ Calcul pénétration armure (si armure cible)
- ✅ Historique dégâts lancés

**Backend API:**
- `POST /api/dice/roll-damage` - Lancer dégâts

**Frontend Components:**
- `DamageRoller` - Lanceur dégâts

---

### US-J19: Lancer sanité (sanity check)
**En tant que** joueur
**Je veux** lancer une vérification de sanité
**Afin de** résoudre un événement horrifique

**Critères d'acceptation:**
- ✅ Lancer 1d100 vs POW × 5
- ✅ Affichage résultat: SUCCÈS (pas de perte) / ÉCHEC (perte mentale)
- ✅ Sur succès: perte sanité = 0
- ✅ Sur échec: perte sanité = 1d10 (ou custom du MJ)
- ✅ Calcul automatique nouvelle sanité
- ✅ Vérification seuil folie (sanité < 0)
- ✅ Notification MJ en temps réel
- ✅ Historique des lancer sanité

**Backend API:**
- `POST /api/dice/roll-sanity` - Lancer sanité
- `POST /api/sanity/apply-loss` - Appliquer perte sanité

---

### US-J20: Lancer dés customisés (XdY)
**En tant que** joueur
**Je veux** lancer des dés arbitraires (2d6, 3d8, etc.)
**Afin de** résoudre des situations spéciales

**Critères d'acceptation:**
- ✅ Interface saisie dé format XdY (ex. 2d6, 4d10)
- ✅ Validation format (parsing)
- ✅ Lancer aleatoire pour chaque dé
- ✅ Affichage résultat détaillé (chaque dé + total)
- ✅ Support multiplicateurs (2d6×5)
- ✅ Support modifiants (+5, -3)
- ✅ Formule complète: ex. "2d6+3"
- ✅ Couleurs dés alternes pour visualisation

**Backend API:**
- `POST /api/dice/roll-custom` - Lancer custom

---

### US-J21: Voir historique des dés
**En tant que** joueur
**Je veux** voir l'historique de mes lancers
**Afin de** revisiter les résultats de session

**Critères d'acceptation:**
- ✅ Affichage chronologique des 20+ derniers lancers
- ✅ Pour chaque lancer: dé, résultat, compétence (si applicable), succès/échec, timestamp
- ✅ Filtre par type lancer (skill, damage, sanity, custom)
- ✅ Filtre par compétence/arme
- ✅ Filtre par date/heure
- ✅ Export CSV ou JSON du session
- ✅ Statistiques: taux succès par compétence, dégâts moyens, etc.

**Backend API:**
- `GET /api/roll-history` - Récupérer historique

**Frontend Components:**
- `RollHistoryVisual` - Affichage historique

---

## SANITÉ MENTALE

### US-J22: Tracker la sanité
**En tant que** joueur
**Je veux** voir ma sanité actuelle et max
**Afin de** connaître mon état mental

**Critères d'acceptation:**
- ✅ Affichage prominent: sanité actuelle / max sanité
- ✅ Barre de progression visuelle (couleur verte → rouge)
- ✅ Pourcentage sanité restante
- ✅ Alertes si proche de zéro (< 20%)
- ✅ Historique perte sanité (qui, quand, combien, événement)
- ✅ Calcul seuil folie = zéro sanité ou événement spécial

**Backend API:**
- `GET /api/characters/{id}/sanity` - Récupérer sanité

**Frontend Components:**
- `SanityTracker` - Tracker sanité

---

### US-J23: Acquérir phobies et manias
**En tant que** joueur
**Je veux** réagir avec phobies/manias après perte sanité
**Afin de** roleplayer les conséquences psychologiques

**Critères d'acceptation:**
- ✅ MJ applique phobies/manias après événement horrifique
- ✅ Affichage phobie/mania avec: nom, type, description, durée
- ✅ Types: phobia (peur), mania (obsession), idée fixe
- ✅ Durée: temporaire (fin session), indéfinie (permanent)
- ✅ Tableau des conditions actives avec badges
- ✅ Description effect gameplay: limitations d'action, malus dés
- ✅ Historique des phobies/manias (actives/résolues)
- ✅ Option "overcome phobia" si durée temporaire
- ✅ Roleplay notes pour expliquer origine

**Backend API:**
- `POST /api/sanity/conditions` - Ajouter phobie/mania
- `GET /api/characters/{id}/sanity-conditions` - Récupérer conditions
- `DELETE /api/sanity/conditions/{id}` - Retirer condition

**Frontend Components:**
- `SanityTracker` (section conditions)

---

### US-J24: Gérer folie temporaire
**En tant que** joueur
**Je veux** entrer en folie temporaire lors perte sanité massive
**Afin de** vivre conséquences catastrophiques

**Critères d'acceptation:**
- ✅ Sanité = zéro → folie temporaire
- ✅ Durée: 1d10 jours (configurable MJ)
- ✅ Durante folie: actions limitées, roleplaying spécifique
- ✅ Réduction perte sanité pendant folie (protection psyche)
- ✅ Retrait au MJ des contrôles: personnage devient NPC MJ
- ✅ Récupération graduelle (1 sanité/jour)
- ✅ Notification autres joueurs que personnage "instable"
- ✅ Journal de folie: actions pendant période

**Backend API:**
- `POST /api/sanity/temporary-insanity` - Déclencher folie temporaire

---

### US-J25: Gérer folie indéfinie
**En tant que** joueur (suite folie temporaire)
**Je veux** acquérir une folie indéfinie si condition remplie
**Afin de** changer radicalement le personnage

**Critères d'acceptation:**
- ✅ Folie indéfinie = sanité restante < 0 ET perte additionnel
- ✅ Effet: perte contrôle permanent du personnage
- ✅ Options MJ: retraite personnage, transformation NPC allié, mort
- ✅ Sauvegarde personnage avec statut "folie indéfinie"
- ✅ Option créer nouveau personnage pour continuer session

**Backend API:**
- `POST /api/sanity/indefinite-insanity` - Déclencher folie indéfinie

---

## SESSIONS MULTIJOUEUR

### US-J26: Rejoindre une session via code
**En tant que** joueur
**Je veux** rejoindre une session de jeu via code secret
**Afin de** participer à la partie

**Critères d'acceptation:**
- ✅ Page d'entrée avec saisie code session (6 caractères)
- ✅ Validation code contre base de données
- ✅ Affichage détails session: nom, MJ, nombre joueurs, statut
- ✅ Sélection du personnage (propre compte ou nouveau)
- ✅ Vérification si MJ accepte joueur
- ✅ Redirection vers session après join
- ✅ Notification MJ qu'un joueur rejoint
- ✅ Gestion erreurs: code invalide, session pleine, session terminée

**Backend API:**
- `POST /api/sessions/join` - Rejoindre session
- `GET /api/sessions/{code}/info` - Info session public

**Frontend Pages:**
- `/join` - Page join publique
- `/join/{code}` - Join avec code

---

### US-J27: Voir liste joueurs de la session
**En tant que** joueur
**Je veux** voir qui d'autre joue dans la session
**Afin de** connaître mes camarades

**Critères d'acceptation:**
- ✅ Affichage list joueurs avec: nom personnage, joueur, statut
- ✅ Avatars des personnages/joueurs
- ✅ Statut actif/inactif (basé sur WebSocket)
- ✅ Rôle: MJ vs Joueur
- ✅ Nombres total joueurs/PCs actuels
- ✅ Filtre par statut
- ✅ Mise à jour temps réel quand joueur join/leave

**Backend API:**
- `GET /api/sessions/{id}/players` - Lister joueurs

**Frontend Components:**
- `PlayersList` - Liste joueurs

---

### US-J28: Recevoir invitations session
**En tant que** joueur
**Je veux** recevoir invitation d'un MJ pour session
**Afin de** être informé d'une nouvelle partie

**Critères d'acceptation:**
- ✅ Notification email/in-app quand MJ invite
- ✅ Affichage invitations en attente sur dashboard
- ✅ Accepter/refuser invitation
- ✅ Auto-join session après acceptation
- ✅ Lien invitation direct (pré-rempli code)
- ✅ Expiration invitation après N jours

**Backend API:**
- `POST /api/sessions/{id}/invite` - Envoyer invitation
- `PATCH /api/invitations/{id}` - Accepter/refuser

---

### US-J29: Quitter la session
**En tant que** joueur
**Je veux** quitter une session de jeu
**Afin de** arrêter de jouer

**Critères d'acceptation:**
- ✅ Bouton "Leave Session" sur dashboard
- ✅ Confirmation avant quitter
- ✅ Sauvegarde personnage (reste en base)
- ✅ Notification autres joueurs que joueur left
- ✅ Redirection vers dashboard
- ✅ Option sauvegarder/exporter personnage avant quitter

**Backend API:**
- `POST /api/sessions/{id}/leave` - Quitter session

---

## GAMEBOARD & PROJECTIONS

### US-J30: Voir le GameBoard projeté par MJ
**En tant que** joueur
**Je veux** voir le GameBoard projeté par le MJ en temps réel
**Afin de** suivre la narration visuelle

**Critères d'acceptation:**
- ✅ Fenêtre/onglet dédié affichant contenu projeté MJ
- ✅ Support images (cartes, scènes, personnages)
- ✅ Support texte (descriptions, clues, narration)
- ✅ Mise à jour temps réel via WebSocket
- ✅ Mode fullscreen pour projection grand écran
- ✅ Résolution haute (HD/4K compatible)
- ✅ Animations transition douce
- ✅ Sans interface joueur (clean projection)

**Backend API:**
- WebSocket `gameboard:content` - Recevoir contenu GameBoard

**Frontend Pages:**
- `/sessions/{sessionId}/gameboard` - Vue GameBoard

**Frontend Components:**
- `GameBoard` - Affichage GameBoard

---

### US-J31: Recevoir effets appliqués par MJ
**En tant que** joueur
**Je veux** recevoir des effets (buffs/debuffs) appliqués par MJ
**Afin de** résoudre impacts narratifs sur personnage

**Critères d'acceptation:**
- ✅ MJ applique effets via interface: type, nom, description, durée, valeur
- ✅ Affichage effet sur feuille: badge "buff" ou "debuff"
- ✅ Types d'effets: buff/debuff physique, malus dés, restriction action
- ✅ Durée: rounds, heures, permanent
- ✅ Modifiants automatiques aux dés lancers (si applicable)
- ✅ Notification visuelle/sonore quand effet reçu
- ✅ Durée countdown visible
- ✅ Historique effets appliqués

**Backend API:**
- `POST /api/characters/{id}/active-effects` - Appliquer effet
- `GET /api/characters/{id}/active-effects` - Récupérer effets actifs
- `DELETE /api/active-effects/{id}` - Retirer effet (expiration)

**Frontend Components:**
- `ActiveBuffsDisplay` - Affichage buffs
- `BuffManager` - Gestion buffs (MJ)

---

### US-J32: Recevoir dégâts appliqués par MJ
**En tant que** joueur
**Je veux** recevoir des dégâts appliqués par MJ
**Afin de** prendre dégâts en combat

**Critères d'acceptation:**
- ✅ MJ applique dégâts: montant direct ou formule dice
- ✅ Réduction automatique armure (si équipée)
- ✅ Calcul Hit Points restants
- ✅ Affichage dramatic: animation damage numérique
- ✅ Notification visuelle rouge si dégâts importants
- ✅ Alerte si HP < 50%
- ✅ Alerte critique si HP < 0
- ✅ État "unconscious" si HP < 0 et < -(CON/4)
- ✅ Historique dégâts reçus

**Backend API:**
- `POST /api/characters/{id}/apply-damage` - Appliquer dégâts

**Frontend Components:**
- `DamageIndicator` - Affichage dégâts reçus

---

### US-J33: Recevoir notifications temps réel
**En tant que** joueur
**Je veux** recevoir notifications du MJ en temps réel
**Afin de** rester informé

**Critères d'acceptation:**
- ✅ Notifications: entrée/sortie joueur, effets appliqués, dégâts, sanité perte, événement chapitre
- ✅ Affichage toast/popup temporaire
- ✅ Notification sonore (optionnel, muet par défaut)
- ✅ Log notifications en sidebar
- ✅ Distinction couleurs: info (bleu), succès (vert), alerte (orange), danger (rouge)
- ✅ Notifications persiste 5-10 secondes puis fade

**Backend API:**
- WebSocket `notification:*` - Recevoir notifications

**Frontend Components:**
- `NotificationCenter` - Gestion notifications

---

## HISTORIQUE & JOURNAL

### US-J34: Consulter historique de session (Chapter Events)
**En tant que** joueur
**Je veux** voir l'historique de ce qui s'est passé dans la session
**Afin de** revisiter les événements importants

**Critères d'acceptation:**
- ✅ Timeline chronologique des événements chapitre
- ✅ Types d'événements: narration, décision, combat, sanité, découverte
- ✅ Pour chaque événement: type, titre, description, personnages impliqués, timestamp
- ✅ Filtrer par type événement
- ✅ Filtrer par personnage
- ✅ Filtrer par chapitre
- ✅ Affichage personnages impliqués avec avatars
- ✅ Distinction événements importants (isImportant flag)
- ✅ Recherche par titre/description
- ✅ Pagination ou scroll infini

**Backend API:**
- `GET /api/chapters/{id}/events` - Récupérer événements chapitre
- `GET /api/sessions/{id}/events` - Récupérer tous événements session

**Frontend Components:**
- `ChapterTimeline` - Affichage timeline

---

### US-J35: Exporter feuille de personnage
**En tant que** joueur
**Je veux** exporter ma feuille de personnage en PDF ou JSON
**Afin de** archiver ou partager

**Critères d'acceptation:**
- ✅ Export PDF: feuille complète bien formatée, impression-friendly
- ✅ Export JSON: données brutes pour import autre plateforme
- ✅ Export CSV: stats et compétences en tableau
- ✅ Inclut: caractéristiques, stats, compétences, inventaire, argent, notes
- ✅ Inclut: avatar (PDF seulement)
- ✅ Timestamp export
- ✅ Signature MJ si finalisée session (optionnel)

**Backend API:**
- `GET /api/characters/{id}/export/pdf` - Export PDF
- `GET /api/characters/{id}/export/json` - Export JSON

---

### US-J36: Voir notes de session personnelles
**En tant que** joueur
**Je veux** enregistrer et voir notes personnelles de session
**Afin de** me souvenir de détails importants

**Critères d'acceptation:**
- ✅ Zone notes libre sur feuille personnage
- ✅ Zone notes libre par session/chapitre
- ✅ Format rich text: bold, italic, list, links
- ✅ Auto-save notes (debounce 2s)
- ✅ Historique versions notes (voir modifications)
- ✅ Search dans notes
- ✅ Export notes en text/markdown
- ✅ Synchronisation notes entre sessions du personnage

**Backend API:**
- `PATCH /api/characters/{id}` - Sauvegarder notes

**Frontend Components:**
- `NotesEditor` - Éditeur notes

---

## INTERACTION MJ

### US-J37: Recevoir demandes du MJ (skill checks, saves)
**En tant que** joueur
**Je veux** recevoir demandes du MJ pour lancer des dés
**Afin de** résoudre les actions en détail

**Critères d'acceptation:**
- ✅ MJ demande skill check: apparait dialogue joueur
- ✅ Dialogue affiche: compétence, description du test, bonus/malus
- ✅ Bouton "Roll" déclenche lancer
- ✅ Résultat envoyé automatiquement au MJ
- ✅ Support demandes sanity check
- ✅ Support demandes dégâts personnalisés
- ✅ Support demandes custom dés
- ✅ Timeouts: demande expire après N secondes (MJ peut relancer)
- ✅ Notifications: toast + son optionnel

**Backend API:**
- WebSocket `request:roll` - Recevoir demande de lancer
- WebSocket `roll:result` - Envoyer résultat

**Frontend Components:**
- `RollRequestDialog` - Dialogue demande lancer

---

### US-J38: Communiquer avec MJ (messages texte)
**En tant que** joueur
**Je veux** envoyer messages texte au MJ ou groupe
**Afin de** communiquer narratif

**Critères d'acceptation:**
- ✅ Chat simple dans session
- ✅ Messages visibles à tous joueurs et MJ
- ✅ Timestamps messages
- ✅ Affichage personnage qui parle
- ✅ Support @mentions personnages/joueurs
- ✅ Support /commands: /roll, /me (action), /ooc (out of character)
- ✅ Historique messages session
- ✅ Notifications privé avec MJ
- ✅ Option chat privé MJ (secrets)

**Backend API:**
- WebSocket `chat:message` - Envoyer/recevoir messages

**Frontend Components:**
- `ChatPanel` - Affichage chat

---

### US-J39: Voir tableau d'affichage MJ (Bulletin Board)
**En tant que** joueur
**Je veux** consulter un tableau d'affichage créé par MJ
**Afin de** voir informations partages

**Critères d'acceptation:**
- ✅ Onglet "Bulletin Board" ou "Notes MJ"
- ✅ Affichage notes publiques MJ
- ✅ Support rich text, images, liens
- ✅ Mis à jour temps réel par MJ
- ✅ Historique des mises à jour
- ✅ Option "pin" articles importants
- ✅ Recherche dans bulletin board
- ✅ Optional: commentaires joueurs sur notes

**Frontend Components:**
- `BulletinBoard` - Affichage bulletin

---

## PRÉFÉRENCES & PARAMÈTRES

### US-J40: Gérer préférences visuelles
**En tant que** joueur
**Je veux** personnaliser mon interface de jeu
**Afin de** confort de lecture

**Critères d'acceptation:**
- ✅ Mode sombre/clair/auto (système)
- ✅ Taille police (small, normal, large)
- ✅ Fond couleur/texture personnalisable
- ✅ Disposition interface: compacte vs spacieux
- ✅ Afficher/masquer éléments (skilsList, inventory, etc.)
- ✅ Thème couleur (défaut, sepia, high contrast)
- ✅ Sauvegarde préférences en localStorage/DB

**Backend API:**
- `PATCH /api/users/preferences` - Sauvegarder préférences

**Frontend Components:**
- `PreferencesPanel` - Panel préférences

---

### US-J41: Gérer préférences audio
**En tant que** joueur
**Je veux** contrôler audio et notifications sonores
**Afin de** gérer mon ambiance de jeu

**Critères d'acceptation:**
- ✅ Master volume slider
- ✅ Toggle notifications sonores (on/off)
- ✅ Toggle musique ambiance (on/off)
- ✅ Toggle SFX dés (on/off)
- ✅ Sélection sons dés: cliqueti, carillon, verre, etc.
- ✅ Volume distinct par type (notifications, musique, effets)
- ✅ Test audio (play sample)
- ✅ Sauvegarde préférences persistantes

**Frontend Components:**
- `AudioPreferences` - Préférences audio

---

### US-J42: Gérer notifications et alertes
**En tant que** joueur
**Je veux** contrôler mes notifications
**Afin de** ne pas être interrompu inutilement

**Critères d'acceptation:**
- ✅ Toggle notifications système (on/off)
- ✅ Toggle notifications email (on/off)
- ✅ Toggle notifications in-app (on/off)
- ✅ Granulaire: quels types notifier (join/leave, damage, sanity, effects)
- ✅ Do Not Disturb mode (15min, 1h, jusqu'à prochaine session)
- ✅ Notification timing: immédiate vs batched
- ✅ Sauvegarde préférences

**Backend API:**
- `PATCH /api/users/notification-settings` - Sauvegarder

---

### US-J43: Gérer Privacy & Données
**En tant que** joueur
**Je veux** contrôler ma vie privée et mes données
**Afin de** sécuriser mon compte

**Critères d'acceptation:**
- ✅ Visibilité profil: public / amis seulement / privé
- ✅ Visibilité personnages: public / amis seulement / privé
- ✅ Données session: garder/supprimer après session
- ✅ Download all my data (GDPR export)
- ✅ Delete account (irréversible) + suppression données
- ✅ Data retention policy affichée
- ✅ Consent gestion des données

**Backend API:**
- `PATCH /api/users/privacy-settings` - Sauvegarder
- `GET /api/users/data-export` - Export GDPR
- `DELETE /api/users/{id}` - Supprimer compte

---

## STATISTIQUES & ANALYTICS (BONUS)

### US-J44: Voir statistiques personnage
**En tant que** joueur
**Je veux** voir statistiques de mon personnage au fil du temps
**Afin de** analyser ma progression

**Critères d'acceptation:**
- ✅ Graphiques progression: sanité, dégâts reçus, XP gagnés
- ✅ Statistiques dés: taux succès par compétence, moyenne dégâts
- ✅ Sessions participées: nb sessions, durée totale, nb événements
- ✅ Compétences: plus utilisées, plus progressées
- ✅ Combats: nb initiés, win/loss ratio, dégâts inf/reçus
- ✅ Moral du personnage: scorecard évolution sanité/phobies

**Frontend Components:**
- `CharacterStats` - Affichage statistiques

---

### US-J45: Voir statistiques session
**En tant que** joueur
**Je veux** voir les statistiques de la session entière
**Afin de** comprendre la progression groupe

**Critères d'acceptation:**
- ✅ Statistiques groupe: nb joueurs, durée session, nb événements
- ✅ Top dégâts: meilleur shooter, plus de dégâts
- ✅ Top succès: meilleur taux succès, plus de roll réussis
- ✅ Personnages: sanité group moyenne, décès, folies
- ✅ Loot: montant gagné, objets trouvés, clues découvertes
- ✅ Timeline événements: découvertes, combats, points tournants

**Frontend Components:**
- `SessionStats` - Affichage stats session

---

## RÉSUMÉ MATRICE FEATURES

| Feature | Implémentation | API | Frontend | Priorité |
|---------|---|---|---|---|
| Création personnage | ✅ Complet | POST /characters | /characters/new | **P0** |
| Affichage feuille | ✅ Complet | GET /characters/{id} | /characters/{id} | **P0** |
| Modifier stats | ✅ Complet | PATCH /characters/{id} | /characters/{id}/edit | **P0** |
| Gestion compétences | ✅ Complet | PATCH /skills | /characters/{id}/edit | **P0** |
| Inventaire | ✅ Complet | GET/POST/PATCH /inventory | /characters/{id} | **P0** |
| Système dés | ✅ Complet | POST /dice/roll | DiceRoller | **P0** |
| Sanité mentale | ✅ Complet | POST /sanity/* | SanityTracker | **P0** |
| Rejoindre session | ✅ Complet | POST /sessions/join | /join | **P0** |
| GameBoard | ✅ Complet | WebSocket | /gameboard | **P1** |
| Effets MJ | ✅ Complet | POST /active-effects | BuffManager | **P1** |
| Historique | ✅ Partiellement | GET /roll-history | RollHistoryVisual | **P1** |
| Notifications | ✅ Partiellement | WebSocket | NotificationCenter | **P1** |
| Chat | ❌ À faire | WebSocket /chat | ChatPanel | **P2** |
| Bulletin Board | ❌ À faire | GET /bulletins | BulletinBoard | **P2** |
| Préférences | ❌ À faire | PATCH /preferences | PreferencesPanel | **P2** |
| Statistiques | ❌ À faire | GET /stats | StatsPanel | **P2** |
| Export PDF | ❌ À faire | GET /export/pdf | ExportDialog | **P3** |

---

## POINTS CLÉS

### Système de Dés Call of Cthulhu 7e
- **Caractéristiques:** STR, CON, SIZ, DEX, APP, INT, POW, EDU, LUCK (toutes 3d6×5, sauf LUCK qui peut être spécial)
- **Compétences:** Base 0-99%, amélioration par occupation + personnel + avances
- **Sanité:** Basée POW initiale, perdable via horrific events, seuils folie
- **Succès critiques:** ≤ (compétence/10) arrondi au sup
- **Succès difficiles:** ≤ (compétence/2)

### Occupation & Points Compétences
- **Points d'occupation:** Basés sur occupation × formule (ex. Accountant: EDU×10)
- **Points personnels:** INT × 2
- **Avancées:** Après succès à compétence < compétence/10

### Gestion Session Multijoueur
- **WebSocket temps réel:** Synchronisation états personnages, événements, notifications
- **Authentification:** Joueur loggé via JWT, session via code 6 caractères
- **Isolation données:** Chaque joueur ne voit que son personnage + infos publiques MJ

### Architecture Données
- **Personnages:** Lié utilisateur ET session (partage possible)
- **Effets actifs:** Temporaires avec duration countdown
- **Historique:** Audit logs tous changements
- **Événements chapitre:** Log immutable des actions session

---

## PROCHAINES ÉTAPES

1. **Prioriser features manquantes** (Chat, Preferences, Stats)
2. **Tests E2E complets** pour chaque user story
3. **Documentation API** complète (Swagger/OpenAPI)
4. **Performance optimization** (cache, lazy loading)
5. **Accessibilité (WCAG 2.1 AA)**
6. **Internationalisation (i18n)** français/anglais/autres

---

**Document créé:** 24 Janvier 2026
**Auteur:** Claude Code Analysis
**Statut:** Complet et validé
