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
    const [isLoading, setIsLoading] = useState(false);

    // const fetchData = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await dispatch(fetchPersonalData())
    //         setItems(res);
    //     } catch (err) {
    //         console.log('backend error');
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const fetchData = async () => {
    //     try {
    //         setIsLoading(true);
    //         // Fetch personal data and pinned data separately
    //         const personalRes = await getPersonaldata();
    //         const pinRes = await getPindata();

    //         const personalItems: Item[] = personalRes.data || [];
    //         const pinnedItems: Item[] = pinRes.data || [];

    //         // Create a set of pinned item ids for quick lookup
    //         const pinnedIds = new Set(pinnedItems.map(item => item.id));

    //         // Merge pin status into personal items
    //         const merged = personalItems.map(item => ({
    //             ...item,
    //             isPinned: pinnedIds.has(item.id),
    //         }));

    //         setMergedItems(merged);
    //     } catch (err) {
    //         console.error('Error fetching personal or pinned data:', err);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    useEffect(() => {
        dispatch(fetchPersonalData())
    }, []);

    // Handler functions


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
