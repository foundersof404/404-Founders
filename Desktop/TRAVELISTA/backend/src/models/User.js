const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  // Find user by ID
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE id = ?', 
        [id]
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by Firebase UID
  static async findByFirebaseUid(firebaseUid) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE firebase_uid = ?', 
        [firebaseUid]
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by Firebase UID:', error);
      throw error;
    }
  }

  // Find user by verification token
  static async findByVerificationToken(token) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email_verify_token = ?', 
        [token]
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by verification token:', error);
      throw error;
    }
  }

  // Find user by reset password token
  static async findByResetToken(token) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()', 
        [token]
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by reset token:', error);
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash password if provided
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      // Generate email verification token
      const emailVerifyToken = uuidv4();
      
      const result = await db.query(
        `INSERT INTO users 
          (name, email, password, phone, birthday, location, firebase_uid, profile_picture, email_verified, email_verify_token, created_at, updated_at) 
         VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userData.name,
          userData.email,
          userData.password || null,
          userData.phone || null,
          userData.birthday || null,
          userData.location || null,
          userData.firebase_uid || null,
          userData.profile_picture || null,
          userData.email_verified || false,
          emailVerifyToken
        ]
      );

      if (result.insertId) {
        const newUser = await this.findById(result.insertId);
        return { ...newUser, email_verify_token: emailVerifyToken };
      }
      
      throw new Error('Failed to create user');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update an existing user
  static async update(id, userData) {
    try {
      // Hash password if provided
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      // Build SET clause dynamically based on provided fields
      const fields = [];
      const values = [];

      // Define allowed fields to update
      const allowedFields = [
        'name', 'email', 'password', 'phone', 'birthday', 
        'location', 'profile_picture', 'firebase_uid', 
        'email_verified', 'email_verify_token',
        'reset_password_token', 'reset_password_expires'
      ];

      // Add updated_at timestamp
      fields.push('updated_at = NOW()');

      // Process allowed fields
      for (const [key, value] of Object.entries(userData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }

      // Add user id as the last parameter
      values.push(id);

      const result = await db.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      if (result.affectedRows > 0) {
        return await this.findById(id);
      }
      
      throw new Error('User not found or no changes made');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Verify a user's password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  // Verify a user's email
  static async verifyEmail(token) {
    try {
      const user = await this.findByVerificationToken(token);
      
      if (!user) {
        throw new Error('Invalid verification token');
      }

      // Update user to mark email as verified and clear token
      return await this.update(user.id, {
        email_verified: true,
        email_verify_token: null
      });
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  // Generate password reset token
  static async generateResetToken(email) {
    try {
      const user = await this.findByEmail(email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset token and set expiry (1 hour from now)
      const resetToken = uuidv4();
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1);

      // Update user with reset token and expiration
      await this.update(user.id, {
        reset_password_token: resetToken,
        reset_password_expires: resetExpires
      });

      return resetToken;
    } catch (error) {
      console.error('Error generating reset token:', error);
      throw error;
    }
  }

  // Reset password using reset token
  static async resetPassword(token, newPassword) {
    try {
      const user = await this.findByResetToken(token);
      
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user with new password and clear reset token
      return await this.update(user.id, {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Delete a user
  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = User; 