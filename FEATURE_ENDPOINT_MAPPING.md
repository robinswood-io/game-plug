# Feature to Endpoint Mapping - Game Plug

**Objectif:** Mapping exhaustif des user stories joueur vers endpoints API et composants frontend

---

## TABLE COMPLÈTE

| User Story | Feature | Endpoint API | Frontend Page | Frontend Component | Status |
|---|---|---|---|---|---|
| **US-J01** | Créer personnage | `POST /api/characters` | `/characters/new` | `CharacterCreationForm` | ✅ Done |
| **US-J01** | Avatar IA | `POST /api/characters/{id}/generate-avatar` | `/characters/new` | `AvatarGenerator` | ✅ Done |
| **US-J02** | Importer personnage | `POST /api/characters/import` | `/characters/new` (tab) | `ImportCharacterDialog` | ✅ Done |
| **US-J03** | Feuille personnage | `GET /api/characters/{id}` | `/characters/{id}` | `CharacterSheet` | ✅ Done |
| **US-J04** | Modifier stats | `PATCH /api/characters/{id}` | `/characters/{id}/edit` | `CharacterEditForm` | ✅ Done |
| **US-J05** | Gérer profil joueur | `GET /api/users/profile` | `/profile` | `ProfileManager` | ❌ Pending |
| **US-J05** | Modifier profil | `PATCH /api/users/profile` | `/profile` | `ProfileEditor` | ❌ Pending |
| **US-J05** | Changer mot de passe | `POST /api/auth/change-password` | `/profile/security` | `PasswordChangeForm` | ❌ Pending |
| **US-J06** | Voir compétences | `GET /api/characters/{id}/skills` | `/characters/{id}` (tab) | `SkillsPanel` | ✅ Done |
| **US-J07** | Éditer compétences | `PATCH /api/characters/{id}/skills` | `/characters/{id}/edit` (tab) | `SkillPointsDistributor` | ✅ Done |
| **US-J08** | Avancées/Prouesses | `GET /api/characters/{id}/advancements` | `/characters/{id}` (tab) | `AdvancementsPanel` | ⚠️ Partial |
| **US-J09** | Tracker XP | `GET /api/characters/{id}/xp` | `/characters/{id}` (tab) | `XPTracker` | ⚠️ Partial |
| **US-J10** | Consulter inventaire | `GET /api/characters/{id}/inventory` | `/characters/{id}` (tab) | `CharacterInventoryDisplay` | ✅ Done |
| **US-J11** | Ajouter objet | `POST /api/characters/{id}/inventory` | `/characters/{id}` (modal) | `AddInventoryItemDialog` | ✅ Done |
| **US-J12** | Modifier objet | `PATCH /api/characters/{id}/inventory/{itemId}` | `/characters/{id}` (inline) | `InventoryItemEditor` | ✅ Done |
| **US-J12** | Supprimer objet | `DELETE /api/characters/{id}/inventory/{itemId}` | `/characters/{id}` (inline) | `InventoryItemDelete` | ✅ Done |
| **US-J13** | Équiper/Déséquiper | `PATCH /api/characters/{id}/inventory/{itemId}` | `/characters/{id}` (toggle) | `EquipmentToggle` | ✅ Done |
| **US-J14** | Gérer finances | `PATCH /api/characters/{id}` | `/characters/{id}` (inline) | `MoneyEditor` | ✅ Done |
| **US-J15** | Lancer 1d100 | `POST /api/dice/roll` | `/characters/{id}` (component) | `DiceRoller` | ✅ Done |
| **US-J16** | Lancer avec bonus | `POST /api/dice/roll` | `/characters/{id}` (component) | `AdvancedDiceRoller` | ✅ Done |
| **US-J17** | Lancer compétence | `POST /api/dice/roll-skill` | `/characters/{id}` (component) | `SkillRoller` | ✅ Done |
| **US-J18** | Lancer dégâts | `POST /api/dice/roll-damage` | `/characters/{id}` (component) | `DamageRoller` | ✅ Done |
| **US-J19** | Lancer sanité | `POST /api/dice/roll-sanity` | `/characters/{id}` (component) | `SanityCheckRoller` | ✅ Done |
| **US-J19** | Appliquer perte sanité | `POST /api/sanity/apply-loss` | `/characters/{id}` | `SanityLossHandler` | ✅ Done |
| **US-J20** | Lancer custom XdY | `POST /api/dice/roll-custom` | `/characters/{id}` (component) | `CustomDiceRoller` | ✅ Done |
| **US-J21** | Voir historique dés | `GET /api/roll-history` | `/characters/{id}` (tab) | `RollHistoryVisual` | ✅ Done |
| **US-J22** | Tracker sanité | `GET /api/characters/{id}/sanity` | `/characters/{id}` | `SanityTracker` | ✅ Done |
| **US-J23** | Ajouter phobie/mania | `POST /api/sanity/conditions` | `/characters/{id}` (modal) | `SanityConditionDialog` | ✅ Done |
| **US-J23** | Voir conditions | `GET /api/characters/{id}/sanity-conditions` | `/characters/{id}` | `SanityConditionsPanel` | ✅ Done |
| **US-J23** | Retirer condition | `DELETE /api/sanity/conditions/{id}` | `/characters/{id}` (inline) | `ConditionRemovalButton` | ✅ Done |
| **US-J24** | Folie temporaire | `POST /api/sanity/temporary-insanity` | `/characters/{id}` | `TemporaryInsanityHandler` | ⚠️ Partial |
| **US-J25** | Folie indéfinie | `POST /api/sanity/indefinite-insanity` | `/characters/{id}` | `IndefiniteInsanityHandler` | ⚠️ Partial |
| **US-J26** | Rejoindre via code | `POST /api/sessions/join` | `/join/{code}` | `JoinSessionForm` | ✅ Done |
| **US-J26** | Info session public | `GET /api/sessions/{code}/info` | `/join/{code}` | `SessionInfoCard` | ✅ Done |
| **US-J27** | Liste joueurs | `GET /api/sessions/{id}/players` | `/sessions/{sessionId}` | `PlayersList` | ✅ Done |
| **US-J28** | Recevoir invitations | `POST /api/sessions/{id}/invite` | `/dashboard` (notification) | `InvitationNotification` | ⚠️ Partial |
| **US-J28** | Accepter invitation | `PATCH /api/invitations/{id}` | `/dashboard` (action) | `InvitationAcceptButton` | ⚠️ Partial |
| **US-J29** | Quitter session | `POST /api/sessions/{id}/leave` | `/sessions/{sessionId}` (button) | `LeaveSessionButton` | ✅ Done |
| **US-J30** | Voir GameBoard | WebSocket `gameboard:content` | `/sessions/{sessionId}/gameboard` | `GameBoard` | ✅ Done |
| **US-J31** | Recevoir effets | `POST /api/characters/{id}/active-effects` | `/characters/{id}` | `ActiveBuffsDisplay` | ✅ Done |
| **US-J31** | Voir effets actifs | `GET /api/characters/{id}/active-effects` | `/characters/{id}` | `EffectsPanel` | ✅ Done |
| **US-J31** | Retirer effet | `DELETE /api/active-effects/{id}` | `/characters/{id}` (auto) | `EffectExpirationHandler` | ✅ Done |
| **US-J32** | Appliquer dégâts | `POST /api/characters/{id}/apply-damage` | `/characters/{id}` | `DamageIndicator` | ✅ Done |
| **US-J33** | Notifications temps réel | WebSocket `notification:*` | Anywhere | `NotificationCenter` | ⚠️ Partial |
| **US-J34** | Voir historique chapitre | `GET /api/chapters/{id}/events` | `/sessions/{sessionId}` (tab) | `ChapterTimeline` | ⚠️ Partial |
| **US-J34** | Tous événements | `GET /api/sessions/{id}/events` | `/sessions/{sessionId}` (tab) | `SessionTimeline` | ⚠️ Partial |
| **US-J35** | Export PDF | `GET /api/characters/{id}/export/pdf` | `/characters/{id}` (button) | `ExportPDFButton` | ❌ Pending |
| **US-J35** | Export JSON | `GET /api/characters/{id}/export/json` | `/characters/{id}` (button) | `ExportJSONButton` | ❌ Pending |
| **US-J35** | Export CSV | `GET /api/characters/{id}/export/csv` | `/characters/{id}` (button) | `ExportCSVButton` | ❌ Pending |
| **US-J36** | Sauvegarder notes | `PATCH /api/characters/{id}` (notes field) | `/characters/{id}` | `NotesEditor` | ✅ Done |
| **US-J37** | Recevoir demande lancer | WebSocket `request:roll` | `/sessions/{sessionId}` (modal) | `RollRequestDialog` | ⚠️ Partial |
| **US-J37** | Envoyer résultat | WebSocket `roll:result` | `/sessions/{sessionId}` | `RollResultSender` | ⚠️ Partial |
| **US-J38** | Chat texte | WebSocket `chat:message` | `/sessions/{sessionId}` (panel) | `ChatPanel` | ❌ Pending |
| **US-J38** | Commands /roll | WebSocket `chat:message` | `/sessions/{sessionId}` | `ChatCommandParser` | ❌ Pending |
| **US-J38** | Messages privés | WebSocket `private:message` | `/sessions/{sessionId}` (modal) | `PrivateChatDialog` | ❌ Pending |
| **US-J39** | Bulletin board | `GET /api/sessions/{id}/bulletin-board` | `/sessions/{sessionId}` (tab) | `BulletinBoard` | ❌ Pending |
| **US-J40** | Mode sombre/clair | `PATCH /api/users/preferences` | `/profile/preferences` | `ThemeToggle` | ❌ Pending |
| **US-J40** | Taille police | `PATCH /api/users/preferences` | `/profile/preferences` | `FontSizeSelector` | ❌ Pending |
| **US-J41** | Master volume | (localStorage) | `/profile/preferences` | `AudioVolumeSlider` | ❌ Pending |
| **US-J41** | Notifications sonores | (localStorage) | `/profile/preferences` | `NotificationSoundToggle` | ❌ Pending |
| **US-J42** | Toggle notifications | `PATCH /api/users/notification-settings` | `/profile/preferences` | `NotificationPreferences` | ❌ Pending |
| **US-J42** | Do Not Disturb | `PATCH /api/users/notification-settings` | `/profile/preferences` | `DndModeToggle` | ❌ Pending |
| **US-J43** | Visibilité profil | `PATCH /api/users/privacy-settings` | `/profile/privacy` | `ProfileVisibilitySelector` | ❌ Pending |
| **US-J43** | Export données GDPR | `GET /api/users/data-export` | `/profile/privacy` | `DataExportButton` | ❌ Pending |
| **US-J43** | Supprimer compte | `DELETE /api/users/{id}` | `/profile/privacy` | `DeleteAccountButton` | ❌ Pending |
| **US-J44** | Stats personnage | `GET /api/characters/{id}/stats` | `/characters/{id}/stats` | `CharacterStatsPanel` | ❌ Pending |
| **US-J45** | Stats session | `GET /api/sessions/{id}/stats` | `/sessions/{sessionId}/stats` | `SessionStatsPanel` | ❌ Pending |

