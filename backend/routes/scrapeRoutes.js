const express = require("express");
const { scrapeData } = require("../controllers/scrapeController");
const router = express.Router();

router.post("/", scrapeData);

module.exports = router;
