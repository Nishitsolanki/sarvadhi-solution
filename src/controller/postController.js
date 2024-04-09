const User = require('../model/usermodel');
const Post = require('../model/postmodel');
const Like = require('../model/likemodel');

// exports.createPost = async (req, res) => {
//     try {
//         const { content, media, hashtags } = req.body;
//         const user = req.user.id;

//         const newPost = new Post({
//             user,
//             content,
//             media,
//             hashtags
//         });

//         const post = await newPost.save();
//         res.json(post);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Retrieve posts by specific user
// exports.getUserPosts = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const posts = await Post.find({ user: userId });
//         res.json(posts);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

exports.createPost = async (req, res) => {
  try {
      const { content,hashtags } = req.body;
      const userId = req.user.userId; 

      const newPost = new Post({
          content,
          user: userId,
          hashtags
      });

      await newPost.save();

      res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
  }
};


exports.getLatestPosts = async (req, res) => {
  try {
      
      const latestPosts = await Post.find().sort({ createdAt: -1 });

      return res.status(200).res.json({status:true,msg:latestPosts});
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
  }
};

// Search posts by hashtags
exports.searchByHashtag = async (req, res) => {
    try {
        const hashtag = req.params.hashtag;
        const posts = await Post.find({ hashtags: hashtag });
        return res.status(200).res.json({status:true,msg:posts});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};





// exports.likePost = async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         const userId = req.user.id;

//         const existingLike = await Like.findOne({ user: userId, post: postId });
//         if (existingLike) {
//             return res.status(400).json({ message: 'You already liked this post' });
//         }

//         const like = new Like({ user: userId, post: postId });
//         await like.save();

//         const post = await Post.findByIdAndUpdate(postId, { $push: { likes: like._id } }, { new: true });

//         res.json(post);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

exports.likePost = async (req, res) => {
  try {
      const postId = req.params.postId;
      const userId = req.user.userId;
      const { username } = req.user; 

      const existingLike = await Like.findOne({ user: userId, post: postId });
      if (existingLike) {
          return res.status(400).json({ message: 'You already liked this post' });
      }

      const like = new Like({ user: userId, post: postId });
      await like.save();

      const post = await Post.findByIdAndUpdate(postId, { $push: { likes: like._id } }, { new: true });

      req.io.emit('like', { postId, user: username });

      return res.status(200).json({status:true,msg:post});
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
  }
};


exports.unlikePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const like = await Like.findOneAndDelete({ user: userId, post: postId });
        if (!like) {
            return res.status(400).json({ message: 'You have not liked this post' });
        }

        const post = await Post.findByIdAndUpdate(postId, { $pull: { likes: like._id } }, { new: true });

        return res.status(200).res.json({status:true,msg:post});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
