import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const ScrapeForm = ({ setResults }) => {
    const [method, setMethod] = useState("");
    const [url, setUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8080/api/scrape", { method, url });
        console.log("Res is: ", response.data.data); //
        setResults(response.data.data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter URL or Query" value={url} onChange={(e) => setUrl(e.target.value)} required />
            <select value={method} onChange={(e) => setMethod(e.target.value)} required>
                <option value="">Select Method</option>
                <option value="BeautifulSoup">BeautifulSoup</option>
                <option value="Requests">Requests</option>
                <option value="API">API</option>
                <option value="Scrapy">Scrapy</option>
            </select>
            <button type="submit">Scrape</button>
        </form>
    );
};

ScrapeForm.propTypes = {
    setResults: PropTypes.func.isRequired,
};

export default ScrapeForm;
