import React, { useEffect, useRef } from "react"
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
  CalendarDays,
  Eye,
  EyeOff
} from 'lucide-react';
import { useVaults } from "@/useContext/VaultContext";
import { useState } from "react";

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
  const { vaults } = useVaults();
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [showPin, setShowPin] = useState(false);
  
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

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all backdrop-blur-sm">
  <div
    ref={modalRef}
    className="w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1e1f24] shadow-xl border border-gray-300 dark:border-gray-800"
  >
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-[#f9fafb] to-[#f0f4ff] dark:from-[#2a2b30] dark:to-[#24252a] rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{card.title || "Untitled Card"}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
              {iconComponents[vaults.find((v) => v.key === card.vaultKey)?.icon || "Home"]}
              {vaults.find((v) => v.key === card.vaultKey)?.name || "Uncategorized"}
            </span>
          </div>
        </div>
      </div>
      <button 
        onClick={onClose} 
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    {/* Body */}
    <div className="px-5 py-4 space-y-4 text-sm overflow-y-auto flex-1">
      <div className="grid grid-cols-1 gap-4">
        <Field 
          label="Name on Card" 
          value={card.nameOnCard} 
          icon={<User className="w-4 h-4" />} 
          placeholder="Not provided" 
        />
        
        <Field 
          label="Card Number" 
          value={card.cardNumber} 
          icon={<CreditCard className="w-4 h-4" />} 
          placeholder="Not provided"
          isSensitive={true}
        />
        
        <Field 
          label="Expiration Date" 
          value={card.expirationDate} 
          icon={<CalendarDays className="w-4 h-4" />} 
          placeholder="MM/YY"
        />
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
            <Lock className="w-4 h-4" />
            Security Code
          </div>
          <div className="ml-6 flex items-center gap-2">
            {showSecurityCode ? (
              <span className="text-gray-600 dark:text-gray-400 font-mono">
                {card.securityCode || "Not provided"}
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-600 tracking-widest">••••</span>
            )}
            {card.securityCode && (
              <button 
                onClick={() => setShowSecurityCode(!showSecurityCode)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showSecurityCode ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
            <Lock className="w-4 h-4" />
            PIN
          </div>
          <div className="ml-6 flex items-center gap-2">
            {showPin ? (
              <span className="text-gray-600 dark:text-gray-400 font-mono">
                {card.pin || "Not provided"}
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-600 tracking-widest">••••</span>
            )}
            {card.pin && (
              <button 
                onClick={() => setShowPin(!showPin)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <Field 
        label="Note" 
        value={card.note} 
        icon={<FileText className="w-4 h-4" />} 
        placeholder="No notes added"
        fullWidth={true}
      />

      {card.dynamicFields && card.dynamicFields.length > 0 ? (
        <div className="space-y-2 pt-1">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Additional Fields
          </div>
          <div className="grid grid-cols-1 gap-2 ml-1">
            {card.dynamicFields.map((field, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{field.id}</div>
                <div className="text-gray-800 dark:text-gray-200 mt-0.5 break-words">{field.value}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {card.attachments && card.attachments.length > 0 ? (
        <div className="space-y-2 pt-1">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            Attachments ({card.attachments.length})
          </div>
          <div className="ml-1 space-y-1">
            {card.attachments.map((attachment, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-xs break-all">{attachment}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-[#f9fafb] dark:bg-[#2a2b30] rounded-b-2xl">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Last updated: {new Date().toLocaleDateString()}
      </div>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
      >
        Close
      </button>
    </div>
  </div>
</div>
  )
}

function Field({ 
  label, 
  value, 
  icon, 
  placeholder = "Not provided",
  isSensitive = false,
  fullWidth = false
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
  placeholder?: string;
  isSensitive?: boolean;
  fullWidth?: boolean;
}) {
  const displayValue = value?.trim() || placeholder;
  const isEmpty = !value?.trim();
  
  return (
    <div className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
        {icon}
        {label}
      </div>
      <span className={`ml-6 break-all ${isEmpty ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'} ${isSensitive && !isEmpty ? 'font-mono tracking-wide' : ''}`}>
        {isSensitive && !isEmpty ? '•••• •••• •••• ••••' : displayValue}
      </span>
    </div>
  )
}