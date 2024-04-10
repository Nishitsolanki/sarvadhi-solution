const express = require('express');
const router = express.Router();
const postController = require("../controllers/adminController.js")
const MW = require("../middlewares/auth.js")




//====================================  admin handler Handlers  =========================================//

router.get('/posts',MW.authentication, MW.adminAuthorization, postController.getAllUserPosts );
router.delete('/posts/:postId',MW.authentication, MW.adminAuthorization, postController. deletePost);

//====================================  Invalid API  ==========================================//
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you requested is not available!"
    })
})


module.exports = router;