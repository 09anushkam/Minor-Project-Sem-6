import { useState } from "react";
import axios from "axios";
import "./methods.css";

const BeautifulSoup = () => {
    const [url, setUrl] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/api/scrape", {
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
                    placeholder="Enter URL or Query"
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
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default BeautifulSoup;
