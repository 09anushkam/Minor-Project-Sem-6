const mongoose = require("mongoose");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
const MONGO_URL = process.env.ATLAS_DB || 'mongodb://127.0.0.1:27017/SMA';

main()
    .then((res) => {
        console.log("Connected to DB");
    })
    .catch(err => console.log(err));

async function main() {
    console.log("Connecting to MongoDB at:", MONGO_URL);
    await mongoose.connect(MONGO_URL);
}

const Experiment = require('../models/Experiment');

// Fake Experiment Data
const experiments = [
    {
        no: 1,
        title: "Comparative Analysis using Social Media Tools",
        aim: "<b>Aim:</b> To explore various social media analytics tools such as <i>Google Analytics, TextAnalytics – Lexatics, Similarweb, Facebook Insights,</i> and <i>Majestic</i> and perform comparative analysis on selected competitors from different domains like FMCG, airlines, education, hospitals, and mobile brands.",
        theory: "Newton’s laws explain the motion of objects...",
        procedure: "Step 1: Set up the experiment...",
        simulation: "Interactive simulation link here...",
        quiz: "Q1: What is Newton's first law?",
        references: "Coming Soon...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 2,
        title: "Social Media Data Acquisition Techniques",
        aim: "<b>Aim:</b> To acquire social media data using different data extraction methods including <i>BeautifulSoup, Requests, API integration,</i> and <i>Scrapy</i>, and analyze the retrieved data for insights.",
        theory: "Ohm's Law states that V = IR...",
        procedure: "Step 1: Connect the resistor...",
        simulation: "Interactive Ohm's Law simulation...",
        quiz: "Q1: What is the formula for Ohm's Law?",
        references: `<br/>
            1. <a href="https://ieeexplore.ieee.org/abstract/document/10617017" target="_blank">IEEE - Web Scraping Using Beautiful Soup</a><br/>
            2. <a href="https://www.emerald.com/insight/content/doi/10.1108/ijwis-03-2021-0037/full/html" target="_blank">Emerald Insight - Web scraping and API methods for Twitter credibility analysis</a>
            <br/>`,
        feedback: "Your feedback is valuable."
    },
    {
        no: 3,
        title: "Sentiment Analysis on Social Media Data",
        aim: "<b>Aim:</b> To implement sentiment analysis on social media platform data and Kaggle datasets for a chosen use case, and evaluate the results using standard metrics like <i>Accuracy, Precision, Recall,</i> and <i>F1 Score</i>.",
        theory: "Archimedes' Principle explains why objects float...",
        procedure: "Step 1: Submerge the object...",
        simulation: "Buoyancy simulation link...",
        quiz: "Q1: What happens when an object is submerged?",
        references: `<br/>
            1. <a href="https://ieeexplore.ieee.org/abstract/document/9151169" target="_blank">IEEE - Negative Sentiment Analysis on Social Media in China via BERT Model</a><br/>
            2. <a href="https://ieeexplore.ieee.org/abstract/document/8399738" target="_blank">IEEE - Sentiment Analysis of Big Data</a>
            <br/>`,
        feedback: "Your feedback is valuable."
    },
    {
        no: 4,
        title: "Topic Modeling using Machine Learning",
        aim: "<b>Aim:</b> To identify and implement machine learning techniques for discovering the key topics being discussed on social media platforms using real-world datasets.",
        theory: "The angle of incidence equals the angle of reflection...",
        procedure: "Step 1: Place a mirror at an angle...",
        simulation: "Light reflection simulation...",
        quiz: "Q1: What is the law of reflection?",
        references: `<br/>
            1. <a href="https://ieeexplore.ieee.org/abstract/document/6697807" target="_blank">IEEE - Topic Modeling for Short Text</a><br/>
            2. <a href="https://ieeexplore.ieee.org/abstract/document/10666498" target="_blank">IEEE - Social Media Event Detection using Topic Modeling</a>
        <br/>`,
        feedback: "Your feedback is valuable."
    },
    {
        no: 5,
        title: "Graph Traversal Algorithms in Social Media",
        aim: "<b>Aim:</b> To simulate and demonstrate graph traversal algorithms (e.g., BFS, DFS) using a virtual lab environment and understand their application in social media network analysis.",
        theory: "Boyle's Law states that PV = constant...",
        procedure: "Step 1: Reduce the volume of a gas...",
        simulation: "Gas law simulation...",
        quiz: "Q1: What is Boyle's Law?",
        references: `<br/>
            1. <a href="https://ieeexplore.ieee.org/abstract/document/9055369" target="_blank">IEEE - Graph Algorithms in Social Networks</a><br/>
            2. <a href="https://ieeexplore.ieee.org/abstract/document/9170508" target="_blank">IEEE - Network Traversal for Influence Detection</a>
        <br/>`,
        feedback: "Your feedback is valuable."
    },
    {
        no: 6,
        title: "Social Network Analysis using NetworkX",
        aim: "<b>Aim:</b> To perform social network data analysis using the <i>NetworkX</i> library by creating random social graphs, identifying influencer nodes, and calculating various network measures such as <i>degree centrality</i>.",
        theory: "A changing magnetic field induces a current...",
        procedure: "Step 1: Move a magnet near a coil...",
        simulation: "Electromagnetic induction simulation...",
        quiz: "Q1: What is Faraday's Law?",
        references: `<br/>
            1. <a href="https://ieeexplore.ieee.org/abstract/document/9318162" target="_blank">IEEE - Social Network Analysis Using NetworkX</a><br/>
            2. <a href="https://www.mdpi.com/1999-5903/14/5/147" target="_blank">MDPI - Graph-Based Analysis in Social Media</a>
        <br/>`,
        feedback: "Your feedback is valuable."
    },
    {
        no: 7,
        title: "Social Media Insights using TF-IDF",
        aim: "<b>Aim:</b> To extract and analyze meaningful insights from social media posts using the <i>Term Frequency-Inverse Document Frequency (TF-IDF)</i> technique.",
        theory: "Hooke's Law states that F = kx...",
        procedure: "Step 1: Attach weights to the spring...",
        simulation: "Spring elasticity simulation...",
        quiz: "Q1: What is Hooke's Law?",
        references: `<br/>
            1. <a href="https://assets-eu.researchsquare.com/files/rs-4790818/v1_covered_fe6ffb58-23c3-4ab8-a7c4-ff5e053a1cdc.pdf?c=1724178471" target="_blank">ResearchSquare - TF-IDF for Social Media Insights</a><br/>
            2. <a href="https://ieeexplore.ieee.org/abstract/document/9139510" target="_blank">IEEE - Text Mining and TF-IDF</a>
        <br/>`,
        feedback: "Your feedback is valuable."
    },
    {
        no: 8,
        title: "Social Network Analysis using Graph Theory",
        aim: "<b>Aim:</b> To analyze the structure of social media networks using graph theory concepts, identify influential users and popular content, and explore user interactions within the network.",
        theory: "Bernoulli's Principle explains fluid motion...",
        procedure: "Step 1: Observe fluid flow in a pipe...",
        simulation: "Bernoulli simulation...",
        quiz: "Q1: What does Bernoulli's Principle state?",
        references: `<br/>
            1. <a href="https://www.nature.com/articles/s41598-022-19419-7" target="_blank">Nature - Graph Theory in Online Social Networks</a><br/>
            2. <a href="https://ieeexplore.ieee.org/abstract/document/10530557" target="_blank">IEEE - Social Network Graph Analysis</a>
        <br/>`,
        feedback: "Your feedback is valuable."
    }
];

// Insert Data into MongoDB
const insertData = async () => {
    try {
        await Experiment.deleteMany({});
        await Experiment.insertMany(experiments);
        console.log("Experiment data inserted successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error inserting data:", error);
        mongoose.connection.close();
    }
};

insertData();
