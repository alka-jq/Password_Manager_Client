import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Lock, Shield, Link as LinkIcon, FileText, 
  X, Eye, EyeOff, Copy, CheckCircle 
} from 'lucide-react';

type TableItem = { 
  id: string; 
  title: string; 
  type: string; 
};

type Props = { 
  item: TableItem | null;
  onClose: () => void;
};

// Dummy data structure for login items
interface LoginDetails {
  id: string;
  title: string;
  email?: string;
  username?: string;
  password?: string;
  totp?: string;
  websites?: string[];
  note?: string;
  lastUpdated: string;
}

const ViewLogInModal = ({ item, onClose }: Props) => {
  const [details, setDetails] = useState<LoginDetails | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Dummy data for demonstration
  const dummyLoginData: LoginDetails = {
    id: item?.id || '1',
    title: item?.title || 'Sample Login',
    email: 'user@example.com',
    username: 'johndoe123',
    password: 'SecurePassword123!',
    totp: 'JBSWY3DPEHPK3PXP',
    websites: [
      'https://example.com/login',
      'https://app.example.com'
    ],
    note: 'This is a sample login entry with multi-factor authentication enabled.',
    lastUpdated: new Date().toISOString()
  };

  useEffect(() => {
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      setDetails(dummyLoginData);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [item]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle copy to clipboard
  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-xl bg-white dark:bg-[#1e1f24] shadow-xl border border-gray-300 dark:border-gray-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#2a2b30] dark:to-[#23242a] rounded-t-xl">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{details?.title || item.title}</h2>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            >
              Login
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 text-sm overflow-y-auto flex-1">
          {/* Email - Always visible */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <User className="w-4 h-4" />
              Email
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg ${details?.email ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
              <span className={`${details?.email ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                {details?.email || 'Not provided'}
              </span>
              {details?.email && (
                <button 
                  onClick={() => handleCopy(details.email!, 'email')}
                  className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === 'email' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <User className="w-4 h-4" />
              Username
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg ${details?.username ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
              <span className={`${details?.username ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                {details?.username || 'Not provided'}
              </span>
              {details?.username && (
                <button 
                  onClick={() => handleCopy(details.username!, 'username')}
                  className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === 'username' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </div>

          {/* Password - Always visible */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <Lock className="w-4 h-4" />
              Password
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg ${details?.password ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
              <span className={`${details?.password ? 'text-gray-800 dark:text-gray-200 font-mono' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                {details?.password ? (showPassword ? details.password : '•'.repeat(12)) : 'Not provided'}
              </span>
              {details?.password ? (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button 
                    onClick={() => handleCopy(details.password!, 'password')}
                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'password' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* 2FA Secret (TOTP) - Always visible */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <Shield className="w-4 h-4" />
              2FA Secret Key (TOTP)
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg ${details?.totp ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
              <span className={`${details?.totp ? 'text-gray-800 dark:text-gray-200 font-mono' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                {details?.totp || 'Not provided'}
              </span>
              {details?.totp && (
                <button 
                  onClick={() => handleCopy(details.totp!, 'totp')}
                  className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === 'totp' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </div>

          {/* Websites - Always visible */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <LinkIcon className="w-4 h-4" />
              Websites ({details?.websites ? details.websites.length : 0})
            </div>
            <div className={`p-3 rounded-lg ${details?.websites && details.websites.length > 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
              {details?.websites && details.websites.length > 0 ? (
                <div className="space-y-2">
                  {details.websites.map((url, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[70%]"
                      >
                        {url}
                      </a>
                      <button 
                        onClick={() => handleCopy(url, `website-${idx}`)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        title="Copy URL"
                      >
                        {copiedField === `website-${idx}` ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 italic">No websites provided</span>
              )}
            </div>
          </div>

          {/* Note - Always visible */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <FileText className="w-4 h-4" />
              Note
            </div>
            <div className={`p-3 rounded-lg ${details?.note ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
              <p className={`${details?.note ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 italic'} whitespace-pre-line break-words`}>
                {details?.note || 'No notes provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#2a2b30] rounded-b-xl">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {details?.lastUpdated ? new Date(details.lastUpdated).toLocaleDateString() : new Date().toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewLogInModal;