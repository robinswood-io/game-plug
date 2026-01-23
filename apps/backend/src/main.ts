import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Game-Plug API')
    .setDescription('Call of Cthulhu 7e RPG Platform API - Complete backend specification with NestJS and OpenAPI 3.0')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('http://localhost:4000', 'Development')
    .addServer(`${process.env.API_URL || 'http://localhost:4000'}`, 'Production')
    .setContact('Game-Plug Team', 'https://github.com/robinswood', 'contact@game-plug.dev')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`
🚀 Game Plug Backend (NestJS) is running!

  - API Server: http://localhost:${port}
  - Health Check: http://localhost:${port}/api/health
  - Swagger UI: http://localhost:${port}/api/docs
  - OpenAPI JSON: http://localhost:${port}/api/docs-json

Environment: ${process.env.NODE_ENV || 'development'}
NestJS Version: 11.x
Swagger Version: @nestjs/swagger
  `);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
