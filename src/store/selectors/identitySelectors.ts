import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../index"
import type { Identity } from "../Slices/identitySlice"

// Basic selectors
export const selectIdentities = (state: RootState) => state.identity.identities
export const selectIdentitySearchTerm = (state: RootState) => state.identity.searchTerm
export const selectIdentitySelectedTab = (state: RootState) => state.identity.selectedTab
export const selectIdentityEditIdentity = (state: RootState) => state.identity.editIdentity
export const selectIdentitySearching = (state: RootState) => state.identity.searching
export const selectIdentityModalOpen = (state: RootState) => state.identity.isModalOpen
export const selectIdentityModalMode = (state: RootState) => state.identity.modalMode
export const selectExpandedSections = (state: RootState) => state.identity.expandedSections

// Filtered identities selectors
export const selectActiveIdentities = createSelector([selectIdentities], (identities) =>
  identities.filter((identity) => identity.status !== "trash"),
)

export const selectTrashIdentities = createSelector([selectIdentities], (identities) =>
  identities.filter((identity) => identity.status === "trash"),
)

export const selectImportantIdentities = createSelector([selectIdentities], (identities) =>
  identities.filter((identity) => identity.status === "important"),
)

export const selectCompletedIdentities = createSelector([selectIdentities], (identities) =>
  identities.filter((identity) => identity.status === "complete"),
)

// Search functionality
export const selectFilteredIdentities = createSelector(
  [selectIdentities, selectIdentitySearchTerm, selectIdentitySelectedTab],
  (identities, searchTerm, selectedTab) => {
    let filteredIdentities = identities

    // Filter by tab/status
    switch (selectedTab) {
      case "inbox":
      case "all_items":
        filteredIdentities = identities.filter((identity) => identity.status !== "trash")
        break
      case "important":
        filteredIdentities = identities.filter((identity) => identity.status === "important")
        break
      case "completed":
      case "done":
        filteredIdentities = identities.filter((identity) => identity.status === "complete")
        break
      case "trash":
        filteredIdentities = identities.filter((identity) => identity.status === "trash")
        break
      case "personal":
        filteredIdentities = identities.filter((identity) => identity.status !== "trash")
        break
      default:
        filteredIdentities = identities.filter((identity) => identity.status !== "trash")
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filteredIdentities = filteredIdentities.filter(
        (identity) =>
          identity.title.toLowerCase().includes(searchLower) ||
          identity.personalDetails.fullName.toLowerCase().includes(searchLower) ||
          identity.personalDetails.email.toLowerCase().includes(searchLower) ||
          identity.addressDetails.organization.toLowerCase().includes(searchLower) ||
          identity.workDetails.company.toLowerCase().includes(searchLower) ||
          identity.note.toLowerCase().includes(searchLower) ||
          identity.dynamicFields.some((field) => field.value.toLowerCase().includes(searchLower)),
      )
    }

    return filteredIdentities
  },
)

// Identity counts by tab
export const getIdentityCountsByTab = createSelector([selectIdentities], (identities) => {
  const counts = {
    inbox: 0,
    all_items: 0,
    important: 0,
    completed: 0,
    done: 0,
    trash: 0,
    personal: 0,
    total: identities.length,
  }

  identities.forEach((identity) => {
    switch (identity.status) {
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

// Identity statistics
export const selectIdentityStatistics = createSelector([selectIdentities], (identities) => {
  const stats = {
    total: identities.length,
    active: 0,
    completed: 0,
    important: 0,
    trash: 0,
    withAttachments: 0,
    withDynamicFields: 0,
    withWorkDetails: 0,
    withContactDetails: 0,
  }

  identities.forEach((identity) => {
    // Status counts
    switch (identity.status) {
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
    if (identity.attachments.length > 0) {
      stats.withAttachments++
    }

    if (identity.dynamicFields.length > 0) {
      stats.withDynamicFields++
    }

    if (identity.workDetails.company || identity.workDetails.jobTitle) {
      stats.withWorkDetails++
    }

    if (identity.contactDetails.homePhone || identity.contactDetails.workPhone) {
      stats.withContactDetails++
    }
  })

  return stats
})

// Get identities by priority
export const selectIdentitiesByPriority = createSelector([selectIdentities], (identities) => {
  return {
    high: identities.filter((identity) => identity.priority === "high"),
    medium: identities.filter((identity) => identity.priority === "medium"),
    low: identities.filter((identity) => identity.priority === "low"),
  }
})

// Get recent identities
export const selectRecentIdentities = createSelector([selectIdentities], (identities) => {
  return identities
    .filter((identity) => identity.status !== "trash")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

// Get identity by ID
export const selectIdentityById = createSelector(
  [selectIdentities, (_: RootState, identityId: number) => identityId],
  (identities, identityId) => identities.find((identity) => identity.id === identityId),
)

// Get identities with attachments
export const selectIdentitiesWithAttachments = createSelector([selectIdentities], (identities) =>
  identities.filter((identity) => identity.attachments.length > 0 && identity.status !== "trash"),
)

// Get identities by organization
export const selectIdentitiesByOrganization = createSelector([selectIdentities], (identities) => {
  const organizations: Record<string, Identity[]> = {}

  identities.forEach((identity) => {
    if (identity.status === "trash") return

    const org = identity.addressDetails.organization || "No Organization"
    if (!organizations[org]) {
      organizations[org] = []
    }
    organizations[org].push(identity)
  })

  return organizations
})

// Export all selectors
export default {
  selectIdentities,
  selectIdentitySearchTerm,
  selectIdentitySelectedTab,
  selectIdentityEditIdentity,
  selectIdentitySearching,
  selectIdentityModalOpen,
  selectIdentityModalMode,
  selectExpandedSections,
  selectActiveIdentities,
  selectTrashIdentities,
  selectImportantIdentities,
  selectCompletedIdentities,
  selectFilteredIdentities,
  getIdentityCountsByTab,
  selectIdentityStatistics,
  selectIdentitiesByPriority,
  selectRecentIdentities,
  selectIdentityById,
  selectIdentitiesWithAttachments,
  selectIdentitiesByOrganization,
}
