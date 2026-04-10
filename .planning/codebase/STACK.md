# Technology Stack - Web Expense Tracker

This document outlines the core technologies, runtimes, and libraries used in this project.

## Core Runtimes & Languages
- **PHP 8.x**: Used for the backend API and dynamic PWA manifest generation.
- **MySQL**: The primary relational database for persistsing user data, categories, and expenses.
- **HTML5 & CSS3**: Native web technologies for structure and styling.
- **JavaScript (ES6+)**: Vanilla JS used for all frontend logic and interactivity.

## Backend (API)
- **Engine**: PHP.
- **Database Driver**: `PDO` (PHP Data Objects) with MySQL driver.
- **Data Format**: `JSON` (all API endpoints return JSON).

## Frontend (UI)
- **Styling**: Vanilla CSS with custom properties (CSS Variables) for a dark, glassmorphic design system.
- **Icons**: [Font Awesome 6.0.0](https://fontawesome.com/) (loaded via CDN).
- **Charts**: [Chart.js](https://www.chartjs.org/) (loaded via CDN) for monthly expense visualization.
- **Architecture**: Single-page-like behavior managed by `js/app.js` and `js/auth.js`.

## PWA (Progressive Web App)
- **Service Worker**: `sw.js` implements a **Network First** caching strategy with offline fallback for static assets.
- **Manifest**: `manifest.php` provides a dynamic PWA definition allowing for portrait orientation and standalone display mode.
- **Offline Storage**: The system uses `localStorage` for some offline persistence traits (referenced in `sw.js` comments).

## Dependencies
This project follows a "Zero Dependencies" philosophy for the core logic, relying on CDNs for heavy lifting (Chart.js, Font Awesome).

| Category | Technology | Source |
|----------|------------|--------|
| Database | MySQL | Local Server |
| Backend | PHP | Local Server |
| Icons | Font Awesome | CDN |
| Charts | Chart.js | CDN |
