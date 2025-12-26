const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validation/authValidation');

router.post('/register', asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { username, password, role } = value;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400);
    throw new Error('Username already exists');
  }

  const user = new User({ username, password, role });
  await user.save();

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      username: user.username,
      role: user.role
    }
  });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { username, password } = value;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' } // Increased to 30d for better dev experience, can be shortened later
  );

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role
    }
  });
}));

module.exports = router;
