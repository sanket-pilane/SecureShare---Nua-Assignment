import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import fileService from "../features/files/fileService";
import { FaFileAlt, FaCloudUploadAlt } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

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
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Files</h1>
        <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
          <FaCloudUploadAlt />
          <span>{uploading ? "Uploading..." : "Upload Files"}</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">
                Size
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">
                Type
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">
                Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file) => (
                <tr key={file._id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <FaFileAlt className="text-gray-400" />
                    {file.originalName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {(file.size / 1024).toFixed(1)} KB
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {file.mimeType}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-500 hover:underline text-sm">
                      Share
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No files found. Upload one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
