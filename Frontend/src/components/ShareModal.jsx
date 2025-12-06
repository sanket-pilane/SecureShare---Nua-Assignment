import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTimes, FaCopy, FaGlobe, FaUserPlus, FaLink } from "react-icons/fa";
import fileService from "../features/files/fileService";

import Button from "./ui/Button";
import Input from "./ui/Input";

const ShareModal = ({ fileId, userToken, onClose }) => {
  const [email, setEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShareEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fileService.shareFile(fileId, email, userToken);
      toast.success("File shared successfully!");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Share failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const data = await fileService.generateLink(fileId, userToken);
      setGeneratedLink(data.link);
      toast.success("Public link created!");
    } catch (error) {
      toast.error("Could not generate link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.info("Copied to clipboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/30">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Share File</h3>
            <p className="text-sm text-slate-400">Manage access permissions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <FaUserPlus className="text-blue-500" />
              <span>Invite User</span>
            </div>
            <form onSubmit={handleShareEmail} className="flex gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="bg-slate-900/50 border-slate-700 focus:ring-blue-500/50"
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "..." : "Invite"}
              </Button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-500">
                Or share via link
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <FaGlobe className="text-purple-500" />
              <span>Public Link</span>
              <span className="text-xs font-normal text-slate-500 ml-auto bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Expires in 24h
              </span>
            </div>

            {generatedLink ? (
              <div className="flex items-center gap-2 p-1.5 pl-3 bg-slate-900 border border-slate-700 rounded-md">
                <FaLink className="text-slate-500 text-sm flex-shrink-0" />
                <input
                  readOnly
                  value={generatedLink}
                  className="bg-transparent border-none text-slate-300 text-sm w-full focus:outline-none"
                />
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex-shrink-0 bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <FaCopy size={14} />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGenerateLink}
                className="w-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300"
                disabled={loading}
              >
                Generate Secure Link
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;
