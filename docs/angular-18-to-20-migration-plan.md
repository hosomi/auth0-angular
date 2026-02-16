# Angular Migration Plan (Current: v18 → Target: v20)

This plan is tailored for this repository and upgrades Angular **one major at a time** with rollback points after each phase.

> **Troubleshooting mode used in this runbook:** for each migration failure, capture the exact error log, identify root cause, apply a minimal code/dependency fix, and re-run build/tests before continuing.

---

## 0) Baseline analysis (from `package.json`)

Detected versions:

- Angular framework/libs: `^18.2.13`
- Angular CLI/build tooling: `^18.2.20`
- TypeScript: `~5.4.5`
- RxJS: `~7.5.6`
- zone.js: `~0.14.10`
- Auth SDK: `@auth0/auth0-spa-js ^1.22.2`
- UI libs to validate on each step: `@ng-bootstrap/ng-bootstrap ^17.0.0`, `@fortawesome/angular-fontawesome ^0.15.0`, `ngx-highlightjs ^7.0.0`

Why target v20 in this plan:

- The workspace already carries Angular v18 and ecosystem tooling that aligns with modern Angular.
- Upgrade sequence is therefore: **18 → 19 → 20**.

---

## 1) Pre-migration safety checks (run once)

```bash
git checkout -b chore/migrate-angular-18-to-20
node -v
npm -v
npx ng version
npm ci
npm run build
npm test
```

Capture full logs for diagnosis (do this on every failed command):

```bash
mkdir -p .migration-logs
npx ng update @angular/core@19 @angular/cli@19 --verbose 2>&1 | tee .migration-logs/ng-update-18-19.log
```

### Dependency guardrails

- Keep TypeScript and RxJS in ranges supported by the Angular major currently installed.
- Use `ng update` first (preferred) because it applies framework migrations and adjusts compatible dependency versions.

### Rollback checkpoint

```bash
git add -A
git commit -m "chore: baseline before angular migration"
```

If anything fails later:

```bash
git reset --hard HEAD
npm ci
```

---

## 2) Step 1 — Upgrade Angular 18 → 19

### Commands

```bash
# framework + cli together
npx ng update @angular/core@19 @angular/cli@19

# keep tooling aligned
npx ng update @angular-devkit/build-angular@19 @angular/compiler-cli@19

# refresh lockfile and install resolved versions
npm install

# verify
npx ng version
npm run build
npm test
```

### Expected dependency changes

- Angular packages move from `18.x` to `19.x`.
- TypeScript is lifted to a 19-compatible version by migrations (typically TS 5.5+).
- RxJS remains on v7 and should stay in Angular-supported range.
- ESLint ecosystem may need alignment if peer warnings appear.

### Expected errors → concrete fixes

1. **Error**: `TS2554/TS2345` around `throwError(err)` usage.

   **Why**: newer RxJS signatures prefer lazy error factories.

   **Fix**:

   ```diff
   - catchError(err => throwError(err))
   + catchError(err => throwError(() => err))
   ```

2. **Error**: Auth0 typings import path no longer resolves (`.../dist/typings/Auth0Client`).

   **Why**: deep import path is brittle across SDK versions.

   **Fix** (safe refactor to public type export):

   ```diff
   - import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
   + import type { Auth0Client } from '@auth0/auth0-spa-js';
   ```

3. **Error**: strict null checks for `loggedIn: boolean = null;`.

   **Fix**:

   ```diff
   - loggedIn: boolean = null;
   + loggedIn: boolean | null = null;
   ```

4. **Error**: Router guard signature warnings with strict router typings.

   **Fix** (minimal, no behavioral change):

   ```diff
   - canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
   + canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
   ```

### Real error patterns from this repository's migration history

Below are failures that already occurred in this project during prior Angular upgrades and how to fix them safely.

#### A) `Migration failed: Incompatible peer dependencies found`

**Observed log excerpt**

- `Package "@angular-devkit/build-angular" has an incompatible peer dependency to "karma"`
- `Package "@angular/core" has an incompatible peer dependency to "zone.js"`

**Root cause**

- Existing `karma` / `zone.js` versions were outside the target Angular major's accepted peer ranges.

**Exact fix**

```bash
# 1) Ask ng to compute compatible versions for target major
npx ng update @angular/core@19 @angular/cli@19

# 2) If peer conflict blocks update, align problematic peers manually
npm install -D karma@latest karma-jasmine@latest karma-chrome-launcher@latest
npm install zone.js@~0.15

# 3) Re-run update
npx ng update @angular/core@19 @angular/cli@19
```

**Safer alternative**

- Avoid `--force` first. Use it only after recording peer warnings and planning follow-up fixes.

#### B) TypeScript strictness errors after migrations

**Root cause**

- New Angular/TS versions tighten types, exposing nullable and inferred-type issues.

**Exact fix with before/after examples**

`src/app/auth/auth.service.ts`

```diff
- loggedIn: boolean = null;
+ loggedIn: boolean | null = null;
```

`src/app/auth/auth.guard.ts`

```diff
- canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
+ canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
```

#### C) RxJS `throwError` signature regressions

**Root cause**

- RxJS modern signatures expect lazy error factories.

**Exact fix with before/after example**

`src/app/auth/auth.service.ts`

```diff
- catchError(err => throwError(err))
+ catchError(err => throwError(() => err))
```

### Post-step validation

```bash
npm run build
npm test
# optional lint if used in CI
npx eslint .
```

### Rollback for this step

```bash
git restore .
git clean -fd
npm ci
```

Commit when green:

```bash
git add -A
git commit -m "chore: migrate angular 18 to 19"
```

---

## 3) Step 2 — Upgrade Angular 19 → 20

### Commands

```bash
npx ng update @angular/core@20 @angular/cli@20
npx ng update @angular-devkit/build-angular@20 @angular/compiler-cli@20
npm install

# verify
npx ng version
npm run build
npm test
```

### Expected dependency changes

- Angular packages move to `20.x`.
- TypeScript is upgraded to an Angular 20-compatible range (commonly TS 5.8+).
- RxJS stays on v7 unless migration suggests otherwise.
- `zone.js` may be adjusted by CLI to the expected 20-compatible range.

### Third-party library safety updates

Run and resolve peer dependency warnings without forcing incompatible installs:

```bash
npm outdated
npm ls @ng-bootstrap/ng-bootstrap @fortawesome/angular-fontawesome ngx-highlightjs @auth0/auth0-spa-js
```

If peer errors occur, upgrade incrementally:

```bash
npm install @ng-bootstrap/ng-bootstrap@latest @fortawesome/angular-fontawesome@latest ngx-highlightjs@latest
npm install @auth0/auth0-spa-js@latest
```

> Prefer one library bump at a time if build starts failing, then re-run build/tests after each bump.

### Expected errors → concrete fixes

1. **Error**: `Module has no exported member` / type-only import issues.

   **Fix**: convert to `import type` for pure types and avoid deep imports.

2. **Error**: template strictness issues (`possibly 'null'`).

   **Fix**: add null guards in templates (`*ngIf`) and widen TS types where nullable by design.

3. **Error**: legacy RxJS operator typing regressions.

   **Fix**: annotate callback parameters and return types explicitly in `pipe(...)` chains.

4. **Error**: Auth0 type import breaks after SDK bump.

   **Why**: deep imports such as `@auth0/auth0-spa-js/dist/typings/...` are not stable API.

   **Fix**:

   ```diff
   - import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
   + import type { Auth0Client } from '@auth0/auth0-spa-js';
   ```

### Example safe refactor diff (Auth0 service)

```diff
- catchError(err => throwError(err))
+ catchError(err => throwError(() => err))

- import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
+ import type { Auth0Client } from '@auth0/auth0-spa-js';

- loggedIn: boolean = null;
+ loggedIn: boolean | null = null;
```

### Post-step validation

```bash
npm run build
npm test
npx ng serve --configuration development
```

Manual checks:

- Login redirect works.
- Callback parsing (`code`, `state`) still resolves user.
- Protected route redirects unauthenticated users to Auth0.
- Logout returns to configured URL.

### Rollback for this step

```bash
git restore .
git clean -fd
npm ci
```

If install state is corrupted (common after interrupted `ng update`):

```bash
git reset --hard HEAD
git clean -fd
rm -rf node_modules package-lock.json
npm install
npm run build
```

Commit when green:

```bash
git add -A
git commit -m "chore: migrate angular 19 to 20"
```

---

## 4) Authentication-specific hardening (recommended after v20)

These are low-risk improvements that reduce future upgrade breakage:

1. Replace deep imports from Auth0 package with public exports (`import type`).
2. Keep auth callback logic typed and nullable-safe.
3. Add focused tests for:
   - `AuthGuard` redirects when not authenticated.
   - `AuthService.handleAuthCallback` navigates to `appState.target`.
4. Pin Auth0 SDK to a known compatible minor in lockfile and update intentionally.

Suggested verification commands:

```bash
npm test -- --include src/app/auth/auth.service.spec.ts
npm test -- --include src/app/auth/auth.guard.spec.ts
```

---

## 5) CI/verification checklist after each major

Run this exact sequence after **each** major update:

```bash
npm ci
npx ng version
npm run build
npm test
npx eslint .
```

Accept the step only when all pass.

---

## 6) Failure recovery playbook

If migration command partially modifies files and fails:

1. Inspect changes:

   ```bash
   git status
   git diff
   ```

2. If issue is quick fixable, patch and continue.
3. If unclear, rollback to the last green commit:

   ```bash
   git reset --hard HEAD
   npm ci
   ```

4. Re-run the same major upgrade with a clean tree.
5. If npm dependency resolution blocks progress, remove lockfile + reinstall once:

   ```bash
   rm -f package-lock.json
   npm install
   npm run build
   npm test
   ```

### Mandatory failure template (use every time)

For each failed command, record this in your migration notes:

1. **Error log** (exact lines)
2. **Root cause** (dependency mismatch / TS strictness / API change)
3. **Exact fix command or code patch**
4. **Before/after snippet**
5. **Verification command output** (`npm run build`, `npm test`)
6. **Safer alternative** (e.g., avoid `--force`, pin previous minor, isolate third-party bump)

---

## 7) Finalization

After successful v20 migration:

```bash
git log --oneline --decorate -n 5
npx ng version
npm run build
npm test
```

Prepare release notes summarizing:

- Angular 18→19→20 progression.
- TypeScript/RxJS compatibility decisions.
- Third-party package updates.
- Any auth-specific code adjustments.
