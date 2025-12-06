import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaDownload,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import fileService from "../../features/files/fileService";
import Button from "../ui/Button";

const FilePreviewModal = ({ file, userToken, onClose }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activeUrl = null;
    const loadPreview = async () => {
      try {
        setLoading(true);
        // Fetch the secure stream
        const url = await fileService.getFilePreview(file._id, userToken);
        activeUrl = url;
        setBlobUrl(url);
      } catch (err) {
        console.error("Preview failed", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (file) loadPreview();

    return () => {
      if (activeUrl) window.URL.revokeObjectURL(activeUrl);
    };
  }, [file, userToken]);

  // --- MIME TYPE CHECKS ---
  const isImage = file.mimeType.startsWith("image/");
  const isVideo = file.mimeType.startsWith("video/"); // Added Video Check
  const isPdf = file.mimeType === "application/pdf";

  const handleDownload = () => {
    fileService.downloadFile(file._id, userToken, file.originalName);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-slate-100 truncate max-w-md">
              {file.originalName}
            </h2>
            <span className="text-xs text-slate-400">{file.mimeType}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <FaDownload size={14} /> Download
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-950/50 flex items-center justify-center overflow-hidden relative">
          {loading && (
            <div className="flex flex-col items-center gap-3 text-blue-400">
              <FaSpinner size={40} className="animate-spin" />
              <p className="text-sm font-medium">Loading secure preview...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center text-slate-400">
              <FaExclamationTriangle
                size={40}
                className="mx-auto mb-2 text-yellow-500"
              />
              <p>Preview failed to load.</p>
            </div>
          )}

          {!loading && !error && blobUrl && (
            <>
              {/* 1. IMAGE PREVIEW */}
              {isImage && (
                <img
                  src={blobUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain shadow-lg"
                />
              )}

              {/* 2. PDF PREVIEW */}
              {isPdf && (
                <iframe
                  src={blobUrl}
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              )}

              {/* 3. VIDEO PREVIEW (NEW) */}
              {isVideo && (
                <video
                  controls
                  autoPlay
                  className="max-w-full max-h-full shadow-lg"
                >
                  <source src={blobUrl} type={file.mimeType} />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* 4. FALLBACK (Docs, Excel, Zips) */}
              {!isImage && !isPdf && !isVideo && (
                <div className="text-center">
                  <div className="p-6 bg-slate-900 rounded-full inline-block mb-4">
                    <FaDownload size={48} className="text-slate-600" />
                  </div>
                  <p className="text-lg text-slate-200">No preview available</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Browser cannot render {file.mimeType.split("/")[1]} files
                    directly.
                  </p>
                  <Button variant="primary" onClick={handleDownload}>
                    Download to View
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FilePreviewModal;
