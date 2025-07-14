"use client"

import type React from "react"
import { FaDownload, FaEye, FaTrash } from "react-icons/fa"

interface AttachmentFile {
  name: string
  type: string
  size: number
  encryptedData?: string
  url?: string
}

interface EmailAttachmentsProps {
  attachments: AttachmentFile[]
  onRemove: (index: number) => void
  onPreview?: (file: AttachmentFile) => void
  onDownload?: (file: AttachmentFile) => void
  isReadOnly?: boolean
}

const EmailAttachments: React.FC<EmailAttachmentsProps> = ({
  attachments,
  onRemove,
  onPreview,
  onDownload,
  isReadOnly = false,
}) => {
  if (!attachments || attachments.length === 0) return null

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image/")) return "🖼️"
    if (fileType.includes("application/pdf")) return "📄"
    if (fileType.includes("application/zip")) return "🗜️"
    if (fileType.includes("text/")) return "📝"
    if (fileType.includes("video/")) return "🎬"
    if (fileType.includes("audio/")) return "🎵"
    return "📎"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-2 w-full max-w-full">
      <div className="text-sm font-medium text-gray-700 mb-1">Attachments ({attachments.length})</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {attachments.map((file, index) => (
          <div
            key={index}
            className="relative bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate" title={file.name}>
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
              </div>
              <div className="flex space-x-1">
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                    title="Remove attachment"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
                {isReadOnly && onDownload && (
                  <button
                    type="button"
                    onClick={() => onDownload(file)}
                    className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
                    title="Download attachment"
                  >
                    <FaDownload size={14} />
                  </button>
                )}
                {file.type.includes("image/") && onPreview && (
                  <button
                    type="button"
                    onClick={() => onPreview(file)}
                    className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
                    title="Preview image"
                  >
                    <FaEye size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmailAttachments
