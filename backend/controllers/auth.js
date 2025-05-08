const User = require('../models/user');
const passport = require('passport');

module.exports.loginSuccess = async (req, res) => {
    if (req.user) {
        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }
}

module.exports.loginFailure = async (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
}

// Register User
module.exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, email, password, provider: 'local' });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Login User
module.exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                },
            });
        });
    })(req, res, next);
};

// Logout User
module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.redirect(`${process.env.FRONTEND_URL}`);
    });
};

// Google Callback
module.exports.googleCallback = async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ providerId: profile.id });
        if (!user) {
            const isAdmin = profile.emails[0].value === 'vivekmasuna999@gmail.com';
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                provider: 'google',
                providerId: profile.id,
                role: isAdmin ? 'admin' : 'user',
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
};

// Facebook Callback
exports.facebookCallback = async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ providerId: profile.id });
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails?.[0]?.value || 'no-email@facebook.com', // Email may be optional for Facebook
                provider: 'facebook',
                providerId: profile.id,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
};

// Twitter Callback
exports.twitterCallback = async (token, tokenSecret, profile, done) => {
    try {
        let user = await User.findOne({ providerId: profile.id });
        if (!user) {
            user = new User({
                name: profile.displayName,
                provider: 'twitter',
                providerId: profile.id,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
};
