# 404 Founders Admin System

## Setup Complete! ✅

Your admin system is now fully integrated with:
- **Backend Server**: Express.js with SQLite database
- **Admin Login**: Username: `Admin404`, Password: `404Founders@`
- **Admin Dashboard**: View and manage contact messages
- **Database Integration**: Contact form saves to SQLite

## How to Use:

### 1. Start the Development Environment
```bash
# Start both frontend and backend together
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### 2. Access Admin Panel
1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - **Username**: `Admin404`
   - **Password**: `404Founders@`
3. You'll be redirected to the admin dashboard

### 3. Test Contact Form
1. Go to `http://localhost:3000/contact`
2. Fill out and submit the contact form
3. Check the admin dashboard to see the message

## Features:

### Admin Dashboard
- ✅ View all contact messages
- ✅ Mark messages as read/unread
- ✅ Delete messages
- ✅ Pagination for large numbers of messages
- ✅ Statistics (total, unread, read messages)
- ✅ Real-time message status updates

### Security
- ✅ JWT authentication
- ✅ Protected admin routes
- ✅ Secure password hashing
- ✅ Session management

### Database
- ✅ SQLite database auto-creation
- ✅ Contact messages storage
- ✅ Admin user management
- ✅ Automatic table creation

## File Structure:
```
├── server.js                    # Backend server
├── database.sqlite               # SQLite database (auto-created)
├── src/pages/AdminLogin.js       # Admin login page
├── src/pages/AdminDashboard.js   # Admin dashboard
└── src/components/ui/ContactForm.js # Updated contact form
```

## Troubleshooting:

### If you get connection errors:
1. Make sure both servers are running: `npm run dev`
2. Check that ports 3000 and 5000 are available
3. Restart the development servers if needed

### If admin login doesn't work:
1. Check the console for errors
2. Verify the server is running on port 5000
3. Default credentials are: Admin404 / 404Founders@

### To view the database:
The SQLite database file `database.sqlite` will be created in your project root. You can view it with any SQLite browser tool.

## Admin Routes:
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (requires authentication)

## API Endpoints:
- `POST /api/contact` - Submit contact form
- `POST /api/admin/login` - Admin login
- `GET /api/admin/contacts` - Get contact messages (admin only)
- `DELETE /api/admin/contacts/:id` - Delete contact (admin only)
- `PATCH /api/admin/contacts/:id/read` - Mark as read (admin only)

Your admin system is ready to use! 🚀
