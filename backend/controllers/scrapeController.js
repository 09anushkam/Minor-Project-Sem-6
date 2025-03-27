const { PythonShell } = require("python-shell");
const ScrapedData = require("../models/ScrapedData");
const path = require("path");
const TwitterData = require("../models/TwitterData");

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
                // console.log("DATA IS: ", parsedData);
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

module.exports.getTwitterData = async (req, res) => {
    const { query } = req.query;
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;

    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=created_at,author_id`;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    };

    try {
        // Check if the query already exists in the database
        const existingData = await TwitterData.findOne({ query });

        if (existingData) {
            console.log(`Data for "${query}" already exists. Skipping storage.`);
            return res.json({
                message: `Data for "${query}" already exists.`,
                data: existingData.tweets
            });
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        const tweets = data.data.map((tweet) => ({
            id: tweet.id,
            text: tweet.text,
            username: tweet.author_id,  // Twitter API v2 does not return the username directly
            created_at: tweet.created_at,
        }));

        // Save the new data only if it doesn't already exist
        const newTwitterData = new TwitterData({ query, tweets });
        await newTwitterData.save();

        res.json({ message: "Data saved successfully!", data: tweets });

    } catch (error) {
        console.error("Error fetching Twitter data:", error);
        res.status(500).send(error.message);
    }
};

module.exports.getStoredTwitterData = async (req, res) => {
    try {
        const data = await TwitterData.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
