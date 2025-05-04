import { useState, useEffect } from 'react';
import axios from 'axios';
import WordCloudVisx from '../components/WordCloudVisx';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

import './styles/Simulation4.css';

const Simulation4 = () => {
  const [file, setFile] = useState(null);
  const [numTopics, setNumTopics] = useState(5);
  const [topics, setTopics] = useState({});
  const [distribution, setDistribution] = useState([]);
  const [samples, setSamples] = useState({});
  const [loading, setLoading] = useState(false);

  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');

  const [selectedMode, setSelectedMode] = useState(null); // 'csv' or 'default'

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/experiments/default-datasets-topic`)
      .then(res => setAvailableDatasets(res.data.datasets))
      .catch(err => console.error("Failed to fetch datasets:", err));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitCSV = async () => {
    if (!file) return alert("Please upload a dataset");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('numTopics', numTopics);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/experiments/run-topic-modeling`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = res.data.output;
      setTopics(data.topics);
      setDistribution(data.distribution);
      setSamples(data.samples);
    } catch (err) {
      console.error('[CLIENT] Error:', err);
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDefault = async () => {
    if (!selectedDataset) return alert("Please select a default dataset");

    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/experiments/topic-modeling-default`, {
        datasetName: selectedDataset,
        numTopics,
      });

      const data = res.data.output;
      setTopics(data.topics);
      setDistribution(data.distribution);
      setSamples(data.samples);
    } catch (err) {
      console.error('[CLIENT] Error:', err);
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatWords = (keywords) =>
    keywords.map((obj) => ({
      text: obj.word,
      value: obj.weight,
    }));

  const getBarData = (keywords) => ({
    labels: keywords.map((w) => w.word),
    datasets: [{
      label: 'Keyword Weight',
      data: keywords.map((w) => w.weight),
      backgroundColor: 'rgba(75,192,192,0.6)',
    }],
  });

  return (
    <div className="simulation4-container">
      <div className="mode-select-buttons">
        <button onClick={() => {
          setSelectedMode('csv');
          setTopics({});
          setDistribution([]);
          setSamples({});
          setFile(null);
        }}>
          Upload Custom CSV
        </button>

        <button onClick={() => {
          setSelectedMode('default');
          setTopics({});
          setDistribution([]);
          setSamples({});
          setFile(null);
        }}>
          Select Default Datasets
        </button>
      </div>

      {selectedMode === 'csv' && (
        <div className="form-container4">
          <h3>Upload CSV File</h3>
          <div className="form-group4">
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </div>

          <div className="form-group4">
            <label htmlFor="numTopics">Number of Topics</label>
            <input
              type="number"
              id="numTopics"
              min="1"
              value={numTopics}
              onChange={(e) => setNumTopics(e.target.value)}
            />
          </div>

          <button onClick={handleSubmitCSV} disabled={loading}>
            {loading ? "Processing..." : "Run Topic Modeling"}
          </button>
        </div>
      )}

      {selectedMode === 'default' && (
        <div className="form-container4">
          <h3>Select Default Dataset</h3>
          <div className="form-group4">
            <select value={selectedDataset} onChange={(e) => setSelectedDataset(e.target.value)}>
              <option value="">-- Select a dataset --</option>
              {availableDatasets.map((dataset, idx) => (
                <option key={idx} value={dataset}>{dataset}</option>
              ))}
            </select>
          </div>

          <div className="form-group4">
            <label htmlFor="numTopics">Number of Topics</label>
            <input
              type="number"
              id="numTopics"
              min="1"
              value={numTopics}
              onChange={(e) => setNumTopics(e.target.value)}
            />
          </div>

          <button onClick={handleSubmitDefault} disabled={loading}>
            {loading ? "Processing..." : "Run Topic Modeling"}
          </button>
        </div>
      )}

      {Object.keys(topics).length > 0 && (
        <div className="results4">
          <h3>Identified Topics:</h3>

          {Object.entries(topics).map(([topic, keywords], idx) => (
            <div key={idx} className="topic-block">
              <h4>{topic}</h4>
              <WordCloudVisx words={formatWords(keywords)} />
              <Bar data={getBarData(keywords)} />
              <div className="sample-texts">
                <h5>Sample Documents:</h5>
                <ul>
                  {samples[topic]?.map((txt, i) => (
                    <li key={i}><i>{txt.slice(0, 150)}</i></li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="chart-distribution">
            <h3>Topic Distribution Across Documents</h3>
            <Pie
              data={{
                labels: Object.keys(topics),
                datasets: [{
                  label: 'Document Count',
                  data: distribution,
                  backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#C9CBCF', '#66D18F', '#F778A1', '#8A2BE2'
                  ],
                }],
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation4;
