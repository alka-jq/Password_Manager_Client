import React, { useState, useEffect } from 'react';
import TaskList from "./Table";
import { getAlldata } from '@/service/TableDataService';
import DeleteModal from './DeleteModal';
type Item = {
  id: string;
  title: string;
  type: string;
};


const AllItems = () => {
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

  // const [items, setItems] = useState<Item[]>([]);
  const [items, setItems] = useState(dummyData);  
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log("nisahn")
  //     try {
  //       setLoading(true)
  //       const res = await getAlldata();
  //       console.log("all data", res);
  //       setItems(res.data);
  //     } catch (err) {
  //       console.log("backend error")
  //       console.error(err)
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);


  // Handler functions
 const requestDelete = (ids: string[]) => {
  setIdsToDelete(ids);
  setDeleteModalOpen(true);
};

const handleDeleteConfirm = () => {
  setItems(prev => prev.filter(item => !idsToDelete.includes(item.id)));
  setDeleteModalOpen(false);
  setIdsToDelete([]);
};

const handleDeleteCancel = () => {
  setDeleteModalOpen(false);
  setIdsToDelete([]);
};
  
  const handleEdit = (id: string) => {
    console.log('Edit item with ID:', id);
    // You can implement your edit logic here
    alert(`Editing item with ID: ${id}`);
  };

 const handleDelete = (id: string) => {
  requestDelete([id]);
};

const handleBulkDelete = (ids: string[]) => {
  requestDelete(ids);
};

  const handleView = (id: string) => {
    console.log('View item with ID:', id);
    // You can implement your view logic here
    alert(`Viewing item with ID: ${id}`);
  };



  return (
    <div>
      {/* TaskList component */}
    <TaskList
  data={items}
  onEdit={(id) => alert(`Editing ${id}`)}
  onDelete={handleDelete}
  onBulkDelete={handleBulkDelete}   // Pass bulk delete handler here
  isLoading={loading}
/>

<DeleteModal
  isOpen={deleteModalOpen}
  onClose={handleDeleteCancel}
  onConfirm={handleDeleteConfirm}
  bulk={idsToDelete.length > 1}
/>

    </div>
  );
}

export default AllItems;