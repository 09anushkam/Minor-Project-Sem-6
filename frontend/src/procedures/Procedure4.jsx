import './styles/Procedure.css';

const Procedure4 = () => {
    return (
        <div className="procedure-container">
            <h2 className="procedure-heading">Procedure for Topic Modeling Simulation</h2>

            <div className="procedure-step">
                <h3>Step 1: Choose Input Mode</h3>
                <p>You can begin by selecting one of the two modes:</p>
                <ul>
                    <li><strong>Upload Custom CSV:</strong> Upload your own dataset in CSV format.</li>
                    <li><strong>Select Default Dataset:</strong> Use one of the preloaded datasets provided by the system.</li>
                </ul>
            </div>

            <div className="procedure-step">
                <h3>Step 2: Set Number of Topics</h3>
                <p>Enter the number of topics you want the model to generate. This value controls how the algorithm clusters words and documents into distinct topics.</p>
            </div>

            <div className="procedure-step">
                <h3>Step 3: Submit and Run</h3>
                <p>Once your file is uploaded or a dataset is selected, click the &quot;Run Topic Modeling&quot; button to process the input data.</p>
            </div>

            <div className="procedure-step">
                <h3>Step 4: View Results</h3>
                <p>After processing, you will be able to see:</p>
                <ol>
                    <li><strong>Identified Topics:</strong> Each topic with its keywords displayed in a word cloud and bar chart.</li>
                    <li><strong>Sample Documents:</strong> Example sentences or texts associated with each topic.</li>
                    <li><strong>Topic Distribution:</strong> A pie chart showing how topics are distributed across the dataset.</li>
                </ol>
            </div>

            <div className="note">
                Note: Ensure your CSV file is clean and properly formatted before uploading. Missing headers or unsupported characters may result in processing errors.
            </div>
        </div>
    );
};

export default Procedure4;