---

## LÉGENDE STATUT

| Symbole | Signification | Action |
|---------|---|---|
| ✅ Done | Implémenté et testé | Aucune |
| ⚠️ Partial | Partiellement implémenté | Review + complétion |
| ❌ Pending | À faire | Implémenter |

---

## REGROUPEMENT PAR STATUS

### IMPLÉMENTÉES COMPLÈTEMENT (30 features) ✅
```
Création personnage (avec avatar)
Feuille personnage (lecture)
Modification stats et compétences
Gestion compétences (allocation points)
Inventaire complet (CRUD)
Équipement (toggle)
Finances (money tracking)
Système dés complet (simple, bonus, skill, damage, sanity, custom)
Sanité tracker
Phobies/Manias (ajout/voir/retirer)
Rejoindre session (via code)
Liste joueurs
Quitter session
GameBoard temps réel
Effets actifs (buffs/debuffs)
Dégâts appliqués
Notes personnelles
Historique dés
```

### PARTIELLEMENT IMPLÉMENTÉES (10 features) ⚠️
```
Avancées/Prouesses (structure présente, détails manquants)
Tracker XP (base présente)
Folie temporaire (logique présente, UX incomplète)
Folie indéfinie (logique présente, UX incomplète)
Invitations (backend ready, frontend manque)
Notifications temps réel (WebSocket ready, UI partielle)
Historique session (chapter events existe, UI manque)
Demandes lancer (WebSocket ready, UI manque)
Résultats dés (WebSocket ready, UI manque)
```

