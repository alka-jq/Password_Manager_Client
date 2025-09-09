import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { LuPin, LuPinOff } from 'react-icons/lu';
import ViewCardModal from './ViewCardModal';
import ViewLogInModal from './ViewLogInModal';
import ViewIdentityModal from './ViewIdentityModal';
import FilterDropdown from './FilterDropdown';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchItemCount } from '@/store/Slices/countSlice';
import { fetchAlldata } from '../../store/Slices/TableSlice';

import Loader from '../Components/Loader';
import { togglePinStatus } from '@/service/TableDataService';

type TableItem = {
    id: string;
    title: string;
    type: string;
    isPinned?: boolean; // Add isPinned property to TableItem
};

type CommonTableProps = {
    data: TableItem[] | undefined;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onBulkDelete?: (ids: string[]) => void;
    onView?: (id: string) => void;
    onClose?: () => void;
    isLoading?: boolean;
    onPinToggle?: () => void;
};

const typeStyles: Record<string, string> = {
    login: 'text-blue-400 bg-gradient-to-b from-blue-100 to-blue-50 border-blue-200',
    identity: 'text-green-400 bg-gradient-to-b from-green-100 to-green-50 border-green-200',
    card: 'text-orange-400 bg-gradient-to-b from-orange-100 to-orange-50 border-orange-200',
    // add more types here if needed
};

