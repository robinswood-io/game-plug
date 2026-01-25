import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../shared/schema.js';
import bcryptjs from 'bcryptjs';

async function seed(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🌱 Démarrage du seed...');

  const sql = postgres(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  try {
    // Créer un GM de test
    console.log('👤 Création du GM de test...');
    const passwordHash = await bcryptjs.hash('password123', 10);

    const gmData = await db
      .insert(schema.users)
      .values({
        email: 'gm@example.com',
        passwordHash: passwordHash,
        isGM: true,
        firstName: 'Test',
        lastName: 'GM',
        authType: 'local',
      } as Parameters<typeof schema.users.$inferInsert>[0])
      .returning();

    const gm = gmData[0];
    console.log(`  ✓ GM créé: ${gm.email} (ID: ${gm.id})`);

    // Créer une session de test
    console.log('🎮 Création de la session de test...');
    const sessionData = await db
      .insert(schema.gameSessions)
      .values({
        name: 'Session de test',
        code: 'TEST01',
        gmId: gm.id,
        status: 'preparation',
      } as Parameters<typeof schema.gameSessions.$inferInsert>[0])
      .returning();

    const session = sessionData[0];
    console.log(`  ✓ Session créée: ${session.name} (Code: ${session.code})`);

    // Créer un personnage de test
    console.log('🎭 Création du personnage de test...');
    const charData = await db
      .insert(schema.characters)
      .values({
        sessionId: session.id,
        name: 'Détective Noir',
        occupation: 'Détective privé',
        strength: 70,
        constitution: 65,
        size: 60,
        dexterity: 75,
        appearance: 50,
        intelligence: 80,
        power: 60,
        education: 75,
        luck: 50,
        hitPoints: 12,
        maxHitPoints: 12,
        sanity: 60,
        maxSanity: 80,
        magicPoints: 12,
        maxMagicPoints: 12,
      } as Parameters<typeof schema.characters.$inferInsert>[0])
      .returning();

    const character = charData[0];
    console.log(`  ✓ Personnage créé: ${character.name} (ID: ${character.id})`);

    // Créer un chapitre de test
    console.log('📖 Création du chapitre de test...');
    const chapterData = await db
      .insert(schema.chapters)
      .values({
        sessionId: session.id,
        name: 'Chapitre 1: Le début',
        description: 'Le point de départ de l\'enquête',
        orderIndex: 1,
        status: 'planned',
      } as Parameters<typeof schema.chapters.$inferInsert>[0])
      .returning();

    const chapter = chapterData[0];
    console.log(`  ✓ Chapitre créé: ${chapter.name}`);

    // Créer un inventaire de test
    console.log('🎒 Création d\'objets d\'inventaire de test...');
    const weaponData = await db
      .insert(schema.inventory)
      .values({
        characterId: character.id,
        name: 'Revolver .38',
        description: 'Un revolver classique pour détective',
        category: 'weapon',
        quantity: 1,
        weight: 1,
        damage: '1d6',
        isEquipped: true,
      } as Parameters<typeof schema.inventory.$inferInsert>[0])
      .returning();

    const weapon = weaponData[0];
    console.log(`  ✓ Arme créée: ${weapon.name}`);

    // Créer un journal narratif de test
    console.log('📝 Création d\'une entrée narrative...');
    const narrativeData = await db
      .insert(schema.narrativeEntries)
      .values({
        sessionId: session.id,
        gmId: gm.id,
        content: 'Une nuit sombre et orageuse. Notre détective reçoit un appel téléphonique mystérieux.',
        entryType: 'event',
      } as Parameters<typeof schema.narrativeEntries.$inferInsert>[0])
      .returning();

    console.log(`  ✓ Entrée narrative créée`);

    // Créer un événement de chapitre de test
    console.log('⚡ Création d\'un événement de chapitre...');
    const eventData = await db
      .insert(schema.chapterEvents)
      .values({
        chapterId: chapter.id,
        sessionId: session.id,
        eventType: 'narration',
        title: 'Le mystérieux appel téléphonique',
        description: 'Une voix féminine au bout du fil demande de l\'aide',
        characterId: character.id,
      } as Parameters<typeof schema.chapterEvents.$inferInsert>[0])
      .returning();

    const event = eventData[0];
    console.log(`  ✓ Événement créé: ${event.title}`);

    console.log('\n✅ Seed complété avec succès!');
    console.log('\n📋 Résumé des données créées:');
    console.log(`  • 1 GM: ${gm.email}`);
    console.log(`  • 1 Session: ${session.name} (${session.code})`);
    console.log(`  • 1 Personnage: ${character.name}`);
    console.log(`  • 1 Chapitre: ${chapter.name}`);
    console.log(`  • 1 Arme: ${weapon.name}`);
    console.log(`  • 1 Entrée narrative`);
    console.log(`  • 1 Événement de chapitre`);

    await sql.end();
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    await sql.end();
    process.exit(1);
  }
}

seed();
