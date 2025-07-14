import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface PasswordHistory {
  id: string
  password: string
  type: string
  timestamp: string
  strength: "Weak" | "Fair" | "Good" | "Strong"
}

interface PasswordState {
  isModalOpen: boolean
  passwordHistory: PasswordHistory[]
  currentPassword: string
  passwordStrength: "Weak" | "Fair" | "Good" | "Strong"
}

const initialState: PasswordState = {
  isModalOpen: false,
  passwordHistory: [],
  currentPassword: "",
  passwordStrength: "Strong",
}

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    openPasswordGenerator: (state) => {
      state.isModalOpen = true
    },

    closePasswordGenerator: (state) => {
      state.isModalOpen = false
    },

    setCurrentPassword: (state, action: PayloadAction<string>) => {
      state.currentPassword = action.payload
    },

    setPasswordStrength: (state, action: PayloadAction<"Weak" | "Fair" | "Good" | "Strong">) => {
      state.passwordStrength = action.payload
    },

    addToPasswordHistory: (state, action: PayloadAction<PasswordHistory>) => {
      // Add to beginning and keep only last 10
      state.passwordHistory = [action.payload, ...state.passwordHistory.slice(0, 9)]
    },

    setPasswordHistoryFromStorage: (state, action: PayloadAction<PasswordHistory[]>) => {
      state.passwordHistory = action.payload
    },

    clearPasswordHistory: (state) => {
      state.passwordHistory = []
    },

    removeFromPasswordHistory: (state, action: PayloadAction<string>) => {
      state.passwordHistory = state.passwordHistory.filter((entry) => entry.id !== action.payload)
    },
  },
})

export const {
  openPasswordGenerator,
  closePasswordGenerator,
  setCurrentPassword,
  setPasswordStrength,
  addToPasswordHistory,
  setPasswordHistoryFromStorage,
  clearPasswordHistory,
  removeFromPasswordHistory,
} = passwordSlice.actions

export default passwordSlice.reducer
