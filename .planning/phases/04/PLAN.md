# Plan - Phase 4: PWA Feedback & UX

This phase enhances the PWA user experience by adding real-time synchronization feedback and connectivity indicators.

## 1. Context [GS-102]
- **Target**: `index.html`, `style.css`, and `js/app.js`
- **Goal**: Provide visual clarity on sync progress and PWA updates.
- **Reference**: [CONCERNS.md](file:///c:/Users/prati/OneDrive/Desktop/Web%20Expence%20tracker/.planning/codebase/CONCERNS.md)

## 2. Tasks

- [ ] **T1: Add Sync Infrastructure**
    - Add `#sync-banner` to `index.html`.
    - Implement `.syncing` (blue) and `.sync-success` (green) classes in `style.css`.
    - Add a `fa-spin` animation wrapper for sync icons.
- [ ] **T2: Orchestrate Sync Feedback**
    - Modify `syncOfflineData()` in `js/app.js` to show/hide the sync banner.
    - Implement a 3-second "Sync Complete!" message after resolving the queue.
- [ ] **T3: Enhance Item-Level Status**
    - Update `renderExpenses()` to support a `syncingId` parameter.
    - Replace the "Pending" star with a "Syncing" spinner for the active item being processed.
- [ ] **T4: Implement PWA Update Notification**
    - Update the Service Worker registration in `app.js` to detect `onupdatefound`.
    - Create a toast or banner that prompts the user to "Update to the latest version" when a new SW is waiting.

## 3. Verification criteria [UAT]

### Must-Have
- [ ] Transitioning to offline mode shows the Offline Banner.
- [ ] Reconnecting shows a "Syncing..." banner while `offlineQueue` processes.
- [ ] Reconnecting shows "Sync Complete!" for 3 seconds after success.
- [ ] Pending items show a rotating spinner while they are being transmitted to the server.

## 4. Execution prompt

Enhance the PWA UX by implementing synchronization banners and item-level progress indicators. Update the Service Worker registration to handle update notifications gracefully.
