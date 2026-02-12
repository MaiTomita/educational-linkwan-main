# educational-linkwan-main (MERN + Google Sheets)

## 概要 / Overview
本プロジェクトは、旧来の静的HTML/CSS/JSプロジェクトを、MERNスタック風（MongoDB→Google Sheets）にフルリニューアルしたものです。

- **Frontend**: Vite + React (multi-page) → `Title.html`, `Setting.html`
- **Backend**: Node.js + Express API
- **Database**: Google Sheets (Service Account経由)
- **Authentication**: Google Identity Services (OAuth2) → バックエンドでIDトークン検証 → JWT session cookie

## プロジェクト構成 / Project Structure
```
/client              # Vite + React フロントエンドアプリ
  /src/title         # Title画面のReactコンポーネント
  /src/setting       # Setting画面のReactコンポーネント
  /src/shared        # 共通ユーティリティ (API, Google Identity)
  /public            # 静的アセット (画像・フォント)
  Title.html         # Title画面のエントリーポイント
  Setting.html       # Setting画面のエントリーポイント

/server              # Express バックエンドAPI
  /src/index.js      # メインサーバ
  /src/auth.js       # Google OAuth検証・JWT管理
  /src/sheets.js     # Google Sheets API連携
  /src/google.js     # Google認証ライブラリ初期化
  /src/env.js        # 環境変数バリデーション

/legacy_static_backup  # 旧来の静的ファイル (参照用バックアップ)
```

## 1) Google Cloud設定 (必須 / Required)
1. **OAuth 2.0 Client ID (ウェブアプリケーション)** を作成し、`GOOGLE_CLIENT_ID`を取得
   - 「承認済みJavaScriptオリジン」に `http://localhost:5173` を追加
2. **Service Account**を作成し、JSON鍵ファイルをダウンロード
   - 「IAM」で「編集者」権限を付与
3. **Google Spreadsheet**を作成し、以下の2つのシートを追加:
   - `users`
   - `login_history`
4. ServiceアカウントのメールアドレスをSpreadsheetに「編集者」として共有

## 2) ローカル実行 / Run Locally
### Backend
1. `.env`ファイル作成:
   ```bash
   cp server/.env.example server/.env
   ```
   - `GOOGLE_CLIENT_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `GOOGLE_SHEETS_SPREADSHEET_ID`等を入力
2. インストール & 起動:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   → http://localhost:4000 でAPIサーバ起動

### Frontend
1. `.env`ファイル作成 (任意):
   ```bash
   cp client/.env.example client/.env
   ```
   - `VITE_GOOGLE_CLIENT_ID`と`VITE_API_BASE_URL`を確認
2. インストール & 起動:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   → http://localhost:5173 でVite dev server起動

3. ブラウザで以下にアクセス:
   - http://localhost:5173/Title.html

## 3) 機能説明 / Features
- **Title画面**: Googleログインボタン、天気情報（Open-Meteo JMA API）、アニメーション
- **Setting画面**: ログイン状態・ユーザー情報表示、設定項目（スイッチ等）
- **ログイン**: Google Identity Services → バックエンドでIDトークン検証 → JWT session cookie発行
- **DB**: ユーザー情報・ログイン履歴をGoogle Sheetsに保存・読み取り

## 4) 注意事項 / Notes
- ログイン成功後、自動的に`Setting.html`にリダイレクト
- ログイン状態は`GET /api/me`でセッションクッキーを利用して取得
- 旧来の静的ファイルは`/legacy_static_backup`に移動済み（現在のプロジェクトでは使用されません）
- Google Cloud Consoleで「承認済みJavaScriptオリジン」にlocalhost:5173を必ず追加してください

## 5) トラブルシューティング / Troubleshooting
- **エラー: "no registered origin"**: Google Cloud ConsoleのOAuth設定で「承認済みJavaScriptオリジン」にlocalhostを追加してください
- **Sheets APIエラー**: Service AccountのメールアドレスがSpreadsheetに編集者として共有されているか確認してください
- **ログイン後リダイレクトしない**: クライアントの`.env`とバックエンドの`.env`でCLIENT_IDが一致しているか確認してください
