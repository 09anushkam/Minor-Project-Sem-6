const mongoose = require("mongoose");

const twitterDataSchema = new mongoose.Schema({
    query: String,
    tweets: [
        {
            id: String,
            text: String,
            username: String,
            created_at: Date,
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TwitterData", twitterDataSchema);
