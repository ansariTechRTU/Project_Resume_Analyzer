const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { analyzeHandler, getResultHandler } = require('../controllers/analyzeController');
const config = require('../config');

// ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', '..', config.uploadDir);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // timestamp-random-original
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname.replace(/\s+/g,'_');
    cb(null, uniqueName);
  }
});

// only allow certain file types
function fileFilter(req, file, cb) {
  const allowed = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter
});

// POST /api/analyze
router.post(
  '/analyze',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jobDescFile', maxCount: 1 }
  ]),
  analyzeHandler
);

// GET /api/result/:id
router.get('/result/:id', getResultHandler);

module.exports = router;
