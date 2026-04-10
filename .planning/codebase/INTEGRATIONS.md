# External Integrations - Web Expense Tracker

This document maps the project's external dependencies and internal service integrations.

## 1. Database Integration
- **Source**: `api/db_connect.php`
- **Type**: MySQL
- **Connection**: PDO (localhost)
- **Schema**:
    - `expense_tracker` (Database name)
    - `users` (Authentication)
    - `expenses` (Transaction records)
    - `categories` (Management)
    - `budget` (Limit tracking)

## 2. PWA & Browser APIs
- **Service Worker**: `sw.js`
    - Intercepts network requests for offline support.
    - Manages a static asset cache (`expense-tracker-v5`).
- **Web App Manifest**: `manifest.php`
    - Standalone mode integration.
    - Theme and background color synchronization.
- **LocalStorage**: Used for persisting state between sessions and potentially for offline data synchronization.
- **Notification API**: `index.html:L39` and `sw.js:L64`
    - Implemented for daily reminders and transaction alerts.
- **Media Capture API**: `index.html:L99`
    - Uses `capture="environment"` to trigger the camera directly for receipt capture.

## 3. Library CDNs
The project relies on these external content delivery networks:
- **CDNJS (Cloudflare)**:
    - Font Awesome (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`)
- **jsdelivr**:
    - Chart.js (`https://cdn.jsdelivr.net/npm/chart.js`)

## 4. Host Environments
- **Localhost**: Default development environment (optimized for XAMPP/WAMP).
- **InfinityFree**: Target deployment environment (referenced in `infinityfree_setup.sql` and `DEPLOY_INSTRUCTIONS.txt`).
