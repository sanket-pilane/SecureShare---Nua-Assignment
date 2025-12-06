import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaHistory,
  FaCloudUploadAlt,
  FaDownload,
  FaShareAlt,
  FaTrash,
} from "react-icons/fa";
import fileService from "../../features/files/fileService";

const FileHistoryModal = ({ file, userToken, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await fileService.getFileHistory(file._id, userToken);
        setLogs(data);
      } catch (error) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [file, userToken]);

  const getIcon = (action) => {
    switch (action) {
      case "UPLOAD":
        return <FaCloudUploadAlt className="text-blue-400" />;
      case "DOWNLOAD":
        return <FaDownload className="text-green-400" />;
      case "SHARE":
        return <FaShareAlt className="text-purple-400" />;
      case "DELETE":
        return <FaTrash className="text-red-400" />;
      default:
        return <FaHistory className="text-slate-400" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/30">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FaHistory className="text-blue-500" /> Activity Log
            </h3>
            <p className="text-sm text-slate-400 truncate max-w-xs">
              {file.originalName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <p className="text-center text-slate-500 py-4">
              Loading activity...
            </p>
          ) : logs.length === 0 ? (
            <p className="text-center text-slate-500 py-4">
              No activity recorded yet.
            </p>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  {/* Icon Marker */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {getIcon(log.action)}
                  </div>

                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-200 text-sm">
                        {log.performedBy?.name || "Unknown User"}
                      </div>
                      <time className="font-mono text-xs text-slate-500">
                        {formatDate(log.createdAt)}
                      </time>
                    </div>
                    <div className="text-slate-400 text-xs">
                      <span className="font-semibold text-blue-400">
                        {log.action}
                      </span>
                      {log.details && (
                        <span className="text-slate-500"> - {log.details}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FileHistoryModal;
