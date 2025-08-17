const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

const config = {
  development: {
    username: 'root',
    password: '',
    database: 'travel_agency',
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  }
};

async function initializeDatabase() {
  try {
    // Create connection to MySQL server
    const connection = await mysql.createConnection({
      host: config.development.host,
      user: config.development.username,
      password: config.development.password,
      port: config.development.port
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.development.database}`);
    console.log('Database created or already exists');

    // Close the connection
    await connection.end();

    // Initialize Sequelize
    const sequelize = new Sequelize(config.development);

    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    try {
      // Run migrations
      const { stdout: migrationOutput } = await execAsync('npx sequelize-cli db:migrate');
      console.log('Migration output:', migrationOutput);

      // Run seeders
      const { stdout: seederOutput } = await execAsync('npx sequelize-cli db:seed:all');
      console.log('Seeder output:', seederOutput);
    } catch (error) {
      console.error('Error running migrations or seeders:', error);
    }

  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

initializeDatabase(); 