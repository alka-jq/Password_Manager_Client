import React, { useEffect, useState } from 'react';
import TaskList from './Table';
import DeleteModal from './DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchAlldata } from '../../store/Slices/TableSlice';

const AllItems = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.data);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

  // 🔹 Fetch items on component mount
  useEffect(() => {
    dispatch(fetchAlldata());
  }, [dispatch]);

  // 🔹 Delete modal handlers
  const requestDelete = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // This is placeholder logic (won’t work with Redux state)
    // You’ll need to dispatch a delete action here in real scenario
    // e.g., dispatch(deleteItems(idsToDelete))
    setDeleteModalOpen(false);
    setIdsToDelete([]);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setIdsToDelete([]);
  };

  // 🔹 Action handlers
  const handleEdit = (id: string) => {
    alert(`Editing item with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    requestDelete([id]);
  };

  const handleBulkDelete = (ids: string[]) => {
    requestDelete(ids);
  };

  const handleView = (id: string) => {
    alert(`Viewing item with ID: ${id}`);
  };

  return (
    <div>
      <TaskList
        data={items}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        bulk={idsToDelete.length > 1}
      />
    </div>
  );
};

export default AllItems;
