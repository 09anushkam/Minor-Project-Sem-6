const Experiment = require('../models/Experiment');
const { exec, spawn } = require('child_process');
const path = require('path');

function findPythonPath() {
    try {
        return execSync('which python3').toString().trim();  // Linux/Mac
    } catch {
        try {
            return execSync('where python').toString().split('\n')[0].trim();  // Windows
        } catch {
            return null;
        }
    }
}

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

    exec(`python "${pythonScript}" "${filePath}"`, (error, stdout, stderr) => {
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

    exec(`python "${pythonScript}" "${safeText}"`, (error, stdout, stderr) => {
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

    if (!inputData || !Array.isArray(inputData)) {
        return res.status(400).json({ error: 'Invalid input data. Expected an array of text entries.' });
    }

    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis_multi.py');
    const pythonProcess = spawn('python', [pythonScript]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0 || stderr) {
            console.error('Python stderr:', stderr);
            return res.status(500).json({
                error: 'Python script execution failed',
                stderr,
                code
            });
        }

        try {
            const parsed = JSON.parse(stdout);
            return res.json({ output: parsed });
        } catch (e) {
            return res.status(500).json({
                error: 'Error parsing Python output',
                raw: stdout,
                message: e.message
            });
        }
    });

    // Send the data to Python's stdin
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();
};