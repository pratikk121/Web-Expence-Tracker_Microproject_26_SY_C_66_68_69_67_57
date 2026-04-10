# Testing Strategy - Web Expense Tracker

This document describes the current state of verification and the strategy for ensuring quality.

## 1. Current State
There are **no automated unit or integration tests** (PHPUnit, Jest, etc.) currently implemented in the repository. Quality is maintained through manual verification and browser-level testing.

## 2. Manual Verification Checklist
When modifying the application, the following areas must be manually verified:
- **Authentication**: Login, registration, and session persistence (including logout).
- **Core CRUD**: Adding, editing, and deleting expenses/income.
- **PWA Features**:
    - Installability (Manifest verification).
    - Service Worker registration.
    - Offline accessibility (Static assets).
    - Offline queueing/syncing (POST/PUT/DELETE while in airplane mode).
- **Charts**: Correct rendering of monthly summaries.
- **Budget**: Set budget vs. spending progress bar colors (Green -> Orange -> Red).
- **Currency**: Switching currency and rate conversion accuracy.

## 3. Tool-Based Validation
- **Database**: Verification of data integrity using `infinityfree_setup.sql`.
- **Browser DevTools**:
    - **Application Tab**: Inspect Service Worker and Local Storage.
    - **Network Tab**: Verify Fetch payloads and offline behavior.
    - **Lighthouse**: Check PWA score.

## 4. Proposed Improvements
- **Integration Tests**: Implement simple PHP tests for the `api/` endpoints.
- **UI Tests**: Add Playwright or Puppeteer for end-to-end PWA flow verification.
- **Linting**: Introduce ESLint for JavaScript and `phpcs` for PHP consistency.
