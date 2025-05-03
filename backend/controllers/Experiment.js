const Experiment = require('../models/Experiment');
const { exec, spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function findPythonPath() {
    try {
        return execSync('where python').toString().split('\n')[0].trim();  // Windows
    } catch {
        return 'python';
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

// module.exports.sentimentCSV = (req, res) => {
//     let filePath;

//     if (req.body.filename) {
//         filePath = path.join(__dirname, '..', 'uploads', req.body.filename);
//     } else if (req.body.datasetName) {
//         filePath = path.join(__dirname, '..', 'datasets', req.body.datasetName);
//     } else if (req.file) {
//         filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
//     } else {
//         return res.status(400).json({ error: 'No input file provided' });
//     }
//     // console.log("filepath is: ", filePath);

//     const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis.py');

//     exec(`python "${pythonScript}" "${filePath}"`, (error, stdout, stderr) => {
//         if (error || stderr) {
//             console.error('Python error:', stderr || error.message);
//             return res.status(500).json({
//                 error: 'Python script execution failed',
//                 detail: stderr || error.message,
//             });
//         }

//         try {
//             const output = JSON.parse(stdout);
//             return res.status(200).json({ message: 'Analysis complete', output });
//         } catch (parseError) {
//             console.error('Error parsing Python output:', stdout);
//             return res.status(500).json({
//                 error: 'Invalid JSON output from Python script',
//                 raw: stdout,
//             });
//         }
//     });
// };

module.exports.sentimentCSV = (req, res) => {
    let filePath;

    if (req.body.filename) {
        filePath = path.join(__dirname, '..', 'uploads', req.body.filename);
    } else if (req.body.datasetName) {
        filePath = path.join(__dirname, '..', 'datasets', req.body.datasetName);
    } else if (req.file) {
        filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    } else {
        return res.status(400).json({ error: 'No input file provided.' });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found.' });
    }

    if (!filePath.endsWith('.csv')) {
        return res.status(400).json({ error: 'Only CSV files are supported.' });
    }

    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis.py');

    exec(`python "${pythonScript}" "${filePath}"`, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error('Python error:', stderr || error.message);
            return res.status(500).json({
                error: 'Python script execution failed.',
                details: stderr || error.message,
            });
        }

        try {
            const output = JSON.parse(stdout);
            return res.status(200).json({ message: 'Analysis complete.', output });
        } catch (parseError) {
            console.error('Error parsing Python output:', stdout);
            return res.status(500).json({
                error: 'Invalid JSON output from Python script.',
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
        return res.status(400).json({ error: 'Invalid input. Expected an array of text entries.' });
    }

    // Validate each entry
    for (let i = 0; i < inputData.length; i++) {
        const entry = inputData[i];
        if (typeof entry.text !== 'string' || entry.text.trim() === '') {
            return res.status(400).json({ error: `Entry ${i + 1} is missing a valid 'text' field.` });
        }
        if (entry.label && !['positive', 'neutral', 'negative'].includes(entry.label)) {
            return res.status(400).json({ error: `Invalid label at entry ${i + 1}. Must be 'positive', 'neutral', or 'negative'.` });
        }
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
                error: 'Python script execution failed.',
                stderr,
                code
            });
        }

        try {
            const parsed = JSON.parse(stdout);
            return res.status(200).json({ output: parsed });
        } catch (e) {
            console.error('JSON parse error:', e.message);
            return res.status(500).json({
                error: 'Failed to parse Python script output.',
                raw: stdout,
                message: e.message
            });
        }
    });

    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();
};

module.exports.defaultDatasets = (req, res) => {
    const datasetDir = path.join(__dirname, '..', 'datasets');

    if (!fs.existsSync(datasetDir)) {
        return res.status(400).json({ error: 'Dataset folder not found.' });
    }

    fs.readdir(datasetDir, (err, files) => {
        if (err) {
            console.error('Error reading datasets folder:', err);
            return res.status(500).json({ error: 'Failed to read datasets folder.' });
        }

        const csvFiles = files.filter(file => file.endsWith('.csv'));

        if (csvFiles.length === 0) {
            return res.status(404).json({ error: 'No CSV datasets found.' });
        }

        res.status(200).json({ datasets: csvFiles });
    });
};

// module.exports.sentimentMulti = (req, res) => {
//     const inputData = req.body.data;

//     if (!inputData || !Array.isArray(inputData)) {
//         return res.status(400).json({ error: 'Invalid input data. Expected an array of text entries.' });
//     }

//     const pythonScript = path.join(__dirname, '..', 'python_scripts', 'sentiment_analysis_multi.py');
//     const pythonProcess = spawn('python', [pythonScript]);

//     let stdout = '';
//     let stderr = '';

//     pythonProcess.stdout.on('data', (data) => {
//         stdout += data.toString();
//     });

//     pythonProcess.stderr.on('data', (data) => {
//         stderr += data.toString();
//     });

//     pythonProcess.on('close', (code) => {
//         if (code !== 0 || stderr) {
//             console.error('Python stderr:', stderr);
//             return res.status(500).json({
//                 error: 'Python script execution failed',
//                 stderr,
//                 code
//             });
//         }

//         try {
//             const parsed = JSON.parse(stdout);
//             return res.json({ output: parsed });
//         } catch (e) {
//             return res.status(500).json({
//                 error: 'Error parsing Python output',
//                 raw: stdout,
//                 message: e.message
//             });
//         }
//     });

//     // Send the data to Python's stdin
//     pythonProcess.stdin.write(JSON.stringify(inputData));
//     pythonProcess.stdin.end();
// };

// module.exports.defaultDatasets = (req, res) => {
//     const datasetDir = path.join(__dirname, '..', 'datasets');

//     // Ensure the folder exists
//     if (!fs.existsSync(datasetDir)) {
//         return res.status(400).json({ error: 'Dataset folder not found' });
//     }

//     fs.readdir(datasetDir, (err, files) => {
//         if (err) {
//             console.error('Failed to read datasets:', err);
//             return res.status(500).json({ error: 'Failed to read dataset folder' });
//         }

//         const csvFiles = files.filter(file => file.endsWith('.csv'));
//         res.json({ datasets: csvFiles });
//     });
// }

module.exports.runTopicModeling = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const numTopics = req.body.numTopics || 5;
    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'topic_modeling.py');

    const pythonCommand = findPythonPath();

    const command = `"${pythonCommand}" "${pythonScript}" "${filePath}" "${numTopics}"`;

    exec(command, (error, stdout, stderr) => {
        console.error('[SERVER] STDERR:', stderr);
        if (error) console.error('[SERVER] ERROR:', error.message);

        if (error) {
            return res.status(500).json({
                error: 'Python script execution failed',
                detail: stderr || error.message,
            });
        }

        if (!stdout || stdout.trim() === '') {
            console.error('[PYTHON OUTPUT ERROR] No output from Python script:', stdout);
            return res.status(500).json({
                error: 'Python script returned empty output',
            });
        }

        try {
            const jsonRegex = /({[\s\S]*})/;
            const match = stdout.match(jsonRegex);
            if (!match) throw new Error("JSON not found in Python output");

            const output = JSON.parse(match[1]);
            return res.status(200).json({
                message: 'Topic modeling complete',
                output: output,
            });
        } catch (parseError) {
            console.error('[PYTHON OUTPUT PARSE ERROR]', stdout);
            return res.status(500).json({
                error: 'Invalid JSON output from Python script',
                raw: stdout,
            });
        }
    });
};

