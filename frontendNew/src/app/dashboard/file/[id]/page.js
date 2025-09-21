"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useAuthStore from "../../../../store/authStore";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import {
  IconUpload,
  IconFileText,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconFileAnalytics,
  IconAlertTriangle,
  IconClock,
  IconFileCheck,
  IconExclamationCircle,
  IconChevronDown,
  IconFileDots,
  IconSend,
  IconUser,
  IconRobot,
  IconBell,
  IconSearch,
  IconMenu2,
  IconX,
  IconTrendingUp,
  IconShield,
  IconPlus,
  IconEye,
  IconDownload,
  IconShare,
  IconBookmark,
  IconArrowLeft,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { API_URL } from "@/util/URL";

// Document Chat Component
const DocumentChat = ({ documentId, fileName, isExpenseDocument = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { authenticatedFetch } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // For expense documents, show a message that chat is not available
    if (isExpenseDocument) {
      const userMessage = inputMessage.trim();
      setInputMessage("");
      
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: userMessage,
          timestamp: new Date(),
        },
        {
          type: "assistant",
          content: "Chat functionality is currently available only for legal documents. For expense documents, please review the extracted data and analysis shown on the left.",
          timestamp: new Date(),
          error: false,
        },
      ]);
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await authenticatedFetch(`${API_URL}/api/file/rag-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage,
          documentId: documentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: data.answer,
            timestamp: new Date(),
            metadata: {
              relevantChunks: data.relevantChunks,
              processingTime: data.processingTime,
            },
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content:
              "Sorry, I encountered an error while processing your question. Please try again.",
            timestamp: new Date(),
            error: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content:
            "Sorry, I encountered an error while processing your question. Please try again.",
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-white flex items-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="hidden sm:inline">
            {isExpenseDocument ? 'Expense Chat (Limited)' : `Chat with ${fileName}`}
          </span>
          <span className="sm:hidden">Document Chat</span>
        </h2>
      </div>

      {/* Chat Messages */}
      <div className="h-64 sm:h-80 lg:h-96 overflow-y-auto mb-4 p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 py-6 sm:py-8">
            <IconRobot className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-sm sm:text-base">
              {isExpenseDocument 
                ? 'Ask questions about this expense document (limited functionality)' 
                : 'Ask me anything about this document!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : message.error
                      ? "bg-red-600/20 text-red-400 border border-red-500/30"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  <p className="text-xs sm:text-sm break-words">{message.content}</p>
                  {message.metadata && (
                    <div className="text-xs opacity-70 mt-1 sm:mt-2">
                      Chunks: {message.metadata.relevantChunks} | Time: {message.metadata.processingTime}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={sendMessage} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question about this document..."
          className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IconSend className="w-4 h-4" />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

// File Analytics Component
const FileAnalytics = ({ fileData }) => {
  const [shareTooltip, setShareTooltip] = useState(false);

  if (!fileData) return null;

  // Share functionality
  const handleShare = async () => {
    const shareUrl = window.location.href; // Current page URL
    
    try {
      if (navigator.share) {
        // Use native sharing if available (mobile devices)
        await navigator.share({
          title: `Analysis: ${fileData.fileName}`,
          text: `Check out this document analysis on FineSight`,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(shareUrl);
        setShareTooltip(true);
        setTimeout(() => setShareTooltip(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareTooltip(true);
        setTimeout(() => setShareTooltip(false), 2000);
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
      }
    }
  };

  // Check if this is an expense document
  const isExpenseDocument = fileData.documentType === 'expense';

  return (
    <div className="space-y-6">
      {/* File Header */}
      <div className="card-base">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {isExpenseDocument ? (
                <IconTrendingUp className="w-6 h-6 text-green-400" />
              ) : (
                <IconFileText className="w-6 h-6 text-purple-400" />
              )}
              <h1 className="text-xl sm:text-2xl font-bold text-white break-words">
                {fileData.fileName}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-400">
              {isExpenseDocument ? 'Expense Document' : 'Legal Document'} • Uploaded on {new Date(fileData.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <a
              href={fileData.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center space-x-2"
            >
              <IconEye className="w-4 h-4" />
              <span>View</span>
            </a>
            <div className="relative">
              <button
                onClick={handleShare}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center space-x-2"
              >
                <IconShare className="w-4 h-4" />
                <span>Share</span>
              </button>
              {shareTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-3 py-1 bg-green-600 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                  ✓ Link copied to clipboard!
                </div>
              )}
            </div>
            <a
              href={fileData.fileUrl}
              download
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
            >
              <IconDownload className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* File Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <IconFileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xs sm:text-sm text-slate-400">File Size</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-white">
              {(fileData.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          {isExpenseDocument ? (
            <>
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <IconTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-xs sm:text-sm text-slate-400">Entities Found</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-white">
                  {fileData.expenseData?.entityCount || 0}
                </p>
              </div>
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <IconClock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span className="text-xs sm:text-sm text-slate-400">Status</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-white">Analyzed</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <IconAlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  <span className="text-xs sm:text-sm text-slate-400">Risk Level</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-white">
                  {fileData.redFlags?.length > 0 ? "High" : "Low"}
                </p>
              </div>
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <IconClock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span className="text-xs sm:text-sm text-slate-400">Status</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-white">Analyzed</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {fileData.summary && (
        <div className="card-base">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
            {isExpenseDocument ? 'Expense Analysis Summary' : 'Document Summary'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed break-words">{fileData.summary}</p>
        </div>
      )}

      {/* Expense-specific content */}
      {isExpenseDocument && fileData.expenseData && (
        <>
          {fileData.expenseData.entities && fileData.expenseData.entities.length > 0 && (
            <div className="card-base">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
                Extracted Data ({fileData.expenseData.entityCount} items)
              </h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {fileData.expenseData.entities.map((entity, index) => (
                  <div key={index} className="text-sm text-slate-300 p-2 bg-slate-800/50 rounded">
                    {entity.mentionText || entity.type || JSON.stringify(entity)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Legal document-specific content */}
      {!isExpenseDocument && (
        <>
          {/* Red Flags */}
          {fileData.redFlags && fileData.redFlags.length > 0 && (
            <div className="card-base">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
                <IconAlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2" />
                Red Flags
              </h2>
              <div className="space-y-3">
                {fileData.redFlags.map((flag, index) => (
                  <div key={index} className="bg-red-500/10 border border-red-500/20 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-red-400 break-words">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parties Involved */}
          {fileData.partiesInvolved && fileData.partiesInvolved.length > 0 && (
            <div className="card-base">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Parties Involved</h2>
              <div className="space-y-2">
                {fileData.partiesInvolved.map((party, index) => (
                  <div key={index} className="bg-slate-800/50 p-2 sm:p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-slate-300 break-words">{party}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Terms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {fileData.paymentDetails && (
              <div className="card-base">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Payment Details</h3>
                <p className="text-xs sm:text-sm text-slate-300 break-words">{fileData.paymentDetails}</p>
              </div>
            )}

            {fileData.durationAndTermination && (
              <div className="card-base">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Duration & Termination</h3>
                <p className="text-xs sm:text-sm text-slate-300 break-words">{fileData.durationAndTermination}</p>
              </div>
            )}

            {fileData.confidentialityAndPrivacy && (
              <div className="card-base">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Confidentiality & Privacy</h3>
                <p className="text-xs sm:text-sm text-slate-300 break-words">{fileData.confidentialityAndPrivacy}</p>
              </div>
            )}

            {fileData.disputeResolution && (
              <div className="card-base">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Dispute Resolution</h3>
                <p className="text-xs sm:text-sm text-slate-300 break-words">{fileData.disputeResolution}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default function FilePage() {
  const params = useParams();
  const router = useRouter();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authenticatedFetch } = useAuthStore();

  useEffect(() => {
    const fetchFileData = async () => {
      if (!params.id) return;

      try {
        const response = await authenticatedFetch(
          `${API_URL}/api/file/${params.id}`
        );
        const data = await response.json();

        if (response.ok) {
          setFileData(data.file);
        } else {
          setError(data.error || "Failed to load file");
        }
      } catch (err) {
        setError("Failed to load file");
        console.error("Error fetching file:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [params.id, authenticatedFetch]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300 text-sm sm:text-base">Loading file...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !fileData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <IconArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Back to Dashboard</span>
              </Link>
            </div>
            <div className="card-base text-center py-12 sm:py-20">
              <IconExclamationCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">File Not Found</h2>
              <p className="text-sm sm:text-base text-slate-400 mb-6 break-words">{error || "The requested file could not be found."}</p>
              <Link
                href="/dashboard"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <IconArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <IconArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Back to Dashboard</span>
              </Link>
              <div className="h-4 sm:h-6 w-px bg-slate-700" />
              <h1 className="text-lg sm:text-2xl font-bold text-white">File Details</h1>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <FileAnalytics fileData={fileData} />
            </div>

            {/* Chat Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <DocumentChat
                documentId={fileData.documentId}
                fileName={fileData.fileName}
                isExpenseDocument={fileData.documentType === 'expense'}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .btn-primary {
          @apply px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base;
        }

        .card-base {
          @apply bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300;
        }
      `}</style>
    </ProtectedRoute>
  );
}