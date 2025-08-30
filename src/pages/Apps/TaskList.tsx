'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toggleComplete, toggleImportant, deleteTask, restoreTask, setSelectedTab, openEditModal, type Task } from '@/store/Slices/taskSlice';
import { toggleComplete as cardToggleComplete, toggleImportant as cardToggleImportant, deleteCard, restoreCard, openEditModal as openCardEditModal, Card } from '@/store/Slices/cardSlice';
import {
    toggleComplete as identityToggleComplete,
    toggleImportant as identityToggleImportant,
    deleteIdentity,
    restoreIdentity,
    openEditModal as openIdentityEditModal,
    Identity,
} from '@/store/Slices/identitySlice';
import ViewTaskModal from './ViewTaskModal';
import ViewCardModal from './ViewCardModal';
import ViewIdentityModal from './ViewIdentityModal';
import { selectCombinedItems } from '@/store/selectors/combinedSelector';
import type { RootState } from '@/store';
import { MoreHorizontal, Edit, Trash2, RotateCcw, CheckCircle, XCircle, Pin, Eye, PinOff } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FiUserPlus } from 'react-icons/fi';
import FilterDropdown from './FilterDropdown';
import CompleteConfirmModal from './CompleteConfirmModal';
import ShareModal from './ShareModal';
import DeleteModals from './DeleteModal';
import PermanentDeleteConfirmationModal from './PermanentDeleteConfirmationModal';

const ITEMS_PER_PAGE = 7;

