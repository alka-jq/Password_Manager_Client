"use client"
import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface CompleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: "complete" | "uncomplete"
  title?: string
}

const CompleteConfirmModal = ({ isOpen, onClose, onConfirm, type, title }: CompleteConfirmModalProps) => {
  const [animate, setAnimate] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      // Trigger animation when modal opens
      setAnimate(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setAnimate(false)
    setTimeout(() => onClose(), 300) // Wait for animation to complete
  }

  const handleConfirm = () => {
    setAnimate(false)
    setTimeout(() => {
      onConfirm()
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  const message = type === "complete" 
    ? "Are you sure this data is completed?" 
    : "Are you sure this data is uncompleted?"

  const buttonText = type === "complete" ? "Complete" : "Uncomplete"
  const icon = type === "complete" ? 
    <CheckCircle className="w-8 h-8 text-green-500" /> : 
    <XCircle className="w-8 h-8 text-amber-500" />

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-inner mb-4">
            {icon}
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            {buttonText} Confirmation
          </h3>

          {title && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-2">
              "{title}"
            </p>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            {message}
          </p>

          <div className="flex justify-center gap-3 w-full">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === "complete" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500 shadow-lg shadow-green-500/30" 
                  : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:ring-amber-500 shadow-lg shadow-amber-500/30"
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompleteConfirmModal