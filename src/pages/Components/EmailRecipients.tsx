"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

interface Recipient {
  email: string
  name?: string
  valid: boolean
}

interface EmailRecipientsProps {
  value: string
  onChange: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  placeholder?: string
  suggestions?: { email: string; name?: string }[]
  label?: string
}

const EmailRecipients: React.FC<EmailRecipientsProps> = ({
  value,
  onChange,
  onValidationChange,
  placeholder = "Add recipients...",
  suggestions = [],
  label,
}) => {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Parse initial value into recipients
  useEffect(() => {
    if (value && recipients.length === 0) {
      const emails = value
        .split(",")
        .map((email) => {
          const trimmed = email.trim()
          return {
            email: trimmed,
            valid: emailRegex.test(trimmed),
          }
        })
        .filter((r) => r.email)

      setRecipients(emails)
    }
  }, [value])

  // Update parent when recipients change
  useEffect(() => {
    const emailString = recipients.map((r) => r.email).join(", ")
    onChange(emailString)

    // Validate all recipients
    const allValid = recipients.every((r) => r.valid)
    onValidationChange?.(allValid)
  }, [recipients])

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue) {
      const filtered = suggestions.filter(
        (s) =>
          (s.email.toLowerCase().includes(inputValue.toLowerCase()) ||
            (s.name && s.name.toLowerCase().includes(inputValue.toLowerCase()))) &&
          !recipients.some((r) => r.email === s.email),
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions([])
    }
  }, [inputValue, suggestions, recipients])

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add recipient on Enter, Tab, or comma
    if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
      e.preventDefault()
      addRecipient()
    }

    // Remove last recipient on Backspace if input is empty
    if (e.key === "Backspace" && !inputValue && recipients.length > 0) {
      setRecipients((prev) => prev.slice(0, -1))
    }
  }

  const addRecipient = (email?: string, name?: string) => {
    const newEmail = email || inputValue.replace(",", "").trim()

    if (!newEmail) return

    // Check if email already exists
    if (recipients.some((r) => r.email === newEmail)) {
      setInputValue("")
      return
    }

    const isValid = emailRegex.test(newEmail)

    setRecipients((prev) => [...prev, { email: newEmail, name, valid: isValid }])

    setInputValue("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeRecipient = (index: number) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b dark:border-gray-700 focus-within:border-blue-500">
        {recipients.map((recipient, index) => (
          <div
            key={index}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-sm
              ${recipient.valid ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}
            `}
          >
            <span className="truncate max-w-[150px]">{recipient.email}</span>
            <button type="button" onClick={() => removeRecipient(index)} className="text-gray-500 hover:text-gray-700">
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          placeholder={recipients.length === 0 ? placeholder : ""}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => addRecipient(suggestion.email, suggestion.name)}
            >
              {suggestion.name ? (
                <div>
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500">{suggestion.email}</div>
                </div>
              ) : (
                <div>{suggestion.email}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {recipients.some((r) => !r.valid) && (
        <div className="text-xs text-red-500 mt-1">Some email addresses are invalid</div>
      )}
    </div>
  )
}

export default EmailRecipients
