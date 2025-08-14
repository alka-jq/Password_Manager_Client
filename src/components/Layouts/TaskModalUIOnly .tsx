// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/store';
// import { addTask, editTask, closeModal } from '@/store/Slices/taskSlice';
// import { X, Eye, EyeOff, Plus, Link as LinkIcon, FileText } from 'lucide-react';
// import { FaCircle } from 'react-icons/fa';

// const TaskModalUIOnly = () => {
//   const dispatch = useDispatch();
//   const { isModalOpen, modalMode, editTask: task } = useSelector((state: RootState) => state.task);
//   const isEdit = modalMode === 'edit';
//   const [title, setTitle] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [totp, setTotp] = useState('');
//   const [websites, setWebsites] = useState<string[]>(['']);
//   const [note, setNote] = useState('');
//   const [errors, setErrors] = useState({ title: false });

//   const resetForm = () => {
//     setTitle('');
//     setEmail('');
//     setPassword('');
//     setTotp('');
//     setWebsites(['']);
//     setNote('');
//     setErrors({ title: false });
//   };

//   useEffect(() => {
//     if (isEdit && task) {
//       setTitle(task.title || '');
//       setEmail(task.email || '');
//       setPassword(task.password || '');
//       setTotp(task.totp || '');
//       setWebsites(task.websites || ['']);
//       setNote(task.note || '');
//     } else {
//       resetForm();
//     }
//   }, [isEdit, task]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       setErrors({ ...errors, title: true });
//       return;
//     }

//     const payload = {
//       title: title.trim(),
//       email,
//       password,
//       totp,
//       websites: websites.filter(website => website.trim() !== ''),
//       note,
//     };

//     if (isEdit && task) {
//       dispatch(editTask({ id: task.id, updates: payload }));
//     } else {
//       dispatch(addTask(payload));
//     }
//     dispatch(closeModal());
//     resetForm();
//   };

//   const handleWebsiteChange = (index: number, value: string) => {
//     const newWebsites = [...websites];
//     newWebsites[index] = value;
//     setWebsites(newWebsites);
//   };

//   const addWebsite = () => {
//     setWebsites([...websites, '']);
//   };

//   const removeWebsite = (index: number) => {
//     if (websites.length <= 1) return;
//     const newWebsites = [...websites];
//     newWebsites.splice(index, 1);
//     setWebsites(newWebsites);
//   };

//   if (!isModalOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={() => dispatch(closeModal())}>
//       <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-white/80 dark:bg-[#1c1c1f]/90 backdrop-blur-lg shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
//         {/* Header */}
//         {/* <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/40 dark:border-white/10">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             {isEdit ? 'Edit Task' : 'Add New Task'}
//           </h2>
//           <button
//             onClick={() => dispatch(closeModal())}
//             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div> */}

//         <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
//           {/* Title Section */}
//           <div>
//             <div className="flex items-center mb-2">
//               <FaCircle className="text-xs text-gray-400 mr-2" />
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                 Title
//               </label>
//             </div>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => {
//                 setTitle(e.target.value);
//                 setErrors({ ...errors, title: false });
//               }}
//               className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white font-medium`}
//             />
//             {errors.title && (
//               <p className="mt-1 text-sm text-red-600">Title is required</p>
//             )}
//           </div>

//           {/* Email Section */}
//           <div>
//             <div className="flex items-center mb-2">
//               <FaCircle className="text-xs text-gray-400 mr-2" />
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                 Email or username
//               </label>
//             </div>
//             <input
//               type="text"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter email or username"
//               className="w-full px-4 py-3 border rounded-lg text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
//             />
//           </div>

//           {/* Password Section */}
//           <div>
//             <div className="flex items-center mb-2">
//               <FaCircle className="text-xs text-gray-400 mr-2" />
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                 Password
//               </label>
//             </div>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 className="w-full px-4 py-3 border rounded-lg text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* 2FA Section */}
//           <div>
//             <div className="flex items-center mb-2">
//               <FaCircle className="text-xs text-gray-400 mr-2" />
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                 2FA secret key (TOTP)
//               </label>
//             </div>
//             <input
//               type="text"
//               value={totp}
//               onChange={(e) => setTotp(e.target.value)}
//               placeholder="Add 2FA secret key"
//               className="w-full px-4 py-3 border rounded-lg text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
//             />
//           </div>

//           <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
//             {/* Websites Section */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <LinkIcon className="text-gray-400 mr-2" size={14} />
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                   Websites
//                 </label>
//               </div>
//               {websites.map((website, index) => (
//                 <div key={index} className="flex mb-2">
//                   <input
//                     type="url"
//                     value={website}
//                     onChange={(e) => handleWebsiteChange(index, e.target.value)}
//                     className="flex-1 px-4 py-3 border rounded-lg text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
//                     placeholder="https://"
//                   />
//                   {websites.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeWebsite(index)}
//                       className="ml-2 px-3 bg-red-100 text-red-600 rounded-md hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addWebsite}
//                 className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2 text-sm"
//               >
//                 <Plus className="mr-1" size={14} /> Add
//               </button>
//             </div>

//             {/* Note Section */}
//             <div className="mt-6">
//               <div className="flex items-center mb-2">
//                 <FileText className="text-gray-400 mr-2" size={14} />
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                   Note
//                 </label>
//               </div>
//               <textarea
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 placeholder="Add note"
//                 className="w-full px-4 py-3 border rounded-lg text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white dark:bg-gray-800 dark:text-white"
//               />
//               <button
//                 type="button"
//                 className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2 text-sm"
//               >
//                 <Plus className="mr-1" size={14} /> Add more
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-white/10">
//             <button
//               type="button"
//               onClick={() => dispatch(closeModal())}
//               className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-5 py-2.5 rounded-xl bg-[#2565C7] text-white hover:bg-blue-700 transition"
//             >
//               {isEdit ? 'Update Task' : 'Add Task'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TaskModalUIOnly;


