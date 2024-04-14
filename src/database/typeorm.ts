import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
dotenvConfig({ path: '.env' });

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: +`${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [join(__dirname, '/src/database/Entity/*.ts')],
  migrations: [join(__dirname, '/src/database/migrations/*.ts')],
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
