const db = require('../config/db');

class Testimonial {
  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT * FROM testimonials 
        WHERE is_active = true
      `;
      
      const queryParams = [];
      
      if (filters.type) {
        query += ` AND type = ?`;
        queryParams.push(filters.type);
      }
      
      query += ` ORDER BY created_at DESC`;
      
      return await db.query(query, queryParams);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT * FROM testimonials 
        WHERE id = ? AND is_active = true
      `;
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching testimonial with id ${id}:`, error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { name, role, location, quote, image, rating, type } = data;
      
      const query = `
        INSERT INTO testimonials (
          name, role, location, quote, image, rating, type,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      // Ensure no undefined values are passed
      const roleValue = role || null;
      const locationValue = location || null;
      const imageValue = image || null;
      const ratingValue = rating || 5;
      const typeValue = type || 'customer';
      
      const result = await db.query(query, [
        name, roleValue, locationValue, quote, imageValue, ratingValue, typeValue
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { name, role, location, quote, image, rating, type, is_active } = data;
      
      const query = `
        UPDATE testimonials SET
          name = ?,
          role = ?,
          location = ?,
          quote = ?,
          image = ?,
          rating = ?,
          type = ?,
          is_active = ?,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [
        name, role, location, quote, image, rating, type, is_active, id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating testimonial with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Soft delete by setting is_active to false
      const query = `
        UPDATE testimonials SET
          is_active = false,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting testimonial with id ${id}:`, error);
      throw error;
    }
  }

  static async getEmployeeTestimonials() {
    try {
      const query = `
        SELECT * FROM testimonials 
        WHERE type = 'employee' AND is_active = true
        ORDER BY created_at DESC
      `;
      
      return await db.query(query);
    } catch (error) {
      console.error('Error fetching employee testimonials:', error);
      throw error;
    }
  }

  static async getCustomerTestimonials() {
    try {
      const query = `
        SELECT * FROM testimonials 
        WHERE type = 'customer' AND is_active = true
        ORDER BY created_at DESC
      `;
      
      return await db.query(query);
    } catch (error) {
      console.error('Error fetching customer testimonials:', error);
      throw error;
    }
  }
}

module.exports = Testimonial; 