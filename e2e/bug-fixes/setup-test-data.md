# Setup Test Data for Bug Fixes E2E Tests

Guide pour créer les données de test nécessaires à l'exécution des tests E2E.

---

## Prérequis

### 1. User Test (GM)

Créer un compte Game Master pour les tests:

```sql
-- Database: PostgreSQL
INSERT INTO users (email, password_hash, role, created_at)
VALUES (
  'admin@test.com',
  -- Hash BCrypt pour 'admin123'
  '$2a$10$...',  -- À générer avec bcrypt
  'gm',
  NOW()
);
```

**Alternative UI:**
1. Aller sur /auth/register
2. Email: admin@test.com
3. Password: admin123
4. Role: GM

### 2. Session Test (VLAD01)

Créer une session de jeu avec code VLAD01:

```sql
INSERT INTO sessions (code, name, gm_id, created_at)
VALUES (
  'VLAD01',
  'Test Session - VLAD Campaign',
  (SELECT id FROM users WHERE email = 'admin@test.com'),
  NOW()
);
```

**Alternative UI:**
1. Login comme admin@test.com
2. Aller sur /sessions
3. Créer nouvelle session
4. Code: VLAD01
5. Nom: "Test Session - VLAD Campaign"

### 3. Personnages (7+ pour multi-select)

Créer 7 personnages avec variété d'âge/genre:

```typescript
const characters = [
  {
    name: "Viktor Petrov",
    occupation: "Détective",
    age: 35,
    gender: "Homme",
    hp: 12,
    sanity: 60
  },
  {
    name: "Elena Sokolov",
    occupation: "Journaliste",
    age: 28,
    gender: "Femme",
    hp: 10,
    sanity: 70
  },
  {
    name: "Boris Ivanov",
    occupation: "Professeur",
    age: 52,
    gender: "Homme",
    hp: 9,
    sanity: 75
  },
  {
    name: "Anastasia Volkov",
    occupation: "Médecin",
    age: 42,
    gender: "Femme",
    hp: 11,
    sanity: 65
  },
  {
    name: "Dmitri Kozlov",
    occupation: "Avocat",
    age: 38,
    gender: "Homme",
    hp: 10,
    sanity: 68
  },
  {
    name: "Olga Petrova",
    occupation: "Artiste",
    age: 31,
    gender: "Femme",
    hp: 8,
    sanity: 72
  },
  {
    name: "Ivan Volkov",
    occupation: "Militaire",
    age: 45,
    gender: "Homme",
    hp: 14,
    sanity: 55
  }
];
```

**SQL:**
```sql
INSERT INTO characters (
  session_id,
  name,
  occupation,
  age,
  gender,
  hp_current,
  hp_max,
  sanity_current,
  sanity_max
)
SELECT
  (SELECT id FROM sessions WHERE code = 'VLAD01'),
  name,
  occupation,
  age,
  gender,
  hp,
  hp,
  sanity,
  sanity
FROM (VALUES
  ('Viktor Petrov', 'Détective', 35, 'Homme', 12, 60),
  ('Elena Sokolov', 'Journaliste', 28, 'Femme', 10, 70),
  ('Boris Ivanov', 'Professeur', 52, 'Homme', 9, 75),
  ('Anastasia Volkov', 'Médecin', 42, 'Femme', 11, 65),
  ('Dmitri Kozlov', 'Avocat', 38, 'Homme', 10, 68),
  ('Olga Petrova', 'Artiste', 31, 'Femme', 8, 72),
  ('Ivan Volkov', 'Militaire', 45, 'Homme', 14, 55)
) AS data(name, occupation, age, gender, hp, sanity);
```

**Alternative UI:**
1. Ouvrir session VLAD01
2. Créer 7 personnages avec le formulaire
3. Varier âge (28-52 ans) et genre

---

## Seed Script (Recommended)

Créer un script TypeScript pour automatiser:

