
const DeleteFolder = () => {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white w-96 dark:bg-[#202127] rounded-2xl shadow-2xl p-8   text-center animate-fadeIn transition-all">
                    <h2 className=" font-semibold text-gray-900 dark:text-white mb-3">Delete Folder?</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this folder? This action cannot be undone.</p>
                    <div className="flex flex-col justify-between gap-4">
                        <button
                            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2F2F2F] transition"
                        >
                            Cancel
                        </button>
                        <button

                            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteFolder