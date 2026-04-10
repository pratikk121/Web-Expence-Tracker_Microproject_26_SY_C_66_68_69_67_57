# Plan - Phase 5: Error Handling Consistency

This final phase of Milestone 1 standardizes error communication across the application by unify API responses and introducing a non-intrusive notification system.

## 1. Context [GS-102]
- **Target**: `api/*.php`, `js/app.js`, `index.html`, and `style.css`
- **Goal**: Replace `alert()` with a professional toast system and normalize backend JSON.
- **Reference**: [CONCERNS.md](file:///c:/Users/prati/OneDrive/Desktop/Web%20Expence%20tracker/.planning/codebase/CONCERNS.md)

## 2. Tasks

- [ ] **T1: Implement Shared UI (Notification System)**
    - Add `#toast-container` to `index.html`.
    - Implement Glassmorphic toast styles in `style.css` (Animations: slide-in, fade-out).
- [ ] **T2: Implement Frontend Notification Logic**
    - Create `showToast(msg, type)` in `js/app.js`.
    - Create `handleAPIResponse(response, data)` helper to centralize error catching.
- [ ] **T3: Refactor Alerts**
    - Replace all existing `alert()` instances in `js/app.js` and `js/auth.js` with `showToast()`.
- [ ] **T4: Normalize Backend Responses**
    - Update all PHP endpoints to consistently use `success` and `message` keys.
    - Standardize error messages for database failures and missing fields.

## 3. Verification criteria [UAT]

### Must-Have
- [ ] Triggering a common error (e.g. invalid login) shows a toast, not an alert.
- [ ] Adding an expense shows a "Transaction Added" success toast.
- [ ] 401 Unauthorized responses trigger a redirect to `login.html`.
- [ ] All JSON responses follow the `{"success": bool, "message": "..."}` pattern.

## 4. Execution prompt

Standardize the error handling pipeline. Unify backend JSON response structures and replace all frontend `alert()` calls with a decentralized Glassmorphic toast notification system.
