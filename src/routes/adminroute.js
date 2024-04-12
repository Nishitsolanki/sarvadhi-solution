const express = require('express');
const router = express.Router();
const postController = require("../controllers/adminController.js")
const MW = require("../middlewares/auth.js")




//====================================  admin handler Handlers  =========================================//

router.get('/posts',MW.authentication, MW.authorization('admin'), postController.getAllUserPosts );
router.delete('/posts/:postId',MW.authentication, MW.authorization('admin'), postController. deletePost);


module.exports = router;