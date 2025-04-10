import "./styles/Procedure.css";

const Procedure2 = () => {
    return (
        <div className="procedure-container">
            <h2 className="procedure-heading">Procedure for Data Extraction</h2>

            <div className="procedure-step">
                <h3>🔹 Choose Your Extraction Method</h3>
                <p>
                    Begin by selecting a platform or method from the available options: <em>BeautifulSoup</em>, <em>Requests</em>, <em>TwitterAPI</em>, <em>FacebookAPI</em>, <em>InstagramAPI</em>, <em>YouTubeAPI</em>, or <em>IEEEXplore</em>. Each corresponds to a different online source.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Understand the Purpose of Each Method</h3>
                <ul>
                    <li><strong>BeautifulSoup:</strong> Scrapes HTML content from static web pages.</li>
                    <li><strong>Requests:</strong> Sends HTTP requests to fetch raw HTML data.</li>
                    <li><strong>TwitterAPI:</strong> Collects tweets using search keywords or hashtags.</li>
                    <li><strong>FacebookAPI:</strong> Fetches posts/comments from public pages or groups.</li>
                    <li><strong>InstagramAPI:</strong> Extracts media and captions from Instagram profiles.</li>
                    <li><strong>YouTubeAPI:</strong> Gathers video details and comments.</li>
                    <li><strong>IEEEXplore:</strong> Retrieves metadata like titles and abstracts from research papers.</li>
                </ul>
            </div>

            <div className="procedure-step">
                <h3>🔹 Select a Method</h3>
                <p>
                    Click on any of the buttons to choose the desired method. This will open a corresponding interface where you can enter specific parameters.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Provide Required Inputs</h3>
                <p>
                    Enter the necessary information based on the selected method:
                </p>
                <ul>
                    <li>For APIs – enter API keys or authentication tokens.</li>
                    <li>For scraping – enter the URL or keyword to target.</li>
                </ul>
            </div>

            <div className="procedure-step">
                <h3>🔹 Trigger the Extraction</h3>
                <p>
                    Click the “Extract” or relevant action button. The backend script will begin retrieving data using the specified method and parameters.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 View Results</h3>
                <p>
                    Once extracted, the data will be displayed in a structured format (e.g., table or cards), showing relevant information like titles, comments, or post content.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Save or Export the Data</h3>
                <p>
                    The collected data can be stored in CSV format. You may use this data in subsequent experiments such as Sentiment Analysis or Topic Modeling.
                </p>
            </div>

            <div className="note">
                <strong>Note:</strong> Make sure to adhere to platform terms of service, API rate limits, and privacy policies during data extraction.
            </div>
        </div>
    );
};

export default Procedure2;
