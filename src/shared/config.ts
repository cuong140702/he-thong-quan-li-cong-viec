import z from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({
  path: '.env',
});
// Ki?m tra coi th? có file .env hay ch?a
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm th?y file .env');
  process.exit(1);
}

const configSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá tr? khai báo trong file .env không h?p l?');
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
