// import { useState, useRef, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   toggleComplete,
//   toggleImportant,
//   deleteTask,
//   restoreTask,
//   Task,
//   setSelectedTab,
//   openEditModal,
// } from '@/store/Slices/taskSlice';
// import { RootState } from '@/store';
// import { Star, MoreHorizontal, Edit, Trash2, RotateCcw, Pin, ExternalLink } from 'lucide-react';
// import { useLocation } from 'react-router-dom';
// import ViewTaskModal from './ViewTaskModal';
// import { selectCombinedItems } from '@/store/selectors/combinedSelector';
// import { Card, cardToggleComplete, cardToggleImportant, deleteCard, restoreCard } from '@/store/Slices/cardSlice';
// import { deleteIdentity, Identity, identityToggleComplete, identityToggleImportant, restoreIdentity, } from '@/store/Slices/identitySlice';

// const TaskList = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const pathname = location.pathname.replace('/', '');
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { tasks, selectedTab, searchTerm } = useSelector((state: RootState) => state.task);
//   const combinedItems = useSelector(selectCombinedItems);


//   const filteredCombinedItems = combinedItems.filter((item) => {
//     const matchesTab = (() => {
//       switch (selectedTab) {
//         case 'trash':
//           return item.status === 'trash';
//         case 'personal':
//           return item.status === 'complete';
//         case 'pin':
//           return item.status === 'important';
//         case 'card':
//           return item.type === 'card' && item.status !== 'trash';
//         case 'task':
//           return item.type === 'task' && item.status !== 'trash';
//         case 'identity':
//           return item.type === 'identity' && item.status !== 'trash';
//         case 'inbox':
//         case 'taskbox':
//         default:
//           return item.status !== 'trash';
//       }
//     })();

//     const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesTab && (searchTerm === '' || matchesSearch);
//   });


//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);


//   useEffect(() => {
//     dispatch(setSelectedTab(pathname));
//   }, [pathname, dispatch]);

//   const handleToggleImportant = (item) => {
//     if (item.type === 'task') {
//       dispatch(toggleImportant(item.id));
//     } else if (item.type === 'card') {
//       dispatch(cardToggleImportant(item.id));
//     } else if (item.type === 'identity') {
//       dispatch(identityToggleImportant(item.id));
//     }
//   };


//   const handleDelete = (item, permanent = false) => {
//     switch (item.type) {
//       case 'task':
//         dispatch(deleteTask({ id: item.id, permanent }));
//         break;
//       case 'card':
//         dispatch(deleteCard({ id: item.id, permanent }));
//         break;
//       case 'identity':
//         dispatch(deleteIdentity({ id: item.id, permanent }));
//         break;
//       default:
//         console.warn('Unknown item type for deletion:', item.type);
//     }
//   };

//   const handleComplete = (item) => {
//     if (item.type === 'task') {
//       dispatch(toggleComplete(item.id));
//     } else if (item.type === 'card') {
//       dispatch(cardToggleComplete(item.id));
//     } else if (item.type === 'identity') {
//       dispatch(identityToggleComplete(item.id));
//     }
//   };

//   const handleRestoreData = (item) => {
//     if (item.type === 'task') {
//       dispatch(restoreTask(item.id));
//     } else if (item.type === 'card') {
//       dispatch(restoreCard(item.id));
//     } else if (item.type === 'identity') {
//       dispatch(restoreIdentity(item.id));
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-white dark:bg-gray-800">
//       <div className="flex-1 overflow-y-auto pb-20">
//         {filteredCombinedItems.length > 0 ? (
//           <div className="divide-y divide-gray-200 dark:divide-gray-700">
//             {filteredCombinedItems.map((item) => (
//               <div key={`${item.type}-${item.id}`}
//                 className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${item.status === 'complete' ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="mt-1 flex items-center gap-2.5">
//                     <input
//                       type="checkbox"
//                       checked={item.status === 'complete'}
//                       onClick={() => handleComplete(item)}
//                       disabled={selectedTab === 'trash'}
//                       className="h-3 w-3 border border-gray-400 text-blue-600 rounded-sm focus:ring-blue-500 disabled:cursor-not-allowed"
//                     />
//                     <button
//                       onClick={() => handleToggleImportant(item)}
//                       disabled={selectedTab === 'trash'}
//                       title="Toggle Important"
//                     >
//                       <Pin
//                         className={`w-4 h-4 stroke-[1.25] ${item.status === 'important'
//                           ? 'fill-gray-900 text-gray-500'
//                           : 'text-gray-400 fill-none stroke-gray-400'
//                           }`}
//                       />
//                     </button>
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="cursor-pointer" onClick={() => {
//                       setSelectedTask(item);
//                       setIsModalOpen(true);
//                     }}>
//                       <h3
//                         className={`font-semibold text-gray-900 dark:text-white mb-1 ${item.status === 'complete' ? 'line-through text-gray-500' : ''}`}
//                       >
//                         {item.title}
//                       </h3>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 relative" ref={menuRef}>
//                     <button
//                       onClick={() => setOpenMenuId((prevId) => (prevId === item.id ? null : item.id))}
//                       className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//                     >
//                       <MoreHorizontal className="w-5 h-5" />
//                     </button>
//                     {openMenuId === item.id && (
//                       <div className="absolute right-0 mt-24 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
//                         {selectedTab !== 'trash' ? (
//                           <div className="flex flex-col">
//                             <button
//                               onMouseDown={(e) => {
//                                 e.preventDefault();
//                                 e.stopPropagation();
//                                 dispatch(openEditModal(item));
//                                 setOpenMenuId(null);
//                               }}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                             >
//                               <ExternalLink className="w-4 h-4" />
//                               Share
//                             </button>
//                             <button
//                               onMouseDown={(e) => {
//                                 e.preventDefault();
//                                 e.stopPropagation();
//                                 dispatch(openEditModal(item));
//                                 setOpenMenuId(null);
//                               }}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                             >
//                               <Edit className="w-4 h-4" />
//                               Edit
//                             </button>
//                             <button
//                               onMouseDown={(e) => {
//                                 e.preventDefault();
//                                 e.stopPropagation();
//                                 handleDelete(item);
//                                 setOpenMenuId(null);
//                               }}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                               Delete
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="flex flex-col">
//                             <button
//                               onMouseDown={(e) => {
//                                 e.preventDefault();
//                                 e.stopPropagation();
//                                 handleRestoreData(item);
//                                 setOpenMenuId(null);
//                               }}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                             >
//                               <RotateCcw className="w-4 h-4" />
//                               Restore
//                             </button>
//                             <button
//                               onMouseDown={(e) => {
//                                 e.preventDefault();
//                                 e.stopPropagation();
//                                 dispatch(deleteTask({ id: item.id, permanent: true }));
//                                 setOpenMenuId(null);
//                               }}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                               Delete Permanently
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
//             <div className="text-center text-gray-500 dark:text-gray-400">
//               <div className="text-6xl mb-4 opacity-50">🔐</div>
//               <h3 className="text-lg font-medium mb-2">No Password found</h3>
//             </div>
//           </div>
//         )}
//       </div>
//       <ViewTaskModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         task={selectedTask}
//       />
//     </div>
//   );
// };

// export default TaskList;



"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  toggleComplete,
  toggleImportant,
  deleteTask,
  restoreTask,
  type Task,
  setSelectedTab,
  openEditModal,
} from "@/store/Slices/taskSlice"
import type { RootState } from "@/store"
import { MoreHorizontal, Edit, Trash2, RotateCcw, Pin, ExternalLink } from "lucide-react"
import { useLocation } from "react-router-dom"
import ViewTaskModal from "./ViewTaskModal"
import { selectCombinedItems } from "@/store/selectors/combinedSelector"
import {
  toggleComplete as cardToggleComplete,
  toggleImportant as cardToggleImportant,
  deleteCard,
  restoreCard,
  openEditModal as openCardEditModal,
  Card,
} from "@/store/Slices/cardSlice"
import {
  deleteIdentity,
  toggleComplete as identityToggleComplete,
  toggleImportant as identityToggleImportant,
  restoreIdentity,
  openEditModal as openIdentityEditModal,
  Identity,
} from "@/store/Slices/identitySlice"
import ViewCardModal from "./ViewCardModal"
import ViewIdentityModal from "./ViewIdentityModal"

const TaskList = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const pathname = location.pathname.replace("/", "")
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
 const [selectedItem, setSelectedItem] = useState<Task | Card | Identity | null>(null);
  const { tasks, selectedTab, searchTerm } = useSelector((state: RootState) => state.task)
  const combinedItems = useSelector(selectCombinedItems)

  const filteredCombinedItems = combinedItems.filter((item) => {
    const matchesTab = (() => {
      switch (selectedTab) {
        case "trash":
          return item.status === "trash"
        case "personal":
          return item.status === "complete"
        case "pin":
          return item.status === "important"
        case "card":
          return item.type === "card" && item.status !== "trash"
        case "task":
          return item.type === "task" && item.status !== "trash"
        case "identity":
          return item.type === "identity" && item.status !== "trash"
        case "inbox":
        case "taskbox":
        default:
          return item.status !== "trash"
      }
    })()

    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && (searchTerm === "" || matchesSearch)
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    dispatch(setSelectedTab(pathname))
  }, [pathname, dispatch])

  const handleToggleImportant = (item) => {
    if (item.type === "task") {
      dispatch(toggleImportant(item.id))
    } else if (item.type === "card") {
      dispatch(cardToggleImportant(item.id))
    } else if (item.type === "identity") {
      dispatch(identityToggleImportant(item.id))
    }
  }

  const handleDelete = (item, permanent = false) => {
    switch (item.type) {
      case "task":
        dispatch(deleteTask({ id: item.id, permanent }))
        break
      case "card":
        dispatch(deleteCard({ id: item.id, permanent }))
        break
      case "identity":
        dispatch(deleteIdentity({ id: item.id, permanent }))
        break
      default:
        console.warn("Unknown item type for deletion:", item.type)
    }
  }

  const handleComplete = (item) => {
    if (item.type === "task") {
      dispatch(toggleComplete(item.id))
    } else if (item.type === "card") {
      dispatch(cardToggleComplete(item.id))
    } else if (item.type === "identity") {
      dispatch(identityToggleComplete(item.id))
    }
  }

  const handleRestoreData = (item) => {
    if (item.type === "task") {
      dispatch(restoreTask(item.id))
    } else if (item.type === "card") {
      dispatch(restoreCard(item.id))
    } else if (item.type === "identity") {
      dispatch(restoreIdentity(item.id))
    }
  }

  const handleEdit = (item) => {
    switch (item.type) {
      case "task":
        dispatch(openEditModal(item))
        break
      case "card":
        dispatch(openCardEditModal(item))
        break
      case "identity":
        dispatch(openIdentityEditModal(item))
        break
      default:
        console.warn("Unknown item type for editing:", item.type)
    }
  }

  const handlePermanentDelete = (item) => {
    switch (item.type) {
      case "task":
        dispatch(deleteTask({ id: item.id, permanent: true }))
        break
      case "card":
        dispatch(deleteCard({ id: item.id, permanent: true }))
        break
      case "identity":
        dispatch(deleteIdentity({ id: item.id, permanent: true }))
        break
      default:
        console.warn("Unknown item type for permanent deletion:", item.type)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto pb-20">
        {filteredCombinedItems.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCombinedItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  item.status === "complete" ? "bg-gray-50 dark:bg-gray-800" : ""
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
                        className={`w-4 h-4 stroke-[1.25] ${
                          item.status === "important"
                            ? "fill-gray-900 text-gray-500"
                            : "text-gray-400 fill-none stroke-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedItem(item)
                        setIsModalOpen(true)
                      }}
                    >
                      <h3
                        className={`font-semibold text-gray-900 dark:text-white mb-1 ${
                          item.status === "complete" ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {item.title}
                      </h3>

                      {/* Show item type badge */}
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === "task"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : item.type === "card"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          }`}
                        >
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 relative" ref={menuRef}>
                    <button
                      onClick={() => setOpenMenuId((prevId) => (prevId === item.id ? null : item.id))}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openMenuId === item.id && (
                      <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {selectedTab !== "trash" ? (
                          <div className="py-1">
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Handle share functionality here
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Share
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleEdit(item)
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDelete(item)
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="py-1">
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRestoreData(item)
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Restore
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handlePermanentDelete(item)
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Permanently
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
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
        )}
      </div>

            {selectedItem?.type === 'task' && (
  <ViewTaskModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    task={selectedItem}
  />
)}
{selectedItem?.type === 'card' && (
  <ViewCardModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    card={selectedItem}
  />
)}
{selectedItem?.type === 'identity' && (
  <ViewIdentityModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    identity={selectedItem}
  />
)}
    </div>
  )
}

export default TaskList
