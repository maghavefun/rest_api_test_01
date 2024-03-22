import { config } from './config';
import { DataSource } from 'typeorm';

export const databaseSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: parseInt(config.DB_PORT),
  username: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  entities: ['src/entity/*.ts', 'build/entity/*.js'],
  logging: true,
  synchronize: config.NODE_ENV == 'dev',
});
