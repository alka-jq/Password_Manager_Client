import { Trash2, RotateCcw, Pin, PinOff } from "lucide-react";

interface TableHeaderProps {
  allSelected: boolean;
  toggleSelectAll: () => void;
  hasSelectedItems: boolean;
  selectedTab: string;
  handleBulkDelete: (permanent?: boolean) => void;
  handleBulkRestore: () => void;
  handleBulkToggleImportant: () => void;
}

const TableHeader = ({
  allSelected,
  toggleSelectAll,
  hasSelectedItems,
  selectedTab,
  handleBulkDelete,
  handleBulkRestore,
  handleBulkToggleImportant,
}: TableHeaderProps) => {
  return (
<div className="relative">
      {/* Bulk Action Icons - Above Table Headings */}
      {hasSelectedItems && (
        <div className="flex justify-end gap-2 mb-4 px-6 mt-4">
          {selectedTab === "trash" ? (
            <>
              <button
                onClick={handleBulkRestore}
                className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                title="Restore"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkDelete(true)}
                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                title="Delete Permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : selectedTab === "pin" ? (
            <>
              <button
                onClick={handleBulkToggleImportant}
                className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                title="Unpin"
              >
                <PinOff className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkDelete(false)}
                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBulkToggleImportant}
                className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                title="Pin"
              >
                <Pin className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkDelete(false)}
                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Table Headings */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="h-4 w-4 border border-gray-300 text-blue-600 rounded-sm focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        {selectedTab !== "trash" && <div className="col-span-1">Pin</div>}

        <div className={selectedTab === "trash" ? "col-span-7" : "col-span-6"}>
          Title
        </div>

        <div className="col-span-2">Type</div>
        <div className="col-span-2 flex justify-end">Actions</div>
      </div>
    </div>
  );
};

export default TableHeader;
