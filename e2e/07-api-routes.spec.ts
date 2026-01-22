import { test, expect, type APIRequestContext } from '@playwright/test';

test.describe('API Routes Test Suite', () => {
  let apiContext: APIRequestContext;
  let authCookie: string;
  let testUserId: string;
  let testSessionId: string;
  let testCharacterId: string;
  let testChapterId: string;
  let testInventoryId: string;
  let testNarrativeId: string;
  const testEmail = `test-api-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:5002',
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('01 - Health Check', async () => {
    const response = await apiContext.get('/api/health');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('02 - POST /api/auth/signup - Create GM account', async () => {
    const response = await apiContext.post('/api/auth/signup', {
      data: {
        email: testEmail,
        password: testPassword,
        firstName: 'API',
        lastName: 'Test'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(testEmail);
    testUserId = data.user.id;

    // Store auth cookie
    const headers = response.headers();
    if (headers['set-cookie']) {
      authCookie = headers['set-cookie'];
    }
  });

  test('03 - GET /api/auth/user - Get current user', async () => {
    const response = await apiContext.get('/api/auth/user', {
      headers: authCookie ? { Cookie: authCookie } : {}
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.email).toBe(testEmail);
  });

  test('04 - POST /api/auth/login - Login', async () => {
    const response = await apiContext.post('/api/auth/login', {
      data: {
        email: testEmail,
        password: testPassword
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(testEmail);

    // Update auth cookie
    const headers = response.headers();
    if (headers['set-cookie']) {
      authCookie = headers['set-cookie'];
    }
  });

  test('05 - POST /api/sessions - Create session', async () => {
    const response = await apiContext.post('/api/sessions', {
      headers: { Cookie: authCookie },
      data: {
        name: 'Test API Session'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('Test API Session');
    testSessionId = data.id;
  });

  test('06 - GET /api/sessions - Get all sessions', async () => {
    const response = await apiContext.get('/api/sessions', {
      headers: { Cookie: authCookie }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('07 - GET /api/sessions/:id - Get session by ID', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.get(`/api/sessions/${testSessionId}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(testSessionId);
  });

  test('08 - PATCH /api/sessions/:id - Update session', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.patch(`/api/sessions/${testSessionId}`, {
      headers: { Cookie: authCookie },
      data: { name: 'Updated API Session' }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.name).toBe('Updated API Session');
  });

  test('09 - GET /api/sessions/:id/characters - Get session characters', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.get(`/api/sessions/${testSessionId}/characters`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('10 - POST /api/characters - Create character', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.post('/api/characters', {
      data: {
        sessionId: testSessionId,
        name: 'Test API Character',
        occupation: 'Investigator',
        age: 30,
        gender: 'M',
        residence: 'Boston',
        birthplace: 'New York',
        strength: 50,
        constitution: 50,
        size: 50,
        dexterity: 50,
        appearance: 50,
        intelligence: 50,
        power: 50,
        education: 50,
        luck: 50,
        skills: {},
        hitPoints: 10,
        maxHitPoints: 10,
        magicPoints: 10,
        maxMagicPoints: 10,
        sanity: 50,
        maxSanity: 99,
        availableSkillPoints: 100
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('Test API Character');
    testCharacterId = data.id;
  });

  test('11 - GET /api/characters - Get all characters', async () => {
    const response = await apiContext.get('/api/characters', {
      headers: { Cookie: authCookie }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('12 - GET /api/characters/:id - Get character by ID', async () => {
    if (!testCharacterId) test.skip();

    const response = await apiContext.get(`/api/characters/${testCharacterId}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(testCharacterId);
  });

  test('13 - PATCH /api/characters/:id - Update character', async () => {
    if (!testCharacterId) test.skip();

    const response = await apiContext.patch(`/api/characters/${testCharacterId}`, {
      headers: { Cookie: authCookie },
      data: { hitPoints: 8 }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.hitPoints).toBe(8);
  });

  test('14 - PATCH /api/characters/:id/notes - Update character notes', async () => {
    if (!testCharacterId) test.skip();

    const response = await apiContext.patch(`/api/characters/${testCharacterId}/notes`, {
      headers: { Cookie: authCookie },
      data: { notes: 'Test API notes' }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.notes).toBe('Test API notes');
  });

  test('15 - GET /api/characters/:id/inventory - Get character inventory', async () => {
    if (!testCharacterId) test.skip();

    const response = await apiContext.get(`/api/characters/${testCharacterId}/inventory`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('16 - POST /api/characters/:id/inventory - Add inventory item', async () => {
    if (!testCharacterId) test.skip();

    const response = await apiContext.post(`/api/characters/${testCharacterId}/inventory`, {
      headers: { Cookie: authCookie },
      data: {
        name: 'Test Item',
        description: 'A test item from API',
        category: 'misc',
        quantity: 1
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('Test Item');
    testInventoryId = data.id;
  });

  test('17 - PATCH /api/inventory/:id - Update inventory item', async () => {
    if (!testInventoryId) test.skip();

    const response = await apiContext.patch(`/api/inventory/${testInventoryId}`, {
      headers: { Cookie: authCookie },
      data: { quantity: 2 }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.quantity).toBe(2);
  });

  test('18 - PATCH /api/inventory/:id/equip - Equip item', async () => {
    if (!testInventoryId) test.skip();

    const response = await apiContext.patch(`/api/inventory/${testInventoryId}/equip`, {
      headers: { Cookie: authCookie },
      data: { isEquipped: true }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.isEquipped).toBe(true);
  });

  test('19 - POST /api/sessions/:sessionId/chapters - Create chapter', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.post(`/api/sessions/${testSessionId}/chapters`, {
      headers: { Cookie: authCookie },
      data: {
        name: 'Test Chapter',
        description: 'API test chapter',
        orderIndex: 0
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('Test Chapter');
    testChapterId = data.id;
  });

  test('20 - GET /api/sessions/:sessionId/chapters - Get session chapters', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.get(`/api/sessions/${testSessionId}/chapters`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('21 - PATCH /api/chapters/:id - Update chapter', async () => {
    if (!testChapterId) test.skip();

    const response = await apiContext.patch(`/api/chapters/${testChapterId}`, {
      headers: { Cookie: authCookie },
      data: { name: 'Updated Test Chapter' }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.name).toBe('Updated Test Chapter');
  });

  test('22 - GET /api/chapters/:chapterId/events - Get chapter events', async () => {
    if (!testChapterId) test.skip();

    const response = await apiContext.get(`/api/chapters/${testChapterId}/events`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('23 - POST /api/chapter-events - Create chapter event', async () => {
    if (!testChapterId || !testSessionId) test.skip();

    const response = await apiContext.post('/api/chapter-events', {
      headers: { Cookie: authCookie },
      data: {
        chapterId: testChapterId,
        sessionId: testSessionId,
        eventType: 'discovery',
        title: 'Test Event',
        description: 'API test event',
        isImportant: true
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.title).toBe('Test Event');
  });

  test('24 - GET /api/sessions/:sessionId/narrative - Get session narrative', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.get(`/api/sessions/${testSessionId}/narrative`, {
      headers: { Cookie: authCookie }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('25 - POST /api/sessions/:sessionId/narrative - Create narrative entry', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.post(`/api/sessions/${testSessionId}/narrative`, {
      headers: { Cookie: authCookie },
      data: {
        content: 'Test narrative from API',
        type: 'description',
        isGmOnly: false
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.content).toBe('Test narrative from API');
    testNarrativeId = data.id;
  });

  test('26 - PATCH /api/narrative/:id - Update narrative entry', async () => {
    if (!testNarrativeId) test.skip();

    const response = await apiContext.patch(`/api/narrative/${testNarrativeId}`, {
      headers: { Cookie: authCookie },
      data: { content: 'Updated API narrative' }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.content).toBe('Updated API narrative');
  });

  test('27 - POST /api/rolls - Create roll', async () => {
    if (!testSessionId || !testCharacterId) test.skip();

    const response = await apiContext.post('/api/rolls', {
      headers: { Cookie: authCookie },
      data: {
        sessionId: testSessionId,
        characterId: testCharacterId,
        rollType: 'skill',
        skillName: 'Library Use',
        skillValue: 50,
        diceFormula: '1d100',
        result: 45,
        outcome: 'success'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.rollType).toBe('skill');
  });

  test('28 - GET /api/sessions/:id/rolls - Get session rolls', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.get(`/api/sessions/${testSessionId}/rolls`, {
      headers: { Cookie: authCookie }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('29 - POST /api/characters/:id/effects - Add character effect', async () => {
    if (!testCharacterId) test.skip();

    const response = await apiContext.post(`/api/characters/${testCharacterId}/effects`, {
      headers: { Cookie: authCookie },
      data: {
        name: 'Test Buff',
        description: 'API test buff',
        type: 'buff',
        duration: 3,
        modifiers: {}
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('Test Buff');
  });

  test('30 - POST /api/characters/:id/sanity-conditions - Add sanity condition', async () => {
    if (!testCharacterId) test.skip();

    const response = await apiContext.post(`/api/characters/${testCharacterId}/sanity-conditions`, {
      headers: { Cookie: authCookie },
      data: {
        type: 'phobia',
        name: 'Peur de l\'obscurité',
        description: 'Fear of darkness',
        duration: 'indefinite'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.type).toBe('phobia');
  });

  test('31 - POST /api/characters/:id/distribute-points - Distribute skill points', async () => {
    if (!testCharacterId) test.skip();

    const response = await apiContext.post(`/api/characters/${testCharacterId}/distribute-points`, {
      headers: { Cookie: authCookie },
      data: {
        skillUpdates: {
          'Library Use': 20,
          'Spot Hidden': 10
        }
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.skills).toBeDefined();
  });

  test('90 - DELETE /api/inventory/:id - Delete inventory item', async () => {
    if (!testInventoryId) test.skip();

    const response = await apiContext.delete(`/api/inventory/${testInventoryId}`, {
      headers: { Cookie: authCookie }
    });

    expect(response.status()).toBe(200);
  });

  test('91 - DELETE /api/narrative/:id - Delete narrative entry', async () => {
    if (!testNarrativeId) test.skip();

    const response = await apiContext.delete(`/api/narrative/${testNarrativeId}`, {
      headers: { Cookie: authCookie }
    });

    expect(response.status()).toBe(200);
  });

  test('92 - DELETE /api/chapters/:id - Delete chapter', async () => {
    if (!testChapterId) test.skip();

    const response = await apiContext.delete(`/api/chapters/${testChapterId}`, {
      headers: { Cookie: authCookie }
    });

    expect(response.status()).toBe(200);
  });

  test('93 - DELETE /api/sessions/:id - Delete session', async () => {
    if (!testSessionId) test.skip();

    const response = await apiContext.delete(`/api/sessions/${testSessionId}`, {
      headers: { Cookie: authCookie }
    });

    expect(response.status()).toBe(200);
  });

  test('99 - POST /api/auth/logout - Logout', async () => {
    const response = await apiContext.post('/api/auth/logout', {
      headers: authCookie ? { Cookie: authCookie } : {}
    });

    expect(response.status()).toBe(200);
  });
});
