import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";

// Context & Services
import AuthContext from "../context/AuthContext";
import fileService from "../features/files/fileService";

// Sub Components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardToolbar from "../components/dashboard/DashboardToolbar";
import FileTable from "../components/dashboard/FileTable";
import DeleteConfirmationModal from "../components/dashboard/DeleteConfirmationModal";
import ShareModal from "../components/ShareModal";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // States
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const filteredFiles = files.filter((f) =>
    f.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // API Actions
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
    // eslint-disable-next-line
  }, [user]);

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      await fileService.uploadFiles(selectedFiles, user.token);
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
    try {
      await fileService.deleteFile(deleteConfirm, user.token);
      setFiles(files.filter((f) => f._id !== deleteConfirm));
      toast.success("File deleted");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Could not delete file");
    }
  };

  const handleDownload = (file) => {
    fileService.downloadFile(file._id, user.token, file.originalName);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 selection:bg-blue-500/30">
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
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
