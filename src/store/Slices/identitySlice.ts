// import { getColorFromString } from "@/utils/getColorFromString"
// import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// export interface DynamicField {
//   id: string
//   type: "text" | "email" | "phone" | "date" | "url" | "textarea"
//   label: string
//   value: string
//   section: "personal" | "address" | "contact" | "work" | "other"
// }

// export interface PersonalDetails {
//   fullName: string
//   email: string
//   phoneNumber: string
//   dateOfBirth: string
//   gender: string
//   nationality: string
// }

// export interface AddressDetails {
//   organization: string
//   streetAddress: string
//   zipCode: string
//   city: string
//   state: string
//   country: string
// }

// export interface ContactDetails {
//   homePhone: string
//   workPhone: string
//   mobilePhone: string
//   alternateEmail: string
//   website: string
// }

// export interface WorkDetails {
//   company: string
//   jobTitle: string
//   department: string
//   workAddress: string
//   workEmail: string
//   workPhone: string
// }

// export interface Identity {
//   id: number
//   title: string
//   personalDetails: PersonalDetails
//   addressDetails: AddressDetails
//   contactDetails: ContactDetails
//   workDetails: WorkDetails
//   dynamicFields: DynamicField[]
//   attachments: string[]
//   note: string
//   created_at: string
//   date: string
//   assigneeColor: string
//   // Optional fields
//   description?: string
//   descriptionText?: string
//   assignee?: string
//   tag?: string
//   priority?: "low" | "medium" | "high"
//   status?: "" | "complete" | "important" | "trash"
//   path?: string
// }

// interface IdentityState {
//   identities: Identity[]
//   selectedTab: string
//   searchTerm: string
//   editIdentity: Identity | null
//   searching: boolean
//   isModalOpen: boolean
//   modalMode: "add" | "edit"
//   expandedSections: {
//     personal: boolean
//     address: boolean
//     contact: boolean
//     work: boolean
//   }
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

// const initialState: IdentityState = {
//   identities: [],
//   selectedTab: "",
//   searchTerm: "",
//   editIdentity: null,
//   searching: false,
//   isModalOpen: false,
//   modalMode: "add",
//   expandedSections: {
//     personal: true,
//     address: false,
//     contact: false,
//     work: false,
//   },
// }

// const identitySlice = createSlice({
//   name: "identity",
//   initialState,
//   reducers: {
//     addIdentity: (state, action: PayloadAction<Omit<Identity, "id" | "created_at" | "date" | "assigneeColor">>) => {
//       const newId = state.identities.length ? Math.max(...state.identities.map((i) => i.id)) + 1 : 1
//       const now = new Date()
//       const assigneeColor = getColorFromString(action.payload.title)

//       const newIdentity: Identity = {
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

//       state.identities.unshift(newIdentity)
//     },

//     editIdentity: (state, action: PayloadAction<{ id: number; updates: Partial<Identity> }>) => {
//       const { id, updates } = action.payload
//       const index = state.identities.findIndex((i) => i.id === id)
//       if (index !== -1) {
//         state.identities[index] = { ...state.identities[index], ...updates }
//       }
//     },

//     deleteIdentity: (state, action: PayloadAction<{ id: number; permanent?: boolean }>) => {
//       const { id, permanent } = action.payload
//       if (permanent) {
//         state.identities = state.identities.filter((identity) => identity.id !== id)
//       } else {
//         const identity = state.identities.find((i) => i.id === id)
//         if (identity) identity.status = "trash"
//       }
//     },

//     restoreIdentity: (state, action: PayloadAction<number>) => {
//       const identity = state.identities.find((i) => i.id === action.payload)
//       if (identity) identity.status = ""
//     },

//     identityToggleComplete: (state, action: PayloadAction<number>) => {
//       const identity = state.identities.find((i) => i.id === action.payload)
//       if (identity) {
//         identity.status = identity.status === "complete" ? "" : "complete"
//       }
//     },

//     identityToggleImportant: (state, action: PayloadAction<number>) => {
//       const identity = state.identities.find((i) => i.id === action.payload)
//       if (identity) {
//         identity.status = identity.status === "important" ? "" : "important"
//       }
//     },

//     addDynamicField: (state, action: PayloadAction<{ identityId: number; field: DynamicField }>) => {
//       const { identityId, field } = action.payload
//       const identity = state.identities.find((i) => i.id === identityId)
//       if (identity) {
//         identity.dynamicFields.push(field)
//       }
//     },

