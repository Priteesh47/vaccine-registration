-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS vaccine;

-- Use the database
USE vaccine;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('User', 'Admin', 'Staff') DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vaccines table
CREATE TABLE IF NOT EXISTS vaccines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    description TEXT,
    dosage VARCHAR(100),
    age_group VARCHAR(100),
    effectiveness VARCHAR(100)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    patient_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    address TEXT,
    phone_number VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Vaccine Inventory
CREATE TABLE IF NOT EXISTS vaccine_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vaccine_id INT,
    batch_number VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    expiry_date DATE NOT NULL,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id)
);

-- Create vaccination_records table
CREATE TABLE vaccination_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vaccine_id INT NOT NULL,
    center_id INT NOT NULL,
    appointment_id INT NOT NULL,
    administered_date DATETIME NOT NULL,
    next_dose_date DATE,
    status ENUM('completed', 'pending', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id),
    FOREIGN KEY (center_id) REFERENCES vaccine_centers(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- Create vaccine_centers table
CREATE TABLE IF NOT EXISTS vaccine_centers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 