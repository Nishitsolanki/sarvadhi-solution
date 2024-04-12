const postModel = require("../models/postModel.js")

//====================================  admin get all post   ===========================================//

const getAllUserPosts = async (req, res) => {
    try {
      const allPosts = await postModel.find();
      res.status(200).json({ status: true, data: allPosts });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

//====================================  admin delete post  ===========================================//


const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        if (!postId) {
            return res.status(400).send({ status: true, msg: "postId is mandatory" });
        }

        await postModel.findByIdAndDelete(postId);

        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


module.exports ={deletePost,getAllUserPosts}