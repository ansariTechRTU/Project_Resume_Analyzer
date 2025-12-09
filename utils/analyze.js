// src/analyze.js
const express = require('express');
const multer = require('multer');
const { analyzeCVvsJob } = require('./index');

const router = express.Router();

// Upload klasörü
const upload = multer({ dest: 'uploads/' });

// 🚀 UI’DE GÖNDERİLEN FIELD İSİMLERİNE GÖRE DÜZELTİLDİ
router.post(
  '/analyze',
  upload.fields([{ name: 'resume' }, { name: 'jobDescFile' }]),
  async (req, res) => {
    try {
      const resumeFile = req.files['resume']?.[0];
      const jobFile = req.files['jobDescFile']?.[0];

      if (!resumeFile || !jobFile) {
        return res.status(400).json({
          success: false,
          error: 'Please upload both files.',
        });
      }

      console.log('📂 Files:', resumeFile.path, jobFile.path);

      // analiz çağrısı
      const result = await analyzeCVvsJob(
        resumeFile.path,
        jobFile.path,
        resumeFile.mimetype,
        jobFile.mimetype
      );

      // UI’nin beklediği formatta cevap dön
      return res.json({
        success: true,
        ...result,
      });

    } catch (error) {
      console.error('❌ Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

module.exports = router;