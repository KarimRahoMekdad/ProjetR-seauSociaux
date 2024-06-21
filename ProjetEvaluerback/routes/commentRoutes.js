const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('../middleware/multer-config');
const commentCtrl = require('../controllers/commentController');
const router = express.Router();

router.post('/comment', authMiddleware, multer, commentCtrl.createComment);
router.get('/comments/user', authMiddleware, commentCtrl.getCommentsByUser);
router.put('/comments/:id', authMiddleware, multer, commentCtrl.updateComment);
router.delete('/comments/:id', authMiddleware, commentCtrl.deleteComment);

module.exports = router;