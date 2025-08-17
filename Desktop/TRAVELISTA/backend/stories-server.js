const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Setup file upload for stories
const STORIES_UPLOAD_DIR = path.join(__dirname, '../uploads/stories');
if (!fs.existsSync(STORIES_UPLOAD_DIR)) {
  fs.mkdirSync(STORIES_UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORIES_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'story-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// MySQL connection config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel_agency',
};

// Helper function to create database connection
const getConnection = async () => {
  return await mysql.createConnection(dbConfig);
};

// Add a cleanup function for expired stories
const cleanupExpiredStories = async () => {
  try {
    const connection = await getConnection();
    
    // Get expired stories
    const [expiredStories] = await connection.execute(
      'SELECT media_url FROM stories WHERE expires_at <= NOW()'
    );

    // Delete expired story files
    for (const story of expiredStories) {
      const filePath = path.join(__dirname, '..', story.media_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete expired stories from database (cascade will handle views)
    await connection.execute(
      'DELETE FROM stories WHERE expires_at <= NOW()'
    );

    await connection.end();
  } catch (error) {
    console.error('Error cleaning up expired stories:', error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredStories, 3600000);

// GET /stories - fetch all active stories
router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    
    // Run cleanup before fetching
    await cleanupExpiredStories();
    
    const [stories] = await connection.execute(`
      SELECT 
        s.*,
        u.name,
        u.profile_picture,
        (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) as views_count,
        TIMESTAMPDIFF(HOUR, NOW(), s.expires_at) as hours_remaining,
        TIMESTAMPDIFF(MINUTE, NOW(), s.expires_at) % 60 as minutes_remaining
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.expires_at > NOW()
      ORDER BY s.created_at DESC
    `);

    // For each story, get viewers
    for (let story of stories) {
      const [viewers] = await connection.execute(`
        SELECT 
          u.id,
          u.name,
          u.profile_picture,
          sv.viewed_at,
          TIMESTAMPDIFF(MINUTE, sv.viewed_at, NOW()) as minutes_ago
        FROM story_views sv
        JOIN users u ON sv.user_id = u.id
        WHERE sv.story_id = ?
        ORDER BY sv.viewed_at DESC
      `, [story.id]);

      story.viewers = viewers;
      
      // Format time remaining
      story.timeRemaining = story.hours_remaining > 0 
        ? `${story.hours_remaining}h ${story.minutes_remaining}m`
        : `${story.minutes_remaining}m`;
        
      // Delete temporary time fields
      delete story.hours_remaining;
      delete story.minutes_remaining;
    }

    await connection.end();
    res.json({ success: true, stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ success: false, message: 'Error fetching stories' });
  }
});

// POST /stories/upload - upload a new story
router.post('/upload', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No media file provided' });
    }

    const { user_id } = req.body;
    const mediaUrl = `/uploads/stories/${req.file.filename}`;
    
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO stories (user_id, media_url, created_at, expires_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR))',
      [user_id, mediaUrl]
    );

    // Fetch the newly created story with user info
    const [story] = await connection.execute(`
      SELECT 
        s.*,
        u.name,
        u.profile_picture
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [result.insertId]);

    await connection.end();
    res.status(201).json({ 
      success: true, 
      message: 'Story uploaded successfully',
      story: story[0]
    });
  } catch (error) {
    console.error('Error uploading story:', error);
    res.status(500).json({ success: false, message: 'Error uploading story' });
  }
});

// POST /stories/:storyId/view - mark a story as viewed
router.post('/:storyId/view', async (req, res) => {
  try {
    const { storyId } = req.params;
    const { user_id } = req.body;
    
    const connection = await getConnection();
    
    // Check if story exists and hasn't expired
    const [story] = await connection.execute(
      'SELECT * FROM stories WHERE id = ? AND expires_at > NOW()',
      [storyId]
    );

    if (story.length === 0) {
      return res.status(404).json({ success: false, message: 'Story not found or expired' });
    }

    // Add view if not already viewed
    await connection.execute(
      'INSERT IGNORE INTO story_views (story_id, user_id) VALUES (?, ?)',
      [storyId, user_id]
    );

    // Get updated view count
    const [views] = await connection.execute(
      'SELECT COUNT(*) as count FROM story_views WHERE story_id = ?',
      [storyId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      views: views[0].count
    });
  } catch (error) {
    console.error('Error marking story as viewed:', error);
    res.status(500).json({ success: false, message: 'Error marking story as viewed' });
  }
});

// DELETE /stories/:storyId - delete a story
router.delete('/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    const { user_id } = req.body;
    
    const connection = await getConnection();
    
    // Check if story exists and belongs to user
    const [story] = await connection.execute(
      'SELECT media_url FROM stories WHERE id = ? AND user_id = ?',
      [storyId, user_id]
    );

    if (story.length === 0) {
      return res.status(404).json({ success: false, message: 'Story not found or unauthorized' });
    }

    // Delete the story file
    const filePath = path.join(__dirname, '..', story[0].media_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database (cascade will handle views)
    await connection.execute(
      'DELETE FROM stories WHERE id = ?',
      [storyId]
    );

    await connection.end();
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ success: false, message: 'Error deleting story' });
  }
});

module.exports = router; 