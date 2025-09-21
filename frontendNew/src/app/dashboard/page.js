"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import useAuthStore from "../../store/authStore";
import ProtectedRoute from "../../components/ProtectedRoute";
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
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { API_URL } from "@/util/URL";
import { IconScale } from "@tabler/icons-react";

// Enhanced Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { id: "documents", label: "Documents", icon: IconFileText },
    { id: "upload", label: "Upload", icon: IconUpload },
    { id: "expenses", label: "Expenses", icon: IconTrendingUp },
    { id: "analysis", label: "Analysis", icon: IconFileAnalytics },
    { id: "analytics", label: "Analytics", icon: IconChartBar },
    { id: "settings", label: "Settings", icon: IconSettings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <IconX className="w-5 h-5" />
        ) : (
          <IconMenu2 className="w-5 h-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:relative z-40 lg:z-0
        w-64 sm:w-72 bg-gradient-to-b from-slate-900 to-slate-800 
        border-r border-slate-700/50 backdrop-blur-sm
        flex-shrink-0 flex flex-col h-full
        transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
        transition-transform duration-300 ease-in-out
      `}
      >
        <div className="px-4 sm:px-6 py-6 flex items-center space-x-3 border-b border-slate-700/50">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg">
            <Image
              src="/doc.png"
              alt="FineSight Logo"
              width={120}
              height={100}
            />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold text-white">
              FineSight
            </span>
            <p className="text-xs text-slate-400">AI Legal Assistant</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                activeTab === link.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white hover:transform hover:scale-[1.01]"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
              {activeTab === link.id && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <IconShield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">
                Security Status
              </span>
            </div>
            <p className="text-xs text-slate-400">All documents encrypted</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <IconLogout className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// Enhanced Header Component
const Header = ({ user, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications] = useState(3);

  const getInitials = (name) =>
    name ? name.substring(0, 2).toUpperCase() : "U";

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-10">
      <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex-1" />

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative">
            <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              <IconBell className="w-4 h-4 sm:w-5 sm:h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                {getInitials(user?.username)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs sm:text-sm font-medium text-slate-200">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <IconChevronDown
                className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-500 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-20"
                >
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2">
                      <IconUser className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2">
                      <IconSettings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-slate-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <IconLogout className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

// Enhanced Documents View
const DocumentsView = ({ setActiveTab, fileData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All"); // New filter for document type
  const [shareTooltip, setShareTooltip] = useState(null);

  // Your API response is already an array, so keep it directly
  const documents = fileData || [];

  // Map your real data into the format needed for UI
  const mappedDocuments = documents.map((doc) => ({
    id: doc._id,
    fileName: doc.fileName,
    status: "Analyzed", // You can set this dynamically if you add processing status
    uploadDate: new Date(doc.createdAt).toLocaleDateString(),
    riskLevel: doc.redFlags?.length > 0 ? "High" : "Low", // Example rule
    tags:
      doc.documentType === "expense"
        ? ["Expense", "Financial"]
        : ["Legal", "Internship"], // Add tags logic based on document type
    fileUrl: doc.fileUrl,
    summary: doc.summary,
    documentType: doc.documentType || "legal", // Default to legal for backwards compatibility
  }));

  // Share functionality
  const handleShare = async (docId, fileName) => {
    const shareUrl = `${window.location.origin}/dashboard/file/${docId}`;

    try {
      if (navigator.share) {
        // Use native sharing if available (mobile devices)
        await navigator.share({
          title: `Analysis: ${fileName}`,
          text: `Check out this document analysis on FineSight`,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(shareUrl);
        setShareTooltip(docId);
        setTimeout(() => setShareTooltip(null), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareTooltip(docId);
        setTimeout(() => setShareTooltip(null), 2000);
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
      }
    }
  };

  // Filtering logic
  const filteredDocuments = mappedDocuments.filter((doc) => {
    const matchesSearch = doc.fileName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || doc.status === filterStatus;
    const matchesType = filterType === "All" || doc.documentType === filterType;
    return matchesSearch && matchesFilter && matchesType;
  });

  const riskColor = {
    High: "bg-red-500/10 text-red-400 border-red-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  const statusColor = {
    Analyzed: "bg-blue-500/10 text-blue-400",
    Processing: "bg-purple-500/10 text-purple-400",
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Documents
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Manage and review your analyzed legal documents
            </p>
          </div>
          <button
            onClick={() => setActiveTab("upload")}
            className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <IconPlus className="w-4 h-4" />
            <span>Upload New</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <motion.div className="card-base flex flex-col items-center p-4 sm:p-6">
            <IconFileText className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400 mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-slate-400">Total Documents</p>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {mappedDocuments.length}
            </p>
          </motion.div>

          <motion.div className="card-base flex flex-col items-center p-4 sm:p-6">
            <IconScale className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400 mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-slate-400">Legal Documents</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-400">
              {
                mappedDocuments.filter((doc) => doc.documentType === "legal")
                  .length
              }
            </p>
          </motion.div>

          <motion.div className="card-base flex flex-col items-center p-4 sm:p-6">
            <IconTrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-green-400 mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-slate-400">
              Expense Documents
            </p>
            <p className="text-xl sm:text-2xl font-bold text-green-400">
              {
                mappedDocuments.filter((doc) => doc.documentType === "expense")
                  .length
              }
            </p>
          </motion.div>

          <motion.div className="card-base flex flex-col items-center p-4 sm:p-6">
            <IconAlertTriangle className="w-6 sm:w-8 h-6 sm:h-8 text-red-400 mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-slate-400">High Risk</p>
            <p className="text-xl sm:text-2xl font-bold text-red-400">
              {mappedDocuments.filter((doc) => doc.riskLevel === "High").length}
            </p>
          </motion.div>
        </div>

        {/* Search + Filter */}
        <div className="card-base">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <IconSearch className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Analyzed</option>
              <option>Processing</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="legal">Legal Documents</option>
              <option value="expense">Expense Documents</option>
            </select>
          </div>
        </div>

        {/* Document List */}
        <div className="card-base">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Recent Documents
            </h2>
          </div>

          <div className="space-y-4">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors mb-2 text-sm sm:text-base">
                      {doc.fileName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                      {doc.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-lg flex items-center space-x-1 ${
                          doc.documentType === "expense"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {doc.documentType === "expense" ? (
                          <>
                            <IconTrendingUp className="w-3 h-3" />
                            <span>Expense</span>
                          </>
                        ) : (
                          <>
                            <IconScale className="w-3 h-3" />
                            <span>Legal</span>
                          </>
                        )}
                      </span>
                      {doc.tags?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex mt-2 sm:mt-0 sm:ml-4 items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                      <IconBookmark className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(doc.id, doc.fileName);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        <IconShare className="w-4 h-4" />
                      </button>
                      {shareTooltip === doc.id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded shadow-lg whitespace-nowrap">
                          Link copied!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        riskColor[doc.riskLevel]
                      }`}
                    >
                      {doc.riskLevel} Risk
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        statusColor[doc.status]
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <p className="text-xs text-slate-500">
                    Uploaded {doc.uploadDate}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-2">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 sm:px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2"
                    >
                      <IconEye className="w-4 h-4" />
                      <span>View</span>
                    </a>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(doc.id, doc.fileName);
                        }}
                        className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2"
                      >
                        <IconShare className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      {shareTooltip === doc.id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-3 py-1 bg-green-600 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                          ✓ Link copied to clipboard!
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/file/${doc.id}`}
                      className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2"
                    >
                      {doc.documentType === "expense" ? (
                        <IconTrendingUp className="w-4 h-4" />
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                      <span>View Analysis</span>
                    </Link>
                    <a
                      href={doc.fileUrl}
                      download
                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2"
                    >
                      <IconDownload className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Enhanced Upload View with original functionality
const UploadView = ({
  handleFileChange,
  handleUpload,
  file,
  uploading,
  message,
  error,
  processingSteps,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Upload Document
          </h1>
          <p className="text-slate-400">Upload a PDF for AI-powered analysis</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <IconShield className="w-5 h-5 text-green-400" />
          <span className="text-sm text-slate-400">End-to-end encrypted</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card-base p-8">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
            accept=".pdf"
          />
          <label
            htmlFor="fileInput"
            className={`cursor-pointer block border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragOver
                ? "border-blue-500 bg-blue-500/5"
                : file
                ? "border-green-500 bg-green-500/5"
                : "border-slate-600 hover:border-blue-500 hover:bg-blue-500/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <IconFileCheck className="w-16 h-16 text-green-400 mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <IconFileCheck className="w-4 h-4" />
                  <span className="text-sm">Ready for analysis</span>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <IconUpload className="w-16 h-16 text-slate-500 mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    Drop your document here
                  </p>
                  <p className="text-slate-400 mb-4">
                    or{" "}
                    <span className="text-blue-400 font-semibold">
                      browse files
                    </span>
                  </p>
                  <p className="text-sm text-slate-500">
                    PDF files only, up to 10MB
                  </p>
                </div>
              </div>
            )}
          </label>

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <IconFileAnalytics className="w-5 h-5" />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {uploading && processingSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-slate-900/50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Processing Status
              </h3>
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-500"
                          : step.current
                          ? "bg-blue-500"
                          : "bg-slate-600"
                      }`}
                    >
                      {step.completed ? (
                        <IconFileCheck className="w-4 h-4 text-white" />
                      ) : step.current ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          step.completed
                            ? "text-green-400"
                            : step.current
                            ? "text-blue-400"
                            : "text-slate-500"
                        }`}
                      >
                        {step.step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <IconFileCheck className="w-5 h-5 text-green-400" />
                <p className="text-green-400 font-medium">{message}</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <IconExclamationCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Expense Upload View - following the same pattern as UploadView
const ExpenseView = ({
  handleExpenseFileChange,
  handleExpenseUpload,
  expenseFile,
  expenseUploading,
  expenseMessage,
  expenseError,
  expenseProcessingSteps,
  expenseAnalysisResult,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      handleExpenseFileChange({ target: { files: [droppedFile] } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Expense Analysis
          </h1>
          <p className="text-slate-400">
            Upload financial documents for expense analysis
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <IconShield className="w-5 h-5 text-green-400" />
          <span className="text-sm text-slate-400">End-to-end encrypted</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card-base p-8">
          <input
            type="file"
            onChange={handleExpenseFileChange}
            className="hidden"
            id="expenseFileInput"
            accept=".pdf"
          />
          <label
            htmlFor="expenseFileInput"
            className={`cursor-pointer block border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragOver
                ? "border-blue-500 bg-blue-500/5"
                : expenseFile
                ? "border-green-500 bg-green-500/5"
                : "border-slate-600 hover:border-blue-500 hover:bg-blue-500/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {expenseFile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <IconFileCheck className="w-16 h-16 text-green-400 mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-white">
                    {expenseFile.name}
                  </p>
                  <p className="text-slate-400">
                    {(expenseFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <IconFileCheck className="w-4 h-4" />
                  <span className="text-sm">Ready for expense analysis</span>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <IconTrendingUp className="w-16 h-16 text-slate-500 mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    Drop your expense document here
                  </p>
                  <p className="text-slate-400 mb-4">
                    or{" "}
                    <span className="text-blue-400 font-semibold">
                      browse files
                    </span>
                  </p>
                  <p className="text-sm text-slate-500">
                    PDF financial documents, invoices, receipts
                  </p>
                </div>
              </div>
            )}
          </label>

          {expenseFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <button
                onClick={handleExpenseUpload}
                disabled={expenseUploading}
                className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {expenseUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing Expenses...</span>
                  </>
                ) : (
                  <>
                    <IconTrendingUp className="w-5 h-5" />
                    <span>Analyze Expenses</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {expenseProcessingSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Processing Status
              </h3>
              <div className="space-y-3">
                {expenseProcessingSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <IconFileCheck className="w-5 h-5 text-green-400" />
                      ) : step.current ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          step.completed
                            ? "text-green-400"
                            : step.current
                            ? "text-blue-400"
                            : "text-slate-500"
                        }`}
                      >
                        {step.step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {expenseMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <IconFileCheck className="w-5 h-5 text-green-400" />
                <p className="text-green-400 font-medium">{expenseMessage}</p>
              </div>
            </motion.div>
          )}

          {expenseError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <IconExclamationCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium">{expenseError}</p>
              </div>
            </motion.div>
          )}

          {expenseAnalysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <IconTrendingUp className="w-6 h-6 text-green-400 mr-2" />
                  Expense Analysis Results
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="card-base p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconFileText className="w-4 h-4 text-blue-400" />
                      <h4 className="text-sm font-medium text-slate-400">Document</h4>
                    </div>
                    <p className="text-white">{expenseAnalysisResult.fileInfo?.originalName}</p>
                  </div>
                  <div className="card-base p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconClock className="w-4 h-4 text-yellow-400" />
                      <h4 className="text-sm font-medium text-slate-400">Processing Time</h4>
                    </div>
                    <p className="text-white">{expenseAnalysisResult.processingTime}</p>
                  </div>
                  <div className="card-base p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconFileCheck className="w-4 h-4 text-green-400" />
                      <h4 className="text-sm font-medium text-slate-400">Status</h4>
                    </div>
                    <p className="text-green-400 font-medium">Successfully Analyzed</p>
                  </div>
                </div>

                {/* Parse and display expense table */}
                {(() => {
                  const documentText = expenseAnalysisResult.expenseAnalysis?.documentText || '';
                  const expenses = [];
                  let totalAmount = 0;
                  let reportMonth = '';
                  
                  // Extract month from document
                  const monthMatch = documentText.match(/For the Month of ([A-Z][a-z]+ \d{4})/i);
                  if (monthMatch) {
                    reportMonth = monthMatch[1];
                  }
                  
                  // Extract total amount
                  const totalMatch = documentText.match(/Total Expenses?:?\s*(?:INR\s*)?([0-9,]+)/i);
                  if (totalMatch) {
                    totalAmount = totalMatch[1].replace(/,/g, '');
                  }
                  
                  // Parse expense lines - look for date, category, description, amount pattern
                  const lines = documentText.split('\n');
                  lines.forEach(line => {
                    // Match pattern: DD-MM-YYYY Category Description Amount
                    const expenseMatch = line.match(/(\d{2}-\d{2}-\d{4})\s+([A-Za-z\s&]+?)\s+([A-Za-z\s,().-]+?)\s+([0-9,]+)$/);
                    if (expenseMatch) {
                      expenses.push({
                        date: expenseMatch[1],
                        category: expenseMatch[2].trim(),
                        description: expenseMatch[3].trim(),
                        amount: expenseMatch[4].replace(/,/g, '')
                      });
                    }
                  });

                  return expenses.length > 0 ? (
                    <div className="space-y-6">
                      {/* Report Header */}
                      <div className="card-base p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-white mb-2 sm:mb-0">
                            Expense Report {reportMonth && `- ${reportMonth}`}
                          </h4>
                          <div className="text-right">
                            <p className="text-sm text-slate-400">Total Expenses</p>
                            <p className="text-2xl font-bold text-green-400">
                              ₹{Number(totalAmount).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Category Summary */}
                        {(() => {
                          const categoryTotals = {};
                          expenses.forEach(expense => {
                            const category = expense.category;
                            categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount);
                          });
                          
                          return (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                              {Object.entries(categoryTotals).map(([category, amount]) => (
                                <div key={category} className="bg-slate-800/50 p-3 rounded-lg text-center">
                                  <p className="text-xs text-slate-400 mb-1">{category}</p>
                                  <p className="text-sm font-semibold text-white">
                                    ₹{Number(amount).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Expense Table */}
                      <div className="card-base p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Detailed Expenses</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Date</th>
                                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Category</th>
                                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Description</th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expenses.map((expense, index) => (
                                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                  <td className="py-3 px-2 text-sm text-slate-300">
                                    {new Date(expense.date.split('-').reverse().join('-')).toLocaleDateString('en-GB')}
                                  </td>
                                  <td className="py-3 px-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      expense.category.toLowerCase().includes('travel') ? 'bg-blue-500/10 text-blue-400' :
                                      expense.category.toLowerCase().includes('software') ? 'bg-purple-500/10 text-purple-400' :
                                      expense.category.toLowerCase().includes('marketing') ? 'bg-green-500/10 text-green-400' :
                                      expense.category.toLowerCase().includes('meal') ? 'bg-orange-500/10 text-orange-400' :
                                      'bg-slate-500/10 text-slate-400'
                                    }`}>
                                      {expense.category}
                                    </span>
                                  </td>
                                  <td className="py-3 px-2 text-sm text-slate-300">{expense.description}</td>
                                  <td className="py-3 px-2 text-sm font-medium text-white text-right">
                                    ₹{Number(expense.amount).toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 border-slate-600">
                                <td colSpan="3" className="py-3 px-2 text-sm font-semibold text-white">Total</td>
                                <td className="py-3 px-2 text-sm font-bold text-green-400 text-right">
                                  ₹{Number(totalAmount).toLocaleString('en-IN')}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* AI Summary */}
                {expenseAnalysisResult.expenseAnalysis?.summary && (
                  <div className="card-base p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <IconRobot className="w-5 h-5 text-blue-400 mr-2" />
                      AI Analysis Summary
                    </h4>
                    <div className="prose prose-invert max-w-none">
                      {expenseAnalysisResult.expenseAnalysis.summary.split('•').map((point, index) => {
                        if (index === 0) return null; // Skip the header
                        return (
                          <div key={index} className="flex items-start space-x-2 mb-2">
                            <span className="text-green-400 mt-1.5">•</span>
                            <p className="text-slate-300 text-sm leading-relaxed">{point.trim()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Keep your original DocumentChat component exactly as is
const DocumentChat = ({ analysisResult, documentId }) => {
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

    const userMessage = inputMessage.trim();
    console.log("User question:", userMessage, analysisResult.userId);
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
      const response = await authenticatedFetch(
        `${API_URL}/api/file/rag-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage,
            documentId: documentId,
          }),
        }
      );

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
            Ask Questions About This Document
          </span>
          <span className="sm:hidden">Document Chat</span>
        </h2>
        <span className="text-xs sm:text-sm text-slate-400">
          AI-powered answers from your document
        </span>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 mb-4 max-h-64 sm:max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-slate-600 mx-auto mb-4"
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
            <p className="text-slate-400 mb-2">
              Ask me anything about this legal document!
            </p>
            <p className="text-sm text-slate-500">
              I'll search through the document content and analysis to provide
              accurate answers.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : message.error
                      ? "bg-red-900/20 border border-red-600/30 text-red-300"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.metadata && (
                    <div className="mt-2 text-xs opacity-70">
                      <span>
                        Found in {message.metadata.relevantChunks} sections
                      </span>
                      <span className="ml-2">•</span>
                      <span className="ml-2">
                        {message.metadata.processingTime}
                      </span>
                    </div>
                  )}
                  <div className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question about this document..."
          className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm sm:text-base"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </form>

      <div className="mt-3 text-xs text-slate-500">
        💡 Try asking: "What are the payment terms?" or "Are there any penalties
        mentioned?"
      </div>
    </div>
  );
};

// Keep your original AnalysisView exactly as is but with enhanced styling
const AnalysisView = ({ analysisResult, setActiveTab, fileData }) => {
  const { authenticatedFetch } = useAuthStore();
  const [localFileData, setLocalFileData] = useState(null);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const response = await authenticatedFetch(
          `${API_URL}/api/file/user-files`
        );
        const data = await response.json();
        if (response.ok) {
          setLocalFileData(data.files);
        }
      } catch (error) {
        console.error("Error fetching user files:", error);
      }
    };

    if (!analysisResult && !fileData) {
      fetchUserFiles();
    }
  }, [analysisResult, fileData, authenticatedFetch]);

  // Use fileData prop if available, otherwise use localFileData
  const documents = fileData || localFileData || [];

  // Map documents for display
  const mappedDocuments = documents.map((doc) => ({
    id: doc._id,
    fileName: doc.fileName,
    status: "Analyzed",
    uploadDate: new Date(doc.createdAt).toLocaleDateString(),
    riskLevel: doc.redFlags?.length > 0 ? "High" : "Low",
    tags: ["Legal", "Document"],
    fileUrl: doc.fileUrl,
    summary: doc.summary,
  }));

  const riskColor = {
    High: "bg-red-500/10 text-red-400 border-red-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  const statusColor = {
    Analyzed: "bg-blue-500/10 text-blue-400",
    Processing: "bg-purple-500/10 text-purple-400",
  };

  if (!analysisResult) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
            Document Analysis Hub
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            Harness the power of AI to analyze, understand, and extract insights
            from your legal documents with precision and clarity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/** First Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-500 group"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <IconFileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {mappedDocuments.length}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Total Documents
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: mappedDocuments.length > 0 ? "100%" : "0%" }}
                />
              </div>
              <p className="text-xs text-slate-500">All documents analyzed</p>
            </div>
          </motion.div>

          {/** Second Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-red-500/30 transition-all duration-500 group"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <IconAlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-red-400 mb-1">
                  {mappedDocuments.filter((d) => d.riskLevel === "High").length}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  High Risk
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-1000"
                  style={{
                    width:
                      mappedDocuments.length > 0
                        ? `${
                            (mappedDocuments.filter(
                              (d) => d.riskLevel === "High"
                            ).length /
                              mappedDocuments.length) *
                            100
                          }%`
                        : "0%",
                  }}
                />
              </div>
              <p className="text-xs text-slate-500">Risk assessment complete</p>
            </div>
          </motion.div>

          {/** Third Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-green-500/30 transition-all duration-500 group"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                <IconTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
                  {
                    mappedDocuments.filter((d) => d.status === "Analyzed")
                      .length
                  }
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Analyzed
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{
                    width:
                      mappedDocuments.length > 0
                        ? `${
                            (mappedDocuments.filter(
                              (d) => d.status === "Analyzed"
                            ).length /
                              mappedDocuments.length) *
                            100
                          }%`
                        : "0%",
                  }}
                />
              </div>
              <p className="text-xs text-slate-500">Processing complete</p>
            </div>
          </motion.div>
        </div>

        {/* Document Cards Grid */}
        {mappedDocuments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {mappedDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-blue-500/40 hover:bg-slate-800/60 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
                onClick={() =>
                  (window.location.href = `/dashboard/file/${doc.id}`)
                }
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="p-2 sm:p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 flex-shrink-0">
                      <IconFileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors text-sm sm:text-base leading-tight mb-1 line-clamp-2 break-words">
                        {doc.fileName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-2">
                    <IconShare className="w-4 h-4 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" />
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {doc.summary ||
                      "Document analysis completed successfully. Click to view detailed insights and analysis."}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {doc.tags?.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 bg-slate-700/40 text-slate-300 text-xs font-medium rounded-lg border border-slate-600/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Status Indicators */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg border ${
                        riskColor[doc.riskLevel]
                      }`}
                    >
                      {doc.riskLevel} Risk
                    </span>
                    <span
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg ${
                        statusColor[doc.status]
                      }`}
                    >
                      ✓ {doc.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(doc.fileUrl, "_blank");
                    }}
                    className="w-full sm:flex-1 flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all duration-300 border border-slate-600/30 hover:border-slate-500 text-xs sm:text-sm"
                  >
                    <IconEye className="w-4 h-4" />
                    <span className="font-medium">View PDF</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/dashboard/file/${doc.id}`;
                    }}
                    className="w-full sm:flex-1 flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 text-xs sm:text-sm"
                  >
                    <svg
                      className="w-4 h-4"
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
                    <span className="font-medium">Analyze</span>
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-16 text-center overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-slate-600/30 backdrop-blur-sm">
                <IconFileAnalytics className="w-16 h-16 text-slate-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>

              <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Upload your first legal document to unlock AI-powered analysis,
                risk assessment, and intelligent insights that help you make
                informed decisions.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setActiveTab("upload")}
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transform hover:scale-105"
                >
                  <IconPlus className="w-5 h-5" />
                  <span>Upload Your First Document</span>
                </button>

                <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                  <div className="flex items-center space-x-2">
                    <IconShield className="w-4 h-4 text-green-400" />
                    <span>Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IconFileAnalytics className="w-4 h-4 text-blue-400" />
                    <span>AI-Powered Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload New Document CTA */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Legal Document Analysis
        </h1>
        <p className="text-slate-400">
          AI-powered legal document analysis and insights
        </p>
      </div>

      <div className="space-y-6">
        {/* Document Info Card */}
        <div className="card-base">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Document Information
            </h2>
            <span className="text-sm text-slate-500">
              Analyzed on{" "}
              {new Date(
                analysisResult.timestamp || Date.now()
              ).toLocaleDateString()}
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">File Name</p>
              <p className="font-medium text-white">
                {analysisResult.fileInfo?.originalName || "Document"}
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Processing Time</p>
              <p className="font-medium text-white">
                {analysisResult.processingTime || "N/A"}
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Pages</p>
              <p className="font-medium text-white">
                {analysisResult.documentProcessing?.pageCount || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="card-base">
          <h2 className="text-lg font-semibold text-white mb-4">
            Document Summary
          </h2>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-slate-300 leading-relaxed">
              {analysisResult.legalAnalysis?.summary || analysisResult.summary}
            </p>
          </div>
        </div>

        {/* Keep all your original analysis sections but with enhanced styling */}
        {analysisResult.legalAnalysis?.parties?.length > 0 && (
          <div className="card-base">
            <h2 className="text-lg font-semibold text-white mb-4">
              Parties Involved
            </h2>
            <div className="space-y-4">
              {analysisResult.legalAnalysis.parties.map((party, index) => (
                <div
                  key={index}
                  className="border border-slate-600 rounded-lg p-4"
                >
                  <h3 className="font-medium text-white mb-2">{party.role}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {party.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Details */}
        <div className="card-base">
          <h2 className="text-lg font-semibold text-white mb-4">
            Payment Details
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h3 className="font-medium text-green-400 mb-2">
                Amount & Terms
              </h3>
              <p className="text-green-300 text-sm leading-relaxed">
                {analysisResult.legalAnalysis?.paymentDetails?.amount ||
                  analysisResult.paymentDetails?.amount ||
                  "Not specified"}
              </p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h3 className="font-medium text-red-400 mb-2">Penalties</h3>
              <p className="text-red-300 text-sm leading-relaxed">
                {analysisResult.legalAnalysis?.paymentDetails?.penalties ||
                  analysisResult.paymentDetails?.penalties ||
                  "Not specified"}
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="font-medium text-blue-400 mb-2">Refunds</h3>
              <p className="text-blue-300 text-sm leading-relaxed">
                {analysisResult.legalAnalysis?.paymentDetails?.refunds ||
                  analysisResult.paymentDetails?.refunds ||
                  "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Duration and Termination */}
        <div className="card-base">
          <h2 className="text-lg font-semibold text-white mb-4">
            Duration & Termination
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <h4 className="font-medium text-white text-sm">Start Date</h4>
                <p className="text-slate-300 text-sm">
                  {analysisResult.legalAnalysis?.durationAndTermination
                    ?.startDate ||
                    analysisResult.durationAndTermination?.startDate ||
                    "Not specified"}
                </p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <h4 className="font-medium text-white text-sm">End Date</h4>
                <p className="text-slate-300 text-sm">
                  {analysisResult.legalAnalysis?.durationAndTermination
                    ?.endDate ||
                    analysisResult.durationAndTermination?.endDate ||
                    "Not specified"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <h4 className="font-medium text-white text-sm">
                  Renewal Terms
                </h4>
                <p className="text-slate-300 text-sm">
                  {analysisResult.legalAnalysis?.durationAndTermination
                    ?.renewal ||
                    analysisResult.durationAndTermination?.renewal ||
                    "Not specified"}
                </p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <h4 className="font-medium text-white text-sm">Termination</h4>
                <p className="text-slate-300 text-sm">
                  {analysisResult.legalAnalysis?.durationAndTermination
                    ?.termination ||
                    analysisResult.durationAndTermination?.termination ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <DocumentChat
          analysisResult={analysisResult}
          documentId={analysisResult?.documentId}
        />

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("upload")}
            className="btn-primary"
          >
            Analyze Another Document
          </button>
          {analysisResult.fileInfo?.fileUrl && (
            <button
              onClick={() =>
                window.open(analysisResult.fileInfo.fileUrl, "_blank")
              }
              className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              View Original Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Placeholder views for Analytics and Settings
const PlaceholderView = ({ title, message }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
    </div>
    <div className="card-base text-center py-20">
      <p className="text-slate-500">{message}</p>
    </div>
  </div>
);

// Main Dashboard Component - keeping all your original functionality
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("documents");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [processingSteps, setProcessingSteps] = useState([]);
  const [fileData, setFileData] = useState(null);

  // Expense-specific state
  const [expenseFile, setExpenseFile] = useState(null);
  const [expenseUploading, setExpenseUploading] = useState(false);
  const [expenseMessage, setExpenseMessage] = useState("");
  const [expenseError, setExpenseError] = useState("");
  const [expenseAnalysisResult, setExpenseAnalysisResult] = useState(null);
  const [expenseProcessingSteps, setExpenseProcessingSteps] = useState([]);

  const { user, logout, authenticatedFetch } = useAuthStore();
  console.log("user from store:", user);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const response = await authenticatedFetch(
          `${API_URL}/api/file/user-files`
        );
        const data = await response.json();
        if (response.ok) {
          setFileData(data.files);
        } else {
          console.error("Error fetching user files:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user files:", error);
      }
    };

    if (user?.email) {
      fetchUserFiles();
    }
  }, [user, authenticatedFetch]);

  const handleLogout = () => {
    logout();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file.");
    if (file.type !== "application/pdf")
      return setError("Only PDF files are accepted.");

    setUploading(true);
    setError("");
    setMessage("");
    setAnalysisResult(null);
    setProcessingSteps([
      { step: "Uploading file...", completed: false, current: true },
      {
        step: "Processing with Document AI...",
        completed: false,
        current: false,
      },
      { step: "Analyzing with Gemini AI...", completed: false, current: false },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await authenticatedFetch(`${API_URL}/api/file/process`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed.");

      setAnalysisResult(data);
      setMessage(`Analysis complete. Processing took ${data.processingTime}.`);
      setProcessingSteps((prev) =>
        prev.map((s) => ({ ...s, completed: true, current: false }))
      );
      setActiveTab("analysis");
      setFile(null);
    } catch (err) {
      setError(err.message || "An error occurred during analysis.");
      setProcessingSteps([]);
    } finally {
      setUploading(false);
    }
  };

  // Expense-specific functions
  const handleExpenseFileChange = (e) => {
    setExpenseFile(e.target.files[0]);
    setExpenseMessage("");
    setExpenseError("");
  };

  const handleExpenseUpload = async () => {
    if (!expenseFile) return setExpenseError("Please select a file.");
    if (expenseFile.type !== "application/pdf")
      return setExpenseError("Only PDF files are accepted.");

    setExpenseUploading(true);
    setExpenseError("");
    setExpenseMessage("");
    setExpenseAnalysisResult(null);
    setExpenseProcessingSteps([
      {
        step: "Uploading expense document...",
        completed: false,
        current: true,
      },
      {
        step: "Processing with Document AI...",
        completed: false,
        current: false,
      },
      { step: "Analyzing expense data...", completed: false, current: false },
    ]);

    const formData = new FormData();
    formData.append("file", expenseFile);

    try {
      const res = await authenticatedFetch(
        `${API_URL}/api/file/process-expense`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Expense processing failed.");

      setExpenseAnalysisResult(data);
      setExpenseMessage(
        `Expense analysis complete. Processing took ${data.processingTime}.`
      );
      setExpenseProcessingSteps((prev) =>
        prev.map((s) => ({ ...s, completed: true, current: false }))
      );
      setExpenseFile(null);

      // Refresh user files to show the new expense document
      if (data.savedToDatabase) {
        const response = await authenticatedFetch(
          `${API_URL}/api/file/user-files`
        );
        const fileData = await response.json();
        if (response.ok) {
          setFileData(fileData.files);
        }
      }
    } catch (err) {
      setExpenseError(
        err.message || "An error occurred during expense analysis."
      );
      setExpenseProcessingSteps([]);
    } finally {
      setExpenseUploading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "documents":
        return (
          <DocumentsView setActiveTab={setActiveTab} fileData={fileData} />
        );
      case "upload":
        return (
          <UploadView
            {...{
              handleFileChange,
              handleUpload,
              file,
              uploading,
              message,
              error,
              processingSteps,
            }}
          />
        );
      case "expenses":
        return (
          <ExpenseView
            {...{
              handleExpenseFileChange,
              handleExpenseUpload,
              expenseFile,
              expenseUploading,
              expenseMessage,
              expenseError,
              expenseProcessingSteps,
              expenseAnalysisResult,
            }}
          />
        );
      case "analysis":
        return (
          <AnalysisView
            analysisResult={analysisResult}
            setActiveTab={setActiveTab}
            fileData={fileData}
          />
        );
      case "analytics":
        return (
          <PlaceholderView
            title="Analytics"
            message="Analytics dashboard coming soon."
          />
        );
      case "settings":
        return (
          <PlaceholderView
            title="Settings"
            message="Account settings panel coming soon."
          />
        );
      default:
        return (
          <DocumentsView setActiveTab={setActiveTab} fileData={fileData} />
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 font-sans overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} handleLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        .btn-primary {
          @apply px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base;
        }

        .btn-secondary {
          @apply px-4 py-2 sm:px-6 sm:py-3 bg-slate-700/50 border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-600/50 hover:text-white transition-all duration-200 text-sm sm:text-base;
        }

        .card-base {
          @apply bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300;
        }
      `}</style>
    </ProtectedRoute>
  );
}
