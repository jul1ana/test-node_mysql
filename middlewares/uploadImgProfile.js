const multer = require("multer");
const path = require("path");

module.exports = (multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/upload/users")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now().toString() + req.userId + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const extensionImg = ["image/png", "image/jpg", "image/jpeg"].find(formatAccepted => formatAccepted == file.mimetype);

    // extensao aceita
    if (extensionImg) {
      return cb(null, true);
    }

    return cb(null, false);
  }
}));