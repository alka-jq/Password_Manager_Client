import React from "react";
import { IoCloseSharp } from "react-icons/io5";

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    url: string;
    type: string;
  } | null;
}

const AttachmentModal: React.FC<AttachmentModalProps> = ({ isOpen, onClose, file }) => {
  if (!isOpen || !file) return null;

  const renderContent = () => {
    // Handle base64 encoded image
    if (file.type.startsWith('image/')) {
      // Create proper data URL for base64 image
      const src = file.url.startsWith('data:') ? file.url : `data:${file.type};base64,${file.url}`;
      
      return (
        <img 
          src={src} 
          alt={file.name} 
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = ''; // Clear broken image
          }}
        />
      );
    } else if (file.type === "application/pdf") {
      return <iframe src={file.url} className="w-full h-[80vh] rounded-lg border-none" />;
    } else if (file.type.startsWith('video/')) {
      return <video src={file.url} controls className="max-h-[80vh] rounded-lg" />;
    } else if (file.type.startsWith('audio/')) {
      return <audio src={file.url} controls className="w-full" />;
    } else {
      return (
        <div className="text-center p-4">
          <p className="mb-4 text-lg font-semibold">Cannot preview this file type.</p>
          <a
            href={file.url}
            download={file.name}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download {file.name}
          </a>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center p-4">
      <div className="relative bg-white dark:bg-[#1e1e1e] p-4 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-700 dark:text-white hover:text-red-500"
        >
          <IoCloseSharp />
        </button>
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-lg font-semibold text-center dark:text-white">
            {file.name}
          </div>
          <div className="w-full flex justify-center">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;