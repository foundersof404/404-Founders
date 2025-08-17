const db = require('../config/db');

class JobApplication {
  static async create(applicationData) {
    try {
      const { job_id, name, email, phone, message, cv_path } = applicationData;
      
      const query = `
        INSERT INTO job_applications (
          job_id, name, email, phone, message, cv_path, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const result = await db.query(query, [
        job_id, name, email, phone, message, cv_path
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating job application:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT a.*, j.title as job_title 
        FROM job_applications a
        LEFT JOIN job_offers j ON a.job_id = j.id
        WHERE a.id = ?
      `;
      
      const results = await db.query(query, [id]);
      return results.length ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching job application with id ${id}:`, error);
      throw error;
    }
  }

  static async getByJobId(jobId) {
    try {
      const query = `
        SELECT * FROM job_applications 
        WHERE job_id = ?
        ORDER BY created_at DESC
      `;
      
      return await db.query(query, [jobId]);
    } catch (error) {
      console.error(`Error fetching applications for job id ${jobId}:`, error);
      throw error;
    }
  }

  static async getAllApplications(filters = {}) {
    try {
      let query = `
        SELECT a.*, j.title as job_title 
        FROM job_applications a
        LEFT JOIN job_offers j ON a.job_id = j.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      if (filters.status) {
        query += ` AND a.status = ?`;
        queryParams.push(filters.status);
      }
      
      if (filters.email) {
        query += ` AND a.email = ?`;
        queryParams.push(filters.email);
      }
      
      query += ` ORDER BY a.created_at DESC`;
      
      return await db.query(query, queryParams);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const query = `
        UPDATE job_applications SET
          status = ?,
          updated_at = NOW()
        WHERE id = ?
      `;
      
      const result = await db.query(query, [status, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating job application status for id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = `DELETE FROM job_applications WHERE id = ?`;
      const result = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting job application with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = JobApplication; 