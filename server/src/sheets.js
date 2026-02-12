import { google } from 'googleapis';
import { env } from './env.js';

function getServiceAccountCredentials() {
  // Accept either a JSON string or a path-like JSON via env.
  // Recommended: set GOOGLE_SERVICE_ACCOUNT_JSON to the *file contents* (JSON) in local .env
  // or to a JSON string in deployment.
  try {
    return JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } catch {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON must be a JSON string (service account key).'
    );
  }
}

let sheetsClientPromise;
async function getSheetsClient() {
  if (sheetsClientPromise) return sheetsClientPromise;

  sheetsClientPromise = (async () => {
    const credentials = getServiceAccountCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const authClient = await auth.getClient();
    return google.sheets({ version: 'v4', auth: authClient });
  })();

  return sheetsClientPromise;
}

function nowIso() {
  return new Date().toISOString();
}

async function readAllUsers() {
  const sheets = await getSheetsClient();
  const range = `${env.GOOGLE_SHEETS_USERS_SHEET}!A2:F`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range
  });
  return res.data.values ?? [];
}

async function ensureHeaders() {
  const sheets = await getSheetsClient();

  // users header
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${env.GOOGLE_SHEETS_USERS_SHEET}!A1:F1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        'google_sub',
        'email',
        'name',
        'picture',
        'created_at',
        'last_login_at'
      ]]
    }
  });

  // login_history header
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${env.GOOGLE_SHEETS_LOGIN_HISTORY_SHEET}!A1:F1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        'login_at',
        'google_sub',
        'email',
        'name',
        'ip',
        'user_agent'
      ]]
    }
  });
}

async function appendLoginHistory({ user, ip, userAgent }) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${env.GOOGLE_SHEETS_LOGIN_HISTORY_SHEET}!A:F`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[nowIso(), user.sub, user.email, user.name, ip, userAgent]]
    }
  });
}

async function upsertUser(user) {
  const sheets = await getSheetsClient();

  const rows = await readAllUsers();

  // rows are values from A2, so rowIndex in sheet is +2
  const foundIndex = rows.findIndex((r) => r?.[0] === user.sub || r?.[1] === user.email);

  const createdAt = nowIso();
  const lastLoginAt = createdAt;

  if (foundIndex === -1) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `${env.GOOGLE_SHEETS_USERS_SHEET}!A:F`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[user.sub, user.email, user.name, user.picture, createdAt, lastLoginAt]]
      }
    });
    return;
  }

  const sheetRowNumber = foundIndex + 2;

  // Preserve created_at if present.
  const existing = rows[foundIndex] ?? [];
  const existingCreatedAt = existing[4] || createdAt;

  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${env.GOOGLE_SHEETS_USERS_SHEET}!A${sheetRowNumber}:F${sheetRowNumber}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        user.sub,
        user.email,
        user.name,
        user.picture,
        existingCreatedAt,
        nowIso()
      ]]
    }
  });
}

export async function upsertUserAndAppendLogin({ user, ip, userAgent }) {
  // Ensure headers exist; if sheets are missing, this will fail with a helpful API error.
  await ensureHeaders();
  await upsertUser(user);
  await appendLoginHistory({ user, ip, userAgent });
}
