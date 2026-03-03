
module.exports = {
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024) // 5MB
};