module.exports.getDefaultDatasets = (req, res) => {
    const datasetsDir = path.join(__dirname, '..', 'datasets');

    fs.readdir(datasetsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read datasets directory' });
        }

        const csvFiles = files.filter(file => file.endsWith('.csv'));
        return res.status(200).json({ datasets: csvFiles });
    });
};

module.exports.runTopicModelingDefault = (req, res) => {
    const { datasetName, numTopics = 5 } = req.body;

    if (!datasetName) {
        return res.status(400).json({ error: 'Dataset name is required' });
    }

    const datasetPath = path.join(__dirname, '..', 'datasets', datasetName);

    // Check if file exists
    if (!fs.existsSync(datasetPath)) {
        return res.status(404).json({ error: 'Dataset not found' });
    }

    const pythonScript = path.join(__dirname, '..', 'python_scripts', 'topic_modeling.py');
    const pythonCommand = findPythonPath();

    const command = `"${pythonCommand}" "${pythonScript}" "${datasetPath}" "${numTopics}"`;

    exec(command, (error, stdout, stderr) => {
        console.error('[SERVER] STDERR:', stderr);
        if (error) console.error('[SERVER] ERROR:', error.message);

        if (error) {
            return res.status(500).json({
                error: 'Python script execution failed',
                detail: stderr || error.message,
            });
        }

        if (!stdout || stdout.trim() === '') {
            return res.status(500).json({
                error: 'Python script returned empty output',
            });
        }

        try {
            const jsonRegex = /({[\s\S]*})/;
            const match = stdout.match(jsonRegex);
            if (!match) throw new Error("JSON not found in Python output");

            const output = JSON.parse(match[1]);
            return res.status(200).json({
                message: 'Topic modeling complete',
                output,
            });
        } catch (parseError) {
            return res.status(500).json({
                error: 'Invalid JSON output from Python script',
                raw: stdout,
            });
        }
    });
};