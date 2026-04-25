# Plan - Phase 6: UI Optimization for Phones

This phase focuses on refining the mobile user experience (UX) and ensuring the application is fully responsive and touch-friendly for phone users.

## 1. Context [GS-102]
- **Target**: `index.html`, `style.css`, `js/app.js`, `login.html`.
- **Goal**: Optimize layout for small screens, ensure touch targets are accessible, and improve content priority on mobile.
- **Reference**: [REQUIREMENTS.md](file:///c:/Users/prati/OneDrive/Desktop/Web%20Expence%20tracker/.planning/REQUIREMENTS.md)

## 2. Tasks

- [ ] **T1: Responsiveness & Overflow Audit**
    - [ ] Audit all pages on mobile viewports (280px to 480px).
    - [ ] Remove fixed widths and fix excessive margins on `.dashboard-container`.
    - [ ] Ensure `.offline-banner` doesn't cause horizontal overflow.
- [ ] **T2: Form Row Refactoring**
    - [ ] Refactor inline grid styles in `index.html` into a `.form-row` CSS class.
    - [ ] Implement media query to stack `.form-row` items vertically on screens < 500px.
- [ ] **T3: Content Prioritization (Mobile)**
    - [ ] Reorder the dashboard grid so that the **Add Transaction** form is at the top on mobile.
    - [ ] Enhance the "Sync Complete" notification visibility on mobile.
- [ ] **T4: Touch & Polish**
    - [ ] Ensure buttons and active elements have adequate spacing (>10px).
    - [ ] Polish the "Attach Receipt" input label to look like a premium touch button.
    - [ ] (Optional) Set input font-size to 16px to prevent iOS auto-zoom.

## 3. Verification criteria [UAT]

### Must-Have
- [ ] No horizontal scrollbars on 280px viewport.
- [ ] Form is fully functional and easy to read on mobile.
- [ ] Transaction list items are clear and have accessible touch targets.

## 4. Execution prompt

Audit and optimize the application's UI for mobile devices. Focus on responsiveness in `style.css`, reorder grid components for better mobile priority, and refactor inline grid styles into a responsive `.form-row` class.

