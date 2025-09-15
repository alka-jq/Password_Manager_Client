import React, { useState, useEffect, useRef } from 'react';
import {
  User, Lock, Shield, Link as LinkIcon, FileText,
  X, Eye, EyeOff, Copy, CheckCircle, Trash, Plus, Edit3,
  Globe, Calendar, Save, RotateCcw
} from 'lucide-react';
import apiClient from '@/service/apiClient';
import { useDispatch, useSelector } from "react-redux"
import { fetchAlldata, fetchcellIdData, fetchPersonalData, fetchPinData } from '../../store/Slices/TableSlice';
import type { AppDispatch } from '@/store';
import { ImageFile } from '@/components/imageFile';
import CellDropDwon from '../Components/Cells/CellDropDwon';
import { encryptFileattachment } from '@/utils/attachments-encryption';
import { fetchUserKeys, initializeCrypto } from '@/utils/cryptoUtils';

type TableItem = {
  id: string;
  title: string;
  type: string;
};

type Props = {
  item: TableItem | null;
  onClose: () => void;
  editMode?: boolean;
};

interface Attachment {
  name: string;
  type: string;
  encryptedData: string;
}

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
  attachments?: Attachment[];
  attachmentFiles?: File[];
}

const ViewLogInModal = ({ item, onClose, editMode }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [details, setDetails] = useState<LoginDetails | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [cellId, setCellId] = useState<string | null>(null);
  const [personal, setPersonal] = useState<boolean>(false);
  const [currentcellId, setCurrentCellId] = useState<string>()

  useEffect(() => {
    if (!item?.id) return;

    const fetchLoginDetails = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/password/items/${item.id}`);
        const apiItem = res.data.item;
        const cell = apiItem.cell_id
        setCurrentCellId(cell)
        const formattedData: LoginDetails = {
          id: apiItem.id,
          title: apiItem.title,
          email: apiItem.email || '',
          username: apiItem.username || '',
          password: apiItem.password || '',
          totp: apiItem.two_factor_secret || '',
          websites: apiItem.websites || [],
          note: apiItem.notes || '',
          attachments: apiItem.attachments || [],
          lastUpdated: apiItem.updated_at,
        };

        setDetails(formattedData);
      } catch (err) {
        console.error('Error fetching login item:', err);
        setError('Failed to load login item.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoginDetails();
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

    const handleSave = async () => {
    if (!details) return;

    setLoading(true);
    setError(null);

    // Removed the block that resets cellId when personal is true to allow coexistence

    try {
      // Initialize crypto with token from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        initializeCrypto(token);
      }

      // Encrypt new files
      const keys = await fetchUserKeys();
      const publicKey = keys.publicKey;
      const newAttachments = [];
      for (const file of details.attachmentFiles || []) {
        try {
          const encrypted = await encryptFileattachment(file, publicKey);
          newAttachments.push(encrypted);
        } catch (err) {
          console.error('Error encrypting file:', err);
          setError('Failed to encrypt file.');
          setLoading(false);
          return;
        }
      }
      const allAttachments = [...(details.attachments || []), ...newAttachments];

      const payload = {
        title: details.title,
        email: details.email,
        username: details.username,
        password: details.password,
        two_factor_secret: details.totp,
        websites: details.websites,
        notes: details.note,
        attachments: allAttachments,
        is_personal: personal,
        is_pin: false,
        is_trash: false,
        type: 'login',
        cell_id: cellId || null
      };

      const response = await apiClient.put(`/api/login-credentials/edit/${details.id}`, payload);
      console.log("Save successful:", response.data.message);
      // Update local state
      setDetails(prev => prev ? { ...prev, attachments: allAttachments, attachmentFiles: [] } : prev);
      onClose();
      if (location.pathname === '/all_items') {
        dispatch(fetchAlldata());
      }
      if (location.pathname === '/personal') {
        dispatch(fetchPersonalData())
      }
      if (location.pathname == '/pin') {
        dispatch(fetchPinData())
      }
      if (currentcellId) {
        dispatch(fetchcellIdData(currentcellId));
      }
    } catch (err) {
      console.error("Failed to save:", err);
      setError("Failed to update login credential.");
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white">
              <User className="w-5 h-5" />
              {editMode ? (
                <input
                  type="text"
                  value={details?.title || ''}
                  onChange={(e) =>
                    setDetails((prev: any) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="border-b border-gray-400 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500 text-lg font-bold px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500/30"
                  autoFocus
                  placeholder="Enter title"
                />
              ) : (
                details?.title || 'Untitled'
              )}
            </h2>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            >
              Login
            </span>
          </div>
          {/* Cell dropdown */}
          <div className='flex gap-2'>
            {editMode && (
              <CellDropDwon cellId={cellId} setCellId={setCellId} personal={personal} setPersonal={setPersonal} initialCellId={currentcellId} initialPersonal={personal} />
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 text-sm overflow-y-auto flex-1">
          {error && (
            <div className="p-3 mb-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <User className="w-4 h-4" />
              Email
            </div>
            {editMode ? (
              <div className="relative">
                <input
                  type="email"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={details?.email || ''}
                  onChange={(e) =>
                    setDetails((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev
                    )
                  }
                  placeholder="Enter email address"
                />
                {details?.email && (
                  <button
                    onClick={() => handleCopy(details.email!, 'email')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'email' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`flex items-center justify-between p-3 rounded-lg ${details?.email
                  ? 'bg-gray-50 dark:bg-gray-800/50'
                  : 'bg-gray-100/50 dark:bg-gray-800/30'
                  }`}
              >
                <span
                  className={`${details?.email
                    ? 'text-gray-800 dark:text-gray-200'
                    : 'text-gray-400 dark:text-gray-500 italic'
                    }`}
                >
                  {details?.email || 'Not provided'}
                </span>
                {details?.email && (
                  <button
                    onClick={() => handleCopy(details.email!, 'email')}
                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'email' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Password  */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <Lock className="w-4 h-4" />
              Password
            </div>
            {editMode ? (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  value={details?.password || ''}
                  onChange={(e) =>
                    setDetails((prev) =>
                      prev ? { ...prev, password: e.target.value } : prev
                    )
                  }
                  placeholder="Enter password"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {details?.password && (
                    <button
                      onClick={() => handleCopy(details.password!, 'password')}
                      className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedField === 'password' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ) : (
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
            )}
          </div>

          {/* 2FA Secret (TOTP) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <Shield className="w-4 h-4" />
              2FA Secret Key (TOTP)
            </div>

            {editMode ? (
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                  value={details?.totp || ''}
                  onChange={(e) =>
                    setDetails((prev) =>
                      prev ? { ...prev, totp: e.target.value } : prev
                    )
                  }
                  placeholder="Enter 2FA secret key"
                />
                {details?.totp && (
                  <button
                    onClick={() => handleCopy(details.totp!, 'totp')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'totp' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            ) : (
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
            )}
          </div>

          {/* Websites */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
                <LinkIcon className="w-4 h-4" />
                Websites ({details?.websites ? details.websites.length : 0})
              </div>
              {editMode && (
                <button
                  onClick={() =>
                    setDetails((prev) =>
                      prev
                        ? {
                          ...prev,
                          websites: [...(prev.websites || []), '']
                        }
                        : prev
                    )
                  }
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Plus size={14} />
                  Add URL
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-2">
                {(details?.websites || []).map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="url"
                        value={url}
                        className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onChange={(e) =>
                          setDetails((prev) =>
                            prev
                              ? {
                                ...prev,
                                websites: prev.websites?.map((u, i) =>
                                  i === idx ? e.target.value : u
                                )
                              }
                              : prev
                          )
                        }
                        placeholder="https://example.com"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setDetails((prev) =>
                          prev
                            ? {
                              ...prev,
                              websites: prev.websites?.filter((_, i) => i !== idx)
                            }
                            : prev
                        )
                      }
                      className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-lg transition-colors"
                      title="Remove this website"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
                {(!details?.websites || details.websites.length === 0) && (
                  <div className="text-center py-4 text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No websites added yet</p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`p-3 rounded-lg ${details?.websites && details.websites.length > 0
                  ? 'bg-gray-50 dark:bg-gray-800/50'
                  : 'bg-gray-100/50 dark:bg-gray-800/30'
                  }`}
              >
                {details?.websites && details.websites.length > 0 ? (
                  <div className="space-y-2">
                    {details.websites.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[70%] flex items-center gap-1"
                        >
                          <Globe size={14} />
                          {url}
                        </a>
                        <button
                          onClick={() => handleCopy(url, `website-${idx}`)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                          title="Copy URL"
                        >
                          {copiedField === `website-${idx}` ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 italic">
                    No websites provided
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <FileText className="w-4 h-4" />
              Note
            </div>

            {editMode ? (
              <div className="relative">
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[100px]"
                  value={details?.note || ''}
                  onChange={(e) =>
                    setDetails((prev) =>
                      prev ? { ...prev, note: e.target.value } : prev
                    )
                  }
                  placeholder="Add your notes here..."
                />
                <Edit3 className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
              </div>
            ) : (
              <div className={`p-3 rounded-lg ${details?.note ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                <p className={`${details?.note ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 italic'} whitespace-pre-line break-words`}>
                  {details?.note || 'No notes provided'}
                </p>
              </div>
            )}
          </div>

          {/* File(s) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <FileText className="w-4 h-4" />
              File
            </div>

            {editMode ? (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Any file type (Max: 10MB)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setDetails(prev =>
                        prev ? { ...prev, attachmentFiles: [...(prev.attachmentFiles || []), ...files] } : prev
                      );
                    }}
                  />
                </label>

                {details?.attachmentFiles && details.attachmentFiles.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Selected files:</h4>
                    <ul className="space-y-2">
                      {details.attachmentFiles.map((file: File, idx: number) => (
                        <li key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[70%]">{file.name}</span>
                          <button
                            onClick={() => setDetails(prev =>
                              prev ? {
                                ...prev,
                                attachmentFiles: prev.attachmentFiles?.filter((_, i) => i !== idx)
                              } : prev
                            )}
                            className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
                            title="Remove file"
                          >
                            <Trash size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className={`p-3 rounded-lg ${details?.attachments && details.attachments.length > 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                {details?.attachments && details.attachments.length > 0 ? (
                  <ImageFile attachments={details.attachments.map((attachment: any, idx: number) => {
                    let name = `File ${idx + 1}`;
                    let encryptedData = '';
                    let type = 'application/octet-stream';

                    if (typeof attachment === 'string') {
                      encryptedData = attachment;
                      // Try to extract file name from encryptedData string if possible
                      const match = attachment.match(/([^\/]+)$/);
                      if (match) {
                        name = decodeURIComponent(match[1]);
                      }
                    } else if (typeof attachment === 'object' && attachment !== null) {
                      name = attachment.name || name;
                      encryptedData = attachment.encryptedData || '';
                      type = attachment.type || type;
                    }

                    return {
                      name,
                      encryptedData,
                      type
                    };
                  })} />
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">No files uploaded</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#2a2b30] rounded-b-xl">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar size={14} />
            Last updated: {details?.lastUpdated ? new Date(details.lastUpdated).toLocaleDateString() : new Date().toLocaleDateString()}
          </div>

          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:focus:ring-offset-gray-800"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2.5 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={16} />
                )}
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewLogInModal;