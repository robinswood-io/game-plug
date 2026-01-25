# Bug Fixes Regression Tests

**Application:** Game Plug - Call of Cthulhu 7e RPG Platform

**Overview:** Tests de régression pour vérifier les 9 bugs corrigés durant cette session:
1. Auto-fill portrait generation (genre/âge)
2. Inverted dice roll logic (1=échec, 96-100=succès)
3. GM tools modal (4 onglets responsive)
4. Inventory add button
5. Share button in QR popup
6. Import button in invite popup
7. 1d6 heart button (dégâts PV)
8. No duplicate QR button
9. Multi-sélection personnages MJ

---

## Suite 1: Character Portrait Generation

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 1.1: Auto-fill gender and age in portrait customization

**File:** `e2e/character-portrait/auto-fill-fields.spec.ts`

**Steps:**
1. Navigate to /sessions
2. Click on a session with characters
3. Click on a character card
4. Click 'Générer un Portrait AI' button
5. Verify gender field is pre-filled from character.gender
6. Verify age field is pre-filled from character.age (young/adult/middle/elderly)

**Expected Results:**
- Portrait dialog opens
- Gender dropdown shows correct value (Homme/Femme/Autre)
- Age category matches character's numeric age
- User doesn't need to manually select gender/age

---

## Suite 2: Dice Roll Logic

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 2.1: Verify dice roll success/failure logic is correct

**File:** `e2e/dice-roll/correct-logic.spec.ts`

**Steps:**
1. Navigate to character sheet
2. Open dice roller component
3. Mock rollDice to return 1
4. Execute roll
5. Verify outcome is 'failure' (échec critique)
6. Mock rollDice to return 96-100
7. Execute roll
8. Verify outcome is 'extreme_success' (succès critique)

**Expected Results:**
- Roll of 1 shows échec critique (fumble)
- Roll of 96-100 shows succès critique
- Logic is no longer inverted
- Sound effects match outcome (fumble vs critical)

---

## Suite 3: GM Tools Modal

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 3.1: Verify GM tools open in modal with 4 tabs

**File:** `e2e/gm-tools/modal-tabs.spec.ts`

**Steps:**
1. Login as GM (admin@test.com)
2. Navigate to /sessions/[sessionId]
3. Click 'Outils' button
4. Verify modal opens (not popover)
5. Verify 4 tabs are visible: Jets, Ambiance, Narration, Utilitaires
6. Click each tab
7. Verify content switches correctly

**Expected Results:**
- Modal opens with title 'Outils du Maître de Jeu'
- All 4 tabs visible and clickable
- Content scrollable within modal (ScrollArea)
- Responsive design works on mobile
- Modal closes with X button

---

## Suite 4: Inventory Management

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 4.1: Add item to character inventory

**File:** `e2e/inventory/add-button.spec.ts`

**Steps:**
1. Navigate to character in session
2. Open 'Ajouter des Objets' tab
3. Click 'Ajouter' button on an item
4. Check console for [DEBUG] logs
5. Verify toast notification 'Objet ajouté'
6. Verify item appears in inventory list
7. Verify button shows 'Ajout en cours...' during request

**Expected Results:**
- Button triggers API call to POST /api/characters/{id}/inventory
- Button disabled during request
- Success toast displayed
- Item added to character inventory
- Console shows debug logs for traceability

---

## Suite 5: Session Sharing

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 5.1: Share button inside QR popup only

**File:** `e2e/session-sharing/qr-popup-share.spec.ts`

**Steps:**
1. Navigate to /sessions/[sessionId]
2. Verify NO standalone 'Partager (QR)' button with aged-gold border
3. Click 'Partager (QR)' button to open modal
4. Verify QR code displayed (256x256)
5. Verify 'Copier le Lien' button inside modal
6. Verify 'Partager' button inside modal (if navigator.share available)
7. Click 'Copier le Lien'
8. Verify toast 'Lien copié'
9. Click 'Partager' if available
10. Verify native share dialog opens

**Expected Results:**
- No duplicate QR button in session header
- Share actions consolidated in QR modal
- Copy link works
- Native share works (if supported)
- UI cleaner with fewer buttons

---

## Suite 6: Character Import

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 6.1: Import button inside invite players dialog

**File:** `e2e/character-import/invite-dialog.spec.ts`

**Steps:**
1. Navigate to /sessions/[sessionId] as GM
2. Verify NO standalone 'Importer' button with download icon
3. Click 'Inviter Joueurs' button
4. Verify dialog opens with 4 tabs: Code, Lien, QR, Importer
5. Click 'Importer' tab
6. Verify character selection grid displayed
7. Verify 'Reset' and 'Keep' state options
8. Select a character
9. Click 'Importer' button
10. Verify character imported to session

**Expected Results:**
- No standalone Import button
- Import tab in invite dialog
- Character selection works
- Import functionality preserved
- UI consolidated and cleaner

---

## Suite 7: Combat Damage

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 7.1: 1d6 heart button applies damage to HP

**File:** `e2e/combat/1d6-damage.spec.ts`

**Steps:**
1. Navigate to character in session
2. Note initial HP value
3. Click 1d6 button with heart icon (bg-blood-burgundy)
4. Check console for [DEBUG] logs
5. Verify toast shows '1d6: X'
6. Verify HP reduced by X
7. Verify onApplyBuff called with negative value
8. Verify roll recorded in database

**Expected Results:**
- 1d6 rolls random value 1-6
- HP decreases by rolled amount
- Toast notification displays result
- Sound effect plays
- Roll saved to database
- Console logs show execution flow

---

## Suite 8: GM Character Selection

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 8.1: Multi-select characters with improved visibility

**File:** `e2e/gm-tools/character-multiselect.spec.ts`

**Steps:**
1. Login as GM
2. Navigate to session with 7+ characters (VLAD01)
3. Open GM Tools modal
4. Go to 'Jets' tab
5. Verify character selection area
6. Verify ScrollArea height is 256px (h-64)
7. Verify 2-column grid layout
8. Verify 6-7 characters visible without scrolling
9. Click 'Tous' button
10. Verify all characters selected with golden checkmarks
11. Click 'Aucun' button
12. Verify all deselected
13. Verify counter shows 'X/Y' format

**Expected Results:**
- All 7+ characters easily visible
- 2-column grid shows more characters
- Larger avatars (12x12)
- Golden checkmark badges on selected
- Colored stat icons (sanity, HP)
- Select All/None buttons work
- Counter updates in real-time
- Improved from 2-3 visible to 6-7

---

## Suite 9: UI Cleanup

**Seed File:** `e2e/auth-seed.spec.ts`

### Test 9.1: No duplicate QR button in session header

**File:** `e2e/ui-cleanup/no-duplicate-qr.spec.ts`

**Steps:**
1. Navigate to /sessions/[sessionId]
2. Count buttons with QR icon in header
3. Verify only ONE button opens QR modal
4. Verify button is 'Partager (QR)'
5. Verify NO button with class 'border-aged-gold text-aged-gold' AND QR icon

**Expected Results:**
- Only 1 QR-related button in header
- No duplicate 'Partager (QR)' button
- Cleaner UI without button clutter
