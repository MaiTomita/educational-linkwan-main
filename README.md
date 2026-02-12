# educational-linkwan-main (MERN + Google Sheets)

## Overview
- Frontend: Vite + React (multi-page) -> `Title.html`, `Setting.html`
- Backend: Express API
- DB: Google Sheets (via Service Account)
- Auth: Google Identity Services -> backend verifies ID token -> JWT session cookie

## 1) Google Cloud setup (required)
1. Create OAuth 2.0 Client ID (Web) and get `GOOGLE_CLIENT_ID`.
2. Create a Service Account key (JSON).
3. Create a Google Spreadsheet and add two sheets:
   - `users`
   - `login_history`
4. Share the spreadsheet with the Service Account email (Editor 권한).

## 2) Run locally
### Backend
- Copy `server/.env.example` -> `server/.env` and fill values
- Install & run:
  - `cd server && npm install`
  - `npm run dev`

### Frontend
- Install & run:
  - `cd client && npm install`
  - `npm run dev`

Then open:
- http://localhost:5173/Title.html

## Notes
- On successful login, the app redirects to `Setting.html`.
- Login status is fetched from `GET /api/me` using the session cookie.
