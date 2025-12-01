const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.get('/', serviceController.getServices);
router.post('/', auth, upload.single('icon'), serviceController.addService);
router.put('/:id', auth, upload.single('icon'), serviceController.updateService);
router.delete('/:id', auth, serviceController.deleteService);

module.exports = router;
