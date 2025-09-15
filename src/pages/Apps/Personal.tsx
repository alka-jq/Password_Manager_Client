import React, { useState, useEffect } from 'react';
import TaskList from './Table';
import { getPersonaldata, getPindata } from '@/service/TableDataService';
import DeleteModal from './DeleteModal';
import { softDeleteItems } from '@/service/TableDataService';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchItemCount, } from '@/store/Slices/countSlice';
import { fetchPersonalData } from '@/store/Slices/TableSlice';

type Item = {
    id: string;
    title: string;
    type: string;
    isPinned?: boolean;
};

const Personal = () => {
    const dispatch = useDispatch<AppDispatch>()
    // const [items, setItems] = useState<Item[]>([]);
    // const [loading, setLoading] = useState(false);
    const { items, loading } = useSelector((state: RootState) => state.data);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [mergedItems, setMergedItems] = useState<Item[]>([]);

    useEffect(() => {
        dispatch(fetchPersonalData())
    }, []);



    const handleEdit = (id: string) => {
        console.log('Edit item with ID:', id);
        alert(`Editing item with ID: ${id}`);
    };

    const handleDelete = (id: string) => {
        requestDelete([id]); // opens modal for single delete
    };

    const handleBulkDelete = (ids: string[]) => {
        requestDelete(ids); // opens modal for bulk delete
    };

    const handleView = (id: string) => {
        console.log('View item with ID:', id);
        alert(`Viewing item with ID: ${id}`);
    };

    const requestDelete = (ids: string[]) => {
        setIdsToDelete(ids);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await softDeleteItems(idsToDelete);
            setDeleteModalOpen(false);
            setIdsToDelete([]);
            dispatch(fetchItemCount());
            dispatch(fetchPersonalData())
        } catch (error) {
            console.error('Soft delete failed:', error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setIdsToDelete([]);
    };

    const handlePinToggle = () => {
        dispatch(fetchPersonalData())
    };



    return (
        <div>
            {/* TaskList component */}
            <TaskList
                data={items}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBulkDelete={handleBulkDelete}
                onView={handleView}
                isLoading={loading}
                onPinToggle={handlePinToggle}
            />
            <DeleteModal isOpen={deleteModalOpen} onClose={handleDeleteCancel} onConfirm={handleDeleteConfirm} bulk={idsToDelete.length > 1} />
        </div>
    );
};

export default Personal;
