# Plan - Phase 3: CSRF & Request Integrity

This phase implements Cross-Site Request Forgery (CSRF) protection by introducing a token-based handshake between the frontend and backend.

## 1. Context [GS-102]
- **Target**: `api/auth.php`, `js/auth.js`, `js/app.js`, and all state-changing endpoints.
- **Goal**: Prevent unauthorized external sites from triggering API actions.
- **Reference**: [CONCERNS.md](file:///c:/Users/prati/OneDrive/Desktop/Web%20Expence%20tracker/.planning/codebase/CONCERNS.md)

## 2. Tasks

- [ ] **T1: Implement Backend Token Generation**
    - Modify `api/auth.php` to generate `$_SESSION['csrf_token']` if missing.
    - Return the token in `login`, `register`, and `check_session` JSON responses.
- [ ] **T2: Setup Backend Validation Helper**
    - Create `api/csrf_helper.php` with a `verifyCSRF()` function.
    - It should check the `X-CSRF-Token` header against the session and `exit()` with 403 on failure.
- [ ] **T3: Integrate CSRF Checks**
    - Add `verifyCSRF()` to `api/expenses.php` (POST, PUT, DELETE).
    - Add it to `api/budget.php` (POST).
    - Add it to `api/auth.php` (Logout/Register/etc if applicable).
- [ ] **T4: Update Frontend Handshake**
    - Update `js/auth.js` to store the token in `window.csrfToken`.
    - Update `js/app.js` to include the `X-CSRF-Token` header in all `fetch` calls with non-GET methods.

## 3. Verification criteria [UAT]

### Must-Have
- [ ] Valid dashboard actions (add/edit/delete) work seamlessly.
- [ ] Requests without the `X-CSRF-Token` header return `403 Forbidden`.
- [ ] Requests with an invalid/mismatched token return `403 Forbidden`.

## 4. Execution prompt

Implement the CSRF protection plan. Generate a session-bound token in the backend and enforce its presence in the headers of all state-changing frontend requests.
