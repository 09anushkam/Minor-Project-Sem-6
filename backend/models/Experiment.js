const mongoose = require("mongoose");

const experimentSchema = new mongoose.Schema({
    no: Number,
    title: String,
    aim: String,
    theory: String,
    procedure: String,
    simulation: String,
    quiz: String,
    references: String,
    feedback: String
});

module.exports = mongoose.model("Experiment", experimentSchema);