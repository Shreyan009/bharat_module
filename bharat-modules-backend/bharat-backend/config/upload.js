const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

async function uploadToCloudinary(buffer, folder, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = {
  upload,
  uploadToCloudinary
};
