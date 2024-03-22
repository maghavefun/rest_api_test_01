import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  BACKEND_PORT: process.env.BACKEND_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  NODE_ENV: process.env.NODE_ENV,
};
