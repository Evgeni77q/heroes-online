import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ApiResponseInterceptor());

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('port'));
}

bootstrap();
