const nodemailer = require('nodemailer');
require('dotenv').config();

// Determine if we're in development mode
const isDev = process.env.APP_ENV === 'local' || process.env.NODE_ENV === 'development';

// Create email transporter
let transporter;

if (isDev) {
  console.log('Using mock email transporter for development');
  // For development, we'll create a mock transporter that doesn't send real emails
  // but logs them to the console instead
  transporter = {
    verify: () => Promise.resolve(true),
    sendMail: (options) => {
      console.log('========== MOCK EMAIL ==========');
      console.log('To:', options.to);
      console.log('From:', options.from);
      console.log('Subject:', options.subject);
      console.log('Body (HTML):', options.html);
      console.log('================================');
      return Promise.resolve({ messageId: 'mock-email-id-' + Date.now() });
    }
  };
} else {
  // For production, use real email service
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_ENCRYPTION === 'tls',
    auth: process.env.MAIL_USERNAME ? {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    } : undefined
  });
}

// Verify transporter connection
async function verifyTransporter() {
  try {
    if (isDev) {
      console.log('Mock email service ready');
      return true;
    }
    
    await transporter.verify();
    console.log('Email service connection established');
    return true;
  } catch (error) {
    console.error('Email service connection error:', error.message);
    return false;
  }
}

// Send verification email
async function sendVerificationEmail(email, verificationLink, name) {
  // No need for a separate verification URL since we're using Firebase's link
  const verifyUrl = verificationLink;
  
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME || 'Travel Agency'}" <${process.env.MAIL_FROM_ADDRESS || 'noreply@example.com'}>`,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Welcome to ${process.env.APP_NAME || 'Travel Agency'}</h2>
        <p>Hello ${name || 'there'},</p>
        <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #888; font-size: 12px;">If you didn't sign up for an account, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send verification email:', error.message);
    throw error;
  }
}

// Send password reset email
async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME || 'Travel Agency'}" <${process.env.MAIL_FROM_ADDRESS || 'noreply@example.com'}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="color: #888; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send password reset email:', error.message);
    throw error;
  }
}

module.exports = {
  verifyTransporter,
  sendVerificationEmail,
  sendPasswordResetEmail
}; 