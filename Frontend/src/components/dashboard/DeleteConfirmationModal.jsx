import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Button from "../ui/Button";

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-slate-950 border border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Delete File?</h3>
        <button onClick={onCancel} className="text-slate-500 hover:text-white">
          <FaTimes />
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-6">
        This action cannot be undone. This will permanently delete the file from
        our servers.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete Forever
        </Button>
      </div>
    </motion.div>
  </div>
);

export default DeleteConfirmationModal;
