# Coding Conventions - Web Expense Tracker

This document establishes the patterns and standards followed throughout the codebase.

## 1. Naming Conventions

### JavaScript (Frontend)
- **Functions & Variables**: `camelCase` (e.g., `loadExpenses`, `expensesData`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `CACHE_NAME`, `MAX_IMAGE_DIMENSION`).
- **File Names**: `kebab-case` or `lower.js` (e.g., `js/app.js`, `sw.js`).

### PHP (Backend)
- **Variables & Database Columns**: `snake_case` (e.g., `$user_id`, `category_id`).
- **File Names**: `snake_case.php` (e.g., `api/db_connect.php`, `api/expenses.php`).

### CSS
- **Class Names**: `kebab-case` (e.g., `.auth-container`, `.expense-item`).
- **Custom Properties**: `--kebab-case` (e.g., `--primary-color`).

## 2. Interface Standards

### API Responses
All PHP endpoints MUST return a JSON object with a `success` boolean:
```json
{
  "success": true,
  "data": [...],
  "message": "Optional feedback"
}
```

### Authentication Check
Every dashboard-level API call must verify the session:
```php
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}
```

## 3. Designing for Offline (PWA)
Any data-modifying operation in `js/app.js` should implement a `try-catch` pattern that queues the action if the network is unavailable:
1. Attempt `fetch`.
2. If failed, store payload in `offlineQueue` with an `action` type.
3. Update local state and `localStorage` cache immediately (Optimistic UI).

## 4. Security Practices
- **SQL Protection**: ALWAYS use PDO prepared statements with parameter binding.
- **Output Sanitization**: Use `htmlspecialchars()` in PHP and `innerText` or template literals with sanitization in JS.
- **File Security**: API uploads are localized to the `api/uploads/` directory with unique IDs.
