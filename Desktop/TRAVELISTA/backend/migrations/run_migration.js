const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function runMigration() {
  try {
    // Read the SQL file
    const sqlContent = await fs.readFile(
      path.join(__dirname, 'reset_tables.sql'),
      'utf8'
    );

    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'travel_agency',
      multipleStatements: true // Enable running multiple SQL statements
    });

    // Run the SQL commands
    await connection.query(sqlContent);
    console.log('Migration completed successfully!');

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Error running migration:', error);
  }
}

runMigration(); 