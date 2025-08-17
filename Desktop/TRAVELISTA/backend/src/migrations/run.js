require('dotenv').config();
const db = require('../config/db');

async function createTables() {
  try {
    console.log('Starting database migrations...');

    // Create users table
    await db.query(`
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
    `);

    console.log('Users table created or already exists');

    // Create job_offers table
    await db.query(`
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
    `);

    console.log('Job offers table created or already exists');

    // Create job_applications table
    await db.query(`
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
    `);

    console.log('Job applications table created or already exists');

    // Create contact_messages table
    await db.query(`
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
    `);

    console.log('Contact messages table created or already exists');

    console.log('All database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database migration error:', error);
    process.exit(1);
  }
}

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created');
}

// Run migrations
createTables(); 