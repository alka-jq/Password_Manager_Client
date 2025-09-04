import React, { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vaultName: string; // Optional prop if you want to use vault info
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState("");

  const handleShare = () => {
    if (!inputValue.trim()) {
      alert("Please enter a link or email");
      return;
    }
    alert(`File shared with: ${inputValue}`);
    setInputValue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 w-80 max-w-full shadow-lg flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Share Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-600 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 8a3 3 0 11-2.83 4H8a3 3 0 110-6h4.17a3 3 0 012.83 2zM12 12v9m0 0l-3-3m3 3l3-3"
          />
        </svg>

        <p className="mb-4 text-gray-700 font-medium text-center">
          Please provide the link or email
        </p>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter link or email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
        />

        <button
          onClick={handleShare}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Share File
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
