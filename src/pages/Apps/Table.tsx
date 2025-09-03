
import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { LuPin, LuPinOff } from 'react-icons/lu';
import ViewCardModal from './ViewCardModal';
import ViewLogInModal from './ViewLogInModal';
import ViewIdentityModal from './ViewIdentityModal';
import FilterDropdown from './FilterDropdown';

type TableItem = {
    id: string;
    title: string;
    type: string;
};

type CommonTableProps = {
    data: TableItem[] | undefined;
    // filterOptions?: string[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onView?: (id: string) => void;
    onClose?: () => void;
    isLoading?: boolean;
};

const TaskList: React.FC<CommonTableProps> = ({
    data,
    // filterOptions = [],
    onEdit,
    onDelete,
    onView,
    onClose,
    isLoading = false,
}) => {
    // Safely handle undefined data
    const safeData = data || [];

    const [pin, setPins] = useState(safeData.map(() => false));
    const [selected, setSelected] = useState(safeData.map(() => false));
    const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('All Items');
    const [dropdownPosition, setDropdownPosition] = useState<'above' | 'below'>('below');
    const [viewItem, setViewItem] = useState<TableItem | null>(null);
    const [editItem, setEditItem] = useState<TableItem | null>(null);



    // Ref for the dropdown menu
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Update pin and selected states when data changes
    useEffect(() => {
        setPins(safeData.map(() => false));
        setSelected(safeData.map(() => false));
    }, [safeData]);

    // Filter data based on selected type
    const filteredData = filterType === 'All Items'
        ? safeData
        : safeData.filter(item => item.type === filterType);

    // Toggle pin for a specific item
    const togglePin = (index: number) => {
        setPins((prevPins) => {
            const newPins = [...prevPins];
            newPins[index] = !newPins[index];
            return newPins;
        });
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
        const allSelected = selected.every(item => item);
        setSelected(selected.map(() => !allSelected));
    };

    // Check if all items are selected
    const allSelected = selected.length > 0 && selected.every(item => item);
    // Check if some items are selected
    const someSelected = selected.some(item => item) && !allSelected;

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
        const item = safeData.find(item => item.id === id);
        if (item) {
            setEditItem(item); // Open edit modal
        }
    }

    // Handle delete action
    const handleDelete = (id: string) => {
        setDropdownVisible(null);
        onDelete(id);
    };

    // Handle view action
    const handleView = (id: string) => {
        const item = safeData.find(item => item.id === id);
        if (item) {
            setViewItem(item); // Open modal
        }
    };

    // Handle bulk pin action
    const handleBulkPin = () => {
        setPins((prevPins) => {
            const newPins = [...prevPins];

            // Check if ALL selected items are already pinned
            const allSelectedPinned = selected.every((isSelected, index) => {
                return !isSelected || newPins[index]; // Either not selected or already pinned
            });

            // Toggle pin state for all selected items
            selected.forEach((isSelected, index) => {
                if (isSelected) {
                    newPins[index] = !allSelectedPinned;
                }
            });

            return newPins;
        });
    };

    // Handle bulk delete action
    const handleBulkDelete = () => {
        const selectedIds = safeData
            .filter((_, index) => selected[index])
            .map(item => item.id);

        if (selectedIds.length > 0) {
            if (window.confirm(`Are you sure you want to delete ${selectedIds.length} item(s)?`)) {
                selectedIds.forEach(id => onDelete(id));
                setSelected(selected.map(() => false)); // Clear selection
            }
        }
    };

    // Close dropdown if clicked outside
    const handleClickOutside = (e: MouseEvent) => {
        const clickedOnDotsButton = Object.values(buttonRefs.current).some(
            ref => ref && ref.contains(e.target as Node)
        );

        if (dropdownRef.current &&
            !dropdownRef.current.contains(e.target as Node) &&
            !clickedOnDotsButton) {
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
            {isLoading ? (
                <>
                    <div className='flex justify-center items-center w-full h-[100vh]  '>
                        <h1 className=' text-2xl'>Loading...</h1>
                    </div>

                </>
            ) : (
                <>
                    <div>
                        {filteredData.length === 0 ? (
                            <>
                                {/* /* Filter Button */}
                                <div>
                                    <FilterDropdown
                                        selected={filterType}
                                        onChange={setFilterType}
                                    />
                                </div>
                                <h1 className='w-full h-[80vh] flex justify-center m-auto items-center text-xl'>No Item Found</h1>
                            </>
                        ) : (
                            <>
                                {/* /* Filter Button */}
                                <div>
                                    <FilterDropdown
                                        selected={filterType}
                                        onChange={setFilterType}
                                    />
                                </div>

                                {/* Table */}
                                <div className='py-3'>
                                    <div className='w-full font-sans overflow-hidden border '>
                                        {/* Fixed Header */}
                                        <div className='bg-white sticky top-0 z-10'>
                                            <table className='w-full'>
                                                <thead>
                                                    <tr className='w-full flex justify-between px-4 py-2 border-b'>
                                                        <th>
                                                            {safeData.length > 0 && (
                                                                <input
                                                                    type='checkbox'
                                                                    checked={allSelected}
                                                                    ref={input => {
                                                                        if (input) {
                                                                            input.indeterminate = someSelected;
                                                                        }
                                                                    }}
                                                                    onChange={toggleSelectAll}
                                                                />
                                                            )}
                                                        </th>
                                                        <th className='w-[23%]'>
                                                            {(someSelected || allSelected) && safeData.length > 0 ? (
                                                                <button onClick={handleBulkPin} title='Toggle Pin for Selected' className="flex items-center justify-center">
                                                                    <LuPin /> {/* Bulk Pin */}
                                                                </button>
                                                            ) : (
                                                                'Pin'
                                                            )}
                                                        </th>
                                                        <th className='w-[23%]'>Title</th>
                                                        <th className='w-[23%]'>Type</th>
                                                        <th className='w-[10%]'>
                                                            {(someSelected || allSelected) && safeData.length > 0 ? (
                                                                <button onClick={handleBulkDelete} className="flex items-center justify-center">
                                                                    <FaTrash color='gray' /> {/* Bulk Delete */}
                                                                </button>
                                                            ) : (
                                                                'Action'
                                                            )}
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>

                                        {/* Scrollable Body */}
                                        <div className='overflow-y-auto  h-[78vh] '>
                                            <table className='w-full'>
                                                <tbody>
                                                    {filteredData.map((item, index) => {
                                                        const originalIndex = safeData.findIndex(d => d.id === item.id);
                                                        return (
                                                            <tr key={item.id} className='w-full flex justify-between px-4 py-2 bg-white hover:bg-gray-50 border-b'>
                                                                <td>
                                                                    <input
                                                                        type='checkbox'
                                                                        checked={selected[originalIndex] || false}
                                                                        onChange={() => toggleSelect(originalIndex)}
                                                                    />
                                                                </td>
                                                                <td className='px-4 py-2 text-left w-[23%]'>
                                                                    {pin[originalIndex] ? (
                                                                        <button onClick={() => togglePin(originalIndex)} className="flex items-center" title="Unpin">
                                                                            <LuPin color="#3b82f6" /> {/* Pin on - blue color */}
                                                                        </button>
                                                                    ) : (
                                                                        <button onClick={() => togglePin(originalIndex)} className="flex items-center" title="Pin">
                                                                            <LuPinOff /> {/* Pin off */}
                                                                        </button>
                                                                    )}
                                                                </td>
                                                                <td className='px-4 py-2 text-left w-[23%]'>{item.title}</td>
                                                                <td className='px-4 py-2 text-left w-[23%]'>{item.type}</td>
                                                                <td className='px-4 py-2 flex gap-4 text-left w-[10%] relative'>
                                                                    <button onClick={() => handleView(item.id)} title="View">
                                                                        <FaEye color='gray' />
                                                                    </button>

                                                                    <button
                                                                        ref={el => buttonRefs.current[item.id] = el}
                                                                        onClick={(e) => toggleDropdown(item.id, e)}
                                                                        title="More actions"
                                                                    >
                                                                        <BsThreeDots color='gray' />
                                                                    </button>

                                                                    {/* Dropdown Menu with dynamic positioning */}
                                                                    {dropdownVisible === item.id && (
                                                                        <div
                                                                            ref={dropdownRef}
                                                                            className={`absolute bg-white border rounded-md shadow-lg w-32 z-10 ${dropdownPosition === 'above'
                                                                                ? 'bottom-full mb-1'
                                                                                : 'top-full mt-1'
                                                                                } right-0`}
                                                                        >
                                                                            <button
                                                                                className="w-full px-4 py-2 text-left flex gap-2 items-center text-sm text-gray-700 hover:bg-gray-100"
                                                                                onClick={() => handleEdit(item.id)}
                                                                                title="Edit item"
                                                                            >
                                                                                <FaEdit color='gray' /> Edit
                                                                            </button>
                                                                            <button
                                                                                className="w-full px-4 py-2 text-left flex gap-2 items-center text-sm text-gray-700 hover:bg-gray-100"
                                                                                onClick={() => handleDelete(item.id)}
                                                                                title="Delete item"
                                                                            >
                                                                                <FaTrash color='gray' />Delete
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>


                            </>
                        )}
                    </div>
                </>
            )}

            {/* View Details */}
            {viewItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">View {viewItem.type} Details</h2>
                            <button onClick={() => setViewItem(null)} className="text-gray-500 hover:text-gray-800">
                                ✕
                            </button>
                        </div>

                        {/* Conditionally render based on type */}
                        {viewItem.type === 'Password' && (
                            // <IdentityModalContent item={viewItem} />
                            <>password</>
                        )}
                        {viewItem.type === 'Identity Card' && (
                            <ViewIdentityModal item={viewItem} onClose={() => setViewItem(null)} />
                        )}
                        {viewItem.type === 'Login' && (
                            <ViewLogInModal item={viewItem} onClose={() => setViewItem(null)} />
                        )}

                        {viewItem.type === 'Card' && (
                            <ViewCardModal item={viewItem} onClose={() => setViewItem(null)} />
                        )}
                    </div>
                </div>
            )}


            {/* Edit Modal */}
            {editItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Edit {editItem.type} Details</h2>
                            <button onClick={() => setEditItem(null)} className="text-gray-500 hover:text-gray-800">
                                ✕
                            </button>
                        </div>

                        {/* Conditionally render based on type */}
                        {editItem.type === 'Password' && (
                            <>Edit Password form</>
                        )}
                        {editItem.type === 'Identity Card' && (
                            <ViewIdentityModal item={editItem} onClose={() => setEditItem(null)} editMode />
                        )}
                        {editItem.type === 'Login' && (
                            <ViewLogInModal item={editItem} onClose={() => setEditItem(null)} editMode />
                        )}
                        {editItem.type === 'Card' && (
                            <ViewCardModal item={editItem} onClose={() => setEditItem(null)} editMode />
                        )}
                    </div>
                </div>
            )}


        </>
    );
}

export default TaskList;
