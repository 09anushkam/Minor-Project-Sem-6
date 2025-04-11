import "./styles/Procedure.css";

const Procedure7 = () => {
    return (
        <div className="procedure-container">
            <h2 className="procedure-heading">Procedure for TF-IDF Simulation</h2>

            <div className="procedure-step">
                <h3>🔹 Choose Input Method</h3>
                <p>
                    Select one of the three options:
                    <ul>
                        <li>
                            <strong>Enter Posts Manually:</strong> Click “Enter Posts Manually” and type each post on a new line.
                        </li>
                        <li>
                            <strong>Upload CSV File:</strong> Click “Upload CSV File” and select a CSV where each row contains a post.
                        </li>
                        <li>
                            <strong>Use Preloaded Posts:</strong> Click “Use Preloaded Posts” to load example posts.
                        </li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Provide or Confirm Your Data</h3>
                <p>
                    Depending on your choice:
                    <ul>
                        <li>For manual entry, ensure the textarea has at least one line of text.</li>
                        <li>For CSV upload, wait for PapaParse to display the parsed rows.</li>
                        <li>For preloaded posts, verify the sample posts appear.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Proceed to Analysis</h3>
                <p>
                    Click the <strong>Proceed to Analysis</strong> button. The app will tokenize text, compute TF and IDF, and build the TF-IDF matrix.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 View and Switch Visualizations</h3>
                <p>
                    After processing, use the four tabs:
                    <ul>
                        <li><strong>Table View:</strong> Document–term TF-IDF scores.</li>
                        <li><strong>Bar Chart:</strong> Top 10 terms by frequency and TF-IDF score.</li>
                        <li><strong>Heatmap:</strong> Grid of document vs. term scores.</li>
                        <li><strong>Summary:</strong> Overall stats and top 5 term chips.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Interpret Results</h3>
                <p>
                    Use these insights:
                    <ul>
                        <li>High TF-IDF means a term is frequent in one document but rare across others.</li>
                        <li>Heatmap intensity shows relative importance per document.</li>
                        <li>Summary cards give a quick corpus overview.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Export or Record Findings</h3>
                <p>
                    Copy the table, take a screenshot, or extend the code to export processed data for reports.
                </p>
            </div>

            <div className="note">
                <strong>Note:</strong> Make sure your input has no empty lines for accurate TF-IDF. CSV rows must each contain non‑empty text.
            </div>
        </div>
    );
};

export default Procedure7;
