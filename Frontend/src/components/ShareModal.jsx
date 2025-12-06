import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaCopy,
  FaGlobe,
  FaUserPlus,
  FaLink,
  FaUserCircle,
  FaTrash,
} from "react-icons/fa";

import fileService from "../features/files/fileService";
import AuthContext from "../context/AuthContext";

// UI Components
import Button from "./ui/Button";
import Input from "./ui/Input";

const ShareModal = ({ fileId, onClose }) => {
  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);

  const [permissions, setPermissions] = useState({
    owner: null,
    accessControl: [],
  });
  const [loadingPerms, setLoadingPerms] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, [fileId]);

  const fetchPermissions = async () => {
    try {
      const data = await fileService.getPermissions(fileId, user.token);
      setPermissions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPerms(false);
    }
  };

  const handleShareEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fileService.shareFile(fileId, email, user.token);
      toast.success("User added!");
      setEmail("");
      fetchPermissions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Share failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const data = await fileService.generateLink(fileId, user.token);
      setGeneratedLink(data.link);
      toast.success("Public link created!");
    } catch (error) {
      toast.error("Could not generate link");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (targetUserId) => {
    if (!window.confirm("Remove this user's access?")) return;
    try {
      await fileService.revokeAccess(fileId, targetUserId, user.token);
      toast.success("Access removed");
      fetchPermissions(); // Refresh list
    } catch (error) {
      toast.error("Could not remove user");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.info("Copied to clipboard");
  };

  const isOwner = permissions.owner?._id === user._id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/30">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Manage Access</h3>
            <p className="text-sm text-slate-400">Share and view permissions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Section 1: Invite */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <FaUserPlus className="text-blue-500" />
              <span>Invite People</span>
            </div>
            <form onSubmit={handleShareEmail} className="flex gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Add email address"
                className="bg-slate-900/50 border-slate-700 focus:ring-blue-500/50"
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "..." : "Invite"}
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-medium border-b border-slate-800 pb-2">
              <FaUserCircle className="text-slate-400" />
              <span>People with access</span>
            </div>

            <div className="space-y-2">
              {loadingPerms ? (
                <p className="text-sm text-slate-500">Loading permissions...</p>
              ) : (
                <>
                  {/* Owner Row */}
                  <div className="flex items-center justify-between p-2 rounded hover:bg-slate-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-800">
                        {permissions.owner?.name?.charAt(0) || "O"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {permissions.owner?.name}{" "}
                          {permissions.owner?._id === user._id && "(You)"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {permissions.owner?.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-900/50">
                      Owner
                    </span>
                  </div>

                  {permissions.accessControl.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between p-2 rounded hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-300">
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      {isOwner ? (
                        <button
                          onClick={() => handleRevoke(u._id)}
                          className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-950/30 rounded transition-colors"
                          title="Remove Access"
                        >
                          <FaTrash size={12} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">Editor</span>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <FaGlobe className="text-purple-500" />
              <span>Public Link</span>
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
                  className="bg-slate-800 hover:bg-slate-700"
                >
                  <FaCopy size={14} />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGenerateLink}
                variant="outline"
                className="w-full"
              >
                Generate Secure Link
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;
