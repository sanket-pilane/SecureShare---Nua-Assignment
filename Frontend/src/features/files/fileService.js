import axios from "axios";

const API_URL = "http://localhost:5000/api/files/";

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

const fileService = {
  uploadFiles,
  getFiles,
};

export default fileService;
