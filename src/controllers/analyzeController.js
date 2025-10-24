
const fs = require('fs');
const Analysis = require('../models/Analysis');
const { extractTextFromFile } = require('../services/parserService');
const { analyze } = require('../services/analysisService');
const { sanitizeText } = require('../utils/sanitize');

async function analyzeHandler(req, res) {
  try {
    const files = req.files || {};
    const resumeFile = files.resume ? files.resume[0] : null;
    const jobDescFile = files.jobDescFile ? files.jobDescFile[0] : null;

    // support both names just in case
    const pastedJobText = sanitizeText(
      req.body.jobDescText || req.body.jobDescriptionText || ''
    );

    // 1. extract resume text
    let resumeText = '';
    if (resumeFile) {
      resumeText = await extractTextFromFile(
        resumeFile.path,
        resumeFile.mimetype
      );
    }

    // 2. extract job desc text
    let jdText = '';
    if (jobDescFile) {
        jdText = await extractTextFromFile(
          jobDescFile.path,
          jobDescFile.mimetype
        );
    } else {
        jdText = pastedJobText;
    }

    console.log(`📄 Resume text length: ${resumeText.length}`);
    console.log(`📄 Job description text length: ${jdText.length}`);

    // 3. analyze
    const result = analyze(resumeText, jdText);

    // 4. save to Mongo
    const doc = new Analysis({
      resumeOriginalName: resumeFile ? resumeFile.originalname : null,
      resumePath:       resumeFile ? resumeFile.path : null,
      resumeTextSnippet: resumeText.slice(0, 500),

      jobDescOriginalName: jobDescFile ? jobDescFile.originalname : null,
      jobDescText: jdText,

      extractedSkills: result.extractedSkills,
      missingSkills: result.missingSkills,
      matches: result.matches,
      score: result.score
    });

    await doc.save();

    // 5. return ID so frontend can redirect to /results.html?id=<id>
    return res.json({
      success: true,
      id: doc._id.toString()
      // (we COULD also include 'analysis: doc' here, but we don't need to anymore)
    });
  } catch (err) {
    console.error('analyzeHandler error', err);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: err.message
    });
  }
}

// GET /api/result/:id  -> frontend uses this on results.html
async function getResultHandler(req, res) {
  try {
    const { id } = req.params;
    const doc = await Analysis.findById(id).lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: 'Result not found'
      });
    }

    return res.json({
      success: true,
      analysis: doc
    });
  } catch (err) {
    console.error('getResultHandler error', err);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: err.message
    });
  }
}

module.exports = { analyzeHandler, getResultHandler };
