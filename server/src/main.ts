import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    console.log('[STARTUP] Creating NestJS application...');
    const app = await NestFactory.create(AppModule);
    console.log('[STARTUP] NestJS application created successfully');

    // Cookie parser for refresh tokens in HttpOnly cookies
    console.log('[STARTUP] Setting up cookie parser for JWT refresh tokens...');
    app.use(cookieParser());
    console.log('[STARTUP] Cookie parser configured');

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
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    console.log('[STARTUP] CORS enabled');

    const port = process.env.PORT || 5001;
    console.log(`[STARTUP] Starting server on port ${port}...`);
    await app.listen(port);

    console.log(`🚀 NestJS Backend running on http://localhost:${port}`);
    console.log(`🔐 Authentication: JWT + Refresh Tokens (@robinswood/auth)`);
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
