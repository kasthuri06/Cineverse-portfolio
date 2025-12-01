const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth');

router.post('/contact', contactController.submitMessage);
router.get('/messages', auth, contactController.getMessages);

module.exports = router;
