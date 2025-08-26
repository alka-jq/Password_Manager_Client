
"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import {
  toggleComplete,
  toggleImportant,
  deleteTask,
  restoreTask,
  setSelectedTab,
  openEditModal,
  type Task,
} from "@/store/Slices/taskSlice"
import {
  toggleComplete as cardToggleComplete,
  toggleImportant as cardToggleImportant,
  deleteCard,
  restoreCard,
  openEditModal as openCardEditModal,
  Card,
} from "@/store/Slices/cardSlice"
import {
  toggleComplete as identityToggleComplete,
  toggleImportant as identityToggleImportant,
  deleteIdentity,
  restoreIdentity,
  openEditModal as openIdentityEditModal,
  Identity,
} from "@/store/Slices/identitySlice"
import ViewTaskModal from "./ViewTaskModal"
import ViewCardModal from "./ViewCardModal"
import ViewIdentityModal from "./ViewIdentityModal"
import { selectCombinedItems } from "@/store/selectors/combinedSelector"
import type { RootState } from "@/store"
import { MoreHorizontal, Edit, Trash2, RotateCcw, Pin } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CiShare1 } from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi"
import FilterDropdown from "./FilterDropdown"



const ITEMS_PER_PAGE = 7

const TaskList = () => {


  const dispatch = useDispatch()
  const location = useLocation()
  const pathname = location.pathname.replace("/", "")

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  // const menuRef = useRef<HTMLDivElement>(null)
  const [selectedItem, setSelectedItem] = useState<Task | Card | Identity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterKeyword, setFilterKeyword] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  const { selectedTab, searchTerm } = useSelector((state: RootState) => state.task)
  const combinedItems = useSelector(selectCombinedItems)

  useEffect(() => {
    dispatch(setSelectedTab(pathname))
  }, [pathname, dispatch])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      //   setOpenMenuId(null)
      // }
      const path = e.composedPath?.() || []
      const isInsideDropdown = path.some((el: any) => el?.dataset?.dropdown === "menu")
      if (!isInsideDropdown) {
        setOpenMenuId(null)
      }

    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredCombinedItems = combinedItems.filter((item) => {
    const matchesTab = (() => {
      switch (selectedTab) {
        case "trash": return item.status === "trash"
        case "personal": return item.status === "complete"
        case "pin": return item.status === "important"
        case "card": return item.type === "card" && item.status !== "trash"
        case "task": return item.type === "task" && item.status !== "trash"
        case "identity": return item.type === "identity" && item.status !== "trash"
        default: return item.status !== "trash"
      }
    })()

    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    const matchesKeyword = filterKeyword === "" || item.title.toLowerCase().includes(filterKeyword.toLowerCase().trim())
    const matchesType = typeFilter === "" || item.type === typeFilter

    return matchesTab && matchesSearch && matchesKeyword && matchesType
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [filterKeyword, searchTerm, selectedTab, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredCombinedItems.length / ITEMS_PER_PAGE))
  const paginatedItems = filteredCombinedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleComplete = (item: any) => {
    if (item.type === "task") dispatch(toggleComplete(item.id))
    else if (item.type === "card") dispatch(cardToggleComplete(item.id))
    else if (item.type === "identity") dispatch(identityToggleComplete(item.id))
  }

  const handleToggleImportant = (item: any) => {
    if (item.type === "task") dispatch(toggleImportant(item.id))
    else if (item.type === "card") dispatch(cardToggleImportant(item.id))
    else if (item.type === "identity") dispatch(identityToggleImportant(item.id))
  }

  const handleDelete = (item: any, permanent = false) => {
    if (item.type === "task") dispatch(deleteTask({ id: item.id, permanent }))
    else if (item.type === "card") dispatch(deleteCard({ id: item.id, permanent }))
    else if (item.type === "identity") dispatch(deleteIdentity({ id: item.id, permanent }))
  }

  const handleRestore = (item: any) => {
    if (item.type === "task") dispatch(restoreTask(item.id))
    else if (item.type === "card") dispatch(restoreCard(item.id))
    else if (item.type === "identity") dispatch(restoreIdentity(item.id))
  }

  const handleEdit = (item: any) => {
    console.log(item, "item.id")
    if (item.type === "task") dispatch(openEditModal(item))
    else if (item.type === "card") dispatch(openCardEditModal(item))
    else if (item.type === "identity") dispatch(openIdentityEditModal(item))
  }

 


  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Filter + Pagination Controls */}
      <div className="flex justify-between items-center gap-4 px-4 py-2 border-b border-gray-200 dark:border-gray-700">

        {/* Type Filter */}
       <FilterDropdown typeFilter={typeFilter} setTypeFilter={setTypeFilter} />




        {/* Pagination */}
        {filteredCombinedItems.length > ITEMS_PER_PAGE && (
          <div className="flex items-center space-x-2 ml-auto">

            <span className="text-sm text-gray-600 dark:text-gray-300">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 dark:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>



            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 dark:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        )}
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto">
        {paginatedItems.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${item.status === "complete" ? "bg-gray-50 dark:bg-gray-800" : ""
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={item.status === "complete"}
                      onClick={() => handleComplete(item)}
                      disabled={selectedTab === "trash"}
                      className="h-3 w-3 border border-gray-400 text-blue-600 rounded-sm focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={() => handleToggleImportant(item)}
                      disabled={selectedTab === "trash"}
                      title="Toggle Important"
                    >
                      <Pin
                        className={`w-4 h-4 stroke-[1.25] ${item.status === "important"
                          ? "fill-gray-900 text-gray-500"
                          : "text-gray-400 fill-none stroke-gray-400"
                          }`}
                      />
                    </button>
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      setSelectedItem(item)
                      setIsModalOpen(true)
                    }}
                  >
                    <h3
                      className={`font-semibold text-gray-900 dark:text-white mb-1 
                        }`}
                    >
                      {item.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.type === "task"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : item.type === "card"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        }`}
                    >
                      {item.type === "task" ? "login" : item.type}
                    </span>
                  </div>
                  <div className="relative" >
                    <button
                      onClick={() =>
                        setOpenMenuId((prev) =>
                          prev === `${item.type}-${item.id}` ? null : `${item.type}-${item.id}`
                        )
                      }

                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openMenuId === `${item.type}-${item.id}` && (
                      <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30" data-dropdown="menu">
                        {selectedTab !== "trash" ? (
                          <>
                            <button
                              onClick={() => {
                                handleEdit(item)
                                setOpenMenuId(null)
                              }}
                              className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                            >
                              <Edit className="w-4 h-4" /> Edit
                            </button>
                             <button
                              onClick={() => {
                                // handleEdit(item)
                                // setOpenMenuId(null)
                              }}
                              className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                            >
                              <FiUserPlus  className="w-4 h-4" /> Share
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(item)
                                setOpenMenuId(null)
                              }}
                              className="w-full flex gap-2 items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 text-left"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                handleRestore(item)
                                setOpenMenuId(null)
                              }}
                              className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                            >
                              <RotateCcw className="w-4 h-4" /> Restore
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(item, true)
                                setOpenMenuId(null)
                              }}
                              className="w-full flex gap-2 items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 text-left"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Permanently
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full  text-center text-gray-500 dark:text-gray-400">
            <div>
              {/* <div className="text-6xl mb-2">🔐</div>
              <div className="font-medium">No items found</div> */}

              {/* <div className="text-sm">
                {selectedTab === "trash"
                  ? "Your trash is empty"
                  : `No ${selectedTab === "card"
                    ? "cards"
                    : selectedTab === "identity"
                      ? "identities"
                      : selectedTab === "task"
                        ? "logins"
                        : "items"
                  } found`}
              </div> */}

              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4 opacity-50">🔐</div>
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-sm">
                  {selectedTab === "trash"
                    ? "Your trash is empty"
                    : `No ${selectedTab === "card" ? "cards" : selectedTab === "identity" ? "identities" : "items"} found`}
                </p>
              </div>
            </div>
          </div>
          // </div>
        )}
      </div>

      {/* View Modals */}
      {selectedItem?.type === "task" && (
        <ViewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={selectedItem} />
      )}
      {selectedItem?.type === "card" && (
        <ViewCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} card={selectedItem} />
      )}
      {selectedItem?.type === "identity" && (
        <ViewIdentityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} identity={selectedItem} />
      )}

      {/* {editItem?.type === "task" && (
        <TaskModalUIOnly
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={editItem}
        />
      )}
      {editItem?.type === "card" && (
        <CardModalUIOnly
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          card={editItem}
        />
      )}
      {editItem?.type === "identity" && (
        <IdentityModalUIOnly
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          identity={editItem}
        />
      )} */}

    </div>
  )
}

export default TaskList


