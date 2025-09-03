import React, { useState, useEffect } from 'react';
import TaskList from "./Table";
import { getPindata } from '@/service/TableDataService';

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

    const [items, setItems] = useState(dummyData);
    // const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         console.log("pin data")
    //         try {
    //             setLoading(true)
    //             const res = await getPindata();
    //             console.log("all data", res);
    //             setItems(res.data);
    //         } catch (err) {
    //             console.log("backend error")
    //             console.error(err)
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);


    // Handler functions
    const handleEdit = (id: string) => {
        console.log('Edit item with ID:', id);
        alert(`Editing item with ID: ${id}`);
    };

    const handleDelete = (id: string) => {
        console.log('Delete item with ID:', id);
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        alert(`Deleted item with ID: ${id}`);
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
                onView={handleView}
                isLoading={loading}
            />
        </div>
    )
}

export default Pin
