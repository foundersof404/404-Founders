const db = require('../config/db');

async function setupPopularDestinations() {
  try {
    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS popular_destinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        country VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        rating DECIMAL(2, 1) NOT NULL
      )
    `;

    console.log('Creating popular_destinations table if it does not exist...');
    await db.query(createTableQuery);
    console.log('Table created or already exists.');

    // Check if table is empty before inserting data
    const checkDataQuery = 'SELECT COUNT(*) as count FROM popular_destinations';
    const result = await db.query(checkDataQuery);
    
    if (result[0].count === 0) {
      // Insert data only if table is empty
      const insertDataQuery = `
        INSERT INTO popular_destinations (country, name, image, description, rating) VALUES
        ('EGYPT', 'EGYPTIAN PYRAMIDS', 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368', 'Marvel at the timeless wonder of the pyramids.', 4.0),
        ('LEBANON', 'BAALBEK TEMPLE', 'https://images.unsplash.com/photo-1572696143321-51b51369bcbb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'A stunning blend of history and ancient architecture.', 3.0),
        ('ITALY', 'COLOSSEUM,ROME', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5', 'A testament to Rome\\'s ancient grandeur.', 5.0),
        ('JAPAN', 'MOUNT FUJI', 'https://images.unsplash.com/photo-1546529249-8de036dd3c9a', 'Japan\\'s iconic sacred mountain surrounded by cherry blossoms.', 4.5),
        ('PERU', 'MACHU PICCHU', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1', 'The breathtaking lost city of the Incas.', 5.0),
        ('GREECE', 'ACROPOLIS', 'https://images.unsplash.com/photo-1555993539-1732b0258235', 'Magnificent ancient citadel overlooking Athens.', 4.0)
      `;

      console.log('Inserting data into popular_destinations table...');
      await db.query(insertDataQuery);
      console.log('Data inserted successfully.');
    } else {
      console.log('Popular destinations data already exists. Skipping insert.');
    }

    console.log('Popular destinations setup completed successfully.');
  } catch (error) {
    console.error('Error setting up popular destinations:', error);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupPopularDestinations()
    .then(() => {
      console.log('Setup complete. Exiting.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Setup failed:', err);
      process.exit(1);
    });
}

module.exports = setupPopularDestinations; 