import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import fileService from "../features/files/fileService";
import ShareModal from "../components/ShareModal";
import {
  FaFileAlt,
  FaCloudUploadAlt,
  FaShareAlt,
  FaDownload,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

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

  const onShareClick = (file) => {
    setSelectedFile(file);
  };

  const onDownloadClick = async (file) => {
    try {
      toast.info("Starting download...");
      await fileService.downloadFile(file._id, user.token, file.originalName);
    } catch (error) {
      console.error(error);
      toast.error("Download Failed. You might not have permission.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Files</h1>
          <p className="text-gray-500">
            Manage and share your documents securey.
          </p>
        </div>

        <label
          className={`flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded shadow hover:bg-blue-700 transition cursor-pointer ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaCloudUploadAlt size={20} />
          <span className="font-medium">
            {uploading ? "Uploading..." : "Upload Files"}
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600 uppercase tracking-wider">
                Size
              </th>
              <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600 uppercase tracking-wider">
                Uploaded
              </th>
              <th className="text-right py-4 px-6 font-semibold text-sm text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {files.length > 0 ? (
              files.map((file) => (
                <tr
                  key={file._id}
                  className="hover:bg-slate-50 transition duration-150"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded">
                        <FaFileAlt />
                      </div>
                      <span className="font-medium text-slate-800">
                        {file.originalName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    {formatBytes(file.size)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded text-xs uppercase">
                      {file.mimeType.split("/")[1] || "FILE"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onShareClick(file)}
                        className="text-slate-500 hover:text-blue-600 transition tooltip"
                        title="Share"
                      >
                        <FaShareAlt size={18} />
                      </button>
                      <button
                        onClick={() => onDownloadClick(file)}
                        className="text-slate-500 hover:text-green-600 transition"
                        title="Download"
                      >
                        <FaDownload size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <FaCloudUploadAlt size={40} className="text-gray-300" />
                    <p>No files found. Upload one to get started.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedFile && (
        <ShareModal
          fileId={selectedFile._id}
          userToken={user.token}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
