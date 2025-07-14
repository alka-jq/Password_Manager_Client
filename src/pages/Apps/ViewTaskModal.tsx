import { useEffect, useRef } from "react"
// import { X, User, CalendarDays, Info, Heart } from "lucide-react"
import type { Task } from "@/store/Slices/taskSlice"
// import { X, User, Lock, Shield, LinkIcon, FileText, Heart } from "lucide-react"
import {
    Home, Briefcase, Gift, Store, Heart, AlarmClock, AppWindow, Settings, Users, Ghost,
    ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
    Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText,
    User,
    X,
    LinkIcon
} from 'lucide-react';
import { useVaults } from "@/useContext/VaultContext";


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

export default function ViewTaskModal({selectedTab, setSelectedTab, isOpen, onClose, task }: ViewTaskModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { vaults } = useVaults(); // ✅ get vaults from context
  const selectedVault = vaults.find((v) => v.key === selectedTab);
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

  if (!isOpen || !task) return null

  const priorityStyles = {
    low: "bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/50 dark:text-yellow-300",
    high: "bg-red-100 text-red-700 dark:bg-red-800/50 dark:text-red-300",
    default: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  }

  const tagStyles = {
    team: "bg-indigo-100 text-indigo-700 dark:bg-indigo-800/50 dark:text-indigo-300",
    update: "bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-300",
    default: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  }
console.log(task,"task")
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all">
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1e1f24] shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-[#f9fafb] dark:bg-[#2a2b30] rounded-t-2xl">
          <div className="flex flex-wrap items-center gap-2">
  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</h2>
<span
  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-sm font-medium bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
>
  {iconComponents[vaults.find((v) => v.key === task.vaultKey)?.icon || "Folder"]}
  {task.vaultName}
</span>


</div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
 <div className="px-6 py-6 space-y-6 text-sm overflow-y-auto flex-1">
  {/* Email */}

    <div className="space-y-1">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
        <User className="w-4 h-4" />
        Email / Username
      </div>
      <span className="ml-6 text-gray-600 dark:text-gray-400">{task.email}</span>
    </div>


  {/* Password */}

    <div className="space-y-1">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
        <Lock className="w-4 h-4" />
        Password
      </div>
      <span className="ml-6 text-gray-600 dark:text-gray-400">{task.password}</span>
    </div>


  {/* 2FA Secret (TOTP) */}
  
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
        <Shield className="w-4 h-4" />
        2FA Secret Key (TOTP)
      </div>
      <span className="ml-6 text-gray-600 dark:text-gray-400">{task.totp}</span>
    </div>


  {/* Websites */}
 
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
        <LinkIcon className="w-4 h-4" />
        Websites
      </div>
      <ul className="ml-6 space-y-1 text-gray-600 dark:text-gray-400 list-disc list-inside">
        {task.websites.map((url, idx) => (
          <li key={idx}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {url}
            </a>
          </li>
        ))}
      </ul>
    </div>
 

  {/* Note */}
 
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
        <FileText className="w-4 h-4" />
        Note
      </div>
      <p className="ml-6 text-gray-600 dark:text-gray-400 whitespace-pre-line break-words break-all">
        {task.note}
      </p>
    </div>

</div>



        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-[#f9fafb] dark:bg-[#2a2b30] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
