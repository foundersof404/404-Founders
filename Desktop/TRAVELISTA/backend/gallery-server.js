const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const storiesRouter = require('./stories-server');

const app = express();
const PORT = 5001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
const UPLOAD_DIR = path.join(__dirname, '../uploads/gallery');
const STORIES_UPLOAD_DIR = path.join(__dirname, '../uploads/stories');

// Create upload directories if they don't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(STORIES_UPLOAD_DIR)) {
  fs.mkdirSync(STORIES_UPLOAD_DIR, { recursive: true });
}

// Serve static files
app.use('/uploads/gallery', express.static(UPLOAD_DIR));
app.use('/uploads/stories', express.static(STORIES_UPLOAD_DIR));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
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

// GET /gallery - fetch all gallery images with likes and comments
app.get('/gallery', async (req, res) => {
  try {
    const connection = await getConnection();
    const [images] = await connection.execute(`
      SELECT 
        g.*,
        COUNT(DISTINCT l.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE image_id = g.id) as comments_count,
        u.name,
        u.email,
        CONCAT('https://ui-avatars.com/api/?name=', REPLACE(u.name, ' ', '+'), '&background=4285F4&color=fff') as profile_picture
      FROM gallery_images g
      LEFT JOIN image_likes l ON g.id = l.image_id
      LEFT JOIN users u ON g.user_id = u.id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `);

    // For each image, fetch comments and replies
    for (let image of images) {
      // Add user info to image
      image.user = image.name ? {
        id: image.user_id,
        name: image.name,
        email: image.email,
        profile_picture: image.profile_picture
      } : null;
      
      // Remove user fields from root level
      delete image.name;
      delete image.email;
      delete image.profile_picture;

      const [comments] = await connection.execute(`
        SELECT 
          c.*,
          (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count,
          (SELECT COUNT(*) FROM replies WHERE comment_id = c.id) as replies_count,
          u.name,
          u.email,
          CONCAT('https://ui-avatars.com/api/?name=', REPLACE(u.name, ' ', '+'), '&background=4285F4&color=fff') as profile_picture
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.image_id = ?
        ORDER BY c.created_at DESC
      `, [image.id]);

      // For each comment, fetch replies
      for (let comment of comments) {
        // Add user info to comment
        comment.user = comment.name ? {
          id: comment.user_id,
          name: comment.name,
          email: comment.email,
          profile_picture: comment.profile_picture
        } : null;
        
        // Remove user fields from root level
        delete comment.name;
        delete comment.email;
        delete comment.profile_picture;

        const [replies] = await connection.execute(`
          SELECT 
            r.*,
            (SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id) as likes_count,
            u.name,
            u.email,
            CONCAT('https://ui-avatars.com/api/?name=', REPLACE(u.name, ' ', '+'), '&background=4285F4&color=fff') as profile_picture
          FROM replies r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.comment_id = ?
          ORDER BY r.created_at ASC
        `, [comment.id]);

        // Add user info to replies
        comment.replies = replies.map(reply => {
          const replyWithUser = {
            ...reply,
            user: reply.name ? {
              id: reply.user_id,
              name: reply.name,
              email: reply.email,
              profile_picture: reply.profile_picture
            } : null
          };
          
          // Remove user fields from root level
          delete replyWithUser.name;
          delete replyWithUser.email;
          delete replyWithUser.profile_picture;
          
          return replyWithUser;
        });
      }
      image.comments = comments;
    }

    await connection.end();
    res.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ success: false, message: 'Error fetching gallery images' });
  }
});

// POST /gallery/upload - upload an image
app.post('/gallery/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const { caption, location, user_id } = req.body;
    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO gallery_images (user_id, image_url, caption, location, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [user_id, imageUrl, caption || null, location || null]
    );
    await connection.end();
    
    res.status(201).json({ 
      success: true, 
      message: 'Image uploaded successfully', 
      image_id: result.insertId, 
      image_url: imageUrl 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

// POST /gallery/:imageId/like - like/unlike an image
app.post('/gallery/:imageId/like', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { user_id } = req.body;
    
    const connection = await getConnection();
    
    // Check if like exists
    const [existingLike] = await connection.execute(
      'SELECT * FROM image_likes WHERE image_id = ? AND user_id = ?',
      [imageId, user_id]
    );

    if (existingLike.length > 0) {
      // Unlike
      await connection.execute(
        'DELETE FROM image_likes WHERE image_id = ? AND user_id = ?',
        [imageId, user_id]
      );
    } else {
      // Like
      await connection.execute(
        'INSERT INTO image_likes (image_id, user_id, created_at) VALUES (?, ?, NOW())',
        [imageId, user_id]
      );
    }

    // Get updated like count
    const [likes] = await connection.execute(
      'SELECT COUNT(*) as count FROM image_likes WHERE image_id = ?',
      [imageId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      likes: likes[0].count,
      isLiked: existingLike.length === 0 
    });
  } catch (error) {
    console.error('Error handling image like:', error);
    res.status(500).json({ success: false, message: 'Error handling image like' });
  }
});

// POST /gallery/:imageId/comment - add a comment
app.post('/gallery/:imageId/comment', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { user_id, text } = req.body;
    
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO comments (image_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
      [imageId, user_id, text]
    );

    // Fetch the newly created comment with user information
    const [comment] = await connection.execute(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count,
        (SELECT COUNT(*) FROM replies WHERE comment_id = c.id) as replies_count,
        u.name,
        u.email,
        CONCAT('https://ui-avatars.com/api/?name=', REPLACE(u.name, ' ', '+'), '&background=4285F4&color=fff') as profile_picture
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);

    // Structure the response with user info
    const commentData = {
      ...comment[0],
      user: {
        id: comment[0].user_id,
        name: comment[0].name,
        email: comment[0].email,
        profile_picture: comment[0].profile_picture
      },
      replies: []
    };

    // Remove user fields from root level
    delete commentData.name;
    delete commentData.email;
    delete commentData.profile_picture;

    await connection.end();
    res.status(201).json({ 
      success: true, 
      comment: commentData
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Error adding comment' });
  }
});

// POST /gallery/comment/:commentId/like - like/unlike a comment
app.post('/gallery/comment/:commentId/like', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { user_id } = req.body;
    
    const connection = await getConnection();
    
    // Check if like exists
    const [existingLike] = await connection.execute(
      'SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?',
      [commentId, user_id]
    );

    if (existingLike.length > 0) {
      // Unlike
      await connection.execute(
        'DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?',
        [commentId, user_id]
      );
    } else {
      // Like
      await connection.execute(
        'INSERT INTO comment_likes (comment_id, user_id, created_at) VALUES (?, ?, NOW())',
        [commentId, user_id]
      );
    }

    // Get updated like count
    const [likes] = await connection.execute(
      'SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?',
      [commentId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      likes: likes[0].count,
      isLiked: existingLike.length === 0 
    });
  } catch (error) {
    console.error('Error handling comment like:', error);
    res.status(500).json({ success: false, message: 'Error handling comment like' });
  }
});

// POST /gallery/comment/:commentId/reply - add a reply to a comment
app.post('/gallery/comment/:commentId/reply', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { user_id, text } = req.body;
    
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO replies (comment_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
      [commentId, user_id, text]
    );

    // Fetch the newly created reply with user information
    const [reply] = await connection.execute(`
      SELECT 
        r.*,
        (SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id) as likes_count,
        u.name,
        u.email,
        CONCAT('https://ui-avatars.com/api/?name=', REPLACE(u.name, ' ', '+'), '&background=4285F4&color=fff') as profile_picture
      FROM replies r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [result.insertId]);

    // Structure the response with user info
    const replyData = {
      ...reply[0],
      user: {
        id: reply[0].user_id,
        name: reply[0].name,
        email: reply[0].email,
        profile_picture: reply[0].profile_picture
      }
    };

    // Remove user fields from root level
    delete replyData.name;
    delete replyData.email;
    delete replyData.profile_picture;

    await connection.end();
    res.status(201).json({ 
      success: true, 
      reply: replyData
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ success: false, message: 'Error adding reply' });
  }
});

// POST /gallery/reply/:replyId/like - like/unlike a reply
app.post('/gallery/reply/:replyId/like', async (req, res) => {
  try {
    const { replyId } = req.params;
    const { user_id } = req.body;
    
    const connection = await getConnection();
    
    // Check if like exists
    const [existingLike] = await connection.execute(
      'SELECT * FROM reply_likes WHERE reply_id = ? AND user_id = ?',
      [replyId, user_id]
    );

    if (existingLike.length > 0) {
      // Unlike
      await connection.execute(
        'DELETE FROM reply_likes WHERE reply_id = ? AND user_id = ?',
        [replyId, user_id]
      );
    } else {
      // Like
      await connection.execute(
        'INSERT INTO reply_likes (reply_id, user_id, created_at) VALUES (?, ?, NOW())',
        [replyId, user_id]
      );
    }

    // Get updated like count
    const [likes] = await connection.execute(
      'SELECT COUNT(*) as count FROM reply_likes WHERE reply_id = ?',
      [replyId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      likes: likes[0].count,
      isLiked: existingLike.length === 0 
    });
  } catch (error) {
    console.error('Error handling reply like:', error);
    res.status(500).json({ success: false, message: 'Error handling reply like' });
  }
});

// Add stories routes
app.use('/stories', storiesRouter);

app.listen(PORT, () => {
  console.log(`Gallery server running on http://localhost:${PORT}`);
});