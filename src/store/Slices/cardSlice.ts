// import { getColorFromString } from "@/utils/getColorFromString"
// import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// export interface DynamicField {
//   id: string
//   type: "text" | "note" | "2fa" | "hidden" | "date"
//   label: string
//   value: string
// }

// export interface Card {
//   id: number
//   title: string
//   nameOnCard: string
//   cardNumber: string
//   expirationDate: string
//   securityCode: string
//   pin: string
//   note: string
//   dynamicFields: DynamicField[]
//   attachments: string[]
//   created_at: string
//   date: string
//   assigneeColor: string
//   // Optional fields (keep if used elsewhere in your app)
//   description?: string
//   descriptionText?: string
//   assignee?: string
//   tag?: string
//   priority?: "low" | "medium" | "high"
//   status?: "" | "complete" | "important" | "trash"
//   path?: string
// }

// interface CardState {
//   cards: Card[]
//   selectedTab: string
//   searchTerm: string
//   editCard: Card | null
//   searching: boolean
//   isModalOpen: boolean
//   modalMode: "add" | "edit"
// }

// const getOrdinal = (n: number): string => {
//   if (n > 3 && n < 21) return "th"
//   switch (n % 10) {
//     case 1:
//       return "st"
//     case 2:
//       return "nd"
//     case 3:
//       return "rd"
//     default:
//       return "th"
//   }
// }

// const getDate = () => {
//   const today = new Date()
//   const day = today.getDate()
//   const month = today.toLocaleString("default", { month: "long" })
//   const year = today.getFullYear()
//   return `${day}${getOrdinal(day)} ${month}, ${year}`
// }

// const initialState: CardState = {
//   cards: [],
//   selectedTab: "",
//   searchTerm: "",
//   editCard: null,
//   searching: false,
//   isModalOpen: false,
//   modalMode: "add",
// }

// const cardSlice = createSlice({
//   name: "card",
//   initialState,
//   reducers: {
//     addCard: (state, action: PayloadAction<Omit<Card, "id" | "created_at" | "date" | "assigneeColor">>) => {
//       const newId = state.cards.length ? Math.max(...state.cards.map((c) => c.id)) + 1 : 1
//       const now = new Date()
//       const assigneeColor = getColorFromString(action.payload.title) // Using title for color generation

//       const newCard: Card = {
//         ...action.payload,
//         id: newId,
//         created_at: now.toISOString(),
//         date: getDate(),
//         assigneeColor,
//         // Default values for optional fields
//         description: "",
//         descriptionText: "",
//         assignee: "",
//         tag: "",
//         priority: "medium",
//         status: "",
//       }

//       state.cards.unshift(newCard)
//     },

//     editCard: (state, action: PayloadAction<{ id: number; updates: Partial<Card> }>) => {
//       const { id, updates } = action.payload
//       const index = state.cards.findIndex((c) => c.id === id)
//       if (index !== -1) {
//         state.cards[index] = { ...state.cards[index], ...updates }
//       }
//     },

//     deleteCard: (state, action: PayloadAction<{ id: number; permanent?: boolean }>) => {
//       const { id, permanent } = action.payload
//       if (permanent) {
//         state.cards = state.cards.filter((card) => card.id !== id)
//       } else {
//         const card = state.cards.find((c) => c.id === id)
//         if (card) card.status = "trash"
//       }
//     },

//     restoreCard: (state, action: PayloadAction<number>) => {
//       const card = state.cards.find((c) => c.id === action.payload)
//       if (card) card.status = ""
//     },

//     cardToggleComplete: (state, action: PayloadAction<number>) => {
//       const card = state.cards.find((c) => c.id === action.payload)
//       if (card) {
//         card.status = card.status === "complete" ? "" : "complete"
//       }
//     },

//     cardToggleImportant: (state, action: PayloadAction<number>) => {
//       const card = state.cards.find((c) => c.id === action.payload)
//       if (card) {
//         card.status = card.status === "important" ? "" : "important"
//       }
//     },

//     addDynamicField: (state, action: PayloadAction<{ cardId: number; field: DynamicField }>) => {
//       const { cardId, field } = action.payload
//       const card = state.cards.find((c) => c.id === cardId)
//       if (card) {
//         card.dynamicFields.push(field)
//       }
//     },

//     updateDynamicField: (state, action: PayloadAction<{ cardId: number; fieldId: string; value: string }>) => {
//       const { cardId, fieldId, value } = action.payload
//       const card = state.cards.find((c) => c.id === cardId)
//       if (card) {
//         const field = card.dynamicFields.find((f) => f.id === fieldId)
//         if (field) {
//           field.value = value
//         }
//       }
//     },

