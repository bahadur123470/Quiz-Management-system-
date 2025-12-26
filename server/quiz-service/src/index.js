const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const quizRoutes = require('./routes/quiz');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use('/api/quizzes', quizRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/qms-quiz';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Quiz Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Quiz Service running on port ${PORT}`));
