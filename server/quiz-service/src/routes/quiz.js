const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/authMiddleware');
const { quizSchema } = require('../validation/quizValidation');
const Quiz = require('../models/Quiz');

// Create Quiz (Wizard) - Instructor only
router.post('/create', protect, authorize('Instructor'), asyncHandler(async (req, res) => {
  const { error, value } = quizSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const quiz = new Quiz(value);
  await quiz.save();
  res.status(201).json(quiz);
}));

// Get all quizzes (Dashboard) - Protected
router.get('/', protect, asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
}));

// Get Instructor's Quizzes
router.get('/instructor/:instructorId', protect, authorize('Instructor'), asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ instructorId: req.params.instructorId });
  res.json(quizzes);
}));

// Delete Quiz - Instructor only
router.delete('/:id', protect, authorize('Instructor'), asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  await quiz.deleteOne();
  res.json({ message: 'Quiz removed' });
}));

module.exports = router;
