const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();

// Create Quiz (Wizard)
router.post('/create', async (req, res) => {
  try {
    const { title, description, instructorId, questions, startTime, endTime, duration } = req.body;
    const quiz = new Quiz({ title, description, instructorId, questions, startTime, endTime, duration });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all quizzes (Dashboard)
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
