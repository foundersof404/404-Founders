const db = require('../config/db');

class CompanyMilestone {
  static async getAll() {
    try {
      const query = `
        SELECT * FROM company_milestones 
        WHERE is_active = true 
        ORDER BY display_order ASC, year ASC
      `;
      return await db.query(query);
    } catch (error) {
      console.error('Error fetching company milestones:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT * FROM company_milestones 
        WHERE id = ? AND is_active = true
      `;
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching company milestone with id ${id}:`, error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { title, description, year, icon, display_order } = data;
      
      const query = `
        INSERT INTO company_milestones (
          title, description, year, icon, display_order,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      // Ensure no undefined values are passed
      const iconValue = icon || null;
      const displayOrderValue = display_order || 0;
      
      const result = await db.query(query, [
        title, description, year, iconValue, displayOrderValue
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating company milestone:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { title, description, year, icon, display_order, is_active } = data;
      
      const query = `
        UPDATE company_milestones SET
          title = ?,
          description = ?,
          year = ?,
          icon = ?,
          display_order = ?,
          is_active = ?,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [
        title, description, year, icon, display_order || 0, is_active, id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating company milestone with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Soft delete by setting is_active to false
      const query = `
        UPDATE company_milestones SET
          is_active = false,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting company milestone with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = CompanyMilestone; 