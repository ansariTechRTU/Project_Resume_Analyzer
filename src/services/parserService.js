const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === '.pdf' || mimeType === 'application/pdf') {
      const data = fs.readFileSync(filePath);
      const parsed = await pdfParse(data);
      return parsed.text || '';
    }

    if (
      ext === '.docx' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }

    // fallback to plain text
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Error parsing file', err);
    return '';
  }
}

module.exports = { extractTextFromFile };
