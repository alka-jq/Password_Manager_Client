import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../index"
import type { Card } from "../Slices/cardSlice"

// Basic selectors
export const selectCards = (state: RootState) => state.card.cards
export const selectCardSearchTerm = (state: RootState) => state.card.searchTerm
export const selectCardSelectedTab = (state: RootState) => state.card.selectedTab
export const selectCardEditCard = (state: RootState) => state.card.editCard
export const selectCardSearching = (state: RootState) => state.card.searching
export const selectCardModalOpen = (state: RootState) => state.card.isModalOpen
export const selectCardModalMode = (state: RootState) => state.card.modalMode

// Filtered cards selectors
export const selectActiveCards = createSelector([selectCards], (cards) =>
  cards.filter((card) => card.status !== "trash"),
)

export const selectTrashCards = createSelector([selectCards], (cards) =>
  cards.filter((card) => card.status === "trash"),
)

export const selectImportantCards = createSelector([selectCards], (cards) =>
  cards.filter((card) => card.status === "important"),
)

export const selectCompletedCards = createSelector([selectCards], (cards) =>
  cards.filter((card) => card.status === "complete"),
)

// Search functionality
export const selectFilteredCards = createSelector(
  [selectCards, selectCardSearchTerm, selectCardSelectedTab],
  (cards, searchTerm, selectedTab) => {
    let filteredCards = cards

    // Filter by tab/status
    switch (selectedTab) {
      case "inbox":
      case "all_items":
        filteredCards = cards.filter((card) => card.status !== "trash")
        break
      case "important":
        filteredCards = cards.filter((card) => card.status === "important")
        break
      case "completed":
      case "done":
        filteredCards = cards.filter((card) => card.status === "complete")
        break
      case "trash":
        filteredCards = cards.filter((card) => card.status === "trash")
        break
      case "personal":
        filteredCards = cards.filter((card) => card.status !== "trash")
        break
      default:
        filteredCards = cards.filter((card) => card.status !== "trash")
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filteredCards = filteredCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchLower) ||
          card.nameOnCard.toLowerCase().includes(searchLower) ||
          card.note.toLowerCase().includes(searchLower) ||
          card.cardNumber.includes(searchTerm) ||
          card.dynamicFields.some((field) => field.value.toLowerCase().includes(searchLower)),
      )
    }

    return filteredCards
  },
)

// Card counts by tab
export const getCardCountsByTab = createSelector([selectCards], (cards) => {
  const counts = {
    inbox: 0,
    all_items: 0,
    important: 0,
    completed: 0,
    done: 0,
    trash: 0,
    personal: 0,
    total: cards.length,
  }

  cards.forEach((card) => {
    switch (card.status) {
      case "important":
        counts.important++
        counts.inbox++
        counts.all_items++
        counts.personal++
        break
      case "complete":
        counts.completed++
        counts.done++
        counts.inbox++
        counts.all_items++
        counts.personal++
        break
      case "trash":
        counts.trash++
        break
      default:
        counts.inbox++
        counts.all_items++
        counts.personal++
    }
  })

  return counts
})

// Card statistics
export const selectCardStatistics = createSelector([selectCards], (cards) => {
  const stats = {
    total: cards.length,
    active: 0,
    completed: 0,
    important: 0,
    trash: 0,
    withAttachments: 0,
    withDynamicFields: 0,
    expiringThisMonth: 0,
    expiredCards: 0,
  }

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  cards.forEach((card) => {
    // Status counts
    switch (card.status) {
      case "complete":
        stats.completed++
        break
      case "important":
        stats.important++
        stats.active++
        break
      case "trash":
        stats.trash++
        break
      default:
        stats.active++
    }

    // Feature counts
    if (card.attachments.length > 0) {
      stats.withAttachments++
    }

    if (card.dynamicFields.length > 0) {
      stats.withDynamicFields++
    }

    // Expiration analysis
    if (card.expirationDate) {
      const [month, year] = card.expirationDate.split("/").map(Number)
      if (year && month) {
        const fullYear = year < 50 ? 2000 + year : 1900 + year
        const expirationDate = new Date(fullYear, month - 1)

        if (expirationDate < currentDate) {
          stats.expiredCards++
        } else if (expirationDate.getMonth() === currentMonth && expirationDate.getFullYear() === currentYear) {
          stats.expiringThisMonth++
        }
      }
    }
  })

  return stats
})

// Get cards by priority
export const selectCardsByPriority = createSelector([selectCards], (cards) => {
  return {
    high: cards.filter((card) => card.priority === "high"),
    medium: cards.filter((card) => card.priority === "medium"),
    low: cards.filter((card) => card.priority === "low"),
  }
})

// Get recent cards
export const selectRecentCards = createSelector([selectCards], (cards) => {
  return cards
    .filter((card) => card.status !== "trash")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

// Get cards expiring soon
export const selectExpiringCards = createSelector([selectCards], (cards) => {
  const currentDate = new Date()
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(currentDate.getMonth() + 3)

  return cards
    .filter((card) => {
      if (!card.expirationDate || card.status === "trash") return false

      const [month, year] = card.expirationDate.split("/").map(Number)
      if (!year || !month) return false

      const fullYear = year < 50 ? 2000 + year : 1900 + year
      const expirationDate = new Date(fullYear, month - 1)

      return expirationDate >= currentDate && expirationDate <= threeMonthsFromNow
    })
    .sort((a, b) => {
      const [monthA, yearA] = a.expirationDate.split("/").map(Number)
      const [monthB, yearB] = b.expirationDate.split("/").map(Number)
      const dateA = new Date(yearA < 50 ? 2000 + yearA : 1900 + yearA, monthA - 1)
      const dateB = new Date(yearB < 50 ? 2000 + yearB : 1900 + yearB, monthB - 1)
      return dateA.getTime() - dateB.getTime()
    })
})

// Get card by ID
export const selectCardById = createSelector([selectCards, (_: RootState, cardId: number) => cardId], (cards, cardId) =>
  cards.find((card) => card.id === cardId),
)

// Get cards with attachments
export const selectCardsWithAttachments = createSelector([selectCards], (cards) =>
  cards.filter((card) => card.attachments.length > 0 && card.status !== "trash"),
)

// Get cards by card type (based on card number)
export const selectCardsByType = createSelector([selectCards], (cards) => {
  const cardTypes = {
    visa: [] as Card[],
    mastercard: [] as Card[],
    amex: [] as Card[],
    discover: [] as Card[],
    other: [] as Card[],
  }

  cards.forEach((card) => {
    if (card.status === "trash") return

    const firstDigit = card.cardNumber.charAt(0)
    const firstTwoDigits = card.cardNumber.substring(0, 2)

    if (firstDigit === "4") {
      cardTypes.visa.push(card)
    } else if (["51", "52", "53", "54", "55"].includes(firstTwoDigits)) {
      cardTypes.mastercard.push(card)
    } else if (["34", "37"].includes(firstTwoDigits)) {
      cardTypes.amex.push(card)
    } else if (firstDigit === "6") {
      cardTypes.discover.push(card)
    } else {
      cardTypes.other.push(card)
    }
  })

  return cardTypes
})

// Export all selectors
export default {
  selectCards,
  selectCardSearchTerm,
  selectCardSelectedTab,
  selectCardEditCard,
  selectCardSearching,
  selectCardModalOpen,
  selectCardModalMode,
  selectActiveCards,
  selectTrashCards,
  selectImportantCards,
  selectCompletedCards,
  selectFilteredCards,
  getCardCountsByTab,
  selectCardStatistics,
  selectCardsByPriority,
  selectRecentCards,
  selectExpiringCards,
  selectCardById,
  selectCardsWithAttachments,
  selectCardsByType,
}
