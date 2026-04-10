# Plan - Phase 1: Security Baseline Hardening

This phase implements a secure configuration layer and hardens the database connection settings.

## 1. Context [GS-102]
- **Target**: `api/db_connect.php`
- **Goal**: Externalize hardcoded credentials and prevent info leaks.
- **Reference**: [CONCERNS.md](file:///c:/Users/prati/OneDrive/Desktop/Web%20Expence%20tracker/.planning/codebase/CONCERNS.md)

## 2. Tasks

- [ ] **T1: Create Configuration Template**
    - Create `api/config.php` to define the baseline connection array.
    - Set it up to load `config.local.php` if it exists.
- [ ] **T2: Create Local Configuration**
    - Create `api/config.local.php` with the current XAMPP credentials (root/empty).
- [ ] **T3: Update Git Ignore**
    - Ensure `api/config.local.php` is excluded from git tracking.
- [ ] **T4: Refactor Connection Logic**
    - Modify `api/db_connect.php` to use variables from the config.
    - Standardize the PDO attributes (ERRMODE_EXCEPTION, DEFAULT_FETCH_MODE).
    - Implement a safer Error Catching block that suppresses technical details in production JSON responses.

## 3. Verification criteria [UAT]

### Must-Have
- [ ] System connects to DB successfully with the NEW structure.
- [ ] `api/config.local.php` NOT found in `git status`.
- [ ] Connection errors do not contain raw SQL or PHP error strings in the JSON output.

## 4. Execution prompt

Secure the database connection layer by implementing the configuration pattern. Use the provided plan to refactor `api/db_connect.php` and its surrounding infrastructure.
