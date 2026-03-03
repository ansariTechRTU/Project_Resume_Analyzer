function sanitizeText(s) {
  if (!s) return '';
  return String(s).replace(/[\x00-\x1F\x7F]/g, ' ').trim();
}

module.exports = { sanitizeText };
