module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login');
};

module.exports.isAuthorized = (role) => (req, res, next) => {
    if (req.user.role === role) return next();
    res.status(403).send('Access denied.');
};
