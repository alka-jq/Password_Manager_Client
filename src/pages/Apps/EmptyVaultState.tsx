import {
  FiCreditCard,
  FiKey,
  FiLogIn,
  FiUser,
  // FiDownload // Uncomment if needed
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { openAddModal } from '@/store/Slices/taskSlice';
import { openAddModal as openCardAddModal } from '@/store/Slices/cardSlice';
import { openAddModal as openIdentityAddModal } from '@/store/Slices/identitySlice';
import { openPasswordGenerator } from '@/store/Slices/passwordSlice';
import TaskList from './Table';
import React, { useEffect, useState } from 'react';
import { softDeleteItems } from '@/service/TableDataService';
import { fetchItemCount } from '@/store/Slices/countSlice';
import { RootState, AppDispatch } from '../../store';
import { useParams } from 'react-router-dom';
import { fetchAlldata } from '../../store/Slices/TableSlice';


export type ItemType =
  | 'login'
  | 'email-alias'
  | 'credit-card'
  | 'note'
  | 'identity'
  | 'custom';

interface EmptyVaultStateProps {
  onCreateItem: (type: ItemType) => void;
  onImport: () => void;
}

export const EmptyVaultState: React.FC<EmptyVaultStateProps> = ({
  onCreateItem,
  onImport,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { vaultId } = useParams<{ vaultId: string }>();

  const createOptions = [
    {
      id: 'login',
      label: 'Login',
      description: 'Store usernames and passwords safely',
      icon: <FiLogIn className="w-6 h-6 text-purple-600" />,
      action: () => dispatch(openAddModal()),
    },
    {
      id: 'card',
      label: 'Credit Card',
      description: 'Securely store card numbers and CVV',
      icon: <FiCreditCard className="w-6 h-6 text-green-600" />,
      action: () => dispatch(openCardAddModal()),
    },
    {
      id: 'identity',
      label: 'Identity',
      description: 'Keep ID cards and personal info',
      icon: <FiUser className="w-6 h-6 text-indigo-600" />,
      action: () => dispatch(openIdentityAddModal()),
    },
    {
      id: 'password',
      label: 'Password Generator',
      description: 'Generate strong, secure passwords',
      icon: <FiKey className="w-6 h-6 text-gray-600" />,
      action: () => dispatch(openPasswordGenerator()),
    },
  ];

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

  // 🔹 Fetch items on vaultId change
  useEffect(() => {
    const fetchVaultData = async () => {
      if (vaultId) {
        setLoading(true);
        try {
          // Assuming fetchAlldata fetches data for the current vault or all, adjust as needed
          await dispatch(fetchAlldata());
          // For now, set dummy data, replace with actual fetch
          setItems([
            { id: '1', title: 'Email Login', type: 'Login' },
            { id: '2', title: 'Office ID Card', type: 'Identity Card' },
            { id: '3', title: 'Bank Password', type: 'Password' },
            { id: '4', title: 'Social Media Account', type: 'Login' },
            { id: '5', title: 'University ID', type: 'Identity Card' },
            { id: '6', title: 'WiFi Password', type: 'Password' },
            { id: '7', title: 'WiFi Password', type: 'Card' }
          ]);
        } catch (error) {
          console.error('Failed to fetch vault data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchVaultData();
  }, [vaultId, dispatch]);

  // 🔹 Delete modal handlers
  const requestDelete = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await softDeleteItems(idsToDelete);
      setDeleteModalOpen(false);
      setIdsToDelete([]);
      dispatch(fetchItemCount());
    } catch (error) {
      console.error('Soft delete failed:', error);
    }
  };


  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setIdsToDelete([]);
  };

  // 🔹 Action handlers
  const handleEdit = (id: string) => {
    alert(`Editing item with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    requestDelete([id]);
  };

  const handleBulkDelete = (ids: string[]) => {
    requestDelete(ids);
  };

  const handleView = (id: string) => {
    alert(`Viewing item with ID: ${id}`);
  };

  return (
    <div>     
      {items.length === 0 ? (
        <div className="flex items-center justify-center min-h-[70vh] p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="w-full max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🗝️ Your cell is empty
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Start by adding an item to this vault. Everything you store here is encrypted and secure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {createOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.action}
                  className="group relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 text-left shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                      {option.icon}
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                        {option.label}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute right-3 top-3 w-2 h-2 bg-green-500 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <TaskList
          data={items}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
        />
      )}
    </div>
  );
};


