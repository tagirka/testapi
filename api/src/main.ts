import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidateInputPipe } from './libs/pipes/validate.pipe';

import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { BadRequestException } from '@nestjs/common';

import { ValidationError } from 'class-validator';

async function bootstrap() {
  const PORT = process.env.PORT || 5400;

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidateInputPipe({
      exceptionFactory: (err: ValidationError[]) => {
        const result = err.map((e) => ({
          property: e.property,
          message: e.constraints[Object.keys(e.constraints)[0]],
        }));

        return new BadRequestException(result);
      },
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      disableErrorMessages: true,
      // forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    })
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const config = new DocumentBuilder()
    .setTitle('web-api')
    .setDescription('ues web api')
    .setVersion('0.0.1')
    //.addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document); /* {
    swaggerOptions: {
      persistAuthorization: true,
    },
  } */

  await app.listen(PORT, () =>
    console.log(`Server started on: ${PORT}/${globalPrefix}`)
  );
}

bootstrap();
