const db = require('../config/db');

class CompanyStory {
  static async get() {
    try {
      const query = `
        SELECT * FROM company_story 
        WHERE is_active = true 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      const results = await db.query(query);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error('Error fetching company story:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT * FROM company_story 
        WHERE id = ? AND is_active = true
      `;
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching company story with id ${id}:`, error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { title, content, image, short_description } = data;
      
      // First, deactivate all existing stories if we want only one active
      await db.query(`
        UPDATE company_story SET 
        is_active = false,
        updated_at = NOW()
      `);
      
      const query = `
        INSERT INTO company_story (
          title, content, image, short_description, is_active,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, true, NOW(), NOW())
      `;
      
      // Ensure no undefined values are passed
      const imageValue = image || null;
      const shortDescriptionValue = short_description || null;
      
      const result = await db.query(query, [
        title, content, imageValue, shortDescriptionValue
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating company story:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { title, content, image, short_description, is_active } = data;
      
      const query = `
        UPDATE company_story SET
          title = ?,
          content = ?,
          image = ?,
          short_description = ?,
          is_active = ?,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [
        title, content, image, short_description, is_active, id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating company story with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Soft delete by setting is_active to false
      const query = `
        UPDATE company_story SET
          is_active = false,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting company story with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = CompanyStory; 