const TaskList: React.FC<CommonTableProps> = ({ data, onEdit, onDelete, onBulkDelete, onView, onClose, isLoading = false, onPinToggle }) => {
    // Safely handle undefined data
    const safeData = data || [];
    const dispatch = useDispatch<AppDispatch>();
    // Initialize pin state from data
    const [pinState, setPinState] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState(safeData.map(() => false));
    const [isBulkPinning, setIsBulkPinning] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('All Items');
    const [dropdownPosition, setDropdownPosition] = useState<'above' | 'below'>('below');
    const [viewItem, setViewItem] = useState<TableItem | null>(null);
    const [editItem, setEditItem] = useState<TableItem | null>(null);
    const searchQuery = useSelector((state: RootState) => state.search.query.toLowerCase());

    // Ref for the dropdown menu
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Initialize pin state from data when it changes
    useEffect(() => {
        const initialPinState: Record<string, boolean> = {};
        safeData.forEach(item => {
            initialPinState[item.id] = item.isPinned || false;
        });
        setPinState(initialPinState);
        setSelected(safeData.map(() => false));
    }, [safeData]);

    // Filter data based on selected type
    const filteredData = safeData
        .filter(item =>
            (filterType === 'All Items' || item.type.toLowerCase() === filterType.toLowerCase()) &&
            (item.title.toLowerCase().includes(searchQuery)) // 🔍 Search filter
        );

    // Toggle pin for a specific item
    const togglePin = async (id: string) => {
        const newPinState = !pinState[id];

        try {
            await togglePinStatus([id], newPinState);
            setPinState(prev => ({
                ...prev,
                [id]: newPinState
            }));
            dispatch(fetchAlldata());
            dispatch(fetchItemCount());
            if (onPinToggle) onPinToggle();
        } catch (error) {
            console.error('Failed to toggle pin:', error);
        }
    };

    // Toggle selection for a specific item
    const toggleSelect = (index: number) => {
        setSelected((prevSelected) => {
            const newSelected = [...prevSelected];
            newSelected[index] = !newSelected[index];
            return newSelected;
        });
    };

    // Toggle select all items
    const toggleSelectAll = () => {
        const allSelected = selected.every((item) => item);
        setSelected(selected.map(() => !allSelected));
    };

    // Check if all items are selected
    const allSelected = selected.length > 0 && selected.every((item) => item);
    // Check if some items are selected
    const someSelected = selected.some((item) => item) && !allSelected;

    // Toggle dropdown visibility for a specific row
    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (dropdownVisible === id) {
            setDropdownVisible(null);
        } else {
            // Calculate if there's enough space below the button
            const button = e.currentTarget as HTMLButtonElement;
            const buttonRect = button.getBoundingClientRect();
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const dropdownHeight = 80; // Approximate height of dropdown

            setDropdownPosition(spaceBelow < dropdownHeight ? 'above' : 'below');
            setDropdownVisible(id);
        }
    };

    // Handle edit action
    const handleEdit = (id: string) => {
        setDropdownVisible(null);
        const item = safeData.find((item) => item.id === id);
        if (item) {
            setEditItem(item); // Open edit modal
        }
    };

    // Handle delete action
    const handleDelete = (id: string) => {
        setDropdownVisible(null);
        onDelete(id);
    };

    // Handle view action
    const handleView = (id: string) => {
        const item = safeData.find((item) => item.id === id);
        if (item) {
            setViewItem(item); // Open modal
        }
    };

    // Handle bulk pin action
    const handleBulkPin = async () => {
        const selectedItems = safeData.filter((_, index) => selected[index]);
        if (selectedItems.length === 0) return;

        setIsBulkPinning(true);

        // Determine if all selected items are pinned or not
        const allSelectedPinned = selectedItems.every(item => pinState[item.id]);
        const newPinState = !allSelectedPinned;

        const idsToUpdate = selectedItems.map(item => item.id);

        try {
            await togglePinStatus(idsToUpdate, newPinState);

            // Update pin state for all selected items
            setPinState(prev => {
                const updated = { ...prev };
                idsToUpdate.forEach(id => {
                    updated[id] = newPinState;
                });
                return updated;
            });
            dispatch(fetchItemCount());
            if (onPinToggle) onPinToggle();
        } catch (error) {
            console.error('Bulk pin/unpin failed:', error);
        } finally {
            setIsBulkPinning(false);
        }
    };

    // Handle bulk delete action
    const handleBulkDelete = () => {
        const selectedIds = safeData.filter((_, index) => selected[index]).map((item) => item.id);

        if (selectedIds.length > 0 && onBulkDelete) {
            onBulkDelete(selectedIds);
            setSelected(selected.map(() => false)); // clear selection after delete request
        }
    };

    // Close dropdown if clicked outside
    const handleClickOutside = (e: MouseEvent) => {
        const clickedOnDotsButton = Object.values(buttonRefs.current).some((ref) => ref && ref.contains(e.target as Node));

        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && !clickedOnDotsButton) {
            setDropdownVisible(null);
        }
    };

    // Add event listener when the component mounts
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {(isLoading || isBulkPinning) ? (
                <div className="flex justify-center items-center w-full h-[100vh]">
                    <Loader />
                </div>
            ) : (
                <div className="">
                    {filteredData.length === 0 ? (
                        <>
                            <div className="mb-4">
                                <FilterDropdown selected={filterType} onChange={setFilterType} />
                            </div>
                            <h1 className="w-full h-[80vh] flex justify-center m-auto items-center text-xl">No Item Found</h1>
                        </>
                    ) : (
                        <>
                            <div className="mb-2">
                                <FilterDropdown selected={filterType} onChange={setFilterType} />
                            </div>
                            {/* Table Container */}
                            <div className=" border-gray-300 overflow-hidden bg-white">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <div className="col-span-1 flex items-center">
                                        {safeData.length > 0 && (
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 border border-gray-300 text-blue-600 rounded-sm focus:ring-blue-500"
                                                checked={allSelected}
                                                ref={(input) => {
                                                    if (input) {
                                                        input.indeterminate = someSelected;
                                                    }
                                                }}
                                                onChange={toggleSelectAll}
                                            />
                                        )}
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        {allSelected || someSelected ? (
                                            <button
                                                className="text-gray-700 hover:text-blue-600"
                                                title={safeData.some((_, index) => selected[index] && !pinState[safeData[index].id]) ? "Pin Selected" : "Unpin Selected"}
                                                onClick={handleBulkPin}
                                                disabled={isBulkPinning}
                                            >
                                                {isBulkPinning ? (
                                                    <Loader />
                                                ) : (
                                                    safeData.some((_, index) => selected[index] && !pinState[safeData[index].id]) ? (
                                                        <LuPin size={18} />
                                                    ) : (
                                                        <LuPinOff size={18} />
                                                    )
                                                )}
                                            </button>
                                        ) : (
                                            'Pin'
                                        )}
                                    </div>
                                    <div className="col-span-5">Title</div>
                                    <div className="col-span-3">Type</div>
                                    <div className="col-span-2  flex justify-end items-center">
                                        {allSelected || someSelected ? (
                                            <button
                                                className="text-gray-700 hover:text-red-600"
                                                title="Delete Selected"
                                                onClick={handleBulkDelete}
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        ) : (
                                            'Actions'
                                        )}
                                    </div>
                                </div>
                                {/* Table Body */}
                                <div className="divide-y divide-gray-200 overflow-y-auto h-[100vh] md:h-[80vh]">
                                    {filteredData.map((item) => {
                                        const originalIndex = safeData.findIndex((d) => d.id === item.id);
                                        const isPinned = pinState[item.id] || false;
                                        return (
                                            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-gray-50 items-center">
                                                <div className="col-span-1 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 border border-gray-300 text-blue-600 rounded-sm focus:ring-blue-500"
                                                        checked={selected[originalIndex] || false}
                                                        onChange={() => toggleSelect(originalIndex)}
                                                    />
                                                </div>
                                                <div className="col-span-1 flex items-center">
                                                    {isPinned ? (
                                                        <button onClick={() => togglePin(item.id)} className="text-blue-500 hover:text-blue-700" title="Unpin">
                                                            <LuPin size={18} />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => togglePin(item.id)} className="text-gray-400 hover:text-gray-600" title="Pin">
                                                            <LuPinOff size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="col-span-5 flex items-center">
                                                    <span className="text-sm text-gray-900 truncate">{item.title}</span>
                                                </div>
                                                <div className="col-span-3 flex items-center">
                                                    <span
                                                        className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm border ${typeStyles[item.type] || 'text-gray-600 bg-gray-100 border-gray-300'
                                                            }`}
                                                    >
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 flex items-center justify-end space-x-2">
                                                    <button onClick={() => handleView(item.id)} className="text-gray-400 hover:text-gray-600 p-1" title="View">
                                                        <FaEye size={16} />
                                                    </button>
                                                    <div className="relative">
                                                        <button
                                                            ref={(el) => (buttonRefs.current[item.id] = el)}
                                                            onClick={(e) => toggleDropdown(item.id, e)}
                                                            className="text-gray-400 hover:text-gray-600 p-1"
                                                            title="More actions"
                                                        >
                                                            <BsThreeDots size={16} />
                                                        </button>
                                                        {/* Dropdown Menu */}
                                                        {dropdownVisible === item.id && (
                                                            <div
                                                                ref={dropdownRef}
                                                                className={`absolute bg-white border border-gray-200 rounded-md shadow-md py-1 w-32 z-10 ${dropdownPosition === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'
                                                                    } right-0`}
                                                            >
                                                                <button
                                                                    className="w-full px-4 py-2 text-left flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => handleEdit(item.id)}
                                                                    title="Edit item"
                                                                >
                                                                    <FaEdit size={14} className="text-gray-400" />
                                                                    <span>Edit</span>
                                                                </button>
                                                                <button
                                                                    className="w-full px-4 py-2 text-left flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => handleDelete(item.id)}
                                                                    title="Delete item"
                                                                >
                                                                    <FaTrash size={14} className="text-gray-400" />
                                                                    <span>Delete</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Bulk Actions Bar */}
                            {(someSelected || allSelected) && (
                                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-md">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-700">{selected.filter(Boolean).length} selected</span>
                                        <button onClick={handleBulkPin} className="text-gray-700 hover:text-blue-600 p-1" title="Toggle Pin for Selected" disabled={isBulkPinning}>
                                            {isBulkPinning ? (
                                                <Loader />
                                            ) : (
                                                safeData.some((_, index) => selected[index] && !pinState[safeData[index].id]) ? (
                                                    <LuPin size={18} />
                                                ) : (
                                                    <LuPinOff size={18} />
                                                )
                                            )}
                                        </button>
                                        <button onClick={handleBulkDelete} className="text-gray-700 hover:text-red-600 p-1" title="Delete Selected">
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* View Modal */}
            {viewItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        {viewItem.type === 'identity' && (
                            <ViewIdentityModal item={viewItem} onClose={() => setViewItem(null)} />
                        )}
                        {viewItem.type === 'login' && (
                            <ViewLogInModal item={viewItem} onClose={() => setViewItem(null)} />
                        )}

                        {viewItem.type === 'card' && <ViewCardModal item={viewItem} onClose={() => setViewItem(null)} />}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        {/* Conditionally render based on type */}
                        {editItem.type === 'identity' && <ViewIdentityModal item={editItem} onClose={() => setEditItem(null)} editMode />}
                        {editItem.type === 'login' && <ViewLogInModal item={editItem} onClose={() => setEditItem(null)} editMode />}
                        {editItem.type === 'card' && <ViewCardModal item={editItem} onClose={() => setEditItem(null)} editMode />}
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskList;