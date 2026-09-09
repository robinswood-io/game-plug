import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { resolveAllowedOrigins } from './security-config';

async function bootstrap() {
  const allowedOrigins = resolveAllowedOrigins();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Ignorer les props supplémentaires au lieu de les rejeter
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints ? Object.values(error.constraints)[0] : 'Validation failed',
        }));
        console.error('Validation Errors:', JSON.stringify(result, null, 2));
        return new BadRequestException({
          message: 'Erreur de validation',
          errors: result,
        });
      },
    }),
  );

  if (process.env.NODE_ENV !== 'production' || process.env.SWAGGER_ENABLED === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Game-Plug API')
      .setDescription('Call of Cthulhu 7e RPG Platform API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addServer('http://localhost:4000', 'Development')
      .addServer(`${process.env.API_URL || 'http://localhost:4000'}`, 'Production')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
