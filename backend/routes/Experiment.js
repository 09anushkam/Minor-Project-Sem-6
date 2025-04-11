const express = require('express');
const { experiment, sentimentCSV, sentimentText, sentimentMulti } = require('../controllers/Experiment');
const { upload } = require('../middleware');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/sentiment-analysis', upload.single('file'), sentimentCSV);
router.post('/sentiment-analysis/text', sentimentText);
router.post('/sentiment-analysis/text-multi', sentimentMulti);
router.get('/default-datasets', (req, res) => {
    const datasetDir = path.join(__dirname, '..', 'datasets');

    // Ensure the folder exists
    if (!fs.existsSync(datasetDir)) {
        return res.status(400).json({ error: 'Dataset folder not found' });
    }

    fs.readdir(datasetDir, (err, files) => {
        if (err) {
            console.error('Failed to read datasets:', err);
            return res.status(500).json({ error: 'Failed to read dataset folder' });
        }

        const csvFiles = files.filter(file => file.endsWith('.csv'));
        res.json({ datasets: csvFiles });
    });
});
router.get("/:no", experiment);

module.exports = router;
