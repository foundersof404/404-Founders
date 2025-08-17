require('dotenv').config();
const db = require('../config/db');
const path = require('path');
const { spawn } = require('child_process');

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Test database connection
    const connected = await db.testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }

    console.log('Database connection successful.');

    // Run migrations
    console.log('Running migrations...');
    await runScript(path.join(__dirname, '../migrations/run.js'));

    // Seed data
    console.log('Seeding database...');
    await runScript(path.join(__dirname, './seed-data.js'));

    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup error:', error);
    process.exit(1);
  }
}

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const process = spawn('node', [scriptPath], { stdio: 'inherit' });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });

    process.on('error', (err) => {
      reject(err);
    });
  });
}

// Run setup
setupDatabase(); 