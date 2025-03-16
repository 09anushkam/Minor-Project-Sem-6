const { PythonShell } = require("python-shell");
const ScrapedData = require("../models/ScrapedData");
const path = require("path");

module.exports.scrapeData = async (req, res) => {
    const { method, url } = req.body;

    let script = "";
    switch (method) {
        case "BeautifulSoup":
            script = "scrape_bs4.py";
            break;
        case "Requests":
            script = "scrape_requests.py";
            break;
        case "API":
            script = "scrape_api.py";
            break;
        case "Scrapy":
            script = "scrape_scrapy.py";
            break;
        default:
            return res.status(400).json({ error: "Invalid method selected" });
    }

    const options = {
        mode: "text",
        pythonPath: "python3",
        scriptPath: path.join(__dirname, "../python_scripts"),
        args: [url],
    };

    PythonShell.run(script, options)
        .then((messages) => {
            if (!messages || messages.length === 0) {
                console.error("Empty response from Python script.");
                return res.status(500).json({ error: "No data returned from scraper" });
            }
            
            try {
                const parsedData = JSON.parse(messages.join("")); // Convert to JSON if needed
                console.log("DATA IS: ", parsedData);
                res.json({ message: "Scraping successful", data: parsedData });
            } catch (error) {
                console.error("JSON Parse Error:", error);
                res.status(500).json({ error: "Invalid JSON response from Python script" });
            }
        })
        .catch((err) => {
            console.error("Python Script Error:", err);
            res.status(500).json({ error: err.message });
        });
};
