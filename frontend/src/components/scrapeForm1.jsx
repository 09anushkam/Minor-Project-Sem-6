import { useState } from 'react';
import axios from 'axios';

const ScrapeForm1 = () => {
    const [query, setQuery] = useState('');
    const [data, setData] = useState(null);

    const fetchData = async (platform) => {
        const response = await axios.get(`http://localhost:8080/api/scrape/${platform}?query=${query}`);
        setData(response.data);
        console.log("Res is: ", response.data);
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search query"
            />
            <button onClick={() => fetchData('twitter')}>Twitter</button>
            <button onClick={() => fetchData('youtube')}>YouTube</button>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

export default ScrapeForm1;
