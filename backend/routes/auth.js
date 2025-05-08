const express = require('express');
const passport = require('passport');
const { loginSuccess, loginFailure, registerUser, loginUser, logoutUser } = require('../controllers/auth');
const router = express.Router();

router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFailure);
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login/failed',
        successRedirect: `${process.env.FRONTEND_URL}/`,
        session: true
    })
);

// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: 'http://localhost:5173/', failureRedirect: '/login' }));

// router.get('/twitter', passport.authenticate('twitter'));
// router.get('/twitter/callback', passport.authenticate('twitter', { successRedirect: 'http://localhost:5173/', failureRedirect: '/login' }));

module.exports = router;
