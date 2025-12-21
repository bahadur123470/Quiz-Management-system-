const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const assessmentRoutes = require('./routes/assessment');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/assessment', assessmentRoutes);

const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/qms-assessment';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Assessment Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Assessment Service running on port ${PORT}`));
