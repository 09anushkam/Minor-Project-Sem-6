import { useState } from 'react';
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

    const handleFileChange = (e) => setFile(e.target.files[0]);
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
                const res = await axios.post('http://localhost:8080/api/experiments/sentiment-analysis', formData);
                const parsedOutput = typeof res.data.output === 'string'
                    ? JSON.parse(res.data.output.replace(/'/g, '"'))
                    : res.data.output;

                setOutput(parsedOutput);
                generateWordCloud(parsedOutput.cleaned_texts);

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
            }

        } else {
            const lines = textInput.split('\n').filter(Boolean);
            const payload = lines.map(line => {
                const [text, label] = line.split('|').map(item => item.trim());
                return { text, label: label || null };
            });

            try {
                const res = await axios.post('http://localhost:8080/api/experiments/sentiment-analysis/text-multi', { data: payload });
                setOutput(res.data.output);
                const allText = payload.map(p => p.text);
                generateWordCloud(allText);
            } catch (error) {
                console.error('Error during text analysis:', error);
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

    const generateWordCloud = (texts) => {
        const allWords = texts.join(' ').toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        const filteredWords = removeStopwords(allWords);
        const frequency = {};
        filteredWords.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        const topWords = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30)
            .map(([text, value]) => ({ text, value }));
        setWordData(topWords);
    };

    return (
        <div className="simulation3-container">
            <h2 className="heading">🧪 Experiment 3: Sentiment Analysis</h2>

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
            </div>

            {inputType === 'file' ? (
                <input type="file" accept=".csv" onChange={handleFileChange} className="file-input" />
            ) : (
                <textarea
                    rows="6"
                    cols="100"
                    placeholder='Enter one sentence per line. Optionally add label after "|" (e.g., "Great! | positive")'
                    value={textInput}
                    onChange={handleTextChange}
                    className="text-input"
                />
            )}

            <button onClick={handleAnalyze} disabled={loading} className="analyze-button">
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
                            <LineChart data={sentimentTrendData}>
                                <XAxis dataKey="index" />
                                <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sentiment" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {wordData.length > 0 && (
                        <div className="chart-section wordcloud-section">
                            <h3 className="subheading">☁️ Word Cloud</h3>
                            <WordCloudVisx words={wordData} />
                        </div>
                    )}

                    {output.output_csv && (
                        <div className="csv-section">
                            <h3 className="subheading">📁 Output CSV:</h3>
                            <a href={`http://localhost:8080/${output.output_csv}`} download className="csv-download">
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
