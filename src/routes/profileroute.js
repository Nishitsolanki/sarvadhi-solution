const express = require('express');
const router = express.Router();
const profileController = require("../controllers/profileController.js")
const MW = require("../middlewares/auth.js")

//====================================  Profile Handlers  ======================================//
router.post("/profile/register", profileController.createProfile)

router.post("/profile/login", profileController.loginUser)

router.get("/profile/:profileId/getProfile",   MW.authentication, MW.authorization('user'),profileController.getProfile)

router.put("/profile/:profileId/update",MW.authentication, MW.authorization('user'), profileController.updateProfile)

router.delete("/profile/:profileId/delete", MW.authentication, MW.authorization('user'), profileController.deleteProfile)

router.put("/profile/:profileId/follow", MW.authentication, MW.authorization('user'), profileController.followProfile)

router.put("/profile/:profileId/unfollow", MW.authentication, MW.authorization('user'), profileController.unfollowProfile)

router.put("/profile/:profileId/block", MW.authentication, MW.authorization('user'), profileController.blockProfile)

router.put("/profile/:profileId/unblock", MW.authentication, MW.authorization('user'), profileController.unblockProfile)

router.put("/profile/:profileId/comment", MW.authentication, MW.authorization('user'),  profileController.commentOnPost)

router.delete("/profile/:profileId/deleteComment", MW.authentication, MW.authorization('user'), profileController.deleteComment)

router.put("/profile/:profileId/like", MW.authentication, MW.authorization('user'), profileController.likePost)

router.put("/profile/:profileId/unlike", MW.authentication, MW.authorization('user'), profileController.unlikePost)

router.get("/profile/:profileId/followerOrFollowingList", MW.authentication, MW.authorization('user'), profileController.followerOrFollowingList)

router.get("/profile/:profileId/getBlockedAccount", MW.authentication, MW.authorization('user'), profileController.getBlockedAccount)


module.exports = router;