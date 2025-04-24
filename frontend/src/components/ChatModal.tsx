import { useState, useEffect, useRef } from "react";
import { images } from "../constants/images";
import { getCookie } from "../utils/cookies";
import MarkdownRenderer from "./MarkdownRenderer";

type ChatMessage = {
  content: string;
  sender: "user" | "ai";
};

type ChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedTopic: any;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatModal = ({ isOpen, onClose, selectedTopic }: ChatModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Add an initial greeting message when the modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          content: `Hello! I'm your AI assistant. How can I help you with the "${selectedTopic?.title}" lesson?`,
          sender: "ai",
        },
      ]);
    }
  }, [isOpen, selectedTopic, messages.length]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages([...messages, { content: userMessage, sender: "user" }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = getCookie("accessToken");
      const response = await fetch(`${API_URL}/chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            lessonTitle: selectedTopic?.title || "",
            lessonSummary: selectedTopic?.summary || "",
            keyPoints: selectedTopic?.keyPoints || [],
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { content: data.response, sender: "ai" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            content:
              "Sorry, I couldn't process your question. Please try again.",
            sender: "ai",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          content:
            "An error occurred. Please check your connection and try again.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render message content based on sender - use markdown for AI responses
  const renderMessageContent = (message: ChatMessage) => {
    if (message.sender === "user") {
      return <div>{message.content}</div>;
    } else {
      return <MarkdownRenderer>{message.content}</MarkdownRenderer>;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-20"
        onClick={onClose}
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary border border-alt-bg-color rounded-xl w-[80%] max-w-3xl h-[70vh] z-30">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-alt-bg-color">
            <h3 className="text-xl font-semibold text-primary-text-color flex items-center">
              <img
                src={images.wizardGlasses}
                alt="AI"
                className="w-8 h-8 mr-2"
              />
              AI Chat Assistant
            </h3>
            <button
              onClick={onClose}
              className="text-secondary-text-color hover:text-primary-text-color"
            >
              ✕
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-primary">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-gradient-to-b from-gradient-start to-gradient-end text-primary"
                      : "bg-alt-bg-color text-secondary-text-color"
                  }`}
                >
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="bg-alt-bg-color text-secondary-text-color rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gradient-start rounded-full mr-1 animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gradient-start rounded-full mr-1 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gradient-start rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-alt-bg-color">
            <div className="flex items-center">
              <textarea
                className="flex-1 bg-alt-bg-color text-secondary-text-color p-2 rounded-lg focus:outline-none resize-none"
                placeholder="Type your question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
              />
              <button
                className="ml-2 bg-gradient-to-b from-gradient-start to-gradient-end text-primary p-2 rounded-lg hover:cursor-pointer disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatModal;
