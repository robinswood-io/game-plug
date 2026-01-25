# Test Instructions: Import Character Integration

## Pre-requisites

1. Start the application (frontend and backend)
2. Log in as a Game Master
3. Create or open an existing session

## Test Scenario 1: Dialog Tab Visibility

**Steps:**
1. Navigate to a session dashboard
2. Click the "Inviter Joueurs" button in the header

**Expected Results:**
- Dialog opens with title "Inviter des Joueurs"
- Four tabs visible at the top:
  - "Code Session"
  - "Lien Direct"
  - "QR Code"
  - "Importer" (highlighted with green color)

## Test Scenario 2: Importer Tab - Character Selection

**Setup:** Create characters in other sessions first (if none exist)

**Steps:**
1. Open the "Inviter des Joueurs" dialog
2. Click the "Importer" tab

**Expected Results:**
- Character list loads and displays:
  - Character cards in a grid (1-2 columns)
  - Each card shows:
    - Character avatar (if available)
    - Character name
    - Occupation
    - Session badge (source session name)
    - Stats preview (STR, DEX, INT)
  - Cards have a border that changes color on hover

**Edge Case:**
- If no characters exist in other sessions:
  - "Aucun personnage disponible pour l'import" message appears
  - User icon displayed
  - Explanation text shown

## Test Scenario 3: Import State Options

**Steps:**
1. Click the "Importer" tab
2. Observe the "Options d'import" section

**Expected Results:**
- Two radio button options visible:
  - "Réinitialiser l'état" (Reset State) - Selected by default
    - Description: "PV, Santé mentale et PM remis au maximum. Inventaire, notes et historique effacés."
    - Icon: Refresh icon
  - "Conserver l'état" (Keep State)
    - Description: "Copie complète : PV, Santé, inventaire, effets actifs, conditions et notes."
    - Icon: Save icon

**Expected Behavior:**
- Clicking a radio button selects it
- Selection state is preserved as user selects characters

## Test Scenario 4: Character Selection

**Steps:**
1. Open "Importer" tab with available characters
2. Click on any character card

**Expected Results:**
- Card gets highlighted with:
  - Green border (`border-eldritch-green`)
  - Green shadow effect
  - Download icon appears in top-right corner of card
- Other cards return to normal state
- Selected character ID is stored internally

## Test Scenario 5: Import Button Behavior

**Steps 1 - No Character Selected:**
1. Open "Importer" tab
2. Keep "Fermer" button in view
3. No character is selected

**Expected Results:**
- Only "Fermer" button visible in footer
- No "Importer" button shown

**Steps 2 - Character Selected:**
1. Click a character card to select it
2. Look at footer

**Expected Results:**
- "Importer" button appears next to "Fermer"
- Button shows download icon + "Importer" text
- Button is enabled (clickable)

## Test Scenario 6: Perform Import

**Steps:**
1. Select a character from the "Importer" tab
2. Choose import state option (Reset or Keep)
3. Click "Importer" button

**Expected Results - During Import:**
- Button becomes disabled
- Button text changes to "Import en cours..."
- Loading spinner may appear

**Expected Results - After Import:**
- Dialog closes automatically
- Success toast notification appears:
  - Title: "Personnage importé"
  - Description: "[Character Name] a été importé avec succès dans cette session."
- Returning to session dashboard shows imported character in the character grid

## Test Scenario 7: Import with Different State Options

**First Import - Reset State:**
1. Select character with current HP, sanity, inventory
2. Select "Réinitialiser l'état"
3. Perform import
4. Verify in character sheet:
   - HP = Max HP
   - Sanity = Max Sanity
   - MP = Max MP
   - Inventory is empty
   - Active effects cleared

**Second Import - Keep State:**
1. Select different character (or same character from another session)
2. Select "Conserver l'état"
3. Perform import
4. Verify in character sheet:
   - HP preserved
   - Sanity preserved
   - Inventory preserved
   - Active effects preserved

## Test Scenario 8: Other Tabs Still Work

**Steps:**
1. Click each tab to ensure they still function:
   - "Code Session" - shows code and copy button
   - "Lien Direct" - shows URL and copy button
   - "QR Code" - shows QR code and copy/share buttons
   - "Importer" - shows character selection

**Expected Results:**
- All tabs render correctly
- No content overlaps or display issues
- Tab switching is smooth

## Test Scenario 9: Dialog Responsiveness

**Steps:**
1. Open dialog on different screen sizes:
   - Mobile (360px)
   - Tablet (768px)
   - Desktop (1024px+)

**Expected Results:**
- Character cards adapt to screen size:
  - Mobile: 1 column
  - Tablet/Desktop: 2 columns
- All text is readable
- Buttons are accessible
- No horizontal scrolling

## Test Scenario 10: Error Handling

**Steps - API Failure:**
1. Open "Importer" tab
2. (Simulate API error or disable backend)
3. Try to import character

**Expected Results:**
- Error toast appears:
  - Title: "Erreur"
  - Description: "Impossible d'importer le personnage."
  - Variant: "destructive"
- Dialog remains open
- User can retry or close

## Test Scenario 11: UI Consistency

**Visual Checks:**
- Colors match the design system:
  - Background: cosmic-void (dark)
  - Text: aged-gold, aged-parchment, bone-white
  - Accent: eldritch-green
  - Hover states: appropriate color shifts

- Typography:
  - Titles: font-cinzel
  - Body: font-source or default
  - Proper contrast ratios

- Spacing:
  - Cards properly spaced
  - Button gaps consistent
  - Padding/margins align with design

## Rollback Plan

If issues are found, the previous state can be restored:

```bash
git revert 1bda1a6
```

This would restore the separate "Importer" button in the session header.

## Sign-Off Checklist

- [ ] All 11 test scenarios passed
- [ ] No console errors or warnings
- [ ] TypeScript compilation: `npx tsc --noEmit` ✓
- [ ] UI renders correctly on multiple screen sizes
- [ ] Import functionality works end-to-end
- [ ] Other dialog tabs unaffected
- [ ] No regressions in existing features
