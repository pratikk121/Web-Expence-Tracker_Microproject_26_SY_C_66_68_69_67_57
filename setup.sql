-- Create database
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
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
