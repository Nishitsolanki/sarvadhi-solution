const Post = require('../model/postmodel');
const Comment = require('../model/commentmodel');


exports.createComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        const { content } = req.body;
        const { username } = req.user; 

      
        const newComment = new Comment({ user: userId, post: postId, content });
        await newComment.save();

        await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

        req.io.emit('comment', { postId, user: username, comment: content });

        res.status(201).json({status:true, newComment, message: 'Comment added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getLatestComments = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.sort((a, b) => b.createdAt - a.createdAt);
        // const latestPosts = await Post.find().sort({ createdAt: -1 });

        return res.status(200).res.json({status:true, post:post.comments});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body;

        if(!commentId){
            return res.status(400).send({status:false,msg:"commentId must be required"})
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
        return res.status(200).res.json({status:true,msg:updatedComment});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        if(!commentId){
            return res.status(400).send({status:false,msg:"commentId must be required"})
        }
        await Comment.findByIdAndDelete(commentId);

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
