import { useState } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./styles/Simulation7.css";

const Simulation7 = () => {
  const [manualText, setManualText] = useState("");
  const [preloaded, setPreloaded] = useState([]);
  const [uploadedText, setUploadedText] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [tfidfOutput, setTfidfOutput] = useState([]);
  const [showManual, setShowManual] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showProceed, setShowProceed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualizationTab, setVisualizationTab] = useState("table");
  const [processedData, setProcessedData] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState("");

  const preloadedPosts = [
    { text: "The match was thrilling! What a performance by the team!" },
    { text: "Government announces new healthcare reforms." },
    { text: "10 tips for glowing skin this summer." },
    { text: "Latest movie review: A must-watch!" },
    { text: "New research shows benefits of daily exercise on mental health." },
    { text: "Tech company unveils revolutionary AI-powered assistant." },
    { text: "Local community celebrates annual cultural festival." },
    { text: "Scientists discover new species in Amazon rainforest." }
  ];

  const defaultDatasets = [
    { name: "Sample Dataset 1", path: "/datasets/sample1.csv", viewPath: "/datasets/sample1.csv" },
    { name: "Sample Dataset 2", path: "/datasets/sample2.csv", viewPath: "/datasets/sample2.csv" },
    { name: "Upload Custom CSV", path: "upload" }
  ];

  const handleDatasetSelect = async (e) => {
    const selectedPath = e.target.value;
    setSelectedDataset(selectedPath);

    if (selectedPath === "upload") {
      // Show file input for custom upload
      return;
    }

    try {
      const response = await fetch(selectedPath);
      const text = await response.text();
      Papa.parse(text, {
        complete: function (results) {
          const headers = results.data[0]?.map(header => header.toLowerCase());
          if (!headers || !headers.includes('documents')) {
            alert('Error: The CSV file must contain a column named "documents" (case-insensitive).');
            return;
          }

          const documentsIndex = headers.indexOf('documents');
          const labelIndex = headers.includes('label') ? headers.indexOf('label') : -1;

          const parsed = results.data
            .slice(1)
            .filter((row) => row[documentsIndex])
            .map((row) => {
              const doc = { text: row[documentsIndex] };
              if (labelIndex !== -1 && row[labelIndex]) {
                doc.label = row[labelIndex];
              }
              return doc;
            });

          setUploadedText(parsed);
          setActiveTab("uploaded");
          setShowProceed(true);
          setTfidfOutput([]);
        },
      });
    } catch (error) {
      console.error("Error loading dataset:", error);
      alert("Error loading the selected dataset. Please try again.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: function (results) {
        const headers = results.data[0]?.map(header => header.toLowerCase());
        if (!headers || !headers.includes('documents')) {
          alert('Error: The CSV file must contain a column named "documents" (case-insensitive).');
          return;
        }

        const documentsIndex = headers.indexOf('documents');
        const labelIndex = headers.includes('label') ? headers.indexOf('label') : -1;

        const parsed = results.data
          .slice(1)
          .filter((row) => row[documentsIndex])
          .map((row) => {
            const doc = { text: row[documentsIndex] };
            if (labelIndex !== -1 && row[labelIndex]) {
              doc.label = row[labelIndex];
            }
            return doc;
          });

        setUploadedText(parsed);
        setActiveTab("uploaded");
        setShowProceed(true);
        setTfidfOutput([]);
      },
    });
  };

  const handlePreloadedClick = () => {
    setPreloaded(preloadedPosts);
    setActiveTab("preloaded");
    setShowProceed(true);
    setShowManual(false);
    setShowUpload(false);
    setTfidfOutput([]);
  };

  const handleManualClick = () => {
    setActiveTab("manual");
    setShowManual(true);
    setShowUpload(false);
    setShowProceed(false);
    setTfidfOutput([]);
  };

  const handleUploadClick = () => {
    setActiveTab("upload");
    setShowUpload(true);
    setShowManual(false);
    setShowProceed(false);
    setTfidfOutput([]);
  };

  const handleViewSample = (path) => {
    window.open(path, '_blank');
  };

  const tokenize = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
  };

  const calculateTFIDF = (documents) => {
    const termDocFreq = {};
    const docTermFreq = documents.map((doc) => {
      const tokens = tokenize(doc.text);
      const freqMap = {};
      tokens.forEach((term) => {
        freqMap[term] = (freqMap[term] || 0) + 1;
      });
      Object.keys(freqMap).forEach((term) => {
        termDocFreq[term] = (termDocFreq[term] || 0) + 1;
      });
      return freqMap;
    });

    const totalDocs = documents.length;
    const tfidfMatrix = [];

    docTermFreq.forEach((freqMap, idx) => {
      const totalTerms = Object.values(freqMap).reduce((a, b) => a + b, 0);
      const tfidfRow = {};

      Object.entries(freqMap).forEach(([term, freq]) => {
        const tf = freq / totalTerms;
        const idf = Math.log(totalDocs / termDocFreq[term]);
        tfidfRow[term] = {
          tf: parseFloat(tf.toFixed(4)),
          idf: parseFloat(idf.toFixed(4)),
          tfidf: parseFloat((tf * idf).toFixed(4))
        };
      });

      tfidfMatrix.push({ document: `Doc ${idx + 1}`, tfidf: tfidfRow });
    });

    return tfidfMatrix;
  };

  const processDataForVisualization = (tfidfMatrix) => {
    // Process for Bar Chart - Calculate total and maximum TF-IDF scores for each term
    const termStats = {};

    // Initialize term statistics
    tfidfMatrix.forEach((doc) => {
      if (doc && doc.tfidf) {
        Object.entries(doc.tfidf).forEach(([term, scores]) => {
          if (!termStats[term]) {
            termStats[term] = {
              totalScore: 0,
              maxScore: 0,
              frequency: 0,
              documents: new Set()
            };
          }
          if (scores && typeof scores.tfidf === 'number') {
            termStats[term].totalScore += scores.tfidf;
            termStats[term].maxScore = Math.max(termStats[term].maxScore, scores.tfidf);
            termStats[term].frequency++;
            termStats[term].documents.add(doc.document);
          }
        });
      }
    });

    // Convert to array and sort by frequency first, then by total TF-IDF score
    const barData = Object.entries(termStats)
      .map(([term, stats]) => ({
        term,
        totalScore: parseFloat(stats.totalScore.toFixed(4)),
        maxScore: parseFloat(stats.maxScore.toFixed(4)),
        frequency: stats.frequency,
        documentCount: stats.documents.size
      }))
      .sort((a, b) => {
        if (b.frequency !== a.frequency) {
          return b.frequency - a.frequency; // Sort by frequency first
        }
        return b.totalScore - a.totalScore; // Then by total score
      });

    // Process for Heatmap
    const terms = barData.map(item => item.term); // Use sorted terms
    const heatmapData = tfidfMatrix.map((doc, idx) => {
      const rowData = {
        document: `Doc ${idx + 1}`,
      };
      terms.forEach((term) => {
        rowData[term] = doc.tfidf && doc.tfidf[term] ? doc.tfidf[term].tfidf : 0;
      });
      return rowData;
    });

    // Find the overall maximum score for scaling
    const maxScore = Math.max(
      ...Object.values(termStats).map(stats => stats.maxScore)
    );

    return {
      barData: barData.slice(0, 10), // Top 10 terms
      heatmapData,
      terms,
      maxScore,
      termStats
    };
  };

  const handleProceed = async () => {
    let dataToUse = [];
    setIsProcessing(true);

    if (activeTab === "manual" && manualText.trim()) {
      dataToUse = manualText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({ text: line }));
    } else if (activeTab === "preloaded") {
      dataToUse = preloadedPosts;
    } else if (activeTab === "uploaded") {
      dataToUse = uploadedText;
    }

    if (dataToUse.length === 0) {
      alert("Please enter or select at least one post.");
      setIsProcessing(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = calculateTFIDF(dataToUse);
    setTfidfOutput(result);
    const visualizationData = processDataForVisualization(result);
    setProcessedData(visualizationData);
    setIsProcessing(false);
  };

  const renderVisualization = () => {
    if (!processedData) return null;

    switch (visualizationTab) {
      case "table":
        return (
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Term</th>
                  <th>TF Score</th>
                  <th>IDF Score</th>
                  <th>TF-IDF Score</th>
                </tr>
              </thead>
              <tbody>
                {tfidfOutput.map((row, docIdx) =>
                  Object.entries(row.tfidf).map(([term, scores], termIdx) => (
                    <motion.tr
                      key={`${docIdx}-${term}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (docIdx * 5 + termIdx) * 0.02 }}
                      className="table-row"
                    >
                      <td>{row.document}</td>
                      <td>{term}</td>
                      <td>{scores.tf}</td>
                      <td>{scores.idf}</td>
                      <td>{scores.tfidf}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case "barChart":
        return (
          <div className="chart-container">
            <h3>Top 10 Terms by Frequency and TF-IDF Score</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={processedData.barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="term"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis
                  domain={[0, Math.ceil(processedData.maxScore * 10) / 10]}
                  label={{
                    value: 'TF-IDF Score',
                    angle: -90,
                    position: 'insideLeft',
                    offset: -5
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip">
                          <p className="term">{label}</p>
                          <p>Frequency: {payload[0].payload.frequency} times</p>
                          <p>Documents: {payload[0].payload.documentCount}</p>
                          <p>Max Score: {payload[0].payload.maxScore.toFixed(4)}</p>
                          <p>Total Score: {payload[0].payload.totalScore.toFixed(4)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar
                  name="Maximum TF-IDF Score"
                  dataKey="maxScore"
                  fill="#ff9494"
                >
                  {processedData.barData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={`hsl(${index * 36}, 70%, 70%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "heatmap":
        return (
          <div className="heatmap-container">
            <h3>TF-IDF Score Heatmap</h3>
            <div className="heatmap-wrapper">
              <div className="heatmap-grid">
                <div className="heatmap-header">
                  <div className="heatmap-cell header">Document</div>
                  {processedData.terms.map((term, i) => (
                    <div key={i} className="heatmap-cell header term">
                      {term}
                    </div>
                  ))}
                </div>
                {processedData.heatmapData.map((row, i) => (
                  <div key={i} className="heatmap-row">
                    <div className="heatmap-cell header">{row.document}</div>
                    {processedData.terms.map((term, j) => (
                      <div
                        key={j}
                        className="heatmap-cell"
                        style={{
                          backgroundColor: `hsla(0, 100%, 76%, ${row[term] / processedData.maxScore})`,
                        }}
                        title={`${row.document} - ${term}: ${row[term].toFixed(4)}`}
                      >
                        {row[term].toFixed(4)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "summary":
        const topTerm = processedData.barData[0];
        return (
          <div className="summary-container">
            <h3>TF-IDF Analysis Summary</h3>
            <div className="summary-stats">
              <div className="stat-card">
                <h4>Total Documents</h4>
                <p>{tfidfOutput.length}</p>
              </div>
              <div className="stat-card">
                <h4>Unique Terms</h4>
                <p>{processedData.terms.length}</p>
              </div>
              <div className="stat-card">
                <h4>Most Frequent Term</h4>
                <p>{topTerm.term}</p>
                <small>Appears in {topTerm.documentCount} documents</small>
              </div>
            </div>
            <div className="term-importance">
              <h4>Top 5 Terms by Frequency</h4>
              <div className="term-chips">
                {processedData.barData.slice(0, 5).map((term, index) => (
                  <div
                    key={index}
                    className="term-chip"
                    style={{
                      backgroundColor: `hsl(${index * 72}, 70%, 70%)`,
                    }}
                  >
                    <strong>{term.term}</strong>
                    <br />
                    <small>
                      Frequency: {term.frequency}
                      <br />
                      Documents: {term.documentCount}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="simulation7-container"
    >
      <div className="tf-idf-visualizer">
        <motion.h2
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="title"
        >
          TF-IDF Simulation
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="button-container"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleManualClick}
            className="tf-idf-button"
          >
            Enter Posts Manually
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUploadClick}
            className="tf-idf-button"
          >
            Upload CSV File
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreloadedClick}
            className="tf-idf-button"
          >
            Use Preloaded Posts
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {showManual && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="input-container"
            >
              <textarea
                className="text-input"
                rows={4}
                placeholder="Type each post on a new line"
                value={manualText}
                onChange={(e) => {
                  setManualText(e.target.value);
                  setShowProceed(true);
                }}
              />
            </motion.div>
          )}

          {showUpload && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="file-upload"
            >
              <p className="file-info-text">
                <strong>Note:</strong> The uploaded CSV must contain a column named "documents" (case-insensitive).
              </p>
              <div className="dataset-selector">
                <select
                  value={selectedDataset}
                  onChange={handleDatasetSelect}
                  className="dataset-dropdown"
                >
                  <option value="">-- Select a dataset --</option>
                  {defaultDatasets.map((dataset, index) => (
                    <option key={index} value={dataset.path}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
                {selectedDataset && selectedDataset !== "upload" && (
                  <button
                    onClick={() => handleViewSample(selectedDataset)}
                    className="view-sample-button"
                  >
                    View Sample
                  </button>
                )}
              </div>
              {selectedDataset === "upload" && (
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="file-input"
                />
              )}
            </motion.div>
          )}

          {activeTab === "preloaded" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="preloaded-posts"
            >
              {preloadedPosts.map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="post-card"
                >
                  {post.text}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {showProceed && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={!isProcessing ? { scaleX: 1.05 } : {}}
              whileTap={!isProcessing ? { scaleX: 0.95 } : {}}
              onClick={handleProceed}
              className="tf-idf-button"
              style={{ width: '200px', height: '40px' }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="loading"></div>
              ) : (
                "Analyze"
              )}
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {tfidfOutput.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="results-container"
            >
              <div className="visualization-tabs">
                <button
                  className={`tab-button ${visualizationTab === "table" ? "active" : ""}`}
                  onClick={() => setVisualizationTab("table")}
                >
                  Table View
                </button>
                <button
                  className={`tab-button ${visualizationTab === "barChart" ? "active" : ""}`}
                  onClick={() => setVisualizationTab("barChart")}
                >
                  Bar Chart
                </button>
                <button
                  className={`tab-button ${visualizationTab === "heatmap" ? "active" : ""}`}
                  onClick={() => setVisualizationTab("heatmap")}
                >
                  Heatmap
                </button>
                <button
                  className={`tab-button ${visualizationTab === "summary" ? "active" : ""}`}
                  onClick={() => setVisualizationTab("summary")}
                >
                  Summary
                </button>
              </div>
              {renderVisualization()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Simulation7;