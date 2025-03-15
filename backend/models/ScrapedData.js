const mongoose = require("mongoose");

const ScrapedDataSchema = new mongoose.Schema({
    method: String,
    data: Array,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ScrapedData", ScrapedDataSchema);
