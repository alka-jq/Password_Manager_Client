import React, { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recipient: string) => void;
  vaultName?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState("");

  const handleShare = () => {
    if (!inputValue.trim()) {
      alert("Please enter a link or email");
      return;
    }
    onConfirm(inputValue);
    setInputValue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl border border-gray-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Centered Icons */}
        <div className="flex flex-col items-center mb-6">
          {/* User Icon */}
          <div className="bg-blue-100 rounded-full p-3 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 10a4 4 0 100-8 4 4 0 000 8z" />
              <path
                fillRule="evenodd"
                d="M.458 16C1.732 12.943 5.522 11 10 11c4.478 0 8.268 1.943 9.542 5H.458z"
                clipRule="evenodd"
              />
            </svg>
          </div>  
        </div>

        {/* Title & Description */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">
          Share Your Vault
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter an email or link to securely share this vault.
        </p>

        {/* Input Field (Improved) */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. someone@example.com"
          className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition mb-5"
        />

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition text-sm"
        >
          Share Now
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