```typescript
// e2e/seeds/vlad01-session.seed.ts
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function seedVLAD01TestData() {
  console.log('🌱 Seeding VLAD01 test data...');

  // 1. Create GM user
  const passwordHash = await bcrypt.hash('admin123', 10);

  const user = await db.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      passwordHash,
      role: 'gm',
      name: 'Test Admin'
    }
  });

  console.log('✅ User created:', user.email);

  // 2. Create session
  const session = await db.session.upsert({
    where: { code: 'VLAD01' },
    update: {},
    create: {
      code: 'VLAD01',
      name: 'Test Session - VLAD Campaign',
      gmId: user.id,
      setting: 'modern'
    }
  });

  console.log('✅ Session created:', session.code);

  // 3. Create 7 characters
  const charactersData = [
    { name: "Viktor Petrov", occupation: "Détective", age: 35, gender: "Homme", hp: 12, sanity: 60 },
    { name: "Elena Sokolov", occupation: "Journaliste", age: 28, gender: "Femme", hp: 10, sanity: 70 },
    { name: "Boris Ivanov", occupation: "Professeur", age: 52, gender: "Homme", hp: 9, sanity: 75 },
    { name: "Anastasia Volkov", occupation: "Médecin", age: 42, gender: "Femme", hp: 11, sanity: 65 },
    { name: "Dmitri Kozlov", occupation: "Avocat", age: 38, gender: "Homme", hp: 10, sanity: 68 },
    { name: "Olga Petrova", occupation: "Artiste", age: 31, gender: "Femme", hp: 8, sanity: 72 },
    { name: "Ivan Volkov", occupation: "Militaire", age: 45, gender: "Homme", hp: 14, sanity: 55 }
  ];

  for (const char of charactersData) {
    await db.character.upsert({
      where: {
        sessionId_name: {
          sessionId: session.id,
          name: char.name
        }
      },
      update: {},
      create: {
        sessionId: session.id,
        name: char.name,
        occupation: char.occupation,
        age: char.age,
        gender: char.gender,
        hpCurrent: char.hp,
        hpMax: char.hp,
        sanityCurrent: char.sanity,
        sanityMax: char.sanity,
        // Default stats
        str: 50,
        con: 50,
        dex: 50,
        int: 50,
        pow: 50,
        app: 50,
        siz: 50,
        edu: 50
      }
    });

    console.log('✅ Character created:', char.name);
  }

  console.log('🎉 VLAD01 seed complete!');

  return {
    user,
    session,
    characterCount: charactersData.length
  };
}

// Run if called directly
if (require.main === module) {
  seedVLAD01TestData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Seed failed:', err);
      process.exit(1);
    });
}
```

**Usage:**
```bash
bun e2e/seeds/vlad01-session.seed.ts
# ou
npm run seed:vlad01
```

---

## Playwright Auth State

Créer un fichier d'authentification pour éviter login répété:

```typescript
// e2e/auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/admin.json';

setup('authenticate', async ({ page }) => {
  // Login
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', 'admin@test.com');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL('**/sessions');

  // Save auth state
  await page.context().storageState({ path: authFile });
});
```

**Update playwright.config.ts:**
```typescript
export default defineConfig({
  // ... other config

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json'
      },
      dependencies: ['setup']
    }
  ]
});
```

**Update tests:**
```typescript
// e2e/bug-fixes/01-gm-tools-modal.spec.ts
test.beforeEach(async ({ page }) => {
  // Auth state already loaded, skip login
  await page.goto('/sessions');
  await page.click('text=VLAD01');
  await page.waitForURL('**/sessions/**');
});
```

---

## Inventaire (pour test 7)

Créer des objets dans l'inventaire global:

```sql
INSERT INTO items (name, description, type, category, weight)
VALUES
  ('Revolver .38', 'Arme de poing standard', 'weapon', 'firearms', 2),
  ('Couteau de poche', 'Petit couteau utilitaire', 'weapon', 'melee', 0.5),
  ('Lampe torche', 'Éclairage portable', 'equipment', 'general', 1),
  ('Trousse de premiers soins', 'Kit médical de base', 'equipment', 'medical', 1.5),
  ('Carnet de notes', 'Pour prendre des notes', 'equipment', 'general', 0.2);
```

---

## Vérification des Données

Script de vérification:

```typescript
// e2e/seeds/verify-test-data.ts
import { db } from '@/lib/db';

async function verifyTestData() {
  console.log('🔍 Verifying test data...\n');

  // Check user
  const user = await db.user.findUnique({
    where: { email: 'admin@test.com' }
  });

  console.log('User:', user ? '✅ EXISTS' : '❌ MISSING');
  if (user) {
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Role: ${user.role}`);
  }

  // Check session
  const session = await db.session.findUnique({
    where: { code: 'VLAD01' },
    include: { characters: true }
  });

  console.log('\nSession:', session ? '✅ EXISTS' : '❌ MISSING');
  if (session) {
    console.log(`  - Code: ${session.code}`);
    console.log(`  - Name: ${session.name}`);
    console.log(`  - Characters: ${session.characters.length}`);

    if (session.characters.length < 7) {
      console.log(`  ⚠️  WARNING: Need 7+ characters, found ${session.characters.length}`);
    }

    console.log('\nCharacters:');
    session.characters.forEach((char, i) => {
      console.log(`  ${i + 1}. ${char.name} (${char.gender}, ${char.age} ans)`);
      console.log(`     - HP: ${char.hpCurrent}/${char.hpMax}`);
      console.log(`     - Sanity: ${char.sanityCurrent}/${char.sanityMax}`);
    });
  }

  // Check items
  const items = await db.item.findMany({ take: 5 });
  console.log('\nItems:', items.length > 0 ? '✅ EXISTS' : '❌ MISSING');
  items.forEach(item => {
    console.log(`  - ${item.name}`);
  });

  console.log('\n✅ Verification complete!');
}

verifyTestData().catch(console.error);
```

**Usage:**
```bash
bun e2e/seeds/verify-test-data.ts
```

---

## Quick Setup Commands

```bash
# 1. Create seed script
touch e2e/seeds/vlad01-session.seed.ts

# 2. Run seed
bun e2e/seeds/vlad01-session.seed.ts

# 3. Verify data
bun e2e/seeds/verify-test-data.ts

# 4. Setup auth state
npx playwright test e2e/auth.setup.ts

# 5. Run tests
npx playwright test e2e/bug-fixes
```

---

## Reset Test Data

Pour nettoyer et recréer:

```sql
-- Delete characters
DELETE FROM characters
WHERE session_id = (SELECT id FROM sessions WHERE code = 'VLAD01');

-- Delete session
DELETE FROM sessions WHERE code = 'VLAD01';

-- Delete user
DELETE FROM users WHERE email = 'admin@test.com';

-- Verify clean
SELECT * FROM sessions WHERE code = 'VLAD01';  -- Should be empty
```

Puis relancer seed:
```bash
bun e2e/seeds/vlad01-session.seed.ts
```

---

## Checklist

Avant d'exécuter les tests E2E, vérifier:

- [ ] User `admin@test.com` existe avec password `admin123`
- [ ] User a le rôle `gm`
- [ ] Session `VLAD01` existe
- [ ] Session a 7+ personnages
- [ ] Personnages ont âge/genre variés
- [ ] Personnages ont HP et Sanity définis
- [ ] Items disponibles dans inventaire global
- [ ] App running (dev ou prod)
- [ ] Database accessible
- [ ] Auth state setup (`playwright/.auth/admin.json`)

---

**Created:** 2026-01-25
**Purpose:** Setup test data for bug-fixes E2E tests
**Maintenance:** Re-run seed after database reset