//     updateDynamicField: (state, action: PayloadAction<{ identityId: number; fieldId: string; value: string }>) => {
//       const { identityId, fieldId, value } = action.payload
//       const identity = state.identities.find((i) => i.id === identityId)
//       if (identity) {
//         const field = identity.dynamicFields.find((f) => f.id === fieldId)
//         if (field) {
//           field.value = value
//         }
//       }
//     },

//     removeDynamicField: (state, action: PayloadAction<{ identityId: number; fieldId: string }>) => {
//       const { identityId, fieldId } = action.payload
//       const identity = state.identities.find((i) => i.id === identityId)
//       if (identity) {
//         identity.dynamicFields = identity.dynamicFields.filter((f) => f.id !== fieldId)
//       }
//     },

//     addAttachment: (state, action: PayloadAction<{ identityId: number; filename: string }>) => {
//       const { identityId, filename } = action.payload
//       const identity = state.identities.find((i) => i.id === identityId)
//       if (identity) {
//         identity.attachments.push(filename)
//       }
//     },

//     removeAttachment: (state, action: PayloadAction<{ identityId: number; filename: string }>) => {
//       const { identityId, filename } = action.payload
//       const identity = state.identities.find((i) => i.id === identityId)
//       if (identity) {
//         identity.attachments = identity.attachments.filter((a) => a !== filename)
//       }
//     },

//     toggleSection: (state, action: PayloadAction<keyof IdentityState["expandedSections"]>) => {
//       const section = action.payload
//       state.expandedSections[section] = !state.expandedSections[section]
//     },

//     setSearchTerm: (state, action: PayloadAction<string>) => {
//       state.searchTerm = action.payload
//     },

//     setSelectedTab: (state, action: PayloadAction<string>) => {
//       state.selectedTab = action.payload
//     },

//     setEditIdentity: (state, action: PayloadAction<Identity | null>) => {
//       state.editIdentity = action.payload
//     },

//     setIdentitiesFromStorage: (state, action: PayloadAction<Identity[]>) => {
//       state.identities = action.payload
//     },

//     setSearchingData: (state, action: PayloadAction<boolean>) => {
//       state.searching = action.payload
//     },

//     // Modal control
//     openAddModal: (state) => {
//       state.modalMode = "add"
//       state.editIdentity = null
//       state.isModalOpen = true
//       // Reset expanded sections for new identity
//       state.expandedSections = {
//         personal: true,
//         address: false,
//         contact: false,
//         work: false,
//       }
//     },

//     openEditModal: (state, action: PayloadAction<Identity>) => {
//       state.modalMode = "edit"
//       state.editIdentity = action.payload
//       state.isModalOpen = true
//     },

//     closeIdentityModal: (state) => {
//       state.isModalOpen = false
//       state.editIdentity = null
//     },

//     // Bulk operations
//     deleteMultipleIdentities: (state, action: PayloadAction<{ ids: number[]; permanent?: boolean }>) => {
//       const { ids, permanent } = action.payload
//       if (permanent) {
//         state.identities = state.identities.filter((identity) => !ids.includes(identity.id))
//       } else {
//         ids.forEach((id) => {
//           const identity = state.identities.find((i) => i.id === id)
//           if (identity) identity.status = "trash"
//         })
//       }
//     },

//     restoreMultipleIdentities: (state, action: PayloadAction<number[]>) => {
//       action.payload.forEach((id) => {
//         const identity = state.identities.find((i) => i.id === id)
//         if (identity) identity.status = ""
//       })
//     },

//     // Sort identities
//     sortIdentities: (state, action: PayloadAction<"date" | "title" | "name">) => {
//       const sortBy = action.payload
//       state.identities.sort((a, b) => {
//         switch (sortBy) {
//           case "date":
//             return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//           case "title":
//             return a.title.localeCompare(b.title)
//           case "name":
//             return a.personalDetails.fullName.localeCompare(b.personalDetails.fullName)
//           default:
//             return 0
//         }
//       })
//     },
//   },
// })

