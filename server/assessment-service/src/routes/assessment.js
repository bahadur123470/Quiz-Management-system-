const express = require('express');
const axios = require('axios');
const Submission = require('../models/Submission');
const router = express.Router();

const QUIZ_SERVICE_URL = process.env.QUIZ_SERVICE_URL || 'http://localhost:5002/api/quizzes';

// Grading Logic with Partial Credit
const calculateScore = (quizQuestions, userAnswers) => {
  let totalScore = 0;
  
  quizQuestions.forEach(q => {
    const userAnswer = userAnswers.find(ua => ua.questionId.toString() === q._id.toString());
    if (!userAnswer) return;

    if (q.type === 'MCQ' || q.type === 'True/False') {
      if (userAnswer.selectedOptions === q.correctAnswer) {
        totalScore += q.points;
      }
    } else if (q.type === 'Multi-Select') {
      const correctAnswers = q.correctAnswer; // Array
      const userSelected = userAnswer.selectedOptions; // Array
      
      const matched = userSelected.filter(opt => correctAnswers.includes(opt)).length;
      const incorrect = userSelected.filter(opt => !correctAnswers.includes(opt)).length;
      
      // Partial credit: (matched - incorrect) / totalCorrect * points, capped at 0
      let partial = ((matched - incorrect) / correctAnswers.length) * q.points;
      totalScore += Math.max(0, partial);
    }
  });

  return totalScore;
};

router.post('/submit', async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;
    
    // Fetch quiz questions from Quiz Service
    const response = await axios.get(`${QUIZ_SERVICE_URL}`);
    const quizzes = response.data;
    const quiz = quizzes.find(q => q._id.toString() === quizId);
    
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const score = calculateScore(quiz.questions, answers);
    
    const submission = new Submission({
      userId,
      quizId,
      answers,
      score,
      status: 'Submitted',
      submittedAt: new Date()
    });
    
    await submission.save();
    res.status(201).json({ score, submissionId: submission._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Draft
router.post('/save-draft', async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;
    let submission = await Submission.findOne({ userId, quizId, status: 'Draft' });
    
    if (submission) {
      submission.answers = answers;
      await submission.save();
    } else {
      submission = new Submission({ userId, quizId, answers, status: 'Draft' });
      await submission.save();
    }
    res.json({ message: 'Draft saved', submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
