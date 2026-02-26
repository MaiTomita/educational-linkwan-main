import dotenv from 'dotenv';

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',

  GOOGLE_CLIENT_ID: required('GOOGLE_CLIENT_ID'),

  JWT_SECRET: required('JWT_SECRET'),
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME ?? 'linkwan_session',

  GOOGLE_SERVICE_ACCOUNT_JSON: required('GOOGLE_SERVICE_ACCOUNT_JSON'),
  GOOGLE_SHEETS_SPREADSHEET_ID: required('GOOGLE_SHEETS_SPREADSHEET_ID'),
  GOOGLE_SHEETS_USERS_SHEET: process.env.GOOGLE_SHEETS_USERS_SHEET ?? 'users',
  GOOGLE_SHEETS_LOGIN_HISTORY_SHEET: process.env.GOOGLE_SHEETS_LOGIN_HISTORY_SHEET ?? 'login_history'
};
