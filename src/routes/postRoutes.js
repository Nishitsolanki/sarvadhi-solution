const express = require('express');
const { createPost, getLatestPosts,searchByHashtag,likePost,unlikePost } = require('../controller/postController');
const { authenticateUser, authorizeUser } = require('../auth/middleware');
const router = express.Router() 


router.post('/posts',authenticateUser, authorizeUser, createPost);

router.get('/posts/latest', authenticateUser, authorizeUser, getLatestPosts);

router.get('/posts/search/:hashtag',authenticateUser, authorizeUser, searchByHashtag);

router.post('/posts/like/:postId',authenticateUser, authorizeUser, likePost);

router.delete('/posts/unlike/:postId',authenticateUser, authorizeUser, unlikePost);


module.exports = router;

