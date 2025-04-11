import "./styles/Procedure.css";

const Procedure3 = () => {
    return (
        <div className="procedure-container">
            <h2 className="procedure-heading">Procedure for Sentiment Analysis</h2>

            <div className="procedure-step">
                <h3>🔹 Select Input Method</h3>
                <p>
                    Choose between two input modes:
                    <ul>
                        <li><strong>Upload CSV File:</strong> A file containing multiple text entries.</li>
                        <li><strong>Enter Text Manually:</strong> Type or paste text line-by-line, optionally adding a label using <code>|</code>.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Provide Input Data</h3>
                <p>
                    Depending on your selection:
                    <ul>
                        <li><strong>For CSV:</strong> Upload a file with a column of text data.</li>
                        <li><strong>For Text:</strong> Write each sentence on a new line. You may add a label like: <code>I love this! | positive</code>.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Start the Analysis</h3>
                <p>
                    Click the <strong>&quot;Analyze&quot;</strong> button to send the input for processing. The system will clean the text, apply the model, and return sentiment results.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 View Prediction Results</h3>
                <p>
                    The predicted sentiment for each text will be displayed in a table. Each entry shows the original text and its corresponding sentiment label (positive, neutral, negative).
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Explore Visualizations</h3>
                <ul>
                    <li><strong>Bar Chart:</strong> Shows count of each sentiment class.</li>
                    <li><strong>Pie Chart:</strong> Displays sentiment proportions.</li>
                    <li><strong>Line Chart:</strong> Visualizes sentiment progression over time.</li>
                    <li><strong>Word Cloud:</strong> Highlights frequently used words in the dataset.</li>
                </ul>
            </div>

            <div className="procedure-step">
                <h3>🔹 Analyze Evaluation Metrics</h3>
                <p>
                    If labeled data is present, metrics like Accuracy, Precision, Recall, and F1 Score will be shown along with a Confusion Matrix to evaluate model performance.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Download Results</h3>
                <p>
                    A downloadable CSV file is generated containing the text, predicted sentiments, and other metadata. Click the link to save it for further use.
                </p>
            </div>

            <div className="note">
                <strong>Note:</strong> Ensure that the text is clean and well-structured for more accurate predictions. Always validate input formats before analysis.
            </div>
        </div>
    );
};

export default Procedure3;
