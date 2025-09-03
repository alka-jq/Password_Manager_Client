import React, { useState, useEffect } from 'react';
import TaskList from "./Table";
import { getPindata } from '@/service/TableDataService';
import DeleteModal from './DeleteModal';
type Item = {
    id: string;
    title: string;
    type: string;
};

const Pin = () => {
    const dummyData = [
        { id: '1', title: 'This is Pin', type: 'Login' },
        { id: '2', title: 'Office ID Card', type: 'Identity Card' },
        { id: '3', title: 'Bank Password', type: 'Password' },
        { id: '4', title: 'Social Media Account', type: 'Login' },
        { id: '5', title: 'University ID', type: 'Identity Card' },
        { id: '6', title: 'WiFi Password', type: 'Password' },
    ];

    // const [items, setItems] = useState(dummyData);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            console.log("pin data")
            try {
                setLoading(true)
                const res = await getPindata();
                console.log("all data", res);
                setItems(res.data);
            } catch (err) {
                console.log("backend error")
                console.error(err)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const requestDelete = (ids: string[]) => {
        setIdsToDelete(ids);
        setDeleteModalOpen(true);
    };

    // Step 3.2: When user confirms in modal
    const handleDeleteConfirm = () => {
        setItems((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
        setDeleteModalOpen(false);
        setIdsToDelete([]);
    };

    // Step 3.3: When user cancels modal
    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setIdsToDelete([]);
    };

    const handleView = (id: string) => {
        console.log('View item with ID:', id);
        alert(`Viewing item with ID: ${id}`);
    };

    return (
        <div>
            <TaskList
                data={items}
                // filterOptions={['All Items', 'Login', 'Identity Card', 'Password']}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBulkDelete={handleBulkDelete}
                onView={handleView}
                isLoading={loading}
            />

            <DeleteModal isOpen={deleteModalOpen} onClose={handleDeleteCancel} onConfirm={handleDeleteConfirm} bulk={idsToDelete.length > 1} />
        </div>
    )
}

export default Pin
