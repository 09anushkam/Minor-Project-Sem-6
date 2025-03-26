const express = require("express");
const { scrapeData, getTwitterData, getStoredTwitterData } = require("../controllers/scrapeController");
const router = express.Router();

router.post("/", scrapeData);
router.get('/twitter', getTwitterData);
router.get("/twitter-stored", getStoredTwitterData);

module.exports = router;
