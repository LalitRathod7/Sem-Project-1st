-- Emergency Blood Donation System Database Schema
-- Run this script to create the necessary tables

CREATE DATABASE IF NOT EXISTS blood_donation_system;
USE blood_donation_system;

-- Users table (base table for all user types)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('donor', 'hospital', 'blood_bank') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    last_donation DATE NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hospital_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Blood banks table
CREATE TABLE IF NOT EXISTS blood_banks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    units_needed INT NOT NULL,
    urgency ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    status ENUM('pending', 'fulfilled', 'cancelled') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fulfilled_date DATE NULL,
    notes TEXT,
    FOREIGN KEY (hospital_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Blood inventory table
CREATE TABLE IF NOT EXISTS blood_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blood_bank_id INT NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    units_available INT NOT NULL DEFAULT 0,
    expiry_date DATE NOT NULL,
    status ENUM('available', 'low', 'critical', 'expired') DEFAULT 'available',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (blood_bank_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_blood_type_bank (blood_bank_id, blood_type)
);

-- Messages table for customer service communication
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_available ON donors(available);
CREATE INDEX idx_blood_requests_hospital ON blood_requests(hospital_id);
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency);
CREATE INDEX idx_blood_inventory_blood_bank ON blood_inventory(blood_bank_id);
CREATE INDEX idx_blood_inventory_blood_type ON blood_inventory(blood_type);
CREATE INDEX idx_blood_inventory_status ON blood_inventory(status);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Sample data for testing
INSERT INTO users (username, email, password, role) VALUES
('demo_donor', 'donor@example.com', '$2a$10$example.hash.for.demo', 'donor'),
('demo_hospital', 'hospital@example.com', '$2a$10$example.hash.for.demo', 'hospital'),
('demo_bank', 'bank@example.com', '$2a$10$example.hash.for.demo', 'blood_bank');

INSERT INTO donors (user_id, blood_type, phone, location) VALUES
(1, 'O+', '555-0101', 'City Center');

INSERT INTO hospitals (user_id, hospital_name, address, phone, emergency_contact) VALUES
(2, 'City General Hospital', '123 Medical Dr, City, ST 12345', '555-0202', '555-0203');

INSERT INTO blood_banks (user_id, bank_name, address, phone, license_number) VALUES
(3, 'Central Blood Bank', '456 Health Ave, City, ST 12345', '555-0303', 'LIC-001');

INSERT INTO blood_inventory (blood_bank_id, blood_type, units_available, expiry_date) VALUES
(3, 'A+', 25, '2024-12-31'),
(3, 'O+', 30, '2024-12-31'),
(3, 'B+', 15, '2024-12-31'),
(3, 'AB+', 8, '2024-12-31');
