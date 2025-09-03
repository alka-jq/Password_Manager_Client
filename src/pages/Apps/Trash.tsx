import React, { useState, useEffect, useRef } from 'react';
import { LuTrash2 } from "react-icons/lu";
import { LuPin, LuPinOff } from 'react-icons/lu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { getTrashdata } from '@/service/TableDataService';
import { MdOutlineRestore } from "react-icons/md";

type TableItem = {
  id: string;
  title: string;
  type: string;
};

const TrashList: React.FC = () => {
  // Dummy data
  const dummyData = [
    { id: '1', title: 'Email Login', type: 'Login' },
    { id: '2', title: 'Office ID Card', type: 'Identity Card' },
    { id: '3', title: 'Bank Password', type: 'Password' },
    { id: '4', title: 'Social Media Account', type: 'Login' },
    { id: '5', title: 'University ID', type: 'Identity Card' },
    { id: '6', title: 'WiFi Password', type: 'Password' },
    { id: '7', title: 'WiFi Password', type: 'Card' }
  ];

  // const [data, setData] = useState(dummyData);
  const [data, setData] = useState<TableItem[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [pins, setPins] = useState<boolean[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'above' | 'below'>('below');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Fetch trash items from API
  // useEffect(() => {
  //   const fetchTrashItems = async () => {
  //     console.log("Fetching trash data...");
  //     try {
  //       const res = await getTrashdata();
  //       console.log("Response:", res.data);
  //       setData(res.data);
  //       setSelected(res.data.map(() => false));
  //       setPins(res.data.map(() => false));
  //     } catch (err) {
  //       console.error('Error fetching trash data:', err);
  //     }
  //   };

  //   fetchTrashItems();
  // }, []); // <-- empty array ensures effect runs only once

  useEffect(() => {
    setData(dummyData);
    setSelected(dummyData.map(() => false));
    setPins(dummyData.map(() => false));
  }, []);




  const toggleSelect = (index: number) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    const allSelected = selected.every(Boolean);
    setSelected(selected.map(() => !allSelected));
  };

  const togglePin = (index: number) => {
    const newPins = [...pins];
    newPins[index] = !newPins[index];
    setPins(newPins);
  };

  const allSelected = selected.length > 0 && selected.every(Boolean);
  const someSelected = selected.some(Boolean) && !allSelected;

  const handleRestore = (id: string) => {
    if (window.confirm('Restore this item?')) {
      setData(data.filter(item => item.id !== id));
      // Hit your API here
      console.log('Restoring:', id);
    }
  };

  const handlePermanentDelete = (id: string) => {
    if (window.confirm('Permanently delete this item?')) {
      setData(data.filter(item => item.id !== id));
      // Hit your API here
      console.log('Deleting permanently:', id);
    }
  };

  const handleBulkRestore = () => {
    const ids = data.filter((_, i) => selected[i]).map(item => item.id);
    if (window.confirm(`Restore ${ids.length} items?`)) {
      setData(data.filter((_, i) => !selected[i]));
      setSelected(data.map(() => false));
      console.log('Bulk restoring:', ids);
    }
  };

  const handleBulkDelete = () => {
    const ids = data.filter((_, i) => selected[i]).map(item => item.id);
    if (window.confirm(`Permanently delete ${ids.length} items?`)) {
      setData(data.filter((_, i) => !selected[i]));
      setSelected(data.map(() => false));
      console.log('Bulk deleting:', ids);
    }
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 80;
    setDropdownPosition(spaceBelow < dropdownHeight ? 'above' : 'below');
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const clickedOnButton = Object.values(buttonRefs.current).some(
      ref => ref && ref.contains(e.target as Node)
    );

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      !clickedOnButton
    ) {
      setDropdownVisible(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      {data.length === 0 ? (
        <div className='flex justify-center items-center h-[80vh]'>
          <h1 className='text-xl'>Trash is empty</h1>
        </div>
      ) : (
        <div className='overflow-hidden '>
          {/* Header */}
          <div className='bg-white sticky top-0 z-10'>
            <table className='w-full'>
              <thead>
                <tr className='flex justify-between px-4 py-2 border-b'>
                  <th>
                    <input
                      type='checkbox'
                      checked={allSelected}
                      ref={input => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className='w-[23%]'>
                    {(someSelected || allSelected) ? (
                      <button onClick={handleBulkRestore}><MdOutlineRestore size={20} /></button>
                    ) : 'Pin'}
                  </th>
                  <th className='w-[23%]'>Title</th>
                  <th className='w-[23%]'>Type</th>
                  <th className='w-[10%]'>
                    {(someSelected || allSelected) ? (
                      <button onClick={handleBulkDelete}>
                        <LuTrash2 color='red' size={20} />
                      </button>
                    ) : 'Action'}
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Body */}
          <div className='overflow-y-auto h-[84vh]'>
            <table className='w-full'>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className='flex justify-between px-4 py-2 bg-white hover:bg-gray-50 border-b'
                  >
                    <td>
                      <input
                        type='checkbox'
                        checked={selected[index] || false}
                        onChange={() => toggleSelect(index)}
                      />
                    </td>
                    <td className='w-[23%]'>
                      <button onClick={() => togglePin(index)}>
                        {pins[index] ? <LuPin color='#3b82f6' /> : <LuPinOff />}
                      </button>
                    </td>
                    <td className='w-[23%]'>{item.title}</td>
                    <td className='w-[23%]'>{item.type}</td>
                    <td className='w-[10%] relative flex gap-3'>
                      <button onClick={() => handleRestore(item.id)} title='Restore'>
                        <MdOutlineRestore />
                      </button>
                      {/* <button
                        ref={el => (buttonRefs.current[item.id] = el)}
                        onClick={e => toggleDropdown(item.id, e)}
                        title='More'
                      >
                        <BsThreeDotsVertical />
                      </button> */}

                      <button
                        onClick={() => handlePermanentDelete(item.id)}
                      >
                        <LuTrash2 color='gray' />
                      </button>

                      {/* {dropdownVisible === item.id && (
                        <div
                          ref={dropdownRef}
                          className={`absolute bg-white border rounded-md shadow-lg w-32 z-10 ${dropdownPosition === 'above'
                            ? 'bottom-full mb-1'
                            : 'top-full mt-1'
                            } right-0`}
                        >
                          <button
                            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex gap-2 items-center'
                            onClick={() => handleRestore(item.id)}
                          >
                            <MdOutlineRestore />Restore
                          </button>
                          <button
                            className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 flex gap-2 items-center'
                            onClick={() => handlePermanentDelete(item.id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashList;
