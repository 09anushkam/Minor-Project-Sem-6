import { useState } from 'react';
import axios from 'axios';
import './styles/Simulation3.css';

const Simulation3 = () => {
    const [inputType, setInputType] = useState('file'); // 'file' or 'text'
    const [file, setFile] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTextChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        if (inputType === 'file') {
            if (!file) {
                alert('Please upload a CSV file.');
                setLoading(false);
                return;
            }
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await axios.post('http://localhost:8080/api/experiments/sentiment-analysis', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                let parsedOutput;

                if (typeof res.data.output === 'string') {
                    parsedOutput = JSON.parse(res.data.output.replace(/'/g, '"')); // risky if nested quotes
                } else {
                    parsedOutput = res.data.output;
                }

                setOutput(parsedOutput);
            } catch (error) {
                console.error('Error during file analysis:', error);
            }
        } else {
            if (!textInput) {
                alert('Please enter some text.');
                setLoading(false);
                return;
            }
            try {
                const res = await axios.post('http://localhost:8080/api/experiments/sentiment-analysis/text', { text: textInput });
                setOutput(res.data.output);
            } catch (error) {
                console.error('Error during text analysis:', error);
            }
        }
        setLoading(false);
    };

    return (
        <div className="simulation3-container">
            <h2>Experiment 3: Sentiment Analysis</h2>
            <div className="input-type-toggle">
                <label>
                    <input
                        type="radio"
                        name="inputType"
                        value="file"
                        checked={inputType === 'file'}
                        onChange={() => setInputType('file')}
                    />
                    Upload CSV File
                </label>
                <label>
                    <input
                        type="radio"
                        name="inputType"
                        value="text"
                        checked={inputType === 'text'}
                        onChange={() => setInputType('text')}
                    />
                    Enter Text Manually
                </label>
            </div>

            {inputType === 'file' ? (
                <div className="upload-section">
                    <input type="file" accept=".csv" onChange={handleFileChange} />
                </div>
            ) : (
                <div className="text-input-section">
                    <textarea
                        rows="4"
                        cols="50"
                        placeholder="Enter text for sentiment analysis..."
                        value={textInput}
                        onChange={handleTextChange}
                    />
                </div>
            )}

            <button onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            {output && (
                <div className="result-section">
                    {output.metrics ? (
                        <>
                            <h3>Evaluation Metrics:</h3>
                            <ul>
                                <li>Accuracy: {output.metrics.accuracy}</li>
                                <li>Precision: {output.metrics.precision}</li>
                                <li>Recall: {output.metrics.recall}</li>
                                <li>F1 Score: {output.metrics.f1}</li>
                            </ul>
                        </>
                    ) : (
                        <div>
                            <h3>Sentiment:</h3>
                            <p>{output.sentiment}</p>
                        </div>
                    )}
                    {output.output_csv && (
                        <>
                            <h3>Output CSV:</h3>
                            <p>{output.output_csv}</p>
                            <a href={`http://localhost:8080/${output.output_csv}`} download>
                                Download Result CSV
                            </a>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Simulation3;
