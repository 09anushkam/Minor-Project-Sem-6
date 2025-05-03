import "./styles/Procedure.css";

const Procedure2 = () => {
    return (
        <div className="procedure-container">
            <h2 className="procedure-heading">Procedure for Data Extraction</h2>

            <div className="procedure-step">
                <h3>🔹 Choose Your Extraction Method</h3>
                <p>
                    Begin by selecting a platform or method from the available options: <em>BeautifulSoup</em>, <em>Requests</em>, <em>TwitterAPI</em>.
                    <br />
                    <strong>Coming Soon:</strong> <em>FacebookAPI</em>, <em>InstagramAPI</em>, <em>YouTubeAPI</em>, and <em>IEEEXplore</em> will be added in upcoming updates!
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Understand the Purpose of Each Method</h3>
                <ul>
                    <li><strong>BeautifulSoup:</strong> Scrapes HTML content from static web pages.</li>
                    <li><strong>Requests:</strong> Sends HTTP requests to fetch raw HTML data.</li>
                    <li><strong>TwitterAPI:</strong> Collects tweets using search keywords or hashtags.</li>
                    <li><strong>FacebookAPI:</strong> (Coming Soon) Fetches posts/comments from public pages or groups.</li>
                    <li><strong>InstagramAPI:</strong> (Coming Soon) Extracts media and captions from Instagram profiles.</li>
                    <li><strong>YouTubeAPI:</strong> (Coming Soon) Gathers video details and comments.</li>
                    <li><strong>IEEEXplore:</strong> (Coming Soon) Retrieves metadata like titles and abstracts from research papers.</li>
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

            <div className="procedure-step">
                <h3>🔹 How to Generate Your Twitter Bearer Token</h3>
                <p>
                    Follow these simple steps to create your own Bearer Token:
                </p>
                <ol>
                    <li><strong>Step 1:</strong> Go to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer">Twitter Developer Portal</a>.</li>
                    <li><strong>Step 2:</strong> Click on &quot;Sign up for Free Account&quot; to create a Developer account. (You may need to verify your email and phone number.)</li>
                    <li><strong>Step 3:</strong> Fill the Developer agreement & policy & Submit. In &quot;Intended Use&quot;, you can select options like &quot;Exploring APIs&quot; or &quot;Academic Research&quot;. Keep it simple and honest. <br /><b>Example: </b><i>&quot;I intend to use Twitter’s API for academic and research purposes. Specifically, I will collect publicly available tweets related to specific keywords or hashtags to perform sentiment analysis, topic modeling, and other data science experiments. The data will not be resold, redistributed, or used for any commercial purposes. It will only be used internally for learning, research, and educational demonstrations.&quot;</i></li>
                    <li><strong>Step 4:</strong> Once approved, go to your Twitter Developer Dashboard.</li>
                    <li><strong>Step 5:</strong> Click on &quot;Projects & Apps&quot; → &quot;Overview&quot;.</li>
                    <li><strong>Step 6:</strong> Under your default project (named something like &quot;Default project-191620393xxxxxxxxxx&quot;), click on the &quot;Keys and Tokens&quot; icon.</li>
                    <li><strong>Step 7:</strong> Click on &quot;Generate&quot; under &quot;Bearer Token&quot; to create your authentication token.</li>
                    <li><strong>Step 8:</strong> Copy the generated Bearer Token and store it securely for future use.</li>
                    <li><strong>Step 9:</strong> Use this Bearer Token in the extraction form provided on the website.</li>
                </ol>
                <p>
                    🔒 Your Bearer Token is sensitive — never share it publicly.
                </p>
            </div>

            <div className="note">
                <strong>Note:</strong> Make sure to adhere to platform terms of service, API rate limits, and privacy policies during data extraction.
            </div>
        </div>
    );
};

export default Procedure2;
