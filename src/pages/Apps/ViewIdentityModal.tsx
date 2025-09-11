import React, { useEffect, useRef, useState } from 'react';
import { X, User, Briefcase, MapPin, Phone, Info, Paperclip, LinkIcon, Trash2, Save, Edit3, Eye, FileText, Trash } from 'lucide-react';
import apiClient from '@/service/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlldata, fetchcellIdData, fetchPersonalData } from '../../store/Slices/TableSlice';
import type { AppDispatch } from '@/store';
import { ImageFile } from '@/components/imageFile';
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
    const dispatch = useDispatch<AppDispatch>();
    const modalRef = useRef<HTMLDivElement>(null);
    const [details, setDetails] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState(!editMode);
    const [cellId, setCellId] = useState<string>()
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
                const dobString = apiItem.dob;
                const dobDate = new Date(dobString); // Parse the string into a Date object
                const cell = apiItem.cell_id
                setCellId(cell)
                // Format the Date object to "DD/MM/YYYY"
                const formattedDob = dobDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });

                const formattedData = {
                    id: apiItem.id,
                    title: apiItem.title,
                    personalDetails: {
                        fullName: apiItem.full_name,
                        dateOfBirth: formattedDob,
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
                console.error('Failed to fetch identity:', err);
                setError('Failed to load identity.');
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

    const handleSave = async () => {
        if (!details?.id) return;

        setLoading(true);
        setError(null);

        try {
            // Prepare the payload as needed by your API
            const payload = {
                title: details.title,
                full_name: details.personalDetails.fullName,
                dob: details.personalDetails.dateOfBirth,
                street_address: details.addressDetails.street,
                po_box: details.addressDetails.poBox,
                zip_code: details.addressDetails.zip,
                city: details.addressDetails.city,
                state: details.addressDetails.state,
                country: details.addressDetails.country,
                email: details.contactDetails.email,
                phone_number: details.contactDetails.phone,
                alt_phone: details.contactDetails.altPhone,
                home_phone: details.contactDetails.homePhone,
                mobile_phone: details.contactDetails.mobilePhone,
                work_phone: details.contactDetails.workPhone,
                website: details.contactDetails.website,
                company_name: details.workDetails.company,
                job_title: details.workDetails.position,
                department: details.workDetails.department,
                work_email: details.workDetails.workEmail,
                work_address: details.workDetails.workAddress,
                custom_sections: details.dynamicFields,
                attachments: details.attachments,
                notes: details.notes,
            };

            // Make PUT request
            await apiClient.put(`/api/identity/edit/${details.id}`, payload);

            // Close modal or give feedback on success
            onClose();
            if (location.pathname === '/all_items') {
                dispatch(fetchAlldata());
            }
            if (location.pathname === '/personal') {
                dispatch(fetchPersonalData())
            }
            if (cellId) {
                dispatch(fetchcellIdData(cellId));
            }
        } catch (err: any) {
            console.error('Failed to save identity:', err);
            setError('Failed to save identity.');
        } finally {
            setLoading(false);
        }
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

    const toggleViewMode = () => {
        setViewMode(!viewMode);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">
            <div ref={modalRef} className="bg-white dark:bg-[#1e1f24] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            {viewMode ? (
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{details?.title || 'Untitled'}</h2>
                            ) : (
                                <input
                                    type="text"
                                    value={details?.title || ''}
                                    onChange={(e) =>
                                        setDetails((prev: any) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="text-xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 text-gray-800 dark:text-white"
                                    autoFocus
                                    placeholder="Enter title"
                                />
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated: {details?.updatedAt ? new Date(details.updatedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={toggleViewMode} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title={viewMode ? 'Edit' : 'Preview'}>
                            {viewMode ? <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                        </button>
                        <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}

                    {/* Personal Details */}
                    <Section
                        title="Personal Details"
                        icon={<User className="w-4 h-4" />}
                        expanded={expandedSections.personal}
                        onToggle={() => setExpandedSections((prev) => ({ ...prev, personal: !prev.personal }))}
                        viewMode={viewMode}
                    >
                        {renderFields(details?.personalDetails, 'personalDetails', viewMode)}
                    </Section>

                    {/* Address Details */}
                    <Section
                        title="Address Details"
                        icon={<MapPin className="w-4 h-4" />}
                        expanded={expandedSections.address}
                        onToggle={() => setExpandedSections((prev) => ({ ...prev, address: !prev.address }))}
                        viewMode={viewMode}
                    >
                        {renderFields(details?.addressDetails, 'addressDetails', viewMode)}
                    </Section>

                    {/* Contact Details */}
                    <Section
                        title="Contact Details"
                        icon={<Phone className="w-4 h-4" />}
                        expanded={expandedSections.contact}
                        onToggle={() => setExpandedSections((prev) => ({ ...prev, contact: !prev.contact }))}
                        viewMode={viewMode}
                    >
                        {renderFields(details?.contactDetails, 'contactDetails', viewMode)}
                    </Section>

                    {/* Work Details */}
                    <Section
                        title="Work Details"
                        icon={<Briefcase className="w-4 h-4" />}
                        expanded={expandedSections.work}
                        onToggle={() => setExpandedSections((prev) => ({ ...prev, work: !prev.work }))}
                        viewMode={viewMode}
                    >
                        {renderFields(details?.workDetails, 'workDetails', viewMode)}
                    </Section>

                    {/* Dynamic Fields */}
                    {details?.dynamicFields?.length > 0 && (
                        <Section
                            title="Additional Fields"
                            icon={<Info className="w-4 h-4" />}
                            expanded={expandedSections.additional}
                            onToggle={() => setExpandedSections((prev) => ({ ...prev, additional: !prev.additional }))}
                            viewMode={viewMode}
                        >
                            {details.dynamicFields.map((field: any, idx: number) => (
                                <Field
                                    key={idx}
                                    label={field.id}
                                    value={field.value}
                                    viewMode={viewMode}
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
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
                            <FileText className="w-4 h-4" />
                            File{details?.attachments && details.attachments.length !== 1 ? 's' : ''}
                        </div>

                        {editMode ? (
                            <div className="space-y-3">
                                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-900/50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileText className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Any file type (Max: 10MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            setDetails((prev: { attachmentFiles: any }) => (prev ? { ...prev, attachmentFiles: [...(prev.attachmentFiles || []), ...files] } : prev));
                                        }}
                                    />
                                </label>

                                {details?.attachmentFiles && details.attachmentFiles.length > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
                                        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Selected files:</h4>
                                        <ul className="space-y-2">
                                            {details.attachmentFiles.map((file: File, idx: number) => (
                                                <li key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[70%]">{file.name}</span>
                                                    <button
                                                        onClick={() =>
                                                            setDetails((prev: { attachmentFiles: any[] }) =>
                                                                prev
                                                                    ? {
                                                                        ...prev,
                                                                        attachmentFiles: prev.attachmentFiles?.filter((_: any, i: number) => i !== idx),
                                                                    }
                                                                    : prev
                                                            )
                                                        }
                                                        className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
                                                        title="Remove file"
                                                    >
                                                        <Trash size={14} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`p-3 rounded-lg ${details?.attachments && details.attachments.length > 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-100/50 dark:bg-gray-800/30'}`}>
                                {details?.attachments && details.attachments.length > 0 ? (
                                    <ImageFile
                                        attachments={details.attachments.map((attachment: any, idx: number) => {
                                            let name = `File ${idx + 1}`;
                                            let encryptedData = '';
                                            let type = 'application/octet-stream';

                                            if (typeof attachment === 'string') {
                                                encryptedData = attachment;
                                                // Try to extract file name from encryptedData string if possible
                                                const match = attachment.match(/([^\/]+)$/);
                                                if (match) {
                                                    name = decodeURIComponent(match[1]);
                                                }
                                            } else if (typeof attachment === 'object' && attachment !== null) {
                                                name = attachment.name || name;
                                                encryptedData = attachment.encryptedData || '';
                                                type = attachment.type || type;
                                            }

                                            return {
                                                name,
                                                encryptedData,
                                                type,
                                            };
                                        })}
                                    />
                                ) : (
                                    <p className="text-gray-400 dark:text-gray-500 italic">No files uploaded</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {!viewMode && (
                    <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // ----------------------
    // Helper Functions
    // ----------------------

    function renderFields(obj?: Record<string, string>, sectionKey?: string, viewMode?: boolean) {
        if (!obj) return null;
        return Object.entries(obj).map(([key, value], index) => (
            <Field
                key={index}
                label={key}
                value={value}
                viewMode={viewMode}
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
    viewMode,
}: {
    title: string;
    children: React.ReactNode;
    icon: React.ReactNode;
    expanded: boolean;
    onToggle: () => void;
    viewMode?: boolean;
}) {
    const hasContent = React.Children.count(children) > 0;

    return (
        <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
            <button onClick={onToggle} className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center gap-3 text-gray-800 dark:text-gray-100">
                    <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{icon}</div>
                    <span className="font-medium">{title}</span>
                </div>
                {hasContent && (
                    <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {expanded && hasContent && <div className="p-4 bg-gray-50 dark:bg-gray-800 space-y-4">{children}</div>}

            {!hasContent && !viewMode && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm">
                    No {title.toLowerCase()} provided. {!viewMode && 'Click to add.'}
                </div>
            )}
        </div>
    );
}

// ----------------------
// Field Component
// ----------------------

function Field({ label, value, viewMode, onChange }: { label: string; value?: string; viewMode?: boolean; onChange?: (val: string) => void }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{formatLabel(label)}</label>
            {viewMode ? (
                <div className="text-gray-800 dark:text-gray-200 py-2">{value?.trim() || <span className="text-gray-400 dark:text-gray-500">Not provided</span>}</div>
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={`Enter ${formatLabel(label).toLowerCase()}`}
                />
            )}
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
