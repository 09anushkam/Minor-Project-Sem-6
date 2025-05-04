import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Simulation2.css";

const TwitterAPI = () => {
    const [query, setQuery] = useState("");
    const [token, setToken] = useState("");
    const [data, setData] = useState([]);
    const [storedData, setStoredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [storedPage, setStoredPage] = useState(1);
    const tweetsPerPage = 10;

    useEffect(() => {
        const fetchStoredData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/scrape/twitter-stored`);
                const flattenedTweets = response.data.flatMap((batch) =>
                    batch.tweets.map((tweet) => ({
                        id: tweet.id,
                        text: tweet.text,
                        username: tweet.username,
                        created_at: tweet.created_at,
                        query: batch.query
                    }))
                );
                setStoredData(flattenedTweets);
            } catch (err) {
                console.error("Error fetching stored data:", err);
            }
        };

        fetchStoredData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!query.trim()) {
            setError("Please enter a valid search query.");
            setLoading(false);
            return;
        }

        if (token.length < 20) {
            setError("Invalid token. Please enter a valid Twitter Bearer Token.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/scrape/twitter`, {
                query,
                bearerToken: token,
            });
            setData(response.data.data);
            setPage(1);  // Reset page
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Failed to fetch Twitter data.");
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));
    const handleNextStoredPage = () => setStoredPage((prev) => prev + 1);
    const handlePrevStoredPage = () => setStoredPage((prev) => (prev > 1 ? prev - 1 : 1));

    const paginate = (items, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const currentData = paginate(data, page, tweetsPerPage);
    const currentStoredData = paginate(storedData, storedPage, tweetsPerPage);

    const hasMoreData = (page * tweetsPerPage) < data.length;
    const hasMoreStoredData = (storedPage * tweetsPerPage) < storedData.length;

    return (
        <div className="scrape-container">
            <h2>Twitter API Data Extraction</h2>

            <p className="token-warning">
                <b>Please note:</b> Twitter API allows only <strong>1 request every 15 minutes per user</strong> & <strong>10 requests per month</strong> under free access.
                <br />
                A complete guide for creating your token is provided in the <strong>Procedure</strong> section to help you get started easily.
                <br />
                Your token is only used locally and is not stored anywhere.
            </p>

            <form onSubmit={handleSubmit} className="scrape-form">
                <input
                    type="text"
                    placeholder="Enter any search query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Enter your Twitter Bearer Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Fetching..." : "Fetch Twitter Data"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            {currentData.length > 0 && (
                <div className="results">
                    <h3>Newly Extracted Data:</h3>
                    <ul>
                        {currentData.map((tweet) => (
                            <li key={tweet.id}>
                                <p><strong>ID:</strong> {tweet.id}</p>
                                <p><strong>Text:</strong> {tweet.text}</p>
                                <p><strong>Created At:</strong> {new Date(tweet.created_at).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="pagination-buttons">
                        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                        <button onClick={handleNextPage} disabled={!hasMoreData}>Next</button>
                    </div>
                </div>
            )}

            {currentStoredData.length > 0 && (
                <div className="results">
                    <h3>Previously Extracted Data:</h3>
                    <ul>
                        {currentStoredData.map((tweet) => (
                            <li key={tweet.id}>
                                <p><strong>ID:</strong> {tweet.id}</p>
                                <p><strong>Text:</strong> {tweet.text}</p>
                                <p><strong>Username:</strong> {tweet.username}</p>
                                <p><strong>Query:</strong> {tweet.query}</p>
                                <p><strong>Extracted At:</strong> {new Date(tweet.created_at).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="pagination-buttons">
                        <button onClick={handlePrevStoredPage} disabled={storedPage === 1}>Previous</button>
                        <button onClick={handleNextStoredPage} disabled={!hasMoreStoredData}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TwitterAPI;
