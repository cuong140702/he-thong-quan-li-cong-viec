import z from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({
  path: '.env',
});
// Ki?m tra coi th? c� file .env hay ch?a
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Kh�ng t�m th?y file .env');
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
  console.log('C�c gi� tr? khai b�o trong file .env kh�ng h?p l?');
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
