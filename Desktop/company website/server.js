const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = '404founders_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite');

// Create tables if they don't exist
db.serialize(() => {
  // Create contacts table
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create admin user table
  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create default admin user
  const hashedPassword = bcrypt.hashSync('404Founders@', 10);
  db.run(`INSERT OR IGNORE INTO admin_users (username, password) VALUES (?, ?)`, 
    ['Admin404', hashedPassword], 
    function(err) {
      if (err) {
        console.log('Admin user already exists');
      } else {
        console.log('Default admin user created');
      }
    }
  );
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Routes

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.get(`SELECT * FROM admin_users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      message: 'Login successful',
      admin: { id: user.id, username: user.username }
    });
  });
});

// Verify admin token
app.get('/api/admin/verify', verifyToken, (req, res) => {
  res.json({ 
    valid: true, 
    admin: req.admin 
  });
});

// Submit contact form
app.post('/api/contact', (req, res) => {
  const { name, email, phone, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  const stmt = db.prepare(`INSERT INTO contacts (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)`);
  
  stmt.run([name, email, phone || null, company || null, message], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save contact message' });
    }

    res.json({ 
      success: true,
      message: 'Message sent successfully',
      id: this.lastID
    });
  });

  stmt.finalize();
});

// Get all contact messages (admin only)
app.get('/api/admin/contacts', verifyToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Get total count
  db.get(`SELECT COUNT(*) as total FROM contacts`, (err, count) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Get contacts with pagination
    db.all(`SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?`, 
      [limit, offset], 
      (err, contacts) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }

        res.json({
          contacts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count.total / limit),
            totalContacts: count.total,
            limit
          }
        });
      }
    );
  });
});

// Delete contact message (admin only)
app.delete('/api/admin/contacts/:id', verifyToken, (req, res) => {
  const contactId = req.params.id;

  db.run(`DELETE FROM contacts WHERE id = ?`, [contactId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete contact' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  });
});

// Mark contact as read (admin only)
app.patch('/api/admin/contacts/:id/read', verifyToken, (req, res) => {
  const contactId = req.params.id;

  // First, add is_read column if it doesn't exist
  db.run(`ALTER TABLE contacts ADD COLUMN is_read BOOLEAN DEFAULT FALSE`, (err) => {
    // Continue even if column already exists
    db.run(`UPDATE contacts SET is_read = TRUE WHERE id = ?`, [contactId], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to mark as read' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.json({ message: 'Contact marked as read' });
    });
  });
});

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Default admin credentials:');
  console.log('Username: Admin404');
  console.log('Password: 404Founders@');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nClosing database connection...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
