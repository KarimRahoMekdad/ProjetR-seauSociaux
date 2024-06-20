const express = require('express');
const authCtrl = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/logout', authMiddleware, authCtrl.logout);

module.exports = router;