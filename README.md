# Auth0 - Angular

Auth0 authentication and authorization module & Angular.  


:link: [Auth0](https://auth0.com/jp/)  
:link: [Angular](https://angular.jp/)  


## env 

* ng --version

```powershell
PS > ng --version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 10.1.6
Node: 12.18.1
OS: win32 x64

Angular: 10.1.5
... animations, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router
Ivy Workspace: Yes

Package                         Version
---------------------------------------------------------
@angular-devkit/architect       0.1001.6
@angular-devkit/build-angular   0.1001.6
@angular-devkit/core            10.1.6
@angular-devkit/schematics      10.1.6
@angular/cli                    10.1.6
@schematics/angular             10.1.6
@schematics/update              0.1001.6
rxjs                            6.6.3
typescript                      4.0.3
```


## 1. setup

### 1.1 Angular

```powershell
PS > ng new auth0-angular
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? SCSS   [ https://sass-lang.com/documentation/syntax#scss
      ]

PS >cd .\auth0-angular\
PS auth0-angular>
```

追加コンポーネントは適宜追加。

```powershell
PS auth0-angular>ng g s auth
PS auth0-angular>ng g c components/nav-bar
...
```

### 1.2 Auth0

:link: [Auth0 Angular SDK Quickstarts: Login](https://auth0.com/docs/quickstart/spa/angular?framed=1&sq=1#configure-auth0)  

こちらのガイドを参考にして必要に応じて Angular コンポーネントを追加していく。  

#### 1.2.1 Auth0 Applications Settings

ローカルでテストする場合、次の項目に Angular で `ng serve` した URL を設定してください。  
複数指定可能ですので、ステージング URL、本番 URL も登録しておくと便利です。  
認証を変えたい場合、環境毎に Auth0 のアプリケーションを複数登録してください。

* Allowed Callback URLs : http://localhost:4200
* Allowed Logout URLs: http://localhost:4200
* Allowed Web Origins: http://localhost:4200


