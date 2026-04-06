# Project Synopsis: Expense Tracker

## 1. Project Overview
This project is a Full-Stack Expense Tracker Web Application designed for students. It provides a secure, easy-to-use platform to track daily expenses, manage categories, visualize spending through charts, and perform live currency conversions. 

## 2. Architecture & Tech Stack
The application follows a standard client-server architecture:
*   **Frontend (Client-Side):** `HTML5`, `CSS3`, `JavaScript` (Vanilla JS with Chart logic).
*   **Backend API (Server-Side):** `PHP` (Handles business logic and database interactions).
*   **Database:** `MySQL` (Relational database to store user accounts and expense data securely).
*   **Environment:** Windows Batch (`.bat`) scripts are used to automate server startup and database initialization.

## 3. Directory & File Structure
```text
JS&PHP project/
│
├── api/                     # Backend PHP API Endpoints
│   ├── auth.php             # Handles user login and registration logic
│   ├── categories.php       # Handles fetching and managing expense categories
│   ├── db_connect.php       # Establishes the secure MySQL database connection
│   └── expenses.php         # Handles CRUD (Create, Read, Update, Delete) for expenses
│
├── js/                      # Frontend JavaScript Logic
│   ├── app.js               # Core logic: Expense fetching, charts, currency conversion, UI updates
│   └── auth.js              # Logic for handling user login/registration forms and session tokens
│
├── root files (Frontend UI)
│   ├── index.html           # Main dashboard (only accessible when logged in)
│   ├── login.html           # User login page
│   ├── register.html        # User registration page
│   └── style.css            # Global stylesheet for the application
│
└── configuration & automation
    ├── setup.sql            # SQL schema to create the required database and tables
    ├── setup_db.bat         # Script to quickly configure the MySQL database
    ├── start_server.bat     # Script to start the local PHP development server
    └── Launch_App.bat       # Master script to initialize the app and open the browser
```

## 4. Main Components Explained
1.  **Authentication System:**
    *   Powered by `register.html`, `login.html`, `js/auth.js`, and `api/auth.php`. 
    *   It ensures that users can create private accounts and their financial data isolated and secure.
2.  **Expense Engine:**
    *   Powered by `index.html`, `js/app.js`, and `api/expenses.php`.
    *   This is the core component where users input spending data. It communicates with the backend asynchronously (AJAX/Fetch) to save data without reloading the page.
3.  **Visualization & Currency:**
    *   Handled within `js/app.js`. It takes the raw data from the database and processes it into visual monthly charts. It also manages the live currency conversion logic for international tracking.
4.  **Database Management System:**
    *   `api/db_connect.php` acts as the secure bridge to the MySQL database (structured by `setup.sql`) ensuring all data is permanently and safely recorded.
5.  **Automation Scripts:**
    *   The batch scripts (`.bat` files) are quality-of-life additions. They abstract the complex command-line setup process so anyone can run the app with native Windows executable clicks.
