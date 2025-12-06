import {
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileCode,
  FaFileArchive,
  FaFileAlt,
  FaFileAudio,
  FaFileVideo,
} from "react-icons/fa";

const FileIcon = ({ mimeType, className }) => {
  const type = mimeType.split("/")[1];
  const mainType = mimeType.split("/")[0];

  const styleProps = { className: `w-6 h-6 ${className}` };

  if (mainType === "image")
    return (
      <FaFileImage
        {...styleProps}
        className={`${styleProps.className} text-purple-500`}
      />
    );
  if (mainType === "audio")
    return (
      <FaFileAudio
        {...styleProps}
        className={`${styleProps.className} text-yellow-500`}
      />
    );
  if (mainType === "video")
    return (
      <FaFileVideo
        {...styleProps}
        className={`${styleProps.className} text-pink-500`}
      />
    );

  switch (true) {
    case type.includes("pdf"):
      return (
        <FaFilePdf
          {...styleProps}
          className={`${styleProps.className} text-red-500`}
        />
      );
    case type.includes("word") || type.includes("document"):
      return (
        <FaFileWord
          {...styleProps}
          className={`${styleProps.className} text-blue-600`}
        />
      );
    case type.includes("sheet") || type.includes("excel"):
      return (
        <FaFileExcel
          {...styleProps}
          className={`${styleProps.className} text-green-600`}
        />
      );
    case type.includes("presentation") || type.includes("powerpoint"):
      return (
        <FaFilePowerpoint
          {...styleProps}
          className={`${styleProps.className} text-orange-500`}
        />
      );
    case type.includes("zip") ||
      type.includes("compressed") ||
      type.includes("tar"):
      return (
        <FaFileArchive
          {...styleProps}
          className={`${styleProps.className} text-gray-500`}
        />
      );
    case type.includes("javascript") ||
      type.includes("json") ||
      type.includes("html") ||
      type.includes("css"):
      return (
        <FaFileCode
          {...styleProps}
          className={`${styleProps.className} text-cyan-500`}
        />
      );
    default:
      return (
        <FaFileAlt
          {...styleProps}
          className={`${styleProps.className} text-slate-400`}
        />
      );
  }
};

export default FileIcon;
