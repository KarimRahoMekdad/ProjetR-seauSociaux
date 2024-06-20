const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + Date.now() + '.' + extension);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const isValidMimeType = MIME_TYPES[file.mimetype];
    if (isValidMimeType) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  }
}).single('image');

module.exports = upload;