// export const {
//   addIdentity,
//   editIdentity,
//   deleteIdentity,
//   restoreIdentity,
//   identityToggleComplete,
//   identityToggleImportant,
//   addDynamicField,
//   updateDynamicField,
//   removeDynamicField,
//   addAttachment,
//   removeAttachment,
//   toggleSection,
//   setSearchTerm,
//   setSelectedTab,
//   setEditIdentity,
//   setIdentitiesFromStorage,
//   setSearchingData,
//   openAddModal,
//   openEditModal,
//   closeIdentityModal,
//   deleteMultipleIdentities,
//   restoreMultipleIdentities,
//   sortIdentities,
// } = identitySlice.actions

// export default identitySlice.reducer



import { getColorFromString } from "@/utils/getColorFromString"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface DynamicField {
  id: string
  type: "text" | "email" | "phone" | "date" | "url" | "textarea"
  label: string
  value: string
  section: "personal" | "address" | "contact" | "work" | "other"
}

export interface PersonalDetails {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  nationality: string
}

export interface AddressDetails {
  organization: string
  streetAddress: string
  zipCode: string
  city: string
  state: string
  country: string
}

export interface ContactDetails {
  homePhone: string
  workPhone: string
  mobilePhone: string
  alternateEmail: string
  website: string
}

export interface WorkDetails {
  company: string
  jobTitle: string
  department: string
  workAddress: string
  workEmail: string
  workPhone: string
}

export interface Identity {
  priority: string
  id: number
  title: string
  personalDetails: PersonalDetails
  addressDetails: AddressDetails
  contactDetails: ContactDetails
  workDetails: WorkDetails
  dynamicFields: DynamicField[]
  attachments: string[]
  note: string
  created_at: string
  date: string
  vaultKey?: string
   vaultName?: string 
  vaultIcon?: string 
  vaultColor?: string
  // assigneeColor: string
  // Optional fields
  // description?: string
  // descriptionText?: string
  // assignee?: string
  // tag?: string
  // priority?: "low" | "medium" | "high"
  status?: "" | "complete" | "important" | "trash"
  // path?: string
}

