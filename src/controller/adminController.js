const Post = require('../model/postmodel');

exports.getAllUserPosts = async (req, res) => {
    try {
        const allPosts = await Post.find().populate('user', 'username');
        return res.status(200).res.json({status: true, msg:allPosts});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        if(!postId){
            return res.status(400).json({status:true,msg:"postId is mandatory"})
        }

        await Post.findByIdAndRemove(postId);

        return res.status(200).res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};