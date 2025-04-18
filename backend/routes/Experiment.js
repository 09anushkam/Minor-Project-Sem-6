const express = require('express');
const { experiment, sentimentCSV, sentimentText, sentimentMulti, runTopicModeling, defaultDatasets, runTopicModelingDefault, getDefaultDatasets } = require('../controllers/Experiment');
const { upload } = require('../middleware');
const router = express.Router();

router.post('/sentiment-analysis', upload.single('file'), sentimentCSV);
router.post('/sentiment-analysis/text', sentimentText);
router.post('/sentiment-analysis/text-multi', sentimentMulti);
router.get('/default-datasets', defaultDatasets);
router.post('/run-topic-modeling', upload.single('file'), runTopicModeling);
router.post('/topic-modeling-default', runTopicModelingDefault);
router.get('/default-datasets-topic', getDefaultDatasets);
router.get("/:no", experiment);

module.exports = router;
