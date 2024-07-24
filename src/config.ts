import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
const envs = {
  port: process.env.PORT,
  environment: process.env.ENVIRONMENT,
  s3Manager: process.env.S3MANAGER,
  microservicePort: process.env.MICROSERVICE_PORT,
  microserviceHost: process.env.MICROSERVICE_HOST,
};
export default registerAs('config', () => envs);
