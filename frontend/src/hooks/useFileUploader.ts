import { useState } from "react";
import axios from "axios";
import { getCookie } from "../utils/cookies";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function useFileUploader() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select at least one PDF file.");
      return;
    }
    setUploading(true);
    setError(null);
    const token = getCookie("accessToken");
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("pdfs", selectedFiles[i]);
    }
    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return {
    selectedFiles,
    uploading,
    error,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleUpload,
  };
}
