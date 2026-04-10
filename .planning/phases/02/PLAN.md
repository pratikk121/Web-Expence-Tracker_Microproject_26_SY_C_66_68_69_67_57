# Plan - Phase 2: Sanitization & XSS Protection

This phase refactors the application to prevent Cross-Site Scripting (XSS) by ensuring all user-controlled data is escaped before being rendered.

## 1. Context [GS-102]
- **Target**: `js/app.js` and `api/expenses.php`
- **Goal**: Transition from `innerHTML` to a sanitized rendering model.
- **Reference**: [CONCERNS.md](file:///c:/Users/prati/OneDrive/Desktop/Web%20Expence%20tracker/.planning/codebase/CONCERNS.md)

## 2. Tasks

- [ ] **T1: Implement Frontend Escaping**
    - Add `escapeHTML(str)` utility to `js/app.js`.
    - Apply it to `renderExpenses` for `description` and `category_name`.
    - Apply it to dynamic tooltips and titles.
- [ ] **T2: Refactor Optimistic UI State**
    - Ensure `expensesData` is populated with safe strings in the `addExpense` catch block.
- [ ] **T3: Refactor Category Copying**
    - Update `openEditModal` to copy options safely without raw `innerHTML` transfer if possible.
- [ ] **T4: Harden Backend Input**
    - Review `api/expenses.php` sanitization (`strip_tags`) and ensure all inputs are consistently filtered.
    - Ensure `amount` is strictly cast to float.

## 3. Verification criteria [UAT]

### Must-Have
- [ ] Malicious descriptions like `<img src=x onerror=alert(1)>` are displayed as literal text and do not execute.
- [ ] The application functions identically to the user for valid data.
- [ ] Special characters (`&`, `<`, `>`) render correctly in the dashboard and exported CSV.

## 4. Execution prompt

Implement the XSS protection plan. Refactor the frontend rendering pipeline to escape all user-controlled data using a centralized helper. Ensure the backend input sanitization is robust and consistent.
