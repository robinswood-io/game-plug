#!/usr/bin/env node

/**
 * Script de test pour valider la création de chapitre
 * Simule le comportement du frontend avec token JWT
 */

const BACKEND_URL = 'http://localhost:4000';

async function testChapterCreation() {
  console.log('=== Test de création de chapitre ===\n');

  // 1. Login
  console.log('1. Authentification...');
  const loginResponse = await fetch(`${BACKEND_URL}/api/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.com' })
  });

  if (!loginResponse.ok) {
    console.error('Échec de l\'authentification:', loginResponse.statusText);
    process.exit(1);
  }

  const { access_token, user } = await loginResponse.json();
  console.log(`✓ Authentifié en tant que: ${user.email} (GM: ${user.isGM})\n`);

  // 2. Utiliser la session créée précédemment
  const sessionId = '75a80b4d-6847-4546-857c-4eb070c83d1b';
  console.log(`2. Utilisation de la session: ${sessionId}\n`);

  // 3. Créer un chapitre
  console.log('3. Création d\'un chapitre...');
  const chapterData = {
    name: 'Chapitre Test ' + Date.now(),
    description: 'Description de test',
    status: 'planned',
    orderIndex: 0
  };

  const createResponse = await fetch(`${BACKEND_URL}/api/sessions/${sessionId}/chapters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify(chapterData)
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error(`✗ Échec de la création (${createResponse.status}):`, errorText);
    process.exit(1);
  }

  const chapter = await createResponse.json();
  console.log('✓ Chapitre créé avec succès:');
  console.log(`  - ID: ${chapter.id}`);
  console.log(`  - Nom: ${chapter.name}`);
  console.log(`  - Status: ${chapter.status}`);
  console.log(`  - Session: ${chapter.sessionId}\n`);

  // 4. Vérifier la récupération
  console.log('4. Récupération des chapitres...');
  const listResponse = await fetch(`${BACKEND_URL}/api/sessions/${sessionId}/chapters`, {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  if (!listResponse.ok) {
    console.error('✗ Échec de la récupération:', listResponse.statusText);
    process.exit(1);
  }

  const chapters = await listResponse.json();
  console.log(`✓ ${chapters.length} chapitre(s) trouvé(s):`);
  chapters.forEach(ch => {
    console.log(`  - ${ch.name} (${ch.status})`);
  });

  console.log('\n=== Test réussi ===');
}

testChapterCreation().catch(err => {
  console.error('Erreur inattendue:', err);
  process.exit(1);
});
