
const DeleteModal = () => {
    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white  cornflower:bg-[#6BB8C5] peach:bg-[#1b2e4b] lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-xl shadow-lg w-full max-w-xs p-6">
                    <h2 className=" font-medium mb-3 text-gray-700">Delete label?</h2>
                    <p className=" font-medium cornflower:text-white peach:text-white lightmint:text-white text-gray-700 mb-2">
                        Emails tagged with the label <strong>"Label Name"</strong> will not be deleted and can still be found in the respective folder.
                    </p>
                    <p className=" font-medium cornflower:text-white  peach:text-white lightmint:text-white text-gray-700 mb-5">
                        Are you sure you want to delete this label?
                    </p>

                    <div className="flex flex-col gap-3">
                        <button

                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium"
                        >
                            Delete
                        </button>
                        <button

                            className="w-full border font-medium cornflower:bg-[#43aabcd5] peach:bg-gray-100  border-gray-300 py-2 lightmint:text-black lightmint:bg-green-50 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default DeleteModal