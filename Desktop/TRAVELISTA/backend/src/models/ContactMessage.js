const db = require('../config/db');

class ContactMessage {
  static async create(messageData) {
    try {
      const { name, email, subject, message } = messageData;
      
      const query = `
        INSERT INTO contact_messages (
          name, email, subject, message, created_at, updated_at
        ) VALUES (?, ?, ?, ?, NOW(), NOW())
      `;
      
      const result = await db.query(query, [
        name, email, subject, message
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT * FROM contact_messages 
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      if (filters.status) {
        query += ` AND status = ?`;
        queryParams.push(filters.status);
      }
      
      if (filters.email) {
        query += ` AND email = ?`;
        queryParams.push(filters.email);
      }
      
      query += ` ORDER BY created_at DESC`;
      
      return await db.query(query, queryParams);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT * FROM contact_messages 
        WHERE id = ?
      `;
      
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching contact message with id ${id}:`, error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const query = `
        UPDATE contact_messages SET
          status = ?,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [status, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating contact message status for id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = `DELETE FROM contact_messages WHERE id = ?`;
      const result = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting contact message with id ${id}:`, error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const query = `
        SELECT 
          status, 
          COUNT(*) as count
        FROM contact_messages
        GROUP BY status
      `;
      
      return await db.query(query);
    } catch (error) {
      console.error('Error fetching contact message stats:', error);
      throw error;
    }
  }
}

module.exports = ContactMessage; 