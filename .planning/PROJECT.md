# Project - Web Expense Tracker (PWA)

A comprehensive, offline-first personal finance management tool built for students. This application bridges the gap between traditional PHP backend principles and modern Progressive Web App (PWA) paradigms, ensuring users can track expenses anywhere—even without an active internet connection.

## Context
- **Status**: Brownfield (Core features implemented, seeking optimization/hardening).
- **Origin**: S.Y. B.Tech Microproject (Summer 2026).
- **Primary Goal**: Deliver a premium, secure, and resilient financial dashboard that mimics native app behavior on mobile devices.

## Requirements

### Validated
- ✓ **PWA Foundation**: Service Worker (`sw.js`) and dynamic manifest for full installability.
- ✓ **Offline Core**: Manual Sync Queue in `localStorage` for intercepting actions without network.
- ✓ **CRUD Engine**: Full Create/Read/Update/Delete operations for income and expenses.
- ✓ **Image Handling**: Client-side Canvas compression for receipt photos.
- ✓ **Automation**: "Lazy" recurring expense logging on authentication.
- ✓ **Security**: PDO Prepared Statements and BCrypt password hashing.

### Active
- [ ] **Security Baseline**: Externalize DB credentials from `api/db_connect.php`.
- [ ] **XSS Hardening**: Refactor `innerHTML` usage in `js/app.js` to safer alternatives.
- [ ] **CSRF Protection**: Implement token-based validation for state-changing API calls.
- [ ] **PWA UX**: Improve offline banner visibility and sync status feedback.
- [ ] **Future Scope**: OCR Receipt parsing (extracting data from photos).
- [ ] **Future Scope**: Multi-device synchronization.

### Out of Scope
- **Bank Integrations**: Direct scraping of bank ledgers (Plaid/OAuth) was excluded for this academic scope.
- **Dedicated SSL**: Production-grade SSL certificates for native push notifications (requires specific server infrastructure).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS & PHP | Maintain zero-dependency focus for maximum performance on low-end hardware. | ✓ Validated |
| Offline-First Queue | Solves data loss in subways/basements during logging. | ✓ Validated |
| Lazy Recurring | Avoids complex Server-side Cron jobs (optimized for free hosting like InfinityFree). | ✓ Validated |
| Mono-Glassmorphism | Modern, high-contrast aesthetic with reduced cognitive load. | ✓ Validated |

## Evolution
This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-04-11 after GSD initialization*
