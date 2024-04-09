const express = require('express');
const router = express.Router();
const {getAllUserPosts,deletePost} = require('../controller/adminController');

// Route to get all user posts
router.get('/posts', getAllUserPosts);

// Route to delete a post
router.delete('/posts/:postId', deletePost);

module.exports = router;