//     removeDynamicField: (state, action: PayloadAction<{ cardId: number; fieldId: string }>) => {
//       const { cardId, fieldId } = action.payload
//       const card = state.cards.find((c) => c.id === cardId)
//       if (card) {
//         card.dynamicFields = card.dynamicFields.filter((f) => f.id !== fieldId)
//       }
//     },

//     addAttachment: (state, action: PayloadAction<{ cardId: number; filename: string }>) => {
//       const { cardId, filename } = action.payload
//       const card = state.cards.find((c) => c.id === cardId)
//       if (card) {
//         card.attachments.push(filename)
//       }
//     },

//     removeAttachment: (state, action: PayloadAction<{ cardId: number; filename: string }>) => {
//       const { cardId, filename } = action.payload
//       const card = state.cards.find((c) => c.id === cardId)
//       if (card) {
//         card.attachments = card.attachments.filter((a) => a !== filename)
//       }
//     },

//     setSearchTerm: (state, action: PayloadAction<string>) => {
//       state.searchTerm = action.payload
//     },

//     setSelectedTab: (state, action: PayloadAction<string>) => {
//       state.selectedTab = action.payload
//     },

//     setEditCard: (state, action: PayloadAction<Card | null>) => {
//       state.editCard = action.payload
//     },

//     setCardsFromStorage: (state, action: PayloadAction<Card[]>) => {
//       state.cards = action.payload
//     },

//     setSearchingData: (state, action: PayloadAction<boolean>) => {
//       state.searching = action.payload
//     },

//     // Modal control - FIXED: No payload required
//     openAddModal: (state) => {
//       state.modalMode = "add"
//       state.editCard = null
//       state.isModalOpen = true
//     },

//     openEditModal: (state, action: PayloadAction<Card>) => {
//       state.modalMode = "edit"
//       state.editCard = action.payload
//       state.isModalOpen = true
//     },

//     closeCardModal: (state) => {
//       state.isModalOpen = false
//       state.editCard = null
//     },

//     // Bulk operations
//     deleteMultipleCards: (state, action: PayloadAction<{ ids: number[]; permanent?: boolean }>) => {
//       const { ids, permanent } = action.payload
//       if (permanent) {
//         state.cards = state.cards.filter((card) => !ids.includes(card.id))
//       } else {
//         ids.forEach((id) => {
//           const card = state.cards.find((c) => c.id === id)
//           if (card) card.status = "trash"
//         })
//       }
//     },

//     restoreMultipleCards: (state, action: PayloadAction<number[]>) => {
//       action.payload.forEach((id) => {
//         const card = state.cards.find((c) => c.id === id)
//         if (card) card.status = ""
//       })
//     },

//     // Card-specific utilities
//     maskCardNumber: (state, action: PayloadAction<number>) => {
//       const card = state.cards.find((c) => c.id === action.payload)
//       if (card && card.cardNumber) {
//         // Mask all but last 4 digits
//         const lastFour = card.cardNumber.slice(-4)
//         const masked = "**** **** **** " + lastFour
//         card.cardNumber = masked
//       }
//     },

//     updateCardExpiration: (state, action: PayloadAction<{ id: number; expirationDate: string }>) => {
//       const { id, expirationDate } = action.payload
//       const card = state.cards.find((c) => c.id === id)
//       if (card) {
//         card.expirationDate = expirationDate
//       }
//     },

//     // Security actions
//     clearSensitiveData: (state, action: PayloadAction<number>) => {
//       const card = state.cards.find((c) => c.id === action.payload)
//       if (card) {
//         card.securityCode = ""
//         card.pin = ""
//         // Clear sensitive dynamic fields
//         card.dynamicFields.forEach((field) => {
//           if (field.type === "hidden" || field.type === "2fa") {
//             field.value = ""
//           }
//         })
//       }
//     },

//     // Filter and sort
//     sortCards: (state, action: PayloadAction<"date" | "title" | "expiration">) => {
//       const sortBy = action.payload
//       state.cards.sort((a, b) => {
//         switch (sortBy) {
//           case "date":
//             return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//           case "title":
//             return a.title.localeCompare(b.title)
//           case "expiration":
//             return a.expirationDate.localeCompare(b.expirationDate)
//           default:
//             return 0
//         }
//       })
//     },
//   },
// })

