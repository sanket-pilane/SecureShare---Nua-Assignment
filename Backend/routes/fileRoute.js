const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadFiles,
  getMyFiles,
  shareFile,
  generateShareLink,
  accessSharedFile,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|csv|txt|zip/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("File type not supported"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter,
});

router.post("/", protect, upload.array("files", 10), uploadFiles);
router.get("/", protect, getMyFiles);
router.post("/:id/share", protect, shareFile);
router.post("/:id/link", protect, generateShareLink);
router.get("/share/:token", protect, accessSharedFile);
router.get("/download/:id", protect, downloadFile);
router.delete("/:id", protect, deleteFile);

module.exports = router;
