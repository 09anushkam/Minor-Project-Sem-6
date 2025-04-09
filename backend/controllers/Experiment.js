const Experiment = require('../models/Experiment');

module.exports.experiment = async (req, res) => {
    try {
        console.log('Received request for experiment:', req.params.no);
        const experimentNo = parseInt(req.params.no, 10);
        
        if (isNaN(experimentNo)) {
            console.log('Invalid experiment number:', req.params.no);
            return res.status(400).json({ error: "Invalid experiment number" });
        }

        console.log('Looking for experiment number:', experimentNo);
        const experiment = await Experiment.findOne({ no: experimentNo });
        
        if (!experiment) {
            console.log('Experiment not found:', experimentNo);
            // Let's check what experiments exist in the database
            const allExperiments = await Experiment.find({}, { no: 1, title: 1 }).sort({ no: 1 });
            console.log('Available experiments:', allExperiments);
            return res.status(404).json({ 
                error: "Experiment not found",
                message: `No experiment found with number ${experimentNo}`,
                availableExperiments: allExperiments
            });
        }

        console.log('Found experiment:', experiment.title);
        res.json(experiment);
    } catch (error) {
        console.error("Error fetching experiment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
