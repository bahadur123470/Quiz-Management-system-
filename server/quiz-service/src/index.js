const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const quizRoutes = require('./routes/quiz');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/qms-quiz';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Quiz Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Quiz Service running on port ${PORT}`));
