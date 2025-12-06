import { motion, AnimatePresence } from "framer-motion";
import { FaFileAlt, FaCloudUploadAlt } from "react-icons/fa";
import { Card } from "../ui/Card";
import ActionMenu from "./ActionMenu";
import { formatBytes } from "../../lib/utils";

const FileTable = ({ files, onShare, onDownload, onDeleteRequest }) => {
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800 text-slate-300 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                          <FaFileAlt />
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
                        {file.mimeType.split("/")[1]?.toUpperCase() || "FILE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionMenu
                        onShare={() => onShare(file)}
                        onDownload={() => onDownload(file)}
                        onDelete={() => onDeleteRequest(file._id)}
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
