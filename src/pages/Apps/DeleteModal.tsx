// components/DeleteConfirmationModal.tsx
'use client';

interface DeleteModals {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType?: string;
  bulk?: boolean;
}

const DeleteModals = ({ isOpen, onClose, onConfirm, itemType, bulk = false }: DeleteModals) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {bulk ? 'Move Items to Trash' : 'Move to Trash'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                This action can be undone
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Body */}
                <div className="p-5">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {itemType === 'identity'
                            ? 'Aliases in trash will continue forwarding emails. If you want to stop receiving emails on this address, disable it instead.'
                            : 'Selected items will be moved to trash. You can restore them later from the trash.'}
                    </p>

                    <div className="flex items-start mb-4">
                        <input 
                            type="checkbox" 
                            id="dontRemind" 
                            className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
                        />
                        <label htmlFor="dontRemind" className="text-sm text-gray-700 dark:text-gray-300">
                            Don't show this message again
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 shadow-sm hover:shadow"
                    >
                        {bulk ? 'Move All to Trash' : 'Move to Trash'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModals;