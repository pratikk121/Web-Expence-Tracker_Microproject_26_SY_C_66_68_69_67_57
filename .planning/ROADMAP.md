# Roadmap - Web Expense Tracker

## Milestone 1: Technical Hardening & Security Baseline
Focus on resolving the technical debt and security risks identified during the codebase mapping.

### Phase 1: Security Baseline (Hardening Part 1) [DONE]
Secure the foundational configuration and protect against common injection attacks.
- **Goals**: Move DB credentials out of `db_connect.php`; implement PDO best practices check.
- **Depends on**: None

### Phase 2: Sanitization & XSS (Hardening Part 2) [DONE]
Protect the UI from malicious script injection by refactoring modern DOM interaction patterns.
- **Goals**: Replace `innerHTML` with `textContent` or sanitized fragments.
- **Depends on**: Phase 1

### Phase 3: CSRF & Request Integrity (Hardening Part 3) [DONE]
Prevent Cross-Site Request Forgery for all state-changing API endpoints.
- **Goals**: Implement PHP-side CSRF validation and JS-side token headers.
- **Depends on**: Phase 2

### Phase 4: PWA Feedback & UX [DONE]
Improve communication with the user regarding off-grid status and sync progress.
- **Goals**: Refine offline banner styling and add "Sync Complete" notifications.
- **Depends on**: None

### Phase 5: Error Handling Consistency [DONE]
Standardize API responses to ensure the frontend can gracefully handle all server states.
- **Goals**: Unify JSON response triggers for all endpoints (4xx/5xx handling).
- **Depends on**: Phase 3

### Phase 6: UI Optimization for Phones
Refine the mobile user experience to ensure the dashboard is fully responsive and touch-friendly.
- **Goals**: Optimize layout for small screens; enhance touch targets; improve viewport scaling.
- **Depends on**: Phase 4

---
## Milestone 2: Feature Expansion (Future)
Future scalability goals based on the microproject's long-term vision.

### Phase 7: OCR Receipt Parsing
**Goals**: Pilot client-side or partial server-side receipt text extraction.

### Phase 8: Multi-Device Sync
**Goals**: Enhance authentication to support real-time sync across multiple browsers via a stable ID.
