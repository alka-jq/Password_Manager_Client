import { Task } from '@/store/Slices/taskSlice';
import {Card} from "@/store/Slices/cardSlice"
import { Identity } from '@/store/Slices/identitySlice';
import { Eye, MoreHorizontal, XCircle, Trash2 } from 'lucide-react';

type Item = (Task | Card | Identity) & { type: 'task' | 'card' | 'identity' };

interface PersonalItemsProps {
  items: Array<Item>;
  selectedItems: Set<string>;
  toggleItemSelection: (itemId: string) => void;
  setSelectedItem: (item: any) => void;
  setIsModalOpen: (open: boolean) => void;
  setOpenMenuId: (id: string | null) => void;
  openMenuId: string | null;
  setCompleteConfirmModal: (modal: any) => void;
  openDeleteConfirm: (item: any, permanent: boolean) => void;
}

const PersonalItems = ({
  items,
  selectedItems,
  toggleItemSelection,
  setSelectedItem,
  setIsModalOpen,
  setOpenMenuId,
  openMenuId,
  setCompleteConfirmModal,
  openDeleteConfirm
}: PersonalItemsProps) => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {items.map((item) => {
        const itemId = `${item.type}-${item.id}`;
        const isSelected = selectedItems.has(itemId);

        return (
          <div
            key={itemId}
            className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''} bg-gray-50 dark:bg-gray-800`}
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

              {/* Title - Extra column span for personal items */}
              <div className="col-span-7">
                <div className="group">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {item.title}
                  </h3>
                  {item.note && <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{item.note}</p>}
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
                    onClick={() => setOpenMenuId(openMenuId === itemId ? null : itemId)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {openMenuId === itemId && (
                    <div
                      className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30 py-1"
                      data-dropdown="menu"
                    >
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PersonalItems;