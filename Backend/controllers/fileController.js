const fs = require("fs");
const path = require("path");
const File = require("../models/fileModel");
const crypto = require("crypto");
const User = require("../models/userModel");

const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const fileRecords = [];

  for (const file of req.files) {
    const newFile = new File({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      owner: req.user.id,
      accessControl: [req.user.id],
    });

    const savedFile = await newFile.save();
    fileRecords.push(savedFile);
  }

  res.status(201).json(fileRecords);
};

const getMyFiles = async (req, res) => {
  const files = await File.find({
    $or: [{ owner: req.user.id }, { accessControl: req.user.id }],
  }).sort({ createdAt: -1 });

  res.status(200).json(files);
};

const shareFile = async (req, res) => {
  const { email } = req.body;
  const file = await File.findById(req.params.id);

  if (!file) return res.status(404).json({ message: "File not found" });

  if (file.owner.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const userToShare = await User.findOne({ email });
  if (!userToShare) {
    return res.status(404).json({ message: "User not found" });
  }

  if (file.accessControl.includes(userToShare._id)) {
    return res.status(400).json({ message: "User already has access" });
  }

  file.accessControl.push(userToShare._id);
  await file.save();

  res.status(200).json({ message: `Shared with ${userToShare.name}` });
};

const generateShareLink = async (req, res) => {
  const file = await File.findById(req.params.id);

  if (file.owner.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = crypto.randomBytes(16).toString("hex");

  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);

  file.shareToken = token;
  file.shareExpiresAt = expiryDate;
  await file.save();

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

const deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  if (file.owner.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await File.deleteOne({ _id: req.params.id });

  res.status(200).json({ id: req.params.id });
};

const downloadFile = async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) return res.status(404).json({ message: "File not found" });

  const isAuthorized =
    file.owner.toString() === req.user.id ||
    file.accessControl.includes(req.user.id);

  if (!isAuthorized) {
    return res.status(403).json({ message: "Access Denied" });
  }

  const filePath = path.join(__dirname, "../", file.path);
  res.download(filePath, file.originalName);
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

  if (!isOwner && !hasAccess) {
    return res
      .status(403)
      .json({ message: "Not authorized to view permissions" });
  }

  res.status(200).json({
    owner: file.owner,
    accessControl: file.accessControl,
  });
};

const removeFileAccess = async (req, res) => {
  const { userId } = req.params;
  const file = await File.findById(req.params.id);

  if (!file) return res.status(404).json({ message: "File not found" });

  const isOwner = file.owner.toString() === req.user.id;
  const isSelfRemoval = req.user.id === userId;

  if (!isOwner && !isSelfRemoval) {
    return res
      .status(403)
      .json({ message: "Not authorized to remove this user" });
  }

  file.accessControl = file.accessControl.filter(
    (id) => id.toString() !== userId
  );
  await file.save();

  res.status(200).json({
    message: isSelfRemoval ? "Removed from your dashboard" : "Access revoked",
  });
};

module.exports = {
  uploadFiles,
  getMyFiles,
  shareFile,
  generateShareLink,
  accessSharedFile,
  downloadFile,
  deleteFile,
  getFilePermissions,
  removeFileAccess,
};