interface IdentityState {
  identities: Identity[]
  selectedTab: string
  searchTerm: string
  editIdentity: Identity | null
  searching: boolean
  isModalOpen: boolean
  modalMode: "add" | "edit"
  expandedSections: {
    personal: boolean
    address: boolean
    contact: boolean
    work: boolean
  }
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

const initialState: IdentityState = {
  identities: [],
  selectedTab: "",
  searchTerm: "",
  editIdentity: null,
  searching: false,
  isModalOpen: false,
  modalMode: "add",
  expandedSections: {
    personal: true,
    address: false,
    contact: false,
    work: false,
  },
}

const identitySlice = createSlice({
  name: "identity",
  initialState,
  reducers: {
    addIdentity: (state, action: PayloadAction<Omit<Identity, "id" | "created_at" | "date" | "assigneeColor">>) => {
      const newId = state.identities.length ? Math.max(...state.identities.map((i) => i.id)) + 1 : 1
      const now = new Date()
      const assigneeColor = getColorFromString(action.payload.title)

      const newIdentity: Identity = {
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
        // Ensure vault properties are included if provided
    vaultKey: action.payload.vaultKey || "",
    vaultName: action.payload.vaultName || "",
    vaultIcon: action.payload.vaultIcon || "",
    vaultColor: action.payload.vaultColor || "",
      }

      state.identities.unshift(newIdentity)
    },

    editIdentity: (state, action: PayloadAction<{ id: number; updates: Partial<Identity> }>) => {
      const { id, updates } = action.payload
      const index = state.identities.findIndex((i) => i.id === id)
      if (index !== -1) {
        state.identities[index] = { ...state.identities[index], ...updates }
      }
    },

    deleteIdentity: (state, action: PayloadAction<{ id: number; permanent?: boolean }>) => {
      const { id, permanent } = action.payload
      if (permanent) {
        state.identities = state.identities.filter((identity) => identity.id !== id)
      } else {
        const identity = state.identities.find((i) => i.id === id)
        if (identity) identity.status = "trash"
      }
    },

    restoreIdentity: (state, action: PayloadAction<number>) => {
      const identity = state.identities.find((i) => i.id === action.payload)
      if (identity) identity.status = ""
    },

    toggleComplete: (state, action: PayloadAction<number>) => {
      const identity = state.identities.find((i) => i.id === action.payload)
      if (identity) {
        identity.status = identity.status === "complete" ? "" : "complete"
      }
    },

    toggleImportant: (state, action: PayloadAction<number>) => {
      const identity = state.identities.find((i) => i.id === action.payload)
      if (identity) {
        identity.status = identity.status === "important" ? "" : "important"
      }
    },

    addDynamicField: (state, action: PayloadAction<{ identityId: number; field: DynamicField }>) => {
      const { identityId, field } = action.payload
      const identity = state.identities.find((i) => i.id === identityId)
      if (identity) {
        identity.dynamicFields.push(field)
      }
    },

    updateDynamicField: (state, action: PayloadAction<{ identityId: number; fieldId: string; value: string }>) => {
      const { identityId, fieldId, value } = action.payload
      const identity = state.identities.find((i) => i.id === identityId)
      if (identity) {
        const field = identity.dynamicFields.find((f) => f.id === fieldId)
        if (field) {
          field.value = value
        }
      }
    },

    removeDynamicField: (state, action: PayloadAction<{ identityId: number; fieldId: string }>) => {
      const { identityId, fieldId } = action.payload
      const identity = state.identities.find((i) => i.id === identityId)
      if (identity) {
        identity.dynamicFields = identity.dynamicFields.filter((f) => f.id !== fieldId)
      }
    },

    addAttachment: (state, action: PayloadAction<{ identityId: number; filename: string }>) => {
      const { identityId, filename } = action.payload
      const identity = state.identities.find((i) => i.id === identityId)
      if (identity) {
        identity.attachments.push(filename)
      }
    },

    removeAttachment: (state, action: PayloadAction<{ identityId: number; filename: string }>) => {
      const { identityId, filename } = action.payload
      const identity = state.identities.find((i) => i.id === identityId)
      if (identity) {
        identity.attachments = identity.attachments.filter((a) => a !== filename)
      }
    },

    toggleSection: (state, action: PayloadAction<keyof IdentityState["expandedSections"]>) => {
      const section = action.payload
      state.expandedSections[section] = !state.expandedSections[section]
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },

    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload
    },

    setEditIdentity: (state, action: PayloadAction<Identity | null>) => {
      state.editIdentity = action.payload
    },

    setIdentitiesFromStorage: (state, action: PayloadAction<Identity[]>) => {
      state.identities = action.payload
    },

    setSearchingData: (state, action: PayloadAction<boolean>) => {
      state.searching = action.payload
    },

    // Modal control
    openAddModal: (state) => {
      state.modalMode = "add"
      state.editIdentity = null
      state.isModalOpen = true
      // Reset expanded sections for new identity
      state.expandedSections = {
        personal: true,
        address: false,
        contact: false,
        work: false,
      }
    },

    openEditModal: (state, action: PayloadAction<Identity>) => {
      state.modalMode = "edit"
      state.editIdentity = action.payload
      state.isModalOpen = true
    },

    closeIdentityModal: (state) => {
      state.isModalOpen = false
      state.editIdentity = null
    },

    // Bulk operations
    deleteMultipleIdentities: (state, action: PayloadAction<{ ids: number[]; permanent?: boolean }>) => {
      const { ids, permanent } = action.payload
      if (permanent) {
        state.identities = state.identities.filter((identity) => !ids.includes(identity.id))
      } else {
        ids.forEach((id) => {
          const identity = state.identities.find((i) => i.id === id)
          if (identity) identity.status = "trash"
        })
      }
    },

    restoreMultipleIdentities: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach((id) => {
        const identity = state.identities.find((i) => i.id === id)
        if (identity) identity.status = ""
      })
    },

    // Sort identities
    sortIdentities: (state, action: PayloadAction<"date" | "title" | "name">) => {
      const sortBy = action.payload
      state.identities.sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          case "title":
            return a.title.localeCompare(b.title)
          case "name":
            return a.personalDetails.fullName.localeCompare(b.personalDetails.fullName)
          default:
            return 0
        }
      })
    },
  },
})

export const {
  addIdentity,
  editIdentity,
  deleteIdentity,
  restoreIdentity,
  toggleComplete,
  toggleImportant,
  addDynamicField,
  updateDynamicField,
  removeDynamicField,
  addAttachment,
  removeAttachment,
  toggleSection,
  setSearchTerm,
  setSelectedTab,
  setEditIdentity,
  setIdentitiesFromStorage,
  setSearchingData,
  openAddModal,
  openEditModal,
  closeIdentityModal,
  deleteMultipleIdentities,
  restoreMultipleIdentities,
  sortIdentities,
} = identitySlice.actions

export default identitySlice.reducer