// export const {
//   addCard,
//   editCard,
//   deleteCard,
//   restoreCard,
//   cardToggleComplete,
//   cardToggleImportant,
//   addDynamicField,
//   updateDynamicField,
//   removeDynamicField,
//   addAttachment,
//   removeAttachment,
//   setSearchTerm,
//   setSelectedTab,
//   setEditCard,
//   setCardsFromStorage,
//   setSearchingData,
//   openAddModal,
//   openEditModal,
//   closeCardModal,
//   deleteMultipleCards,
//   restoreMultipleCards,
//   maskCardNumber,
//   updateCardExpiration,
//   clearSensitiveData,
//   sortCards,
// } = cardSlice.actions

// export default cardSlice.reducer


import { getColorFromString } from "@/utils/getColorFromString"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface DynamicField {
  id: string
  type: "text" | "note" | "2fa" | "hidden" | "date"
  label: string
  value: string
}

export interface Card {
  vaultKey: string
  priority: string
  id: number
  title: string
  nameOnCard: string
  cardNumber: string
  expirationDate: string
  securityCode: string
  pin: string
  note: string
  dynamicFields: DynamicField[]
  attachments: string[]
  created_at: string
  date: string
  // assigneeColor: string
  // Optional fields (keep if used elsewhere in your app)
  // description?: string
  // descriptionText?: string
  // assignee?: string
  // tag?: string
  // priority?: "low" | "medium" | "high"
  status?: "" | "complete" | "important" | "trash"
  // path?: string
}

interface CardState {
  cards: Card[]
  selectedTab: string
  searchTerm: string
  editCard: Card | null
  searching: boolean
  isModalOpen: boolean
  modalMode: "add" | "edit"
}

const getOrdinal = (n: number): string => {
  if (n > 3 && n < 21) return "th"
  switch (n % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

const getDate = () => {
  const today = new Date()
  const day = today.getDate()
  const month = today.toLocaleString("default", { month: "long" })
  const year = today.getFullYear()
  return `${day}${getOrdinal(day)} ${month}, ${year}`
}

const initialState: CardState = {
  cards: [],
  selectedTab: "",
  searchTerm: "",
  editCard: null,
  searching: false,
  isModalOpen: false,
  modalMode: "add",
}

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<Omit<Card, "id" | "created_at" | "date" | "assigneeColor">>) => {
      const newId = state.cards.length ? Math.max(...state.cards.map((c) => c.id)) + 1 : 1
      const now = new Date()
      const assigneeColor = getColorFromString(action.payload.title) // Using title for color generation

      const newCard: Card = {
        ...action.payload,
        id: newId,
        created_at: now.toISOString(),
        date: getDate(),
        // assigneeColor,
        // Default values for optional fields
        // description: "",
        // descriptionText: "",
        // assignee: "",
        // tag: "",
        // priority: "medium",
        status: "",
      }

      state.cards.unshift(newCard)
    },

    editCard: (state, action: PayloadAction<{ id: number; updates: Partial<Card> }>) => {
      const { id, updates } = action.payload
      const index = state.cards.findIndex((c) => c.id === id)
      if (index !== -1) {
        state.cards[index] = { ...state.cards[index], ...updates }
      }
    },

    deleteCard: (state, action: PayloadAction<{ id: number; permanent?: boolean }>) => {
      const { id, permanent } = action.payload
      if (permanent) {
        state.cards = state.cards.filter((card) => card.id !== id)
      } else {
        const card = state.cards.find((c) => c.id === id)
        if (card) card.status = "trash"
      }
    },

    restoreCard: (state, action: PayloadAction<number>) => {
      const card = state.cards.find((c) => c.id === action.payload)
      if (card) card.status = ""
    },

    toggleComplete: (state, action: PayloadAction<number>) => {
      const card = state.cards.find((c) => c.id === action.payload)
      if (card) {
        card.status = card.status === "complete" ? "" : "complete"
      }
    },

    toggleImportant: (state, action: PayloadAction<number>) => {
      const card = state.cards.find((c) => c.id === action.payload)
      if (card) {
        card.status = card.status === "important" ? "" : "important"
      }
    },

    addDynamicField: (state, action: PayloadAction<{ cardId: number; field: DynamicField }>) => {
      const { cardId, field } = action.payload
      const card = state.cards.find((c) => c.id === cardId)
      if (card) {
        card.dynamicFields.push(field)
      }
    },

    updateDynamicField: (state, action: PayloadAction<{ cardId: number; fieldId: string; value: string }>) => {
      const { cardId, fieldId, value } = action.payload
      const card = state.cards.find((c) => c.id === cardId)
      if (card) {
        const field = card.dynamicFields.find((f) => f.id === fieldId)
        if (field) {
          field.value = value
        }
      }
    },

    removeDynamicField: (state, action: PayloadAction<{ cardId: number; fieldId: string }>) => {
      const { cardId, fieldId } = action.payload
      const card = state.cards.find((c) => c.id === cardId)
      if (card) {
        card.dynamicFields = card.dynamicFields.filter((f) => f.id !== fieldId)
      }
    },

    addAttachment: (state, action: PayloadAction<{ cardId: number; filename: string }>) => {
      const { cardId, filename } = action.payload
      const card = state.cards.find((c) => c.id === cardId)
      if (card) {
        card.attachments.push(filename)
      }
    },

    removeAttachment: (state, action: PayloadAction<{ cardId: number; filename: string }>) => {
      const { cardId, filename } = action.payload
      const card = state.cards.find((c) => c.id === cardId)
      if (card) {
        card.attachments = card.attachments.filter((a) => a !== filename)
      }
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },

    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload
    },

    setEditCard: (state, action: PayloadAction<Card | null>) => {
      state.editCard = action.payload
    },

    setCardsFromStorage: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload
    },

    setSearchingData: (state, action: PayloadAction<boolean>) => {
      state.searching = action.payload
    },

    // Modal control - FIXED: No payload required
    openAddModal: (state) => {
      state.modalMode = "add"
      state.editCard = null
      state.isModalOpen = true
    },

    openEditModal: (state, action: PayloadAction<Card>) => {
      state.modalMode = "edit"
      state.editCard = action.payload
      state.isModalOpen = true
    },

    closeCardModal: (state) => {
      state.isModalOpen = false
      state.editCard = null
    },

    // Bulk operations
    deleteMultipleCards: (state, action: PayloadAction<{ ids: number[]; permanent?: boolean }>) => {
      const { ids, permanent } = action.payload
      if (permanent) {
        state.cards = state.cards.filter((card) => !ids.includes(card.id))
      } else {
        ids.forEach((id) => {
          const card = state.cards.find((c) => c.id === id)
          if (card) card.status = "trash"
        })
      }
    },

    restoreMultipleCards: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach((id) => {
        const card = state.cards.find((c) => c.id === id)
        if (card) card.status = ""
      })
    },

    // Card-specific utilities
    maskCardNumber: (state, action: PayloadAction<number>) => {
      const card = state.cards.find((c) => c.id === action.payload)
      if (card && card.cardNumber) {
        // Mask all but last 4 digits
        const lastFour = card.cardNumber.slice(-4)
        const masked = "**** **** **** " + lastFour
        card.cardNumber = masked
      }
    },

    updateCardExpiration: (state, action: PayloadAction<{ id: number; expirationDate: string }>) => {
      const { id, expirationDate } = action.payload
      const card = state.cards.find((c) => c.id === id)
      if (card) {
        card.expirationDate = expirationDate
      }
    },

    // Security actions
    clearSensitiveData: (state, action: PayloadAction<number>) => {
      const card = state.cards.find((c) => c.id === action.payload)
      if (card) {
        card.securityCode = ""
        card.pin = ""
        // Clear sensitive dynamic fields
        card.dynamicFields.forEach((field) => {
          if (field.type === "hidden" || field.type === "2fa") {
            field.value = ""
          }
        })
      }
    },

    // Filter and sort
    sortCards: (state, action: PayloadAction<"date" | "title" | "expiration">) => {
      const sortBy = action.payload
      state.cards.sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          case "title":
            return a.title.localeCompare(b.title)
          case "expiration":
            return a.expirationDate.localeCompare(b.expirationDate)
          default:
            return 0
        }
      })
    },
  },
})

export const {
  addCard,
  editCard,
  deleteCard,
  restoreCard,
  toggleComplete,
  toggleImportant, // Make sure this is here
  addDynamicField,
  updateDynamicField,
  removeDynamicField,
  addAttachment,
  removeAttachment,
  setSearchTerm,
  setSelectedTab,
  setEditCard,
  setCardsFromStorage,
  setSearchingData,
  openAddModal,
  openEditModal,
  closeCardModal,
  deleteMultipleCards,
  restoreMultipleCards,
  maskCardNumber,
  updateCardExpiration,
  clearSensitiveData,
  sortCards,
} = cardSlice.actions

export default cardSlice.reducer
