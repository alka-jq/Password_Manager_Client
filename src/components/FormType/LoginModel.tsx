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
import { useVaults } from "@/useContext/VaultContext";
import VaultDropdown from "../Layouts/VaultDropdown";
import { addLoginCredentials } from "@/service/TableDataService";
import { fetchAlldata } from '../../store/Slices/TableSlice';
import type { AppDispatch } from '@/store';

const TaskModalUIOnly = () => {
  const { vaults: rawVaults } = useVaults();
  const vaults = rawVaults ?? [];
  const dispatch = useDispatch<AppDispatch>()
  const { isModalOpen, modalMode, editTask: task } = useSelector(
    (state: RootState) => state.task
  );

  const isEdit = modalMode === "edit";

  // Form state
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totp, setTotp] = useState("");
  const [websites, setWebsites] = useState<string[]>([""]);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({ title: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedTab, setSelectedTab] = useState<string>(() => {
    return "";
  });

  // Initialize form state when modal opens or task changes
  useEffect(() => {
    if (isEdit && task) {
      setTitle(task.title || "");
      setEmail(task.email || "");
      setPassword(task.password || "");
      setTotp(task.totp || "");
      setWebsites(task.websites || [""]);
      setNote(task.note || "");
      // setSelectedTab(task.vaultKey || "");
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, task, isEdit]);

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
    setAttachments([]);
    setSelectedTab(""); // ✅ always blank (Personal)
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim()) {
    setErrors({ ...errors, title: true });
    return;
  }

  setIsSubmitting(true);

  try {
    const selectedVault = vaults.find((v) => v.key === selectedTab);

    const formData = new FormData();

    formData.append("title", title.trim());

    if (attachments.length > 0) {
      formData.append("attachment", attachments[0]); // API supports only 1 file
    }

    setIsSubmitting(true);

    try {
      const selectedVault = vaults.find((v) => v.key === selectedTab);

      const formData = new FormData();

      formData.append("title", title.trim());

      if (attachments.length > 0) {
        formData.append("attachment", attachments[0]); // API supports only 1 file
      }

      if (email.trim()) {
        formData.append("email", email.trim());
      } else {
        formData.append("username", email.trim()); // fallback to username if email is empty
      }

      formData.append("two_factor_secret", totp || "");
      formData.append("password", password || "");
      formData.append("websites", websites.filter(w => w.trim()).join(","));
      formData.append("notes", note || "");

      // Replace this with real cell/vault ID — assuming it's selectedTab
      formData.append("cell_id", selectedTab || ""); // Provide default or handle null

      const token = localStorage.getItem("token"); // Get token however your app stores it

      if (!token) {
        throw new Error("User token not found");
      }

      const response = await addLoginCredentials(formData, token);

      console.log("Credential added:", response);

      // You can optionally update Redux here:
      // dispatch(addTask({
      //   title,
      //   email,
      //   password,
      //   totp,
      //   websites,
      //   note,
      //   // vaultKey: selectedTab,
      //   // vaultName: selectedTab === "" ? "Personal" : selectedVault?.name || "",
      //   // vaultIcon: selectedVault?.icon || "",
      //   // vaultColor: selectedVault?.color || "",
      // }));

      dispatch(closeModal());
      dispatch(fetchAlldata());
      resetForm();

    } catch (error) {
      console.error("Error adding credential:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

    formData.append("two_factor_secret", totp || "");
    formData.append("password", password || "");
    formData.append("websites", websites.filter(w => w.trim()).join(","));
    formData.append("notes", note || "");

    // Replace this with real cell/vault ID — assuming it's selectedTab
    formData.append("cell_id", selectedTab || ""); // Provide default or handle null

    const token = localStorage.getItem("token"); // Get token however your app stores it

    if (!token) {
      throw new Error("User token not found");
    }

    const response = await addLoginCredentials(formData, token);

    console.log("Credential added:", response);

    // You can optionally update Redux here:
    // dispatch(addTask({
    //   title,
    //   email,
    //   password,
    //   totp,
    //   websites,
    //   note,
    //   // vaultKey: selectedTab,
    //   // vaultName: selectedTab === "" ? "Personal" : selectedVault?.name || "",
    //   // vaultIcon: selectedVault?.icon || "",
    //   // vaultColor: selectedVault?.color || "",
    // }));

    dispatch(closeModal());
    resetForm();

  } catch (error) {
    console.error("Error adding credential:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={() => dispatch(closeModal())} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-xl animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEdit ? "Edit Credential" : "Add New Credential"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEdit
                  ? "Update your saved credential"
                  : "Securely store your login information"}
              </p>
            </div>
          </div>

          {/* <div className="flex items-center gap-3">
            <VaultDropdown
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <button
              onClick={() => dispatch(closeModal())}
              className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-200 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div> */}
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] thin-scrollbar p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 text-gray-500" />
                Title
                <span className="text-xs text-red-500 ml-1">*</span>
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
                className={`w-full h-11 px-3.5 py-2.5 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              />
              {errors.title && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  Title is required
                </div>
              )}
            </div>

            {/* Credentials Section */}
            <div className="space-y-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                Login Credentials
              </div>

              {/* Email/Username */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4 text-gray-500" />
                  Email or Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Lock className="h-4 w-4 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-11 px-3.5 py-2.5 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-11 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* TOTP */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Shield className="h-4 w-4 text-gray-500" />
                  2FA Secret Key (TOTP)
                </label>
                <input
                  type="text"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                  placeholder="ABC123..."
                  className="w-full h-11 px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Websites */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <LinkIcon className="h-4 w-4 text-gray-500" />
                  Associated Websites
                </label>
                <button
                  type="button"
                  onClick={addWebsite}
                  className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm flex items-center gap-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Plus className="h-3.5 w-3.5" />
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
                    className="flex-1 h-10 px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {websites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWebsite(index)}
                      className="h-10 w-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 text-gray-500" />
                Notes
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes..."
                rows={4}
                className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Attachments */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Paperclip className="h-4 w-4 text-gray-500" />
                Attachments
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload files from your device.
              </p>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 cursor-pointer"
              >
                <Upload className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  Choose a file or drag it here
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supports all file types
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => dispatch(closeModal())}
                className="h-11 px-6 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : isEdit ? "Update Credential" : "Add Credential"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModalUIOnly;