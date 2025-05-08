const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URL = process.env.ATLAS_DB || 'mongodb://127.0.0.1:27017/SMA';

// Import all models
const User = require('../models/user');
const Experiment = require('../models/Experiment');
const Feedback = require('../models/Feedback');
const TwitterData = require('../models/TwitterData');
const ScrapedData = require('../models/ScrapedData');
const Admin = require('../models/admin');

async function viewDatabase() {
    try {
        console.log('Connecting to MongoDB at:', MONGO_URL);
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB');

        // View Users
        console.log('\n=== Users ===');
        const users = await User.find().select('-password');
        console.log(users);

        // View Experiments
        console.log('\n=== Experiments ===');
        const experiments = await Experiment.find();
        console.log(experiments);

        // View Feedback
        console.log('\n=== Experiment Feedback ===');
        const feedback = await Feedback.find()
            .populate('userId', 'name email')
            .sort({ experimentNo: 1, createdAt: -1 });

        feedback.forEach(entry => {
            console.log('\nExperiment:', entry.experimentNo);
            console.log('User:', entry.userId.name, '(' + entry.userId.email + ')');
            console.log('Ratings:');
            console.log('  - Understanding:', entry.understanding + '/5');
            console.log('  - Difficulty:', entry.difficulty + '/5');
            console.log('  - Usefulness:', entry.usefulness + '/5');
            console.log('Comments:', entry.comments || 'None');
            console.log('Suggestions:', entry.suggestions || 'None');
            console.log('Submitted:', entry.createdAt);
            console.log('-'.repeat(50));
        });

        // View Twitter Data
        console.log('\n=== Twitter Data ===');
        const twitterData = await TwitterData.find();
        console.log(twitterData);

        // View Scraped Data
        console.log('\n=== Scraped Data ===');
        const scrapedData = await ScrapedData.find();
        console.log(scrapedData);

        // View Admins
        console.log('\n=== Admins ===');
        const admins = await Admin.find().select('-password');
        console.log(admins);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

viewDatabase(); 