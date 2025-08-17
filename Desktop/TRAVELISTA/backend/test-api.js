// Test API endpoints for profile and file upload
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:5000';
console.log(`Testing API at: ${API_URL}`);

let token = '';
const testEmail = 'test@example.com';
const testPassword = 'password123';

// Test login
async function testLogin() {
  try {
    console.log('\n--- Testing Login ---');
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    
    console.log('Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.token) {
      token = response.data.token;
      console.log('Login successful, token obtained');
      return true;
    } else {
      console.log('Login failed, no token received');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return false;
  }
}

// Test profile retrieval
async function testGetProfile() {
  try {
    if (!token) {
      console.log('No token available, skipping profile test');
      return;
    }
    
    console.log('\n--- Testing Get Profile ---');
    const response = await axios.get(`${API_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Status:', response.status);
    console.log('Profile data:', JSON.stringify(response.data, null, 2));
    
    // Check if profilePicture and location are included
    if (response.data.user) {
      console.log('Profile picture URL:', response.data.user.profilePicture);
      console.log('Location:', response.data.user.location);
    }
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error.message);
  }
}

// Test profile update
async function testUpdateProfile() {
  try {
    if (!token) {
      console.log('No token available, skipping profile update test');
      return;
    }
    
    console.log('\n--- Testing Update Profile ---');
    const response = await axios.put(
      `${API_URL}/api/user/profile`, 
      {
        name: 'Test User Updated',
        location: 'Test Location'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Status:', response.status);
    console.log('Updated profile data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error.message);
  }
}

// Run the tests
async function runTests() {
  const loginSuccess = await testLogin();
  if (loginSuccess) {
    await testGetProfile();
    await testUpdateProfile();
    await testGetProfile(); // Get profile again to see the updates
  }
}

runTests().catch(error => {
  console.error('Test execution error:', error);
}); 