import { useEffect, useRef } from "react"

import type { Card } from "@/store/Slices/cardSlice"
import {
  Home, Briefcase, Gift, Store, Heart, AlarmClock, AppWindow, Settings, Users, Ghost,
  ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
  Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText,
  User,
  X,
  LinkIcon,
  Info,
  Paperclip,
  CalendarDays
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



interface ViewCardModalProps {
  isOpen: boolean
  onClose: () => void
  card: Card | null
  selectedTab: string;
  setSelectedTab: (key: string) => void;
}

export default function ViewCardModal({ selectedTab, setSelectedTab, isOpen, onClose, card }: ViewCardModalProps) {
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

  if (!isOpen || !card) return null
console.log(card,"task")
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all">
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1e1f24] shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-[#f9fafb] dark:bg-[#2a2b30] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-700 dark:text-white" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{card.title}</h2>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-sm font-medium bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
            >
              {iconComponents[vaults.find((v) => v.key === card.vaultKey)?.icon || "Folder"]}
              {card.vaultName}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6 text-sm overflow-y-auto flex-1">
          <Field label="Name on Card" value={card.nameOnCard} icon={<User className="w-4 h-4" />} />
          <Field label="Card Number" value={card.cardNumber} icon={<CreditCard className="w-4 h-4" />} />
          <Field label="Expiration Date" value={card.expirationDate} icon={<CalendarDays className="w-4 h-4" />} />
          <Field label="Security Code" value={card.securityCode} icon={<Lock className="w-4 h-4" />} />
          <Field label="PIN" value={card.pin} icon={<Lock className="w-4 h-4" />} />
          <Field label="Note" value={card.note} icon={<FileText className="w-4 h-4" />} />

          {/* {card.dynamicFields?.length > 0 && ( */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Additional Fields
              </div>
              {card.dynamicFields.map((field, i) => (
                <div key={i} className="ml-6 text-gray-600 dark:text-gray-400">
                  <strong>{field.id}:</strong> {field.value}
                </div>
              ))}
            </div>
          {/* )} */}

          {/* {card.attachments?.length > 0 && ( */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
              </div>
              <ul className="ml-6 list-disc text-gray-600 dark:text-gray-400">
                {card.attachments.map((attachment, i) => (
                  <li key={i}>{attachment}</li>
                ))}
              </ul>
            </div>
          {/* )} */}
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

function Field({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  // if (!value?.trim()) return null
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
        {icon}
        {label}
      </div>
      <span className="ml-6 text-gray-600 dark:text-gray-400 break-all">{value}</span>
    </div>
  )
}
