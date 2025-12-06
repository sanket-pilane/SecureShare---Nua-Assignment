const fs = require("fs");
const path = require("path");
const File = require("../models/fileModel");

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

module.exports = { uploadFiles, getMyFiles };
