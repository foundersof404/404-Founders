require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

// Initialize Express
const app = express();
const ADMIN_PORT = process.env.ADMIN_PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Admin Dashboard Statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [usersCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [jobsCount] = await db.query('SELECT COUNT(*) as count FROM job_offers');
    const [applicationsCount] = await db.query('SELECT COUNT(*) as count FROM job_applications');
    const [messagesCount] = await db.query('SELECT COUNT(*) as count FROM contact_messages');

    res.json({
      users: usersCount[0].count,
      jobs: jobsCount[0].count,
      applications: applicationsCount[0].count,
      messages: messagesCount[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users Management
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job Offers Management
app.get('/api/admin/jobs', async (req, res) => {
  try {
    const jobs = await db.query('SELECT * FROM job_offers ORDER BY created_at DESC');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/jobs', async (req, res) => {
  try {
    const { title, description, requirements, location, salary, type } = req.body;
    const result = await db.query(
      'INSERT INTO job_offers (title, description, requirements, location, salary, type) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, requirements, location, salary, type]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, location, salary, type } = req.body;
    await db.query(
      'UPDATE job_offers SET title=?, description=?, requirements=?, location=?, salary=?, type=? WHERE id=?',
      [title, description, requirements, location, salary, type, id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM job_offers WHERE id=?', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job Applications Management
app.get('/api/admin/applications', async (req, res) => {
  try {
    const applications = await db.query(`
      SELECT ja.*, jo.title as job_title 
      FROM job_applications ja 
      LEFT JOIN job_offers jo ON ja.job_id = jo.id 
      ORDER BY ja.created_at DESC
    `);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/applications/:id/cv', async (req, res) => {
  try {
    const { id } = req.params;
    const [application] = await db.query('SELECT cv_path FROM job_applications WHERE id=?', [id]);
    if (!application?.cv_path) {
      return res.status(404).json({ error: 'CV not found' });
    }
    res.download(path.join(__dirname, '../uploads', application.cv_path));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact Messages Management
app.get('/api/admin/messages', async (req, res) => {
  try {
    const messages = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query('UPDATE contact_messages SET status=? WHERE id=?', [status, id]);
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin replies to a message and notifies the user
app.post('/api/admin/messages/:id/reply', async (req, res) => {
  try {
    const messageId = req.params.id;
    const { reply_text, admin_id } = req.body;
    if (!reply_text) {
      return res.status(400).json({ error: 'Reply text is required' });
    }
    // Save reply
    await db.query(
      'INSERT INTO admin_replies (message_id, admin_id, reply_text) VALUES (?, ?, ?)',
      [messageId, admin_id || null, reply_text]
    );
    // Find the user who sent the message
    const [msg] = await db.query('SELECT email, name FROM contact_messages WHERE id = ?', [messageId]);
    if (msg && msg.email) {
      // Find user by email
      const [user] = await db.query('SELECT id FROM users WHERE email = ?', [msg.email]);
      if (user && user.id) {
        // Create notification with formatted message
        const notificationContent = `Admin responded to you by: ${reply_text}`;
        await db.query(
          'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
          [user.id, 'admin_reply', notificationContent]
        );
      }
    }
    res.status(201).json({ message: 'Reply sent and notification created' });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
});

// Get notifications for a user
app.get('/api/notifications', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    const notifications = await db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE notifications SET read = 1 WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Popular Destinations Management
app.get('/api/admin/destinations', async (req, res) => {
  try {
    const destinations = await db.query('SELECT * FROM popular_destinations ORDER BY id');
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { country, name, image, description, rating } = req.body;
    await db.query(
      'UPDATE popular_destinations SET country=?, name=?, image=?, description=?, rating=? WHERE id=?',
      [country, name, image, description, rating, id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Company Values Management
app.get('/api/admin/values', async (req, res) => {
  try {
    const values = await db.query('SELECT * FROM company_values ORDER BY display_order');
    res.json(values);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/values/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, display_order } = req.body;
    await db.query(
      'UPDATE company_values SET title=?, description=?, icon=?, display_order=? WHERE id=?',
      [title, description, icon, display_order, id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Company Story Management
app.get('/api/admin/story', async (req, res) => {
  try {
    const [story] = await db.query('SELECT * FROM company_story LIMIT 1');
    res.json(story || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/story/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, short_description } = req.body;
    await db.query(
      'UPDATE company_story SET title=?, content=?, image=?, short_description=? WHERE id=?',
      [title, content, image, short_description, id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(ADMIN_PORT, () => {
  console.log(`Admin server running on port ${ADMIN_PORT}`);
});

module.exports = app; 