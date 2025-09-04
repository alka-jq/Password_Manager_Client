import React, { useState, useEffect, useRef } from 'react';
import { LuTrash2 } from "react-icons/lu";
import { LuPin, LuPinOff } from 'react-icons/lu';
import { getTrashdata ,bulkDeletePasswords, deletePasswordById, restorePasswords} from '@/service/TableDataService';
import { MdOutlineRestore } from "react-icons/md";
import PermanentDeleteConfirmationModal from './PermanentDeleteConfirmationModal';
type TableItem = {
  id: string;
  title: string;
  type: string;
};

// Map item types to style classes
const typeStyles: Record<string, string> = {
    login: 'text-blue-600 bg-gradient-to-b from-blue-100 to-blue-50 border-blue-200',
    'identity card': 'text-green-600 bg-gradient-to-b from-green-100 to-green-50 border-green-200',
    card: 'text-orange-600 bg-gradient-to-b from-orange-100 to-orange-50 border-orange-200',
    password: 'text-purple-600 bg-gradient-to-b from-purple-100 to-purple-50 border-purple-200',
    // add more types here if needed
};

const TrashList: React.FC = () => {
  const [data, setData] = useState<TableItem[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [pins, setPins] = useState<boolean[]>([]);
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
  }, []); 




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

const handleRestore = async (id: string) => {
  if (!window.confirm('Restore this item?')) return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('No authentication token found');
    return;
  }

  try {
    await restorePasswords([id], token); // wrap single id in array
    setData(data.filter(item => item.id !== id));
  } catch (error) {
    console.error('Failed to restore item:', error);
    alert('Failed to restore item');
  }
};


const handlePermanentDelete = (id: string) => {
  setDeleteTargetIds([id]);
  setShowDeleteModal(true);
};

const handleBulkRestore = async () => {
  const ids = data.filter((_, i) => selected[i]).map(item => item.id);
  if (ids.length === 0) return;

  if (!window.confirm(`Restore ${ids.length} items?`)) return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('No authentication token found');
    return;
  }

  try {
    await restorePasswords(ids, token);
    setData(data.filter(item => !ids.includes(item.id)));
    setSelected(data.map(() => false));
  } catch (error) {
    console.error('Bulk restore failed:', error);
    alert('Failed to restore selected items');
  }
};


const handleBulkDelete = () => {
  const ids = data.filter((_, i) => selected[i]).map(item => item.id);
  if (ids.length === 0) return;
  setDeleteTargetIds(ids);
  setShowDeleteModal(true);
};

const confirmPermanentDelete = async () => {
    try {
      if (deleteTargetIds.length === 1) {
        // Single delete
        await deletePasswordById(deleteTargetIds[0]);
      } else if (deleteTargetIds.length > 1) {
        // Bulk delete
        await bulkDeletePasswords(deleteTargetIds);
      }
      // Update UI after successful deletion
      setData(prevData => prevData.filter(item => !deleteTargetIds.includes(item.id)));
      setSelected(prevSelected =>
        prevSelected.filter((_, index) => !deleteTargetIds.includes(data[index]?.id))
      );
    } catch (error) {
      console.error('Error during permanent delete:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setDeleteTargetIds([]);
      setShowDeleteModal(false);
    }
  };


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
          <div className="overflow-y-auto max-h-[90vh]">
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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
  item.type ? typeStyles[item.type.toLowerCase()] || 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'
}`}>
  {item.type ? item.type.toLowerCase() : 'unknown'}
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