const Experiment = require('../models/Experiment');
const { exec, spawn } = require('child_process');
const path = require('path');

module.exports.experiment = async (req, res) => {
    try {
        const experiment = await Experiment.findOne({ no: req.params.no });
        if (!experiment) {
            return res.status(404).json({ error: "Experiment not found" });
        }
        res.json(experiment);
    } catch (error) {
        console.error("Error fetching experiment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.sentimentCSV = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis.py');

    exec(`python3 "${pythonScript}" "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: error.message });
        }

        try {
            const output = JSON.parse(stdout);
            res.status(200).json({ message: 'Analysis complete', output });
        } catch (e) {
            console.error('Error parsing Python output:', e);
            return res.status(500).json({ error: 'Error parsing output from Python script' });
        }
    });
}

module.exports.sentimentText = (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }
    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis_text.py');

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
}

module.exports.sentimentMulti = (req, res) => {
    const inputData = req.body.data;

    const python = spawn('python', ['python_scripts/sentiment_analysis_multi.py']);

    let result = '';
    python.stdout.on('data', (data) => {
        result += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });

    python.on('close', (code) => {
        try {
            res.json({ output: JSON.parse(result) });
        } catch (err) {
            res.status(500).json({ error: 'Error parsing Python output', raw: result });
        }
    });

    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();
}