const Comment = require('../models/Comment');
const Post = require('../models/Post')

exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }
    const comment = new Comment({
      content,
      userId: req.auth.userId,
      postId
    });
    await comment.save();

    const post = await Post.findById(postId); 
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentsByUser = async (req, res) => {
    try {
      const userId = req.auth.userId;
  
      const comments = await Comment.find({ userId: userId });
  
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.deleteComment = async (req, res) => {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      if (comment.userId.toString() !== req.auth.userId) {
        return res.status(403).json({ error: 'Unauthorized action' });
      }
      
      await Comment.findByIdAndDelete(commentId);
      
      const post = await Post.findById(comment.postId);
      post.comments.pull(commentId);
      await post.save();
  
      res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };