const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/postController');
const router = express.Router();

router.post('/posts', authMiddleware, multer, postCtrl.createPost);
router.post('/posts/:postId/like', authMiddleware, postCtrl.likePost);
router.get('/posts', postCtrl.getPosts);
router.get('/postscomments', postCtrl.getPostsComments);
router.delete('/posts/:postId', authMiddleware, postCtrl.deletePost);

module.exports = router;