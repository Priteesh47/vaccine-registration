-- Create database if not exists
CREATE DATABASE IF NOT EXISTS vaccine;
USE vaccine;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    roles ENUM('User', 'Admin', 'Staff') NOT NULL DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccines table
CREATE TABLE IF NOT EXISTS vaccines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manufacturer VARCHAR(255),
    dosage VARCHAR(100),
    age_group VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccination Centers table
CREATE TABLE IF NOT EXISTS centers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    center_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id),
    FOREIGN KEY (center_id) REFERENCES centers(id)
);

-- Insert sample data
INSERT INTO users (name, email, password, roles) VALUES 
('Admin User', 'admin@example.com', '$2a$10$X7J3QZ8QZ8QZ8QZ8QZ8QZ.8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ', 'Admin');

INSERT INTO vaccines (name, description, manufacturer, dosage, age_group) VALUES
('COVID-19 Vaccine', 'Protection against COVID-19', 'Pfizer', '2 doses', '18+'),
('Flu Vaccine', 'Seasonal influenza vaccine', 'GSK', '1 dose', 'All ages');

INSERT INTO centers (name, address, city, state, pincode, contact_number) VALUES
('City Hospital', '123 Main St', 'Mumbai', 'Maharashtra', '400001', '9876543210'),
('Community Health Center', '456 Park Ave', 'Delhi', 'Delhi', '110001', '9876543211'); 