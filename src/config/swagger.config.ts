import { SwaggerConfig } from '@app/core/interfaces/swagger.interface';
import { registerAs } from '@nestjs/config';

export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'nest.js starter',
  description: 'starter with JWT',
  version: '1.0',
  tags: [],
};

export default registerAs(
  'swagger',
  (): Record<string, any> => ({
    username: process.env.SW_USERNAME || '',
    password: process.env.SW_PASSWORD || '',
  }),
);
