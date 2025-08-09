# Auth0 - Angular

[![Codeship Status for hosomi/auth0-angular](https://app.codeship.com/projects/ee3b73f0-f0c3-0138-07b5-5a73ecf79260/status?branch=main)](https://app.codeship.com/projects/413985)

このリポジトリは、Auth0 を使用して認証を実装した Angular アプリケーションのサンプルです。

:link: [Auth0](https://auth0.com/jp/)  
:link: [Angular](https://angular.jp/)  


## env 

* ng version

```powershell
PS auth0-angular> ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 18.2.20
Node: 18.13.0
Package Manager: npm 10.5.0
OS: win32 x64

Angular: 18.2.13
... animations, common, compiler, core, forms, platform-browser
... platform-browser-dynamic, router

Package                         Version
---------------------------------------------------------
@angular-devkit/build-angular   18.2.20
@angular/cli                    18.2.20
@angular/compiler-cli           18.2.13
rxjs                            7.5.6
typescript                      5.4.5
```


## 1. セットアップ

### 1.1 Auth0 の設定

Auth0 ダッシュボードで新しいアプリケーションを作成し、以下の設定を行います。

- **Application Type**: Single Page Application

アプリケーション設定の以下の項目を後で使用するために控えておきます。
- **Domain**
- **Client ID**

### 1.2 アプリケーションの設定

次に、Angular アプリケーションで Auth0 の認証情報を設定します。プロジェクトの `src/environments/environment.ts` ファイルを開き、Auth0ダッシュボードから取得した **Domain** と **Client ID** を設定してください。

```typescript:src/environments/environment.ts
export const environment = {
  production: false,
  auth: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    redirectUri: 'http://localhost:4200',
  },
};
```

### 1.3 Auth0 ダッシュボードのコールバックURL設定

Auth0 ダッシュボードに戻り、アプリケーション設定で以下のURLを設定します。これにより、認証後のリダイレクトとログアウトが正しく機能します。

- **Allowed Callback URLs**: `http://localhost:4200`
- **Allowed Logout URLs**: `http://localhost:4200`
- **Allowed Web Origins**: `http://localhost:4200`

もし本番環境（`https://ambitious-bush-0cbc8790f.azurestaticapps.net`）でアプリケーションを動作させる場合は、そちらのURLも同様に各項目へ追加する必要があります。

---

:link: [Auth0 Angular SDK Quickstarts: Login](https://auth0.com/docs/quickstart/spa/angular/interactive)
