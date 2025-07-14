import { useEffect, useRef } from "react"
// import { X, User, Home, Phone, Briefcase, Info, FileText } from "lucide-react"
import type { Identity } from "@/store/Slices/identitySlice"
import {
  Home, Briefcase, Gift, Store, Heart, AlarmClock, AppWindow, Settings, Users, Ghost,
  ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
  Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText,
  User,
  X,
  LinkIcon,
  Info,
  Paperclip,
  CalendarDays,
  Phone
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




interface ViewIdentityModalProps {
  isOpen: boolean
  onClose: () => void
  identity: Identity | null
    selectedTab: string;
  setSelectedTab: (key: string) => void;
}

export default function ViewIdentityModal({ selectedTab, setSelectedTab, isOpen, onClose, identity }: ViewIdentityModalProps) {
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

  if (!isOpen || !identity) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all">
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1e1f24] shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-[#f9fafb] dark:bg-[#2a2b30] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-700 dark:text-white" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{identity.title}</h2>
              <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-sm font-medium bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
            >
              {iconComponents[vaults.find((v) => v.key === identity.vaultKey)?.icon || "Folder"]}
              {identity.vaultName}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6 text-sm overflow-y-auto flex-1">
          <Section title="Personal Details" icon={<User className="w-4 h-4" />}>
            {renderFields(identity.personalDetails)}
          </Section>

          <Section title="Address Details" icon={<Home className="w-4 h-4" />}>
            {renderFields(identity.addressDetails)}
          </Section>

          <Section title="Contact Details" icon={<Phone className="w-4 h-4" />}>
            {renderFields(identity.contactDetails)}
          </Section>

          <Section title="Work Details" icon={<Briefcase className="w-4 h-4" />}>
            {renderFields(identity.workDetails)}
          </Section>

          {identity.dynamicFields?.length > 0 && (
            <Section title="Additional Fields" icon={<Info className="w-4 h-4" />}>
              {identity.dynamicFields.map((field, index) => (
                <Field key={index} label={field.id} value={field.value} />
              ))}
            </Section>
          )}

          {identity.attachments?.length > 0 && (
            <Section title="Attachments" icon={<FileText className="w-4 h-4" />}>
              <ul className="list-disc ml-6 text-gray-600 dark:text-gray-400 space-y-1">
                {identity.attachments.map((att, i) => <li key={i}>{att}</li>)}
              </ul>
            </Section>
          )}
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

// Section component
function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md">
        {icon}
        {title}
      </div>
      <div className="ml-6 space-y-2">{children}</div>
    </div>
  )
}

// Field component
function Field({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null
  return (
    <div className="text-sm">
      <span className="block font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <span className="ml-1 text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  )
}

// Render fields from an object
function renderFields(obj: Record<string, string>) {
  return Object.entries(obj).map(([key, value], index) => (
    <Field key={index} label={formatLabel(key)} value={value} />
  ))
}

// Format keys into readable labels
function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase())
    .trim()
}
