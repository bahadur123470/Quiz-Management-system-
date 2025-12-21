const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, password, role } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      console.log('Validation failed: Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Validate role if provided
    if (role && !['Student', 'Instructor'].includes(role)) {
      console.log('Validation failed: Invalid role:', role);
      return res.status(400).json({ error: 'Role must be either Student or Instructor' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Validation failed: Username already exists:', username);
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    console.log('Creating new user:', { username, role });
    const user = new User({ username, password, role });
    await user.save();
    console.log('User registered successfully:', username);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
