const multer = require("multer");
const storage = multer.memoryStorage();
const path = require("path");

function fileFilter(req, file, cb) {
  const fileExtension = path.extname(file.originalname);
  const allowExtension = [".jpeg", ".png", ".avif"];

  if (allowExtension.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Apologies , File format not supported"));
  }
}

// File size limits demands in bytes
// KB -> 1024 bytes
// MB -> 1024 KB
// GB -> 1024 MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 }, // 1MB
});

module.exports = upload;
