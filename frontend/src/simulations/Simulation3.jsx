import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { removeStopwords } from 'stopword';
import WordCloudVisx from '../components/WordCloudVisx';
import './styles/Simulation3.css';

const COLORS = ['#00C49F', '#FFBB28', '#FF5E5E']; // positive, neutral, negative

const Simulation3 = () => {
    const [inputType, setInputType] = useState('file');
    const [file, setFile] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [wordData, setWordData] = useState([]);
    const [csvTextEntries, setCsvTextEntries] = useState([]);
    const [availableDatasets, setAvailableDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState('');

    const isInputValid = () => {
        if (inputType === 'file') return !!file;
        if (inputType === 'text') return textInput.trim().length > 0;
        if (inputType === 'dataset') return !!selectedDataset;
        return false;
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/experiments/default-datasets`)
            .then(res => setAvailableDatasets(res.data.datasets))
            .catch(err => console.error("Failed to fetch datasets:", err));
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const maxSize = 2 * 1024 * 1024;

            if (!selectedFile.name.endsWith('.csv')) {
                alert('Only CSV files are supported.');
                return;
            }

            if (selectedFile.size > maxSize) {
                alert('File size should be less than 2 MB.');
                return;
            }

            setFile(selectedFile);
        }
    };
    const handleTextChange = (e) => setTextInput(e.target.value);

    const handleAnalyze = async () => {
        setLoading(true);
        setOutput(null);
        setCsvTextEntries([]);

        if (inputType === 'file') {
            if (!file) {
                alert('Please upload a CSV file.');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/experiments/sentiment-analysis`, formData);
                const parsedOutput = typeof res.data.output === 'string'
                    ? JSON.parse(res.data.output.replace(/'/g, '"'))
                    : res.data.output;

                setOutput(parsedOutput);
                generateWordCloudsBySentiment(parsedOutput.cleaned_texts, parsedOutput.sentiments);

                // Combine text and prediction for display
                const textList = parsedOutput.cleaned_texts || [];
                const predictedList = parsedOutput.sentiments || [];
                const combined = textList.map((text, index) => ({
                    text,
                    sentiment: predictedList[index] || 'unknown'
                }));
                setCsvTextEntries(combined);

            } catch (error) {
                console.error('Error during file analysis:', error);
                const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Something went wrong.';
                alert(`File Analysis Failed: ${errorMessage}`);
            }
        } else if (inputType === 'dataset') {
            if (!selectedDataset) {
                alert('Please select a dataset.');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/experiments/sentiment-analysis`, {
                    datasetName: selectedDataset
                });

                const parsedOutput = typeof res.data.output === 'string'
                    ? JSON.parse(res.data.output.replace(/'/g, '"'))
                    : res.data.output;

                setOutput(parsedOutput);
                generateWordCloudsBySentiment(parsedOutput.cleaned_texts, parsedOutput.sentiments);

                const combined = parsedOutput.cleaned_texts.map((text, index) => ({
                    text,
                    sentiment: parsedOutput.sentiments[index] || 'unknown'
                }));
                setCsvTextEntries(combined);
            } catch (error) {
                console.error('Error analyzing dataset:', error);
            }

            setLoading(false);
            return;
        } else {
            // Example of how to format the text input
            if (!textInput) {
                setTextInput("This product is amazing! | positive\nThe service was terrible. | negative\nIt was okay, nothing special. | neutral");
                setLoading(false);
                return;
            }

            const lines = textInput.split('\n').filter(Boolean);
            const payload = lines.map(line => {
                const [text, label = ''] = line.split('|').map(item => item.trim());
                // Validate the label
                const validLabel = ['positive', 'negative', 'neutral'].includes(label) ? label : null;
                return { text, label: validLabel };
            });

            // Validate that we have at least one valid text entry
            if (payload.length === 0 || !payload.every(item => item.text)) {
                alert('Please enter at least one valid text entry.');
                setLoading(false);
                return;
            }

            try {
                console.log('Sending payload:', payload); // Debug log
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/experiments/sentiment-analysis/text-multi`, { data: payload });
                setOutput(res.data.output);
                const allText = payload.map(p => p.text);
                const sentiments = res.data.output.sentiments || [];
                generateWordCloudsBySentiment(allText, sentiments);
            } catch (error) {
                console.error('Error during text analysis:', error);
                const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message;
                alert(`Error analyzing text: ${errorMessage}`);
            }
        }

        setLoading(false);
    };

    const sentimentCountData = output?.sentiments
        ? ['positive', 'neutral', 'negative'].map((sentiment) => ({
            name: sentiment,
            count: output.sentiments.filter((s) => s === sentiment).length,
        }))
        : [];

    const sentimentTrendData = output?.sentiments
        ? output.sentiments.map((s, i) => ({
            index: i + 1,
            sentiment: s === 'positive' ? 1 : s === 'neutral' ? 0 : -1,
        }))
        : [];

    const generateWordCloudsBySentiment = (texts, sentiments) => {
        const categories = {
            positive: [],
            neutral: [],
            negative: []
        };

        texts.forEach((text, i) => {
            const sentiment = sentiments[i];
            if (categories[sentiment]) {
                categories[sentiment].push(text);
            }
        });

        const cloudify = (textArray) => {
            const allWords = textArray.join(' ').toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
            const filtered = removeStopwords(allWords);
            const freq = {};
            filtered.forEach(word => {
                freq[word] = (freq[word] || 0) + 1;
            });
            return Object.entries(freq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 100)
                .map(([text, value]) => ({ text, value }));
        };

        setWordData({
            positive: cloudify(categories.positive),
            neutral: cloudify(categories.neutral),
            negative: cloudify(categories.negative)
        });
    };

    return (
        <div className="simulation3-container">
            <h2 className="heading">🧪 Sentiment Analysis</h2>

            <div className="input-toggle">
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
                <label>
                    <input
                        type="radio"
                        name="inputType"
                        value="dataset"
                        checked={inputType === 'dataset'}
                        onChange={() => setInputType('dataset')}
                    />
                    Use Default Dataset
                </label>
            </div>

            {inputType === 'dataset' && (
                <select
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    className="dataset-dropdown"
                >
                    <option value="">-- Select a dataset --</option>
                    {availableDatasets.map((file, idx) => (
                        <option key={idx} value={file}>{file}</option>
                    ))}
                </select>
            )}

            {inputType === 'file' && (
                <div className="file-upload-section">
                    <p className="file-info-text">
                        <strong>Note:</strong> The uploaded CSV must contain a <code>&quot;text&quot;</code> column. A <code>&quot;label&quot;</code> column is optional. Column names are <strong>case-sensitive</strong>.
                    </p>
                    <input type="file" accept=".csv" onChange={handleFileChange} className="file-input" />
                </div>
            )}

            {inputType === 'text' && (
                <textarea
                    rows="6"
                    cols="80"
                    placeholder='Enter one sentence per line. Optionally add label after "|" (e.g., "Great! | positive")'
                    value={textInput}
                    onChange={handleTextChange}
                    className="text-input"
                />
            )}

            <button onClick={handleAnalyze} disabled={loading || !isInputValid()} className="analyze-button">
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            {output && (
                <div className="result-section">
                    {output.metrics && (
                        <>
                            <h3 className="subheading">📊 Evaluation Metrics:</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li>Accuracy: {output.metrics.accuracy?.toFixed(2)}</li>
                                <li>Precision: {output.metrics.precision?.toFixed(2)}</li>
                                <li>Recall: {output.metrics.recall?.toFixed(2)}</li>
                                <li>F1 Score: {output.metrics.f1?.toFixed(2)}</li>
                            </ul>
                        </>
                    )}

                    {output.metrics?.confusion_matrix && (
                        <div className="confusion-matrix-section">
                            <h3 className="subheading">📊 Confusion Matrix</h3>
                            <div className="table-wrapper">
                                <table className="confusion-matrix-table">
                                    <thead>
                                        <tr>
                                            <th>Actual \ Predicted</th>
                                            <th>Positive</th>
                                            <th>Neutral</th>
                                            <th>Negative</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['positive', 'neutral', 'negative'].map((actual, rowIdx) => (
                                            <tr key={rowIdx}>
                                                <td><strong>{actual}</strong></td>
                                                {['positive', 'neutral', 'negative'].map((predicted, colIdx) => (
                                                    <td key={colIdx}>
                                                        {output.metrics.confusion_matrix[actual]?.[predicted] ?? 0}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="explanation-metrics">
                        <h3 className="subheading">📘 How Metrics Are Calculated</h3>
                        <ul>
                            <li><strong>Accuracy:</strong> (Correct predictions) / (Total predictions)</li>
                            <li><strong>Precision:</strong> TP / (TP + FP) for each class, then averaged</li>
                            <li><strong>Recall:</strong> TP / (TP + FN) for each class, then averaged</li>
                            <li><strong>F1 Score:</strong> 2 * (Precision * Recall) / (Precision + Recall)</li>
                        </ul>
                    </div>

                    {(inputType === 'text' || csvTextEntries.length > 0) && (
                        <div className="text-sentiments">
                            <h3 className="subheading">📋 Prediction Table</h3>
                            <div className="table-wrapper">
                                <table className="sentiment-table">
                                    <thead>
                                        <tr>
                                            <th>Text</th>
                                            <th>Predicted Sentiment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(inputType === 'text'
                                            ? textInput.split('\n').filter(Boolean).map((line, idx) => ({
                                                text: line.split('|')[0].trim(),
                                                sentiment: output.sentiments[idx]
                                            }))
                                            : csvTextEntries
                                        ).map((entry, idx) => (
                                            <tr key={idx}>
                                                <td>{entry.text}</td>
                                                <td className={`sentiment-${entry.sentiment}`}>{entry.sentiment}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="chart-section">
                        <h3 className="subheading">📈 Sentiment Bar Chart</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={sentimentCountData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-section">
                        <h3 className="subheading">🧁 Sentiment Proportion (Pie)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={sentimentCountData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {sentimentCountData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-section">
                        <h3 className="subheading">📉 Sentiment Trend (Line)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={sentimentTrendData.slice(0, 1000)} // limit for clarity
                                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                            >
                                <XAxis dataKey="index" hide />
                                <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sentiment"
                                    stroke="#82ca9d"
                                    dot={false}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {wordData && (
                        <div className="chart-section wordcloud-section">
                            <h3 className="subheading">☁️ Word Clouds by Sentiment</h3>
                            <div className="wordcloud-grid">
                                <div>
                                    <h4>😊 Positive</h4>
                                    <WordCloudVisx words={wordData.positive} />
                                </div>
                                <div>
                                    <h4>😐 Neutral</h4>
                                    <WordCloudVisx words={wordData.neutral} />
                                </div>
                                <div>
                                    <h4>😠 Negative</h4>
                                    <WordCloudVisx words={wordData.negative} />
                                </div>
                            </div>
                        </div>
                    )}

                    {output.output_csv && (
                        <div className="csv-section">
                            <h3 className="subheading">📁 Output CSV:</h3>
                            <a href={`${import.meta.env.VITE_BACKEND_URL}/${output.output_csv}`} download className="csv-download">
                                Download Result CSV
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Simulation3;
