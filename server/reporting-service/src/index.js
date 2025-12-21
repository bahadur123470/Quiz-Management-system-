const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reportRoutes = require('./routes/report');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/reporting', reportRoutes);

const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/qms-reporting';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Reporting Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Reporting Service running on port ${PORT}`));
