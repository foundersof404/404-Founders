const db = require('../config/db');

class CompanyValue {
  static async getAll() {
    try {
      const query = `
        SELECT * FROM company_values 
        WHERE is_active = true 
        ORDER BY display_order ASC, created_at ASC
      `;
      return await db.query(query);
    } catch (error) {
      console.error('Error fetching company values:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT * FROM company_values 
        WHERE id = ? AND is_active = true
      `;
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching company value with id ${id}:`, error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { title, description, icon, display_order } = data;
      
      const query = `
        INSERT INTO company_values (
          title, description, icon, display_order,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, NOW(), NOW())
      `;
      
      // Ensure no undefined values are passed
      const iconValue = icon || null;
      const displayOrderValue = display_order || 0;
      
      const result = await db.query(query, [
        title, description, iconValue, displayOrderValue
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating company value:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { title, description, icon, display_order, is_active } = data;
      
      const query = `
        UPDATE company_values SET
          title = ?,
          description = ?,
          icon = ?,
          display_order = ?,
          is_active = ?,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [
        title, description, icon, display_order || 0, is_active, id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating company value with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Soft delete by setting is_active to false
      const query = `
        UPDATE company_values SET
          is_active = false,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting company value with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = CompanyValue; 