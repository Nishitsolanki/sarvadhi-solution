const postModel = require("../models/postModel.js")

//====================================  admin get all post   ===========================================//

const getAllUserPosts = async (req, res) => {
    try {
        const allPosts = await postModel.find()
        return res.status(200).res.send({status: true, msg:allPosts});
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
};

//====================================  admin delete post  ===========================================//


const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        if(!postId){
            return res.status(400).send({status:true,msg:"postId is mandatory"})
        }

        await postModel.findByIdAndRemove(postId);

        return res.status(200).res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
};

module.exports ={deletePost,getAllUserPosts}