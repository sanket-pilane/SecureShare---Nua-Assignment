import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";

import AuthContext from "../context/AuthContext";
import fileService from "../features/files/fileService";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardToolbar from "../components/dashboard/DashboardToolbar";
import FileTable from "../components/dashboard/FileTable";
import DeleteConfirmationModal from "../components/dashboard/DeleteConfirmationModal";
import FilePreviewModal from "../components/dashboard/FilePreviewModal";
import ShareModal from "../components/ShareModal";
import FileHistoryModal from "../components/dashboard/FileHistoryModal";
const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [historyFile, setHistoryFile] = useState(null);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const filteredFiles = files.filter((f) =>
    f.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchFiles = async () => {
    try {
      const data = await fileService.getFiles(user.token);
      setFiles(data);
    } catch (error) {
      toast.error("Failed to load files");
    }
  };

  useEffect(() => {
    if (user) fetchFiles();
  }, [user]);

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      await fileService.uploadFiles(selectedFiles, user.token, (progress) => {
        setUploadProgress(progress);
      });
      toast.success("Files uploaded successfully");
      fetchFiles();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    const fileToDelete = files.find((f) => f._id === deleteConfirm);
    if (!fileToDelete) return;

    const isOwner =
      fileToDelete.owner === user._id || fileToDelete.owner?._id === user._id;

    try {
      if (isOwner) {
        await fileService.deleteFile(deleteConfirm, user.token);
        toast.success("File permanently deleted");
      } else {
        await fileService.revokeAccess(deleteConfirm, user._id, user.token);
        toast.success("File removed from your view");
      }

      setFiles(files.filter((f) => f._id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDownload = (file) => {
    fileService.downloadFile(file._id, user.token, file.originalName);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChange({ target: { files: droppedFiles } });
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 p-6 selection:bg-blue-500/30 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-blue-500 border-dashed rounded-xl m-4 pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-bold text-white">Drop files here</h2>
            <p className="text-blue-200">to upload them instantly</p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto space-y-8">
        <DashboardHeader userName={user?.name} totalSize={totalSize} />

        <DashboardToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          uploading={uploading}
          onFileChange={handleFileChange}
        />

        <FileTable
          files={filteredFiles}
          onShare={(file) => setSelectedFile(file)}
          onDownload={handleDownload}
          onDeleteRequest={(id) => setDeleteConfirm(id)}
          onPreview={(file) => setPreviewFile(file)}
          onHistory={(file) => setHistoryFile(file)}
        />
      </div>

      <AnimatePresence>
        {selectedFile && (
          <ShareModal
            fileId={selectedFile._id}
            userToken={user.token}
            onClose={() => setSelectedFile(null)}
          />
        )}

        {deleteConfirm && (
          <DeleteConfirmationModal
            onConfirm={handleDelete}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}

        {previewFile && (
          <FilePreviewModal
            file={previewFile}
            userToken={user.token}
            onClose={() => setPreviewFile(null)}
          />
        )}

        {historyFile && (
          <FileHistoryModal
            file={historyFile}
            userToken={user.token}
            onClose={() => setHistoryFile(null)}
          />
        )}
      </AnimatePresence>

      {uploading && (
        <div className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-4 z-50 shadow-2xl">
          <div className="max-w-6xl mx-auto flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                Uploading {files.length > 1 ? "files" : "file"}...
              </span>
              <span className="text-xs text-slate-400">
                Please do not close this window
              </span>
            </div>
            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-lg font-bold text-blue-400 w-24 text-right font-mono">
              {uploadProgress === 100 ? "Processing..." : `${uploadProgress}%`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
