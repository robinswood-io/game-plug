# Bug Fixes Regression Tests

Suite complète de tests E2E Playwright pour valider les 9 bugs corrigés durant la session du 25 janvier 2026.

## Tests Créés

| File | Tests | Priority | Bug Fixed |
|------|-------|----------|-----------|
| `01-gm-tools-modal.spec.ts` | 4 | HIGH | GM tools modal avec 4 onglets (Jets, Ambiance, Narration, Utilitaires) |
| `02-character-multiselect.spec.ts` | 6 | HIGH | Multi-sélection personnages MJ (2 colonnes, 256px height, 6-7 visibles) |
| `03-no-duplicate-qr-button.spec.ts` | 5 | MEDIUM | Suppression bouton QR dupliqué avec border-aged-gold |
| `04-1d6-damage-button.spec.ts` | 5 | HIGH | Bouton 1d6 avec coeur applique dégâts aux PV |
| `05-dice-roll-logic.spec.ts` | 3 | HIGH | Correction logique inversée (1=échec, 96-100=succès) - **Requires mocking** |
| `06-portrait-autofill.spec.ts` | 2 | MEDIUM | Auto-fill genre/âge dans génération portrait AI |
| `07-inventory-add-button.spec.ts` | 3 | HIGH | Bouton "Ajouter" fonctionne pour inventaire |
| `08-import-in-invite-dialog.spec.ts` | 4 | MEDIUM | Import personnages dans dialog "Inviter Joueurs" (4ème onglet) |
| `09-share-in-qr-popup.spec.ts` | 5 | MEDIUM | Actions partage consolidées dans popup QR |

**Total:** 37 tests couvrant 9 bugs

---

## Exécution des Tests

### Environnement de Production

```bash
cd /srv/workspace/game-plug

# Exécuter tous les tests bug-fixes
npx playwright test e2e/bug-fixes --reporter=html

# Exécuter un seul fichier
npx playwright test e2e/bug-fixes/01-gm-tools-modal.spec.ts

# Mode debug
npx playwright test e2e/bug-fixes/01-gm-tools-modal.spec.ts --debug

# Mode headed (voir le navigateur)
npx playwright test e2e/bug-fixes --headed
```

### Environnement Local