const TaskList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const pathname = location.pathname.replace('/', '');

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Task | Card | Identity | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterKeyword, setFilterKeyword] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({
        isOpen: false,
        items: [],
        permanent: false,
        bulk: false,
    });
    const [shareModal, setShareModal] = useState({
        isOpen: false,
        item: null as Task | Card | Identity | null,
    });
    const [permanentDeleteModal, setPermanentDeleteModal] = useState({
        isOpen: false,
        items: [],
    });
    const [moveToModal, setMoveToModal] = useState({
        isOpen: false,
        items: [],
    });
    const [completeConfirmModal, setCompleteConfirmModal] = useState({
        isOpen: false,
        item: null as Task | Card | Identity | null,
        type: 'complete' as 'complete' | 'uncomplete',
    });
    const { selectedTab, searchTerm } = useSelector((state: RootState) => state.task);
    const combinedItems = useSelector(selectCombinedItems);

    useEffect(() => {
        dispatch(setSelectedTab(pathname));
    }, [pathname, dispatch]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const path = e.composedPath?.() || [];
            const isInsideDropdown = path.some((el: any) => el?.dataset?.dropdown === 'menu');
            if (!isInsideDropdown) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCombinedItems = combinedItems.filter((item) => {
        const matchesTab = (() => {
            switch (selectedTab) {
                case 'trash':
                    return item.status === 'trash';
                case 'personal':
                    return item.status === 'complete';
                case 'pin':
                    return item.status === 'important';
                case 'card':
                    return item.type === 'card' && item.status !== 'trash';
                case 'task':
                    return item.type === 'task' && item.status !== 'trash';
                case 'identity':
                    return item.type === 'identity' && item.status !== 'trash';
                default:
                    return item.status !== 'trash' && item.status !== 'complete'; // Don't show pinned items in "All items"
            }
        })();

        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
        const matchesKeyword = filterKeyword === '' || item.title.toLowerCase().includes(filterKeyword.toLowerCase().trim());
        const matchesType = typeFilter === '' || item.type === typeFilter;

        return matchesTab && matchesSearch && matchesKeyword && matchesType;
    });

    useEffect(() => {
        setCurrentPage(1);
        setSelectedItems(new Set()); // Clear selection when filters change
    }, [filterKeyword, searchTerm, selectedTab, typeFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredCombinedItems.length / ITEMS_PER_PAGE));
    const paginatedItems = filteredCombinedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Select all items on current page
    const toggleSelectAll = () => {
        if (selectedItems.size === paginatedItems.length) {
            setSelectedItems(new Set());
        } else {
            const newSelected = new Set(selectedItems);
            paginatedItems.forEach((item) => {
                newSelected.add(`${item.type}-${item.id}`);
            });
            setSelectedItems(newSelected);
        }
    };

    // Toggle individual item selection
    const toggleItemSelection = (itemId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    // Get selected items data
    const getSelectedItemsData = () => {
        return filteredCombinedItems.filter((item) => selectedItems.has(`${item.type}-${item.id}`));
    };

    // Handle bulk actions
    const handleBulkDelete = (permanent = false) => {
        const itemsToDelete = getSelectedItemsData();
        if (permanent) {
            setPermanentDeleteModal({ isOpen: true, items: itemsToDelete });
        } else {
            setDeleteConfirmModal({ isOpen: true, items: itemsToDelete, permanent: false, bulk: true });
        }
    };

    const handleBulkRestore = () => {
        const itemsToRestore = getSelectedItemsData();
        itemsToRestore.forEach((item) => {
            if (item.type === 'task') dispatch(restoreTask(item.id));
            else if (item.type === 'card') dispatch(restoreCard(item.id));
            else if (item.type === 'identity') dispatch(restoreIdentity(item.id));
        });
        setSelectedItems(new Set());
    };

    const handleBulkToggleImportant = () => {
        const itemsToToggle = getSelectedItemsData();
        itemsToToggle.forEach((item) => {
            if (item.type === 'task') dispatch(toggleImportant(item.id));
            else if (item.type === 'card') dispatch(cardToggleImportant(item.id));
            else if (item.type === 'identity') dispatch(identityToggleImportant(item.id));
        });
        setSelectedItems(new Set());
    };

    const handleBulkMove = (destination: string) => {
        // This would need implementation based on your data structure
        // For now, just close the modal
        setMoveToModal({ isOpen: false, items: [] });
    };

    const handleComplete = (item: any) => {
        if (item.type === 'task') dispatch(toggleComplete(item.id));
        else if (item.type === 'card') dispatch(cardToggleComplete(item.id));
        else if (item.type === 'identity') dispatch(identityToggleComplete(item.id));
        setOpenMenuId(null);
    };

    const handleToggleImportant = (item: any) => {
        if (item.type === 'task') dispatch(toggleImportant(item.id));
        else if (item.type === 'card') dispatch(cardToggleImportant(item.id));
        else if (item.type === 'identity') dispatch(identityToggleImportant(item.id));
    };

    const handleDelete = (items: any[], permanent = false) => {
        items.forEach((item) => {
            if (item.type === 'task') dispatch(deleteTask({ id: item.id, permanent }));
            else if (item.type === 'card') dispatch(deleteCard({ id: item.id, permanent }));
            else if (item.type === 'identity') dispatch(deleteIdentity({ id: item.id, permanent }));
        });
        setDeleteConfirmModal({ isOpen: false, items: [], permanent: false, bulk: false });
        setPermanentDeleteModal({ isOpen: false, items: [] });
        setSelectedItems(new Set());
    };

    const handleRestore = (item: any) => {
        if (item.type === 'task') dispatch(restoreTask(item.id));
        else if (item.type === 'card') dispatch(restoreCard(item.id));
        else if (item.type === 'identity') dispatch(restoreIdentity(item.id));
    };

    const handleEdit = (item: any) => {
        if (item.type === 'task') dispatch(openEditModal(item));
        else if (item.type === 'card') dispatch(openCardEditModal(item));
        else if (item.type === 'identity') dispatch(openIdentityEditModal(item));
    };

    const openDeleteConfirm = (item: any, permanent = false) => {
        if (permanent) {
            setPermanentDeleteModal({ isOpen: true, items: [item] });
        } else {
            setDeleteConfirmModal({ isOpen: true, items: [item], permanent: false, bulk: false });
        }
        setOpenMenuId(null);
    };

    // Check if all items on current page are selected
    const allSelected = paginatedItems.length > 0 && paginatedItems.every((item) => selectedItems.has(`${item.type}-${item.id}`));

    // Check if some items are selected
    const hasSelectedItems = selectedItems.size > 0;

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {/* Filter + Pagination Controls - Hidden when items are selected */}
            {!hasSelectedItems && (
                <div className="flex justify-between items-center gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
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
                                className="p-2 border rounded-md disabled:opacity-50 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border rounded-md disabled:opacity-50 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Item List Header - Modified when items are selected */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                <div className="col-span-1 flex items-center">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 border border-gray-300 text-blue-600 rounded-sm focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                </div>

                {hasSelectedItems ? (
                    <>
                        <div className="col-span-8 flex items-center">
                            <span className="text-sm font-normal text-gray-700 dark:text-gray-300">Select {paginatedItems.length} items</span>
                        </div>
                        <div className="col-span-3 flex justify-end items-center space-x-3">
                            {/* Different buttons based on current tab */}
                            {selectedTab !== 'trash' ? (
                                <>
                                    <button
                                        onClick={() => handleBulkDelete(false)}
                                        className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                        title="Move to trash"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {selectedTab !== 'pin' ? (
                                        <button
                                            onClick={handleBulkToggleImportant}
                                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                            title="Pin items"
                                        >
                                            <Pin className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleBulkToggleImportant}
                                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                            title="Unpin items"
                                        >
                                            <PinOff className="w-4 h-4" />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleBulkDelete(true)}
                                        className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                        title="Delete permanently"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={handleBulkRestore}
                                        className="p-1.5 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                        title="Restore items"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-span-1">PIN</div>
                        <div className="col-span-6">TITLE</div>
                        <div className="col-span-2">TYPE</div>
                        <div className="col-span-2 text-right">ACTIONS</div>
                    </>
                )}
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto">
                {paginatedItems.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedItems.map((item) => {
                            const itemId = `${item.type}-${item.id}`;
                            const isSelected = selectedItems.has(itemId);
                            const isPinned = item.status === 'important';

                            return (
                                <div
                                    key={itemId}
                                    className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${
                                        item.status === 'complete' ? 'bg-gray-50 dark:bg-gray-800' : ''
                                    }`}
                                >
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Selection checkbox */}
                                        <div className="col-span-1 flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleItemSelection(itemId)}
                                                className="h-4 w-4 border border-gray-300 text-blue-600 rounded-sm focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                            />
                                        </div>

                                        {/* Pin button */}
                                        <div className="col-span-1 flex items-center">
                                            <button
                                                onClick={() => handleToggleImportant(item)}
                                                className={`p-1.5 rounded-full ${
                                                    isPinned
                                                        ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                                title={isPinned ? 'Unpin item' : 'Pin item'}
                                            >
                                                {isPinned ? <Pin className="w-4 h-4 fill-current" /> : <Pin className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Title */}
                                        <div className="col-span-6">
                                            <div className="group">
                                                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                    {item.title}
                                                </h3>
                                                {item.description && <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{item.description}</p>}
                                            </div>
                                        </div>

                                        {/* Type Badge */}
                                        <div className="col-span-2">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.type === 'task'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        : item.type === 'card'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                }`}
                                            >
                                                {item.type === 'task' ? 'login' : item.type}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 flex justify-end items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedItem(item);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                                                title="View details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId((prev) => (prev === itemId ? null : itemId))}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>

                                                {openMenuId === itemId && (
                                                    <div
                                                        className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30 py-1"
                                                        data-dropdown="menu"
                                                    >
                                                        {selectedTab !== 'trash' ? (
                                                            <>
                                                                {/* For Personal tab (completed items), show only Incomplete and Delete */}
                                                                {selectedTab === 'personal' ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setCompleteConfirmModal({ isOpen: true, item, type: 'uncomplete' })}
                                                                            className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                                                                        >
                                                                            <XCircle className="w-4 h-4" /> Incomplete
                                                                        </button>
                                                                        <button
                                                                            onClick={() => openDeleteConfirm(item, false)}
                                                                            className="w-full flex gap-2 items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" /> Delete
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {/* For other tabs, show all options */}
                                                                        <button
                                                                            onClick={() => {
                                                                                handleEdit(item);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                                                                        >
                                                                            <Edit className="w-4 h-4" /> Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setShareModal({ isOpen: true, item })}
                                                                            className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                                                                        >
                                                                            <FiUserPlus className="w-4 h-4" /> Share
                                                                        </button>
                                                                        {item.status !== 'complete' && (
                                                                            <button
                                                                                onClick={() => setCompleteConfirmModal({ isOpen: true, item, type: 'complete' })}
                                                                                className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                                                                            >
                                                                                <CheckCircle className="w-4 h-4" /> Complete
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => openDeleteConfirm(item, false)}
                                                                            className="w-full flex gap-2 items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" /> Delete
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        handleRestore(item);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                                                                >
                                                                    <RotateCcw className="w-4 h-4" /> Restore
                                                                </button>
                                                                <button
                                                                    onClick={() => openDeleteConfirm(item, true)}
                                                                    className="w-full flex gap-2 items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
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
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4 opacity-20">🔐</div>
                            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-300 mb-2">No items found</h3>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                {selectedTab === 'trash'
                                    ? 'Your trash is empty'
                                    : `No ${selectedTab === 'card' ? 'cards' : selectedTab === 'identity' ? 'identities' : selectedTab === 'task' ? 'logins' : 'items'} found`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModals
                isOpen={deleteConfirmModal.isOpen}
                onClose={() => setDeleteConfirmModal({ isOpen: false, items: [], permanent: false, bulk: false })}
                onConfirm={() => handleDelete(deleteConfirmModal.items, deleteConfirmModal.permanent)}
                itemType={deleteConfirmModal.items[0]?.type}
                bulk={deleteConfirmModal.bulk}
            />

            {/* Complete Confirmation Modal */}
            <CompleteConfirmModal
                isOpen={completeConfirmModal.isOpen}
                onClose={() => setCompleteConfirmModal({ ...completeConfirmModal, isOpen: false })}
                type={completeConfirmModal.type}
                onConfirm={() => {
                    if (completeConfirmModal.item) {
                        handleComplete(completeConfirmModal.item);
                    }
                    setCompleteConfirmModal({ ...completeConfirmModal, isOpen: false });
                }}
            />

            {/* Permanent Delete Confirmation Modal */}
            <PermanentDeleteConfirmationModal
                isOpen={permanentDeleteModal.isOpen}
                onClose={() => setPermanentDeleteModal({ isOpen: false, items: [] })}
                onConfirm={() => handleDelete(permanentDeleteModal.items, true)}
                itemCount={permanentDeleteModal.items.length}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ ...shareModal, isOpen: false })}
                onShare={(email) => {
                    if (shareModal.item) {
                        console.log(`Sharing ${shareModal.item.title} with ${email}`);
                        // TODO: Add your real share logic here (e.g., send email via API)
                    }
                }}
            />

            {/* View Modals */}
            {isModalOpen && selectedItem && (
                <>
                    {selectedItem.type === 'task' && (
                        <ViewTaskModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            task={selectedItem as Task}
                            selectedTab={''}
                            setSelectedTab={function (key: string): void {
                                throw new Error('Function not implemented.');
                            }}
                        />
                    )}
                    {selectedItem.type === 'card' && (
                        <ViewCardModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            card={selectedItem as Card}
                            selectedTab={''}
                            setSelectedTab={function (key: string): void {
                                throw new Error('Function not implemented.');
                            }}
                        />
                    )}
                    {selectedItem.type === 'identity' && (
                        <ViewIdentityModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            identity={selectedItem as Identity}
                            selectedTab={''}
                            setSelectedTab={function (key: string): void {
                                throw new Error('Function not implemented.');
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TaskList;