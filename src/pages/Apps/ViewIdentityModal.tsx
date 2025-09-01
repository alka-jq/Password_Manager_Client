import { useEffect, useRef, useState } from "react"
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
  Phone,
  Eye,
  EyeOff,
  MapPin,
  Mail
} from 'lucide-react';
import { useVaults } from "@/useContext/VaultContext";
import React from "react";

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
  const { vaults } = useVaults();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    address: true,
    contact: true,
    work: true,
    additional: true,
    attachments: true
  });
  
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen || !identity) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1e1f24] shadow-xl border border-gray-300 dark:border-gray-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-[#f9fafb] to-[#f0f4ff] dark:from-[#2a2b30] dark:to-[#24252a] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{identity.title || "Untitled Identity"}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                  {iconComponents[vaults.find((v) => v.key === identity.vaultKey)?.icon || "Folder"]}
                  {identity.vaultName || "Uncategorized"}
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
          {/* Personal Details */}
          <Section 
            title="Personal Details" 
            icon={<User className="w-4 h-4" />}
            isExpanded={expandedSections.personal}
            onToggle={() => toggleSection('personal')}
          >
            {renderFields(identity.personalDetails)}
          </Section>

          {/* Address Details */}
          <Section 
            title="Address Details" 
            icon={<MapPin className="w-4 h-4" />}
            isExpanded={expandedSections.address}
            onToggle={() => toggleSection('address')}
          >
            {renderFields(identity.addressDetails)}
          </Section>

          {/* Contact Details */}
          <Section 
            title="Contact Details" 
            icon={<Phone className="w-4 h-4" />}
            isExpanded={expandedSections.contact}
            onToggle={() => toggleSection('contact')}
          >
            {renderFields(identity.contactDetails)}
          </Section>

          {/* Work Details */}
          <Section 
            title="Work Details" 
            icon={<Briefcase className="w-4 h-4" />}
            isExpanded={expandedSections.work}
            onToggle={() => toggleSection('work')}
          >
            {renderFields(identity.workDetails)}
          </Section>

          {/* Additional Fields */}
          {identity.dynamicFields && identity.dynamicFields.length > 0 && (
            <Section 
              title="Additional Fields" 
              icon={<Info className="w-4 h-4" />}
              isExpanded={expandedSections.additional}
              onToggle={() => toggleSection('additional')}
            >
              <div className="grid grid-cols-1 gap-2">
                {identity.dynamicFields.map((field, index) => (
                  <Field key={index} label={field.id} value={field.value} />
                ))}
              </div>
            </Section>
          )}

          {/* Attachments */}
          {identity.attachments && identity.attachments.length > 0 && (
            <Section 
              title={`Attachments (${identity.attachments.length})`} 
              icon={<Paperclip className="w-4 h-4" />}
              isExpanded={expandedSections.attachments}
              onToggle={() => toggleSection('attachments')}
            >
              <div className="space-y-1">
                {identity.attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-xs break-all">{att}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
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

// Section component with toggle functionality
function Section({ 
  title, 
  children, 
  icon, 
  isExpanded, 
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode; 
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const hasContent = React.Children.count(children) > 0;
  
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        disabled={!hasContent}
      >
        <div className="flex items-center gap-2">
          <div className="text-blue-600 dark:text-blue-400">
            {icon}
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''} ${!hasContent ? 'invisible' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isExpanded && hasContent && (
        <div className="p-3 space-y-2 bg-white dark:bg-[#1e1f24]">
          {children}
        </div>
      )}
      
      {!hasContent && (
        <div className="p-3 bg-white dark:bg-[#1e1f24] text-gray-400 dark:text-gray-600 text-sm">
          No {title.toLowerCase()} provided
        </div>
      )}
    </div>
  )
}

// Field component
function Field({ label, value }: { label: string; value?: string }) {
  const displayValue = value?.trim() || "Not provided";
  const isEmpty = !value?.trim();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-start">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:w-1/3 sm:pt-1">
        {formatLabel(label)}
      </span>
      <span className={`sm:w-2/3 break-words ${isEmpty ? 'text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-200'}`}>
        {displayValue}
      </span>
    </div>
  )
}

// Render fields from an object
function renderFields(obj: Record<string, any>) {
  const fields = Object.entries(obj || {}).map(([key, value], index) => (
    <Field key={index} label={key} value={value} />
  ));

  return fields.length > 0 ? <>{fields}</> : null;
}

// Format keys into readable labels
function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
