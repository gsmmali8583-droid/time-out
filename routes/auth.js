const express = require('express');
const router = express.Router();

// In-memory user storage (replace with database)
const users = [];

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
        errors: [
          { field: 'firstName', message: 'First name is required' },
          { field: 'lastName', message: 'Last name is required' },
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is required' }
        ]
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const newUser = {
      _id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password, // In production, hash this!
      phone,
      role: 'user',
      isVerified: false,
      createdAt: new Date()
    };

    // Store user
    users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    const token = 'jwt_token_' + Date.now();

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken: 'refresh_token_' + Date.now()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    const token = 'jwt_token_' + Date.now();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken: 'refresh_token_' + Date.now()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
        isVerified: true
      }
    }
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;