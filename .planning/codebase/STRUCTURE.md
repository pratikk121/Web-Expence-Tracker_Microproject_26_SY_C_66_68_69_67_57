# Directory Structure - Web Expense Tracker

This document maps the physical layout of the repository and the purpose of key file locations.

## Root Directory
- `index.html`: The main dashboard and core UI (protected by auth check).
- `login.html` / `register.html`: Entry points for user authentication.
- `style.css`: Unified stylesheet for all pages (Glassmorphic design system).
- `sw.js`: Service Worker for PWA features and offline support.
- `manifest.php`: Dynamic Web App Manifest.
- `manifest.json`: Static fallback manifest.
- `setup.sql` / `infinityfree_setup.sql`: Database schema initialization scripts.
- `Launch_App.bat` / `Go_Online.bat`: Utility scripts for local server/deployment environment setup.

## 📂 api/
The backend service layer containing PHP endpoints.
- `db_connect.php`: Global database connection using PDO.
- `auth.php`: Sign-up, Sign-in, and session management.
- `expenses.php`: CRUD operations for transactions and "lazy" recurring expense logic.
- `categories.php`: Fetches user-defined or default categories.
- `budget.php`: Management of monthly budget limits.

## 📂 js/
The frontend application logic.
- `app.js`: Master controller for the dashboard, stats, charts, and offline synchronization.
- `auth.js`: Logic for session verification, login, and registration.

## 📂 .planning/
GSD project management and intelligence.
- `codebase/`: Contextual documents about the project (this folder).
- `intel/`: (Optional) Intelligence files for GSD agents.

## 📂 .git/
Standard git version control repository.
