import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Chapter {
  chapterTitle: string;
  summary: string;
  key_points: string;
}

interface Topic {
  fileName: string;
  chapters: Chapter[];
}

const TopicsPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const topics: Topic[] = state?.topics || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Chapters</h1>
        {topics.length === 0 && (
          <p className="text-center text-gray-600">
            No topics available. Please go back and upload a PDF.
          </p>
        )}
        {topics.map((topic, idx) => (
          <div key={idx} className="mb-8 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">File: {topic.fileName}</h2>
            {topic.chapters.length > 0 ? (
              topic.chapters.map((chapter, index) => (
                <div key={index} className="mb-4 border-b pb-2">
                  <h3 className="text-xl font-semibold">
                    {chapter.chapterTitle}
                  </h3>
                  <p className="mt-1 text-gray-700">{chapter.summary}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-indigo-600">
                      Read More
                    </summary>
                    <p className="mt-1 text-gray-600">{chapter.key_points}</p>
                  </details>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No chapters found for this file.</p>
            )}
          </div>
        ))}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
