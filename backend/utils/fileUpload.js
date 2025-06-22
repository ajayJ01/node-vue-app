const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Uploads a file with validation and streaming
 */
async function uploadFile(part, options = {}) {
  const {
    folder = 'uploads',
    allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'],
    maxSizeMB = 5,
  } = options;

  if (!part || !part.file || !part.filename) {
    throw new Error('No file uploaded.');
  }

  const ext = path.extname(part.filename).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
  }

  const randomName = crypto.randomBytes(16).toString('hex') + ext;
  const relativePath = path.join(folder, randomName);
  const absolutePath = path.resolve(__dirname, '..', relativePath);

  await fs.promises.mkdir(path.dirname(absolutePath), { recursive: true });

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(absolutePath);
    part.file.pipe(writeStream);

    part.file.on('end', () => {
      resolve('/' + relativePath.replace(/\\/g, '/'));
    });

    part.file.on('error', (err) => {
      console.error('File Stream Error:', err.message);
      reject(new Error('File upload failed'));
    });

    writeStream.on('error', (err) => {
      console.error('Write Stream Error:', err.message);
      reject(new Error('File write failed'));
    });
  });
}

module.exports = { uploadFile };
