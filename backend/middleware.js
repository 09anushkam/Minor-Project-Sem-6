const multer = require('multer');
const path = require('path');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // console.log('Checking authentication...');
    // console.log('Session:', req.session);
    // console.log('Is authenticated:', req.isAuthenticated());
    // console.log('User:', req.user);
    // console.log('Cookies:', req.cookies);
    // console.log('Headers:', req.headers);

    if (req.isAuthenticated()) {
        console.log('User is authenticated, proceeding...');
        return next();
    }
    console.log('Authentication failed, sending 401');
    res.status(401).json({ message: 'Please login to continue' });
};

// Authorization middleware
const isAuthorized = (role) => (req, res, next) => {
    if (req.user.role === role) return next();
    res.status(403).json({ message: 'Access denied' });
};

// File upload middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

module.exports = {
    isAuthenticated,
    isAuthorized,
    upload
};
