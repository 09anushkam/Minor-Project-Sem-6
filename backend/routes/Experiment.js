const express = require('express');
const { experiment, sentimentCSV, sentimentText, sentimentMulti } = require('../controllers/Experiment');
const { upload } = require('../middleware');
const router = express.Router();

router.get("/:no", experiment);
router.post('/sentiment-analysis', upload.single('file'), sentimentCSV);
router.post('/sentiment-analysis/text', sentimentText);
router.post('/sentiment-analysis/text-multi', sentimentMulti);

module.exports = router;
