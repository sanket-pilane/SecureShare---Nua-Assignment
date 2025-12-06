const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  uploadFiles,
  getMyFiles,
  shareFile,
  generateShareLink,
  accessSharedFile,
  downloadFile,
  deleteFile,
  getFilePermissions,
  removeFileAccess,
  getFileHistory,
} = require("../controllers/fileController");

const { upload } = require("../config/storage");

router.post("/", protect, upload.array("files", 10), uploadFiles);
router.get("/", protect, getMyFiles);
router.post("/:id/share", protect, shareFile);
router.post("/:id/link", protect, generateShareLink);
router.get("/share/:token", protect, accessSharedFile);
router.get("/download/:id", protect, downloadFile);
router.delete("/:id", protect, deleteFile);
router.get("/:id/permissions", protect, getFilePermissions);
router.delete("/:id/permissions/:userId", protect, removeFileAccess);
router.get("/:id/history", protect, getFileHistory);

module.exports = router;
