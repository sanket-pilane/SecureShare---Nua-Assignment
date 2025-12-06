const mongoose = require("mongoose");

const auditSchema = mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["UPLOAD", "DOWNLOAD", "SHARE", "DELETE", "REVOKE"],
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    details: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLog", auditSchema);
