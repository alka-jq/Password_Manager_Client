import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../index"

// Basic selectors
export const selectPasswordModalOpen = (state: RootState) => state.password.isModalOpen
export const selectPasswordHistory = (state: RootState) => state.password.passwordHistory
export const selectCurrentPassword = (state: RootState) => state.password.currentPassword
export const selectPasswordStrength = (state: RootState) => state.password.passwordStrength

// Password statistics
export const selectPasswordStatistics = createSelector([selectPasswordHistory], (history) => {
  const stats = {
    total: history.length,
    strong: 0,
    good: 0,
    fair: 0,
    weak: 0,
    memorable: 0,
    random: 0,
  }

  history.forEach((entry) => {
    // Count by strength
    switch (entry.strength) {
      case "Strong":
        stats.strong++
        break
      case "Good":
        stats.good++
        break
      case "Fair":
        stats.fair++
        break
      case "Weak":
        stats.weak++
        break
    }

    // Count by type
    if (entry.type.includes("Memorable")) {
      stats.memorable++
    } else {
      stats.random++
    }
  })

  return stats
})

// Recent passwords
export const selectRecentPasswords = createSelector([selectPasswordHistory], (history) => {
  return history.slice(0, 5)
})

// Export all selectors
export default {
  selectPasswordModalOpen,
  selectPasswordHistory,
  selectCurrentPassword,
  selectPasswordStrength,
  selectPasswordStatistics,
  selectRecentPasswords,
}
