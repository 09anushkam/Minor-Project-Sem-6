const Experiment = require('../models/Experiment');
const { exec, spawn } = require('child_process');
const path = require('path');

module.exports.experiment = async (req, res) => {
    try {
        // console.log('Received request for experiment:', req.params.no);
        const experimentNo = parseInt(req.params.no, 10);

        if (isNaN(experimentNo)) {
            // console.log('Invalid experiment number:', req.params.no);
            return res.status(400).json({ error: "Invalid experiment number" });
        }

        // console.log('Looking for experiment number:', experimentNo);
        const experiment = await Experiment.findOne({ no: experimentNo });

        if (!experiment) {
            // console.log('Experiment not found:', experimentNo);
            // Let's check what experiments exist in the database
            const allExperiments = await Experiment.find({}, { no: 1, title: 1 }).sort({ no: 1 });
            // console.log('Available experiments:', allExperiments);
            return res.status(404).json({
                error: "Experiment not found",
                message: `No experiment found with number ${experimentNo}`,
                availableExperiments: allExperiments
            });
        }

        // console.log('Found experiment:', experiment.title);
        res.json(experiment);
    } catch (error) {
        console.error("Error fetching experiment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.sentimentCSV = (req, res) => {
    // if (!req.file) {
    //     return res.status(400).json({ error: 'No file uploaded' });
    // }

    // const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    let filePath;

    if (req.body.filename) {
        filePath = path.join(__dirname, '..', 'uploads', req.body.filename);
    } else if (req.body.datasetName) {
        filePath = path.join(__dirname, '..', 'datasets', req.body.datasetName);
    } else if (req.file) {
        filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    } else {
        return res.status(400).json({ error: 'No input file provided' });
    }
    console.log("filepath is: ", filePath);

    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis.py');

    exec(`python3 "${pythonScript}" "${filePath}"`, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error('Python error:', stderr || error.message);
            return res.status(500).json({
                error: 'Python script execution failed',
                detail: stderr || error.message,
            });
        }

        try {
            const output = JSON.parse(stdout);
            return res.status(200).json({ message: 'Analysis complete', output });
        } catch (parseError) {
            console.error('Error parsing Python output:', stdout);
            return res.status(500).json({
                error: 'Invalid JSON output from Python script',
                raw: stdout,
            });
        }
    });
};

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