"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { addTask, editTask, closeModal } from "@/store/Slices/taskSlice";
import {
  X,
  Eye,
  EyeOff,
  Plus,
  LinkIcon,
  FileText,
  User,
  Lock,
  Shield,
  Trash2,
  AlertCircle,
  Paperclip,
  Upload,
} from "lucide-react";
import VaultDropdown from "./VaultDropdown";
import { useVaults } from "@/useContext/VaultContext";

const TaskModalUIOnly = () => {
  const { vaults } = useVaults();
  const dispatch = useDispatch();
  const { isModalOpen, modalMode, editTask: task } = useSelector(
    (state: RootState) => state.task
  );

  const isEdit = modalMode === "edit";

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totp, setTotp] = useState("");
  const [websites, setWebsites] = useState<string[]>([""]);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({ title: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState(vaults[0]?.key || "");
const [attachments, setAttachments] = useState<File[]>([]);
const fileInputRef = useRef<HTMLInputElement | null>(null);


const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  setAttachments((prev) => [...prev, ...files]);
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files || []);
  setAttachments((prev) => [...prev, ...files]);
};

const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
};

const removeAttachment = (index: number) => {
  setAttachments((prev) => prev.filter((_, i) => i !== index));
};

  const resetForm = () => {
    setTitle("");
    setEmail("");
    setPassword("");
    setTotp("");
    setWebsites([""]);
    setNote("");
    setErrors({ title: false });
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isEdit && task) {
      setTitle(task.title || "");
      setEmail(task.email || "");
      setPassword(task.password || "");
      setTotp(task.totp || "");
      setWebsites(task.websites || [""]);
      setNote(task.note || "");
      setSelectedTab(task.vaultKey || vaults[0]?.key || "");
    } else {
      resetForm();
      setSelectedTab(vaults[0]?.key || "");
    }
  }, [isEdit, task, vaults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrors({ ...errors, title: true });
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const selectedVault = vaults.find((v) => v.key === selectedTab);

    const payload = {
      title: title.trim(),
      email,
      password,
      totp,
      websites: websites.filter((website) => website.trim() !== ""),
      note,
       attachments, 
      vaultKey: selectedTab,
      vaultName: selectedVault?.name || "",
      // Optional extras:
      vaultIcon: selectedVault?.icon || "",
      vaultColor: selectedVault?.color || "",
    };

    if (isEdit && task) {
      dispatch(editTask({ id: task.id, updates: payload }));
    } else {
      dispatch(addTask(payload));
    }

    dispatch(closeModal());
    resetForm();
  };

  const handleWebsiteChange = (index: number, value: string) => {
    const newWebsites = [...websites];
    newWebsites[index] = value;
    setWebsites(newWebsites);
  };

  const addWebsite = () => {
    setWebsites([...websites, ""]);
  };

  const removeWebsite = (index: number) => {
    if (websites.length <= 1) return;
    const newWebsites = [...websites];
    newWebsites.splice(index, 1);
    setWebsites(newWebsites);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="fixed inset-0" onClick={() => dispatch(closeModal())} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 bg-white dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEdit ? "Edit Credential" : "Add New Credential"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEdit
                  ? "Update your saved credential"
                  : "Securely store your login information"}
              </p>
            </div>
          <VaultDropdown
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          </div>


          <button
            onClick={() => dispatch(closeModal())}
            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] thin-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 text-gray-500" />
                Title
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20">
                  Required
                </span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors({ ...errors, title: false });
                }}
                placeholder="e.g., Gmail, GitHub..."
                className={`w-full h-11 px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              />
              {errors.title && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Title is required
                </div>
              )}
            </div>

            {/* Credentials Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Shield className="h-4 w-4" />
                Login Credentials
              </div>

              {/* Email/Username */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-gray-500" />
                  Email or Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-11 px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-11 w-10 flex items-center justify-center text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* TOTP */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4 text-gray-500" />
                  2FA Secret Key (TOTP)
                </label>
                <input
                  type="text"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                  placeholder="ABC123..."
                  className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Websites */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <LinkIcon className="h-4 w-4 text-gray-500" />
                  Associated Websites
                </label>
                <button
                  type="button"
                  onClick={addWebsite}
                  className="h-8 px-3 rounded-lg border text-sm flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add URL
                </button>
              </div>
              {websites.map((website, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => handleWebsiteChange(index, e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
                  />
                  {websites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWebsite(index)}
                      className="h-10 w-10 flex items-center justify-center border rounded-lg text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-gray-500" />
                Notes
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white resize-none"
              />
            </div>

              {/* Attachments Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Paperclip className="h-4 w-4 text-gray-500" />
                            Attachments
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Upload files from your device.</p>
            
                          <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-8 text-center bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200 cursor-pointer"
                          >
                            <Upload className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <p className="text-green-700 dark:text-green-300 font-medium">Choose a file or drag it here</p>
                          </div>
            
                          <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
            
                          {attachments.length > 0 && (
                            <div className="space-y-2">
                              {attachments.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeAttachment(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 pb-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => dispatch(closeModal())}
                className="h-11 px-6 rounded-lg border"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-6 rounded-lg bg-blue-600 text-white"
              >
                {isSubmitting ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModalUIOnly;
