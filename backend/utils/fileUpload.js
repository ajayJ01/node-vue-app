const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function uploadFile(partData, options = {}) {
  const {
    folder = "uploads",
    allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp"],
    maxSizeMB = 5,
  } = options;

  if (!partData || !partData.buffer || !partData.filename) {
    throw new Error(
      "Invalid file data provided for upload. Missing buffer or filename."
    );
  }

  const ext = path.extname(partData.filename).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error(
      `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`
    );
  }

  const fileSizeInBytes = partData.buffer.length;
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;
  if (fileSizeInBytes > maxSizeInBytes) {
    throw new Error(
      `File size (${(fileSizeInBytes / (1024 * 1024)).toFixed(
        2
      )} MB) exceeds the limit of ${maxSizeMB} MB.`
    );
  }

  const randomName = crypto.randomBytes(16).toString("hex") + ext;
  const relativePath = path.join(folder, randomName);

  // FIX: Changed '..', '..' to just '..' to correctly resolve to project root
  const absolutePath = path.resolve(__dirname, "..", relativePath);

  // Ensure the upload directory exists, including subfolders like 'uploads/tasks'
  await fs.promises.mkdir(path.dirname(absolutePath), { recursive: true });

  try {
    await fs.promises.writeFile(absolutePath, partData.buffer);
    // console.log(`💾 File saved to: ${absolutePath}`);
    // Return web-accessible relative URL (normalize for Windows paths)
    return "/" + relativePath.replace(/\\/g, "/");
  } catch (err) {
    console.error("🚨 Error writing file to disk:", err);
    throw new Error(`File write failed: ${err.message}`);
  }
}

module.exports = { uploadFile };
