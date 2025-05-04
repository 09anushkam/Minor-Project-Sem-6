require('dotenv').config()

const cron = require("node-cron");
const cleanupOldFiles = require("./utils/cleanup.js");
cron.schedule("0 * * * *", cleanupOldFiles);

const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { googleCallback } = require('./controllers/auth');

// const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const scrapeRoutes = require("./routes/scrapeRoutes");
const experimentRoutes = require("./routes/Experiment.js");
const feedbackRoutes = require('./routes/feedback');
const quizScoreRoutes = require('./routes/quizScore');

const MONGO_URL = process.env.ATLAS_DB;

main()
    .then((res) => {
        console.log("Connected to DB");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Middleware
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));
app.get('/test-download', (req, res) => {
    res.send(`<a href="/uploads/output_sentiment.csv" download>Download CSV</a>`);
});

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
};

// Session and Passport
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'User not found.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    scope: ["profile", "email"],
}, googleCallback));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

// app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/experiments', experimentRoutes);
app.use('/api/feedback', feedbackRoutes);

// Register quiz score routes with debug middleware
app.use('/api/quiz-scores', (req, res, next) => {
    // console.log('Quiz Score Route Hit:');
    // console.log('Method:', req.method);
    // console.log('Path:', req.path);
    // console.log('User:', req.user);
    // console.log('Session:', req.session);
    next();
}, quizScoreRoutes);

// Debug middleware to log all requests
// app.use((req, res, next) => {
//     console.log('Incoming request:', req.method, req.path);
//     next();
// });

// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({ message: 'Something broke!', error: err.message });
// });

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});
