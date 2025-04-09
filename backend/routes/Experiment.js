const express = require('express');
const { experiment } = require('../controllers/Experiment');
const { upload } = require('../middleware');
const { exec } = require('child_process');
const path = require('path');
const router = express.Router();

router.get("/:no", experiment);
router.post('/sentiment-analysis', upload.single('file'), (req, res) => {
    console.log("Received POST /sentiment-analysis/ with body no");
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis.py');

    exec(`python3 "${pythonScript}" "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: error.message });
        }

        try {
            const output = JSON.parse(stdout); // ✅ Now safely parsed
            res.status(200).json({ message: 'Analysis complete', output });
        } catch (e) {
            console.error('Error parsing Python output:', e);
            return res.status(500).json({ error: 'Error parsing output from Python script' });
        }
    });
});
router.post('/sentiment-analysis/text', (req, res) => {
    console.log("Received POST /sentiment-analysis/text with body:", req.body);
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }
    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis_text.py');

    // Escape double quotes in the text
    const safeText = text.replace(/"/g, '\\"');

    exec(`python3 "${pythonScript}" "${safeText}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: error.message });
        }
        try {
            const output = JSON.parse(stdout);
            res.status(200).json({ message: 'Analysis complete', output });
        } catch (e) {
            res.status(500).json({ error: 'Error parsing output' });
        }
    });
});

module.exports = router;
