const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');


// Middleware to authenticate users
exports.authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authorization denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// Middleware to authorize users
exports.authorizeUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        if (req.user.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({ message: 'Invalid token version.' });
        }
        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};