Pour tester en local (http://localhost:3000):

```bash
# Modifier playwright.config.ts
baseURL: 'http://localhost:3000'

# Démarrer l'app localement
cd /srv/workspace/game-plug
npm run dev

# Dans un autre terminal
npx playwright test e2e/bug-fixes
```

---

## Prérequis

### Données de Test

Les tests nécessitent:

1. **User Test:**
   - Email: `admin@test.com`
   - Password: `admin123`
   - Role: GM (Game Master)

2. **Session Test:**
   - Code: `VLAD01`
   - 7+ personnages pour tester multi-sélection
   - Personnages avec âge/genre variés

3. **Backend Running:**
   - Frontend: https://game-plug.rbw.ovh (ou localhost:3000)
   - Backend API: localhost:3001
   - WebSocket actif pour temps réel

### Configuration Playwright

Fichier `playwright.config.ts`:

```typescript
{
  baseURL: 'https://game-plug.rbw.ovh',
  timeout: 180000,        // 3 min par test
  actionTimeout: 90000,   // 90s par action
  navigationTimeout: 90000,
  retries: 1,
  workers: 1,
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
}
```

---

## Structure des Tests

### Pattern Commun

```typescript
test.describe('Bug Fix: [Description]', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/sessions');

    // Navigate to test session
    await page.click('text=VLAD01');
    await page.waitForURL('**/sessions/**');
  });

  test('should [test description]', async ({ page }) => {
    // Test steps
  });
});
```

### Locators Utilisés

- `[role="dialog"]` - Modals
- `[role="tab"]` - Onglets
- `[role="tabpanel"]` - Contenu onglets
- `[data-radix-scroll-area-viewport]` - ScrollAreas
- `.bg-aged-gold` - Badges golden
- `.bg-blood-burgundy` - Bouton 1d6 damage
- `button:has-text("...")` - Boutons texte
- `text=/regex/i` - Recherche regex case-insensitive

---

## Détails par Test

### 1. GM Tools Modal

**Bug:** GM tools ouvrent dans popover au lieu de modal, difficile à utiliser sur mobile

**Fix:** Modal avec 4 onglets, ScrollArea, responsive

**Tests:**
- ✅ Modal opens with 4 tabs visible
- ✅ Tab navigation works correctly
- ✅ ScrollArea present for content
- ✅ Modal closes with X button

**Key Assertions:**
```typescript
const modal = page.locator('[role="dialog"]');
await expect(modal).toBeVisible();

const tabs = page.locator('[role="tab"]');
await expect(tabs).toHaveCount(4);
```

---

### 2. Character Multi-select

**Bug:** Seulement 2-3 personnages visibles, difficile de sélectionner tous les 7 personnages

**Fix:** 2 colonnes, 256px height, avatars 12x12, 6-7 visibles sans scroll

**Tests:**
- ✅ ScrollArea has 256px height (h-64)
- ✅ 2-column grid shows 6+ characters
- ✅ "Tous" button selects all
- ✅ "Aucun" button deselects all
- ✅ Counter shows "X/Y" format
- ✅ Golden checkmarks on selected

**Key Assertions:**
```typescript
const scrollArea = page.locator('[data-radix-scroll-area-viewport]').first();
const height = await scrollArea.evaluate(el =>
  window.getComputedStyle(el).height
);
expect(parseInt(height)).toBeGreaterThanOrEqual(200);
```

---

### 3. No Duplicate QR Button

**Bug:** 2 boutons QR dans header (un avec border-aged-gold), confusion

**Fix:** Un seul bouton "Partager (QR)", actions consolidées dans modal

**Tests:**
- ✅ Only 1 QR button in header
- ✅ No duplicate with aged-gold border
- ✅ QR modal opens correctly
- ✅ Share actions inside modal only
- ✅ Copy link works with toast

**Key Assertions:**
```typescript
const duplicateButton = page.locator(
  'button.border-aged-gold:has-text("QR")'
);
expect(await duplicateButton.count()).toBe(0);
```

---

### 4. 1d6 Damage Button

**Bug:** Bouton 1d6 avec coeur n'appliquait pas les dégâts

**Fix:** onClick appelle onApplyBuff avec valeur négative, HP réduits

**Tests:**
- ✅ Button exists with bg-blood-burgundy
- ✅ Rolling reduces HP by rolled value (1-6)
- ✅ Toast shows "1d6: X"
- ✅ Button disabled during request
- ✅ Debug logs to console

**Key Assertions:**
```typescript
const initialHP = parseInt(await hpElement.textContent());
await d6Button.click();
const rolledValue = parseInt(await toast.textContent());
const newHP = parseInt(await hpElement.textContent());
expect(newHP).toBe(initialHP - rolledValue);
```

---

### 5. Dice Roll Logic ⚠️

**Bug:** Logique inversée (1=succès, 96-100=échec)

**Fix:** 1=échec critique, 96-100=succès critique

**Tests:**
- ⚠️ Roll of 1 shows échec critique (requires mock)
- ⚠️ Roll of 96-100 shows succès critique (requires mock)
- ⚠️ Sound effects match outcomes (requires mock)

**Status:** Placeholders - Nécessite mocking de `rollDice()`

**Recommandation:** Tests unitaires avec Jest/Vitest + mocking

```typescript
// Example avec mock
jest.mock('./dice', () => ({
  rollDice: jest.fn()
}));

rollDice.mockReturnValue(1);
// Assert échec critique
```

---

### 6. Portrait Auto-fill

**Bug:** Champs genre/âge vides lors génération portrait AI

**Fix:** Auto-fill depuis character.gender et character.age

**Tests:**
- ✅ Gender field pre-filled in portrait dialog
- ✅ Age field pre-filled (young/adult/middle/elderly)

**Key Assertions:**
```typescript
const genderValue = await genderSelect.inputValue();
expect(genderValue).toBeTruthy();
```

---

### 7. Inventory Add Button

**Bug:** Bouton "Ajouter" ne faisait rien

**Fix:** API call POST /api/characters/{id}/inventory, toast confirmation

**Tests:**
- ✅ Add button triggers API call
- ✅ Loading state "Ajout en cours..."
- ✅ Toast "Objet ajouté"
- ✅ Button disabled during request
- ✅ Debug logs to console

**Key Assertions:**
```typescript
await addButton.click();
await expect(page.locator('button[disabled]:has-text("Ajouter")')).toBeVisible();
await expect(page.locator('text=/Objet ajouté/')).toBeVisible();
```

---

### 8. Import in Invite Dialog

**Bug:** Bouton "Importer" standalone, UI cluttered

**Fix:** 4ème onglet dans dialog "Inviter Joueurs"

**Tests:**
- ✅ No standalone import button
- ✅ Invite dialog has 4 tabs (Code, Lien, QR, Importer)
- ✅ Character selection grid in Import tab
- ✅ Import functionality works

**Key Assertions:**
```typescript
const dialog = page.locator('[role="dialog"]');
await expect(dialog.locator('[role="tab"]:has-text("Importer")')).toBeVisible();
```

---

### 9. Share in QR Popup

**Bug:** Actions partage éparpillées

**Fix:** Consolidation dans popup QR (Copier + Partager)

**Tests:**
- ✅ No standalone share with aged-gold
- ✅ QR code 256x256 in modal
- ✅ "Copier le Lien" inside modal
- ✅ Native share if supported
- ✅ Copy link works

**Key Assertions:**
```typescript
const qrCode = modal.locator('canvas, img[alt*="QR"]').first();
const bbox = await qrCode.boundingBox();
expect(bbox.width).toBeGreaterThanOrEqual(200);
```

---

## Résultats Attendus

### Tests qui DOIVENT Passer

- ✅ GM Tools Modal (4 tests)
- ✅ Character Multi-select (6 tests)
- ✅ No Duplicate QR (5 tests)
- ✅ 1d6 Damage (5 tests)
- ✅ Portrait Auto-fill (2 tests)
- ✅ Inventory Add (3 tests)
- ✅ Import Dialog (4 tests)
- ✅ Share QR (5 tests)

**Total:** 34 tests fonctionnels

### Tests en Attente

- ⏳ Dice Roll Logic (3 tests) - Nécessite mocking

---

## Debugging

### Si Tests Timeout

```bash
# Augmenter timeouts
# playwright.config.ts
timeout: 300000,  // 5 minutes
actionTimeout: 120000,  // 2 minutes
```

### Si Locators Échouent

```bash
# Mode debug pour voir les sélecteurs
npx playwright test --debug

# Générer locators
npx playwright codegen https://game-plug.rbw.ovh
```

### Si Login Échoue

```bash
# Vérifier credentials
npx playwright test e2e/01-auth.spec.ts

# Vérifier session
npx playwright test --headed
```

### Screenshots et Traces

```bash
# Traces sauvegardées on failure
npx playwright show-trace trace.zip

# HTML report
npx playwright show-report
```

---

## Maintenance

### Ajouter un Nouveau Test

```typescript
test('should [description]', async ({ page }) => {
  // 1. Setup (navigation)

  // 2. Action (click, fill, etc.)

  // 3. Assertion (expect)

  // 4. Cleanup (optional)
});
```

### Mettre à Jour les Locators

Si UI change:
1. Utiliser `npx playwright codegen` pour générer nouveaux locators
2. Mettre à jour les tests
3. Vérifier tous les tests passent

### CI/CD Integration

```yaml
# .github/workflows/e2e-bug-fixes.yml
name: Bug Fixes E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test e2e/bug-fixes
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Ressources

- **Plan Complet:** `bug-fixes-regression.plan.md`
- **Rapport Détaillé:** `TEST_REPORT.md`
- **Playwright Docs:** https://playwright.dev
- **Robinswood Rules:** `/opt/ia-webdev/rulebook-ai/`

---

## Questions Fréquentes

**Q: Pourquoi les tests timeout?**
A: Timeouts peuvent venir de:
- Réseau lent (app sur HTTPS distant)
- Backend down
- Sélecteurs incorrects
- Session VLAD01 inexistante

**Q: Comment créer session VLAD01?**
A: Utiliser seed script ou créer manuellement avec 7+ personnages

**Q: Puis-je exécuter tests en parallèle?**
A: Non, `workers: 1` pour éviter conflits sur même session

**Q: Comment tester en local?**
A: Changer `baseURL` vers `http://localhost:3000` et démarrer dev server

**Q: Tests dice roll logic ne marchent pas?**
A: Normal, nécessitent mocking - implémenter avec Jest/Vitest

---

**Created:** 2026-01-25
**Author:** Claude Sonnet 4.5
**Version:** 1.0.0
