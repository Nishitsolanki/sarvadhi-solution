const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');
const Follow = require('../model/Follow');
const {uploadFile} = require('../aws/aws')
const multer = require('multer')

exports.signup = async (req, res) => {
    try {
        const {name, username, email, password, bio } = req.body;
        const file = req.files;
        const hashedPassword = await bcrypt.hash(password, 10);

        if(!name){
            return res.status(400).json({status:false,message: "name is required"})
        }

        if(!username){
            return res.status(400).json({status:false,message: "username is required"})
        }

        if (!file || file.length === 0) {
            return res.status(400).send({ msg: "Files are required!" });
          }

        let existingUser = await User.findOne({ email,username });
        if (existingUser) {
          return res.status(400).json({ error: 'this is already exists' });
        }
    
        let uploadImage;
        if (file && file.length > 0) {
          uploadImage = await uploadFile(file[0]);
        }
    
        const newUser = new User({
          username,
          email,
          password:hashedPassword,
          bio,
          profileImage: uploadImage,
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, { expiresIn: '1h' });

        return res.status(201).json({status:true,newUser,token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // User id from JWT payload

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const file = req.files;
       
        const { username, email } = req.body;

          let profileImage;
        if (file && file.length > 0) {
            profileImage = await uploadFile(file[0]);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
       if(profileImage) user.profileImage = profileImage

        await user.save();

        return res.status(200).res.json({status:true,msg:user});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId;

        await User.findByIdAndDelete(userId);

        return res.status(200).res.json({ message: 'User account deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.followUser = async (req, res) => {
    try {
        const { followerId, followingId } = req.body;

        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
        if (existingFollow) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        const follow = new Follow({ follower: followerId, following: followingId });
        await follow.save();

        return res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { followerId, followingId } = req.body;

        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
        if (!existingFollow) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        await Follow.findOneAndDelete({ follower: followerId, following: followingId });

        return res.status(200).res.json({status:true, message: 'User unfollowed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const followers = await Follow.find({ following: userId }).populate('follower', 'username');

        return res.status(200).res.json({status:true, msg:followers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

      
        const following = await Follow.find({ follower: userId }).populate('following', 'username');

        return res.status(200).res.json({status:true,msg: following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};