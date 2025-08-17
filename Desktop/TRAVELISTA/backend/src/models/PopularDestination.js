const db = require('../config/db');

class PopularDestination {
  static async getAll() {
    try {
      const query = `
        SELECT * FROM popular_destinations
        ORDER BY id ASC
      `;
      
      console.log('Running query:', query);
      const results = await db.query(query);
      console.log('Query result:', results);
      return results;
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT * FROM popular_destinations 
        WHERE id = ?
      `;
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching popular destination with id ${id}:`, error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { country, name, image, description, rating } = data;
      
      const query = `
        INSERT INTO popular_destinations (
          country, name, image, description, rating
        ) VALUES (?, ?, ?, ?, ?)
      `;
      
      console.log('Running query:', query, [country, name, image, description, rating]);
      const result = await db.query(query, [country, name, image, description, rating]);
      console.log('Query result:', result);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating popular destination:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { country, name, image, description, rating } = data;
      
      const query = `
        UPDATE popular_destinations SET
          country = ?,
          name = ?,
          image = ?,
          description = ?,
          rating = ?
        WHERE id = ?
      `;
      
      console.log('Running query:', query, [country, name, image, description, rating, id]);
      const result = await db.query(query, [country, name, image, description, rating, id]);
      console.log('Query result:', result);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating popular destination with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = `
        DELETE FROM popular_destinations
        WHERE id = ?
      `;
      
      console.log('Running query:', query, [id]);
      const result = await db.query(query, [id]);
      console.log('Query result:', result);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting popular destination with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = PopularDestination; 