"use client"

import { useState } from "react"
import { CiShare1 } from "react-icons/ci"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: (email: string) => void
}

const ShareModal = ({ isOpen, onClose, onShare }: ShareModalProps) => {
  const [email, setEmail] = useState("")

  if (!isOpen) return null

  const handleShare = () => {
    if (!email.trim()) return
    onShare(email.trim())
    setEmail("")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 max-w-md">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <CiShare1 className="w-6 h-6 text-blue-600 dark:text-blue-200" />
        </div>

        {/* Message */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          Share Item
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
          You'll send an email with the link from below
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 text-gray-900 dark:text-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleShare()
              onClose()
            }}
            className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareModal
