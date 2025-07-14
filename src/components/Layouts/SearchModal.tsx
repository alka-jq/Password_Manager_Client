"use client"

import { useState, useEffect, useRef } from "react"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

interface SearchInOption {
  label: string
  value: string
  hasDropdown?: boolean
}

const SearchModal = ({ isOpen, onClose, className = "" }: SearchModalProps) => {
  const [selectedSearchIn, setSelectedSearchIn] = useState<string>("All mail")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false)
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [sender, setSender] = useState<string>("")
  const [recipient, setRecipient] = useState<string>("")
  const [address, setAddress] = useState<string>("All")
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  if (!isOpen) return null

  const searchInOptions: SearchInOption[] = [
    { label: "All mail", value: "All mail" },
    { label: "Inbox", value: "Inbox" },
    { label: "Drafts", value: "Drafts" },
    { label: "Sent", value: "Sent" },
    { label: "Other", value: "Other", hasDropdown: true },
  ]

  const addressOptions: string[] = ["All", "To", "From", "Cc", "Bcc"]

  const handleReset = () => {
    setSearchQuery("")
    setSelectedSearchIn("All mail")
    setFromDate("")
    setToDate("")
    setSender("")
    setRecipient("")
    setAddress("All")
  }

  const handleSearch = () => {
    console.log("Search:", {
      query: searchQuery,
      searchIn: selectedSearchIn,
      fromDate,
      toDate,
      sender,
      recipient,
      address,
    })
    // Add your search logic here
  }

  return (
    <div className={`font_lato_light thin-scrollbar   fixed inset-0 bg-opacity-50 flex items-start left-[16%] mt-1 pt-1 z-50 ${className}`}>
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto search-modal-container"
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2565C7] focus:border-transparent"
            placeholder="Search date, name, email address, or subject line"
            autoFocus
          />
        </div>

        {/* Search Content */}
        <div className="px-6 py-2">
          {/* <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-gray-900">Search message content</span>
              <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <span className="text-gray-400 text-sm">?</span>
              </div>
            </div>
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Enable
            </button>
          </div> */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search in</h3>
            <div className="flex flex-wrap gap-2">
              {searchInOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedSearchIn(option.value)}
                  className={`px-3 py-1.5 rounded-xl  text-sm font-medium transition-colors flex items-center gap-1 ${
                    selectedSearchIn === option.value
                      ? "bg-[#2565C7] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                  {option.hasDropdown && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* More/Fewer search options toggle */}
          {showMoreOptions && (
            <div className="mb-4">
              <button
                onClick={() => setShowMoreOptions(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Fewer search options
              </button>
            </div>
          )}

          {/* Additional search options when expanded */}
          {showMoreOptions && (
            <div className="space-y-2 mb-4">
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[15px] font-medium text-gray-900 mb-2">From</label>
                  <input
                    type="text"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholder="Start date"
                    className="w-full px-4 py-3 text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2565C7] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-medium text-gray-900 mb-2">To</label>
                  <input
                    type="text"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    placeholder="End date"
                    className="w-full px-4 py-3 text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2565C7] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sender */}
              <div>
                <label className="block text-[15px] font-medium text-gray-900 mb-2">Sender</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Name or email address"
                  className="w-full px-4 py-3 text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2565C7] focus:border-transparent"
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-[15px] font-medium text-gray-900 mb-2">Recipient</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Name or email address"
                  className="w-full px-4 py-3 text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2565C7] focus:border-transparent"
                />
              </div>

              {/* Address Dropdown */}
              <div>
                <label className="block text-[15px] font-medium text-gray-900 mb-2">Address</label>
                <div className="relative">
                  <select
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2565C7] focus:border-transparent appearance-none bg-white"
                  >
                    {addressOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            {!showMoreOptions ? (
              <button
                onClick={() => setShowMoreOptions(true)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                More search options
              </button>
            ) : (
              <div></div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-[#2565C7] text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal