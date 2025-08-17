require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Get table creation SQL from the migration file
const tablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(20),
  birthday DATE,
  location VARCHAR(255),
  firebase_uid VARCHAR(100) UNIQUE,
  profile_picture VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  email_verify_token VARCHAR(100),
  reset_password_token VARCHAR(100),
  reset_password_expires DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX (email),
  INDEX (firebase_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job offers table
CREATE TABLE IF NOT EXISTS job_offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (type),
  INDEX (location),
  INDEX (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  cv_path VARCHAR(255),
  status ENUM('pending', 'reviewed', 'contacted', 'rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES job_offers(id) ON DELETE SET NULL,
  INDEX (job_id),
  INDEX (status),
  INDEX (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (email),
  INDEX (status),
  INDEX (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Add database creation and selection statements
const dbName = process.env.DB_DATABASE || 'travel_agency';
const fullSQL = `-- phpMyAdmin SQL Dump
-- Host: 127.0.0.1
-- Database: ${dbName}

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: \`${dbName}\`
--
CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`${dbName}\`;

${tablesSQL}

COMMIT;
`;

// Save the SQL file
const outputDir = path.join(__dirname, 'database-export');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, 'phpmyadmin-import.sql');
fs.writeFileSync(outputFile, fullSQL);

console.log(`SQL export completed successfully!`);
console.log(`File saved to: ${outputFile}`);
console.log(`\nTo import this file into phpMyAdmin:`);
console.log(`1. Open phpMyAdmin in your browser`);
console.log(`2. Select or create the database '${dbName}'`);
console.log(`3. Click on the 'Import' tab`);
console.log(`4. Choose the file: ${outputFile}`);
console.log(`5. Click 'Go' to import the database structure`); 