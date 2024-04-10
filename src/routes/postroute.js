const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController.js")
const MW = require("../middlewares/auth.js")




//====================================  Post Handlers  =========================================//
router.post("/post/create",  postController.createPost)

router.get("/post/:profileId/getPost/:postId", MW.authentication, MW.authorization, postController.getPost)

router.get("/post/:profileId/getLikesList/:postId", MW.authentication, MW.authorization, postController.getLikesList)

router.get("/post/:profileId/getCommentsList/:postId", MW.authentication, MW.authorization, postController.getCommentsList)

router.put("/post/:profileId/updatePost/:postId", MW.authentication, MW.authorization, postController.updatePost)

router.delete("/post/:profileId/deletePost/:postId", MW.authentication, MW.authorization, postController.deletePost)





//====================================  Invalid API  ==========================================//
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you requested is not available!"
    })
})


module.exports = router;