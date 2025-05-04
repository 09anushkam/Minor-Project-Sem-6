import { useState } from "react";
import axios from "axios";
import "./methods.css";

const BeautifulSoup = () => {
    const [url, setUrl] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (err) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!isValidUrl(url)) {
            setError("Please enter a valid URL (starting with http/https).");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/scrape`, {
                method: "BeautifulSoup",
                url,
            });

            setResults(response.data.data);
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scrape-container">
            <h2>BeautifulSoup Scraping</h2>
            <form onSubmit={handleSubmit} className="scrape-form">
                <input
                    type="text"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Scraping..." : "Scrape"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            {results && (
                <div className="results">
                    <h3>Results:</h3>
                    <p className="json-note"><strong>Note: </strong>The results are currently displayed in JSON format. A more user-friendly format will be introduced in upcoming updates.</p>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default BeautifulSoup;
