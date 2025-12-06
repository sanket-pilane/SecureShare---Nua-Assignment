import { useState } from "react";
import { toast } from "react-toastify";
import fileService from "../features/files/fileService";

const ShareModal = ({ fileId, userToken, onClose }) => {
  const [email, setEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleShareEmail = async (e) => {
    e.preventDefault();
    try {
      await fileService.shareFile(fileId, email, userToken);
      toast.success("File shared successfully!");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Share failed");
    }
  };

  const handleGenerateLink = async () => {
    try {
      const data = await fileService.generateLink(fileId, userToken);
      setGeneratedLink(data.link);
      toast.success("Link generated!");
    } catch (error) {
      toast.error("Could not generate link");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.info("Copied to clipboard");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Share File</h2>

        {/* Email Share Section */}
        <form onSubmit={handleShareEmail} className="mb-6 border-b pb-4">
          <label className="block text-sm font-medium mb-2">
            Share with User (Email)
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="user@example.com"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Share
            </button>
          </div>
        </form>

        {/* Link Share Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Public Link (Expires in 24h)
          </label>
          {generatedLink ? (
            <div className="flex gap-2 items-center bg-gray-100 p-2 rounded">
              <span className="text-xs truncate w-48">{generatedLink}</span>
              <button
                onClick={copyToClipboard}
                className="text-blue-600 text-sm font-bold"
              >
                Copy
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerateLink}
              className="w-full bg-slate-800 text-white py-2 rounded"
            >
              Generate Link
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
