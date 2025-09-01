import React, { useState } from 'react';
import TaskList from "./Table";

const Personal = () => {
    // Dummy data
    const dummyData = [
        { id: '1', title: 'hello', type: 'Login' },
        { id: '2', title: 'Office ID Card', type: 'Identity Card' },
        { id: '3', title: 'Bank Password', type: 'Password' },
        { id: '4', title: 'Social Media Account', type: 'Login' },
        { id: '5', title: 'University ID', type: 'Identity Card' },
        { id: '6', title: 'WiFi Password', type: 'Password' },
        { id: '7', title: 'WiFi Password', type: 'Password' },
        { id: '8', title: 'WiFi Password', type: 'Password' },
        { id: '9', title: 'WiFi Password', type: 'Password' },
        { id: '10', title: 'WiFi Password', type: 'Password' },
        { id: '11', title: 'WiFi Password', type: 'Password' },
        { id: '12', title: 'WiFi Password', type: 'Password' },
        { id: '13', title: 'WiFi Password', type: 'Password' },
        { id: '14', title: 'WiFi Password', type: 'Password' },
        { id: '15', title: 'WiFi Password', type: 'Password' },
        { id: '16', title: 'WiFi Password', type: 'Password' },
        { id: '17', title: 'WiFi Password', type: 'Password' },
        { id: '18', title: 'WiFi Password', type: 'Password' },
        { id: '19', title: 'WiFi Password', type: 'Password' },
        { id: '20', title: 'Nishan', type: 'Password' },

    ];

    const [items, setItems] = useState(dummyData);
    const [loading, setLoading] = useState(false);

    // Handler functions
    const handleEdit = (id: string) => {
        console.log('Edit item with ID:', id);
        // You can implement your edit logic here
        alert(`Editing item with ID: ${id}`);
    };

    const handleDelete = (id: string) => {
        console.log('Delete item with ID:', id);
        // Remove the item from state
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        alert(`Deleted item with ID: ${id}`);
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
                // filterOptions={['All Items', 'Login', 'Identity Card', 'Password']}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                isLoading={loading}
            />
        </div>
    )
}

export default Personal


