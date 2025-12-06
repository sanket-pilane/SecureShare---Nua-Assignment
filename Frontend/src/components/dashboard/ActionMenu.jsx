import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
// FIX: Added FaHistory to the imports below
import {
  FaEllipsisV,
  FaShareAlt,
  FaDownload,
  FaTrash,
  FaHistory,
} from "react-icons/fa";

const ActionMenu = ({ onShare, onDownload, onDelete, onViewHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 192,
    });
    setIsOpen(true);
  };

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    window.addEventListener("scroll", closeMenu);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("scroll", closeMenu);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`p-2 rounded-full transition-colors ${
          isOpen
            ? "bg-slate-800 text-white"
            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
        }`}
      >
        <FaEllipsisV size={14} />
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                zIndex: 9999,
              }}
              className="w-48 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden ring-1 ring-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onShare();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <FaShareAlt className="mr-3 text-blue-500" /> Share Access
                </button>
                <button
                  onClick={() => {
                    onDownload();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <FaDownload className="mr-3 text-green-500" /> Download
                </button>
                <button
                  onClick={() => {
                    onViewHistory();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <FaHistory className="mr-3 text-purple-400" /> View Activity
                </button>
                <div className="border-t border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                >
                  <FaTrash className="mr-3" /> Delete File
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ActionMenu;
