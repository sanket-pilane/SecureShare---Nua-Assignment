import axios from "axios";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/files/";

const uploadFiles = async (files, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const response = await axios.post(API_URL, formData, config);
  return response.data;
};

const getFiles = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const shareFile = async (fileId, email, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(
    API_URL + fileId + "/share",
    { email },
    config
  );
  return response.data;
};

const generateLink = async (fileId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL + fileId + "/link", {}, config);
  return response.data;
};

const accessLink = async (shareToken, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + "share/" + shareToken, config);
  return response.data;
};

const downloadFile = async (fileId, token, filename) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  };
  const response = await axios.get(API_URL + "download/" + fileId, config);

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const deleteFile = async (fileId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + fileId, config);
  return response.data;
};

const getPermissions = async (fileId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + fileId + "/permissions", config);
  return response.data;
};

const revokeAccess = async (fileId, userId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(
    API_URL + fileId + "/permissions/" + userId,
    config
  );
  return response.data;
};

const getFilePreview = async (fileId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  };
  const response = await axios.get(API_URL + "download/" + fileId, config);

  return window.URL.createObjectURL(
    new Blob([response.data], { type: response.headers["content-type"] })
  );
};

const getFileHistory = async (fileId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + fileId + "/history", config);
  return response.data;
};

const fileService = {
  uploadFiles,
  getFiles,
  shareFile,
  generateLink,
  deleteFile,
  accessLink,
  downloadFile,
  getPermissions,
  revokeAccess,
  getFilePreview,
  getFileHistory,
};

export default fileService;
