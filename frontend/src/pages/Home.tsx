import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Utility function to extract JSON from markdown code block
const extractJSON = (text: string): any => {
  // Try to find the first complete JSON object in the text
  const jsonMatch = text.match(/{[\s\S]*}/);
  if (!jsonMatch) {
    console.error("No JSON object found in the text.");
    return null;
  }
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return null;
  }
};

function HomeScreen() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  // Upload PDFs to the backend
  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select at least one PDF file.");
      return;
    }
    setUploading(true);
    setError(null);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("pdfs", selectedFiles[i]);
    }
    try {
      // Adjust the base URL as needed
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Process each file's response by extracting and parsing the JSON content
      // const parsedResults = response.data.data.map((item: any) => {
      //   const parsedResponse = extractJSON(item.response);
      //   return {
      //     fileName: item.fileName,
      //     chapters: parsedResponse?.chapters || [],
      //   };
      // });
      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Study App Home</h1>
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <label className="block mb-2 text-gray-700 font-medium">
          Select PDF files to upload:
        </label>
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          {uploading ? "Uploading..." : "Upload PDFs"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {result && (
        <div className="mt-6 max-w-3xl w-full bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Upload Result</h2>
          {result.map((item: any, index: number) => (
            <div key={index} className="mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold mb-1">
                File: {item.fileName}
              </h3>
              <div className="bg-gray-100 p-2 rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate("/topics", { state: { topics: result } })}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            View Topics
          </button>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
