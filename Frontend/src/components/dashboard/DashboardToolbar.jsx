import { useRef } from "react"; // Import useRef
import { FaSearch, FaCloudUploadAlt } from "react-icons/fa";
import Input from "../ui/Input";
import Button from "../ui/Button";

const DashboardToolbar = ({
  searchTerm,
  setSearchTerm,
  uploading,
  onFileChange,
}) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full sm:w-96 group">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
        <Input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div>
        <Button
          variant="primary"
          disabled={uploading}
          onClick={handleUploadClick}
          className="gap-2 shadow-lg shadow-blue-900/20"
        >
          <FaCloudUploadAlt size={18} />
          {uploading ? "Uploading..." : "Upload New"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileChange}
          className="hidden"
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default DashboardToolbar;
