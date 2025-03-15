const Experiment = require('../models/Experiment');

module.exports.experiment = async (req, res) => {
    try {
        const experiment = await Experiment.findOne( {no: req.params.no} );
        if (!experiment) {
            return res.status(404).json({ error: "Experiment not found" });
        }
        res.json(experiment);
    } catch (error) {
        console.error("Error fetching experiment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
