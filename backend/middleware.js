module.exports.isAuthenticated = (req, res, next) => {
    console.log('Checking authentication:', req.isAuthenticated(), 'User:', req.user);
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Please login to continue' });
};

module.exports.isAuthorized = (role) => (req, res, next) => {
    if (req.user.role === role) return next();
    res.status(403).json({ message: 'Access denied' });
};

const multer = require('multer');
const path = require('path');

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

module.exports = { upload };
