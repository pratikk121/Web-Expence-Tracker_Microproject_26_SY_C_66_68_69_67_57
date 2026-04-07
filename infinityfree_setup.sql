-- Notice: CREATE DATABASE and USE statements have been removed 
-- because free hosts like InfinityFree do not allow them.

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    monthly_budget DECIMAL(10, 2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    icon VARCHAR(50) DEFAULT 'fa-tag'
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    date DATE NOT NULL,
    receipt_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Recurring Expenses Table
CREATE TABLE IF NOT EXISTS recurring_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    period ENUM('weekly', 'monthly', 'yearly') NOT NULL,
    next_run_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert Default Categories
INSERT INTO categories (name, type, icon) VALUES
('Salary', 'income', 'fa-money-bill-wave'),
('Allowance', 'income', 'fa-hand-holding-usd'),
('Food', 'expense', 'fa-utensils'),
('Transport', 'expense', 'fa-bus'),
('Entertainment', 'expense', 'fa-film'),
('Shopping', 'expense', 'fa-shopping-bag'),
('Education', 'expense', 'fa-graduation-cap'),
('Health', 'expense', 'fa-briefcase-medical'),
('Other', 'expense', 'fa-random')
ON DUPLICATE KEY UPDATE name=name;
