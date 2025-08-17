# Travel Agency Backend

## Overview
This is the backend API for the Travel Agency application, built with Node.js, Express, and MySQL. It provides authentication, user management, and profile functionality.

## Features
- User registration and login (email/password)
- Google OAuth authentication
- Email verification
- Password reset functionality
- User profile management
- Profile picture upload
- JWT authentication

## Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- Firebase project (for Google authentication)

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Rename `dot.env` to `.env` and update the values as needed:
```bash
mv dot.env .env
```

Important settings to configure:
- Database credentials
- JWT secret
- Email settings (for verification emails)
- Firebase service account private key

### 3. Firebase Setup
For Firebase authentication to work properly:
1. Create a Firebase project if you don't have one
2. Enable Authentication with Email/Password and Google sign-in methods
3. Create a service account and download the key file
4. Add the private key to your .env file

### 4. Database Setup
Create a MySQL database named `travel_agency`:
```sql
CREATE DATABASE travel_agency;
```

Run the migration to create the tables:
```bash
npm run migrate
```

### 5. Start the Server
For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google authentication
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify` - Verify JWT token

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/profile/picture` - Update profile picture

## How Email Verification Works
1. When a user signs up, a verification token is generated
2. An email is sent to the user with a verification link
3. When the user clicks the link, their email is verified
4. The user can then log in

## How Google Authentication Works
1. The frontend obtains an ID token from Firebase
2. The token is sent to the backend and verified
3. If the user doesn't exist, a new user record is created
4. A JWT token is returned for API authentication

## Security Notes
- Passwords are hashed using bcrypt
- Email verification is required for standard login
- JWT tokens are used for API authentication
- All sensitive routes are protected by authentication middleware 