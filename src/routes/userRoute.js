// routes/authRoutes.js
const express = require('express');
const { signup, login, getProfile ,updateProfile,deleteAccount,followUnfollow,followUser,unfollowUser} = require('../controller/usercontroller');
const { authenticateUser, authorizeUser } = require('../auth/middleware');
const router = express.Router();

//Route for register and login
router.post('/signup', signup);
router.post('/login', login);

// Routes for user profile
router.get('/getProfile',authenticateUser,authorizeUser, getProfile);
router.put('/updateProfile', authenticateUser,authorizeUser,updateProfile);
router.delete('/account',authenticateUser,authorizeUser, deleteAccount);

// Route for following/unfollowing users
router.post('/follow', authenticateUser,authorizeUser,followUser);
router.post('/unfollow', authenticateUser,authorizeUser,unfollowUser);

module.exports = router;
