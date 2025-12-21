const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const router = express.Router();

const ASSESSMENT_SERVICE_URL = process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:5003/api/assessment';

// Get Analytics for a Quiz
router.get('/analytics/:quizId', async (req, res) => {
  try {
    // In a real microservice, we might use a shared database or an event bus,
    // but here we'll simulate fetching all submissions for a quiz.
    // This is a placeholder for actual aggregation logic.
    res.json({ message: 'Analytics data for quiz ' + req.params.quizId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF Report
router.get('/pdf/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;
    // Fetch submission details (Simulated)
    // Note: In production, we'd fetch the actual submission data.
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const htmlContent = `
      <html>
        <body>
          <h1>Quiz Submission Report</h1>
          <p>Submission ID: ${submissionId}</p>
          <p>Generated at: ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    const pdf = await page.pdf({ format: 'A4' });
    
    await browser.close();
    
    res.contentType("application/pdf");
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
