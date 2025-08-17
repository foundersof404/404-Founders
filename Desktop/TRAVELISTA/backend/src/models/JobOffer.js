const db = require('../config/db');

class JobOffer {
  static async getAll() {
    try {
      const query = `
        SELECT * FROM job_offers 
        WHERE is_active = true 
        ORDER BY posted_date DESC
      `;
      return await db.query(query);
    } catch (error) {
      console.error('Error fetching job offers:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT * FROM job_offers 
        WHERE id = ? AND is_active = true
      `;
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching job offer with id ${id}:`, error);
      throw error;
    }
  }

  static async create(jobData) {
    try {
      const { title, description, requirements, location, salary, type } = jobData;
      
      const query = `
        INSERT INTO job_offers (
          title, description, requirements, location, salary, type, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const result = await db.query(query, [
        title, description, requirements, location, salary, type
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating job offer:', error);
      throw error;
    }
  }

  static async update(id, jobData) {
    try {
      const { title, description, requirements, location, salary, type, is_active } = jobData;
      
      const query = `
        UPDATE job_offers SET
          title = ?,
          description = ?,
          requirements = ?,
          location = ?,
          salary = ?,
          type = ?,
          is_active = ?,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [
        title, description, requirements, location, salary, type, is_active, id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating job offer with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Soft delete by setting is_active to false
      const query = `
        UPDATE job_offers SET
          is_active = false,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting job offer with id ${id}:`, error);
      throw error;
    }
  }

  static async getByFilters(filters) {
    try {
      let query = `
        SELECT * FROM job_offers 
        WHERE is_active = true
      `;
      
      const queryParams = [];
      
      if (filters.type && filters.type !== 'all') {
        query += ` AND type = ?`;
        queryParams.push(filters.type);
      }
      
      if (filters.location && filters.location !== 'all') {
        query += ` AND location LIKE ?`;
        queryParams.push(`%${filters.location}%`);
      }
      
      query += ` ORDER BY posted_date DESC`;
      
      return await db.query(query, queryParams);
    } catch (error) {
      console.error('Error filtering job offers:', error);
      throw error;
    }
  }
}

module.exports = JobOffer; 