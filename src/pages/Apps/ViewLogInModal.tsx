import React, { useState, useEffect, useRef } from 'react';
import {
  User, Lock, Shield, Link as LinkIcon, FileText,
  X, Eye, EyeOff, Copy, CheckCircle, Trash,
} from 'lucide-react';
import apiClient from '@/service/apiClient';
import { useDispatch, useSelector } from "react-redux"
import { fetchAlldata } from '../../store/Slices/TableSlice';
import type { AppDispatch } from '@/store';

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
  attachments?: string[];
}

const ViewLogInModal = ({ item, onClose, editMode }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [details, setDetails] = useState<LoginDetails | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item?.id) return;

    const fetchLoginDetails = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/password/items/${item.id}`);
        const apiItem = res.data.item;

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

    try {
      const payload = {
        title: details.title,
        email: details.email,
        username: details.username,
        password: details.password,
        two_factor_secret: details.totp,
        websites: details.websites,
        notes: details.note,
        attachments: details.attachments,
        is_personal: false, // If needed, change based on your UI
        is_pin: false,
        is_trash: false,
        type: 'login',
      };

      const response = await apiClient.put(`/api/login-credentials/edit/${details.id}`, payload);

      console.log("Save successful:", response.data.message);
      onClose();
      dispatch(fetchAlldata());
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
                  className="border-b border-gray-400 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500 text-lg font-bold"
                  autoFocus
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
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 text-sm overflow-y-auto flex-1">

          {/* Email */}
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
                <User className="w-4 h-4" />
                Email
              </div>
              {editMode ? (
                <input
                  type="email"
                  className="w-full p-2 rounded border dark:bg-gray-900 dark:text-white"
                  value={details?.email || ''}
                  onChange={(e) =>
                    setDetails((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev
                    )
                  }
                />
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
          </>

          {/* ----------------------------------------- */}

          {/* Password  */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <Lock className="w-4 h-4" />
              Password
            </div>
            {editMode ? (
              <>
                <input className="w-full p-2 rounded border dark:bg-gray-900 dark:text-white"
                  type='text' value={details?.password || ''}
                  onChange={(e) =>
                    setDetails((prev) =>
                      prev ? { ...prev, password: e.target.value } : prev
                    )
                  } />
              </>

            ) : (
              <>
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
              </>
            )}

          </div>

          {/* 2FA Secret (TOTP) - Always visible */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <Shield className="w-4 h-4" />
              2FA Secret Key (TOTP)
            </div>

            {editMode ? (
              <input
                type="text"
                className="w-full p-2 rounded border dark:bg-gray-900 dark:text-white font-mono"
                value={details?.totp || ''}
                onChange={(e) =>
                  setDetails((prev) =>
                    prev ? { ...prev, totp: e.target.value } : prev
                  )
                }
              />
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


          {/* Websites - Always visible */}
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
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Add URL
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-2">
                {(details?.websites || []).map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={url}
                      className="flex-1 p-2 rounded border dark:bg-gray-900 dark:text-white"
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
                    />
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
                      className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 rounded transition-colors"
                      title="Remove this website"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
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
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[70%]"
                        >
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




          {/* Note - Always visible */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
              <FileText className="w-4 h-4" />
              Note
            </div>

            {editMode ? (
              <textarea
                className="w-full p-2 rounded border dark:bg-gray-900 dark:text-white resize-none min-h-[100px]"
                value={details?.note || ''}
                onChange={(e) =>
                  setDetails((prev) =>
                    prev ? { ...prev, note: e.target.value } : prev
                  )
                }
              />
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
              File{details?.attachments && details.attachments.length !== 1 ? 's' : ''}
            </div>

            {editMode ? (
              <div className="space-y-2">
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).map(file => file.name);
                    setDetails(prev =>
                      prev ? { ...prev, file: files } : prev
                    );
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white dark:hover:file:bg-gray-600"
                />
                {details?.attachments?.length ? (
                  <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
                    {details.attachments.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">No files selected</p>
                )}
              </div>
            ) : (
              <div className={`p-3 rounded-lg ${details?.attachments && details.attachments.length > 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                {details?.attachments && details.attachments.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
                    {details.attachments.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">No files uploaded</p>
                )}
              </div>
            )}
          </div>


        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#2a2b30] rounded-b-xl">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {details?.lastUpdated ? new Date(details.lastUpdated).toLocaleDateString() : new Date().toLocaleDateString()}
          </div>

          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={onClose} // ← Cancel edit mode (you must define this)
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave} // ← Save changes (you must define this)
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Save
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