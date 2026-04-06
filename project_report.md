# Comprehensive Project Report: Personal Finance & Expense Tracker Web Application

---

## 1. Introduction

### 1.1 Project Overview
Managing personal finances is a crucial skill, especially for students and young professionals who need to keep a close eye on their daily expenditures. The "Expense Tracker Web Application" is a full-stack, client-server web application designed to help users track their income and expenses securely. By providing an intuitive dashboard, categorization options, graphical visualizations, and live currency conversions, the application empowers users to make informed financial decisions and maintain a balanced budget.

### 1.2 Objective
The primary objectives of this project are:
* To develop a secure and user-friendly web interface for tracking daily financial transactions.
* To implement a robust user authentication system ensuring data privacy.
* To provide real-time graphical representations of monthly expenditures for better financial analysis.
* To support multi-currency tracking through a live currency conversion utility, assisting international users.
* To automate the deployment and setup process using batch scripting for accessibility.

### 1.3 Problem Statement
Many individuals rely on traditional pen-and-paper methods or complex spreadsheet software to manage their finances. These methods are often tedious, prone to human error, and lack meaningful visual feedback. There is a strong need for an automated, accessible, and visual platform that simplifies budget tracking without overwhelming the user with unnecessary financial jargon.

### 1.4 Scope of the Project
The project scope encompasses user registration, secure login sessions, expense adding/editing/deleting, category management, pie-chart visualizations of spending, and dynamic currency conversions. The system is designed to run in modern web browsers and interacts seamlessly with a local web server (PHP) and a relational database (MySQL).

---

## 2. Background and Literature Review

### 2.1 Existing Systems
Currently, the market provides various expense tracking solutions ranging from mobile applications to complex desktop software. While highly functional, many existing systems force users into premium subscriptions, lack easy data export capabilities, or require steep learning curves. 

### 2.2 Proposed System
The proposed system focuses on simplicity, speed, and visual clarity. Built on standard web technologies, it requires no heavy software installation for the end-user (assuming server hosting). It focuses entirely on core functionalities: logging data, classifying it, and visually understanding it. 

### 2.3 Advantages of the Proposed System
* **No Subscription Cost:** Being an open-source local application, it is completely free.
* **Data Privacy:** Data is stored locally on the user's MySQL database rather than on third-party cloud servers.
* **Instant Visual Feedback:** Interactive pie charts update immediately as new expenses are added.
* **International Friendly:** built-in currency selection logic allows users to view balances across different currencies.

---

## 3. Technologies Used

The project was developed strictly using a recognized Full-Stack paradigm (LAMP/WAMP stack equivalent):

### 3.1 Frontend Technologies (Client-Side)
* **HTML5:** Used for structuring the web pages, creating semantic layouts, and building the input forms.
* **CSS3:** Responsible for the visual aesthetic, including the dark/light premium themes, responsive design layouts, flexbox alignments, and smooth hover animations.
* **JavaScript (Vanilla JS):** Handles client-side interactivity, DOM manipulation, asynchronous network requests (AJAX/Fetch API) to the server without reloading the page, rendering the graphical charts, and calculating live currency conversions.

### 3.2 Backend Technologies (Server-Side)
* **PHP (Hypertext Preprocessor):** Acts as the brains of the application. It receives data from the frontend, validates user sessions, performs secure password hashing, and communicates back and forth with the database.

### 3.3 Database
* **MySQL:** A robust Relational Database Management System (RDBMS) used to store persistent data such as user credentials, dynamically created categories, and financial logs.

### 3.4 Automation Tools
* **Windows Batch Scripting (`.bat`):** Used to write automation scripts (`Launch_App.bat`, `start_server.bat`, `setup_db.bat`). These scripts start the PHP server, load the database schema automatically, and launch the web browser, providing a "one-click" setup experience.

---

## 4. System Architecture

The application implements a classic **3-Tier Architecture**:

### 4.1 Presentation Tier (UI)
This is the front-facing layer consisting of `index.html`, `login.html`, and `register.html`. It is responsible for gathering input from the user and displaying the mathematical summaries and charts back to the user.

### 4.2 Application / Logic Tier (Backend API)
Hosted by the local PHP server, this layer (`api/auth.php`, `api/expenses.php`, `api/categories.php`) processes the HTTP requests sent by JavaScript. It enforces business rules, like preventing unauthorized access to the dashboard, and prepares SQL statements.

### 4.3 Data Tier (Database)
The persistent storage layer where the MySQL server resides. The application connects to this tier via `api/db_connect.php`, fetching rows of data and sending them back to the logic tier as JSON objects.

---

## 5. Modules Description

The project is divided into several highly cohesive modules working together:

### 5.1 User Authentication Module
* **Registration:** Users input a username, email, and password. The backend securely hashes the password before saving it to the database to prevent plain-text breaches.
* **Login / Logout:** Validates user credentials. Upon success, a secure session token is generated, ensuring that the user can navigate the app securely.

### 5.2 Dashboard & UI Module
The central hub located in `index.html`. It dynamically renders the total balance, total income, and total expenses by pulling data from the database. The UI is designed to be completely reactive to user inputs.

### 5.3 Expense Management Module (CRUD Operations)
* **Create:** Users can add new transactions, marking them as either positive (Income) or negative (Expense), along with a date, description, and category.
* **Read:** Fetches the history of transactions and displays them in a "Recent Transactions" list.
* **Update & Delete:** Users can edit misspelled entries or delete erroneous transactions entirely, with the balance updating instantly.

### 5.4 Data Visualization Module
Utilizes JavaScript charting libraries to draw an interactive Donut/Pie chart. The code aggregates all expenses for the current month, groups them by their respective category (e.g., Food, Travel, Shopping), and visualizes the percentage breakdown visually.

### 5.5 Currency Conversion Module
A specialized JavaScript function allowing users to switch the baseline currency from the UI (e.g., from USD to INR). The app parses the selected currency multiplier and recalculates all visible monetary values on the screen in real-time.

---

## 6. Database Design

A well-structured relational model ensures data integrity. The `setup.sql` file defines the following schema:

### 6.1 `users` Table
Stores account information. 
* `user_id` (Primary Key, Auto Increment)
* `username` (Varchar, Unique)
* `email` (Varchar, Unique)
* `password_hash` (Varchar)

### 6.2 `categories` Table
Stores the classifications for expenses to allow grouping.
* `category_id` (Primary Key, Auto Increment)
* `user_id` (Foreign Key linked to `users`)
* `category_name` (Varchar, e.g., "Food", "Transport")

### 6.3 `expenses` Table
The primary ledger for financial records.
* `expense_id` (Primary Key, Auto Increment)
* `user_id` (Foreign Key linked to `users`)
* `category_id` (Foreign Key linked to `categories`)
* `amount` (Decimal, negative for expense, positive for income)
* `description` (Text)
* `date_added` (Date/Timestamp)

---

## 7. Implementation & System Interfaces (Screenshots)

*Note: For the final physical document, please insert the corresponding screenshots below these headings.*

### 7.1 Registration Interface
**[Insert Register Screenshot Here]**
*Description:* The clean, centered UI for creating a new user account. It includes validations for username, email, and password fields.

### 7.2 Login Interface
**[Insert Login Screenshot Here]**
*Description:* The secure user login portal. Only authenticated users can bypass this wall to access their financial data.

### 7.3 Main Dashboard (USD View)
**[Insert Dashboard USD Screenshot Here]**
*Description:* The core dashboard displaying a high Total Balance ($996,300.00). The currency selector is set to USD ($). It features an intuitive breakdown of Income vs. Expense.

### 7.4 Data Visualization & Tracking (INR View)
**[Insert Dashboard Pie Chart INR Screenshot Here]**
*Description:* Demonstrates the dynamic nature of the UI. The currency has been swapped to INR (₹). A donut chart actively tracks expenses by category (e.g., a "category hover" state showing specific amounts like Transport: ₹200.00), alongside a recent transaction log mapping descriptions to specific dates.

---

## 8. Setup and Deployment

One of the highlights of this project is the ease of deployment using custom batch automation:
1. **Database Setup:** By running `setup_db.bat`, the system connects to the local MySQL server and automatically imports the tables defined in `setup.sql`.
2. **Server Initialization:** The `start_server.bat` script fires up PHP’s built-in development server on port 8000, eliminating the strict necessity for complex Apache setups.
3. **Application Launch:** The master script `Launch_App.bat` groups these processes and opens the user's default web browser directly to `localhost:8000/login.html`.

---

## 9. Conclusion

The Expense Tracker Web Application successfully meets all its primary objectives. It seamlessly integrates a robust PHP/MySQL backend with a modern, reactive JavaScript frontend. It eliminates the friction of managing personal finances by automating math operations, providing instant visual feedback on spending habits, and applying multi-currency logic in real-time. The application is highly scalable and forms a solid foundation for personal finance management.

---

## 10. Future Scope

While the current system handles core expense tracking exceptionally well, future iterations could include:
1. **Export Functionality:** Allowing users to download their monthly ledger as CSV or PDF documents.
2. **AI Financial Advice:** Integrating a simple AI parser to suggest budget cuts if spending in a specific category (e.g., Entertainment) exceeds 30% of their income.
3. **Receipt Scanning:** Using OCR (Optical Character Recognition) to scan grocery receipts via camera and automatically parse them into the database.
4. **Subscription Tracking:** A dedicated tab to track recurring monthly payments (Netflix, Spotify, Rent).

---
*(End of Document)*
