import { FiCreditCard, FiKey, FiLogIn, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { openAddModal } from '@/store/Slices/taskSlice';
import { openAddModal as openCardAddModal } from '@/store/Slices/cardSlice';
import {openAddModal as openIdentityAddModal } from '@/store/Slices/identitySlice';
import { openPasswordGenerator } from '@/store/Slices/passwordSlice'; // adjust imports to your actual paths

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
  const dispatch = useDispatch();

  const createOptions = [
    {
      id: 'login',
      label: 'Create a login',
      icon: <FiLogIn className="w-5 h-5" />,
      bgColor: 'bg-purple-100 text-purple-800',
      action: () => {
        // onCreateItem('login');
        dispatch(openAddModal());
      },
    },
    {
      id: 'card',
      label: 'Create a credit card',
      icon: <FiCreditCard className="w-5 h-5" />,
      bgColor: 'bg-green-100 text-green-800',
      action: () => {
        // onCreateItem('credit-card');
        dispatch(openCardAddModal());
      },
    },
    {
      id: 'identity',
      label: 'Create an Identity',
      icon: <FiUser className="w-5 h-5" />,
      bgColor: 'bg-indigo-100 text-indigo-800',
      action: () => {
        // onCreateItem('identity');
        dispatch(openIdentityAddModal());
      },
    },
    {
      id: 'password',
      label: 'Create a Password Generator',
      icon: <FiKey className="w-5 h-5" />,
      bgColor: 'bg-gray-100 text-gray-800',
      action: () => {
        // onCreateItem('custom'); 
        dispatch(openPasswordGenerator());
      },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Your cell is empty
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Switch to another cell or create an item in this cell
        </p>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {createOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.action}
              className={`flex items-center justify-between px-4 py-2 rounded-full font-medium ${option.bgColor} transition-all duration-200 hover:opacity-90`}
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span className="text-sm">{option.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Uncomment if needed */}
        {/* <button
          onClick={onImport}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Import passwords
        </button> */}
      </div>
    </div>
  );
};
