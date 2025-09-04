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

  return (
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

        {/* Optional Import Button */}
        {/* 
        <button
          onClick={onImport}
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Import passwords
        </button> 
        */}
      </div>
    </div>
  );
};
