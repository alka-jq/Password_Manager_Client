"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import {
  closePasswordGenerator,
  setCurrentPassword,
  setPasswordStrength,
  addToPasswordHistory,
  setPasswordHistoryFromStorage,
  clearPasswordHistory,
  removeFromPasswordHistory,
} from "@/store/Slices/passwordSlice"
import type { PasswordHistory } from "@/store/Slices/passwordSlice"
import { RefreshCw, Copy, X, Settings, ChevronRight, Check, Eye, EyeOff, Trash2, Key, Sparkles } from "lucide-react"

const PasswordGenerator: React.FC = () => {
  const dispatch = useDispatch()
  const { isModalOpen, passwordHistory, currentPassword, passwordStrength } = useSelector(
    (state: RootState) => state.password,
  )

  // State management
  const [passwordType, setPasswordType] = useState<"memorable" | "random">("memorable")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(true)

  // Memorable password options
  const [wordCount, setWordCount] = useState(5)
  const [capitalize, setCapitalize] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [separator, setSeparator] = useState("-")

  // Random password options
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbersRandom, setIncludeNumbersRandom] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)

  // Word lists for memorable passwords
  const adjectives = [
    "Legal", "Track", "Failing", "Unhealthy", "Crafty", "Silent", "Brave", "Quick", 
    "Gentle", "Fierce", "Calm", "Bold", "Swift", "Bright", "Dark", "Light", 
    "Strong", "Weak", "Fast", "Slow", "Big", "Small", "Hot", "Cold", 
    "Happy", "Sad", "Lucky", "Smart", "Wild", "Tame", "Rich", "Poor"
  ]

  const nouns = [
    "Craftsman", "Tiger", "Eagle", "Mountain", "River", "Ocean", "Forest", "Desert", 
    "Castle", "Bridge", "Tower", "Garden", "Library", "Museum", "Theater", "Stadium", 
    "Warrior", "Knight", "Wizard", "Dragon", "Phoenix", "Lion", "Wolf", "Bear", 
    "Storm", "Thunder", "Lightning", "Rainbow", "Sunset", "Sunrise", "Moon", "Star"
  ]

  // Load password history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("standalonePasswordHistory")
    if (savedHistory) {
      dispatch(setPasswordHistoryFromStorage(JSON.parse(savedHistory)))
    }
  }, [dispatch])

  // Save password history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("standalonePasswordHistory", JSON.stringify(passwordHistory))
  }, [passwordHistory])

  // Generate memorable password
  const generateMemorablePassword = () => {
    const words = []

    for (let i = 0; i < wordCount; i++) {
      let word
      if (i % 2 === 0) {
        word = adjectives[Math.floor(Math.random() * adjectives.length)]
      } else {
        word = nouns[Math.floor(Math.random() * nouns.length)]
      }

      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      } else {
        word = word.toLowerCase()
      }

      words.push(word)
    }

    let password = words.join(separator)

    if (includeNumbers) {
      const randomNum = Math.floor(Math.random() * 100)
      password += randomNum
    }

    return password
  }

  // Generate random password
  const generateRandomPassword = () => {
    let charset = ""

    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbersRandom) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "")
    }

    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    return password
  }

  // Calculate password strength
  const calculateStrength = (password: string): "Weak" | "Fair" | "Good" | "Strong" => {
    let score = 0

    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) return "Weak"
    if (score <= 3) return "Fair"
    if (score <= 4) return "Good"
    return "Strong"
  }

  // Generate new password
  const generatePassword = () => {
    const newPassword = passwordType === "memorable" ? generateMemorablePassword() : generateRandomPassword()
    const strength = calculateStrength(newPassword)

    dispatch(setCurrentPassword(newPassword))
    dispatch(setPasswordStrength(strength))

    // Add to history
    const historyEntry: PasswordHistory = {
      id: Date.now().toString(),
      password: newPassword,
      type: passwordType === "memorable" ? "Memorable Password" : "Random Password",
      timestamp: new Date().toISOString(),
      strength,
    }

    dispatch(addToPasswordHistory(historyEntry))
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy password:", err)
    }
  }

  // Generate initial password
  useEffect(() => {
    if (isModalOpen && !currentPassword) {
      generatePassword()
    }
  }, [isModalOpen])

  // Get strength color
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Weak":
        return "text-red-500"
      case "Fair":
        return "text-orange-500"
      case "Good":
        return "text-yellow-500"
      case "Strong":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  // Get strength bar colors
  const getStrengthBars = (strength: string) => {
    switch (strength) {
      case "Weak":
        return "bg-red-500"
      case "Fair":
        return "bg-orange-500"
      case "Good":
        return "bg-yellow-500"
      case "Strong":
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={() => dispatch(closePasswordGenerator())} />

      <div className="relative w-full max-w-2xl h-[90vh] overflow-hidden rounded-xl border border-gray-200/30 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md">
              <Key className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Password Generator</h2>
          </div>
          <button
            onClick={() => dispatch(closePasswordGenerator())}
            className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-200 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Generated Password Display */}
          <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-blue-100 dark:border-gray-700">
            <div className="relative">
              <div className="min-h-[70px] p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <div className="text-center">
                  <div className={`font-mono text-lg break-all ${showPassword ? "" : "filter blur-md select-none"}`}>
                    {currentPassword || "Click generate to create password"}
                  </div>
                </div>
              </div>

              {/* Password visibility toggle */}
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strength indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div 
                      key={bar} 
                      className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                        (passwordStrength === "Weak" && bar <= 1) ||
                        (passwordStrength === "Fair" && bar <= 2) ||
                        (passwordStrength === "Good" && bar <= 3) ||
                        (passwordStrength === "Strong" && bar <= 4)
                          ? getStrengthBars(passwordStrength) 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-sm font-semibold ${getStrengthColor(passwordStrength)}`}>
                  {passwordStrength} Password
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 h-12 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copied ? "Copied!" : "Copy Password"}
              </button>
              <button
                onClick={generatePassword}
                className="h-12 w-12 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Password Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setPasswordType("memorable")
                  setTimeout(generatePassword, 100)
                }}
                className={`h-12 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${
                  passwordType === "memorable" 
                    ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 shadow-sm" 
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Memorable
              </button>
              <button
                onClick={() => {
                  setPasswordType("random")
                  setTimeout(generatePassword, 100)
                }}
                className={`h-12 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${
                  passwordType === "random" 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-sm" 
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Key className="h-4 w-4" />
                Random
              </button>
            </div>
          </div>

          {/* Memorable Password Options */}
          {passwordType === "memorable" && (
            <div className="space-y-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/20">
              {/* Word count slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Word Count</label>
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{wordCount} words</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={wordCount}
                  onChange={(e) => {
                    setWordCount(Number.parseInt(e.target.value))
                    setTimeout(generatePassword, 100)
                  }}
                  className="w-full h-2 bg-orange-200 dark:bg-orange-800 rounded-full appearance-none cursor-pointer slider accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>3</span>
                  <span>8</span>
                </div>
              </div>

              {/* Capitalize toggle */}
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Capitalize Words</label>
                <button
                  onClick={() => {
                    setCapitalize(!capitalize)
                    setTimeout(generatePassword, 100)
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    capitalize ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      capitalize ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Random Password Options */}
          {passwordType === "random" && (
            <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
              {/* Length slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Length</label>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{length} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="50"
                  value={length}
                  onChange={(e) => {
                    setLength(Number.parseInt(e.target.value))
                    setTimeout(generatePassword, 100)
                  }}
                  className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full appearance-none cursor-pointer slider accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>8</span>
                  <span>50</span>
                </div>
              </div>

              {/* Character options */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Uppercase", state: includeUppercase, setter: setIncludeUppercase },
                  { label: "Lowercase", state: includeLowercase, setter: setIncludeLowercase },
                  { label: "Numbers", state: includeNumbersRandom, setter: setIncludeNumbersRandom },
                  { label: "Symbols", state: includeSymbols, setter: setIncludeSymbols },
                ].map((option) => (
                  <div key={option.label} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{option.label}</label>
                    <button
                      onClick={() => {
                        option.setter(!option.state)
                        setTimeout(generatePassword, 100)
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        option.state ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          option.state ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Settings className="h-4 w-4" />
                Advanced Options
              </div>
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? "rotate-90" : ""}`}
              />
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                {passwordType === "memorable" && (
                  <>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Numbers</label>
                      <button
                        onClick={() => {
                          setIncludeNumbers(!includeNumbers)
                          setTimeout(generatePassword, 100)
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          includeNumbers ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            includeNumbers ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Separator</label>
                      <select
                        value={separator}
                        onChange={(e) => {
                          setSeparator(e.target.value)
                          setTimeout(generatePassword, 100)
                        }}
                        className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="-">Hyphens (-)</option>
                        <option value="_">Underscores (_)</option>
                        <option value=".">Periods (.)</option>
                        <option value=" ">Spaces</option>
                        <option value="">None</option>
                      </select>
                    </div>
                  </>
                )}

                {passwordType === "random" && (
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Exclude Similar Characters
                    </label>
                    <button
                      onClick={() => {
                        setExcludeSimilar(!excludeSimilar)
                        setTimeout(generatePassword, 100)
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        excludeSimilar ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          excludeSimilar ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowAdvanced(false)}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Close Advanced Options
                </button>
              </div>
            )}
          </div>

          {/* Password History */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Password History
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${showHistory ? "rotate-90" : ""}`}
                />
              </button>
              {passwordHistory.length > 0 && (
                <button
                  onClick={() => dispatch(clearPasswordHistory())}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear All
                </button>
              )}
            </div>

            {showHistory && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {passwordHistory.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No password history yet</p>
                ) : (
                  passwordHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                    >
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          dispatch(setCurrentPassword(entry.password))
                          dispatch(setPasswordStrength(entry.strength))
                        }}
                      >
                        <div className="font-mono text-sm truncate">{entry.password}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{entry.type}</span>
                          <span className={`text-xs font-medium ${getStrengthColor(entry.strength)}`}>
                            {entry.strength}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(entry.password)
                          }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dispatch(removeFromPasswordHistory(entry.id))
                          }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordGenerator