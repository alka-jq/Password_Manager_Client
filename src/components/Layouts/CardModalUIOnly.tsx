"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { addCard, editCard, closeCardModal } from "@/store/Slices/cardSlice"
import {
  X,
  Plus,
  CreditCard,
  User,
  Calendar,
  Shield,
  Hash,
  FileText,
  Paperclip,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  Trash2,
} from "lucide-react"
import VaultDropdown from "./VaultDropdown"
import { useVaults } from "@/useContext/VaultContext"

interface DynamicField {
  id: string
  type: "text" | "note" | "2fa" | "hidden" | "date"
  label: string
  value: string
}

const CardModalUIOnly = () => {
  const dispatch = useDispatch()
  const { vaults: rawVaults } = useVaults()
  const vaults = rawVaults ?? []
  const { isModalOpen, modalMode, editCard: card } = useSelector(
    (state: RootState) => state.card
  )
  const isEdit = modalMode === "edit"
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [nameOnCard, setNameOnCard] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [securityCode, setSecurityCode] = useState("")
  const [pin, setPin] = useState("")
  const [note, setNote] = useState("")
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([])
  const [attachments, setAttachments] = useState<File[]>([])
  const [errors, setErrors] = useState({ title: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showSecurityCode, setShowSecurityCode] = useState(false)

  // Initialize selectedTab with first vault's key or card's vaultKey
  const [selectedTab, setSelectedTab] = useState<string>("")

const getInitialTab = useCallback(() => {
  if (isEdit && card?.vaultKey) return card.vaultKey;
  return ""; 
}, [isEdit, card]);

  // Reset form completely
  const resetForm = useCallback(() => {
    setTitle("")
    setNameOnCard("")
    setCardNumber("")
    setExpirationDate("")
    setSecurityCode("")
    setPin("")
    setNote("")
    setDynamicFields([])
    setAttachments([])
    setErrors({ title: false })
    setIsSubmitting(false)
    setSelectedTab(getInitialTab())
  }, [getInitialTab])

  // Initialize form when modal opens or edit mode changes
  useEffect(() => {
    if (!isModalOpen) return

    if (isEdit && card) {
      setTitle(card.title || "")
      setNameOnCard(card.nameOnCard || "")
      setCardNumber(card.cardNumber || "")
      setExpirationDate(card.expirationDate || "")
      setSecurityCode(card.securityCode || "")
      setPin(card.pin || "")
      setNote(card.note || "")
      setDynamicFields(card.dynamicFields || [])
      setSelectedTab(card.vaultKey || "")
    } else {
      resetForm()
    }
  }, [isModalOpen, isEdit, card, getInitialTab, resetForm])

  

  const selectedVault = vaults.find((v) => v.key === selectedTab)

  const fieldTypes = [
    { type: "text" as const, label: "Text", icon: FileText },
    { type: "2fa" as const, label: "2FA secret key (TOTP)", icon: Shield },
    { type: "hidden" as const, label: "Hidden", icon: Eye },
    { type: "date" as const, label: "Date", icon: Calendar },
    { type: "note" as const, label: "Note", icon: FileText },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setErrors({ ...errors, title: true })
      return
    }
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const payload = {
      title: title.trim(),
      nameOnCard,
      cardNumber,
      expirationDate,
      securityCode,
      pin,
      note,
      dynamicFields,
      attachments: attachments.map((file) => file.name),
      vaultKey: selectedTab,
      vaultName: selectedVault?.name || "",
      vaultIcon: selectedVault?.icon || "",
      vaultColor: selectedVault?.color || "",
    }

    if (isEdit && card) {
      dispatch(editCard({ id: card.id, updates: payload }))
    } else {
      dispatch(addCard(payload))
    }

    dispatch(closeCardModal())
    resetForm()
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
  }

  const addDynamicField = (type: DynamicField["type"]) => {
    const newField: DynamicField = {
      id: Date.now().toString(),
      type,
      label: fieldTypes.find((ft) => ft.type === type)?.label || "Text",
      value: "",
    }
    setDynamicFields([...dynamicFields, newField])
    setShowDropdown(false)
  }

  const updateDynamicField = (id: string, value: string) => {
    setDynamicFields((fields) =>
      fields.map((field) => (field.id === id ? { ...field, value } : field))
    )
  }

  const removeDynamicField = (id: string) => {
    setDynamicFields((fields) => fields.filter((field) => field.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setAttachments((prev) => [...prev, ...files])
  }

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="fixed inset-0"
        onClick={() => dispatch(closeCardModal())}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEdit ? "Edit Card" : "Add New Card"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isEdit
                  ? "Update your saved card"
                  : "Securely store your card information"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <VaultDropdown
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              vaults={vaults}
            />
            
            <button
              onClick={() => dispatch(closeCardModal())}
              className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] thin-scrollbar">
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Title Section */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setErrors({ ...errors, title: false })
                }}
                placeholder="Card Title"
                className={`w-full h-11 px-4 py-2 border rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              />
              {errors.title && (
                <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  Title is required
                </div>
              )}
            </div>

            {/* Card Details */}
            <div className="space-y-5">
              {/* Name on Card */}
              <div className="space-y-2">
                <label
                  htmlFor="nameOnCard"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  Name on card
                </label>
                <input
                  id="nameOnCard"
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  placeholder="Full Name"
                  className="w-full h-11 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                />
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <label
                  htmlFor="cardNumber"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  Card number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 1234 1234 1234"
                  maxLength={19}
                  className="w-full h-11 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 dark:text-white font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Expiration Date */}
                <div className="space-y-2">
                  <label
                    htmlFor="expirationDate"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Expiration date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="expirationDate"
                      type="text"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full h-11 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 dark:text-white font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                    />
                  </div>
                </div>

                {/* Security Code */}
                <div className="space-y-2">
                  <label
                    htmlFor="securityCode"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <Shield className="h-4 w-4 text-gray-500" />
                    Security code
                  </label>
                  <div className="relative">
                    <input
                      id="securityCode"
                      type={showSecurityCode ? "text" : "password"}
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="w-full h-11 px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 dark:text-white font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecurityCode(!showSecurityCode)}
                      className="absolute right-0 top-0 h-11 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      {showSecurityCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* PIN */}
              <div className="space-y-2">
                <label
                  htmlFor="pin"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Hash className="h-4 w-4 text-gray-500" />
                  PIN
                </label>
                <div className="relative">
                  <input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="1234"
                    maxLength={6}
                    className="w-full h-11 px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 dark:text-white font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-0 top-0 h-11 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div className="space-y-2">
              <label
                htmlFor="note"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <FileText className="h-4 w-4 text-gray-500" />
                Note
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add note"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 dark:text-white resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
              />
            </div>

            {/* Dynamic Fields */}
            {dynamicFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.type === "text" && <FileText className="h-4 w-4 text-gray-500" />}
                    {field.type === "2fa" && <Shield className="h-4 w-4 text-gray-500" />}
                    {field.type === "hidden" && <Eye className="h-4 w-4 text-gray-500" />}
                    {field.type === "date" && <Calendar className="h-4 w-4 text-gray-500" />}
                    {field.type === "note" && <FileText className="h-4 w-4 text-gray-500" />}
                    {field.label}
                  </label>
                  <button
                    type="button"
                    onClick={() => removeDynamicField(field.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {field.type === "note" ? (
                  <textarea
                    value={field.value}
                    onChange={(e) => updateDynamicField(field.id, e.target.value)}
                    placeholder={`Add ${field.label.toLowerCase()}`}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 dark:text-white resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                  />
                ) : (
                  <input
                    type={field.type === "hidden" ? "password" : field.type === "date" ? "date" : "text"}
                    value={field.value}
                    onChange={(e) => updateDynamicField(field.id, e.target.value)}
                    placeholder={`Add ${field.label.toLowerCase()}`}
                    className="w-full h-11 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                  />
                )}
              </div>
            ))}

            {/* Add More Section */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 font-medium border border-dashed border-blue-200 dark:border-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add custom field
              </button>

              {showDropdown && (
                <div className="absolute bottom-12 left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
                  {fieldTypes.map((fieldType) => (
                    <button
                      key={fieldType.type}
                      type="button"
                      onClick={() => addDynamicField(fieldType.type)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <fieldType.icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{fieldType.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attachments Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Paperclip className="h-4 w-4 text-gray-500" />
                Attachments
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload files from your device.</p>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 text-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 cursor-pointer"
              >
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-blue-700 dark:text-blue-300 font-medium">Choose a file or drag it here</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max file size: 10MB</p>
              </div>

              <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end flex-col-reverse sm:flex-row gap-3 pt-6 pb-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => dispatch(closeCardModal())}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none h-11 px-6 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {isEdit ? "Updating..." : "Adding..."}
                  </div>
                ) : isEdit ? (
                  "Update Card"
                ) : (
                  "Add Card"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CardModalUIOnly
