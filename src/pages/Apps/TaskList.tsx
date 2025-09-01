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

// Import your separate components
import AllItems from './AllItems';
import PersonalItems from './PersonalItems';
import TrashItems from './TrashItems';
import PinItems from './PinItems';
import TableHeader from './TableHeader';

const ITEMS_PER_PAGE = 7;
type Item = (Task | Card | Identity) & { type: 'task' | 'card' | 'identity' };
const TaskList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const pathname = location.pathname.replace('/', '');

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    
    const [selectedItem, setSelectedItem] = useState<(Task | Card | Identity) & { type: 'task' | 'card' | 'identity' } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterKeyword, setFilterKeyword] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    items: Item[];
    permanent: boolean;
    bulk: boolean;
}>({
    isOpen: false,
    items: [],
    permanent: false,
    bulk: false,
});
    const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    item: Task | Card | Identity | null;
}>({
    isOpen: false,
    item: null,
});
   const [permanentDeleteModal, setPermanentDeleteModal] = useState<{
    isOpen: boolean;
    items: (Task | Card | Identity)[];
}>({
    isOpen: false,
    items: [],
});
    const [moveToModal, setMoveToModal] = useState<{
    isOpen: boolean;
    items: (Task | Card | Identity)[];
}>({
    isOpen: false,
    items: [],
});
  const [completeConfirmModal, setCompleteConfirmModal] = useState<{
    isOpen: boolean;
    item: Task | Card | Identity | null;
    type: 'complete' | 'uncomplete';
}>({
    isOpen: false,
    item: null,
    type: 'complete',
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

    // Render the appropriate component based on selectedTab
    const renderContent = () => {
        const commonProps = {
            paginatedItems,
            selectedItems,
            hasSelectedItems,
            allSelected,
            openMenuId,
            toggleSelectAll,
            toggleItemSelection,
            handleBulkDelete,
            handleBulkRestore,
            handleBulkToggleImportant,
            handleToggleImportant,
            setSelectedItem,
            setIsModalOpen,
            setOpenMenuId,
            setShareModal,
            setCompleteConfirmModal,
            openDeleteConfirm,
            handleEdit,
            handleRestore,
            selectedTab
        };

      switch (selectedTab) {
    case 'trash':
        return <TrashItems items={paginatedItems} {...commonProps} />;
    case 'personal':
        return <PersonalItems items={paginatedItems} {...commonProps} />;
    case 'pin':
        return <PinItems items={paginatedItems} {...commonProps} />;
    default:
        return <AllItems items={paginatedItems} {...commonProps} />;
}

    };

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

            {/* Render the appropriate component */}           

<>
  <TableHeader
    allSelected={allSelected}
    toggleSelectAll={toggleSelectAll}
    hasSelectedItems={hasSelectedItems}
    selectedTab={selectedTab}
    handleBulkDelete={handleBulkDelete}
    handleBulkRestore={handleBulkRestore}
    handleBulkToggleImportant={handleBulkToggleImportant}
  />

  {renderContent()}
</>
            {/* Delete Confirmation Modal */}
        <DeleteModals
    isOpen={deleteConfirmModal.isOpen}
    onClose={() =>
        setDeleteConfirmModal({ isOpen: false, items: [], permanent: false, bulk: false })
    }
    onConfirm={() => handleDelete(deleteConfirmModal.items, deleteConfirmModal.permanent)}
    itemType={deleteConfirmModal.items.length > 0 ? (deleteConfirmModal.items[0].type as 'task' | 'card' | 'identity') : 'task'}
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
                            selectedTab={selectedTab}
                            setSelectedTab={(key: string) => dispatch(setSelectedTab(key))}
                        />
                    )}
                    {selectedItem.type === 'card' && (
                        <ViewCardModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            card={selectedItem as Card}
                            selectedTab={selectedTab}
                            setSelectedTab={(key: string) => dispatch(setSelectedTab(key))}
                        />
                    )}
                    {selectedItem.type === 'identity' && (
                        <ViewIdentityModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            identity={selectedItem as Identity}
                            selectedTab={selectedTab}
                            setSelectedTab={(key: string) => dispatch(setSelectedTab(key))}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TaskList;