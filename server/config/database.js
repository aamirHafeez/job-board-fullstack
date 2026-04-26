import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getSslConfig() {
  if (process.env.DB_SSL !== 'true') {
    return undefined;
  }

  return {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  };
}

export const pool = mysql.createPool({
  host: getRequiredEnv('DB_HOST'),
  port: Number(getRequiredEnv('DB_PORT')),
  user: getRequiredEnv('DB_USER'),
  password: getRequiredEnv('DB_PASSWORD'),
  database: getRequiredEnv('DB_NAME'),
  ssl: getSslConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
