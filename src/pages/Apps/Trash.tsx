import React, { useState, useEffect, useRef } from 'react';
import { LuTrash2 } from "react-icons/lu";
import { LuPin, LuPinOff } from 'react-icons/lu';
import { MdOutlineRestore } from "react-icons/md";
import PermanentDeleteConfirmationModal from './PermanentDeleteConfirmationModal';

type TableItem = {
  id: string;
  title: string;
  type: string;
};

const typeStyles: Record<string, string> = {
    login: 'text-blue-600 bg-gradient-to-b from-blue-100 to-blue-50 border-blue-200',
    'identity card': 'text-green-600 bg-gradient-to-b from-green-100 to-green-50 border-green-200',
    card: 'text-orange-600 bg-gradient-to-b from-orange-100 to-orange-50 border-orange-200',
    password: 'text-purple-600 bg-gradient-to-b from-purple-100 to-purple-50 border-purple-200',
    // add more types here if needed
};

const TrashList: React.FC = () => {
  // Dummy data
  const dummyData = [
    { id: '1', title: 'Email Login', type: 'Login' },
    { id: '2', title: 'Office ID Card', type: 'Identity Card' },
    { id: '3', title: 'Bank Password', type: 'Password' },
    { id: '4', title: 'Social Media Account', type: 'Login' },
    { id: '5', title: 'University ID', type: 'Identity Card' },
    { id: '6', title: 'WiFi Password', type: 'Password' },
    { id: '7', title: 'WiFi Password', type: 'Card' }
  ];

  // const [data, setData] = useState(dummyData);
  const [data, setData] = useState<TableItem[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [pins, setPins] = useState<boolean[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'above' | 'below'>('below');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  // Fetch trash items from API
  useEffect(() => {
    const fetchTrashItems = async () => {
      console.log("Fetching trash data...");
      try {
        const res = await getTrashdata();
        console.log("Response:", res.data);
        setData(res.data);
        setSelected(res.data.map(() => false));
        setPins(res.data.map(() => false));
      } catch (err) {
        console.error('Error fetching trash data:', err);
      }
    };

    fetchTrashItems();
  }, []); // <-- empty array ensures effect runs only once

  // useEffect(() => {
  //   setData(dummyData);
  //   setSelected(dummyData.map(() => false));
  //   setPins(dummyData.map(() => false));
  // }, []);




  const toggleSelect = (index: number) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    const allSelected = selected.every(Boolean);
    setSelected(selected.map(() => !allSelected));
  };

  const togglePin = (index: number) => {
    const newPins = [...pins];
    newPins[index] = !newPins[index];
    setPins(newPins);
  };

  const allSelected = selected.length > 0 && selected.every(Boolean);
  const someSelected = selected.some(Boolean) && !allSelected;

  const handleRestore = (id: string) => {
    if (window.confirm('Restore this item?')) {
      setData(data.filter(item => item.id !== id));
      // Hit your API here
      console.log('Restoring:', id);
    }
  };

const handlePermanentDelete = (id: string) => {
  setDeleteTargetIds([id]);
  setShowDeleteModal(true);
};

  const handleBulkRestore = () => {
    const ids = data.filter((_, i) => selected[i]).map(item => item.id);
    if (window.confirm(`Restore ${ids.length} items?`)) {
      setData(data.filter((_, i) => !selected[i]));
      setSelected(data.map(() => false));
      console.log('Bulk restoring:', ids);
    }
  };

const handleBulkDelete = () => {
  const ids = data.filter((_, i) => selected[i]).map(item => item.id);
  if (ids.length === 0) return;
  setDeleteTargetIds(ids);
  setShowDeleteModal(true);
};

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 80;
    setDropdownPosition(spaceBelow < dropdownHeight ? 'above' : 'below');
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const clickedOnButton = Object.values(buttonRefs.current).some(
      ref => ref && ref.contains(e.target as Node)
    );

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      !clickedOnButton
    ) {
      setDropdownVisible(null);
    }
  };

  const confirmPermanentDelete = () => {
  setData(prevData => prevData.filter(item => !deleteTargetIds.includes(item.id)));
  setSelected(prevSelected =>
    prevSelected.filter((_, index) => !deleteTargetIds.includes(data[index]?.id))
  );
  setDeleteTargetIds([]);
  setShowDeleteModal(false);
};

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

return (
    <div className="">
      {data.length === 0 ? (
        <div className="flex justify-center items-center h-[80vh]">
          <h1 className="text-2xl font-medium text-gray-600">Trash is empty</h1>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-md shadow-sm">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center px-6 py-3 text-sm font-medium text-gray-500 select-none">
              <div className="w-[5%] flex justify-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={toggleSelectAll}
                  className="accent-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="w-[20%] flex justify-center">
                {(someSelected || allSelected) ? (
                  <button onClick={handleBulkRestore} className="hover:text-blue-600 transition-colors" title="Restore Selected">
                    <MdOutlineRestore size={20} />
                  </button>
                ) : (
                  <span className="text-md font-normal opacity-70">Pin</span>
                )}
              </div>
              <div className="w-[30%]">Title</div>
              <div className="w-[30%]">Type</div>
              <div className="w-[15%] text-right pr-3">
                {(someSelected || allSelected) ? (
                  <button onClick={handleBulkDelete} className="hover:text-red-600 transition-colors" title="Delete Selected">
                    <LuTrash2 size={20} />
                  </button>
                ) : (
                  <span className="text-md font-normal opacity-70">Action</span>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto max-h-[70vh]">
            {data.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center px-6 py-3 text-sm transition-colors border-b border-gray-100 ${
                  selected[index] ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="w-[5%] flex justify-center">
                  <input
                    type="checkbox"
                    checked={selected[index] || false}
                    onChange={() => toggleSelect(index)}
                    className="accent-blue-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="w-[20%] flex justify-center">
                  <button
                    onClick={() => togglePin(index)}
                    className="hover:text-blue-500 transition-colors"
                    title={pins[index] ? "Unpin" : "Pin"}
                  >
                    {pins[index] ? <LuPin color="#3b82f6" /> : <LuPinOff />}
                  </button>
                </div>
                <div className="w-[30%] truncate font-medium text-gray-800">{item.title}</div>
                <div className="w-[30%]">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeStyles[item.type.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                    {item.type.toLowerCase()}
                  </span>
                </div>
                <div className="w-[15%] flex justify-end gap-3 pr-3">
                  <button
                    onClick={() => handleRestore(item.id)}
                    title="Restore"
                    className="hover:text-green-600 transition-colors"
                  >
                    <MdOutlineRestore size={18} />
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(item.id)}
                    title="Delete Permanently"
                    className="hover:text-red-500 transition-colors"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showDeleteModal && (
        <PermanentDeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmPermanentDelete}
          itemCount={deleteTargetIds.length}
        />
      )}
    </div>
  );
};

export default TrashList;
