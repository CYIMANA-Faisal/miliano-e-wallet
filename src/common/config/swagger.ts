import { DocumentBuilder } from '@nestjs/swagger';

const swaggerOptions = {
  title: 'Miliano-eWallet API',
  description: 'Swagger documentation for Miliano-eWallet API',
  version: '1.0.0',
};

export const options = new DocumentBuilder()
  .setTitle(swaggerOptions.title)
  .setDescription(swaggerOptions.description)
  .setVersion(swaggerOptions.version)
  .build();

export const url = 'swagger-docs';
