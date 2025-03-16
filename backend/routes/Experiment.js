const express = require('express');
const { experiment } = require('../controllers/Experiment');
const router = express.Router();

router.get("/:no", experiment);

module.exports = router;