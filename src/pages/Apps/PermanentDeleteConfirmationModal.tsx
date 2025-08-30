// components/PermanentDeleteConfirmationModal.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface PermanentDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
}

const PermanentDeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemCount }: PermanentDeleteConfirmationModalProps) => {
    const [neverNeedChecked, setNeverNeedChecked] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                            Permanent Deletion
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-5">
                    <div className="text-center mb-5">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Delete {itemCount} item{itemCount > 1 ? 's' : ''} permanently?
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            This action cannot be undone. All data will be permanently removed from our servers.
                        </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-5">
                        <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start">
                            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>This is a destructive action that cannot be reversed. Please confirm you understand the consequences.</span>
                        </p>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input 
                                id="neverNeed" 
                                type="checkbox" 
                                checked={neverNeedChecked} 
                                onChange={() => setNeverNeedChecked(!neverNeedChecked)} 
                                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                            />
                        </div>
                        <label htmlFor="neverNeed" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                            I understand this action is permanent and I will not be able to recover this data
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
                        disabled={!neverNeedChecked}
                        className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm hover:shadow"
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PermanentDeleteConfirmationModal;