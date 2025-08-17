const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to verify user authentication
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  // Add your JWT verification logic here
  // For now, assuming token verification passes and user_id is extracted
  // req.user = { id: decoded.userId };
  next();
};

// Get all gallery images with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const location = req.query.location;
    const userId = req.query.user_id;
    
    let query = `
      SELECT 
        gi.*,
        u.username,
        u.profile_picture,
        (SELECT COUNT(*) FROM image_likes il WHERE il.image_id = gi.id) as actual_likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.image_id = gi.id) as actual_comments_count
      FROM gallery_images gi
      JOIN users u ON gi.user_id = u.id
    `;
    
    const queryParams = [];
    const whereConditions = [];
    
    if (location) {
      whereConditions.push('gi.location LIKE ?');
      queryParams.push(`%${location}%`);
    }
    
    if (userId) {
      whereConditions.push('gi.user_id = ?');
      queryParams.push(userId);
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    query += ` ORDER BY gi.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    
    const [images] = await db.pool.execute(query, queryParams);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM gallery_images gi';
    const countParams = [];
    
    if (whereConditions.length > 0) {
      countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
      if (location) countParams.push(`%${location}%`);
      if (userId) countParams.push(userId);
    }
    
    const [countResult] = await db.pool.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      success: true,
      data: {
        images,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ success: false, message: 'Error fetching gallery images' });
  }
});

// Get single image with details
router.get('/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    
    const [images] = await db.pool.execute(`
      SELECT 
        gi.*,
        u.username,
        u.profile_picture
      FROM gallery_images gi
      JOIN users u ON gi.user_id = u.id
      WHERE gi.id = ?
    `, [imageId]);
    
    if (images.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Get comments with replies
    const [comments] = await db.pool.execute(`
      SELECT 
        c.*,
        u.username,
        u.profile_picture,
        (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) as actual_likes_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.image_id = ?
      ORDER BY c.created_at DESC
    `, [imageId]);
    
    // Get replies for each comment
    for (let comment of comments) {
      const [replies] = await db.pool.execute(`
        SELECT 
          r.*,
          u.username,
          u.profile_picture,
          (SELECT COUNT(*) FROM reply_likes rl WHERE rl.reply_id = r.id) as actual_likes_count
        FROM replies r
        JOIN users u ON r.user_id = u.id
        WHERE r.comment_id = ?
        ORDER BY r.created_at ASC
      `, [comment.id]);
      
      comment.replies = replies;
    }
    
    res.json({
      success: true,
      data: {
        image: images[0],
        comments
      }
    });
  } catch (error) {
    console.error('Error fetching image details:', error);
    res.status(500).json({ success: false, message: 'Error fetching image details' });
  }
});

// Upload new image
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    
    const { caption, location, latitude, longitude } = req.body;
    const userId = req.user.id;
    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    
    const [result] = await db.pool.execute(`
      INSERT INTO gallery_images (user_id, image_url, caption, location, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userId, imageUrl, caption || null, location, latitude || null, longitude || null]);
    
    // Get the created image with user details
    const [newImage] = await db.pool.execute(`
      SELECT 
        gi.*,
        u.username,
        u.profile_picture
      FROM gallery_images gi
      JOIN users u ON gi.user_id = u.id
      WHERE gi.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: newImage[0]
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

// Like/Unlike image
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.user.id;
    
    // Check if already liked
    const [existingLike] = await db.pool.execute(`
      SELECT id FROM image_likes WHERE image_id = ? AND user_id = ?
    `, [imageId, userId]);
    
    if (existingLike.length > 0) {
      // Unlike
      await db.pool.execute(`
        DELETE FROM image_likes WHERE image_id = ? AND user_id = ?
      `, [imageId, userId]);
      
      res.json({
        success: true,
        message: 'Image unliked',
        liked: false
      });
    } else {
      // Like
      await db.pool.execute(`
        INSERT INTO image_likes (image_id, user_id) VALUES (?, ?)
      `, [imageId, userId]);
      
      res.json({
        success: true,
        message: 'Image liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Error toggling image like:', error);
    res.status(500).json({ success: false, message: 'Error toggling like' });
  }
});

// Add comment
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.user.id;
    const { comment_text } = req.body;
    
    if (!comment_text || comment_text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }
    
    const [result] = await db.pool.execute(`
      INSERT INTO comments (image_id, user_id, comment_text) VALUES (?, ?, ?)
    `, [imageId, userId, comment_text.trim()]);
    
    // Get the created comment with user details
    const [newComment] = await db.pool.execute(`
      SELECT 
        c.*,
        u.username,
        u.profile_picture
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment[0]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Error adding comment' });
  }
});

// Like/Unlike comment
router.post('/comments/:commentId/like', verifyToken, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    
    // Check if already liked
    const [existingLike] = await db.pool.execute(`
      SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?
    `, [commentId, userId]);
    
    if (existingLike.length > 0) {
      // Unlike
      await db.pool.execute(`
        DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?
      `, [commentId, userId]);
      
      res.json({
        success: true,
        message: 'Comment unliked',
        liked: false
      });
    } else {
      // Like
      await db.pool.execute(`
        INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)
      `, [commentId, userId]);
      
      res.json({
        success: true,
        message: 'Comment liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ success: false, message: 'Error toggling comment like' });
  }
});

// Add reply to comment
router.post('/comments/:commentId/replies', verifyToken, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const { reply_text } = req.body;
    
    if (!reply_text || reply_text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }
    
    const [result] = await db.pool.execute(`
      INSERT INTO replies (comment_id, user_id, reply_text) VALUES (?, ?, ?)
    `, [commentId, userId, reply_text.trim()]);
    
    // Get the created reply with user details
    const [newReply] = await db.pool.execute(`
      SELECT 
        r.*,
        u.username,
        u.profile_picture
      FROM replies r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: newReply[0]
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ success: false, message: 'Error adding reply' });
  }
});

// Like/Unlike reply
router.post('/replies/:replyId/like', verifyToken, async (req, res) => {
  try {
    const replyId = req.params.replyId;
    const userId = req.user.id;
    
    // Check if already liked
    const [existingLike] = await db.pool.execute(`
      SELECT id FROM reply_likes WHERE reply_id = ? AND user_id = ?
    `, [replyId, userId]);
    
    if (existingLike.length > 0) {
      // Unlike
      await db.pool.execute(`
        DELETE FROM reply_likes WHERE reply_id = ? AND user_id = ?
      `, [replyId, userId]);
      
      res.json({
        success: true,
        message: 'Reply unliked',
        liked: false
      });
    } else {
      // Like
      await db.pool.execute(`
        INSERT INTO reply_likes (reply_id, user_id) VALUES (?, ?)
      `, [replyId, userId]);
      
      res.json({
        success: true,
        message: 'Reply liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Error toggling reply like:', error);
    res.status(500).json({ success: false, message: 'Error toggling reply like' });
  }
});

// Delete image (only by owner)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.user.id;
    
    // Check if user owns the image
    const [image] = await db.pool.execute(`
      SELECT user_id, image_url FROM gallery_images WHERE id = ?
    `, [imageId]);
    
    if (image.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    if (image[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this image' });
    }
    
    // Delete the image file
    const imagePath = path.join(__dirname, '../..', image[0].image_url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Delete from database (cascade will handle related records)
    await db.pool.execute(`
      DELETE FROM gallery_images WHERE id = ?
    `, [imageId]);
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Error deleting image' });
  }
});

// Get user's liked images
router.get('/user/:userId/likes', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const [images] = await db.pool.execute(`
      SELECT 
        gi.*,
        u.username,
        u.profile_picture,
        il.created_at as liked_at
      FROM gallery_images gi
      JOIN users u ON gi.user_id = u.id
      JOIN image_likes il ON gi.id = il.image_id
      WHERE il.user_id = ?
      ORDER BY il.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);
    
    // Get total count
    const [countResult] = await db.pool.execute(`
      SELECT COUNT(*) as total FROM image_likes WHERE user_id = ?
    `, [userId]);
    const total = countResult[0].total;
    
    res.json({
      success: true,
      data: {
        images,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching liked images:', error);
    res.status(500).json({ success: false, message: 'Error fetching liked images' });
  }
});

module.exports = router;