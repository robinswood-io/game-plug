import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectPg from 'connect-pg-simple';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    console.log('[STARTUP] Creating NestJS application...');
    const app = await NestFactory.create(AppModule);
    console.log('[STARTUP] NestJS application created successfully');

    // Session middleware (compatible avec Express existant)
    console.log('[STARTUP] Setting up session middleware...');
    const PgSession = connectPg(session);
    app.use(
      session({
        store: new PgSession({
          conString: process.env.DATABASE_URL,
          tableName: 'sessions',
        }),
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        },
      }),
    );
    console.log('[STARTUP] Session middleware configured');

    // Passport initialization
    console.log('[STARTUP] Initializing Passport...');
    app.use(passport.initialize());
    app.use(passport.session());
    console.log('[STARTUP] Passport initialized');

    // Global validation pipe
    console.log('[STARTUP] Setting up validation pipe...');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    console.log('[STARTUP] Validation pipe configured');

    // CORS configuration
    console.log('[STARTUP] Enabling CORS...');
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    });
    console.log('[STARTUP] CORS enabled');

    const port = process.env.PORT || 5001;
    console.log(`[STARTUP] Starting server on port ${port}...`);
    await app.listen(port);

    console.log(`🚀 NestJS Backend running on http://localhost:${port}`);
    console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'No DATABASE_URL'}`);
  } catch (error) {
    console.error('[STARTUP ERROR] Failed to start application:', error);
    console.error('[STARTUP ERROR] Stack trace:', error.stack);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('[BOOTSTRAP ERROR] Unhandled error during bootstrap:', error);
  console.error('[BOOTSTRAP ERROR] Stack trace:', error.stack);
  process.exit(1);
});
