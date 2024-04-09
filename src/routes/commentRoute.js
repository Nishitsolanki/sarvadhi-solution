const express = require('express');
const router = express.Router();
const { createComment,getLatestComments,updateComment,deleteComment} = require('../controller/commentController');

// Route to create a new comment
router.post('/posts/:postId/comments', createComment);

// Route to get the latest comments for a post
router.get('/posts/:postId/comments', getLatestComments);

// Route to update a comment
router.put('/comments/:commentId', updateComment);

// Route to delete a comment
router.delete('/comments/:commentId', deleteComment);

module.exports = router;