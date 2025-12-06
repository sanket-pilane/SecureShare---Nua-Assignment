const AuditLog = require("../models/auditModel");

const logActivity = async (action, fileId, userId, details = "") => {
  try {
    await AuditLog.create({
      action,
      file: fileId,
      performedBy: userId,
      details,
    });
  } catch (error) {
    console.error("Audit Log Failed:", error);
    // We do not throw error here to avoid blocking the main user action
  }
};

module.exports = { logActivity };