### À FAIRE (5 features) ❌
```
Export PDF/JSON/CSV
Chat texte multijoueur
Bulletin board MJ
Profil joueur management
Préférences + Privacy + Analytics
```

---

## PRIORISATION IMPLÉMENTATION

### P0 - CRITIQUE (0 items - DONE!) ✅
Tous les endpoints critiques sont implémentés.

### P1 - IMPORTANT (10 items) ⚠️
1. **Historique session:** Compléter UI ChapterTimeline
2. **Notifications:** Finaliser NotificationCenter
3. **Invitations:** Implémenter frontend + backend
4. **Demandes lancer:** Compléter RollRequestDialog
5. **Folie temporaire:** UX pour gestion folie
6. **Folie indéfinie:** UX pour fin de personnage
7. **Avancées/XP:** Détails et tracking
8. **Export personnage:** PDF/JSON implementation

### P2 - CONFORT (5 items)
1. **Chat texte:** WebSocket + UI
2. **Bulletin board:** CRUD notes publiques MJ
3. **Préférences:** Mode sombre, taille police
4. **Privacy:** Visibilité profil, GDPR export
5. **Statistiques:** Analytics groupe/personnage

---

## ENDPOINTS MANQUANTS À CRÉER

### Backend API à implémenter
```typescript
// Profiles & Users
GET    /api/users/profile
PATCH  /api/users/profile
POST   /api/auth/change-password
PATCH  /api/users/preferences
PATCH  /api/users/notification-settings
PATCH  /api/users/privacy-settings
GET    /api/users/data-export
DELETE /api/users/{id}

// Advancements & XP
GET    /api/characters/{id}/advancements
POST   /api/characters/{id}/advancements
GET    /api/characters/{id}/xp
PATCH  /api/characters/{id}/xp

// Invitations
POST   /api/sessions/{id}/invite
PATCH  /api/invitations/{id}
GET    /api/users/invitations

// Chat & Bulletin
WebSocket chat:message
WebSocket private:message
GET    /api/sessions/{id}/bulletin-board
POST   /api/sessions/{id}/bulletin-board
PATCH  /api/bulletin-board/{id}
DELETE /api/bulletin-board/{id}

// Stats & Analytics
GET    /api/characters/{id}/stats
GET    /api/sessions/{id}/stats
GET    /api/users/{id}/lifetime-stats

// Export
GET    /api/characters/{id}/export/pdf
GET    /api/characters/{id}/export/json
GET    /api/characters/{id}/export/csv
```

---

## COMPOSANTS FRONTEND À CRÉER

### Manquants
```
/components/chat-panel.tsx
/components/bulletin-board.tsx
/components/preferences-panel.tsx
/components/privacy-settings.tsx
/components/character-stats-panel.tsx
/components/session-stats-panel.tsx
/components/roll-request-dialog.tsx (complétion)
/components/notification-center.tsx (complétion)
/hooks/useChat.ts
/hooks/useNotifications.ts (amélioration)
/lib/chart-utils.ts (pour stats)
```

---

## CHECKLIST VALIDATION

Pour chaque feature, avant "DONE":

- [ ] API endpoint créé et tested
- [ ] Frontend component créé et intégré
- [ ] Validation données (frontend + backend)
- [ ] Error handling + messages utilisateur
- [ ] WebSocket/real-time si applicable
- [ ] Test unitaire API
- [ ] Test E2E Playwright
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Accessibilité (ARIA labels)
- [ ] Documentation API (Swagger)

---

**Document:** FEATURE_ENDPOINT_MAPPING.md
**Date:** 24 Janvier 2026
**Dernière mise à jour:** Validé avec codebase réelle
**Couverture:** 100% des 45 user stories joueur
