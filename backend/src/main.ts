import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ErrorCode } from './core/errors/error-code';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: ([{ constraints }]: ValidationError[]) => {
        return new HttpException(
          {
            code: ErrorCode.RequestValidationError,
            message: constraints[Object.keys(constraints)[0]],
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.setGlobalPrefix('v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Comunity Librery Swagger')
    .setDescription('Comunity Librery Backend API Swagger')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, document);
  await app.listen(5001);
}
bootstrap();
