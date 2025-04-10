const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URL = process.env.ATLAS_DB || 'mongodb://127.0.0.1:27017/SMA';
const Experiment = require('../models/Experiment');

const experiments = [
    {
        no: 1,
        title: "Social Media Analysis",
        aim: "Explore social media tools like Google Analytics, Lexatics, Similarweb, etc.",
        theory: "Understanding social media analytics tools...",
        procedure: "Step 1: Access the analytics tools...",
        simulation: "Interactive analytics simulation...",
        quiz: "Q1: What metrics are important in social media analysis?",
        references: "1. Social Media Analytics Guide...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 2,
        title: "Social Media Data Extraction",
        aim: "Acquire social media data through Web Scrapping, & APIs.",
        theory: "Data extraction methods and techniques...",
        procedure: "Step 1: Set up API access...",
        simulation: "Data extraction simulation...",
        quiz: "Q1: What are the main methods of data extraction?",
        references: "1. Web Scraping Handbook...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 3,
        title: "Sentiment Analysis on User Data",
        aim: "Determine user sentiments using NLP techniques.",
        theory: "Natural Language Processing and sentiment analysis...",
        procedure: "Step 1: Prepare the text data...",
        simulation: "Sentiment analysis simulation...",
        quiz: "Q1: What are the basic sentiment categories?",
        references: "1. NLP Fundamentals...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 4,
        title: "Social Media Topic Modeling",
        aim: "Identify topics from social media conversations.",
        theory: "Topic modeling algorithms and applications...",
        procedure: "Step 1: Collect conversation data...",
        simulation: "Topic modeling simulation...",
        quiz: "Q1: What is LDA in topic modeling?",
        references: "1. Topic Modeling Guide...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 5,
        title: "Graph Traversal Algorithms",
        aim: "Simulate graph traversal algorithms.",
        theory: "Graph theory and traversal methods...",
        procedure: "Step 1: Create a social network graph...",
        simulation: "Graph traversal simulation...",
        quiz: "Q1: What is BFS traversal?",
        references: "1. Graph Theory Basics...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 6,
        title: "Social Network Analysis with NetworkX",
        aim: "Analyze social graphs using NetworkX library.",
        theory: "Network analysis concepts and metrics...",
        procedure: "Step 1: Install NetworkX...",
        simulation: "NetworkX analysis simulation...",
        quiz: "Q1: What is centrality in network analysis?",
        references: "1. NetworkX Documentation...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 7,
        title: "Social Media Insights via TF-IDF",
        aim: "Extract insights from social media posts using TF-IDF technique.",
        theory: "TF-IDF methodology and applications...",
        procedure: "Step 1: Prepare the document corpus...",
        simulation: "TF-IDF calculation simulation...",
        quiz: "Q1: How is TF-IDF score calculated?",
        references: "1. Text Mining Guide...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 8,
        title: "Analyze Structure of Social Media Data",
        aim: "Analyze the structure of social media data using graph theory.",
        theory: "Graph theory applications in social media...",
        procedure: "Step 1: Extract network structure...",
        simulation: "Network structure analysis simulation...",
        quiz: "Q1: What are the key metrics in network structure analysis?",
        references: "1. Social Network Analysis...",
        feedback: "Your feedback is valuable."
    }
];

async function verifyAndFixExperiments() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB');

        // Get current experiments
        const currentExperiments = await Experiment.find().sort({ no: 1 });
        console.log('Current experiments in database:', currentExperiments.length);

        // Check if we need to update
        if (currentExperiments.length !== experiments.length) {
            console.log('Updating experiments...');
            await Experiment.deleteMany({});
            await Experiment.insertMany(experiments);
            console.log('Experiments updated successfully!');
        } else {
            console.log('Experiments are up to date!');
        }

        // Verify after update
        const verifiedExperiments = await Experiment.find().sort({ no: 1 });
        console.log('Verified experiments:', verifiedExperiments.map(e => ({ no: e.no, title: e.title })));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

verifyAndFixExperiments();