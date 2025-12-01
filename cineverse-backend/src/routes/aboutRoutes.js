const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', aboutController.getAbout);
router.put('/', auth, upload.array('teamPhotos'), aboutController.updateAbout);

module.exports = router;

