'use client';

import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerModalProps {
    mailId: string;
    onClose: () => void;
    onSave: (mailId: string, selectedDate: Date) => void;
    initialDate?: Date;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
    mailId,
    onClose,
    onSave,
    initialDate = new Date()
}) => {
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [dateInput, setDateInput] = useState(initialDate.toISOString().split('T')[0]);
    const [timeInput, setTimeInput] = useState(
        `${initialDate.getHours().toString().padStart(2, '0')}:${initialDate.getMinutes().toString().padStart(2, '0')}`
    );
    const modalRef = useRef<HTMLDivElement>(null);
    //   const [selectedDate, setSelectedDate] = useState('2025-06-21');
    const [selectedTime, setSelectedTime] = useState('15:16');

    // Handle click outside and ESC key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleDateChange = (date: Date) => {
        const newDate = new Date(date);
        // Preserve the current time when only changing the date
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
        updateSelectedDate(newDate);
    };

    const handleManualInput = () => {
        const combined = new Date(`${dateInput}T${timeInput}`);
        if (!isNaN(combined.getTime())) {
            updateSelectedDate(combined);
        }
    };

    const updateSelectedDate = (date: Date) => {
        setSelectedDate(date);
        setDateInput(date.toLocaleDateString('en-CA'));
        setTimeInput(
            date.getHours().toString().padStart(2, '0') +
            ':' +
            date.getMinutes().toString().padStart(2, '0')
        );
    };
    const parseDateTime = (dateStr: string, timeStr: string): Date | null => {
        try {
            const [year, month, day] = dateStr.split('-').map(Number);
            const [hours, minutes] = timeStr.split(':').map(Number);

            // Create date in UTC to avoid timezone issues
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

            // Validate the date
            return isNaN(date.getTime()) ? null : date;
        } catch {
            return null;
        }
    };
    const handleSave = () => {
        const finalDate = parseDateTime(dateInput, timeInput);
        if (finalDate) {
            onSave(mailId, finalDate);
            onClose();
        } else {
            // Handle invalid date case
            console.error('Invalid date/time combination');
        }
    };
    return (
        <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div

                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 cursor-auto"
            >
                <h2 className="text-lg font-medium mb-4 text-gray-900 lightmint:text-white dark:text-white">
                    Pick date & time
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-around">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => handleDateChange(date || new Date())}
                        inline
                        calendarClassName="border-0"
                        dayClassName={() => "hover:bg-gray-100 dark:hover:bg-gray-700 rounded"}
                    />

                    <div className="flex flex-col gap-3 justify-center">
                        <div>
                            <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date
                            </label>
                            <input
                                id="date-input"
                                type="date"
                                value={dateInput}
                                onChange={(e) => {
                                    setDateInput(e.target.value);
                                    handleManualInput();
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="time-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Time
                            </label>
                            <input
                                id="time-input"
                                type="time"
                                value={timeInput}
                                onChange={(e) => {
                                    setTimeInput(e.target.value);
                                    handleManualInput();
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                        disabled={!selectedDate}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal;