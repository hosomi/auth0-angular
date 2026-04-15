# Auth0 - Angular サンプル

Auth0 を使った Angular（v18）向けの認証サンプルアプリです。  
ログイン / ログアウト、認証状態の保持、認証済みユーザーのみアクセスできる保護ルート（`/profile`）を実装しています。

- Auth0: https://auth0.com/jp/
- Angular: https://angular.dev/

## 前提環境

このリポジトリは以下の構成で動作します（`package.json` ベース）。

- Node.js 18 系以上を推奨
- npm
- Angular 18

## セットアップ

```bash
npm install
```

## Auth0 の設定

### 1) Auth0 ダッシュボードでアプリ作成

- **Application Type**: `Single Page Application`

作成後、以下を控えてください。

- **Domain**
- **Client ID**

### 2) 環境変数ファイルを設定

`src/environments/environment.ts`（開発用）を設定します。

```ts
export const environment = {
  production: false,
  auth: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    redirectUri: 'http://localhost:4200',
  },
};
```

必要に応じて `src/environments/environment.prod.ts`（本番用）も同様に設定してください。

### 3) Auth0 側の許可 URL を設定

ローカル実行時:

- **Allowed Callback URLs**: `http://localhost:4200`
- **Allowed Logout URLs**: `http://localhost:4200`
- **Allowed Web Origins**: `http://localhost:4200`

本番 URL で公開する場合は、その URL も上記 3 項目に追加してください。

## 実行

```bash
npm start
```

`npm start` は `ng serve -o` を実行し、通常は `http://localhost:4200` を自動で開きます。

## ビルド / テスト

```bash
npm run build
npm test
```

## 主要ルート

- `/` : ホーム
- `/login` : ログインページ
- `/profile` : 認証必須ページ（未認証時は Auth0 ログインにリダイレクト）

## 実装メモ

- 認証処理は `@auth0/auth0-spa-js` を利用
- `AuthService` でログイン、ログアウト、コールバック処理、ユーザー取得を管理
- `AuthGuard` で保護ルートのアクセス制御を実施

## 参考

- Auth0 Angular SDK Quickstart:  
  https://auth0.com/docs/quickstart/spa/angular/interactive
