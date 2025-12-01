const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Only use register to create first admin account, then disable in production!
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
