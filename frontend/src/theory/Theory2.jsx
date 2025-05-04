import './styles/Theory.css';

export default function Theory2() {
    return (
        <section className="theory-container">
            <h1 className="theory-title">Data Acquisition</h1>

            <div className="section">
                <h2>What is Data Acquisition?</h2>
                <p>
                    Data acquisition is the process of collecting raw data from various sources and converting it into a structured format suitable for analysis.
                    This step lays the foundation for any data-driven project, including those in machine learning, sentiment analysis, and big data analytics.
                </p>
            </div>

            <div className="section">
                <h2>Sources of Data Acquisition</h2>
                <ul className="list-disc">
                    <li><strong>Web Scraping:</strong> Extracting data directly from web pages using HTML parsers like Beautiful Soup or frameworks like Scrapy.</li>
                    <li><strong>APIs:</strong> Structured interfaces provided by platforms (e.g., Twitter, Reddit) to programmatically fetch real-time or historical data.</li>
                    <li><strong>Files:</strong> Reading data stored in local files such as CSV, Excel, or JSON formats.</li>
                    <li><strong>Databases:</strong> Extracting data from SQL (e.g., MySQL, PostgreSQL) or NoSQL (e.g., MongoDB) databases.</li>
                </ul>
            </div>

            <div className="section">
                <h2>Tools &amp; Techniques for Data Acquisition</h2>
                <dl>
                    <dt>1. Beautiful Soup</dt>
                    <dd><b>Use Case:</b> Ideal for beginners and small‑scale web scraping.</dd>
                    <dd><b>Description:</b> A Python library used to parse HTML/XML documents.</dd>
                    <dd><b>Working: </b></dd>
                    <ul className="list-disc">
                        <li>Use the <em>requests</em> library to fetch the web page.</li>
                        <li>Use BeautifulSoup to parse and extract the required data using tags, classes, or IDs.</li>
                    </ul>
                    <dd><b>Pros:</b> Simple and easy to use; works well with static pages.</dd>
                    <dd><b>Limitations:</b> Not suitable for dynamic or JS‑rendered sites.</dd>

                    <dt>2. Requests Library</dt>
                    <dd><b>Use Case:</b> Fetching web content or API responses.</dd>
                    <dd><b>Description:</b> Python library to send HTTP requests and receive content (HTML/JSON).</dd>
                    <dd><b>Working:</b></dd>
                    <ul className="list-disc">
                        <li>Send GET/POST requests to the target URL.</li>
                        <li>Combine with BeautifulSoup or JSON parser to extract data.</li>
                    </ul>
                    <dd><b>Pros:</b> Lightweight and straightforward.</dd>
                    <dd><b>Limitations:</b> Requires additional parsing tools.</dd>

                    <dt>3. APIs</dt>
                    <dd><b>Use Case:</b> Preferred for structured, authorized data collection.</dd>
                    <dd><b>Description:</b> Official interfaces by platforms like Twitter, Reddit.</dd>
                    <dd><b>Working:</b></dd>
                    <ul className="list-disc">
                        <li>Register and obtain API keys.</li>
                        <li>Send HTTP requests with parameters and headers.</li>
                        <li>Receive structured JSON/XML responses.</li>
                    </ul>
                    <dd><b>Pros:</b> Reliable, legal, real‑time/historical data.</dd>
                    <dd><b>Limitations:</b> Rate limits, auth requirements, potential restrictions.</dd>

                    <dt>4. Scrapy Tool</dt>
                    <dd><b>Use Case:</b> Best for large‑scale and complex scraping projects.</dd>
                    <dd><b>Description:</b> Powerful Python framework for web crawlers.</dd>
                    <dd><b>Working:</b></dd>
                    <ul className="list-disc">
                        <li>Define spiders with custom crawling logic.</li>
                        <li>Use CSS/XPath selectors to extract data.</li>
                    </ul>
                    <dd><b>Pros:</b> Fast, scalable, built‑in exports.</dd>
                    <dd><b>Limitations:</b> Steeper learning curve and setup.</dd>
                </dl>
            </div>

            <div className="section">
                <h2>Theory Summary</h2>
                <div className="table-wrapper">
                    <table className="theory-table">
                        <thead>
                            <tr>
                                <th>Tool/Technique</th>
                                <th>Best Use Case</th>
                                <th>Data Format</th>
                                <th>Skill Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Beautiful Soup</td>
                                <td>Simple HTML scraping</td>
                                <td>HTML</td>
                                <td>Beginner</td>
                            </tr>
                            <tr>
                                <td>Requests</td>
                                <td>Fetching HTML/API content</td>
                                <td>HTML/JSON</td>
                                <td>Beginner</td>
                            </tr>
                            <tr>
                                <td>API</td>
                                <td>Real-time, structured, and reliable data</td>
                                <td>JSON/XML</td>
                                <td>Intermediate</td>
                            </tr>
                            <tr>
                                <td>Scrapy</td>
                                <td>Large-scale and fast web scraping</td>
                                <td>HTML</td>
                                <td>Advanced</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="section">
                <h2>Procedure</h2>
                <ol className="list-decimal">
                    <li className="procedure-step">Choose Data Source: web page, API, or file.</li>
                    <li className="procedure-step">Collect Data:
                        <ul className="list-disc">
                            <li>Web scraping: requests + BeautifulSoup or Scrapy.</li>
                            <li>API calls: requests, Postman, or Python clients (e.g., Tweepy).</li>
                            <li>Files: pandas, csv, or json libraries.</li>
                        </ul>
                    </li>
                    <li className="procedure-step">Clean &amp; Preprocess: remove nulls/duplicates, handle inconsistencies.</li>
                    <li className="procedure-step">Store Data: save cleaned data in CSV, JSON, or database.</li>
                </ol>
            </div>

            <div className="section final-thoughts">
                <h2>Final Thoughts</h2>
                <p>
                    Beautiful Soup for simple, small‑scale tasks.<br />
                    Requests as the core fetch tool.<br />
                    APIs for structured, legal access.<br />
                    Scrapy when you need speed & scale.
                </p>
            </div>
        </section>
    );
}
