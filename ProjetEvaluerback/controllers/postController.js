const Post = require('../models/Post');
const mongoose = require('mongoose');

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    let imageUrl = '';
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    const post = new Post({
      title,
      content,
      imageUrl,
      userId: req.auth.userId
    });
    await post.save();
    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostsComments = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('comments')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.auth.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({ message: 'Like status updated', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.deletePost = async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const userId = req.auth.userId;

//     const post = await Post.findOne()

//     if (!post) {
//       return res.status(404).json({ error: 'Post not found or you are not authorized to delete it' });
//     }

//     await post.remove();

//     res.status(200).json({ message: 'Post deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.auth.userId;

    const post = await Post.findOne({ _id: postId, userId: userId });

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found or you are not authorized to delete it' });
    }

    await Post.deleteOne({ _id: postId, userId: userId });


    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
