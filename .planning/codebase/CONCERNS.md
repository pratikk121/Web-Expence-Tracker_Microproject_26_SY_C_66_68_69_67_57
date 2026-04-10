# Research & Concerns - Web Expense Tracker

This document highlights technical debt, security considerations, and potential areas of failure.

## 1. Security Concerns
- **Hardcoded Credentials**: `api/db_connect.php` contains default root credentials with an empty password. This must be secured or externalized via environment variables before production deployment.
- **Directory Permissions**: The `api/uploads` directory is created with `0777` permissions (`expenses.php:L21`), which may be too broad depending on the hosting environment.
- **XSS Vulnerability**: While `htmlspecialchars` is used in some areas, the use of `innerHTML` for rendering transaction lists (`app.js:L187`) requires strict input sanitization on both ends to prevent malicious script injection.
- **CSRF**: The API currently lacks CSRF tokens for POST/PUT/DELETE requests.

## 2. Technical Debt
- **No Automated Tests**: The project entirely relies on manual verification. This makes it fragile and prone to regressions as more features (like budgeting or multi-user support) are added.
- **Monolithic Frontend Logic**: `js/app.js` is over 700 lines long and handles UI, API calls, charting, and PWA logic. Refactoring into specialized modules (e.g., `ui-service`, `api-service`, `pwa-sync`) is recommended.
- **Lazy Auto-Logger**: The recurring expense logic triggers only when a user visits the dashboard. If a user doesn't log in for months, the first load could be slow while hundreds of entries are generated.

## 3. Reliability & Synchronization
- **Clock Sensitivity**: The "Lazy Recurring" logic relies on the server's current date (`CURDATE()`). Timezone discrepancies between client and server could lead to duplicate or missed logs.
- **Offline Conflict Resolution**: The `offlineQueue` uses a sequential processing model. If an expense is edited multiple times while offline or deleted before being synced, the queue might execute redundant operations.
- **Session Expiration**: If a session expires while the user is offline, the sync process will fail upon reconnection, but the user may not be immediately aware since the UI behaves optimistically.

## 4. Performance
- **Image Payloads**: Receipts are converted to Base64 for transit. While compressed on the client, this increases the JSON payload size and database storage usage significantly compared to multipart/form-data.
- **Client-side Rendering**: For very large transaction histories, the current "render all" strategy (`renderExpenses`) might lead to UI lag during DOM updates.
