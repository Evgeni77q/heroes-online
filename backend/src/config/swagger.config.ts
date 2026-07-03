import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Heroes Online API')
  .setDescription('Official Heroes Online Backend API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
