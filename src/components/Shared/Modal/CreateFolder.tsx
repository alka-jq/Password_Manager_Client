import React from 'react'

const CreateFolder = () => {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="w-1/3 bg-white lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] text-[#000] font-medium rounded-2xl shadow-lg p-6 relative">
                    <form>
                        <h1 className=" lightmint:text-white dark:text-white">New folder</h1>
                        <div className="py-3 w-full">
                            <input
                                type="text"
                                // value={labelData.name}
                                // onChange={(e) => setLabelData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Folder Name"
                                className="border px-3 placeholder:text-[#5e5d5d] lightmint:placeholder:text-black lightmint:text-black lightmint:bg-green-50 lightmint:border-[#629e7c] dark:placeholder:text-[white] dark:text-[white] dark:bg-[#2F2F2F] dark:border-[#2F2F2F] py-4 mt-3 rounded w-full"
                            />
                        </div>
                        <div className="py-3 w-full">
                            <label className="inline-flex items-center space-x-2">
                                <input
                                    type="checkbox"

                                    className="form-checkbox h-5 w-5 lightmint:border-green-50 lightmint:bg-[#629e7c] border-[#5e5d5d] text-blue-600 dark:border-[#2F2F2F] "
                                />
                                <span className="text-[#000] font-medium lightmint:text-white dark:text-white">Nest label under:</span>
                            </label>
                            <div>
                                <select
                                    // value={selectedOption || ''}

                                    className="border px-3 py-4 mt-3 rounded dark:bg-[#2F2F2F] dark:text-white lightmint:text-black dark:border-[#2F2F2F] font-medium w-full"
                                >
                                    {/* <option value="">{selectedOption ? labels.find((el) => el.folder_id === selectedOption)?.name || '-- Select --' : '-- Select --'}</option>

                                    {labels?.map((el) => (
                                        <option key={el.folder_id} value={el.folder_id} className="font-semibold">
                                            {el.name}
                                        </option>
                                    ))} */}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-3">
                            <button

                                className="mr-3 lightmint:bg-green-50 lightmint:text-black lightmint:border-gree dark:bg-[#2F2F2F] dark:border-[#2F2F2F] border-[1px] border-[#2565C7] px-7 py-2 rounded-lg hover:bg-[#a1a4a8]  transition  dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#2565C7] classic:bg-[#a8c7fa] classic:text-black  text-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] font-medium  px-7 py-2 rounded-lg dark:text-white"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>)
}

export default CreateFolder