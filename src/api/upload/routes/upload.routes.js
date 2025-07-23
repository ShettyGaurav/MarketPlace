const express = require('express');
const multer = require('multer');
const { authenticate, authorize } = require('../../auth/middlewares/auth.middleware');
const { uploadImageController } = require('../controllers/upload.controller');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.post('/', authenticate, authorize(['SELLER']), upload.single('image'), uploadImageController);

module.exports = router;