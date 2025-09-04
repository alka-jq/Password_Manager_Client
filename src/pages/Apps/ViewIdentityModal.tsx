import React, { useEffect, useRef, useState } from 'react';
import {
    X,
    User,
    Briefcase,
    MapPin,
    Phone,
    Info,
    Paperclip,
    LinkIcon,
    Trash2,
} from 'lucide-react';
import apiClient from '@/service/apiClient';

// ----------------------
// Types
// ----------------------

type TableItem = {
    id: string;
    title: string;
    type: string;
};

type Props = {
    item: TableItem | null;
    onClose: () => void;
    editMode?: boolean;
};

// ----------------------
// Main Component
// ----------------------

const ViewIdentityModal = ({ item, onClose, editMode = false }: Props) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [details, setDetails] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        personal: true,
        address: true,
        contact: true,
        work: true,
        additional: true,
        attachments: true,
    });

    // ----------------------
    // Fetch identity from API
    // ----------------------
    useEffect(() => {
        if (!item?.id) return;

        const fetchIdentity = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/api/password/items/${item.id}`);

                const apiItem = response.data.item;

                const formattedData = {
                    id: apiItem.id,
                    title: apiItem.title,
                    personalDetails: {
                        fullName: apiItem.full_name,
                        dateOfBirth: apiItem.dob,
                    },
                    addressDetails: {
                        street: apiItem.street_address,
                        poBox: apiItem.po_box,
                        zip: apiItem.zip_code,
                        city: apiItem.city,
                        state: apiItem.state,
                        country: apiItem.country,
                    },
                    contactDetails: {
                        email: apiItem.email,
                        phone: apiItem.phone_number,
                        altPhone: apiItem.alt_phone,
                        homePhone: apiItem.home_phone,
                        mobilePhone: apiItem.mobile_phone,
                        workPhone: apiItem.work_phone,
                        website: apiItem.website,
                    },
                    workDetails: {
                        company: apiItem.company_name,
                        position: apiItem.job_title,
                        department: apiItem.department,
                        workEmail: apiItem.work_email,
                        workAddress: apiItem.work_address,
                    },
                    dynamicFields: apiItem.custom_sections || [],
                    attachments: apiItem.attachments || [],
                    notes: apiItem.notes,
                    updatedAt: apiItem.updated_at,
                };

                setDetails(formattedData);
            } catch (err: any) {
                console.error("Failed to fetch identity:", err);
                setError("Failed to load identity.");
            } finally {
                setLoading(false);
            }
        };

        fetchIdentity();
    }, [item]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleSave = () => {
        console.log('Saving item:', details);
        // Implement your API save logic here
        onClose();
    };

    const handleRemoveAttachment = (index: number) => {
        setDetails((prev: any) => {
            if (!prev) return prev;
            const updated = [...prev.attachments];
            updated.splice(index, 1);
            return { ...prev, attachments: updated };
        });
    };

    const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDetails((prev: any) => ({
                ...prev,
                attachments: [...(prev.attachments || []), file.name],
            }));
            e.target.value = ''; // reset input
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
            <div
                ref={modalRef}
                className="bg-white dark:bg-[#1e1f24] rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                        <User className="w-5 h-5" /> {details?.title || 'Untitled'}
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4 text-sm">
                    {/* Personal Details */}
                    <Section
                        title="Personal Details"
                        icon={<User className="w-4 h-4" />}
                        expanded={expandedSections.personal}
                        onToggle={() => toggleSection('personal')}
                    >
                        {renderFields(details?.personalDetails, 'personalDetails')}
                    </Section>

                    {/* Address Details */}
                    <Section
                        title="Address Details"
                        icon={<MapPin className="w-4 h-4" />}
                        expanded={expandedSections.address}
                        onToggle={() => toggleSection('address')}
                    >
                        {renderFields(details?.addressDetails, 'addressDetails')}
                    </Section>

                    {/* Contact Details */}
                    <Section
                        title="Contact Details"
                        icon={<Phone className="w-4 h-4" />}
                        expanded={expandedSections.contact}
                        onToggle={() => toggleSection('contact')}
                    >
                        {renderFields(details?.contactDetails, 'contactDetails')}
                    </Section>

                    {/* Work Details */}
                    <Section
                        title="Work Details"
                        icon={<Briefcase className="w-4 h-4" />}
                        expanded={expandedSections.work}
                        onToggle={() => toggleSection('work')}
                    >
                        {renderFields(details?.workDetails, 'workDetails')}
                    </Section>

                    {/* Dynamic Fields */}
                    {details?.dynamicFields?.length > 0 && (
                        <Section
                            title="Additional Fields"
                            icon={<Info className="w-4 h-4" />}
                            expanded={expandedSections.additional}
                            onToggle={() => toggleSection('additional')}
                        >
                            {details.dynamicFields.map((field: any, idx: number) => (
                                <Field
                                    key={idx}
                                    label={field.id}
                                    value={field.value}
                                    editMode={editMode}
                                    onChange={(newVal) =>
                                        setDetails((prev: any) => {
                                            const newFields = [...prev.dynamicFields];
                                            newFields[idx] = { ...newFields[idx], value: newVal };
                                            return { ...prev, dynamicFields: newFields };
                                        })
                                    }
                                />
                            ))}
                        </Section>
                    )}

                    {/* Attachments */}
                    {details?.attachments && (
                        <Section
                            title={`Attachments (${details.attachments.length})`}
                            icon={<Paperclip className="w-4 h-4" />}
                            expanded={expandedSections.attachments}
                            onToggle={() => toggleSection('attachments')}
                        >
                            {details.attachments.map((file: string, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between text-xs text-blue-600 hover:underline"
                                >
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="w-3 h-3" />
                                        {file}
                                    </div>
                                    {editMode && (
                                        <button
                                            onClick={() => handleRemoveAttachment(idx)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded-md"
                                            title="Remove attachment"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Add Attachment Input (visible in editMode) */}
                            {editMode && (
                                <div className="mt-3">
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Add Attachment
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleAddAttachment}
                                        className="block w-full text-xs text-gray-700 dark:text-white file:mr-3 file:py-1 file:px-2 file:rounded file:border file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            )}
                        </Section>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 border-t text-xs text-gray-500 dark:text-gray-400 dark:border-gray-700 flex justify-between items-center">
                    <div>Last updated: {new Date(details?.updatedAt).toLocaleDateString()}</div>
                    <div className="flex gap-2">
                        {editMode && (
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
                            >
                                Save
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // ----------------------
    // Helpers
    // ----------------------

    function toggleSection(key: string) {
        setExpandedSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    function renderFields(
        obj?: Record<string, string>,
        sectionKey?: string
    ) {
        if (!obj) return null;
        return Object.entries(obj).map(([key, value], index) => (
            <Field
                key={index}
                label={key}
                value={value}
                editMode={editMode}
                onChange={(newVal) =>
                    setDetails((prev: any) => ({
                        ...prev,
                        [sectionKey!]: {
                            ...prev?.[sectionKey!],
                            [key]: newVal,
                        },
                    }))
                }
            />
        ));
    }
};

// ----------------------
// Section Component
// ----------------------

function Section({
    title,
    children,
    icon,
    expanded,
    onToggle,
}: {
    title: string;
    children: React.ReactNode;
    icon: React.ReactNode;
    expanded: boolean;
    onToggle: () => void;
}) {
    const hasContent = React.Children.count(children) > 0;

    return (
        <div className="border rounded-md dark:border-gray-700">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    {icon}
                    <span className="font-medium">{title}</span>
                </div>
                {hasContent && (
                    <svg
                        className={`w-4 h-4 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {expanded && hasContent && <div className="p-2 space-y-2">{children}</div>}

            {!hasContent && (
                <div className="p-2 text-gray-400 dark:text-gray-500 text-sm">
                    No {title.toLowerCase()} provided.
                </div>
            )}
        </div>
    );
}

// ----------------------
// Field Component
// ----------------------

function Field({
    label,
    value,
    editMode,
    onChange,
}: {
    label: string;
    value?: string;
    editMode?: boolean;
    onChange?: (val: string) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start">
            <label className="text-xs font-medium text-gray-500 uppercase sm:w-1/3">
                {formatLabel(label)}
            </label>
            <div className="sm:w-2/3 break-words text-gray-800 dark:text-gray-200">
                {editMode ? (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="w-full p-2 mt-1 rounded border dark:bg-gray-900 dark:text-white text-sm"
                    />
                ) : (
                    <span>{value?.trim() || 'Not provided'}</span>
                )}
            </div>
        </div>
    );
}

// ----------------------
// Helper Functions
// ----------------------

function formatLabel(str: string) {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
}

export default ViewIdentityModal;
