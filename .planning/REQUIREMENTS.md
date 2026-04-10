# Requirements - Web Expense Tracker

## 1. Technical Requirements (TR)

- **TR-101: Environment Parity**: Application must run on XAMPP (Local) and InfinityFree (Shared Hosting).
- **TR-102: Credential Security**: Database passwords and sensitive identifiers must not be hardcoded in tracked source files.
- **TR-103: Input Sanitization**: All user-provided data must be sanitized before being written to the database (PHP) or rendered in the DOM (JS).
- **TR-104: CSRF Baseline**: Every state-changing request (POST/PUT/DELETE) must include a non-reusable token to prevent cross-site request forgery.

## 2. Functional Requirements (FR)

- **FR-201: Offline Persistence**: Users must be able to log transactions without an active internet connection.
- **FR-202: Sync Reliability**: The `offlineQueue` must process actions sequentially and ensure data consistency upon reconnection.
- **FR-203: Budget Visualization**: The UI must reflect real-time spending progress against a user-defined threshold.
- **FR-204: Recurring Logic**: Automated transactions must be generated "lazily" when the user accesses the app, without requiring server-side cron jobs.

## 3. PWA Requirements (PWA)

- **PWA-301: Installability**: Manifest and Service Worker must satisfy Lighthouse PWA criteria for standalone installation.
- **PWA-302: Asset Caching**: Core assets (index.html, style.css, app.js) must be cached such that the UI loads instantly while offline.
- **PWA-303: User Notifications**: The app should prompt users to log daily expenses using the browser Notification API.

## 4. UI/UX Requirements (UI)

- **UI-401: Glassmorphism**: Maintain a monochromatic, high-contrast, frosted-glass aesthetic.
- **UI-402: Responsive Design**: The dashboard must adapt seamlessly from mobile (320px) to desktop (1200px) widths.
- **UI-403: Offline Feedback**: Provide clear, non-intrusive feedback when the app is in offline mode or syncing data.
