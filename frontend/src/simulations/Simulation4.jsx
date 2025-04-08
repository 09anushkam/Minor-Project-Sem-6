import React, { useState, useEffect } from 'react';
import './styles/Simulation4.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, ZAxis, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.ttf', fontWeight: 'bold' }
  ]
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto'
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1pt solid #FF6B6B'
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#FF6B6B',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FF6B6B',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B6B',
    borderBottomStyle: 'solid',
    padding: 5
  },
  tableHeader: {
    backgroundColor: '#FFF5F5',
    fontWeight: 'bold'
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    padding: 5
  },
  chartContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFF5F5',
    borderRadius: 5
  }
});

// PDF Report Component
const ReportPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Topic Modeling Analysis Report</Text>
        <Text style={styles.subtitle}>Generated on: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dataset Information</Text>
        <Text style={styles.text}>Dataset Name: {data.datasetName}</Text>
        <Text style={styles.text}>Number of Records: {data.records}</Text>
        <Text style={styles.text}>Analysis Model: {data.model}</Text>
        <Text style={styles.text}>Number of Topics: {data.numTopics}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Topic Distribution</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Topic</Text>
            <Text style={styles.tableCell}>Distribution (%)</Text>
            <Text style={styles.tableCell}>Key Words</Text>
          </View>
          {data.topics.map((topic, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>Topic {index + 1}</Text>
              <Text style={styles.tableCell}>{((topic.value / data.topics.reduce((sum, t) => sum + t.value, 0)) * 100).toFixed(1)}%</Text>
              <Text style={styles.tableCell}>{topic.words.join(', ')}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geographic Distribution</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Region</Text>
            <Text style={styles.tableCell}>Number of Posts</Text>
            <Text style={styles.tableCell}>Percentage</Text>
          </View>
          {data.geoData.map((region, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{region.location}</Text>
              <Text style={styles.tableCell}>{region.count}</Text>
              <Text style={styles.tableCell}>
                {((region.count / data.geoData.reduce((sum, r) => sum + r.count, 0)) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analysis Summary</Text>
        <Text style={styles.text}>
          Classification Accuracy: {data.accuracy}%
          {'\n\n'}
          The analysis shows that the {data.model} model performed well in identifying {data.numTopics} distinct topics
          in the {data.datasetName} dataset. The geographic distribution indicates a global reach of the content,
          with significant contributions from multiple regions.
        </Text>
      </View>
    </Page>
  </Document>
);

// Simple WordCloud component
const SimpleWordCloud = ({ words }) => {
  return (
    <div className="word-cloud-container">
      {words.map((word, index) => (
        <span
          key={index}
          className="word-cloud-word"
          style={{
            fontSize: `${word.value}px`,
            opacity: Math.min(1, word.value / 100),
            transform: `rotate(${Math.random() * 30 - 15}deg)`,
            display: 'inline-block',
            margin: '5px',
            padding: '5px',
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
};

// Sample data for visualizations
const sampleFeatureData = [
  { feature: 'Feature 1', importance: 0.8 },
  { feature: 'Feature 2', importance: 0.6 },
  { feature: 'Feature 3', importance: 0.4 },
  { feature: 'Feature 4', importance: 0.3 },
  { feature: 'Feature 5', importance: 0.2 }
];

const samplePCAData = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 10 - 5,
  y: Math.random() * 10 - 5,
  z: Math.random() * 100
}));

const sampleTopicData = [
  { name: 'Topic 1', value: 30 },
  { name: 'Topic 2', value: 25 },
  { name: 'Topic 3', value: 20 },
  { name: 'Topic 4', value: 15 },
  { name: 'Topic 5', value: 10 }
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

const sampleTimelineData = [
  { date: '2023-01', Topic1: 30, Topic2: 25, Topic3: 20 },
  { date: '2023-02', Topic1: 35, Topic2: 28, Topic3: 22 },
  { date: '2023-03', Topic1: 40, Topic2: 30, Topic3: 25 },
  { date: '2023-04', Topic1: 45, Topic2: 32, Topic3: 28 },
  { date: '2023-05', Topic1: 50, Topic2: 35, Topic3: 30 }
];

const sampleConfusionMatrix = [
  { actual: 'Class 1', predicted: 'Class 1', value: 50 },
  { actual: 'Class 1', predicted: 'Class 2', value: 10 },
  { actual: 'Class 1', predicted: 'Class 3', value: 5 },
  { actual: 'Class 2', predicted: 'Class 1', value: 8 },
  { actual: 'Class 2', predicted: 'Class 2', value: 45 },
  { actual: 'Class 2', predicted: 'Class 3', value: 7 },
  { actual: 'Class 3', predicted: 'Class 1', value: 6 },
  { actual: 'Class 3', predicted: 'Class 2', value: 9 },
  { actual: 'Class 3', predicted: 'Class 3', value: 40 }
];

const sampleGeoData = [
  { location: 'North America', count: 150 },
  { location: 'Europe', count: 120 },
  { location: 'Asia', count: 200 },
  { location: 'South America', count: 80 },
  { location: 'Africa', count: 60 },
  { location: 'Oceania', count: 40 }
];

const Simulation4 = () => {
  // State management
  const [currentPhase, setCurrentPhase] = useState(1);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preprocessingSteps, setPreprocessingSteps] = useState({
    removeUrls: false,
    lowercase: false,
    removeStopwords: false,
    removeEmojis: false,
    lemmatize: false
  });
  const [featureExtractionMethod, setFeatureExtractionMethod] = useState('tfidf');
  const [topicModel, setTopicModel] = useState('lda');
  const [numTopics, setNumTopics] = useState(5);
  const [classificationModel, setClassificationModel] = useState('naiveBayes');
  const [results, setResults] = useState(null);
  const [wordCloudData, setWordCloudData] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [previewText, setPreviewText] = useState({
    before: 'Sample text before preprocessing...',
    after: 'Sample text after preprocessing...'
  });

  // Sample datasets with different characteristics
  const sampleDatasets = [
    { 
      id: 1, 
      name: 'Twitter Dataset', 
      records: 10000,
      topics: ['Technology', 'Politics', 'Entertainment', 'Sports', 'Business'],
      features: [
        { feature: 'Tech Terms', importance: 0.8 },
        { feature: 'Political Terms', importance: 0.6 },
        { feature: 'Entertainment Terms', importance: 0.4 },
        { feature: 'Sports Terms', importance: 0.3 },
        { feature: 'Business Terms', importance: 0.2 }
      ],
      geoData: [
        { location: 'North America', count: 150 },
        { location: 'Europe', count: 120 },
        { location: 'Asia', count: 200 },
        { location: 'South America', count: 80 },
        { location: 'Africa', count: 60 },
        { location: 'Oceania', count: 40 }
      ]
    },
    { 
      id: 2, 
      name: 'Reddit Comments', 
      records: 15000,
      topics: ['Gaming', 'Science', 'News', 'Memes', 'AskReddit'],
      features: [
        { feature: 'Gaming Terms', importance: 0.9 },
        { feature: 'Science Terms', importance: 0.7 },
        { feature: 'News Terms', importance: 0.5 },
        { feature: 'Meme Terms', importance: 0.4 },
        { feature: 'Question Terms', importance: 0.3 }
      ],
      geoData: [
        { location: 'North America', count: 200 },
        { location: 'Europe', count: 150 },
        { location: 'Asia', count: 180 },
        { location: 'South America', count: 90 },
        { location: 'Africa', count: 70 },
        { location: 'Oceania', count: 50 }
      ]
    },
    { 
      id: 3, 
      name: 'YouTube Comments', 
      records: 8000,
      topics: ['Music', 'Education', 'Vlogging', 'Gaming', 'Tutorials'],
      features: [
        { feature: 'Music Terms', importance: 0.85 },
        { feature: 'Education Terms', importance: 0.65 },
        { feature: 'Vlog Terms', importance: 0.45 },
        { feature: 'Gaming Terms', importance: 0.35 },
        { feature: 'Tutorial Terms', importance: 0.25 }
      ],
      geoData: [
        { location: 'North America', count: 180 },
        { location: 'Europe', count: 140 },
        { location: 'Asia', count: 220 },
        { location: 'South America', count: 100 },
        { location: 'Africa', count: 80 },
        { location: 'Oceania', count: 60 }
      ]
    }
  ];

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Process file and update state
      setSelectedDataset({
        name: file.name,
        records: 0, // Will be updated after processing
        sample: []
      });
      // Show success message
      alert(`File ${file.name} uploaded successfully!`);
    }
  };

  // Handle preprocessing step toggle
  const handlePreprocessingToggle = (step) => {
    setPreprocessingSteps(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
    // Update preview text based on selected preprocessing steps
    updatePreviewText();
  };

  // Update preview text based on selected preprocessing steps
  const updatePreviewText = () => {
    let processedText = previewText.before;
    
    if (preprocessingSteps.lowercase) {
      processedText = processedText.toLowerCase();
    }
    if (preprocessingSteps.removeUrls) {
      processedText = processedText.replace(/https?:\/\/\S+/g, '');
    }
    if (preprocessingSteps.removeEmojis) {
      processedText = processedText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
    }
    
    setPreviewText(prev => ({
      ...prev,
      after: processedText
    }));
  };

  // Handle dataset selection
  const handleDatasetSelect = (dataset) => {
    setSelectedDataset(dataset);
    // Generate word cloud data based on selected dataset
    const words = dataset.topics.map(topic => ({
      text: topic,
      value: Math.floor(Math.random() * 50) + 30
    }));
    setWordCloudData(words);
    setGeoData(dataset.geoData);
  };

  // Handle topic modeling
  const handleTopicModeling = () => {
    // Simulate topic modeling with different results based on model and dataset
    const topics = selectedDataset.topics.map((topic, index) => ({
      name: topic,
      value: Math.floor(Math.random() * 30) + 20
    }));
    
    setResults({
      topics,
      accuracy: Math.floor(Math.random() * 20) + 80,
      model: topicModel,
      numTopics
    });
  };

  // Handle classification
  const handleClassification = () => {
    // Simulate classification with different results based on model
    const confusionMatrix = selectedDataset.topics.map((actual, i) => 
      selectedDataset.topics.map((predicted, j) => ({
        actual,
        predicted,
        value: i === j ? Math.floor(Math.random() * 30) + 40 : Math.floor(Math.random() * 10) + 5
      }))
    ).flat();

    setResults(prev => ({
      ...prev,
      confusionMatrix,
      classificationModel
    }));
  };

  // Handle download report
  const handleDownloadReport = () => {
    if (!results || !selectedDataset) return null;
    
    const reportData = {
      datasetName: selectedDataset.name,
      records: selectedDataset.records,
      numTopics: results.numTopics,
      model: results.model,
      accuracy: results.accuracy,
      topics: results.topics.map(topic => ({
        ...topic,
        words: [topic.name, ...selectedDataset.topics.filter(t => t !== topic.name).slice(0, 4)]
      })),
      geoData: selectedDataset.geoData
    };

    return (
      <div className="download-report-container">
        <PDFDownloadLink
          document={<ReportPDF data={reportData} />}
          fileName={`topic-modeling-report-${selectedDataset.name.toLowerCase().replace(/\s+/g, '-')}.pdf`}
          className="download-button"
        >
          {({ blob, url, loading, error }) => {
            if (loading) return 'Preparing report...';
            if (error) {
              console.error('PDF Generation Error:', error);
              return 'Error generating report. Please try again.';
            }
            return 'Download Report (PDF)';
          }}
        </PDFDownloadLink>
      </div>
    );
  };

  // Handle phase navigation
  const handleNextPhase = () => {
    if (currentPhase < 7) {
      setCurrentPhase(prev => prev + 1);
    }
  };

  const handlePreviousPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(prev => prev - 1);
    }
  };

  // Render current phase
  const renderPhase = () => {
    switch (currentPhase) {
      case 1:
        return (
          <div className="phase-container">
            <h2>Dataset Selection</h2>
            <div className="dataset-options">
              <div className="preloaded-datasets">
                <h3>Preloaded Datasets</h3>
                {sampleDatasets.map(dataset => (
                  <div 
                    key={dataset.id} 
                    className={`dataset-option ${selectedDataset?.id === dataset.id ? 'selected' : ''}`}
                    onClick={() => handleDatasetSelect(dataset)}
                  >
                    <h4>{dataset.name}</h4>
                    <p>Records: {dataset.records}</p>
                  </div>
                ))}
              </div>
              <div className="custom-upload">
                <h3>Upload Custom Dataset</h3>
                <input 
                  type="file" 
                  accept=".csv,.json,.txt" 
                  onChange={handleFileUpload}
                  className="file-input"
                />
                {uploadedFile && (
                  <div className="file-preview">
                    <p>Selected file: {uploadedFile.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="dataset-summary">
              <h3>Dataset Summary</h3>
              {selectedDataset && (
                <div>
                  <p>Records: {selectedDataset.records}</p>
                  <div className="word-cloud">
                    <SimpleWordCloud words={wordCloudData} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="phase-container">
            <h2>Data Preprocessing</h2>
            <div className="preprocessing-options">
              {Object.entries(preprocessingSteps).map(([step, enabled]) => (
                <div key={step} className="preprocessing-step">
                  <label>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handlePreprocessingToggle(step)}
                    />
                    {step.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
            <div className="preview-container">
              <div className="before-preview">
                <h3>Before</h3>
                <p>{previewText.before}</p>
              </div>
              <div className="after-preview">
                <h3>After</h3>
                <p>{previewText.after}</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="phase-container">
            <h2>Feature Extraction</h2>
            <div className="feature-extraction-options">
              <select 
                value={featureExtractionMethod}
                onChange={(e) => setFeatureExtractionMethod(e.target.value)}
              >
                <option value="tfidf">TF-IDF</option>
                <option value="count">Count Vectorizer</option>
                <option value="bert">BERT Embeddings</option>
              </select>
            </div>
            <div className="feature-visualization">
              <div className="heatmap-placeholder">
                <h4>Feature Importance</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={selectedDataset?.features || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="importance" fill="#FF6B6B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="pca-placeholder">
                <h4>PCA Projection</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="PC1" />
                    <YAxis type="number" dataKey="y" name="PC2" />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter data={Array.from({ length: 50 }, (_, i) => ({
                      x: Math.random() * 10 - 5,
                      y: Math.random() * 10 - 5,
                      z: Math.random() * 100
                    }))} fill="#4ECDC4" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="phase-container">
            <h2>Topic Modeling</h2>
            <div className="topic-modeling-options">
              <select 
                value={topicModel}
                onChange={(e) => setTopicModel(e.target.value)}
              >
                <option value="lda">LDA</option>
                <option value="nmf">NMF</option>
              </select>
              <div className="topic-slider">
                <label>Number of Topics: {numTopics}</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={numTopics}
                  onChange={(e) => setNumTopics(Number(e.target.value))}
                />
              </div>
              <button onClick={handleTopicModeling} className="download-button">
                Run Topic Modeling
              </button>
            </div>
            <div className="topic-visualization">
              <div className="topic-bubbles">
                <h4>Topic Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={results?.topics || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(results?.topics || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="topic-words">
                <h4>Top Words per Topic</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={selectedDataset?.features || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="importance" fill="#45B7D1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="phase-container">
            <h2>Topic Classification</h2>
            <div className="classification-options">
              <select 
                value={classificationModel}
                onChange={(e) => setClassificationModel(e.target.value)}
              >
                <option value="naiveBayes">Naive Bayes</option>
                <option value="logistic">Logistic Regression</option>
                <option value="svm">SVM</option>
                <option value="bert">BERT</option>
              </select>
              <button onClick={handleClassification} className="download-button">
                Run Classification
              </button>
            </div>
            <div className="training-progress">
              <h4>Training Progress</h4>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={sampleTimelineData}>
                  <Area type="monotone" dataKey="Topic1" stackId="1" stroke="#FF6B6B" fill="#FF6B6B" />
                  <Area type="monotone" dataKey="Topic2" stackId="1" stroke="#4ECDC4" fill="#4ECDC4" />
                  <Area type="monotone" dataKey="Topic3" stackId="1" stroke="#45B7D1" fill="#45B7D1" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="classification-results">
              <h4>Confusion Matrix</h4>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis type="category" dataKey="actual" name="Actual" />
                  <YAxis type="category" dataKey="predicted" name="Predicted" />
                  <ZAxis type="number" dataKey="value" range={[0, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={sampleConfusionMatrix} fill="#8884d8">
                    {sampleConfusionMatrix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="phase-container">
            <h2>Results Interpretation</h2>
            <div className="results-visualization">
              <div className="timeline-graph">
                <h4>Topic Trends Timeline</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={sampleTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Topic1" stroke="#FF6B6B" />
                    <Line type="monotone" dataKey="Topic2" stroke="#4ECDC4" />
                    <Line type="monotone" dataKey="Topic3" stroke="#45B7D1" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="geo-map">
                <h4>Geographic Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sampleGeoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#96CEB4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="phase-container">
            <h2>Analysis Summary & Conclusion</h2>
            <div className="summary-section">
              <div className="summary-card">
                <h3>Dataset Overview</h3>
                <div className="summary-content">
                  <div className="summary-item">
                    <span className="summary-label">Dataset:</span>
                    <span className="summary-value">{selectedDataset?.name || 'No dataset selected'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Records Analyzed:</span>
                    <span className="summary-value">{selectedDataset?.records || 0}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Topics Identified:</span>
                    <span className="summary-value">{results?.numTopics || 0}</span>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <h3>Topic Distribution</h3>
                <div className="topic-summary">
                  {results?.topics?.map((topic, index) => (
                    <div key={index} className="topic-item">
                      <div className="topic-header">
                        <span className="topic-name">Topic {index + 1}</span>
                        <span className="topic-percentage">
                          {((topic.value / results.topics.reduce((sum, t) => sum + t.value, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="topic-progress">
                        <div 
                          className="progress-bar"
                          style={{
                            width: `${((topic.value / results.topics.reduce((sum, t) => sum + t.value, 0)) * 100)}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-card">
                <h3>Geographic Distribution</h3>
                <div className="geo-summary">
                  {selectedDataset?.geoData?.map((region, index) => (
                    <div key={index} className="geo-item">
                      <div className="geo-header">
                        <span className="geo-name">{region.location}</span>
                        <span className="geo-count">{region.count} posts</span>
                      </div>
                      <div className="geo-progress">
                        <div 
                          className="progress-bar"
                          style={{
                            width: `${((region.count / selectedDataset.geoData.reduce((sum, r) => sum + r.count, 0)) * 100)}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-card">
                <h3>Key Insights</h3>
                <div className="insights-content">
                  <div className="insight-item">
                    <h4>Model Performance</h4>
                    <p>Classification accuracy: {results?.accuracy || 0}%</p>
                  </div>
                  <div className="insight-item">
                    <h4>Dominant Topics</h4>
                    <p>
                      {results?.topics?.slice(0, 2).map(topic => topic.name).join(' and ')} 
                      are the most prominent topics in the dataset
                    </p>
                  </div>
                  <div className="insight-item">
                    <h4>Geographic Coverage</h4>
                    <p>
                      The analysis shows significant contributions from {selectedDataset?.geoData?.length || 0} 
                      different regions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="conclusion-actions">
              <button 
                className="restart-button"
                onClick={() => {
                  setCurrentPhase(1);
                  setSelectedDataset(null);
                  setResults(null);
                }}
              >
                Start New Analysis
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="simulation-container">
      <div className="phase-navigation">
        {[1, 2, 3, 4, 5, 6, 7].map(phase => (
          <button
            key={phase}
            className={`phase-button ${currentPhase === phase ? 'active' : ''}`}
            onClick={() => setCurrentPhase(phase)}
          >
            Phase {phase}
          </button>
        ))}
      </div>
      {renderPhase()}
      <div className="navigation-buttons">
        <button 
          onClick={handlePreviousPhase}
          disabled={currentPhase === 1}
        >
          Previous
        </button>
        <button 
          onClick={handleNextPhase}
          disabled={currentPhase === 7}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Simulation4;
