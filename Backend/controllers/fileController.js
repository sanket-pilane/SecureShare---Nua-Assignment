const fs = require("fs");
const path = require("path");
const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const File = require("../models/fileModel");
const { s3 } = require("../config/storage");

// --- UPLOAD LOGIC ---
const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const fileRecords = [];

  for (const file of req.files) {
    const storagePath = file.location || file.path;

    const newFile = new File({
      filename: file.key || file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: storagePath,
      owner: req.user.id,
      accessControl: [req.user.id],
    });

    const savedFile = await newFile.save();
    fileRecords.push(savedFile);
  }

  res.status(201).json(fileRecords);
};

// --- GET FILES LOGIC ---
const getMyFiles = async (req, res) => {
  const files = await File.find({
    $or: [{ owner: req.user.id }, { accessControl: req.user.id }],
  }).sort({ createdAt: -1 });

  res.status(200).json(files);
};

// --- DOWNLOAD LOGIC (Fixed for Spaces/Special Chars) ---
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "File not found" });

    const isAuthorized =
      file.owner.toString() === req.user.id ||
      file.accessControl.includes(req.user.id);

    if (!isAuthorized)
      return res.status(403).json({ message: "Access Denied" });

    if (file.path.startsWith("http")) {
      // S3 PROXY STREAM
      const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

      // FIX: Decode the URL to turn "%20" back into " " (space)
      const rawKey = file.path.replace(bucketUrl, "");
      const fileKey = decodeURIComponent(rawKey);

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      });

      const s3Item = await s3.send(command);

      res.setHeader("Content-Type", file.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.originalName}"`
      );

      s3Item.Body.pipe(res);
    } else {
      // LOCAL FILE SYSTEM
      const filePath = path.resolve(__dirname, "..", file.path);

      if (fs.existsSync(filePath)) {
        res.download(filePath, file.originalName);
      } else {
        res.status(404).json({ message: "File missing from server disk" });
      }
    }
  } catch (error) {
    console.error("Download Error:", error);
    // Don't crash the server, send a cleaner error
    res.status(500).json({ message: "Download failed", error: error.message });
  }
};

// --- DELETE LOGIC (Fixed for Spaces/Special Chars) ---
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "File not found" });

    // Strict Rule: Only Owner can delete
    if (file.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (file.path.startsWith("http")) {
      // S3 DELETION
      const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

      // FIX: Decode here too
      const rawKey = file.path.replace(bucketUrl, "");
      const fileKey = decodeURIComponent(rawKey);

      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      });

      await s3.send(command);
      console.log(`Deleted from S3: ${fileKey}`);
    } else {
      // LOCAL DELETION
      const filePath = path.resolve(__dirname, "..", file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted from Disk: ${filePath}`);
      }
    }

    await File.deleteOne({ _id: req.params.id });
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Could not delete file" });
  }
};

// --- PERMISSIONS / SHARING ---

const shareFile = async (req, res) => {
  const { email } = req.body;
  const file = await File.findById(req.params.id);
  // ... (No changes needed here, assuming you have User model imported if not add it)
  // Note: Ensure User model is required at top if used here.
  // For brevity, assuming existing logic from previous steps is preserved if omitted.
  // I will add the basic logic back for safety:
  const User = require("../models/userModel");

  if (!file) return res.status(404).json({ message: "File not found" });
  if (file.owner.toString() !== req.user.id)
    return res.status(401).json({ message: "Not authorized" });

  const userToShare = await User.findOne({ email });
  if (!userToShare) return res.status(404).json({ message: "User not found" });

  if (!file.accessControl.includes(userToShare._id)) {
    file.accessControl.push(userToShare._id);
    await file.save();
  }
  res.status(200).json({ message: `Shared with ${userToShare.name}` });
};

const getFilePermissions = async (req, res) => {
  const file = await File.findById(req.params.id)
    .populate("owner", "name email")
    .populate("accessControl", "name email");

  if (!file) return res.status(404).json({ message: "File not found" });

  const isOwner = file.owner._id.toString() === req.user.id;
  const hasAccess = file.accessControl.some(
    (u) => u._id.toString() === req.user.id
  );

  if (!isOwner && !hasAccess)
    return res.status(403).json({ message: "Not authorized" });

  res
    .status(200)
    .json({ owner: file.owner, accessControl: file.accessControl });
};

const removeFileAccess = async (req, res) => {
  const { userId } = req.params;
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });

  const isOwner = file.owner.toString() === req.user.id;
  const isSelfRemoval = req.user.id === userId;

  if (!isOwner && !isSelfRemoval)
    return res.status(403).json({ message: "Not authorized" });

  file.accessControl = file.accessControl.filter(
    (id) => id.toString() !== userId
  );
  await file.save();

  res.status(200).json({ message: "Access revoked" });
};

const generateShareLink = async (req, res) => {
  const crypto = require("crypto");
  const file = await File.findById(req.params.id);
  if (file.owner.toString() !== req.user.id)
    return res.status(401).json({ message: "Not authorized" });

  const token = crypto.randomBytes(16).toString("hex");
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);

  file.shareToken = token;
  file.shareExpiresAt = expiryDate;
  await file.save();

  // In production use process.env.FRONTEND_URL
  const link = `http://localhost:5173/share/${token}`;
  res.status(200).json({ link, expiresAt: expiryDate });
};

const accessSharedFile = async (req, res) => {
  const { token } = req.params;
  const file = await File.findOne({
    shareToken: token,
    shareExpiresAt: { $gt: Date.now() },
  });
  if (!file) return res.status(404).json({ message: "Link invalid/expired" });

  if (
    !file.accessControl.includes(req.user.id) &&
    file.owner.toString() !== req.user.id
  ) {
    file.accessControl.push(req.user.id);
    await file.save();
  }
  res.status(200).json(file);
};

module.exports = {
  uploadFiles,
  getMyFiles,
  downloadFile,
  deleteFile,
  shareFile,
  getFilePermissions,
  removeFileAccess,
  generateShareLink,
  accessSharedFile,
};
