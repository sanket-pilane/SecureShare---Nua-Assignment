import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Card } from "../ui/Card";
import ActionMenu from "./ActionMenu";
import FileIcon from "./FileIcon";
import { formatBytes } from "../../lib/utils";

const formatFileType = (mimeType) => {
  if (!mimeType) return "FILE";
  const typeMap = {
    "application/pdf": "PDF",
    "image/png": "PNG",
    "image/jpeg": "JPG",
    "image/gif": "GIF",
    "video/mp4": "MP4",
    "video/x-matroska": "MKV",
    "application/zip": "ZIP",
    "text/csv": "CSV",
    "text/plain": "TXT",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
    "application/vnd.ms-powerpoint": "PPT",
  };
  return typeMap[mimeType] || mimeType.split("/")[1]?.toUpperCase() || "FILE";
};

const FileTable = ({
  files,
  onShare,
  onDownload,
  onDeleteRequest,
  onPreview,
  onHistory,
}) => {
  return (
    <Card className="overflow-hidden border-slate-800 bg-slate-900/40 flex flex-col">
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full text-left">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-medium border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 tracking-wider">File Name</th>
              <th className="px-6 py-4 tracking-wider">Size</th>
              <th className="px-6 py-4 tracking-wider">Type</th>
              <th className="px-6 py-4 tracking-wider">Uploaded</th>
              <th className="px-6 py-4 text-right tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {files.length > 0 ? (
                files.map((file, index) => (
                  <motion.tr
                    key={file._id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onPreview(file)}
                    className="group hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800 rounded-lg group-hover:bg-blue-600/10 transition-colors shadow-sm">
                          <FileIcon mimeType={file.mimeType} />
                        </div>
                        <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                          {file.originalName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                      {formatBytes(file.size)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {formatFileType(file.mimeType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionMenu
                        onShare={() => onShare(file)}
                        onDownload={() => onDownload(file)}
                        onDelete={() => onDeleteRequest(file._id)}
                        onViewHistory={() => onHistory(file)}
                      />
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="p-6 bg-slate-900/80 rounded-full border border-slate-800 shadow-inner">
                        <FaCloudUploadAlt
                          size={40}
                          className="text-slate-700"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-400">
                          No files found
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Upload a file to get started.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default FileTable;
