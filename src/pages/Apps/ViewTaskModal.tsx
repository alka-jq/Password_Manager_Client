import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from "react"
import {
    Home, Briefcase, Gift, Store, Heart, AlarmClock, AppWindow, Settings, Users, Ghost,
    ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
    Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText,
    User,
    X,
    LinkIcon,
    Eye,
    EyeOff,
    Copy,
    CheckCircle
} from 'lucide-react';
import { useVaults } from "@/useContext/VaultContext";
import { Task } from '@/store/Slices/taskSlice';

const iconComponents: Record<string, JSX.Element> = {
    Home: <Home size={16} />,
    Briefcase: <Briefcase size={16} />,
    Gift: <Gift size={16} />,
    Store: <Store size={16} />,
    Heart: <Heart size={16} />,
    AlarmClock: <AlarmClock size={16} />,
    AppWindow: <AppWindow size={16} />,
    Settings: <Settings size={16} />,
    Users: <Users size={16} />,
    Ghost: <Ghost size={16} />,
    ShoppingCart: <ShoppingCart size={16} />,
    Leaf: <Leaf size={16} />,
    Shield: <Shield size={16} />,
    Circle: <Circle size={16} />,
    CreditCard: <CreditCard size={16} />,
    Fish: <Fish size={16} />,
    Smile: <Smile size={16} />,
    Lock: <Lock size={16} />,
    UserCheck: <UserCheck size={16} />,
    Star: <Star size={16} />,
    Flame: <Flame size={16} />,
    Wallet: <Wallet size={16} />,
    Bookmark: <Bookmark size={16} />,
    IceCream: <IceCream size={16} />,
    Laptop: <Laptop size={16} />,
    BookOpen: <BookOpen size={16} />,
    Infinity: <Infinity size={16} />,
    FileText: <FileText size={16} />,
};

interface ViewTaskModalProps {
    isOpen: boolean
    onClose: () => void
    task: Task | null
    selectedTab: string;
    setSelectedTab: (key: string) => void;
}

export default function ViewTaskModal({ selectedTab, setSelectedTab, isOpen, onClose, task }: ViewTaskModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const { vaults } = useVaults();
    const selectedVault = vaults.find((v) => v.key === selectedTab);
    
    // State for password visibility and copy feedback
    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto"
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    // Handle copy to clipboard
    const handleCopy = (text: string, field: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
            <div
                ref={modalRef}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-xl bg-white dark:bg-[#1e1f24] shadow-xl border border-gray-300 dark:border-gray-800"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#2a2b30] dark:to-[#23242a] rounded-t-xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h2>
                        <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                        >
                            {iconComponents[vaults.find((v) => v.key === task.vaultKey)?.icon || "Folder"]}
                            {task.vaultName}
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
                            Email / Username
                        </div>
                        <div className={`flex items-center justify-between p-3 rounded-lg ${task.email ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                            <span className={`${task.email ? 'text-gray-800 dark:text-gray-200 font-mono' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                                {task.email || 'Not provided'}
                            </span>
                            {task.email && (
                                <button 
                                    onClick={() => handleCopy(task.email, 'email')}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                    title="Copy to clipboard"
                                >
                                    {copiedField === 'email' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
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
                        <div className={`flex items-center justify-between p-3 rounded-lg ${task.password ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                            <span className={`${task.password ? 'text-gray-800 dark:text-gray-200 font-mono' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                                {task.password ? (showPassword ? task.password : '•'.repeat(12)) : 'Not provided'}
                            </span>
                            {task.password ? (
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button 
                                        onClick={() => handleCopy(task.password, 'password')}
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
                        <div className={`flex items-center justify-between p-3 rounded-lg ${task.totp ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                            <span className={`${task.totp ? 'text-gray-800 dark:text-gray-200 font-mono' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                                {task.totp || 'Not provided'}
                            </span>
                            {task.totp && (
                                <button 
                                    onClick={() => handleCopy(task.totp, 'totp')}
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
                            Websites ({task.websites ? task.websites.length : 0})
                        </div>
                        <div className={`p-3 rounded-lg ${task.websites && task.websites.length > 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                            {task.websites && task.websites.length > 0 ? (
                                <div className="space-y-2">
                                    {task.websites.map((url, idx) => (
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

                    {/* Files - Added section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
                            <FileText className="w-4 h-4" />
                            Uploaded Files ({task.files ? task.files.length : 0})
                        </div>
                        <div className={`p-3 rounded-lg ${task.files && task.files.length > 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                            {task.files && task.files.length > 0 ? (
                                <div className="space-y-2">
                                    {task.files.map((file: { url: string | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Iterable<ReactNode> | null | undefined; }, idx: Key | null | undefined) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[70%]"
                                            >
                                                {file.name}
                                            </a>
                                            <button
                                                onClick={() => handleCopy(file.url ?? "", `file-${idx}`)}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                                title="Copy URL"
                                            >
                                                {copiedField === `file-${idx}` ? (
                                                    <CheckCircle size={16} className="text-green-500" />
                                                ) : (
                                                    <Copy size={16} />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-400 dark:text-gray-500 italic">No files uploaded</span>
                            )}
                        </div>
                    </div>


                    {/* Note - Always visible */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
                            <FileText className="w-4 h-4" />
                            Note
                        </div>
                        <div className={`p-3 rounded-lg ${task.note ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                            <p className={`${task.note ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 italic'} whitespace-pre-line break-words`}>
                                {task.note || 'No notes provided'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#2a2b30] rounded-b-xl">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last updated: {new Date().toLocaleDateString()}
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
    )
}