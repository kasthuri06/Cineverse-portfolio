const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Setup Multer (local temp storage only, then send to Cloudinary)
//const storage = multer.diskStorage({}); // No dest: keep in memory
//const upload = multer({ storage });
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
  
  const upload = multer({ storage });
  

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.post('/', auth, upload.single('poster'), projectController.addProject);
router.put('/:id', auth, upload.single('poster'), projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
