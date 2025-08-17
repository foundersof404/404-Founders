const db = require('../config/db');

class TeamMember {
  static async getAll() {
    try {
      const query = `
        SELECT * FROM team_members 
        WHERE is_active = true 
        ORDER BY display_order ASC, created_at DESC
      `;
      return await db.query(query);
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT * FROM team_members 
        WHERE id = ? AND is_active = true
      `;
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching team member with id ${id}:`, error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { name, role, image, bio, email, display_order } = data;
      
      const query = `
        INSERT INTO team_members (
          name, role, image, bio, email, display_order,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      // Ensure no undefined values are passed
      const imageValue = image || null;
      const bioValue = bio || null;
      const emailValue = email || null;
      const displayOrderValue = display_order || 0;
      
      const result = await db.query(query, [
        name, role, imageValue, bioValue, emailValue, displayOrderValue
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { name, role, image, bio, email, display_order, is_active } = data;
      
      const query = `
        UPDATE team_members SET
          name = ?,
          role = ?,
          image = ?,
          bio = ?,
          email = ?,
          display_order = ?,
          is_active = ?,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [
        name, role, image, bio, email, display_order || 0, is_active, id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating team member with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Soft delete by setting is_active to false
      const query = `
        UPDATE team_members SET
          is_active = false,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting team member with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = TeamMember; 