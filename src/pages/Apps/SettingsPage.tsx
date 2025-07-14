'use client';

import { Check, ChevronDown, ChevronUp, FileText, Info, MoreHorizontal, Search, Send, Shield, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Key } from 'react-feather';
import { FcGoogle } from 'react-icons/fc';
import { MdKeyboardBackspace, MdOutlineLockPerson } from 'react-icons/md';
import { PiExportFill, PiFolderSimplePlusFill, PiMicrosoftOutlookLogoFill } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import calendar from '../../assets/images/ubs icons/calender.png';
// import contact from '../../assets/images/contect.png';
// import meeting from '../../assets/images/meet.png';
// import pad from '../../assets/images/pad.png';
// import personal from '../../assets/images/personal.png';
import premium from '../../assets/images/premium.png';
import { useSettings } from '../../useContext/useSettings';
import logo from '../../assets/images/UB_Logos/ublogo.png';
import sheet from '../../assets/images/ubs icons/sheet.png';
import Header from '../../components/Layouts/Header';
import pad from '../../assets/images/ubs icons/pad.png';
import contact from '../../assets/images/ubs icons/contect.png';
import meeting from '../../assets/images/ubs icons/meet.png';
import personal from '../../assets/images/personal.png';
import { MdFeedback, MdHelpOutline } from 'react-icons/md';
import plus from '../../assets/images/Plus.png';
import MyTask from '../Components/MyTask';
import MyContact from '../Components/MyContact';
import Todo from '../Components/Todo';

//Keybord, Palette remove frome react-feather

// Import UI components
import Tippy from '@tippyjs/react';
import axios from 'axios';
import { Hand } from 'lucide-react';
import { BsGlobe, BsShieldLock, BsSliders } from 'react-icons/bs';
import { CgKey } from 'react-icons/cg';
import { FaRegKeyboard } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { GoDotFill } from 'react-icons/go';
import { GrEdit } from 'react-icons/gr';
import { HiOutlineFilter } from 'react-icons/hi';
import { IoArrowBack, IoChevronBackCircleOutline, IoKeyOutline } from 'react-icons/io5';
import { LuClock5 } from 'react-icons/lu';
import { MdManageAccounts, MdNotificationsNone } from 'react-icons/md';
import { PiFolderSimplePlusBold } from 'react-icons/pi';
import { RiDeleteBin6Line, RiImportFill, RiUserLocationLine } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { TbArrowBigUpLines, TbFilterCog, TbMailCog, TbUsers } from 'react-icons/tb';
import { TfiPaintRoller } from 'react-icons/tfi';
import { TiArrowForwardOutline } from 'react-icons/ti';
import { toast, Toaster } from 'sonner';
import mailIcon from '../../assets/images/ubsmail_logo.png';
import { useAuth } from '../../useContext/AppState';
import { Avatar, AvatarFallback, AvatarImage } from '../Components/ui/avatar';
import { Button } from '../Components/ui/button';
import { Card, CardContent } from '../Components/ui/card';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Components/ui/select';
import { Separator } from '../Components/ui/separator';
import { Switch } from '../Components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/ui/tabs';
import { useEmailPagination } from '../../useContext/EmailPaginationContext';
import RowLoader from '@/components/Layouts/RowLoader';
import { fetchUserKeys, initializeCrypto } from '@/utils/cryptoUtils';
import { decryptAvatar, encryptAvatar } from '@/utils/image-encryption';
import GmailImport from './GmailImport';
import IconMenuCalendar from '@/components/Icon/Menu/IconMenuCalendar';
import SideCalendar from '../Components/SideCalendar';
import { RiArrowLeftSLine } from 'react-icons/ri';
import PageLoader from '@/components/Layouts/PageLoader';
import drive from '../../assets/images/UB_Logos/ubdrive.png';

// import { useEmailPagination } from '@/useContext/EmailPaginationContext';

// Simple SVG icons (you can replace with more sophisticated ones)
const GmailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
        <path
            fill="currentColor"
            d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.649 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.076 3 1.5 3H2l10 7.25L22 3h.5c.425 0 .8.162 1.069.432.27.268.431.643.431 1.068z"
        />
    </svg>
);

const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
        <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
    </svg>
);

const avlLanguages = [
    { code: 'en_us', name: 'English', countryCode: 'US' },
    { code: 'en_GB', name: 'English', countryCode: 'UK' },
    { code: 'fr_FR', name: 'French', countryCode: 'GB' },
    { code: 'de_DE', name: 'German', countryCode: 'DE' },
    { code: 'es_ES', name: 'Spanish', countryCode: 'ES' },
];

type FolderName = 'Inbox' | 'Drafts' | 'Sent' | 'Starred' | 'Snoozed' | 'Spam' | 'Trash';

interface Folders {
    name: FolderName;
    total: number;
    // other properties
}

const folderColors: Record<FolderName, { dot: string; bg: string; text: string }> = {
    Inbox: { dot: '#1a488e', bg: '#33c2b61e', text: '#21837b' },
    Drafts: { dot: '#f97316', bg: '#f9741621', text: '#683918' },
    Sent: { dot: '#3b82f6', bg: '#bfdbfe', text: '#1e40af' },
    Starred: { dot: '#eab308', bg: '#fef08a', text: '#78350f' },
    Snoozed: { dot: '#a855f7', bg: '#ddd6fe', text: '#5b21b6' },
    Spam: { dot: '#ef4444', bg: '#fecaca', text: '#7f1d1d' },
    Trash: { dot: '#b91c1c', bg: '#fca5a5', text: '#7f1d1d' },
};

interface Domain {
    id: string;
    domain_name: string;
    is_verify: boolean;
    key: string;
    created_at: string;
    updated_at: string;
    dkim: string;
    dmarc: string;
    mx: string;
    spf: string;
    is_deleted: boolean;

    // add other fields if you have them
}

interface Profile {
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    is_verified?: boolean;
    avatar?: string;
    is_admin?: boolean;
    two_factor_enabled?: boolean;
    mobile?: string;
    language?: {
        code: string;
        name: string;
        countryCode: string;
    };
    timezone?: string;
    RecoveryEmail?: string;
    show_preview?: boolean;
    email?: string;
    preferences?: {
        HideSenderIP?: boolean;
        Theme?: string;
        AutoLoadRemoteContent?: boolean;
        E2EEncryption?: boolean;
        SignAllMessages?: boolean;
        AutoSaveDraft?: boolean;
        RequestLinkConfirmation?: boolean;
        AttachPublicKey?: boolean;
        UsageDataCollection?: boolean;
        CrashReportsEnabled?: boolean;
        MailReadMarking?: string;
        includeSignatureByDefault?: boolean;
        RequestReadReceipts?: boolean;
        SendReadReceipts?: string;
        UndoSendTime?: string;
        DefaultSendBehavior?: string;
        AttachmentReminder?: boolean;
        ApplyToAddress?: string;
        FontFamily?: string;
        FontSize?: string;
        ComposerMode?: string;
        DefaultComposerSize?: string;
        VacationAutoResponder?: {
            status?: boolean;
            StartDate?: string;
            EndDate?: string;
            Subject?: string;
            Message?: string;
            SendToContactsOnly?: boolean;
            SendOncePerSender?: boolean;
        };
        FixedAutoResponder?: {
            status?: boolean;
            Subject?: string;
            Message?: string;
            SendOncePerSender?: boolean;
            SendOncePerDay?: boolean;
        };
        Notifications?: {
            CalendarEventNotifications?: boolean;
            NewsLetterNotifications?: boolean;
            NewEmailNotifications?: boolean;
            ImportantEmailNotifications?: boolean;
        };
        KeySettings?: {
            AutoDownloadPublicKeyas?: boolean;
            AttachPublicKeyToMessage?: boolean;
            SignAllOutgoingMessage?: boolean;
            keyserver?: string;
        };
        MobileNotification?: {
            PushNotification?: boolean;
            EmailPreviewInNotification?: boolean;
            QuietHours?: boolean;
            QuietHoursStart?: string;
            QuietHoursEnd?: string;
        };
        NotificationPreference?: {
            DesktopNotifications?: boolean;
            SoundAlerts?: boolean;
            BrowserTabNotifications?: boolean;
            NotificationDuration?: string;
        };
        SpamFilters?: {
            SpamProtectionLevel?: string;
            AutomaticallyDeleteSpam?: boolean;
            ShowSpamNotification?: boolean;
        };
    };
}

interface Folder {
    folder_id: string;
    name: string;
    messageCount?: number;
}

interface Organization {
    id: string;
    name: string;
    ids: string;
    logo?: string;
    key: string;
}

const SettingsPage = () => {
    const [authVerify, setAuthVerify] = useState(false);
    const [uploadLogo, setUploadLogo] = useState(false);
    const [changeOrgKey, setChangeOrgKey] = useState(false);
    const [blockModal, setBlockModal] = useState(false);
    const [allowMail, setAllowMail] = useState(false);
    const [addressModal, setAddressModal] = useState(false);
    const [editEmailAddress, setEmailAddress] = useState(false);
    const [sliderValue, setSliderValue] = useState(181);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [userEdit, setUserEdit] = useState(false);
    const [newAccount, setNewAccount] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [activeTab, setActiveTab] = useState('account');
    const [profile, setProfile] = useState<Profile>({});
    // const [preferences, setPreferences] = useState<Profile['preferences']>({});
    const [password, setpassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [googleAutoFoloing, setGoogleAutoFoloing] = useState(false);
    const [googleImport, setGoogleImport] = useState(false);
    const [yahooImport, setYahooImport] = useState(false);
    const [outLookImport, setOutLookImport] = useState(false);
    const [otherImport, setOtherImport] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateProfileObj, setUpdateProfileObj] = useState<Profile>({});
    type AddressType = 'Email' | 'Domain';
    const navigate = useNavigate();
    const [orgNameEdit, setOrgNameEdit] = useState(false);
    const [orgIdentityEdit, setOrgIdentityEdit] = useState(false);
    const [selectedIdentity, setSelectedIdentity] = useState('himansingh9@UBS.me');
    const [addressType, setAddressType] = useState<AddressType>('Email');
    const [deleteDomainName, setDeleteDomainName] = useState<Domain | null>(null);
    const [addressSpam, setAddressSpam] = useState('');
    const [spanModal, setSpanModal] = useState(false);
    const [AddAddressDomain, setAddAddressDomain] = useState(false);
    const [domainActiveTab, setdomainActiveTab] = useState('Domain');
    const [addDomain, setAddDomain] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [FilterActiveTab, setFilterActiveTab] = useState('Spam');
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [address, setAddress] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isDropdownOpenModal, setIsDropdownOpenModal] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState('@UBS.me');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const domains = ['@UBS.me', '@UBSmail.com', '@UBSmail.ch', '@pm.me'];
    const [editEmailAddressModal, setEditEmailAddressModal] = useState(false);
    const [addressValue, setAddressValue] = useState('himansingh9');
    const [displayNameValue, setDisplayNameValue] = useState('');
    const [activeFilterDropdown, setFilterActiveDropdown] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const domainName = '@UBS.me';
    const [reviewDomain, setReviewDomain] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [taskOpen, setTaskOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [todoOpen, setTodoOpen] = useState(false);
    const [rightSidePanel, setRightSidePanel] = useState(true);
    const [plusOpensidebar, setPlusOpensidebar] = useState(false);
    const [showArrowButton, setShowArrowButton] = useState(true);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleAccDelete = async () => {
        try {
            const response = await fetch(`${baseUrl}/users/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("delete res----->", response)

            if (response.ok) {
                toast.success('Your account has been successfully deleted.');
                setShowModal(false);
                // router.push('/login');
            } else {
                const result = await response.json();
                toast.error(result.error || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Account deletion failed:', error);
            toast.error('Something went wrong while deleting your account');
        }
    };



    const handleSectionChange = (section: any) => {
        // Close all sections first
        setOpenCalendar(false);
        setTaskOpen(false);
        setContactOpen(false);
        setTodoOpen(false);

        // Open the clicked section
        if (section === 'calendar') setOpenCalendar(true);
        if (section === 'task') setTaskOpen(true);
        if (section === 'contact') setContactOpen(true);
        if (section === 'todo') setTodoOpen(true);
    };

    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
    const toggleDropdownFilter = (email: string) => {
        if (activeFilterDropdown === email) {
            setFilterActiveDropdown(null);
        } else {
            setFilterActiveDropdown(email);
        }
    };

    const handleFilterAction = (action: string, email: string) => {
        console.log(`Action: ${action} for ${email}`);
        setFilterActiveDropdown(null);
    };
    //-------------------- System folder -----------------------//
    // Assuming this is inside a React component
    const { pagination } = useEmailPagination();
    const systemFolder = pagination?.systemFolder ?? {};

    const [systemFolders, setSystemFolders] = useState<any[]>([]);
    const { preferences, updatePreferences, toggleAndUpdatePreference, submitUpdatedPreferences, setPreferences } = useSettings();

    // Effect to update state when systemFolder changes
    useEffect(() => {
        const targetFolders = ['Inbox', 'Sent', 'Drafts', 'Trash', 'Spam', 'Archive'];
        const filteredFolders = Object.values(systemFolder).filter((folder: any) => targetFolders.includes(folder.name));
        setSystemFolders(filteredFolders);
    }, [systemFolder]);

    // Effect to log systemFolder info
    useEffect(() => {
        Object.entries(systemFolder).forEach(([key, folder]: [string, any]) => {
            console.log('Folder ID:', key);
            console.log('Folder name:', folder.name);
            console.log('Folder total:', folder.total);
        });
        console.log('----------------system', systemFolder);
    }, [systemFolder]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpenModal(false);
                setAddAddressDomain(false);
                setFilterActiveDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isValidAddress = () => {
        if (!addressSpam) return false;

        if (addressType === 'Email') {
            // Simple email validation
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressSpam);
        } else {
            // Simple domain validation
            return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(addressSpam);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpenModal(!isDropdownOpenModal);
    };

    const selectOption = (option: string) => {
        setSelectedOption(option);
        setIsDropdownOpenModal(false);
        // Here you would typically handle the selection, like opening a modal to add an address
    };

    const toggleMenu = (index: number) => {
        if (openMenuIndex === index) {
            setOpenMenuIndex(null);
        } else {
            setOpenMenuIndex(index);
        }
    };

    // Calculate percentage for positioning
    const percentage = (sliderValue / 1024) * 100;

    // Handle slider track click
    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const newValue = Math.round((clickPosition / rect.width) * 1024);
        setSliderValue(Math.max(0, Math.min(1024, newValue)));
    };

    // Handle drag start
    const handleDragStart = () => {
        setIsDragging(true);
    };

    // Handle drag end
    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Handle mouse move during drag
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const movePosition = e.clientX - rect.left;
        const newValue = Math.round((movePosition / rect.width) * 1024);
        setSliderValue(Math.max(0, Math.min(1024, newValue)));
    };

    // Set up event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleDragEnd);
        };
    }, [isDragging]);

    const handleAction = (action: string, email: string) => {
        // Here you would handle the action (Block, Allow, Delete)
        console.log(`Action: ${action}, Email: ${email}`);
        setOpenMenuIndex(null);
    };

    const { token } = useAuth();

    const updateProfile = (name: string, value: any) => {
        setUpdateProfileObj((prev) => ({ ...prev, [name]: value }));
    };

    // const updatePreferences = (name: string, value: any) => {
    //     console.log(name, value, 'UPDATE PREFERENCES CALLED');
    //     setPreferences((prev) => ({ ...prev, [name]: value }));
    // };

    const submitUpdatedProfile = async (updatedObj: Profile | null = null) => {
        const finalPayload = updatedObj || updateProfileObj;

        try {
            const response = await fetch(`${baseUrl}/users/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ updates: finalPayload }),
            });

            fetchProfile();
            toast.success('Profile Updated Successfully!');
        } catch (err) {
            toast.error('Error in updating profile');
        }
    };

    // const submitUpdatedPreferences = async (updatedPrefObj: any = null) => {
    //     const finalPayload = updatedPrefObj || preferences;
    //     try {
    //         const response = await fetch(`${baseUrl}/users/update-preference`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(finalPayload),
    //         });

    //         fetchProfile();
    //         toast.success('Profile Updated Successfully!');
    //     } catch (err) {
    //         toast.error('Error in updating profile');
    //     }
    // };

    // const toggleAndUpdatePreference = (name: string, value: string | boolean | Record<string, any>) => {
    //     const updated = { ...preferences, [name]: value };
    //     setPreferences(updated);
    //     submitUpdatedPreferences(updated);
    // };

    const toggleUpdateAndSave = (name: string, value: string | boolean) => {
        const updated = { ...updateProfileObj, [name]: value };
        setUpdateProfileObj(updated);
        submitUpdatedProfile(updated);
    };

    useEffect(() => {
        if (profile) {
            setUpdateProfileObj({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                is_active: profile.is_active ?? false,
                is_verified: profile.is_verified ?? false,
                is_admin: profile.is_admin ?? false,
                two_factor_enabled: profile.two_factor_enabled ?? false,
                mobile: profile.mobile || '',
                language: profile.language || { code: '', name: '', countryCode: '' },
                timezone: profile.timezone || '',
                RecoveryEmail: profile.RecoveryEmail || '',
                show_preview: profile.show_preview ?? false,
                email: profile.email || '',
            });
        }
    }, [profile]);

    const [checkOpen, setcheckOpen] = useState(true);

    const [selectedOptions, setSelectedOptions] = useState({
        emails: true,
        contacts: true,
        calendar: true,
    });

    const handleOptionChange = (option: keyof typeof selectedOptions) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [option]: !prev[option],
        }));
    };
    const handleCancel = () => {
        setcheckOpen(false);
    };
    const handleStartImport = () => {
        console.log('Starting import with options:', selectedOptions);
        // Handle import logic here
        setGoogleImport(false);
        setcheckOpen(false);
        setIsImportModalOpen(true);

        // if (!checkOpen) return null;
    };

    const handleCloseModal = () => {
        setIsImportModalOpen(false);
    };

    const submitUpdatedPassword = async () => {
        if (newPassword !== confirmPassword) return toast.error('Password did not match.');
        try {
            const response = await fetch(`${baseUrl}/users/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword: password, newPassword: newPassword }),
            });
            toast.success('Password Updated');
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProfile = async () => {
        try {
            let response = await fetch(`${baseUrl}/users/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            let json = await response.json();
            console.log(json, 'JSON PROFILE');
            let decryptedImage = await decryptAvatarImg(json.avatar);
            // console.log(decryptedImage, "Decrypted Image")
            setProfile({ ...json, avatar: decryptedImage });
            setPreferences(json.preferences);
        } catch (err) {
            console.log(err);
        }
    };

    const decryptAvatarImg = async (avatar: string) => {
        let decryptedAvatar = await decryptAvatar(avatar);
        //  console.log(decryptedAvatar, "decrtyped avatar")
        return decryptedAvatar;
    };

    useEffect(() => {
        fetchProfile();
    }, [token]);

    const goBack = () => {
        navigate(-1);
    };

    ///-----create folder-----------------//
    const [plusOpen, setPlusOpen] = useState(false);
    const [labelData, setLabelData] = useState({ name: '' });
    const [customFolder, setCustomFolder] = useState<Folder[]>([]);
    const [editFolderId, setEditFolderId] = useState<string | null>(null); // null means create mode
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

    // console.log(labelData,"test lable")
    // console.log(customFolder, '.................');
    // const creatNewFolder = async (e)=>{
    //       console.log("labledata",labelData)
    //       e.preventDefault();
    //       console.log(labelData, "Label Data");

    //       try{
    //           let response:any = await fetch("http://api.ubshq.com/folders/create-folder", {
    //               method: "POST",
    //               headers: {
    //                   'Content-Type' : "application/json",
    //                   'Authorization' : `Bearer ${token}`
    //               },
    //               body: JSON.stringify(labelData)
    //           });
    //           console.log(response);
    //           setPlusOpen(false);
    //       }catch(err){
    //           console.log(err);
    //       }
    //   }
    const creatNewFolder = async (e: any) => {
        e.preventDefault();

        const url = editFolderId ? `${baseUrl}/folders/editFolder/${editFolderId}` : `${baseUrl}/folders/create-folder`;

        const method = editFolderId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(labelData),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText);
            }

            // Refresh and reset
            await fetchFolders();
            setPlusOpen(false);
            setLabelData({ name: '' });
            setEditFolderId(null); // reset mode
        } catch (err) {
            console.error('Folder operation failed:', err);
        }
    };

    const fetchFolders = async () => {
        try {
            const response = await fetch(`${baseUrl}/folders?type=custom`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Make sure `token` is defined in scope
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            setCustomFolder(json.folders);
            // console.log('Fetched folders:', json.folders);

            // If you want to store folders in state:
            // setFetchedFolders(json.folders);
        } catch (err) {
            console.error('Failed to fetch folders:', err);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    const deleteFolder = async (folderId: string) => {
        try {
            const response = await fetch(`${baseUrl}/folders/deleteFolder/${folderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText);
            }

            // console.log('Folder deleted successfully.');
            await fetchFolders(); // Refresh the folder list
        } catch (err) {
            console.error('Error deleting folder:', err);
        }
    };

    // uploadLogo
    const [file, setFile] = useState<File | null>(null);
    const [isDraggingLogo, setIsDraggingLogo] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File) => {
        setError(null);

        // Check file type
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)) {
            setError('File must be in PNG or JPEG format');
            return;
        }

        // Check file size (30KB = 30 * 1024 bytes)
        if (selectedFile.size > 30 * 1024) {
            setError('File must not be larger than 30 KB');
            return;
        }

        // Create a preview URL
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);

        // Check image dimensions
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            if (img.width < 128 || img.height < 128) {
                setError('Image must be at least 128x128 pixels');
                setPreviewUrl(null);
                return;
            }
            if (img.width !== img.height) {
                setError('Image must be square');
                setPreviewUrl(null);
                return;
            }
            setFile(selectedFile);
        };
        img.src = url;
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingLogo(true);
    };

    const handleDragLeave = () => {
        setIsDraggingLogo(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingLogo(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleSelectFileClick = () => {
        fileInputRef.current?.click();
    };

    // const handleSave = () => {
    //   if (file) {
    //     console.log("Saving logo:", file.name)
    //     // In a real app, you would upload the file to your server here
    //     onClose?.()
    //   }
    // }

    /*AuthVerify*/
    const [authPassword, setAuthPassword] = useState('');
    const [showAuthPassword, setShowAuthPassword] = useState(false);

    const handleAuthSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log('Authenticating with password');
    };

    // organization apis
    const [organizationName, setOrganizationName] = useState<Organization>({ id: '', name: '', ids: '', logo: '', key: '' });
    const [editOrganizationName, setEditOrganizationName] = useState<string>('');
    // console.log('edit', editOrganizationName);
    useEffect(() => {
        const config = {
            url: `${baseUrl}/organisations/get`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        axios(config)
            .then((response) => {
                console.log(response.data[0], 'organization data');
                setOrganizationName({ id: response.data[0].id, name: response.data[0].name, ids: response.data[0].ids, logo: response.data[0].logo, key: response.data[0].key });
                setEditOrganizationName(response.data[0].name);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // organization apis edit
    const handleEditOrganization = (id: string) => {
        const config = {
            url: `${baseUrl}/organisations/updateName/${id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: {
                name: editOrganizationName, // No need for template string unless you're combining variables
            },
        };

        axios(config)
            .then((response) => {
                console.log(response.data[0], 'organization data edit');
                // Optionally show success message or update state here
            })
            .catch((error) => {
                console.error('Error updating organization name:', error);
            });
    };

    // useEffect(()=>{
    //    const config = {
    //         url: `https://organisation-server.onrender.com/v1/organisations/updateLogo/${logo}`,
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${token}`,
    //         },
    //     };
    //     axios(config)
    //         .then((response) => {
    //             console.log(response.data, 'upload file');

    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // },[])

    const handleOrgnizationKey = (id: string) => {
        fetch(`${baseUrl}/organisations/updatekeys/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
    };

    ///-------------------add organisation -------------------//
    // function addOrganisation() {
    //   const requestBody = {
    //     name: "Designer Web LL",
    //     ids: "alka12@ubs.me",
    //     logo: "https://i.pinimg.com/474x/76/4d/59/764d59d32f61f0f91dec8c442ab052c5.jpg",
    //     key: "97A7sjZ6V0xDT3e7ai7wXwdlSLoJK86MJ93AKa0IkzTCb5VDJV"
    //   };

    //   fetch("https://api.ubshq.com/organisations/add", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${token}`
    //     },
    //     body: JSON.stringify(requestBody)
    //   })
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then(data => console.log("✅ Response:", data))
    //   .catch(error => console.error("❌ Error:", error));
    // }

    //-----------------------------add domain ---------------------------------//

    const [domain, setDomain] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddDomain = () => {
        if (!domain) {
            alert('Please enter a domain name');
            return;
        }

        setIsLoading(true);

        fetch(`${baseUrl}/domain/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ domain_name: domain }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to add domain');
                return response.json();
            })
            .then((data) => {
                console.log('Domain added successfully:', data);
                setDomain(''); // clear the input
                setAddDomain(false); // close the modal
            })
            .catch((error) => {
                console.error('Error adding domain:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    //--------------------fetch domain-----------------------------//

    const [reviewData, setReviewData] = useState<Domain | null>(null);

    const [domainData, setDomainsData] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);

    console.log(domainData, 'ppppppppppppppppppp');
    // Function to fetch domains
    const fetchDomains = async () => {
        try {
            const response = await fetch(`${baseUrl}/domain/get`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch domains');
            }

            const data = await response.json();

            setDomainsData(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect to run once on mount
    useEffect(() => {
        fetchDomains();
    }, []);

    if (loading) return <div className="h-screen grow dark:bg-[#2F2F2F] overflow-hidden">
        <div className="overflow-y-auto thin-scrollbar h-full">
            <table className="table-hover w-full">
                <tbody>
                    <PageLoader />
                </tbody>
            </table>
        </div>
    </div>;

    //--------------------------delete domain ----------------------------//
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${baseUrl}/domain/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`, // replace with your actual token
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete domain: ${response.statusText}`);
            }

            // Optionally update UI after successful delete
            console.log('Domain deleted successfully');
            // e.g., refresh domains list or remove from state
            fetchDomains();
        } catch (error) {
            console.error('Error deleting domain:', error);
        }
    };

    // const [systemFolderCount, setSystemFolderCount] = useState({});
    // const {pagination} = useEmailPagination()

    // console.log("message-----------> ", pagination.folderCount)

    // setSystemFolderCount(pagination.folderCount);

    //------------------update avatar ------------------------//
    //------------------update avatar ------------------------//
    const randomColor = () => {
        const colors = ['#f97316', '#3b82f6', '#10b981', '#facc15', '#8b5cf6'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // 1. Read the file as base64
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            console.log('base64Data', base64Data);
            // Extract just the base64 part (remove data:image/png;base64, prefix)
            const base64Content = base64Data.split(',')[1];

            // await initializeCrypto(token);
            if (token) {
                await initializeCrypto(token);
            } else {
                console.error('Token is null or undefined!');
            }

            // 2. Get your PGP public key (this could come from a config or environment variable)
            const publicKeyArmored = await fetchUserKeys();

            console.log(publicKeyArmored, 'Publick Key in avatar');

            // 3. Encrypt the avatar using your existing function
            const encryptedData = await encryptAvatar(base64Content, publicKeyArmored.publicKey);

            // 4. Create a Blob from the encrypted data
            const encryptedBlob = new Blob([encryptedData], { type: 'application/pgp-encrypted' });

            console.log(encryptedData, 'Incrypted Avatar Blob');

            // 5. Create FormData and append the encrypted blob
            // const formData = new FormData();
            // formData.append('avatar', encryptedBlob, `${file.name}.pgp`);

            // 6. Send to server
            const response = await fetch(`${baseUrl}/users/updateAvtar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ encryptedImage: encryptedData }),
            });

            // if (!response.ok) {
            //   const errorData = await response.json();
            //   console.error('Failed to update avatar:', errorData);
            //   return;
            // }

            // const data = await response.json();
            // console.log('Avatar updated:', data);

            // Update your avatar state if needed
            // setAvatar(data.avatar);
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };



    return (
        <>
            <div className="flex h-screen thin-scrollbar  lightmint:bg-[#629e7c]  text-black classic:bg-[#F8FAFD] salmonpink:bg-[#006d77] softazure:bg-[#9a8c98] blue:bg-[#64b5f6]  overflow-hidden cornflower:bg-[#6BB8C5]  peach:bg-[#1b2e4b]   dark:bg-[#202127]  dark:border-[#202127]   salmonpink:border-gray-900 softazure:border-gray-800   dark:text-[#fff]">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full">
                    {/* Sidebar */}

                    <div className="w-[300px] classic:bg-[#F8FAFD] salmonpink:bg-[#006d77] softazure:bg-[#9a8c98] blue:bg-[#64b5f6]  overflow-hidden bg-[#133466] cornflower:bg-[#6BB8C5]  peach:bg-[#1b2e4b] lightmint:bg-[#629e7c] dark:bg-[#202127] dark:border-r dark:border-[#202127]  py-3 flex flex-col   salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                        <Link to="/" className="font_woff main-logo flex px-5 pb-2 items-center gap-1 shrink-0 ">
                            <div className="logo_shadow pl-0.5">
                                <img className="w-[33px] logo_shadow rounded-md  inline " src={logo} alt="logo" />
                            </div>
                            <span className="font_woff text-2xl font-medium blue:text-black align-middle hidden md:inline  classic:text-gray-900   dark:text-white-light transition-all duration-300  text-[#fff] ">
                                UB Mail
                            </span>
                        </Link>
                        <div className="flex items-center pt-1 pb-3 pr-20  pl-4">
                            <button
                                onClick={goBack}
                                className=" softazure:bg-[#22223b] w-full justify-center blue:bg-[#e3f2fd] blue:text-black classic:bg-[#a8c7fa] salmonpink:text-black salmonpink:bg-[#b8dedc] classic:text-black  flex items-center peach:text-black peach:bg-gray-100 cornflower:text-black cornflower:bg-gray-100 lightmint:text-black lightmint:bg-green-50 text-white dark:text-[#fff] dark:bg-[#2F2F2F] bg-[#2565C7] py-3 rounded-lg  "
                            >
                                <MdKeyboardBackspace size={20} className="mr-2" />


                                <span className=" hidden text-[16px] lg:flex text-center">Inbox</span>
                            </button>
                        </div>

                        {/* <div className="flex items-center mb-4 px-4">
                            <div className="flex items-center  classic:text-black blue:text-black text-white ">
                                <div className="  mr-2">UB Mail</div>
                                <div className=" leading-tight ">Settings</div>
                            </div>
                        </div> */}

                        <div className="flex-1 overflow-y-scroll thin-scrollbar px-3.5  text-[#fff]">
                            <TabsList className="flex flex-col h-auto p-0 bg-transparent space-y-0">
                                <TabsTrigger
                                    value="account"
                                    className="w-full justify-start items-center blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:text-black  classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white cornflower:data-[state=active]:bg cornflower:data-[state=active]:bg-[#43aabcd5]  peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]  px-3 py-2   text-left text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <FiUser className="mr-2 " size={15} />
                                    Account
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="w-full justify-start px-3 py-2 h-10 text-left text-[#fff] blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:text-black  classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]  data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <BsShieldLock className="mr-2" size={15} />
                                    Security
                                </TabsTrigger>
                                <TabsTrigger
                                    value="enhancePlans"
                                    className="w-full justify-start px-3 py-2 h-10 text-left text-[#fff] blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white  classic:text-black  classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]  data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md  salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <TbArrowBigUpLines className="mr-2" size={15} />
                                    Enhance Plans
                                </TabsTrigger>
                                <TabsTrigger
                                    value="Import"
                                    className="w-full justify-start px-3 py-2 h-10  classic:text-black  blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-left text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <RiImportFill className="mr-2 " size={15} />
                                    Import
                                </TabsTrigger>
                                <TabsTrigger
                                    value="privacy"
                                    className="w-full justify-start px-3 py-2 h-10  classic:text-black  blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-left text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <MdOutlineLockPerson className="mr-2 " size={15} />
                                    Privacy & Encryption
                                </TabsTrigger>
                                <TabsTrigger
                                    value="appearance"
                                    className="w-full justify-start px-3 py-2 h-10 text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <TfiPaintRoller className="mr-2 " size={15} />
                                    Appearance
                                </TabsTrigger>
                                <TabsTrigger
                                    value="email"
                                    className="w-full justify-start px-3 py-2 h-10 text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <TbMailCog className="mr-2 " size={15} />
                                    Email Settings
                                </TabsTrigger>
                                <TabsTrigger
                                    value="folders"
                                    className="w-full justify-start px-3 py-2 h-10 text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <PiFolderSimplePlusBold className="mr-2 " size={15} />
                                    Folders
                                </TabsTrigger>
                                <TabsTrigger
                                    value="filters"
                                    className="w-full justify-start px-3 py-2 h-10 text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <HiOutlineFilter className="mr-2 " size={15} />
                                    Filters
                                </TabsTrigger>
                                <TabsTrigger
                                    value="autoresponder"
                                    className="w-full justify-start px-3 py-2 h-10  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-left text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <LuClock5 className="mr-2 " size={15} />
                                    Auto-Responder
                                </TabsTrigger>
                                <TabsTrigger
                                    value="keys"
                                    className="w-full justify-start px-3   py-2 h-10 text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <IoKeyOutline className="mr-2 " size={15} />
                                    Keys
                                </TabsTrigger>
                                <TabsTrigger
                                    value="notifications"
                                    className="w-full justify-start px-3 py-2 h-10  text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <MdNotificationsNone className="mr-2 " size={15} />
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger
                                    value="shortcuts"
                                    className="w-full justify-start px-3 py-2 h-10  text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <FaRegKeyboard className="mr-2" size={15} />
                                    Keyboard Shortcuts
                                </TabsTrigger>

                                <div className="w-full ">
                                    <h1 className="px-3 py-2  font-medium   classic:text-black blue:text-black  text-[#fff]">Organization</h1>
                                </div>

                                <TabsTrigger
                                    value="usersAndAddress"
                                    className="w-full justify-start px-3 py-2 h-10 text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <RiUserLocationLine className="mr-2 " size={15} />
                                    Users and addresses
                                </TabsTrigger>
                                <TabsTrigger
                                    value="domainNames"
                                    className="w-full justify-start px-3 py-2 h-10 text-left classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <BsGlobe className="mr-2 " size={15} />
                                    Domain names
                                </TabsTrigger>
                                <TabsTrigger
                                    value="multiUserSupport"
                                    className="w-full justify-start px-3 py-2 h-10 text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white  classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <TbUsers className="mr-2 " size={15} />
                                    Multi user support
                                </TabsTrigger>
                                <TabsTrigger
                                    value="organizationFilters"
                                    className="w-full justify-start px-3 py-2 h-10  text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <TbFilterCog className="mr-2 " size={12} />
                                    Organization filters
                                </TabsTrigger>
                                <TabsTrigger
                                    value="accessControl"
                                    className="w-full justify-start px-3 py-2 h-10  text-left  classic:text-black blue:text-black  blue:data-[state=active]:bg-[#4e96ca59]  blue:data-[state=active]:text-white classic:data-[state=active]:bg-[#a8c7fa] cornflower:data-[state=active]:text-white  cornflower:data-[state=active]:bg-[#43aabcd5]   text-[#fff] data-[state=active]:bg-[#162b4a] dark:data-[state=active]:bg-[#2F2F2F] peach:data-[state=active]:text-white peach:data-[state=active]:bg-[#132032] lightmint:data-[state=active]:text-white  lightmint:data-[state=active]:bg-[#477f5f67]   data-[state=active]:text-[#fff] rounded-md salmonpink:data-[state=active]:bg-[#34878e7a] softazure:data-[state=active]:bg-[#4a4e69] salmonpink:data-[state=active]:text-white salmonpink:text-white"
                                >
                                    <BsSliders className="mr-2 " size={14} />
                                    Access control
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full">
                        <div>
                            <Header />
                        </div>
                        <div className="flex h-[98vh]  pb-14 ">
                            <div className="flex-1  overflow-hidden thin-scrollbar rounded-2xl classic:bg-gray-100   dark:bg-[#2F2F2F]  cornflower:bg-gray-100 peach:bg-gray-100 lightmint:bg-green-50 bg-[#fff] text-black dark:text-white softazure:bg-[#f2e9e4] blue:bg-[#e3f2fd] salmonpink:bg-[#b8dedc] ">
                                <TabsContent value="account" className=" m-0   border-none ">
                                    <div className="w-full ">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff]  top-0 px-6 py-2  sticky">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white salmonpink:text-white  dark:text-[#fff]">Account Settings</h1>
                                        </div>

                                        <div className="p-5 h-[85vh]  overflow-auto thin-scrollbar">
                                            <Card className="mb-6 border border-[#e5e7eb]  salmonpink:border-gray-900 softazure:border-gray-800  blue:border-gray-400  dark:border-[#202127]  shadow-sm">
                                                <CardContent className="">
                                                    <h1 className="text-gray-800 dark:text-[#fff] text-xl mb-4 pt-3">Personal Information</h1>

                                                    <div className="flex flex-col items-center  md:flex-row gap-6 mb-6 pt-5">
                                                        <div className="flex flex-col items-center space-y-3">
                                                            <Avatar className={`h-24 w-24 ${profile.avatar ? 'bg-white' : randomColor()} text-white border border-gray-300`}>
                                                                {profile.avatar ? (
                                                                    <AvatarImage src={`data:image/*;base64,${profile.avatar}`} alt="User" />
                                                                ) : (
                                                                    <AvatarFallback>{profile.first_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                                                )}
                                                            </Avatar>

                                                            <label
                                                                htmlFor="avatarInput"
                                                                className="bg-[#2565C7 font-medium blue:bg-[#5cb2f8]  salmonpink:bg-[#42999b] hover:blue:bg-[#4999db] softazure:bg-[#363852] peach:bg-[#1b2e4b] lightmint:bg-[#629e7c] bg-[#1a488e] dark:bg-[#202127] py-2 classic:bg-[#a8c7fa] classic:text-black  cornflower:bg-[#6BB8C5] rounded-lg shadow-md transition shadow-grey-700 px-2 text-white cursor-pointer"
                                                            >
                                                                Change Avatar
                                                                <input type="file" id="avatarInput" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                                            </label>
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-4">
                                                                    <Label htmlFor="firstName" className="text-gray-600 dark:text-[#fff] ">
                                                                        First Name
                                                                    </Label>
                                                                    <Input
                                                                        id="firstName"
                                                                        value={updateProfileObj.first_name}
                                                                        onChange={(e) => updateProfile('first_name', e.target.value)}
                                                                        defaultValue={updateProfileObj.first_name}
                                                                        className="border-gray-300  dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] text-gray-600 "
                                                                    />
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <Label htmlFor="lastName" className="text-gray-600 dark:text-[#fff] ">
                                                                        Last Name
                                                                    </Label>
                                                                    <Input
                                                                        id="lastName"
                                                                        defaultValue={updateProfileObj.last_name}
                                                                        value={updateProfileObj.last_name}
                                                                        onChange={(e) => updateProfile('last_name', e.target.value)}
                                                                        className="border-gray-300  dark:bg-[#202127]  dark:border-gray-600 dark:text-[#fff] text-gray-600 "
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="email" className="text-gray-600 dark:text-[#fff]  ">
                                                                    Email Address
                                                                </Label>
                                                                <Input id="email" type="email" defaultValue={profile.email} disabled className="bg-gray-100 text-gray-600  border-gray-300" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className=" softazure:bg-gray-700 blue:border-gray-500 softazure:border-gray-500 salmonpink:bg-gray-900 my-6 bg-gray-200 dark:bg-gray-600" />

                                                    <h2 className="  text-gray-800 text-xl dark:text-[#fff] mb-4 ">Recovery Email</h2>
                                                    <div className="space-y-2 mb-6">
                                                        <Label htmlFor="recoveryEmail" className="text-gray-600 dark:text-[#fff]">
                                                            Recovery Email Address
                                                        </Label>
                                                        <Input
                                                            id="recoveryEmail"
                                                            type="email"
                                                            placeholder="Enter a recovery email"
                                                            className="border-gray-300  dark:border-gray-600 dark:bg-[#202127] dark:text-[#fff] dark:placeholder:text-[#fff] text-gray-600 "
                                                        />
                                                        <p className=" dark:text-[#fff] text-gray-500">This email will be used to recover your account if you lose access.</p>
                                                    </div>

                                                    <Separator className=" softazure:bg-gray-700 blue:border-gray-500 softazure:border-gray-500 salmonpink:bg-gray-900 my-6 bg-gray-200 dark:bg-gray-600" />

                                                    <h2 className=" text-xl  text-gray-800 dark:text-[#fff] mb-4">Language & Time</h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                        <div className="space-y-2 dark:text-[black]">
                                                            <Label htmlFor="language" className="text-gray-600 dark:text-[#fff]">
                                                                Language
                                                            </Label>
                                                            <Select
                                                                value={updateProfileObj?.language?.code || ''}
                                                                onValueChange={(value) => {
                                                                    const selectedLanguage = avlLanguages.find((lang) => lang.code === value);
                                                                    updateProfile('language', {
                                                                        ...updateProfileObj.language,
                                                                        code: value,
                                                                        name: selectedLanguage?.name || '',
                                                                        countryCode: selectedLanguage?.countryCode || '',
                                                                    });
                                                                }}
                                                            >
                                                                <SelectTrigger
                                                                    id="language"
                                                                    className="border-gray-300  dark:border-gray-600 dark:bg-[#202127] dark:text-[#fff] dark:placeholder:text-[#fff] text-gray-600 "
                                                                >
                                                                    <SelectValue placeholder="Select language" className="text-gray-600" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {avlLanguages.map((item) => (
                                                                        <SelectItem key={item.code} value={item.code}>
                                                                            {item.name} ({item.countryCode})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2 dark:text-[black]">
                                                            <Label htmlFor="timezone" className="text-gray-600 dark:text-[#fff]">
                                                                Time Zone
                                                            </Label>
                                                            <Select value={updateProfileObj?.timezone} onValueChange={(value) => updateProfile('timezone', value)}>
                                                                <SelectTrigger
                                                                    id="timezone"
                                                                    className="border-gray-300   dark:text-[black] dark:placeholder:text-[#fff] text-gray-600 focus:ring-[#1a488e]"
                                                                >
                                                                    <SelectValue placeholder="Select time zone" />
                                                                </SelectTrigger>
                                                                <SelectContent className="dark:bg-[#202127] dark:text-[black]">
                                                                    <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                                                                    <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                                                                    <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                                                                    <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                                                                    <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <button
                                                            className="bg-[#0d47a1] py-2.5 blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]  classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] dark:bg-[#202127]  cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] rounded-lg shadow-lg transition shadow-grey-700 px-3  hover:bg-[#1a488e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]  softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] "
                                                            onClick={() => submitUpdatedProfile()}
                                                        >
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400  dark:border-[#202127]  shadow-sm">
                                                <CardContent className="p-5">
                                                    <h2 className=" text-xl  text-gray-800 dark:text-[#fff] mb-2 pt-3">Delete Account</h2>

                                                    <p className="text-gray-600 dark:text-[#fff] mb-4 ">Once you delete your account, there is no going back. Please be certain.</p>

                                                    <Button className="salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] bg-red-600 shadow-md shadow-grey-700 text-white transition  border-red-600 hover:bg-red-800 py-2.5 px-3 ">
                                                        Delete Account
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Enhance plans */}
                                <TabsContent value="enhancePlans" className="m-0 border-none">
                                    <div className="w-full">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff]">Upgrade to access exclusive benifits</h1>
                                        </div>
                                        <div className="p-5 h-[85vh]  overflow-auto thin-scrollbar ">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Import from Gmail option */}
                                                <Card className="border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400  dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                                                    <CardContent className="p-6 flex flex-col items-center text-center pt-6">
                                                        <div className="bg-blue-100 p-3 rounded-full mb-4">
                                                            <img src={premium} className="w-10" />
                                                        </div>
                                                        <h2 className="text-2xl font-semibold text-gray-600 dark:text-[#fff] mb-3">For Business</h2>
                                                        <p className="text-gray-500 mb-4    dark:text-gray-200">
                                                            Secure email for a productive you. Enjoy seamless communication and advanced protection.
                                                        </p>
                                                        <p className=" text-gray-600 text-4xl  dark:text-gray-200">199$</p>
                                                        <ul className="text-left pt-2  dark:text-gray-200 text-gray-600">
                                                            <li className="flex py-3 ">
                                                                <GoDotFill />
                                                                <p className="ml-2  dark:text-gray-200">
                                                                    <span className="font-semibold  dark:text-white">15GB Storage:</span> Shared across UB Mail, UB Calendar, UB Drive, and UB Office.
                                                                </p>
                                                            </li>
                                                            <li className="flex pb-3 ">
                                                                <GoDotFill />
                                                                <p className="ml-2  dark:text-gray-200">
                                                                    <span className="font-semibold  dark:text-white">Unlimited Organization:</span> Use unlimited folders, labels, and filters to stay
                                                                    organized.
                                                                </p>
                                                            </li>
                                                            <li className="flex pb-3">
                                                                <GoDotFill />
                                                                <p className="ml-2  dark:text-gray-200">
                                                                    <span className="font-semibold  dark:text-white">Custom Domain:</span> Use your own email domain for a professional touch.
                                                                </p>
                                                            </li>
                                                        </ul>

                                                        <button className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c] dark:bg-[#202127]  py-3 w-full my-7   rounded-lg shadow-lg transition shadow-grey-700 px-4  text-white softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                            Premium Access
                                                        </button>
                                                    </CardContent>
                                                </Card>

                                                {/* Import from file option */}
                                                <Card className="border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800  blue:border-gray-400 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                                                    <CardContent className="p-6 flex flex-col items-center text-center pt-6">
                                                        <div className="bg-blue-100 p-3 rounded-full mb-4">
                                                            <img src={personal} className="w-10" />
                                                        </div>
                                                        <h2 className="text-2xl font-semibold text-gray-600 dark:text-[#fff] mb-3">For Personal</h2>
                                                        <p className="text-gray-500 mb-4    dark:text-gray-200">
                                                            Secure email for your personal life. Private, seamless, and <span className="block">protected.</span>
                                                        </p>
                                                        <p className=" text-gray-600 text-4xl  dark:text-gray-200">199$</p>
                                                        <ul className="text-left pt-2 dark:text-gray-200 text-gray-600">
                                                            <li className="flex py-3 ">
                                                                <GoDotFill />
                                                                <p className="ml-2  dark:text-gray-200">
                                                                    <span className="font-semibold  dark:text-white">15GB Storage:</span> Shared across UB Mail, UB Calendar, UB Drive, and UB Office.
                                                                </p>
                                                            </li>
                                                            <li className="flex pb-3 ">
                                                                <GoDotFill />
                                                                <p className="ml-2  dark:text-gray-200">
                                                                    <span className="font-semibold  dark:text-white">Unlimited Organization:</span> Use unlimited folders, labels, and filters to stay
                                                                    organized.
                                                                </p>
                                                            </li>
                                                            <li className="flex pb-3">
                                                                <GoDotFill />
                                                                <p className="ml-2  dark:text-gray-200">
                                                                    <span className="font-semibold  dark:text-white">Custom Domain:</span> Use your own email domain for a professional touch.
                                                                </p>
                                                            </li>
                                                        </ul>

                                                        <button className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] hover:bg-[#1a488e]  lightmint:bg-[#629e7c] dark:bg-[#202127]  py-3 w-full my-7   rounded-lg shadow-lg transition shadow-grey-700 px-4  text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971 blue:bg-[#2565C7] blue:hover:bg-[#0d47a1] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]">
                                                            Personal Access
                                                        </button>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <Card className="border mt-4 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400  dark:border-gray-600 shadow-sm py-3">
                                                <CardContent className="p-6 ">
                                                    <h2 className="  text-lg  text-gray-800 dark:text-[#fff] mb-4">Recent Imports</h2>
                                                    <div className="bg-gray-300  dark:bg-[#202127]  rounded-lg p-4 text-center">
                                                        <p className="text-gray-800 dark:text-gray-200">No recent imports found</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Import Emails */}
                                <TabsContent value="Import" className=" m-0 border-none">
                                    <div className="w-full">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff]">Quick Import Feature</h1>
                                        </div>
                                        {/* Set up forwarding card */}
                                        <div className='p-5 h-[85vh]  overflow-auto thin-scrollbar'>
                                            <Card className="border border-gray-200 dark:border-gray-600  rounded-lg p-5 salmonpink:border-gray-900 softazure:border-gray-800  blue:border-gray-400">
                                                <h2 className="text-xl text-gray-700 dark:text-[#fff] mb-3">Set up forwarding</h2>
                                                <p className="text-gray-600  dark:text-gray-200 mb-6">Forward incoming mail from another account to your secure UB Mail inbox.</p>
                                                <button
                                                    onClick={() => setGoogleAutoFoloing(!googleAutoFoloing)}
                                                    className="w-full flex items-center justify-center gap-2 py-3 px-4   border dark:hover:bg-gray-600 border-gray-300 rounded-md hover:bg-gray-50 transition-colors salmonpink:border-gray-500   blue:border-gray-500 softazure:border-gray-500 "
                                                >
                                                    <FcGoogle size={22} />
                                                    <span className="text-gray-700 dark:text-gray-200">Set up auto-forwarding from Gmail</span>
                                                </button>
                                            </Card>

                                            {/* google button popup */}

                                            {googleAutoFoloing && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                                    <div className="w-3/4 rounded-2xl  shadow-lg">
                                                        <div className="flex items-center justify-center ">
                                                            <div className="relative w-full max-w-5xl overflow-hidden rounded-xl lightmint:bg-[#629e7c] dark:bg-[#202127] bg-purple-50 p-8 shadow-lg">
                                                                <button
                                                                    onClick={() => setGoogleAutoFoloing(false)}
                                                                    className="absolute rounded-full p-1 right-4 lightmint:text-white lightmint:hover:text-black top-4 hover:bg-gray-200 transition text-grey-800 hover:text-gray-700"
                                                                >
                                                                    <span>
                                                                        <RxCross2 size={18} />
                                                                    </span>
                                                                </button>

                                                                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mt-4">
                                                                    <div className="mb-8 md:mb-0  ">
                                                                        <h1 className="mb-4 text-2xl font-medium  lightmint:text-white text-gray-700 dark:text-[#fff]">
                                                                            Get USB Mail messages <span className="block">in your inbox with </span>
                                                                            <span className="block font-bold">auto-forwarding.</span>
                                                                        </h1>

                                                                        <button className="salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]  mt-10 flex items-center rounded-lg py-2 bg-blue-500 px-6  text-white transition-colors hover:bg-blue-600">
                                                                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                                                                <FcGoogle size={22} />
                                                                            </div>
                                                                            Sign in with Google
                                                                        </button>
                                                                    </div>

                                                                    <div className="flex flex-col py-12 rounded-2xl dark:bg-[#2F2F2F] classic:bg-[#a8c7fa] classic:text-black lightmint:bg-green-50 dark:text-black bg-[#33c2b646] w-[60%]  space-y-6 ">
                                                                        <div className=" pl-3 relative flex justify-start flex-col items-start rounded-xl">
                                                                            <div className="mb-4 flex items-center  bg-white p-3 rounded-xl shadow-lg">
                                                                                <div className="mr-3 flex bg-white items-center justify-center overflow-hidden rounded-lg">
                                                                                    {/* <svg viewBox="0 0 24 24" width="40" height="40">
                                            <path d="M0 0h24v24H0z" fill="#F2F2F2" />
                                            <path
                                              d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                                              fill="#D14836"
                                            />
                                          </svg> */}
                                                                                    <FcGoogle size={23} />
                                                                                </div>
                                                                                <div>
                                                                                    <span className="font-bold  ">USB Mail</span>
                                                                                    <span className="text-gray-700  font-medium">'s inbox</span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-center rounded-xl shadow-lg border bg-white  px-4 py-2">
                                                                                <span className="mr-2  font-medium">Auto forwarded</span>
                                                                                <TiArrowForwardOutline size={18} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="relative mt-6 ">
                                                                            <div className="absolute -right-0 mr-3 -top-8 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                                                                                <div className="relative">
                                                                                    <img src={mailIcon} className="w-7" />
                                                                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                                                                        1
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-3 flex flex-col items-end px-3 ">
                                                                            <div className="rounded-lg bg-gray-900 px-6 py-3 text-white">
                                                                                <span>Email received</span>
                                                                            </div>

                                                                            <div className="flex items-center rounded-lg bg-gray-900 px-6 py-3 text-white">
                                                                                <Hand className="mr-2 h-5 w-5 text-red-400" fill="#FEE2E2" />
                                                                                <span>5 trackers removed</span>
                                                                            </div>

                                                                            <div className="flex items-center rounded-lg bg-gray-900 px-6 py-3 text-white">
                                                                                <Key className="mr-2 h-5 w-5 text-yellow-400" />
                                                                                <span>Encrypted</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* One time import card */}
                                            <Card className="border mt-4 border-gray-200 dark:border-gray-600 rounded-lg p-6 salmonpink:border-gray-900 softazure:border-gray-800  blue:border-gray-400">
                                                <h2 className="text-xl  text-gray-800 dark:text-[#fff] mb-3">One time import</h2>
                                                <p className="text-gray-600 text-[15px/] dark:text-gray-200 mb-6">Bring your messages, contacts and calendars to UB Mail.</p>

                                                {/* Google import button */}
                                                <button
                                                    onClick={() => setGoogleImport(!googleImport)}
                                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600  dark:hover:bg-gray-600 rounded-md hover:bg-gray-50 transition-colors mb-3 salmonpink:border-gray-500  softazure:border-gray-500 blue:border-gray-500"
                                                >
                                                    <FcGoogle size={22} />
                                                    <span className="text-gray-700 dark:text-gray-200">Import from Google</span>
                                                </button>

                                                {googleImport && (
                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                                        <div className=" bg-white rounded-2xl w-2/5 shadow-lg">
                                                            <div className="bg-white rounded-lg lightmint:bg-[#629e7c] dark:bg-[#202127]  relative">
                                                                {/* Close button */}
                                                                {/* Modal content */}
                                                                <div className="p-6 ">
                                                                    <div className="flex justify-between items-cente">
                                                                        <h2 className="text-2xl font-medium mb-2 lightmint:text-white">Choose your import options?</h2>
                                                                        <button
                                                                            onClick={() => setGoogleImport(false)}
                                                                            className=" w-7 h-7 flex justify-center items-center lightmint:text-white lightmint:hover:text-black dark:hover:text-black hover:bg-gray-300 transition rounded-full "
                                                                        >
                                                                            <span>
                                                                                <RxCross2 size={20} />
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-gray-600 mb-6 lightmint:text-white dark:text-gray-200">Pick your import options.</p>

                                                                    {/* Emails option */}
                                                                    <div className="py-4 border-b border-gray-200 dark:border-gray-600">
                                                                        <div className="flex items-center space-x-2">
                                                                            <div className="relative w-5 h-5 cursor-pointer" onClick={() => handleOptionChange('emails')}>
                                                                                <div
                                                                                    className={`w-5 h-5 rounded-sm ${selectedOptions.emails ? 'bg-[#2565C7] dark:bg-[#2F2F2F] ' : 'border-2 border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    {selectedOptions.emails && (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            className="h-5 w-5 text-white"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                    )}
                                                                                </div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id="emails"
                                                                                    className="sr-only"
                                                                                    checked={selectedOptions.emails}
                                                                                    onChange={() => handleOptionChange('emails')}
                                                                                />
                                                                            </div>
                                                                            <label
                                                                                htmlFor="emails"
                                                                                className="text-base font-medium lightmint:text-white cursor-pointer"
                                                                                onClick={() => handleOptionChange('emails')}
                                                                            >
                                                                                Emails
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    {/* Contacts option */}
                                                                    <div className="py-4 border-b  border-gray-200 dark:border-gray-600">
                                                                        <div className="flex items-center space-x-2">
                                                                            <div className="relative w-5 h-5 cursor-pointer" onClick={() => handleOptionChange('contacts')}>
                                                                                <div
                                                                                    className={`w-5 h-5 rounded-sm ${selectedOptions.contacts ? 'bg-[#2565C7] dark:bg-[#2F2F2F]' : 'border-2 border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    {selectedOptions.contacts && (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            className="h-5 w-5 text-white"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                    )}
                                                                                </div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id="contacts"
                                                                                    className="sr-only"
                                                                                    checked={selectedOptions.contacts}
                                                                                    onChange={() => handleOptionChange('contacts')}
                                                                                />
                                                                            </div>
                                                                            <label
                                                                                htmlFor="contacts"
                                                                                className="text-base font-medium lightmint:text-white cursor-pointer"
                                                                                onClick={() => handleOptionChange('contacts')}
                                                                            >
                                                                                Contacts
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    {/* Calendar option */}
                                                                    <div className="py-4 border-b dark:border-gray-600 border-gray-200">
                                                                        <div className="flex items-center space-x-2">
                                                                            <div className="relative w-5 h-5 cursor-pointer" onClick={() => handleOptionChange('calendar')}>
                                                                                <div
                                                                                    className={`w-5 h-5 rounded-sm ${selectedOptions.calendar ? 'bg-[#2565C7] dark:bg-[#2F2F2F]' : 'border-2 border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    {selectedOptions.calendar && (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            className="h-5 w-5 text-white"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                    )}
                                                                                </div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id="calendar"
                                                                                    className="sr-only"
                                                                                    checked={selectedOptions.calendar}
                                                                                    onChange={() => handleOptionChange('calendar')}
                                                                                />
                                                                            </div>
                                                                            <label
                                                                                htmlFor="calendar"
                                                                                className="text-base font-medium lightmint:text-white cursor-pointer"
                                                                                onClick={() => handleOptionChange('calendar')}
                                                                            >
                                                                                Calendar
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    {/* Action buttons */}
                                                                    <div className="flex justify-between mt-6">
                                                                        <button
                                                                            onClick={handleCancel}
                                                                            className="px-6 py-2 border  border-gray-300 dark:border-none dark:bg-[#2F2F2F] lightmint:bg-green-50 dark:text-white rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={handleStartImport}
                                                                            className="px-6 py-2 softazure:bg-[#9a8c98] salmonpink:bg-[#006d77] salmonpink:text-white softazure:text-white text-white cornflower:bg-[#6BB8C5] cornflower:text-white bg-[#2565C7] classic:bg-[#a8c7fa] blue:bg-[#4e96ca59] blue-text-black classic:text-black peach:bg-[#1b2e4b] peach:text-white dark:bg-[#2F2F2F] lightmint:bg-green-50 dark:text-white rounded-md transition-colors"
                                                                        >
                                                                            Start import
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Yahoo import button */}
                                                <button
                                                    onClick={() => setYahooImport(!yahooImport)}
                                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 rounded-md hover:bg-gray-50 transition-colors mb-3 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="flex-shrink-0">
                                                        <path fill="#5F01D1" d="M13.5 1.5L9 10.5 4.5 1.5H0l7.5 13.5v9h3v-9L18 1.5z" />
                                                        <circle fill="#5F01D1" cx="19.5" cy="19.5" r="4.5" />
                                                    </svg>
                                                    <span className="text-gray-700 dark:text-gray-200">Import from Yahoo</span>
                                                </button>

                                                {yahooImport && (
                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                                                        <div className="w-2/5 rounded-xl bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] p-7 shadow-lg">
                                                            <div className="mb-6 flex items-center justify-between">
                                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Choose your import options?</h2>

                                                                <button
                                                                    className="hover:bg-gray-300 lightmint:text-white lightmint:hover:text-black dark:hover:text-black salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]  rounded-full p-2 "
                                                                    onClick={() => setYahooImport(false)}
                                                                >
                                                                    <span>
                                                                        <RxCross2 size={20} />
                                                                    </span>
                                                                </button>
                                                            </div>

                                                            <p className="mb-6 text-gray-600 lightmint:text-white dark:text-gray-200">You can import one data type at a time.</p>
                                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                                {/* Emails Option */}
                                                                <button
                                                                    className="flex flex-col items-center rounded-lg border border-gray-200 dark:border-gray-600 lightmint:bg-green-50 dark:bg-[#2F2F2F] p-6 text-center transition-colors hover:bg-gray-100"
                                                                    onClick={() => {
                                                                        setEmailModal(!emailModal), setYahooImport(false);
                                                                    }}
                                                                >
                                                                    <div className="mb-4 h-16 w-16">
                                                                        <img src={mailIcon} />
                                                                    </div>
                                                                    <span className="font-medium text-gray-900 dark:text-gray-200">Emails</span>
                                                                </button>

                                                                {/* Calendars Option */}

                                                                <button className="flex flex-col items-center rounded-lg border  border-gray-200 dark:border-gray-600 lightmint:bg-green-50 dark:bg-[#2F2F2F] p-6 text-center transition-colors hover:bg-gray-100 salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] ">
                                                                    <div className="mb-4 h-16 w-16">
                                                                        <img src={calendar} />
                                                                    </div>
                                                                    <span className="font-medium text-gray-900 dark:text-gray-200">Calendars</span>
                                                                </button>

                                                                {/* Contacts Option */}

                                                                <button className="flex flex-col items-center rounded-lg border border-gray-200 dark:border-gray-600 lightmint:bg-green-50 dark:bg-[#2F2F2F] p-6 text-center transition-colors hover:bg-gray-100 salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                                    <div className="mb-4 h-16 w-16">
                                                                        <img src={calendar} />
                                                                    </div>
                                                                    <span className="font-medium text-gray-900 dark:text-gray-200">Contacts</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {emailModal && (
                                                    <div className="fixed inset-0  bg-black bg-opacity-50   flex justify-center items-center z-50">
                                                        <div className="w-96 h-96 lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-2xl p-6 shadow-lg">
                                                            <h2 className=" flex justify-end font-bold mb-4">
                                                                <span
                                                                    onClick={() => {
                                                                        setEmailModal(false), setYahooImport(false);
                                                                    }}
                                                                >
                                                                    <RxCross2 />
                                                                </span>
                                                            </h2>
                                                            <button
                                                                onClick={() => {
                                                                    setEmailModal(!emailModal), setYahooImport(false);
                                                                }}
                                                            >
                                                                open{' '}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Outlook import button */}
                                                <button
                                                    onClick={() => setOutLookImport(!outLookImport)}
                                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 rounded-md hover:bg-gray-50 transition-colors mb-3 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500"
                                                >
                                                    <span className="text-blue-900 text-2xl">
                                                        <PiMicrosoftOutlookLogoFill />
                                                    </span>
                                                    <span className="text-gray-700 dark:text-gray-200">Import from Outlook</span>
                                                </button>

                                                {outLookImport && (
                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                                        <div className=" bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-2xl w-2/5 shadow-lg">
                                                            <div className="bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-lg  relative">
                                                                {/* Close button */}

                                                                {/* Modal content */}
                                                                <div className="p-6 ">
                                                                    <div className="flex justify-between items-cente">
                                                                        <h2 className="text-2xl font-bold mb-2 lightmint:text-white">Choose your import options?</h2>
                                                                        <button
                                                                            onClick={() => setOutLookImport(false)}
                                                                            className=" w-7 h-7 flex justify-center items-center lightmint:text-white lightmint:hover:text-black dark:hover:text-black hover:bg-gray-300 transition rounded-full "
                                                                        >
                                                                            <span>
                                                                                <RxCross2 size={20} />
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-gray-600 lightmint:text-white dark:text-gray-200 mb-6">Pick your import options.</p>

                                                                    {/* Emails option */}
                                                                    <div className="py-4 border-b border-gray-200 dark:border-gray-600">
                                                                        <div className="flex items-center space-x-2">
                                                                            <div className="relative w-5 h-5 cursor-pointer" onClick={() => handleOptionChange('emails')}>
                                                                                <div
                                                                                    className={`w-5 h-5 rounded-sm ${selectedOptions.emails ? 'bg-[#2565C7] dark:bg-[#2F2F2F]' : 'border-2 border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    {selectedOptions.emails && (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            className="h-5 w-5 text-white"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                    )}
                                                                                </div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id="emails"
                                                                                    className="sr-only"
                                                                                    checked={selectedOptions.emails}
                                                                                    onChange={() => handleOptionChange('emails')}
                                                                                />
                                                                            </div>
                                                                            <label
                                                                                htmlFor="emails"
                                                                                className="text-base font-medium lightmint:text-white cursor-pointer"
                                                                                onClick={() => handleOptionChange('emails')}
                                                                            >
                                                                                Emails
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    {/* Contacts option */}
                                                                    <div className="py-4 border-b  border-gray-200 dark:border-gray-600">
                                                                        <div className="flex items-center space-x-2">
                                                                            <div className="relative w-5 h-5 cursor-pointer" onClick={() => handleOptionChange('contacts')}>
                                                                                <div
                                                                                    className={`w-5 h-5 rounded-sm ${selectedOptions.contacts ? 'bg-[#2565C7] dark:bg-[#2F2F2F]' : 'border-2 border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    {selectedOptions.contacts && (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            className="h-5 w-5 text-white"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                    )}
                                                                                </div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id="contacts"
                                                                                    className="sr-only"
                                                                                    checked={selectedOptions.contacts}
                                                                                    onChange={() => handleOptionChange('contacts')}
                                                                                />
                                                                            </div>
                                                                            <label
                                                                                htmlFor="contacts"
                                                                                className="text-base font-medium lightmint:text-white cursor-pointer"
                                                                                onClick={() => handleOptionChange('contacts')}
                                                                            >
                                                                                Contacts
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    {/* Calendar option */}
                                                                    <div className="py-4 border-b border-gray-200 dark:border-gray-600">
                                                                        <div className="flex items-center space-x-2">
                                                                            <div className="relative w-5 h-5 cursor-pointer" onClick={() => handleOptionChange('calendar')}>
                                                                                <div
                                                                                    className={`w-5 h-5 rounded-sm ${selectedOptions.calendar ? 'bg-[#2565C7] dark:bg-[#2F2F2F]' : 'border-2 border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    {selectedOptions.calendar && (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            className="h-5 w-5 text-white"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                    )}
                                                                                </div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id="calendar"
                                                                                    className="sr-only"
                                                                                    checked={selectedOptions.calendar}
                                                                                    onChange={() => handleOptionChange('calendar')}
                                                                                />
                                                                            </div>
                                                                            <label
                                                                                htmlFor="calendar"
                                                                                className="text-base font-medium lightmint:text-white cursor-pointer"
                                                                                onClick={() => handleOptionChange('calendar')}
                                                                            >
                                                                                Calendar
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    {/* Action buttons */}
                                                                    <div className="flex justify-between mt-6">
                                                                        <button
                                                                            onClick={handleCancel}
                                                                            className="px-6 py-2 border  lightmint:bg-green-50 border-gray-300 dark:border-gray-600 dark:bg-[#2F2F2F] dark:text-white rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={handleStartImport}
                                                                            className="px-6 py-2 bg-[#2565C7] softazure:bg-[#9a8c98]  blue:bg-[#4e96ca59] blue-text-black softazure:text-white cornflower:bg-[#6BB8C5] cornflower:text-white  classic:bg-[#a8c7fa] classic:text-black   peach:bg-[#1b2e4b] peach:text-white dark:bg-[#2F2F2F] lightmint:bg-green-50 dark:text-white rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            Start import
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* //------------email import --------------------// */}

                                                {isImportModalOpen && (
                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h2 className=" pl-6 font-semibold dark:text-white">Import from Gmail</h2>
                                                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <GmailImport />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Other import button */}
                                                <button
                                                    onClick={() => setOtherImport(!otherImport)}
                                                    className="w-full flex items-center justify-center gap-2  py-3 px-4 border border-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 rounded-md hover:bg-gray-50 transition-colors salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500"
                                                >
                                                    <span className="text-gray-700 dark:text-gray-200">Import from other</span>
                                                </button>

                                                {otherImport && (
                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                                        <div className="w-96 h-96 bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-2xl p-6 shadow-lg">
                                                            <h2 className=" flex justify-end font-bold mb-4">
                                                                <span onClick={() => setOtherImport(false)}>
                                                                    <RxCross2 />
                                                                </span>
                                                            </h2>
                                                            hello
                                                        </div>
                                                    </div>
                                                )}
                                            </Card>
                                        </div>

                                    </div>
                                </TabsContent>

                                {/* Security Tab */}
                                <TabsContent value="security" className="m-0 border-none">
                                    <div className="w-full">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white  lightmint:text-whtie  dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-medium text-gray-800  lightmint:text-white dark:text-[#fff]">Security Settings</h1>
                                        </div>
                                        <div className="p-5 h-[85vh]  overflow-auto thin-scrollbar">
                                            <Card className="mb-6 border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 dark:border-[#202127]  shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className="  text-gray-800 mb-4 pt-4 dark:text-[#fff] text-xl">Password</h2>

                                                    <div className="space-y-4 mb-6">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="current-password" className="text-gray-700 font-medium dark:text-[#fff]">
                                                                Current Password
                                                            </Label>
                                                            <Input
                                                                id="current-password"
                                                                onChange={(e) => setpassword(e.target.value)}
                                                                value={password}
                                                                type="password"
                                                                className="border-gray-300  dark:border-gray-600 dark:bg-[#202127] dark:text-[#fff] text-gray-600 "
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="new-password" className="text-gray-700 dark:text-[#fff]">
                                                                New Password
                                                            </Label>
                                                            <Input
                                                                id="new-password"
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                value={newPassword}
                                                                type="password"
                                                                className="border-gray-300  dark:border-gray-600 dark:bg-[#202127] dark:text-[#fff] text-gray-600 "
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="confirm-password" className="text-gray-700 dark:text-[#fff]">
                                                                Confirm New Password
                                                            </Label>
                                                            <Input
                                                                id="confirm-password"
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                value={confirmPassword}
                                                                type="password"
                                                                className="border-gray-300  dark:border-gray-600 dark:bg-[#202127] dark:text-[#fff] text-gray-600 "
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <button
                                                            className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c] dark:bg-[#202127]  py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3  text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                            onClick={() => submitUpdatedPassword()}
                                                        >
                                                            Update Password
                                                        </button>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="mb-6 border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 dark:border-[#202127]  shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" text-xl text-gray-800 mb-4 mt-4 dark:text-[#fff] ">Two-Factor Authentication</h2>

                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <h3 className=" text-gray-700 dark:text-[#fff] ">Two-Factor Authentication</h3>
                                                            <p className=" text-gray-600 dark:text-[#fff]">Add an extra layer of security to your account</p>
                                                        </div>
                                                        <Switch
                                                            onCheckedChange={(checked) => {
                                                                toggleUpdateAndSave('two_factor_enabled', checked);
                                                            }}
                                                            checked={updateProfileObj.two_factor_enabled}
                                                            id="2fa"
                                                        />
                                                    </div>

                                                    <div className="bg-[#2566c736] dark:bg-[#202127] p-4 rounded-md ">
                                                        <p className=" text-gray-800 dark:text-[#fff]">
                                                            Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="mb-6 border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 dark:border-[#202127]  shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" text-xl text-gray-800 mb-4 pt-4 dark:text-[#fff] ">Session Management</h2>

                                                    <div className="space-y-4 mb-6">
                                                        <div className="flex items-center justify-between p-3 bg-[#2566c736] dark:bg-[#202127] rounded-md">
                                                            <div>
                                                                <h3 className=" text-gray-800 dark:text-[#fff]">Current Session</h3>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Chrome on Windows • Active now</p>
                                                            </div>
                                                            <div className=" text-[#1a488e] dark:text-[#fff] ">Current</div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 border dark:border-gray-600 border-gray-200 rounded-md salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div>
                                                                <h3 className="font-medium text-gray-800 dark:text-[#fff]">Firefox on MacOS</h3>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Last active: 2 days ago</p>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="text-gray-700  dark:text-[#fff] border-gray-300">
                                                                Sign Out
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 border dark:border-gray-600 border-gray-200 rounded-md salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div>
                                                                <h3 className="font-medium text-gray-800 dark:text-[#fff]">Safari on iPhone</h3>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Last active: 5 days ago</p>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="text-gray-700 dark:text-[#fff] border-gray-300">
                                                                Sign Out
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <button className="w-full bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c] dark:bg-[#202127] py-3 rounded-lg shadow-lg transition shadow-grey-700 px-4  text-white  softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                        Sign Out All Other Sessions
                                                    </button>
                                                </CardContent>
                                            </Card>

                                            <Card className="border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 dark:border-[#202127]  shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" text-xl text-gray-800 mb-4 pt-4 dark:text-[#fff] ">Login History</h2>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between p-3 border-b dark:border-gray-600 border-gray-200 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div>
                                                                <h3 className=" text-gray-800 dark:text-[#fff]">Chrome on Windows</h3>
                                                                <p className=" text-gray-600 dark:text-[#fff]">IP: 192.168.1.1 • Today, 10:45 AM</p>
                                                            </div>
                                                            <div className="bg-green-100 text-green-800   me-2 px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">Successful</div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 border-b dark:border-gray-600 border-gray-200 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div>
                                                                <h3 className=" text-gray-800 dark:text-[#fff]">Firefox on MacOS</h3>
                                                                <p className=" text-gray-600 dark:text-[#fff]">IP: 192.168.1.2 • Yesterday, 3:20 PM</p>
                                                            </div>
                                                            <div className="bg-green-100 text-green-800   me-2 px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">Successful</div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 border-b dark:border-gray-600 border-gray-200 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div>
                                                                <h3 className=" text-gray-800 dark:text-[#fff]">Unknown Device</h3>
                                                                <p className=" text-gray-600 dark:text-[#fff]">IP: 203.0.113.1 • May 10, 2023, 8:15 AM</p>
                                                            </div>
                                                            <div className="bg-red-100 text-red-800 text-xs  me-2 px-2.5 py-1 rounded-md dark:bg-red-900 dark:text-red-300">Failed</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Privacy Tab */}
                                <TabsContent value="privacy" className="m-0 border-none">
                                    <div className="w-full">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff]">Privacy Settings </h1>
                                        </div>
                                        <div className="p-5 h-[85vh]  overflow-auto thin-scrollbar">
                                            <Card className="mb-6 border border-[#e5e7eb] dark:border-gray-600 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" pt-4 text-xl font-medium text-gray-800 mb-4 dark:text-gray-300">Email Privacy</h2>

                                                    <div className="space-y-4 mb-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-gray-300 ">Hide Sender IP</Label>
                                                                <p className=" text-gray-600 dark:text-gray-400">Prevent senders from knowing your IP address</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked) => toggleAndUpdatePreference('HideSenderIP', checked)}
                                                                checked={profile.preferences?.HideSenderIP}
                                                                defaultChecked
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-gray-300">Request Link Confirmation</Label>
                                                                <p className=" text-gray-600 dark:text-gray-400">Confirm before opening links in emails</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked) => toggleAndUpdatePreference('RequestLinkConfirmation', checked)}
                                                                checked={profile.preferences?.RequestLinkConfirmation}
                                                                defaultChecked
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-gray-300">Auto Load Remote Content</Label>
                                                                <p className=" text-gray-600 dark:text-gray-400">Automatically load images and external content</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked) => toggleAndUpdatePreference('AutoLoadRemoteContent', checked)}
                                                                checked={profile.preferences?.AutoLoadRemoteContent}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="mb-6">
                                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                            Default Encryption Settings
                                                        </h2>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                                <div className="space-y-1">
                                                                    <Label className="text-gray-700 dark:text-gray-300 font-medium">
                                                                        Sign All Outgoing Messages
                                                                    </Label>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Digitally sign all outgoing emails for verification
                                                                    </p>
                                                                </div>
                                                                <Switch
                                                                    checked={profile.preferences?.SignAllMessages}
                                                                    onCheckedChange={(checked) => toggleAndUpdatePreference('SignAllMessages', checked)}
                                                                    className="data-[state=checked]:bg-blue-600"
                                                                />
                                                            </div>

                                                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                                <div className="space-y-1">
                                                                    <Label className="text-gray-700 dark:text-gray-300 font-medium">
                                                                        Attach Public Key
                                                                    </Label>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Include your public key with outgoing messages
                                                                    </p>
                                                                </div>
                                                                <Switch
                                                                    checked={profile.preferences?.AttachPublicKey}
                                                                    onCheckedChange={(checked) => toggleAndUpdatePreference('AttachPublicKey', checked)}
                                                                    className="data-[state=checked]:bg-blue-600"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
                                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                End-to-end encryption ensures your messages are encrypted on your device and can only be
                                                                decrypted by the intended recipient. These settings enhance your email security.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border dark:border-gray-600 mb-12 border-[#e5e7eb] shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" font-medium pt-4 text-xl text-gray-800 mb-4 dark:text-gray-300">Data & Privacy</h2>

                                                    <div className="space-y-4 mb-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-gray-300">Usage Data Collection</Label>
                                                                <p className=" text-gray-600 dark:text-gray-400">Allow collection of anonymous usage data</p>
                                                            </div>
                                                            <Switch onCheckedChange={(checked) => toggleAndUpdatePreference('AttachPublicKey', checked)} checked={profile.preferences?.AttachPublicKey} />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-gray-300">Crash Reports</Label>
                                                                <p className=" text-gray-600 dark:text-gray-400">Send anonymous crash reports</p>
                                                            </div>
                                                            <Switch
                                                                checked={profile.preferences?.CrashReportsEnabled}
                                                                onCheckedChange={(checked) => toggleAndUpdatePreference('CrashReportsEnabled', checked)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <Button variant="outline" className="w-full text-gray-700 dark:border-gray-600 dark:text-gray-400 border-gray-300">
                                                            Export Personal Data
                                                        </Button>

                                                        <Button variant="outline" className="w-full text-red-600 border-red-600 hover:border-none hover:bg-red-50">
                                                            Delete All Data
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Appearance Tab */}
                                <TabsContent value="appearance" className="m-0 border-none">

                                    <div className="w-full">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-medium lightmint:text-white text-gray-800 dark:text-[#fff]">Appearance</h1>
                                        </div>
                                        <div className="p-5 h-[85vh]  overflow-auto thin-scrollbar">
                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400  lightmint:border-[#629e7c] lightmint:green-50 lightmint:green-50 lightmint:green-50 lightmint:green-50 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" pt-4 text-xl  text-gray-800 mb-4 dark:text-[#fff]">Theme</h2>

                                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                                        {/* Light Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'Light')}
                                                            className={`border rounded-md  cursor-pointer bg-white  flex  flex-col items-center space-y-2 ${profile.preferences?.Theme === 'Light' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-white  border rounded-md"></div>
                                                            <span className=" font-medium text-gray-800">UB Theme</span>
                                                        </div>

                                                        {/* Dark Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'Dark')}
                                                            className={`border rounded-md  cursor-pointer bg-gray-900 flex flex-col items-center space-y-2 ${profile.preferences?.Theme === 'Dark' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-gray-800 border border-gray-700 rounded-md"></div>
                                                            <span className=" font-medium text-gray-200">Dark</span>
                                                        </div>

                                                        {/* System Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'classic')}
                                                            className={`border rounded-md  cursor-pointer bg-white flex flex-col items-center space-y-2 ${profile.preferences?.Theme === 'classic' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-gradient-to-b from-white to-gray-800 border rounded-md"></div>
                                                            <span className=" font-medium text-gray-800">System</span>
                                                        </div>

                                                        {/* Blue Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'blue')}
                                                            className={`border rounded-md  cursor-pointer bg-white flex flex-col items-center space-y-2 ${profile.preferences?.Theme === 'blue' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-[#ACD8FC] border rounded-md"></div>
                                                            <span className=" font-medium text-gray-800">Pale Sky Blue</span>
                                                        </div>

                                                        {/* Peach Orange Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'Peach')}
                                                            className={`border rounded-md  cursor-pointer bg-white flex flex-col items-center space-y-2 ${profile.preferences?.Theme === 'Peach' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-[#1b2e4b] border rounded-md"></div>
                                                            <span className=" font-medium text-gray-800">Dark Blue</span>
                                                        </div>

                                                        {/* Soft Azure Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'softazure')}
                                                            className={`border rounded-md  cursor-pointer bg-white flex flex-col items-center space-y-2 ${profile.preferences?.Theme === 'softazure' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-[#9a8c98] border rounded-md"></div>
                                                            <span className=" font-medium text-gray-800">Dusty Lavender</span>
                                                        </div>

                                                        {/* Light Mint Green Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'lightmint')}
                                                            className={`border rounded-md  cursor-pointer bg-white flex flex-col items-center space-y-2 ${profile.preferences?.Theme === 'lightmint' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-[#8ECEAA] border rounded-md"></div>
                                                            <span className=" font-medium text-gray-800">Light Mint Green</span>
                                                        </div>

                                                        {/* Cornflower Blue Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'cornflower')}
                                                            className={`border rounded-md  cursor-pointer bg-white flex flex-col items-center space-y-2 ${profile.preferences?.Theme === 'cornflower' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-[#5EB1EF] border rounded-md"></div>
                                                            <span className=" font-medium text-gray-800">Cornflower Blue</span>
                                                        </div>

                                                        {/* Salmon Pink Theme */}
                                                        <div
                                                            onClick={() => toggleAndUpdatePreference('Theme', 'salmonpink')}
                                                            className={`border rounded-md  cursor-pointer bg-white flex flex-col items-center space-y-2 ${profile.preferences?.Theme === 'salmonpink' ? 'ring-2 ring-[#1a488e]' : ''
                                                                }`}
                                                        >
                                                            <div className="h-20 w-full bg-[#006d77] border rounded-md"></div>
                                                            <span className=" font-medium text-gray-800">Deep Teal</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400  lightmint:border-[#629e7c] lightmint:green-50 lightmint:green-50 lightmint:green-50 lightmint:green-50 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" pt-4 text-xl text-gray-800 mb-4  dark:text-[#fff]">Font Settings</h2>

                                                    <div className="space-y-4 dark:text-black">
                                                        <div className="space-y-2 ">
                                                            <Label htmlFor="font-family" className="lightmint:text-gray-900 dark:text-gray-200  text-gray-700 ">
                                                                Font Family
                                                            </Label>
                                                            <Select onValueChange={(value) => updatePreferences('FontFamily', value)} value={preferences?.FontFamily}>
                                                                <SelectTrigger id="font-family" className="border-gray-30 dark:bg-transparent focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select font family" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="latoFont">latoFont</SelectItem>
                                                                    <SelectItem value="sans">Sans-serif</SelectItem>
                                                                    <SelectItem value="serif">Serif</SelectItem>
                                                                    <SelectItem value="mono">Monospace</SelectItem>
                                                                    <SelectItem value="arial">Arial</SelectItem>
                                                                    <SelectItem value="cursive">Cursive</SelectItem>
                                                                    <SelectItem value="opendyslexic">OpenDyslexic</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        {/* Jyoti ka interve */}
                                                        <div className="space-y-2">
                                                            <Label htmlFor="font-size" className="lightmint:text-gray-900 dark:text-gray-200  text-gray-700 ">
                                                                Font Size
                                                            </Label>
                                                            <Select
                                                                onValueChange={(value) => updatePreferences('FontSize', value)}
                                                                value={preferences?.FontSize}
                                                                defaultValue={profile.preferences?.FontSize}
                                                            >
                                                                <SelectTrigger
                                                                    id="font-size"
                                                                    className="border-gray-300  lightmint:border-[#629e7c] lightmint:green-50 lightmint:green-50 lightmint:green-50 lightmint:green-50 focus:ring-[#1a488e]"
                                                                >
                                                                    <SelectValue placeholder="Select font size" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="small">Small</SelectItem>
                                                                    <SelectItem value="medium">Medium</SelectItem>
                                                                    <SelectItem value="large">Large</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex justify-end">
                                                            <Button
                                                                onClick={() => submitUpdatedPreferences()}
                                                                className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] px-3 py-2.5  classic:text-black peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] dark:bg-[#202127] hover:bg-[#2ba99e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Email Settings Tab */}
                                <TabsContent value="email" className=" m-0 border-none">
                                    <div className="w-full">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0  px-6">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff]">Email Settings</h1>
                                        </div>

                                        <div className="p-5 h-[85vh]  overflow-auto thin-scrollbar">
                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" text-xl text-gray-800 mb-4 pt-4 dark:text-[#fff]">Composer</h2>

                                                    <div className="space-y-4 mb-6 dark:text-black">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5 w-[50%]">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Default Composer Mode</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Choose between rich text or plain text</p>
                                                            </div>
                                                            <Select defaultValue="rich" onValueChange={(value) => updatePreferences('ComposerMode', value)} value={preferences?.ComposerMode}>
                                                                <SelectTrigger className="w-40 border-gray-300 focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select mode" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="rich">Rich Text</SelectItem>
                                                                    <SelectItem value="plain">Plain Text</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5 w-[50%]">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Composer Size</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Choose the default composer size</p>
                                                            </div>
                                                            <Select
                                                                defaultValue="normal"
                                                                onValueChange={(value) => updatePreferences('DefaultComposerSize', value)}
                                                                value={preferences?.DefaultComposerSize}
                                                            >
                                                                <SelectTrigger className="w-40 border-gray-300 focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select size" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="normal">Normal</SelectItem>
                                                                    <SelectItem value="maximized">Maximized</SelectItem>
                                                                    <SelectItem value="minimized">Minimized</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Auto-save Drafts</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Automatically save drafts while composing</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('AutoSaveDraft', checked);
                                                                }}
                                                                checked={preferences?.AutoSaveDraft}
                                                            />
                                                        </div>
                                                    </div>

                                                    <Separator className=" softazure:bg-gray-700 blue:border-gray-500 softazure:border-gray-500 salmonpink:bg-gray-900 my-6 bg-gray-200 dark:bg-gray-700" />

                                                    <h2 className=" text-xl text-gray-800 mb-4 dark:text-[#fff]">Email Signature</h2>

                                                    <div className="space-y-2 mb-6">
                                                        <Label htmlFor="signature" className="text-gray-600  dark:text-[#fff]">
                                                            Signature
                                                        </Label>
                                                        <textarea
                                                            id="signature"
                                                            className="min-h-24 w-full rounded-md border dark:border-gray-600 border-gray-300 dark:bg-[#202127] bg-white px-3 py-2  "
                                                            defaultValue="Best regards,&#10;Himan&#10;UB Email Suite"
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="space-y-0.5">
                                                            <Label className="text-gray-600  dark:text-[#fff]">Include Signature by Default</Label>
                                                            <p className=" text-gray-600  dark:text-[#fff]">Automatically add signature to new emails</p>
                                                        </div>
                                                        <Switch
                                                            onCheckedChange={(checked) => {
                                                                toggleAndUpdatePreference('includeSignatureByDefault', checked);
                                                            }}
                                                            checked={preferences?.includeSignatureByDefault}
                                                        />
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => submitUpdatedPreferences()}
                                                            className="bg-[#1a488e] py-2.5 blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]  classic:bg-[#a8c7fa] classic:text-black rounded-lg shadow-lg peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] dark:bg-[#202127] transition shadow-grey-700 px-3 hover:bg-[#1a488e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                        >
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" text-xl text-gray-800 mb-4 pt-4 dark:text-[#fff]">Reading</h2>

                                                    <div className="space-y-4 mb- text-black">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5 w-[50%]">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Mark as Read</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">When to mark messages as read</p>
                                                            </div>
                                                            <Select
                                                                defaultValue={profile.preferences?.MailReadMarking}
                                                                onValueChange={(value) => toggleAndUpdatePreference('MailReadMarking', value)}
                                                                value={preferences?.MailReadMarking}
                                                            >
                                                                <SelectTrigger className=" border-gray-300 focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select option" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="immediately">Immediately</SelectItem>
                                                                    <SelectItem value="after-3s">After 3 seconds</SelectItem>
                                                                    <SelectItem value="manually">Manually</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5 w-[50%]">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Request Read Receipts</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Request read receipts for sent emails</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('RequestReadReceipts', checked);
                                                                }}
                                                                checked={preferences?.RequestReadReceipts}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5 w-[50%]">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Send Read Receipts</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Send read receipts when requested</p>
                                                            </div>
                                                            <Select
                                                                defaultValue={preferences?.SendReadReceipts}
                                                                onValueChange={(value) => toggleAndUpdatePreference('SendReadReceipts', value)}
                                                                value={preferences?.SendReadReceipts}
                                                            >
                                                                <SelectTrigger className="w-40 border-gray-300 focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select option" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="always">Always</SelectItem>
                                                                    <SelectItem value="never">Never</SelectItem>
                                                                    <SelectItem value="ask">Ask each time</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" text-xl text-gray-800 mb-4 pt-4 dark:text-[#fff]">Sending</h2>

                                                    <div className="space-y-4 dark:text-black ">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5 w-[50%]">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Undo Send</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Time window to cancel sent emails</p>
                                                            </div>
                                                            <Select
                                                                defaultValue={profile.preferences?.UndoSendTime}
                                                                onValueChange={(value) => toggleAndUpdatePreference('UndoSendTime', value)}
                                                                value={preferences?.UndoSendTime}
                                                            >
                                                                <SelectTrigger className="w-40 border-gray-300 dark:text-black focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select time" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="0">Off</SelectItem>
                                                                    <SelectItem value="5">5 seconds</SelectItem>
                                                                    <SelectItem value="10">10 seconds</SelectItem>
                                                                    <SelectItem value="20">20 seconds</SelectItem>
                                                                    <SelectItem value="30">30 seconds</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5 w-[50%]">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Default Send Behavior</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Action when pressing Enter in composer</p>
                                                            </div>
                                                            <Select
                                                                defaultValue={profile.preferences?.DefaultSendBehavior}
                                                                onValueChange={(value) => toggleAndUpdatePreference('DefaultSendBehavior', value)}
                                                                value={preferences?.DefaultSendBehavior}
                                                            >
                                                                <SelectTrigger className="w-40 border-gray-300 focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select behavior" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="send">Send</SelectItem>
                                                                    <SelectItem value="newline">New Line</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center  justify-between">
                                                            <div className="space-y-0.5 w-[50%]">
                                                                <Label className="text-gray-600  dark:text-[#fff]">Attachment Reminder</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Remind about possible missing attachments</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('AttachmentReminder', checked);
                                                                }}
                                                                checked={preferences?.AttachmentReminder ?? false}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Folders */}
                                <TabsContent value="folders" className=" m-0 border-none">
                                    <div className="w-full">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0  px-6">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff]">Folders</h1>
                                        </div>

                                        <div className="p-5 h-[85vh]  overflow-auto thin-scrollbar">
                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-center mb-4 pt-4">
                                                        <h2 className="  text-gray-800 dark:text-[#fff] text-xl">System Folders</h2>

                                                        {/* <button className="bg-[#1a488e] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c]   py-2.5 px-3   dark:bg-[#202127] rounded-md text-white flex items-center salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]">
                                                        <MdManageAccounts size={20} className="mr-2" /> Manage Display
                                                    </button> */}
                                                    </div>

                                                    <div className="space-y-3 mb-6 text-gray-600 dark:text-[#fff]">
                                                        {systemFolders.map((folder, index) => {
                                                            // Type-safe check if folder.name exists in folderColors keys
                                                            const folderName = folder.name as keyof typeof folderColors;

                                                            const colors = folderColors.hasOwnProperty(folderName)
                                                                ? folderColors[folderName]
                                                                : {
                                                                    dot: '#6b7280',
                                                                    bg: '#d1d5db',
                                                                    text: '#374151',
                                                                };

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md dark:border-gray-600    salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500"
                                                                >
                                                                    <div className="flex items-center ">
                                                                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: colors.dot }} />
                                                                        <span className="font-medium">{folder.name}</span>
                                                                    </div>
                                                                    <div
                                                                        className="text-xs font-medium me-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-gray-300"
                                                                        style={{ backgroundColor: colors.bg, color: colors.text }}
                                                                    >
                                                                        {folder.total} messages
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-center mb-4 pt-4">
                                                        <h2 className=" text-xl text-gray-800 dark:text-[#fff]">Custom Folders</h2>

                                                        <button
                                                            onClick={() => setPlusOpen(!plusOpen)}
                                                            className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] classic:bg-[#a8c7fa] classic:text-black hover:bg-[#1a488e] lightmint:bg-[#629e7c]   py-2.5 px-3   dark:bg-[#202127] rounded-md text-white flex items-center salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                        >
                                                            <PiFolderSimplePlusFill size={20} className="mr-2 middle" />
                                                            New Folder
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3 mb-6">
                                                        {customFolder.map((folder, index) => (
                                                            <div
                                                                key={folder.folder_id || index} // Use a unique ID if available
                                                                className="flex items-center justify-between p-3 border dark:border-gray-600 border-gray-200 rounded-md salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500"
                                                            >
                                                                <div className="flex items-center">
                                                                    <div className="w-4 h-4 bg-[#10b981] rounded-full mr-3"></div>
                                                                    <span className="">{folder.name}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="bg-green-100 text-green-800 text-xs  me-2 px-2.5 py-0.5 rounded-md dark:bg-green-900 dark:text-green-300">
                                                                        {folder.messageCount || 0} messages
                                                                    </div>
                                                                    {/* <button className="salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] h-8 w-8 p-0 hover:bg-gray-200 rounded-full transition flex justify-center items-center">
                <GrEdit />
              </button> */}

                                                                    <button
                                                                        className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full transition flex justify-center items-center"
                                                                        onClick={() => {
                                                                            setLabelData({ name: folder.name });
                                                                            setEditFolderId(folder.folder_id); // assuming `folder.id` exists
                                                                            setPlusOpen(true);
                                                                        }}
                                                                    >
                                                                        <GrEdit />
                                                                    </button>

                                                                    <button
                                                                        onClick={() => {
                                                                            setFolderToDelete(folder.folder_id);
                                                                            setDeleteConfirmOpen(true);
                                                                            // console.log('clicked delete');
                                                                        }}
                                                                        className="h-8 w-8 p-0 text-red-500 hover:bg-gray-200 rounded-full transition flex justify-center items-center"
                                                                    >
                                                                        <RiDeleteBin6Line size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>
                                {/* Filters Tab */}
                                <TabsContent value="filters" className=" m-0 border-none">
                                    <div className="w-full">
                                        <div className=" sticky top-0 px-6 py-2 bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff]">
                                            <h1 className="text-xl font-medium text-gray-800  lightmint:text-white dark:text-[#fff]">Filters</h1>
                                        </div>

                                        <div className="p-5 h-[85vh] overflow-auto thin-scrollbar">
                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="">
                                                    <div className="flex justify-between items-center mb-6 ">
                                                        <h2 className=" text-xl text-gray-800 dark:text-[#fff] pt-3">Email Filters</h2>
                                                        <button className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c]   py-2.5    rounded-lg shadow-lg transition shadow-grey-700 px-3  dark:bg-[#202127]  text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]">
                                                            Create New Filter
                                                        </button>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div className="flex items-center justify-between bg-gray-50 dark:bg-[#202127] dark:border-gray-600 p-4 border-b border-gray-200 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                <div className="font-medium">Newsletter Filter</div>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                                                                        <GoDotFill className="mr-1 blinking" size={16} />
                                                                        Active
                                                                    </div>
                                                                    <button className=" h-8 w-8 p-0 hover:text-black hover:bg-gray-200 rounded-full transtion flex justify-center items-center">
                                                                        <GrEdit />
                                                                    </button>
                                                                    <button className=" h-8 w-8 p-0 text-red-500 hover:bg-gray-200 rounded-full transtion flex justify-center items-center">
                                                                        <RiDeleteBin6Line size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="p-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                                    <div>
                                                                        <h3 className="  text-gray-500 dark:text-[#fff] mb-2">Conditions</h3>
                                                                        <ul className="space-y-1 ">
                                                                            <li>From contains: newsletter, subscribe, updates</li>
                                                                            <li>Subject contains: newsletter</li>
                                                                        </ul>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="  text-gray-500 dark:text-[#fff] mb-2">Actions</h3>
                                                                        <ul className="space-y-1 ">
                                                                            <li>Apply label: Newsletter</li>
                                                                            <li>Move to folder: Newsletters</li>
                                                                            <li>Mark as read</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div className="flex items-center justify-between bg-gray-50 dark:bg-[#202127] dark:border-gray-600 p-4 border-b border-gray-200 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                <div className="">Important Clients</div>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                                                                        <GoDotFill className="mr-1 blinking" size={16} />
                                                                        Active
                                                                    </div>
                                                                    <button className=" h-8 w-8 p-0 hover:text-black hover:bg-gray-200 rounded-full transtion flex justify-center items-center">
                                                                        <GrEdit />
                                                                    </button>
                                                                    <button className=" h-8 w-8 p-0 text-red-500 hover:bg-gray-200 rounded-full transtion flex justify-center items-center">
                                                                        <RiDeleteBin6Line size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="p-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                                    <div>
                                                                        <h3 className="  text-gray-500 dark:text-[#fff] mb-2">Conditions</h3>
                                                                        <ul className="space-y-1 ">
                                                                            <li>From contains: client@acme.com, client@bigcorp.com</li>
                                                                            <li>To/CC contains: sales@ourcompany.com</li>
                                                                        </ul>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="  text-gray-500 dark:text-[#fff] mb-2">Actions</h3>
                                                                        <ul className="space-y-1 ">
                                                                            <li>Apply label: Important</li>
                                                                            <li>Star the message</li>
                                                                            <li>Never send to Spam</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div className="flex items-center justify-between bg-gray-50 dark:bg-[#202127] dark:border-gray-600 p-4 border-b border-gray-200 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                <div className="">Receipts and Invoices</div>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-start">
                                                                        <GoDotFill className="mr-1 blinking" size={16} />
                                                                        Active
                                                                    </div>
                                                                    <button className=" h-8 w-8 p-0 hover:text-black hover:bg-gray-200 rounded-full transtion flex justify-center items-center">
                                                                        <GrEdit />
                                                                    </button>
                                                                    <button className=" h-8 w-8 p-0 text-red-500 hover:bg-gray-200 rounded-full transtion flex justify-center items-center">
                                                                        <RiDeleteBin6Line size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="p-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                                    <div>
                                                                        <h3 className="  text-gray-500 dark:text-[#fff] mb-2">Conditions</h3>
                                                                        <ul className="space-y-1 ">
                                                                            <li>Subject contains: receipt, invoice, order, payment</li>
                                                                            <li>Has attachment</li>
                                                                        </ul>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="  text-gray-500 dark:text-[#fff] mb-2">Actions</h3>
                                                                        <ul className="space-y-1 ">
                                                                            <li>Apply label: Receipts</li>
                                                                            <li>Move to folder: Finance</li>
                                                                            <li>Mark as important</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className="  text-gray-800 dark:text-[#fff] mb-4 pt-4">Spam Filter Settings</h2>

                                                    <div className="space-y-4 dark:text-black">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff] ">Spam Protection Level</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Choose how aggressive the spam filter should be</p>
                                                            </div>
                                                            <Select
                                                                onValueChange={(value) => toggleAndUpdatePreference('SpamFilters', { ...preferences?.SpamFilters, SpamProtectionLevel: value })}
                                                                value={preferences?.SpamFilters?.SpamProtectionLevel}
                                                            >
                                                                <SelectTrigger className="w-40 border-gray-300 focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select level" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="low">Low</SelectItem>
                                                                    <SelectItem value="standard">Standard</SelectItem>
                                                                    <SelectItem value="high">High</SelectItem>
                                                                    <SelectItem value="extreme">Extreme</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700  dark:text-[#fff]">Automatically Delete Spam</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Delete spam messages after 30 days</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.SpamFilters?.AutomaticallyDeleteSpam}
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('SpamFilters', {
                                                                        ...(preferences?.SpamFilters || {}),
                                                                        AutomaticallyDeleteSpam: checked,
                                                                    });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700  dark:text-[#fff]">Show Spam Notification</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Show notification when messages are marked as spam</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.SpamFilters?.ShowSpamNotification ?? false}
                                                                onCheckedChange={(checked) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    toggleAndUpdatePreference('SpamFilters', { ...preferences?.SpamFilters, ShowSpamNotification: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <Separator className=" softazure:bg-gray-700 blue:border-gray-500 softazure:border-gray-500 salmonpink:bg-gray-900 my-4 bg-gray-200 dark:bg-gray-600" />

                                                        <div className="space-y-2">
                                                            <Label htmlFor="blocked-senders" className="text-gray-700 dark:text-[#fff] ">
                                                                Blocked Senders
                                                            </Label>
                                                            <textarea
                                                                id="blocked-senders"
                                                                className="min-h-24 w-full rounded-md border border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  "
                                                                placeholder="Enter email addresses to block, one per line"
                                                                defaultValue="spam@example.com&#10;unwanted@example.org"
                                                            />
                                                            <p className=" text-gray-500 dark:text-[#fff] ">
                                                                Enter one email address per line. Emails from these addresses will be sent directly to spam.
                                                            </p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="trusted-senders" className="text-gray-700 dark:text-[#fff] ">
                                                                Trusted Senders
                                                            </Label>
                                                            <textarea
                                                                id="trusted-senders"
                                                                className="min-h-24 w-full rounded-md border border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  "
                                                                placeholder="Enter email addresses to trust, one per line"
                                                                defaultValue="important@client.com&#10;team@company.com"
                                                            />
                                                            <p className=" text-gray-500 dark:text-[#fff] ">
                                                                Enter one email address per line. Emails from these addresses will never be marked as spam.
                                                            </p>
                                                        </div>

                                                        <div className="flex justify-end">
                                                            <button
                                                                className="bg-[#1a488e] py-2.5 blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] rounded-lg shadow-lg dark:bg-[#202127] transition shadow-grey-700 px-3  hover:bg-[#1a488e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                                onClick={() => submitUpdatedPreferences()}
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Auto-Responder Tab */}
                                <TabsContent value="autoresponder" className=" m-0 border-none">
                                    <div className="w-full">
                                        <div className="sticky top-0 px-6 py-2 bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff]">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff] ">Auto-Responder</h1>
                                        </div>

                                        <div className="h-[85vh] p-5 thin-scrollbar overflow-auto">
                                            <Card className="mb-6 border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between mb-4 pt-4">
                                                        <h2 className="  text-gray-800 dark:text-[#fff]">Vacation Responder</h2>
                                                        <Switch
                                                            checked={preferences?.VacationAutoResponder?.status}
                                                            id="vacation-responder"
                                                            onCheckedChange={(checked) => {
                                                                console.log(checked, 'CHECKED BOX VALUE');
                                                                updatePreferences('VacationAutoResponder', { ...preferences?.VacationAutoResponder, status: checked });
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="space-y-4 mb-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2 text-black">
                                                                <Label htmlFor="start-date" className="text-gray-700 dark:text-[#fff]">
                                                                    Start Date
                                                                </Label>
                                                                <Input
                                                                    id="start-date"
                                                                    type="date"
                                                                    value={profile.preferences?.VacationAutoResponder?.StartDate}
                                                                    className="border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  "
                                                                    onChange={(e) => {
                                                                        updatePreferences('VacationAutoResponder', { ...preferences?.VacationAutoResponder, StartDate: e.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="end-date" className="text-gray-700 dark:text-[#fff]">
                                                                    End Date
                                                                </Label>
                                                                <Input
                                                                    id="end-date"
                                                                    type="date"
                                                                    value={profile.preferences?.VacationAutoResponder?.EndDate}
                                                                    className="border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  "
                                                                    onChange={(e) => {
                                                                        updatePreferences('VacationAutoResponder', { ...preferences?.VacationAutoResponder, EndDate: e.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="subject" className="text-gray-700 dark:text-[#fff]">
                                                                Subject Line
                                                            </Label>
                                                            <Input
                                                                id="subject"
                                                                value={profile.preferences?.VacationAutoResponder?.Subject}
                                                                defaultValue="Out of Office: Automatic Reply"
                                                                className="border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  "
                                                                onChange={(e) => {
                                                                    updatePreferences('VacationAutoResponder', { ...preferences?.VacationAutoResponder, Subject: e.target.value });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="message" className="text-gray-700 dark:text-[#fff]">
                                                                Auto-Reply Message
                                                            </Label>
                                                            <textarea
                                                                id="message"
                                                                className="min-h-32 w-full rounded-md border border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  "
                                                                value={profile.preferences?.VacationAutoResponder?.Message}
                                                                onChange={(e) => {
                                                                    updatePreferences('VacationAutoResponder', { ...preferences?.VacationAutoResponder, Message: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Send to Contacts Only</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Only send auto-replies to people in your contacts</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked) => {
                                                                    updatePreferences('SendToContactsOnly', { ...preferences?.VacationAutoResponder, SendToContactsOnly: checked });
                                                                }}
                                                                checked={preferences?.VacationAutoResponder?.SendToContactsOnly}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff] ">Send Once Per Sender</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Send only one auto-reply to each sender during the set period</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    updatePreferences('SendOncePerSender', { ...preferences?.VacationAutoResponder, SendOncePerSender: checked });
                                                                }}
                                                                checked={preferences?.VacationAutoResponder?.SendOncePerSender}
                                                            />
                                                        </div>

                                                        <div className="flex justify-end">
                                                            <button
                                                                className="bg-[#1a488e] peach:bg-[#1b2e4b] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] dark:bg-[#202127] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3  hover:bg-[#1a488e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                                onClick={() => submitUpdatedPreferences()}
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 dark:border-gray-600 shadow-sm">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between mb-4 pt-4">
                                                        <h2 className="  text-gray-800 dark:text-[#fff]">Fixed Auto-Responder</h2>
                                                        <Switch
                                                            checked={preferences?.FixedAutoResponder?.status}
                                                            onCheckedChange={(checked) => {
                                                                console.log(checked, 'CHECKED BOX VALUE');
                                                                updatePreferences('FixedAutoResponder', { ...preferences?.FixedAutoResponder, status: checked });
                                                            }}
                                                            id="fixed-responder"
                                                        />
                                                    </div>

                                                    <div className="space-y-4 mb-6">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="fixed-subject" className="text-gray-700 dark:text-[#fff] ">
                                                                Subject Line
                                                            </Label>
                                                            <Input
                                                                id="fixed-subject"
                                                                value={profile.preferences?.FixedAutoResponder?.Subject}
                                                                onChange={(e) => {
                                                                    updatePreferences('FixedAutoResponder', { ...preferences?.FixedAutoResponder, Subject: e.target.value });
                                                                }}
                                                                className="border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  "
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="fixed-message" className="text-gray-700 dark:text-[#fff]">
                                                                Auto-Reply Message
                                                            </Label>
                                                            <textarea
                                                                id="fixed-message"
                                                                value={profile.preferences?.FixedAutoResponder?.Message}
                                                                onChange={(e) => {
                                                                    updatePreferences('FixedAutoResponder', { ...preferences?.FixedAutoResponder, Message: e.target.value });
                                                                }}
                                                                className="min-h-32 w-full rounded-md border border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  "
                                                                defaultValue="Thank you for your email. This is an automated response to confirm that I have received your message. I will review your email and respond as soon as possible.&#10;&#10;Best regards,&#10;[Your Name]"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 text-black">
                                                        <div className="">
                                                            <div className="space-y-0.5 pb-2">
                                                                <Label className="text-gray-700 dark:text-[#fff] ">Apply to Address</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Select which email address this auto-responder applies to</p>
                                                            </div>
                                                            <Select
                                                                defaultValue={preferences?.ApplyToAddress}
                                                                onValueChange={(value) => toggleAndUpdatePreference('ApplyToAddress', value)}
                                                                value={preferences?.ApplyToAddress}
                                                            >
                                                                <SelectTrigger className="w-40 border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select address" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="primary">himan@abysfin.com</SelectItem>
                                                                    <SelectItem value="alias1">support@abysfin.com</SelectItem>
                                                                    <SelectItem value="alias2">info@abysfin.com</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff] ">Send Once Per Day</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Send only one auto-reply to each sender per day</p>
                                                            </div>
                                                            <Switch
                                                                onCheckedChange={(checked: boolean) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    updatePreferences('FixedAutoResponder', {
                                                                        ...preferences?.FixedAutoResponder,
                                                                        SendOncePerDay: checked,
                                                                    });
                                                                }}
                                                                checked={!!preferences?.FixedAutoResponder?.SendOncePerDay}
                                                            />
                                                        </div>

                                                        <div className="flex justify-end">
                                                            <button
                                                                className="bg-[#1a488e] peach:bg-[#1b2e4b] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] dark:bg-[#202127] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3  hover:bg-[#1a488e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                                onClick={() => submitUpdatedPreferences()}
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Keys Tab */}

                                <TabsContent value="keys" className=" m-0   border-none">
                                    <div className="w-full overflow-hidden ">
                                        {/* Reduced py-12 to py-6 */}
                                        <div className="sticky top-0 bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 px-6">
                                            <h1 className="text-xl font-medium lightmint:text-white text-gray-800 dark:text-[#fff] ">Encryption Keys</h1>
                                        </div>
                                        <div className=" h-[85vh] p-5 thin-scrollbar overflow-auto">
                                            <Card className="mb-6 border border-[#e5e7eb] dark:border-gray-600 shadow-sm salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-800">
                                                <CardContent className="p-6">
                                                    <h2 className="text-xl text-gray-800 dark:text-[#fff] mb-4 pt-4">Your Keys</h2>

                                                    <div className="space-y-6 text-black">
                                                        <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div className="flex items-center justify-between bg-gray-50 dark:bg-[#202127] dark:border-gray-600 p-4 border-b salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500 border-gray-200">
                                                                <div>
                                                                    <div className="font-medium text-gray-800 dark:text-[#fff]">Primary Key</div>
                                                                    <div className=" text-gray-500 dark:text-[#fff]">himan@abysfin.com</div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                                                                        <GoDotFill className="mr-1 blinking" size={16} />
                                                                        Active
                                                                    </div>

                                                                    <button className="bg-[#1a488e] peach:bg-[#1b2e4b] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c] dark:bg-[#2F2F2F] py-2.5  rounded-lg shadow-lg transition shadow-grey-700 flex items-center px-3 text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]">
                                                                        <PiExportFill size={19} className="mr-1" /> Export
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="p-4">
                                                                <div className="space-y-2 text-gray-800 dark:text-[#fff]">
                                                                    <div className="flex justify-between ">
                                                                        <span className="text-gray-500 font-semibold dark:text-[#fff]">Fingerprint:</span>
                                                                        <span className="font-mono">2FC8 9A13 B4E2 D849 C2E7 76B9 8435 7F12 A0D3 C8F6</span>
                                                                    </div>
                                                                    <div className="flex justify-between  font-semibold">
                                                                        <span className="text-gray-500 dark:text-[#fff]">Created:</span>
                                                                        <span>January 15, 2023</span>
                                                                    </div>
                                                                    <div className="flex justify-between  font-semibold">
                                                                        <span className="text-gray-500 dark:text-[#fff]">Expires:</span>
                                                                        <span>January 15, 2025</span>
                                                                    </div>
                                                                    <div className="flex justify-between  font-semibold">
                                                                        <span className="text-gray-500 dark:text-[#fff]">Key Size:</span>
                                                                        <span>4096 bits</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between">
                                                            <button className="bg-[#1a488e] peach:bg-[#1b2e4b] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c] dark:bg-[#202127] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 flex items-center px-3  text-white softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                                <span className="-rotate-90 mb-1">
                                                                    <CgKey size={20} />
                                                                </span>{' '}
                                                                Generate New Key
                                                            </button>

                                                            <button className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c] py-2.5 dark:bg-[#202127] rounded-lg shadow-lg transition shadow-grey-700 flex items-center px-3  text-white softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                                <RiImportFill size={18} className="mr-1" /> Import Key
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className=" text-gray-800 dark:text-[#fff] mb-4 pt-4 text-xl">Contact Keys</h2>

                                                    <div className="space-y-4 mb-6">
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="Search contact keys..."
                                                                className="pl-9 border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  focus:ring-[#1a488e] "
                                                            />
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                                                            >
                                                                <circle cx="11" cy="11" r="8" />
                                                                <path d="m21 21-4.3-4.3" />
                                                            </svg>
                                                        </div>

                                                        <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-600 dark:bg-[#202127] border-gray-200 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                <div>
                                                                    <div className="font-medium text-gray-800 dark:text-[#fff]">Alice Smith</div>
                                                                    <div className=" text-gray-500 dark:text-[#fff]">alice@example.com</div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Trusted</div>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <span className="sr-only">More</span>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="h-4 w-4"
                                                                        >
                                                                            <circle cx="12" cy="12" r="1" />
                                                                            <circle cx="12" cy="5" r="1" />
                                                                            <circle cx="12" cy="19" r="1" />
                                                                        </svg>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="p-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between ">
                                                                        <span className="text-gray-800 font-medium dark:text-[#fff]">Fingerprint:</span>
                                                                        <span className="font-mono">A1B2 C3D4 E5F6 G7H8 I9J0 K1L2 M3N4 O5P6 Q7R8 S9T0</span>
                                                                    </div>
                                                                    <div className="flex justify-between ">
                                                                        <span className="text-gray-500 dark:text-[#fff]">Added:</span>
                                                                        <span>March 10, 2023</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="border dark:border-gray-600 border-gray-200 rounded-md overflow-hidden salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-600 dark:bg-[#202127] border-gray-200 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                <div>
                                                                    <div className="font-medium text-gray-800 dark:text-[#fff]">Bob Johnson</div>
                                                                    <div className=" text-gray-500 dark:text-[#fff]">bob@example.com</div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Trusted</div>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <span className="sr-only">More</span>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="h-4 w-4"
                                                                        >
                                                                            <circle cx="12" cy="12" r="1" />
                                                                            <circle cx="12" cy="5" r="1" />
                                                                            <circle cx="12" cy="19" r="1" />
                                                                        </svg>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="p-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between ">
                                                                        <span className="text-gray-800 dark:text-[#fff]">Fingerprint:</span>
                                                                        <span className="font-mono">U1V2 W3X4 Y5Z6 A7B8 C9D0 E1F2 G3H4 I5J6 K7L8 M9N0</span>
                                                                    </div>
                                                                    <div className="flex justify-between ">
                                                                        <span className="text-gray-500 dark:text-[#fff]">Added:</span>
                                                                        <span>April 22, 2023</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button className="w-full bg-[#1a488e] peach:bg-[#1b2e4b] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] hover:bg-[#1a488e] lightmint:bg-[#629e7c] dark:bg-[#202127] py-3 rounded-lg shadow-lg transition shadow-grey-700 px-4 text-white  salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]">
                                                        Import Contact Key
                                                    </button>
                                                </CardContent>
                                            </Card>
                                            <Card className="border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className="text-xl text-gray-800 dark:text-[#fff] mb-4 pt-3">Key Settings</h2>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Automatically Download Public Keys</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Download public keys from key servers when needed</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.KeySettings?.AutoDownloadPublicKeyas}
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('KeySettings', { ...(preferences?.KeySettings || {}), AutoDownloadPublicKeyas: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Attach Public Key to Messages</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Include your public key when sending emails</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.KeySettings?.AttachPublicKeyToMessage}
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('KeySettings', { ...(preferences?.KeySettings || {}), AttachPublicKeyToMessage: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Sign All Outgoing Messages</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Digitally sign all outgoing emails</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.KeySettings?.SignAllOutgoingMessage}
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('KeySettings', { ...(preferences?.KeySettings || {}), SignAllOutgoingMessage: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="key-server" className="text-gray-700 dark:text-[#fff]">
                                                                Key Server
                                                            </Label>
                                                            <Input
                                                                id="key-server"
                                                                defaultValue={preferences?.KeySettings?.keyserver}
                                                                className="border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] bg-white px-3 py-2  focus:ring-[#1a488e] "
                                                            />
                                                            <p className="text-gray-500 dark:text-[#fff] ">Server used for looking up and publishing public keys</p>
                                                        </div>

                                                        <div className="flex justify-end">
                                                            <button className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] peach:bg-[#1b2e4b] dark:bg-[#202127] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3  hover:bg-[#1a488e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]">
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Notifications Tab */}
                                <TabsContent value="notifications" className=" m-0 border-none">
                                    <div className="w-full h-[90vh] overflow-hidden flex flex-col">

                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0  px-6">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff]">Notification</h1>
                                        </div>
                                        <div className=" px-6 py-4 overflow-y-scroll thin-scrollbar h-[95vh]">
                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className="text-xl text-gray-800 dark:text-[#fff] mb-4 pt-4">Email Notifications</h2>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">New Email Notifications</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Get notified when you receive new emails</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.Notifications?.NewEmailNotifications ?? false}
                                                                onCheckedChange={(checked: boolean) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    toggleAndUpdatePreference('Notifications', {
                                                                        ...preferences?.Notifications,
                                                                        NewEmailNotifications: checked,
                                                                    });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Important Email Notifications</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Get notified for emails marked as important</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.Notifications?.ImportantEmailNotifications ?? false}
                                                                onCheckedChange={(checked: boolean) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    toggleAndUpdatePreference('Notifications', {
                                                                        ...preferences?.Notifications,
                                                                        ImportantEmailNotifications: checked,
                                                                    });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Calendar Event Notifications</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Get notified for calendar invites and updates</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.Notifications?.CalendarEventNotifications}
                                                                onCheckedChange={(checked) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    toggleAndUpdatePreference('Notifications', { ...(preferences?.Notifications ?? {}), CalendarEventNotifications: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Newsletter Notifications</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Get notified for newsletter emails</p>
                                                            </div>
                                                            <Switch
                                                                checked={profile.preferences?.Notifications?.NewsLetterNotifications}
                                                                onCheckedChange={(checked) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    toggleAndUpdatePreference('Notifications', { ...preferences?.Notifications, NewsLetterNotifications: checked });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className="text-xl text-gray-800 dark:text-[#fff] mb-4 pt-4">Notification Preferences</h2>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Desktop Notifications</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Show notifications on your desktop</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.NotificationPreference?.DesktopNotifications}
                                                                onCheckedChange={(checked) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE destop');
                                                                    toggleAndUpdatePreference('NotificationPreference', { ...(preferences?.NotificationPreference ?? {}), DesktopNotifications: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Sound Alerts</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Play sound when new emails arrive</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.NotificationPreference?.SoundAlerts}
                                                                onCheckedChange={(checked) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    toggleAndUpdatePreference('NotificationPreference', { ...(preferences?.NotificationPreference ?? {}), SoundAlerts: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Browser Tab Notifications</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Show unread count in browser tab</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.NotificationPreference?.BrowserTabNotifications}
                                                                onCheckedChange={(checked) => {
                                                                    console.log(checked, 'CHECKED BOX VALUE');
                                                                    toggleAndUpdatePreference('NotificationPreference', {
                                                                        ...(preferences?.NotificationPreference ?? {}),
                                                                        BrowserTabNotifications: checked,
                                                                    });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className=" dark:text-black">
                                                            <div className="space-y-0.5 dark:text-black pb-3">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Notification Duration</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">How long notifications stay visible</p>
                                                            </div>
                                                            <Select
                                                                onValueChange={(value) =>
                                                                    toggleAndUpdatePreference('NotificationPreference', { ...(preferences?.NotificationPreference ?? {}), NotificationDuration: value })
                                                                }
                                                                value={preferences?.NotificationPreference?.NotificationDuration}
                                                            >
                                                                <SelectTrigger className="w-40 border-gray-300  focus:ring-[#1a488e]">
                                                                    <SelectValue placeholder="Select duration" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="3">3 seconds</SelectItem>
                                                                    <SelectItem value="5">5 seconds</SelectItem>
                                                                    <SelectItem value="10">10 seconds</SelectItem>
                                                                    <SelectItem value="15">15 seconds</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className="text-xl text-gray-800 dark:text-[#fff] mb-4 pt-4">Mobile Notifications</h2>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Push Notifications</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Send push notifications to your mobile devices</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.MobileNotification?.PushNotification}
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('MobileNotification', { ...(preferences?.MobileNotification ?? {}), PushNotification: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Email Preview in Notifications</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Show email content in push notifications</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.MobileNotification?.EmailPreviewInNotification}
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('MobileNotification', { ...(preferences?.MobileNotification ?? {}), EmailPreviewInNotification: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <Label className="text-gray-700 dark:text-[#fff]">Quiet Hours</Label>
                                                                <p className=" text-gray-600 dark:text-[#fff]">Don't send notifications during specified hours</p>
                                                            </div>
                                                            <Switch
                                                                checked={preferences?.MobileNotification?.QuietHours}
                                                                onCheckedChange={(checked) => {
                                                                    toggleAndUpdatePreference('MobileNotification', { ...(preferences?.MobileNotification ?? {}), QuietHours: checked });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2 text-gray-700 dark:text-[#fff]">
                                                                <Label htmlFor="quiet-start" className="text-gray-700 dark:text-[#fff] ">
                                                                    Quiet Hours Start
                                                                </Label>
                                                                <Input
                                                                    id="quiet-start"
                                                                    type="time"
                                                                    value={preferences?.MobileNotification?.QuietHoursEnd}
                                                                    className="border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] "
                                                                />
                                                            </div>
                                                            <div className="space-y-2 text-gray-700 dark:text-[#fff]">
                                                                <Label htmlFor="quiet-end" className="text-gray-700 dark:text-[#fff] ">
                                                                    Quiet Hours End
                                                                </Label>
                                                                <Input
                                                                    id="quiet-end"
                                                                    type="time"
                                                                    value={preferences?.MobileNotification?.QuietHoursStart}
                                                                    className="border-gray-300 dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] "
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end">
                                                            <Button
                                                                className="bg-[#1a488e] peach:bg-[#1b2e4b] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] cornflower:bg-[#6BB8C5] classic:bg-[#a8c7fa] classic:text-black hover:bg-[#2ba99e] lightmint:bg-[#629e7c] text-white dark:bg-[#202127] salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                                onClick={() => submitUpdatedPreferences()}
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Keyboard Shortcuts Tab */}
                                <TabsContent value="shortcuts" className=" m-0 border-none">
                                    <div className="w-full ">
                                        <div className="px-6  sticky top-0 bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff]">
                                            <h1 className="text-xl py-2 font-medium lightmint:text-white text-gray-800 dark:text-[#fff] ">Keyboard Shortcuts</h1>
                                        </div>

                                        <div className="p-5 h-[85vh] overflow-auto thin-scrollbar" >
                                            <Card className="mb-6 border dark:border-gray-600 border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 shadow-sm">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between mb-4 pt-4">
                                                        <h2 className="text-xl font-medium text-gray-800 dark:text-[#fff]">Keyboard Shortcuts</h2>
                                                        <div className="flex items-center space-x-2">
                                                            <Label htmlFor="enable-shortcuts" className="text-gray-700 dark:text-[#fff] font-medium">
                                                                Enable Shortcuts
                                                            </Label>
                                                            <Switch id="enable-shortcuts" defaultChecked />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div>
                                                            <h3 className=" font-semibold text-gray-700 dark:text-[#fff] mb-3">Navigation</h3>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff]">Go to Inbox</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            g
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">then</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            i
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff]">Go to Starred</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            g
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">then</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            s
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff]">Go to Sent</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            g
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">then</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            t
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff]">Go to Drafts</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            g
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">then</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            d
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff]">Go to All Mail</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            g
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">then</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            a
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h3 className=" font-semibold text-gray-700 dark:text-[#fff] mb-3">Actions</h3>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Compose new email</span>
                                                                    <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                        c
                                                                    </kbd>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff]">Search</span>
                                                                    <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                        /
                                                                    </kbd>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff]">Send email (in compose)</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            ⌘
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">+</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            Enter
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff]">Save draft (in compose)</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            ⌘
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">+</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            S
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h3 className=" font-semibold text-gray-700 dark:text-[#fff] mb-3">Email List</h3>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Select/Deselect email</span>
                                                                    <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                        x
                                                                    </kbd>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Select all emails</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            *
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">then</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            a
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Deselect all emails</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            *
                                                                        </kbd>
                                                                        <span className="text-gray-400 dark:text-[#fff] mx-1">then</span>
                                                                        <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                            n
                                                                        </kbd>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Archive selected emails</span>
                                                                    <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                        e
                                                                    </kbd>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Delete selected emails</span>
                                                                    <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                        #
                                                                    </kbd>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Mark as read</span>
                                                                    <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                        r
                                                                    </kbd>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Mark as unread</span>
                                                                    <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                        u
                                                                    </kbd>
                                                                </div>
                                                                <div className="flex items-center justify-between p-2 border-b dark:border-gray-600 border-gray-100 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                    <span className="text-gray-600 dark:text-[#fff] ">Star/Unstar email</span>
                                                                    <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                        s
                                                                    </kbd>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border border-[#e5e7eb] salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400 dark:border-gray-600 shadow-sm">
                                                <CardContent className="p-6">
                                                    <h2 className="text-xl text-gray-800 dark:text-[#fff] mb-4 pt-4">Custom Shortcuts</h2>

                                                    <div className="space-y-4 mb-6">
                                                        <div className="flex items-center justify-between p-3 border dark:border-gray-600 border-gray-200 rounded-md salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div>
                                                                <div className=" text-gray-700 dark:text-[#fff]">Forward and Archive</div>
                                                                <div className=" text-gray-500 dark:text-[#fff]">Forward email and archive original</div>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                    Shift
                                                                </kbd>
                                                                <span className="text-gray-400 dark:text-[#fff] mx-1">+</span>
                                                                <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                    f
                                                                </kbd>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 border dark:border-gray-600 border-gray-200 rounded-md salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div>
                                                                <div className=" text-gray-700 dark:text-[#fff]">Apply Important Label</div>
                                                                <div className=" text-gray-500 dark:text-[#fff]">Mark email as important</div>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                    Shift
                                                                </kbd>
                                                                <span className="text-gray-400 dark:text-[#fff] mx-1">+</span>
                                                                <kbd className="px-2 py-1 bg-gray-100 border dark:bg-[#202127] dark:border-gray-600 dark:text-[#fff] border-gray-300 rounded text-xs font-mono">
                                                                    i
                                                                </kbd>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button className="w-full  bg-[#2565C7] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black dark:bg-[#202127] hover:bg-[#2ba99e] cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] py-2.5 ">
                                                        Add Custom Shortcut
                                                    </button>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* users And Address Tab */}
                                <TabsContent value="usersAndAddress" className=" m-0 border-none">
                                    <div className="w-full ">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff]">Users and Addresses</h1>
                                        </div>
                                        <div className="p-5 overflow-auto h-[85vh]">
                                            <Card className="p-5 border border-gray-200 dark:border-gray-600 salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                                    <div className="text-gray-600 dark:text-[#fff] ">
                                                        You are currently using <span className="font-medium">64</span> of your <span className="font-medium">80</span> available user licenses.
                                                    </div>

                                                    <button className="bg-[#1a488e] classic:bg-[#a8c7fa] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:text-black peach:bg-[#1b2e4b] hover:bg-[#1a488e] cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] dark:bg-[#202127]  py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3   text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]">
                                                        Get more licenses
                                                    </button>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                                    <button
                                                        onClick={() => setNewAccount(!newAccount)}
                                                        className="bg-[#1a488e] peach:bg-[#1b2e4b] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]  classic:bg-[#a8c7fa] classic:text-black hover:bg-[#1a488e] cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] dark:bg-[#202127]  py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3   text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                    >
                                                        New account
                                                    </button>
                                                    <button
                                                        className="border-[#1a488e]   classic:hover:bg-[#a8c7fa] blue:border-[#5cb2f8] hover:blue:bg-[#4999db] classic:hover:text-black cornflower:hover:bg-[#6BB8C5] cornflower:hover:border-[#6BB8C5]  peach:hover:bg-[#1b2e4b] py-2.5  rounded-lg shadow-lg transition dark:border-gray-600  dark:hover:bg-[#202127] dark:text-[#fff] shadow-grey-700 px-3 border-[1px] hover:border-none hover:bg-[#1a488e] text-gray-700 hover:text-white salmonpink:border-[#42999b] salmonpink:hover:bg-[#297971] softazure:border-[#363852] softazure:hover:bg-[#4a4e69]"
                                                        onClick={() => setAddressModal(!addressModal)}
                                                    >
                                                        New user address
                                                    </button>
                                                    {addressModal && (
                                                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                            <div className="bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-md">
                                                                <div className="flex justify-between items-center p-6 border-b">
                                                                    <h2 className=" font-bold text-gray-700 dark:text-[#fff] lightmint:text-white">Add address</h2>
                                                                    <button
                                                                        className="text-gray-500 lightmint:text-white hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-600 salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]"
                                                                        onClick={() => setAddressModal(false)}
                                                                    >
                                                                        <X className="h-5 w-5" />
                                                                    </button>
                                                                </div>

                                                                <div className="p-6">
                                                                    {/* User */}
                                                                    <div className="mb-6">
                                                                        <label className="block  font-semibold text-gray-700 dark:text-[#fff] lightmint:text-white mb-1">User</label>
                                                                        <div className="text-gray-900 dark:text-[#fff] lightmint:text-white">himansingh9</div>
                                                                    </div>

                                                                    {/* Address */}
                                                                    <div className="mb-6">
                                                                        <label htmlFor="address" className="block  font-semibold text-gray-700 dark:text-[#fff] lightmint:text-white mb-1">
                                                                            Address
                                                                        </label>
                                                                        <div className="flex">
                                                                            <input
                                                                                type="text"
                                                                                id="address"
                                                                                className="flex-1 px-4 py-3 border border-purple-300 lightmint:bg-green-50 dark:border-gray-600 dark:bg-[#2F2F2F] rounded-l-lg focus:outline-none focus:ring-2 focus:[#2ba99e]"
                                                                                placeholder="Address"
                                                                                value={address}
                                                                                onChange={(e) => setAddress(e.target.value)}
                                                                            />
                                                                            <div className="relative" ref={dropdownRef}>
                                                                                <button
                                                                                    type="button"
                                                                                    className="flex items-center justify-between px-4 py-3 border border-purple-300 lightmint:bg-green-50 dark:border-gray-600 dark:bg-[#2F2F2F] rounded-r-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2ba99e]"
                                                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                                                >
                                                                                    <span>{selectedDomain}</span>
                                                                                    <ChevronDown className="h-4 w-4 ml-2" />
                                                                                </button>

                                                                                {isDropdownOpen && (
                                                                                    <div className="absolute right-0 mt-1 w-full bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 overflow-hidden">
                                                                                        {domains.map((domain) => (
                                                                                            <button
                                                                                                key={domain}
                                                                                                className={`block w-full text-left px-4 py-2 ${domain === selectedDomain ? 'bg-[#2ba99e]  text-white' : 'hover:bg-gray-100 dark:hover:bg-[#202127]'
                                                                                                    }`}
                                                                                                onClick={() => {
                                                                                                    setSelectedDomain(domain);
                                                                                                    setIsDropdownOpen(false);
                                                                                                }}
                                                                                            >
                                                                                                {domain}
                                                                                            </button>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Display name */}
                                                                    <div className="mb-6">
                                                                        <label htmlFor="displayName" className="block  font-medium text-gray-700 dark:text-[#fff] mb-1">
                                                                            Display name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            id="displayName"
                                                                            className="w-full px-4 py-3 border lightmint:bg-green-50 border-gray-300 dark:border-gray-600 dark:bg-[#2F2F2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ba99e]"
                                                                            placeholder="Choose display name"
                                                                            value={displayName}
                                                                            onChange={(e) => setDisplayName(e.target.value)}
                                                                        />
                                                                    </div>

                                                                    {/* Buttons */}
                                                                    <div className="flex justify-end space-x-3 mt-8">
                                                                        <button className="bg-[#2565C7] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] cornflower:text-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F]  py-3 rounded-lg shadow-lg transition shadow-grey-700 px-4 hover:bg-[#2ba99e] text-white softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                                            Save address
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex-grow"></div>
                                                    {/* <div className="relative w-full sm:w-auto">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                        <Input className="pl-10 w-full sm:w-[300px]  border-gray-200 dark:border-gray-600 dark:bg-[#202127]" placeholder="Search users and addresses" />
                                                    </div> */}
                                                </div>
                                            </Card>

                                            <div className="overflow-hidden   border border-gray-200 dark:border-gray-600 rounded-lg  my-7 salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="border-t border-b border-gray-200  softazure:!bg-[#9a8c98]  peach:!bg-[#1b2e4b] classic:!bg-[#a8c7fa] classic:!text-black cornflower:!bg-[#6BB8C5] dark:!bg-[#202127] lightmint:!bg-[#629e7c]  dark:border-gray-600 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <th className="py-3 px-4 text-left  font-semibold softazure:text-white peach:text-white cornflower:text-white lightmint:text-white text-gray-700 dark:text-[#fff]">
                                                                Name
                                                            </th>
                                                            <th className="py-3 px-4 text-left  font-semibold softazure:text-white peach:text-white cornflower:text-white lightmint:text-white text-gray-700 dark:text-[#fff]">
                                                                <div className="flex items-center">
                                                                    Role
                                                                    <Info className="w-4 h-4 text-gray-400 ml-1" />
                                                                </div>
                                                            </th>
                                                            <th className="py-3 px-4 text-left  font-semibold softazure:text-white peach:text-white cornflower:text-white lightmint:text-white text-gray-700 dark:text-[#fff]">
                                                                Addresses
                                                            </th>
                                                            <th className="py-3 px-4 text-left  font-semibold softazure:text-white peach:text-white cornflower:text-white lightmint:text-white text-gray-700 dark:text-[#fff]">
                                                                Features
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="border-b border-gray-200 dark:border-gray-600 ">
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center mb-2">
                                                                    <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-gray-700 mr-3">H</div>
                                                                    <span className="text-gray-900 dark:text-[#fff]">himansingh9</span>
                                                                </div>
                                                                <div className="flex space-x-2">
                                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-semibold rounded-md">IT'S YOU</span>
                                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-semibold rounded-md">PRIVATE</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4 text-gray-900 dark:text-[#fff]">Primary admin</td>
                                                            <td className="py-4 px-4">
                                                                <a href="mailto:himansingh9@proton.me" className="text-blue-600 dark:text-[#fff] hover:underline">
                                                                    himansingh9@proton.me
                                                                </a>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex justify-between items-center">
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center">
                                                                            <FileText className="w-4 h-4 text-gray-500 dark:text-[#fff] mr-2" />
                                                                            <span className="text-gray-900 dark:text-[#fff]">0.00 GB / 5.00 GB</span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <Shield className="w-4 h-4 text-gray-500 dark:text-[#fff] mr-2" />
                                                                            <span className="text-gray-900 dark:text-[#fff]">10 VPN connections</span>
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        className="px-4 py-1 border peach:bg border-gray-300 dark:border-gray-600 rounded dark:bg-[#202127] hover:bg-gray-50 text-gray-700 dark:text-[#fff] salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]"
                                                                        onClick={() => setUserEdit(!userEdit)}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    {userEdit && (
                                                                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                                                                            <div className="bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-lg shadow-lg w-[40%] max-h-[85vh] flex flex-col">
                                                                                {/* Header */}
                                                                                <div className="flex justify-between items-center p-6 border-b dark:border-gray-600">
                                                                                    <h2 className="text-2xl font-bold lightmint:text-white">Edit user</h2>
                                                                                    <button className="text-gray-500 lightmint:text-white hover:text-gray-700" onClick={() => setUserEdit(false)}>
                                                                                        <X className="h-6 w-6" />
                                                                                    </button>
                                                                                </div>

                                                                                {/* Scrollable Content */}
                                                                                <div className="overflow-y-auto p-6 flex-1">
                                                                                    {/* Name Section */}
                                                                                    <div className="mb-6">
                                                                                        <label
                                                                                            htmlFor="name"
                                                                                            className="block text-left  font-semibold lightmint:text-white text-gray-700 dark:text-[#fff] mb-2"
                                                                                        >
                                                                                            Name
                                                                                        </label>
                                                                                        <input
                                                                                            type="text"
                                                                                            id="name"
                                                                                            className="w-full px-4 py-3 border border-purple-300 lightmint:bg-green-50 dark:border-gray-600 dark:bg-[#2F2F2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                            defaultValue="himansingh9"
                                                                                        />
                                                                                    </div>

                                                                                    {/* Toggles Section */}
                                                                                    <div className="space-y-4 mb-6">
                                                                                        <div className="flex items-center ">
                                                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                                                <Switch />
                                                                                            </label>
                                                                                            <span className="ms-3  font-medium lightmint:text-white text-gray-900 dark:text-[#fff]">
                                                                                                VPN connections
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="flex items-center">
                                                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                                                <Switch />
                                                                                            </label>
                                                                                            <span className="ms-3 text-left  font-medium lightmint:text-white text-gray-900 dark:text-[#fff]">
                                                                                                Writing assistant
                                                                                                <Link to="" className="block underline ">
                                                                                                    {' '}
                                                                                                    Add to your subscription
                                                                                                </Link>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Account Storage Section */}
                                                                                    <div className="mb-6">
                                                                                        <div>
                                                                                            <h3 className=" font-medium lightmint:text-white text-gray-700 dark:text-[#fff] mb-2 text-left">
                                                                                                Account storage
                                                                                            </h3>
                                                                                            <div className="text-left">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className="w-32 px-4 py-2 border border-gray-300 lightmint:bg-green-50 dark:border-gray-600 dark:bg-[#2F2F2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                                                                                                    value={`${((sliderValue / 1024) * 5).toFixed(1)}`}
                                                                                                    onChange={(e) => {
                                                                                                        const value = Number.parseFloat(e.target.value);
                                                                                                        if (!isNaN(value) && value >= 0 && value <= 5) {
                                                                                                            setSliderValue(Math.round((value / 5) * 1024));
                                                                                                        }
                                                                                                    }}
                                                                                                />
                                                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#fff]  ">GB</span>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* <div className="flex items-center gap-6">
                                            
                                              <div className="relative w-24 h-24">
                                                <div className="w-full h-full rounded-full bg-gray-200"></div>
                                                <div className="absolute inset-2 rounded-full border-8 border-gray-100"></div>
                                              </div>
                                            </div> */}

                                                                                        {/* Legend */}
                                                                                        {/* <div className="flex flex-wrap gap-4 mt-4">
                                              <div className="flex items-center">
                                                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                                                <span className=" text-gray-700">Already used</span>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div>
                                                <span className=" text-gray-700">Already allocated</span>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="w-4 h-4 rounded-full bg-teal-500 mr-2"></div>
                                                <span className=" text-gray-700">Allocated</span>
                                              </div>
                                            </div> */}

                                                                                        {/* Slider */}
                                                                                        <div className="mt-6 mb-2 relative">
                                                                                            <div className="relative" ref={sliderRef}>
                                                                                                {/* Tooltip showing current value */}
                                                                                                <div
                                                                                                    className="absolute -top-10 transform -translate-x-1/2 transition-all duration-100"
                                                                                                    style={{ left: `${percentage}%` }}
                                                                                                >
                                                                                                    <div className="focus:bg-black dark:focus:bg-[#202127] lightmint:text-black text-white px-3 py-1 rounded  after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent focus:after:border-t-black">
                                                                                                        {sliderValue.toFixed(1)}
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Slider track with filled portion */}
                                                                                                <div
                                                                                                    className="h-8 bg-gray-200 lightmint:bg-green-50 dark:bg-[#2F2F2F] rounded-sm relative cursor-pointer"
                                                                                                    onClick={handleTrackClick}
                                                                                                >
                                                                                                    {/* Green filled portion */}
                                                                                                    <div
                                                                                                        className="absolute top-0 left-0 h-full bg-emerald-500 rounded-l-sm transition-all duration-100"
                                                                                                        style={{ width: `${percentage}%` }}
                                                                                                    ></div>

                                                                                                    {/* Slider thumb */}
                                                                                                    <div
                                                                                                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white dark:bg-[#2F2F2F] rounded-full shadow-md flex items-center justify-center border border-gray-300 dark:border-gray-600 cursor-grab active:cursor-grabbing transition-all duration-100"
                                                                                                        style={{ left: `${percentage}%` }}
                                                                                                        onMouseDown={handleDragStart}
                                                                                                        onTouchStart={handleDragStart}
                                                                                                    >
                                                                                                        <svg
                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                            width="16"
                                                                                                            height="16"
                                                                                                            viewBox="0 0 24 24"
                                                                                                            fill="none"
                                                                                                            stroke="currentColor"
                                                                                                            strokeWidth="2"
                                                                                                            strokeLinecap="round"
                                                                                                            strokeLinejoin="round"
                                                                                                        >
                                                                                                            <path d="M7 20l10-10M18 4v16M4 4v16" />
                                                                                                        </svg>
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Scale markers */}
                                                                                                <div className="flex justify-between mt-1">
                                                                                                    <span className=" text-gray-600 lightmint:text-white dark:text-[#fff]">0</span>
                                                                                                    <span className=" text-gray-600 lightmint:text-white dark:text-[#fff]">1024</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Addresses Section */}
                                                                                    <div className="mb-6 text-left">
                                                                                        <h3 className="font-bold  lightmint:text-white text-gray-700 dark:text-[#fff] mb-2">Addresses</h3>
                                                                                        <button
                                                                                            className="px-4 py-2 border border-gray-300 lightmint:bg-green-50 dark:border-gray-600 rounded-lg  mb-4 salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]"
                                                                                            onClick={() => setAddressModal(!addressModal)}
                                                                                        >
                                                                                            Add address
                                                                                        </button>

                                                                                        {addressModal && (
                                                                                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                                                <div className="bg-white dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-md">
                                                                                                    <div className="flex justify-between items-center p-6 border-b">
                                                                                                        <h2 className=" font-bold">Add address</h2>

                                                                                                        <button
                                                                                                            className="text-gray-500 dark:text-[#fff] hover:text-gray-700"
                                                                                                            onClick={() => setAddressModal(false)}
                                                                                                        >
                                                                                                            <X className="h-5 w-5" />
                                                                                                        </button>
                                                                                                    </div>

                                                                                                    <div className="p-6">
                                                                                                        {/* User */}
                                                                                                        <div className="mb-6">
                                                                                                            <label className="block  font-semibold text-gray-700 dark:text-[#fff] mb-1 ">User</label>
                                                                                                            <div className="text-gray-900 dark:text-[#fff]">himansingh9</div>
                                                                                                        </div>

                                                                                                        {/* Address */}
                                                                                                        <div className="mb-6">
                                                                                                            <label
                                                                                                                htmlFor="address"
                                                                                                                className="block  font-semibold text-gray-700 dark:text-[#fff] mb-1"
                                                                                                            >
                                                                                                                Address
                                                                                                            </label>
                                                                                                            <div className="flex">
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    id="address"
                                                                                                                    className="flex-1 px-4 py-3 border border-purple-300 rounded-l-lg focus:outline-none focus:ring-2 focus:[#2ba99e]"
                                                                                                                    placeholder="Address"
                                                                                                                    value={address}
                                                                                                                    onChange={(e) => setAddress(e.target.value)}
                                                                                                                />
                                                                                                                <div className="relative" ref={dropdownRef}>
                                                                                                                    <button
                                                                                                                        type="button"
                                                                                                                        className="flex items-center justify-between px-4 py-3 border border-purple-300 rounded-r-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2ba99e]"
                                                                                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                                                                                    >
                                                                                                                        <span>{selectedDomain}</span>
                                                                                                                        <ChevronDown className="h-4 w-4 ml-2" />
                                                                                                                    </button>

                                                                                                                    {isDropdownOpen && (
                                                                                                                        <div className="absolute right-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
                                                                                                                            {domains.map((domain) => (
                                                                                                                                <button
                                                                                                                                    key={domain}
                                                                                                                                    className={`block w-full text-left px-4 py-2 ${domain === selectedDomain
                                                                                                                                        ? 'bg-[#2ba99e] text-white'
                                                                                                                                        : 'hover:bg-gray-100'
                                                                                                                                        }`}
                                                                                                                                    onClick={() => {
                                                                                                                                        setSelectedDomain(domain);
                                                                                                                                        setIsDropdownOpen(false);
                                                                                                                                    }}
                                                                                                                                >
                                                                                                                                    {domain}
                                                                                                                                </button>
                                                                                                                            ))}
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>

                                                                                                        {/* Display name */}
                                                                                                        <div className="mb-6">
                                                                                                            <label htmlFor="displayName" className="block  font-medium text-gray-700 mb-1">
                                                                                                                Display name
                                                                                                            </label>
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                id="displayName"
                                                                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ba99e]"
                                                                                                                placeholder="Choose display name"
                                                                                                                value={displayName}
                                                                                                                onChange={(e) => setDisplayName(e.target.value)}
                                                                                                            />
                                                                                                        </div>

                                                                                                        {/* Buttons */}
                                                                                                        <div className="flex justify-end space-x-3 mt-8">
                                                                                                            <button className="salmonpink:bg-[#42999b] classic:bg-[#a8c7fa] classic:text-black salmonpink:hover:bg-[#297971] bg-[#2565C7] py-3 rounded-lg shadow-lg transition shadow-grey-700 px-4 hover:bg-[#2ba99e] text-white">
                                                                                                                Save address
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}

                                                                                        <div className=" text-gray-600 lightmint:text-white dark:text-[#fff] mb-4 ">1 of 20 email addresses</div>

                                                                                        {/* Email Address Card */}
                                                                                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div className="flex-1">
                                                                                                    <div className="text-gray-900 lightmint:text-white dark:text-[#fff] mb-2">himansingh9@UB.me</div>
                                                                                                    <div className="flex gap-2">
                                                                                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                                                                                            DEFAULT
                                                                                                        </span>
                                                                                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                                                                            ACTIVE
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <button
                                                                                                        className="bg-[#2565C7] py-1.5 classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] cornflower:text-white rounded-lg lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] shadow-lg transition peach:bg-[#1b2e4b] shadow-grey-700 px-4 hover:bg-[#2ba99e] text-white"
                                                                                                        onClick={() => setEditEmailAddressModal(!editEmailAddressModal)}
                                                                                                    >
                                                                                                        Edit
                                                                                                    </button>
                                                                                                    {editEmailAddressModal && (
                                                                                                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                                                            <div className="bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-lg">
                                                                                                                <div className="flex justify-between items-center p-6 border-b">
                                                                                                                    <h2 className="  font-bold">Edit email address</h2>
                                                                                                                    <button
                                                                                                                        className="text-gray-500 lightmint:text-white dark:text-[#fff] hover:text-gray-700"
                                                                                                                        onClick={() => setEditEmailAddressModal(false)}
                                                                                                                    >
                                                                                                                        <X className="h-5 w-5" />
                                                                                                                    </button>
                                                                                                                </div>

                                                                                                                <div className="p-6">
                                                                                                                    <p className="text-gray-600 lightmint:text-white dark:text-[#fff] mb-6">
                                                                                                                        You can change capitalization or punctuation to edit your email address.
                                                                                                                    </p>

                                                                                                                    {/* Address */}
                                                                                                                    <div className="mb-6">
                                                                                                                        <label
                                                                                                                            htmlFor="address"
                                                                                                                            className="block   font-medium text-gray-700 lightmint:text-white dark:text-[#fff] mb-1"
                                                                                                                        >
                                                                                                                            Address
                                                                                                                        </label>
                                                                                                                        <div className="flex">
                                                                                                                            <input
                                                                                                                                type="text"
                                                                                                                                id="address"
                                                                                                                                className="flex-1 px-4 py-3 border border-purple-300 dark:border-gray-600 rounded-l-lg dark:bg-[#2F2F2F] focus:outline-none  focus:ring-2 focus:ring-[#2ba99e]"
                                                                                                                                value={addressValue}
                                                                                                                                onChange={(e) => setAddressValue(e.target.value)}
                                                                                                                            />
                                                                                                                            <div className="flex items-center justify-center px-4 lightmint:text-black lightmint:bg-green-50 py-3 border  border-purple-300  dark:border-gray-600 rounded-r-lg dark:bg-[#2F2F2F] text-gray-500">
                                                                                                                                {domainName}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    {/* Display name */}
                                                                                                                    <div className="mb-6">
                                                                                                                        <label
                                                                                                                            htmlFor="displayName"
                                                                                                                            className="block  font-medium text-gray-700 lightmint:text-white dark:text-[#fff] mb-1"
                                                                                                                        >
                                                                                                                            Display name
                                                                                                                        </label>
                                                                                                                        <input
                                                                                                                            type="text"
                                                                                                                            id="displayName"
                                                                                                                            className="w-full px-4 py-3 border border-gray-300 lightmint:bg-green-50 dark:border-gray-600 rounded-lg dark:bg-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#2ba99e]"
                                                                                                                            value={displayNameValue}
                                                                                                                            onChange={(e) => setDisplayNameValue(e.target.value)}
                                                                                                                        />
                                                                                                                    </div>

                                                                                                                    {/* Buttons */}
                                                                                                                    <div className="flex justify-end space-x-3 mt-8">
                                                                                                                        <button
                                                                                                                            className="px-5 py-2 border border-gray-300 lightmint:bg-green-50  peach:bg-[#1b2e4b] peach:text-white dark:border-gray-600 dark:bg-[#2F2F2F] rounded-lg text-gray-700 lightmint:text-black dark:text-[#fff] hover:bg-gray-50"
                                                                                                                            onClick={() => setEditEmailAddressModal(false)}
                                                                                                                        >
                                                                                                                            Cancel
                                                                                                                        </button>

                                                                                                                        <button className="bg-[#2565C7] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] cornflower:text-white lightmint:bg-green-50 peach:bg-[#1b2e4b] peach:text-white dark:bg-[#2F2F2F] py-3 rounded-lg shadow-lg transition shadow-grey-700 px-4 hover:bg-[#2ba99e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                                                                                            Save
                                                                                                                        </button>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Footer */}
                                                                                <div className="p-6 border-t dark:border-gray-600 flex justify-end">
                                                                                    <button className="bg-[#2565C7] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] cornflower:text-white lightmint:bg-green-50 peach:bg-[#1b2e4b] peach:text-white dark:bg-[#2F2F2F] py-2 rounded-lg shadow-lg transition shadow-grey-700 px-4 hover:bg-[#2ba99e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                                                        Save
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <Card className="p-6 dark:border-gray-600 salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                                                <h1 className="text-2xl text-gray-900 dark:text-[#fff] mb-2 ">Create multiple user accounts</h1>
                                                <p className="text-gray-700 dark:text-[#fff] mb-4 ">Add multiple users to your organization at once.</p>

                                                <p className="text-gray-700 dark:text-[#fff] mb-6 ">
                                                    Download our CSV template, fill in the user details, and then upload your completed CSV file to create accounts for these users.
                                                </p>

                                                <div className="flex flex-wrap gap-4">
                                                    <button className="px-3  py-2.5 bg-gray-100 dark:border-[#202127] dark:bg-[#2F2F2F] text-gray-500 dark:text-[#fff] rounded-md hover:bg-gray-200 transition-colors salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                        Upload CSV file
                                                    </button>

                                                    <button className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] cornflower:bg-[#6BB8C5] classic:bg-[#a8c7fa] classic:text-black lightmint:bg-[#629e7c] peach:bg-[#1b2e4b] lightmint:text-white dark:bg-[#202127] hover:bg-[#1a488e] py-2.5  rounded-lg shadow-lg transition shadow-grey-700 px-3  text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:hover:bg-[#4a4e69] softazure:bg-[#363852]">
                                                        Download CSV sample
                                                    </button>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Domain Name */}
                                <TabsContent value="domainNames" className=" m-0 border-none">
                                    <div className="w-full ">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-medium lightmint:text-white text-gray-800 dark:text-[#fff]">Domain Names</h1>
                                        </div>
                                        <div className='p-5 h-[85vh] thin-scrollbar overflow-auto' >
                                            <Card className="p-6 dark:border-gray-600 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                <div className="mb-8">
                                                    <p className="text-gray-700 dark:text-[#fff] mb-1 ">
                                                        Connect your custom domain to UB to set up custom email addresses (e.g., you@yourcompany.com). Our wizard will guide you through the process.
                                                    </p>
                                                    <a href="#" className="text-[#1a488e]  hover:underline ">
                                                        Learn more
                                                    </a>
                                                </div>

                                                <div className="flex gap-3 mb-8">
                                                    <button
                                                        onClick={() => setAddDomain(!addDomain)}
                                                        className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] lightmint:bg-[#629e7c] cornflower:bg-[#6BB8C5] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] lightmint:text-white dark:bg-[#202127] hover:bg-[#1a488e] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3   text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                    >
                                                        Add domain
                                                    </button>
                                                    {addDomain && (
                                                        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                                                            <div className="bg-white lightmint:bg-[#629e7c] text-[#000] dark:bg-[#202127] rounded-lg shadow-xl w-full max-w-md p-6">
                                                                <div className="flex justify-between items-center mb-6">
                                                                    <h2 className=" dark:text-[#fff] lightmint:text-white">Add Domain Name</h2>
                                                                    <button onClick={() => setAddDomain(false)} className="text-gray-500 dark:text-[#fff] hover:text-gray-700">
                                                                        <X className="w-5 h-5" />
                                                                    </button>
                                                                </div>

                                                                <div className="mb-6">
                                                                    <label htmlFor="organization-name" className="block text-gray-700 lightmint:text-white dark:text-[#fff]  mb-2">
                                                                        Domain Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="organization-name"
                                                                        value={domain}
                                                                        onChange={(e) => setDomain(e.target.value)}
                                                                        placeholder="Enter domain name"
                                                                        className="w-full px-3 py-2 border lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:text-[#fff] border-[#1a488e] dark:border-[#202127] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1a488e]"
                                                                    />
                                                                </div>

                                                                <div className="flex justify-between">
                                                                    <button
                                                                        onClick={() => setAddDomain(false)}
                                                                        className="px-4 py-2 peach:bg-[#1b2e4b] peach:text-white lightmint:bg-green-50 lightmint:text-black dark:border-gray-600 dark:bg-[#2F2F2F] dark:text-[#fff] border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                                                    >
                                                                        Cancel
                                                                    </button>

                                                                    <button
                                                                        onClick={handleAddDomain}
                                                                        disabled={isLoading}
                                                                        className="bg-[#2565C7] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] peach:text-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] py-2 rounded-lg shadow-lg transition shadow-grey-700 px-4 hover:bg-[#1a488e] text-white softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                                    >
                                                                        {isLoading ? 'Saving...' : 'Save'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {reviewDomain && reviewData && (
                                                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                                            <div className="bg-white dark:bg-[#202127] dark:text-white lightmint:bg-[#629e7c] text-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                                                                <div className="flex justify-between items-center border-b pb-3 mb-4">
                                                                    <h2 className="text-xl text-[#000] lightmint:text-white dark:text-[#fff]">Domain Review</h2>
                                                                    <button onClick={() => setReviewDomain(false)} className="text-gray-400 dark:text-[#fff] hover:text-gray-600 transition-colors">
                                                                        <X className="w-6 h-6" />
                                                                    </button>
                                                                </div>
                                                                <div className="grid grid-cols-[1fr_4fr] gap-x-1 gap-y-1 items-center">
                                                                    <p className="text-gray-600 dark:text-[#fff] lightmint:text-white font-bold text-left pr-1">Domain :</p>
                                                                    <p className="text-gray-900 dark:text-[#fff] lightmint:text-white">{reviewData.domain_name}</p>

                                                                    <p className="text-gray-600 dark:text-[#fff] lightmint:text-white font-bold text-left pr-1">DKIM :</p>
                                                                    <p className="text-gray-900 dark:text-[#fff] lightmint:text-white">{reviewData.dkim}</p>

                                                                    <p className="text-gray-600 dark:text-[#fff] lightmint:text-white font-bold text-left pr-1">DMARC:</p>
                                                                    <p className="text-gray-900 dark:text-[#fff] lightmint:text-white">{reviewData.dmarc}</p>

                                                                    <p className="text-gray-600 dark:text-[#fff] lightmint:text-white font-bold text-left pr-1">MX:</p>
                                                                    <p className="text-gray-900 dark:text-[#fff] lightmint:text-white">{reviewData.mx}</p>

                                                                    <p className="text-gray-600 dark:text-[#fff] lightmint:text-white font-bold text-left pr-1">SPF:</p>
                                                                    <p className="text-gray-900 dark:text-[#fff] lightmint:text-white">{reviewData.spf}</p>
                                                                </div>

                                                                <div className="flex justify-end mt-6">
                                                                    <button
                                                                        onClick={() => setReviewDomain(false)}
                                                                        className="bg-[#1a488e] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] peach:text-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] text-white font-medium px-4 py-2 rounded-md shadow hover:bg-[#4052b5] transition-colors"
                                                                    >
                                                                        Close
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* <button className="border-[#1a488e]  cornflower:hover:bg-[#6BB8C5] cornflower:hover:text-white peach:hover:bg-[#1b2e4b] peach:hover:text-white dark:text-[#fff] lightmint:hover:bg-[#629e7c] lightmint:hover:text-white dark:border-[#202127] dark:hover:bg-[#202127] border-[1px] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3 text-[1px] hover:bg-[#1a488e] text-dark hover:text-white salmonpink:border-[#42999b] salmonpink:hover:bg-[#297971] softazure:border-[#363852] softazure:hover:bg-[#4a4e69] ">
                                                        Refresh status
                                                    </button> */}
                                                    <button className="bg-[#1a488e] lightmint:bg-[#629e7c] cornflower:bg-[#6BB8C5] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] lightmint:text-white dark:bg-[#202127] hover:bg-[#1a488e] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3   text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]">Refresh Status</button>
                                                </div>
                                            </Card>
                                            <Card className="p-6 mt-5 salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead>
                                                            <tr className="text-left peach:!bg-[#1b2e4b] softazure:!bg-[#9a8c98] lightmint:!bg-[#629e7c] cornflower:!bg-[#6BB8C5] dark:!bg-[#202127]">
                                                                <th className="px-6 py-4  font-medium peach:text-white softazure:text-white lightmint:text-white cornflower:text-white text-gray-700 dark:text-[#fff]">
                                                                    Domain
                                                                </th>
                                                                <th className="px-6 py-4  font-medium peach:text-white softazure:text-white lightmint:text-white cornflower:text-white text-gray-700 dark:text-[#fff] ">
                                                                    Status
                                                                </th>
                                                                <th className="px-6 py-4  font-medium peach:text-white softazure:text-white lightmint:text-white cornflower:text-white text-gray-700 dark:text-[#fff] text-right">
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {domainData.map((domain) => (
                                                                <tr key={domain.id}>
                                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <span className="text-red-500 mr-2">
                                                                                <X className="h-5 w-5" />
                                                                            </span>
                                                                            <span className="text-gray-900">{domain.domain_name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                                        <div className="flex flex-wrap gap-2">
                                                                            <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-200 text-gray-800">
                                                                                {domain.is_verify || 'PENDING'}
                                                                            </span>
                                                                            {/* Add more tags as needed */}
                                                                            {/* Additional tags */}
                                                                            {['MX', 'SPF', 'DKIM', 'DMARC', 'CATCH-ALL', '0 ADDRESSES'].map((tag) => {
                                                                                // Convert tag to the domain property key format:
                                                                                // Lowercase, remove dashes and spaces
                                                                                const key = tag.toLowerCase().replace(/[- ]/g, '') as keyof Domain;

                                                                                return domain[key] ? (
                                                                                    // render something if domain[key] exists
                                                                                    <span key={tag} className="some-class">
                                                                                        {tag}
                                                                                    </span>
                                                                                ) : null;
                                                                            })}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-6 whitespace-nowrap text-right">
                                                                        <div className="flex justify-end">
                                                                            <button
                                                                                onClick={() => {
                                                                                    console.log(`Domain ID: ${domain.id}`);
                                                                                    setReviewData(domain);
                                                                                    setReviewDomain(true);
                                                                                }}
                                                                                className="py-1 rounded-md shadow-sm  font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2 underline underline-offset-2"
                                                                            >
                                                                                Review
                                                                            </button>
                                                                            <Tippy content="Delete">
                                                                                <button
                                                                                    onClick={() => setDeleteDomainName(domain)}
                                                                                    className="h-8 w-8 p-0 text-red-500 hover:bg-gray-200 rounded-full flex justify-center items-center"
                                                                                >
                                                                                    <RiDeleteBin6Line size={18} />
                                                                                </button>
                                                                            </Tippy>
                                                                        </div>
                                                                        {deleteDomainName?.id === domain.id && (
                                                                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                                <div className="bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-md">
                                                                                    <div className="flex justify-between items-center p-6">
                                                                                        <h2 className=" text-xl lightmint:text-white dark:text-[#fff] ">Delete Domain Name</h2>
                                                                                        <button
                                                                                            className="salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] text-gray-500 hover:text-gray-700"
                                                                                            onClick={() => setDeleteDomainName(null)}
                                                                                        >
                                                                                            <X className="h-5 w-5" />
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="px-6 pb-6 text-left">
                                                                                        <p className="text-gray-700 lightmint:text-white dark:text-[#fff] mb-6">
                                                                                            Are you sure you want to delete <b>{domain.domain_name}</b>?
                                                                                        </p>
                                                                                        <div className="flex justify-end space-x-3">
                                                                                            <button
                                                                                                className="px-5 py-2 border border-gray-300 lightmint:bg-green-50 lightmint:text-black  dark:bg-[#2F2F2F] dark:border-[#202127]  rounded-lg text-gray-700 dark:text-[#fff] hover:bg-gray-50"
                                                                                                onClick={() => setDeleteDomainName(null)}
                                                                                            >
                                                                                                Cancel
                                                                                            </button>
                                                                                            <button
                                                                                                className="px-5 py-2 bg-[#1A488E] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] cornflower:text-white peach:bg-[#1b2e4b] lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] text-white rounded-lg hover:bg-[#1A488E]"
                                                                                                onClick={() => handleDelete(domain.id)}
                                                                                            >
                                                                                                Confirm
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Card>

                                            <Card className="p-6 mt-12 salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                                                <div className="">
                                                    <h2 className=" text-gray-900 dark:text-[#fff] mb-4">Catch-all address</h2>
                                                    <p className="text-gray-700 dark:text-[#fff] mb-1 ">
                                                        If you have a custom domain with UB Mail, you can set a catch-all email address to receive messages sent to your domain but to an invalid email
                                                        address (e.g., because of typos).
                                                    </p>
                                                    <a href="#" className="text-[#1a488e] hover:underline ">
                                                        Learn more
                                                    </a>
                                                </div>
                                            </Card>
                                        </div>


                                    </div>
                                </TabsContent>
                                {/* multi user support */}
                                <TabsContent value="multiUserSupport" className=" m-0 border-none">
                                    <div className="w-full ">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-mediu lightmint:text-white text-gray-800 dark:text-[#fff]">Multi User Support</h1>
                                        </div>
                                        <div className="p-5 h-[85vh] overflow-auto thin-scrollbar">
                                            <Card className="px-5 pt-3 salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                                                <h1 className="text-xl  text-gray-900 dark:text-[#fff]  mb-2">Customization</h1>
                                                <p className="text-gray-600 mb-1 dark:text-[#fff] ">
                                                    Add your name and logo to create a more personalized experience for your organization.
                                                </p>

                                                <a href="#" className="text-[#1a488e]  hover:underline mb-8 inline-block" onClick={() => setUploadLogo(!uploadLogo)}>
                                                    Tips on choosing a good logo
                                                </a>

                                                <div className="mt-4 space-y-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                                                            <span className="text-gray-700 dark:text-[#fff] ">Organization name</span>
                                                        </div>
                                                        <div className="w-full sm:w-2/3 flex items-center">
                                                            <span className="text-gray-900 dark:text-[#fff] mr-3 ">{organizationName.name}</span>
                                                            <button
                                                                className="text-[#1a488e] hover:underline"
                                                                onClick={() => {
                                                                    setOrgNameEdit(!orgNameEdit);
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            {orgNameEdit && (
                                                                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                                                                    <div className="bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] text-[#000] rounded-lg shadow-xl w-full max-w-md p-6">
                                                                        <div className="flex justify-between  items-center mb-6">
                                                                            <h2 className=" dark:text-[#fff] text-xl lightmint:text-white ">Change organization name</h2>
                                                                            <button onClick={() => setOrgNameEdit(false)} className="text-gray-500 dark:text-[#fff] hover:text-gray-700">
                                                                                <X className="w-5 h-5" />
                                                                            </button>
                                                                        </div>

                                                                        <div className="mb-6">
                                                                            <label
                                                                                htmlFor="organization-name"
                                                                                className="block text-gray-700 lightmint:text-white dark:text-[#fff] font-medium mb-2 "
                                                                            >
                                                                                Organization name
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                id="organization-name"
                                                                                value={editOrganizationName}
                                                                                onChange={(e) => setEditOrganizationName(e.target.value)}
                                                                                className="w-full px-3 py-2 border border-purple-300 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1a488e]"
                                                                            />
                                                                        </div>

                                                                        <div className="flex justify-between">
                                                                            <button
                                                                                onClick={() => setOrgNameEdit(false)}
                                                                                className="px-4 py-2 border border-gray-300 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-md hover:bg-gray-50 text-gray-700 "
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                className="bg-[#1a488e] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] peach:text-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] py-2  rounded-lg shadow-md transition shadow-grey-700 px-5 hover:bg-[#1a488e] text-white"
                                                                                onClick={() => handleEditOrganization(organizationName.id)}
                                                                            >
                                                                                Save
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <div className="w-full sm:w-1/3 mb-2 sm:mb-0 flex items-center">
                                                            <span className="text-gray-700 dark:text-[#fff]  mr-1">Organization identity</span>
                                                            <div className="relative group">
                                                                <Info className="w-4 h-4 text-gray-400" />
                                                                <div className="absolute left-0 bottom-full mb-2 w-64 bg-gray-800 dark:bg-[#202127] text-white text-xs p-2 rounded hidden group-hover:block">
                                                                    This is your organization's unique identifier.
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full sm:w-2/3 flex items-center">
                                                            <span className="text-gray-900 dark:text-[#fff] mr-2 ">{organizationName.ids}</span>
                                                            <Check className="w-4 h-4 text-green-500 mr-3" />
                                                            <button className=" text-[#2565C7] hover:underline" onClick={() => setOrgIdentityEdit(!orgIdentityEdit)}>
                                                                Edit
                                                            </button>
                                                            {orgIdentityEdit && (
                                                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                    <div className="bg-white lightmint:bg-[#629e7c] dark:bg-[#202127]  rounded-lg shadow-lg w-full max-w-md">
                                                                        <div className="flex justify-between items-center p-6 dark:border-gray-600 border-b">
                                                                            <h2 className=" text-xl dark:text-[#fff] lightmint:text-white ">Edit organization identity</h2>
                                                                            <button
                                                                                className="text-gray-500 dark:text-[#fff] hover:text-gray-700 salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]"
                                                                                onClick={() => setOrgIdentityEdit(false)}
                                                                            >
                                                                                <X className="h-5 w-5" />
                                                                            </button>
                                                                        </div>

                                                                        <div className="p-6 ">
                                                                            {/* Current Organization Identity */}
                                                                            <div className="mb-6">
                                                                                <label className="block font-medium  text-gray-700 lightmint:text-white dark:text-[#fff] mb-1">
                                                                                    Current organization identity
                                                                                </label>
                                                                                <div className="text-gray-900 dark:text-[#fff]">{organizationName.ids}</div>
                                                                            </div>

                                                                            {/* New Organization Identity */}
                                                                            <div className="mb-6">
                                                                                <label className="block  text-gray-700 lightmint:text-white dark:text-[#fff] mb-1 font-medium">
                                                                                    New organization identity
                                                                                </label>
                                                                                <div className="relative" ref={dropdownRef}>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-lg bg-white text-left focus:outline-none focus:ring-1  focus:ring-[#2565C7]"
                                                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                                                    >
                                                                                        <span>{selectedIdentity}</span>
                                                                                        <ChevronDown className="h-4 w-4 ml-2" />
                                                                                    </button>

                                                                                    {isDropdownOpen && (
                                                                                        <div className="absolute  left-0 right-0 mt-1 bg-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#202127] text-[#2565C7] rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                                                                                            {identities.map((identity) => (
                                                                                                <button
                                                                                                    key={identity}
                                                                                                    className={`block w-full text-left px-4 py-3 ${identity === selectedIdentity
                                                                                                        ? 'bg-purple-100 dark:bg-[#2F2F2F] text-[#2565C7]'
                                                                                                        : 'hover:bg-gray-50 dark:hover:bg-[#202127]'
                                                                                                        }`}
                                                                                                    onClick={() => {
                                                                                                        setSelectedIdentity(identity);
                                                                                                        setIsDropdownOpen(false);
                                                                                                    }}
                                                                                                >
                                                                                                    {identity}
                                                                                                </button>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Buttons */}
                                                                            <div className="flex justify-between mt-8">
                                                                                <button
                                                                                    className="px-5 py-2 border border-gray-300 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-lg text-gray-700 hover:bg-gray-50"
                                                                                    onClick={() => setOrgIdentityEdit(false)}
                                                                                >
                                                                                    Cancel
                                                                                </button>

                                                                                <button className="bg-[#2565C7] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] py-2 rounded-lg shadow-lg transition shadow-grey-700 px-5 hover:bg-[#2ba99e] text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]">
                                                                                    Save
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <div className="w-full sm:w-1/3 mb-2 sm:mb-0 flex items-center">
                                                            <span className="text-gray-700 dark:text-[#fff]   mr-1">Logo</span>
                                                            <div className="relative group">
                                                                <Info className="w-4 h-4 text-gray-400" />
                                                                <div className="absolute left-0 bottom-full mb-2 w-64 bg-gray-800 dark:bg-[#202127] text-white text-xs p-2 rounded hidden group-hover:block">
                                                                    Upload your organization logo.
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full pb-3 sm:w-2/3">
                                                            <button
                                                                className="bg-[#1a488e] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:text-black cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] hover:bg-[#1a488e] py-2.5  rounded-lg shadow-lg transition shadow-grey-700 px-3  text-white salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] salmonpink:bg-[#42999b]"
                                                                onClick={() => setUploadLogo(!uploadLogo)}
                                                            >
                                                                Upload
                                                            </button>

                                                            {uploadLogo && (
                                                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                    <div className="bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-xl ">
                                                                        <div className="flex justify-between items-center p-6 border-b">
                                                                            <h2 className=" dark:text-[#fff] text-xl lightmint:text-white ">Upload your organization's logo</h2>
                                                                            <button className="text-gray-500 dark:text-[#fff] hover:text-gray-700" onClick={() => setUploadLogo(false)}>
                                                                                <X className="h-5 w-5" />
                                                                            </button>
                                                                        </div>

                                                                        <div className="p-6">
                                                                            <p className="text-gray-700 lightmint:text-white dark:text-[#fff] mb-6">
                                                                                Users will see your logo instead of the UB icon when signed in on our web apps.
                                                                            </p>

                                                                            {/* File Upload Area */}
                                                                            <div
                                                                                className={`border-2 border-dashed rounded-lg p-6 mb-4 flex flex-col items-center justify-center ${isDragging
                                                                                    ? 'border-[#1a488e] lightmint:bg-green-50 lightmint:text-black dark:border-[#2F2F2F] bg-purple-50'
                                                                                    : 'border-gray-300 dark:border-[#202127]'
                                                                                    }`}
                                                                                onDragOver={handleDragOver}
                                                                                onDragLeave={handleDragLeave}
                                                                                onDrop={handleDrop}
                                                                            >
                                                                                {previewUrl ? (
                                                                                    <div className="mb-4">
                                                                                        <img src={previewUrl || organizationName.logo} alt="Logo preview" className="w-32 h-32 object-contain" />
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="text-gray-400 mb-4">
                                                                                        <Upload className="h-8 w-8 mx-auto" />
                                                                                    </div>
                                                                                )}

                                                                                <p className="text-gray-700 dark:text-[#fff] lightmint:text-white text-center mb-4">
                                                                                    Drop image file here to upload or{' '}
                                                                                    <button className="text-[#2565C7] lightmint:text-black hover:text-[#2ba99e]" onClick={handleSelectFileClick}>
                                                                                        select file
                                                                                    </button>
                                                                                </p>

                                                                                <input
                                                                                    type="file"
                                                                                    ref={fileInputRef}
                                                                                    className="hidden"
                                                                                    accept="image/png,image/jpeg"
                                                                                    onChange={handleFileInputChange}
                                                                                />

                                                                                <div className=" text-gray-700 dark:text-[#fff] lightmint:text-white space-y-1">
                                                                                    <div className="flex items-center">
                                                                                        <Check className="h-4 w-4 text-green-500 dark:text-[#fff] mr-2" />
                                                                                        <span>Square image of at least 128 pixels</span>
                                                                                    </div>
                                                                                    <div className="flex items-center lightmint:text-white">
                                                                                        <Check className="h-4 w-4 text-green-500  dark:text-[#fff] mr-2" />
                                                                                        <span>File in PNG or JPEG format</span>
                                                                                    </div>
                                                                                    <div className="flex items-center">
                                                                                        <Check className="h-4 w-4 text-green-500 dark:text-[#fff] mr-2" />
                                                                                        <span>File not larger than 30 KB</span>
                                                                                    </div>
                                                                                </div>

                                                                                {error && <p className="text-red-500 mt-4 ">{error}</p>}
                                                                            </div>

                                                                            {/* Buttons */}
                                                                            <div className="flex justify-between mt-8">
                                                                                <button
                                                                                    className="px-5 py-2 border border-gray-300 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-lg text-gray-700 hover:bg-gray-50"
                                                                                    onClick={() => setUploadLogo(false)}
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    className={`px-4 py-2 rounded-lg ${file
                                                                                        ? 'bg-[#2565C7]  peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] shadow-lg transition shadow-grey-700  hover:bg-[#2ba99e] text-white'
                                                                                        : 'bg-red-800 blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]  peach:bg-[#1b2e4b] peach:text-white  classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] lightmint:text-black dark:bg-[#2F2F2F] text-gray-500 dark:text-[#fff] cursor-not-allowed'
                                                                                        }`}
                                                                                    disabled={!file}
                                                                                >
                                                                                    Save
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>

                                            <Card className="mt-12 px-5 pt-3 salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                                                <h2 className="text-xl dark:text-[#fff] text-gray-900 mb-2">Organization key</h2>
                                                <p className="text-gray-600 dark:text-[#fff] mb-1 ">
                                                    Your organization's emails are protected with end-to-end encryption using the organization key. This fingerprint can be used to verify that all
                                                    administrators in your account have the same key.
                                                </p>

                                                <div className="mt-4 mb-6">
                                                    <button
                                                        className="bg-[#1a488e] lightmint:bg-[#629e7c] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] peach:bg-[#1b2e4b] lightmint:text-white dark:bg-[#202127] hover:bg-[#1a488e] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3   text-white salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                        onClick={() => setChangeOrgKey(!changeOrgKey)}
                                                    >
                                                        Change organization key
                                                    </button>
                                                    {changeOrgKey && (
                                                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                            <div className="bg-white lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-md">
                                                                <div className="flex justify-between items-center p-6">
                                                                    <h2 className=" ">Change organization key</h2>
                                                                    <button className=" text-gray-500 hover:text-gray-700" onClick={() => setChangeOrgKey(false)}>
                                                                        <X className="h-5 w-5" />
                                                                    </button>
                                                                </div>

                                                                <div className="px-6 pb-6">
                                                                    <p className="text-gray-700  lightmint:text-white dark:text-[#fff] mb-6">
                                                                        Are you sure you want to change your organization key?
                                                                    </p>

                                                                    {/* Buttons */}
                                                                    <div className="flex justify-end space-x-3">
                                                                        <button
                                                                            className="px-5 py-2 border border-gray-300 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-lg text-gray-700 hover:bg-gray-50 salmonpink:border-[#42999b] salmonpink:hover:bg-[#297971]"
                                                                            onClick={() => setChangeOrgKey(false)}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            className="px-5 py-2 peach:bg-[#1b2e4b] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]  classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5]  bg-[#2565C7] lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] text-white rounded-lg hover:bg-[#2ba99e] focus:outline-none focus:ring-2 focus:ring-[#2ba99e] focus:ring-offset-2 salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] softazure:bg-[#363852] softazure:hover:bg-[#4a4e69] "
                                                                            onClick={() => {
                                                                                setAuthVerify(!authVerify), handleOrgnizationKey(organizationName.id);
                                                                            }}
                                                                        >
                                                                            Confirm
                                                                        </button>
                                                                        {/* {authVerify && (
                                                                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
                                                                              <div className="flex justify-between items-center p-6 border-b">
                                                                                  <h2 className=" font-bold">Enter your password</h2>
                                                                                  <button className="salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] text-gray-500 hover:text-gray-700" onClick={() => setAuthVerify(false)}>
                                                                                      <X className="h-5 w-5" />
                                                                                  </button>
                                                                              </div>

                                                                              <form onSubmit={handleAuthSubmit} className="p-6">
                                                                                  <div className="mb-6">
                                                                                      <label htmlFor="password" className="block  font-medium text-gray-700 mb-1">
                                                                                          Password
                                                                                      </label>
                                                                                      <div className="relative">
                                                                                          <input
                                                                                              type={showAuthPassword ? 'text' : 'password'}
                                                                                              id="password"
                                                                                              className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a488e]"
                                                                                              placeholder="Password"
                                                                                              value={authPassword}
                                                                                              onChange={(e) => setAuthPassword(e.target.value)}
                                                                                              autoFocus
                                                                                          />
                                                                                          <button
                                                                                              type="button"
                                                                                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                                                                              onClick={() => setShowAuthPassword(!showAuthPassword)}
                                                                                          >
                                                                                              {showAuthPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                                                          </button>
                                                                                      </div>
                                                                                  </div>

                                                                                  <div className="flex justify-between mt-8">
                                                                                      <button
                                                                                          type="button"
                                                                                          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                                                                          onClick={() => setAuthVerify(false)}
                                                                                      >
                                                                                          Cancel
                                                                                      </button>
                                                                                      <button
                                                                                          type="submit"
                                                                                          className={`px-5 py-2 bg-[#2565C7] text-white rounded-lg hover:hover:bg-[#2ba99e]focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                                                                              !authPassword ? 'opacity-70 cursor-not-allowed' : ''
                                                                                          }`}
                                                                                          disabled={!authPassword}
                                                                                      >
                                                                                          Authenticate
                                                                                      </button>
                                                                                  </div>
                                                                              </form>
                                                                          </div>
                                                                      </div>
                                                                  )} */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="border-t border-b salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500 border-gray-200">
                                                    <div className="grid grid-cols-2 py-4 border-b salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500 border-gray-200">
                                                        <div className="text-gray-700 dark:text-[#fff] ">Organization key fingerprint</div>
                                                        <div className="text-gray-700 dark:text-[#fff] ">Key type</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 py-4">
                                                        <div className="text-gray-900 dark:text-[#fff] font-mono  truncate pr-4">{organizationName.key}</div>
                                                        <div className="text-gray-900 dark:text-[#fff]">ECC (Curve25519)</div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>
                                {/* multi user support */}
                                <TabsContent value="organizationFilters" className=" m-0 border-none">
                                    <div className="w-full  ">
                                        <div className="bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  overflow-hidden cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff] py-2 sticky top-0 px-6">
                                            <h1 className="text-xl font-medium text-gray-800 lightmint:text-white dark:text-[#fff]">Organization Filter</h1>
                                        </div>
                                        <div className="p-5 h-[85vh] thin-scrollbar overflow-auto">
                                            <Card className="px-5 pt-3">
                                                <h2 className="text-xl  text-gray-900 dark:text-[#fff] mb-2">Spam, block, and allow lists</h2>
                                                <p className="text-gray-600 dark:text-[#fff] mb-4">Take control over what lands in your organization members' inboxes by creating the following lists:</p>

                                                <ul className="list-disc pl-5 mb-4 space-y-2">
                                                    <li>
                                                        <span className="font-medium">Spam:</span> <span className="text-gray-600 dark:text-[#fff]">To prevent junk mail from clogging up inboxes</span>
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">Block:</span>{' '}
                                                        <span className="text-gray-600 dark:text-[#fff]">To stop phishing or suspicious emails from entering your organization's email system</span>
                                                    </li>
                                                    <li>
                                                        <span className="font-medium">Allow:</span>{' '}
                                                        <span className="text-gray-600 dark:text-[#fff]">To ensure critical messages don't end up in spam and getting missed</span>
                                                    </li>
                                                </ul>

                                                <p className="text-gray-600 dark:text-white mb-1">
                                                    These lists apply to all accounts in your organization. Members can create their own individual filters, but won't be able to override addresses or
                                                    domains you blocked.
                                                </p>
                                                <a href="#" className="text-[#1a488e]   font-medium">
                                                    Learn more
                                                </a>

                                                {/* Controls */}

                                                <Card className="p-6  dark:border-gray-600 almonpink:border-gray-900 mt-5 softazure:border-gray-800 blue:border-gray-400">
                                                    <div className="mb-6 space-y-4">
                                                        <div className="relative inline-block text-left" ref={dropdownRef}>
                                                            <button
                                                                className="salmonpink:bg-[#42999b] classic:bg-[#a8c7fa] blue:bg-[#5cb2f8] hover:blue:bg-[#4999db] classic:text-black salmonpink:hover:bg-[#297971] flex items-center peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] bg-[#1a488e] lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] hover:bg-[#1a488e] py-2.5 rounded-lg shadow-lg transition shadow-grey-700 px-3  text-white softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                                                onClick={() => setAddAddressDomain(!AddAddressDomain)}
                                                            >
                                                                <span>Add address or domain</span>
                                                                {AddAddressDomain ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
                                                            </button>

                                                            {AddAddressDomain && (
                                                                <div
                                                                    ref={dropdownRef}
                                                                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#202127] ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                                                >
                                                                    <div className="py-1">
                                                                        <button
                                                                            className="block w-full text-left px-4 py-2  text-gray-700 dark:text-[#fff] dark:hover:bg-[#2F2F2F] hover:bg-gray-100"
                                                                            onClick={() => {
                                                                                setSpanModal(!spanModal);
                                                                            }}
                                                                        >
                                                                            Spam
                                                                        </button>

                                                                        {spanModal && (
                                                                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                                <div className="bg-white lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-md">
                                                                                    <div className="flex justify-between items-center px-6 py-4">
                                                                                        <h2 className=" font-bold">Add to spam list</h2>

                                                                                        <button
                                                                                            className="dark:text-[#fff] salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] text-gray-500 hover:text-gray-700"
                                                                                            onClick={() => setSpanModal(false)}
                                                                                        >
                                                                                            <X className="h-5 w-5" />
                                                                                        </button>
                                                                                    </div>

                                                                                    <div className="px-6 py-3">
                                                                                        {/* Address Type */}
                                                                                        <div className="mb-6">
                                                                                            <label className="block  font-semibold text-gray-700 lightmint:text-white dark:text-[#fff] mb-2">
                                                                                                Address type
                                                                                            </label>
                                                                                            <div className="flex items-center space-x-6">
                                                                                                <label className="flex items-center">
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        className="h-4 w-4 text-[#1a488e] focus:ring-[#1a488e] border-gray-300"
                                                                                                        checked={addressType === 'Email'}
                                                                                                        onChange={() => setAddressType('Email')}
                                                                                                    />
                                                                                                    <span className="ml-2 text-gray-700 lightmint:text-white dark:text-[#fff]">Email</span>
                                                                                                </label>
                                                                                                <label className="flex items-center">
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        className="h-4 w-4 text-[#1a488e] focus:ring-[#1a488e] border-gray-300"
                                                                                                        checked={addressType === 'Domain'}
                                                                                                        onChange={() => setAddressType('Domain')}
                                                                                                    />
                                                                                                    <span className="ml-2 text-gray-700 lightmint:text-white dark:text-[#fff]">Domain</span>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Address Input */}
                                                                                        <div className="mb-6">
                                                                                            <label
                                                                                                htmlFor="address"
                                                                                                className="block  font-semibold text-gray-700 lightmint:text-white dark:text-[#fff] mb-2"
                                                                                            >
                                                                                                {addressType}
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                id="address"
                                                                                                className="w-full px-4 py-3 lightmint:bg-green-50 lightmint:text-black dark:border-gray-600 dark:bg-[#2F2F2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a488e]"
                                                                                                placeholder={addressType === 'Email' ? 'example@domain.com' : 'example.com'}
                                                                                                value={address}
                                                                                                onChange={(e) => setAddress(e.target.value)}
                                                                                            />
                                                                                        </div>

                                                                                        {/* Buttons */}
                                                                                        <div className="flex justify-between mt-8">
                                                                                            <button
                                                                                                className="px-5 py-2 border border-gray-300 peach:bg-[#1b2e4b] peach:text-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-lg text-gray-700 hover:bg-gray-50"
                                                                                                onClick={() => setSpanModal(false)}
                                                                                            >
                                                                                                Cancel
                                                                                            </button>
                                                                                            <button
                                                                                                className={`px-5 py-2 rounded-lg ${isValidAddress()
                                                                                                    ? 'bg-[#2565C7] peach:bg-[#1b2e4b] peach:text-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] text-white hover:bg-[#2ba99e]'
                                                                                                    : 'bg-gray-200 peach:bg-[#1b2e4b] lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] text-gray-500 cursor-not-allowed'
                                                                                                    }`}
                                                                                                disabled={!isValidAddress()}
                                                                                            >
                                                                                                Add address
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <button
                                                                            className="block w-full text-left px-4  py-2  text-gray-700 dark:text-[#fff] dark:hover:bg-[#2F2F2F] hover:bg-gray-100"
                                                                            onClick={() => {
                                                                                setBlockModal(!blockModal);
                                                                            }}
                                                                        >
                                                                            Block
                                                                        </button>

                                                                        {blockModal && (
                                                                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                                <div className="bg-white lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-md">
                                                                                    <div className="flex justify-between items-center px-6 py-4">
                                                                                        <h2 className=" lightmint:text-white font-bold">Add to block list</h2>
                                                                                        <button
                                                                                            className="text-gray-500 lightmint:text-white dark:text-[#fff] hover:text-gray-700 salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]"
                                                                                            onClick={() => setBlockModal(false)}
                                                                                        >
                                                                                            <X className="h-5 w-5" />
                                                                                        </button>
                                                                                    </div>

                                                                                    <div className="px-6 py-3">
                                                                                        {/* Address Type */}
                                                                                        <div className="mb-6">
                                                                                            <label className="block  font-semibold text-gray-700 lightmint:text-white dark:text-[#fff] mb-2">
                                                                                                Address type
                                                                                            </label>
                                                                                            <div className="flex items-center space-x-6">
                                                                                                <label className="flex items-center">
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        className="h-4 w-4 text-[#1a488e] focus:ring-[#1a488e] border-gray-300"
                                                                                                        checked={addressType === 'Email'}
                                                                                                        onChange={() => setAddressType('Email')}
                                                                                                    />
                                                                                                    <span className="ml-2 text-gray-700 lightmint:text-white dark:text-[#fff]">Email</span>
                                                                                                </label>
                                                                                                <label className="flex items-center">
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        className="h-4 w-4 text-[#1a488e] focus:ring-[#1a488e] border-gray-300"
                                                                                                        checked={addressType === 'Domain'}
                                                                                                        onChange={() => setAddressType('Domain')}
                                                                                                    />
                                                                                                    <span className="ml-2 text-gray-700 lightmint:text-white dark:text-[#fff]">Domain</span>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Address Input */}
                                                                                        <div className="mb-6">
                                                                                            <label
                                                                                                htmlFor="address"
                                                                                                className="block   font-semibold text-gray-700 lightmint:text-white dark:text-[#fff] mb-2"
                                                                                            >
                                                                                                {addressType}
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                id="address"
                                                                                                className="w-full px-4 py-3 border border-purple-300 lightmint:bg-green-50 lightmint:text-black dark:border-gray-600 dark:bg-[#2F2F2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a488e]"
                                                                                                placeholder={addressType === 'Email' ? 'example@domain.com' : 'example.com'}
                                                                                                value={address}
                                                                                                onChange={(e) => setAddress(e.target.value)}
                                                                                            />
                                                                                        </div>

                                                                                        {/* Buttons */}
                                                                                        <div className="flex justify-between mt-8">
                                                                                            <button
                                                                                                className="px-5 py-2 border border-gray-300  lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-lg text-gray-700 hover:bg-gray-50"
                                                                                                onClick={() => setBlockModal(false)}
                                                                                            >
                                                                                                Cancel
                                                                                            </button>
                                                                                            <button
                                                                                                className={`px-5 py-2 rounded-lg ${isValidAddress()
                                                                                                    ? 'bg-[#2565C7]   lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] text-white hover:bg-[#2ba99e]'
                                                                                                    : 'bg-gray-200 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] peach:text-white peach:bg-[#1b2e4b] text-gray-500 cursor-not-allowed'
                                                                                                    }`}
                                                                                                disabled={!isValidAddress()}
                                                                                            >
                                                                                                Add address
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <button
                                                                            className="block w-full text-left px-4 py-2  text-gray-700 dark:text-[#fff] dark:hover:bg-[#2F2F2F] hover:bg-gray-100"
                                                                            onClick={() => {
                                                                                setAllowMail(!allowMail);
                                                                            }}
                                                                        >
                                                                            Allow
                                                                        </button>
                                                                        {allowMail && (
                                                                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                                                                <div className="bg-white lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg shadow-lg w-full max-w-md">
                                                                                    <div className="flex justify-between items-center px-6 py-4">
                                                                                        <h2 className=" lightmint:text-white    font-bold">Add to allow list</h2>
                                                                                        <button
                                                                                            className="text-gray-500 dark:text-[#fff] hover:text-gray-700 salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971]"
                                                                                            onClick={() => setAllowMail(false)}
                                                                                        >
                                                                                            <X className="h-5 w-5" />
                                                                                        </button>
                                                                                    </div>

                                                                                    <div className="px-6 py-3">
                                                                                        {/* Address Type */}
                                                                                        <div className="mb-6">
                                                                                            <label className="block  font-semibold text-gray-700 lightmint:text-white dark:text-[#fff] mb-2">
                                                                                                Address type
                                                                                            </label>
                                                                                            <div className="flex items-center space-x-6">
                                                                                                <label className="flex items-center">
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        className="h-4 w-4 text-[#1a488e] focus:ring-[#1a488e] border-gray-300"
                                                                                                        checked={addressType === 'Email'}
                                                                                                        onChange={() => setAddressType('Email')}
                                                                                                    />
                                                                                                    <span className="ml-2 text-gray-700 lightmint:text-white dark:text-[#fff]">Email</span>
                                                                                                </label>
                                                                                                <label className="flex items-center">
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        className="h-4 w-4 text-[#1a488e] focus:ring-[#1a488e] border-gray-300"
                                                                                                        checked={addressType === 'Domain'}
                                                                                                        onChange={() => setAddressType('Domain')}
                                                                                                    />
                                                                                                    <span className="ml-2 text-gray-700 lightmint:text-white dark:text-[#fff]">Domain</span>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Address Input */}
                                                                                        <div className="mb-6">
                                                                                            <label
                                                                                                htmlFor="address"
                                                                                                className="block  font-semibold text-gray-700 lightmint:text-white dark:text-[#fff] mb-2"
                                                                                            >
                                                                                                {addressType}
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                id="address"
                                                                                                className="w-full px-4 py-3 border border-purple-300 lightmint:bg-green-50 lightmint:text-black dark:border-gray-600 dark:bg-[#2F2F2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a488e]"
                                                                                                placeholder={addressType === 'Email' ? 'example@domain.com' : 'example.com'}
                                                                                                value={address}
                                                                                                onChange={(e) => setAddress(e.target.value)}
                                                                                            />
                                                                                        </div>

                                                                                        {/* Buttons */}
                                                                                        <div className="flex justify-between mt-8">
                                                                                            <button
                                                                                                className="px-5 py-2 border border-gray-300 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:border-[#202127] dark:text-[#fff] rounded-lg text-gray-700 hover:bg-gray-50"
                                                                                                onClick={() => setAllowMail(false)}
                                                                                            >
                                                                                                Cancel
                                                                                            </button>
                                                                                            <button
                                                                                                className={`px-5 py-2 rounded-lg ${isValidAddress()
                                                                                                    ? 'bg-[#2565C7] lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] text-white hover:bg-[#2ba99e]'
                                                                                                    : 'bg-gray-200 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] peach:text-white peach:bg-[#1b2e4b] text-gray-500 cursor-not-allowed'
                                                                                                    }`}
                                                                                                disabled={!isValidAddress()}
                                                                                            >
                                                                                                Add address
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="relative ">
                                                            <Search className="absolute left-3  top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                            <Input
                                                                className="pl-10 border-gray-200 lightmint:bg-green-50 lightmint:text-black dark:border-gray-600 dark:bg-[#2F2F2F]  dark:text-[#fff]"
                                                                placeholder="Search list"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Filter tabs */}

                                                    <div className="border-b dark:border-gray-600 border-gray-200 mb-4 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                        <div className="flex">
                                                            <button
                                                                className={`px-6 py-3 font-medium relative ${FilterActiveTab === 'All' ? 'text-[#1a488e]' : 'text-gray-600 dark:text-[#fff] hover:text-gray-900'
                                                                    }`}
                                                                onClick={() => setFilterActiveTab('All')}
                                                            >
                                                                All
                                                            </button>
                                                            <button
                                                                className={`px-6 py-3 font-medium relative ${FilterActiveTab === 'Spam' ? 'text-[#1a488e]' : 'text-gray-600 dark:text-[#fff] hover:text-gray-900'
                                                                    }`}
                                                                onClick={() => setFilterActiveTab('Spam')}
                                                            >
                                                                Spam
                                                            </button>
                                                            <button
                                                                className={`px-6 py-3 font-medium ${FilterActiveTab === 'Block' ? 'text-[#1a488e]' : 'text-gray-600 dark:text-[#fff] hover:text-gray-900'}`}
                                                                onClick={() => setFilterActiveTab('Block')}
                                                            >
                                                                Block
                                                            </button>
                                                            <button
                                                                className={`px-6 py-3 font-medium ${FilterActiveTab === 'Allow' ? 'text-[#1a488e]' : 'text-gray-600 dark:text-[#fff] hover:text-gray-900'}`}
                                                                onClick={() => setFilterActiveTab('Allow')}
                                                            >
                                                                Allow
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Table */}
                                                    <div className=" ">
                                                        <table className="w-full">
                                                            <thead >
                                                                <tr className="border-b font-medium !bg-[#1a488e] border-gray-200 softazure:!bg-[#9a8c98] classic:!bg-[#a8c7fa] classic:!text-black cornflower:!bg-[#6BB8C5] peach:!bg-[#1b2e4b] dark:border-gray-600  lightmint:!bg-[#629e7c] lightmint:text-white dark:!bg-[#202127] text-gray-50">
                                                                    <th className="text-left py-3 px-6 softazure:text-white font-medium blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]">Email address or domain</th>
                                                                    <th className="text-left py-3 px-6 softazure:text-white font-medium blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]">List</th>
                                                                    <th className="text-right py-3 px-6 softazure:text-white font-medium blue:bg-[#5cb2f8] hover:blue:bg-[#4999db]">Edit</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(FilterActiveTab === 'All' || FilterActiveTab === 'All') && (
                                                                    <>
                                                                        {/* First row - abc.com */}

                                                                        <tr className="border-b  dark:border-gray-600 salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                            <td className="py-3">abc.com</td>
                                                                            <td className="py-3">
                                                                                <span className="bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">
                                                                                    Allow
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-3 relative flex justify-end">
                                                                                <button
                                                                                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md border bg-gray-100 dark:bg-[#202127] dark:border-[#202127] dark:text-[#fff]"
                                                                                    onClick={() => toggleDropdownFilter('abc.com')}
                                                                                >
                                                                                    <span className="text-gray-500">...</span>
                                                                                </button>
                                                                                {activeFilterDropdown === 'abc.com' && (
                                                                                    <div
                                                                                        ref={dropdownRef}
                                                                                        className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#202127] border dark:border-[#202127] rounded-md shadow-lg z-10"
                                                                                    >
                                                                                        <div className="py-1">
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                                                                                                onClick={() => handleFilterAction('spam', 'abc.com')}
                                                                                            >
                                                                                                Spam
                                                                                            </button>
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                                                                                                onClick={() => handleFilterAction('block', 'abc.com')}
                                                                                            >
                                                                                                Block
                                                                                            </button>
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                                                                                                onClick={() => handleFilterAction('delete', 'abc.com')}
                                                                                            >
                                                                                                Delete
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                        </tr>

                                                                        {/* Second row - xyz.com */}

                                                                        <tr className="border-b salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                                            <td className="py-3">xyz.com</td>
                                                                            <td className="py-3">
                                                                                <span className="bg-yellow-100 text-yellow-800 text-xs  me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300 font-semibold">
                                                                                    Spam
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-3 flex justify-end relative">
                                                                                <button
                                                                                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md border bg-gray-100 dark:bg-[#202127] dark:border-[#202127] dark:text-[#fff]"
                                                                                    onClick={() => toggleDropdownFilter('xyz.com')}
                                                                                >
                                                                                    <span className="text-gray-500">...</span>
                                                                                </button>
                                                                                {activeFilterDropdown === 'xyz.com' && (
                                                                                    <div
                                                                                        ref={dropdownRef}
                                                                                        className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#202127] border dark:border-[#202127] rounded-md shadow-lg z-10"
                                                                                    >
                                                                                        <div className="py-1">
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                                                                                                onClick={() => handleFilterAction('spam', 'xyz.com')}
                                                                                            >
                                                                                                Spam
                                                                                            </button>
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                                                                                                onClick={() => handleFilterAction('block', 'xyz.com')}
                                                                                            >
                                                                                                Block
                                                                                            </button>
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                                                                                                onClick={() => handleFilterAction('delete', 'xyz.com')}
                                                                                            >
                                                                                                Delete
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                        </tr>

                                                                        <tr className="border-b dark:border-gray-600">
                                                                            <td className="py-3">pink.com</td>
                                                                            <td className="py-3">
                                                                                <span className="bg-red-100 text-red-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">
                                                                                    Block
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-3 flex justify-end relative">
                                                                                <button
                                                                                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md border bg-gray-100 dark:bg-[#202127] dark:border-[#202127] dark:text-[#fff]"
                                                                                    onClick={() => toggleDropdownFilter('xyz.com')}
                                                                                >
                                                                                    <span className="text-gray-500">...</span>
                                                                                </button>
                                                                                {activeFilterDropdown === 'pink.com' && (
                                                                                    <div
                                                                                        ref={dropdownRef}
                                                                                        className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#202127] border dark:border-[#202127] rounded-md shadow-lg z-10"
                                                                                    >
                                                                                        <div className="py-1">
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                                                                                                onClick={() => handleFilterAction('spam', 'xyz.com')}
                                                                                            >
                                                                                                Spam
                                                                                            </button>
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                                                                                                onClick={() => handleFilterAction('block', 'xyz.com')}
                                                                                            >
                                                                                                Block
                                                                                            </button>
                                                                                            <button
                                                                                                className="w-full text-left px-4 py-2  hover:bg-gray-100"
                                                                                                onClick={() => handleFilterAction('delete', 'xyz.com')}
                                                                                            >
                                                                                                Delete
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )}
                                                                {(FilterActiveTab === 'Allow' || FilterActiveTab === 'Allow') && (
                                                                    <tr className="border-b border-gray-100">
                                                                        <td className="py-4 px-6 text-gray-800">no-reply@namecheap.com</td>
                                                                        <td className="py-4 px-6">
                                                                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Allow</span>
                                                                        </td>
                                                                        <td className="py-4 px-6 text-right">
                                                                            <button className="salmonpink:bg-[#42999b] salmonpink:hover:bg-[#297971] text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                                                                                <MoreHorizontal className="h-5 w-5" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Card>

                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Access control */}
                                <TabsContent value="accessControl" className=" m-0 border-none">
                                    <div className=" w-full ">
                                        <div className='w-full  bg-[#E9EEF6]  lightmint:bg-[#8abd9f]  text-black classic:bg-[#F8FAFD]  blue:bg-[#bbdefb]  cornflower:bg-[#8ed7e4]  peach:bg-gray-200   dark:bg-[#2F2F2F]  dark:border-[#202127] classic:bg-[#e7e8e95e]    salmonpink:bg-[#42999b] salmonpink:text-white    dark:text-[#fff]'>
                                            <h1 className="text-xl font-medium text-gray-800 py-2 px-6 lightmint:text-white dark:text-[#fff] mb-6">Access Control</h1>
                                        </div>
                                        <div className="w-full px-6" >
                                            <p className="text-gray-600 mb-1  font-medium dark:text-[#fff]">
                                                Manage which UB applications the members of your organization can access. If disabled, only administrators will have access.
                                            </p>
                                            <Card className="p-6 mt-8  salmonpink:border-gray-900 softazure:border-gray-800 blue:border-gray-400">
                                                <div className="">
                                                    <div className="space-y-0 divide-y divide-gray-200">
                                                        {/* UBS Mail and Calendar */}
                                                        <div className="py-4 flex justify-between items-center  salmonpink:border-gray-500 blue:border-gray-500 softazure:border-gray-500">
                                                            <div className="flex ">
                                                                <div className="mr-4 flex-shrink-0">
                                                                    <div className="w-10 h-10 peach:bg-[#1b2e4b] peach:text-white cornflower:bg-[#6BB8C5] cornflower:text-white bg-purple-100 lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg flex items-center justify-center">
                                                                        <p>logo</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className=" font-medium text-gray-900 dark:text-[#fff]">UB Mail and UB Calendar</h3>
                                                                    <p className="mt-1 text-gray-600  dark:text-[#fff]">Email and calendar, integrated with UB Contacts</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>

                                                        {/* UBS Drive */}
                                                        <div className="py-4 flex justify-between items-center">
                                                            <div className="flex">
                                                                <div className="mr-4 flex-shrink-0">
                                                                    <div className="w-10 h-10 peach:bg-[#1b2e4b] peach:text-white cornflower:bg-[#6BB8C5] cornflower:text-white bg-purple-100 lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg flex items-center justify-center">
                                                                        <p>logo</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className=" font-font-medium   text-gray-900 dark:text-[#fff]">UB Drive</h3>
                                                                    <p className="mt-1 text-gray-600  dark:text-[#fff]">Cloud storage, integrated with UB Docs</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>

                                                        {/* UBS VPN */}
                                                        <div className="py-4 flex justify-between items-center">
                                                            <div className="flex">
                                                                <div className="mr-4 flex-shrink-0">
                                                                    <div className="w-10 h-10  peach:bg-[#1b2e4b] peach:text-white cornflower:bg-[#6BB8C5] cornflower:text-white bg-blue-100 lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg flex items-center justify-center">
                                                                        <p>logo</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className=" font-medium   text-gray-900 dark:text-[#fff]">UB VPN</h3>
                                                                    <p className="mt-1 text-gray-600  dark:text-[#fff]">VPN with dedicated servers and IP addresses</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>

                                                        {/* UBS Pass */}
                                                        <div className="py-4 flex justify-between items-center">
                                                            <div className="flex">
                                                                <div className="mr-4 flex-shrink-0">
                                                                    <div
                                                                        className="w-10 h-10  peach:bg-[#1b2e4b] peach:text-white  cornflower:bg-[#6BB8C5] cornflower:text-white bg-purple-100 lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg  flex items-center justify-center"
                                                                        style={{ background: 'linear-gradient(135deg, #9f7aea 0%, #6366f1 100%)' }}
                                                                    >
                                                                        <p>logo</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className=" font-medium  text-gray-900 dark:text-[#fff]">UB Pass</h3>
                                                                    <p className="mt-1 text-gray-600  dark:text-[#fff]">Password manager with extra account security</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>

                                                        {/* UBS Wallet */}
                                                        <div className="py-4 flex justify-between items-center">
                                                            <div className="flex">
                                                                <div className="mr-4 flex-shrink-0">
                                                                    <div className="w-10 h-10  peach:bg-[#1b2e4b] peach:text-white cornflower:bg-[#6BB8C5] cornflower:text-white bg-purple-100 lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] rounded-lg flex items-center justify-center">
                                                                        <p>logo</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className=" font-medium  text-gray-900 dark:text-[#fff]">UB Wallet</h3>
                                                                    <p className="mt-1 text-gray-600  dark:text-[#fff]">Self-custodial crypto wallet</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                            <div className="flex flex-col justify-between h-full">
                                <div className="w-full h-full bg-gray-300">
                                    {rightSidePanel && (
                                        <div
                                            className={` bg-white salmonpink:bg-[#006d77] cornflower:border-[#6BB8C5] classic:bg-[#F8FAFD] blue:bg-[#64b5f6]  cornflower:bg-[#6BB8C5] lightmint:border-[#629e7c] lightmint:bg-[#629e7c] px-1 peach:bg-[#1b2e4b] py-5 dark:bg-[#202127] dark:border-[#202127] h-[100vh]  flex flex-col justify-between border-l-[2px]  border-gray-300 softazure:bg-[#9a8c98] softazure:border-none blue:border-none salmonpink:border-none`}
                                        >
                                            <div className="   text-primary ">
                                                <div className="mb-2">
                                                    <Tippy content="ubCalendar">
                                                        <button
                                                            className="hover:bg-[#DCDCDC]  p-2 flex items-center justify-center rounded-full transition"
                                                            onClick={() => {
                                                                handleSectionChange('calendar');
                                                                setShowArrowButton(false);
                                                            }}
                                                        >
                                                            <img src={calendar} alt="" className="w-6 rounded-md" />
                                                            {/* <IconMenuCalendar className="w-5 h-5" /> */}
                                                        </button>
                                                    </Tippy>
                                                </div>
                                                <div className="mb-2">
                                                    <Tippy content="ubPad">
                                                        <button
                                                            className="hover:bg-[#DCDCDC] p-2 rounded-full transition"
                                                            onClick={() => {
                                                                setShowArrowButton(false);
                                                                handleSectionChange('todo');
                                                            }}
                                                        >
                                                            {/* <IconMenuNotes className='w-5 h-5' /> */}
                                                            <img src={pad} alt="" className="w-6  rounded-md" />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                                <div className="mb-2">
                                                    <Tippy content="ubSheet">
                                                        <button
                                                            className="hover:bg-[#DCDCDC] p-2 rounded-full transition"
                                                            onClick={() => {
                                                                setShowArrowButton(false);
                                                                handleSectionChange('task');
                                                            }}
                                                        >
                                                            {/* <IconMenuTodo className='w-5 h-5' /> */}
                                                            <img src={sheet} alt="" className="w-6 rounded-md" />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                                <div className="mb-2">
                                                    <Tippy content="ubContact">
                                                        <button
                                                            className="hover:bg-[#DCDCDC] p-2 rounded-full transition"
                                                            onClick={() => {
                                                                setShowArrowButton(false);
                                                                handleSectionChange('contact');
                                                            }}
                                                        >
                                                            {/* <IconMenuContacts className='w-5 h-5' /> */}
                                                            <img src={contact} alt="" className="w-6 rounded-md" />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                                <div className="mb-2">
                                                    <Tippy content="ubMeeting">
                                                        <button className="hover:bg-[#DCDCDC] p-2 rounded-full transition">
                                                            {/* <IoVideocam  className='w-5 h-5' /> */}
                                                            <img src={meeting} alt="" className="w-6 rounded-md" />
                                                        </button>
                                                    </Tippy>
                                                </div>

                                                <div className="mb-2">
                                                    <Tippy content="Get Add-ons">
                                                        <button
                                                            onClick={() => setPlusOpensidebar(!plusOpensidebar)}
                                                            className="hover:bg-[#DCDCDC] w-full flex justify-center items-center p-2 rounded-full transition  iconColor blue:text-black"
                                                        >
                                                            {/* <IoMdAdd className="w-6 h-6 " /> */}
                                                            <img src={plus} alt="" width={20} />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </div>

                                            {plusOpensidebar && (
                                                <div className="fixed px-56 py-32  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div className="w-full h-full bg-white rounded-xl shadow-lg p-4 relative">
                                                        <span onClick={() => setPlusOpensidebar(!plusOpensidebar)} className=" cursor-pointer flex w-full justify-end text-2xl">
                                                            <RxCross2 />
                                                        </span>
                                                        <p className="text-center text-gray-800">Hello</p>
                                                    </div>
                                                </div>
                                            )}

                                            {!showArrowButton && (
                                                <div className="flex  justify-center">
                                                    <Tippy content="About ">
                                                        <span onClick={() => setAboutOpen(!aboutOpen)} className="w-10 text-black   flex items-center  pb-20  justify-center">
                                                            {/* <IoIosInformationCircleOutline /> */}
                                                        </span>
                                                    </Tippy>
                                                </div>
                                            )}

                                            {aboutOpen && (
                                                <div className="absolute bottom-10 right-48 w-48  rounded-xl py-5 shadow-xl  bg-white border border-gray-200">
                                                    <h2 className=" font-semibold text-gray-800 px-5 mb-4">UNS KEEP</h2>
                                                    <div className="flex flex-col gap-2">
                                                        <button className="flex px-5 items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100  py-2  transition">
                                                            {/* <IoIosInformationCircleOutline className="" /> */}
                                                            About
                                                        </button>
                                                        <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-5 py-2  transition">
                                                            <MdHelpOutline className="" />
                                                            Help
                                                        </button>
                                                        <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-5 py-2  transition">
                                                            <MdFeedback className="" />
                                                            Feedback
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {showArrowButton && (
                                        <div className={`${rightSidePanel ? 'right-0' : 'right-0'} fixed bottom-2 right-1 `}>
                                            <button
                                                className={`${rightSidePanel ? 'rounded-full w-[40px] h-[40px] flex items-center justify-center  ' : 'hover:w-[50px] rounded-l-full'
                                                    } w-[30px]   transition-all duration-300 bg-[#DCDCDC] shadow-md text-[#000]  py-2`}
                                                onClick={() => setRightSidePanel(!rightSidePanel)}
                                            >
                                                <RiArrowLeftSLine size={23} className={`${rightSidePanel ? '-rotate-180 transition-all duration-100 ' : 'transition-all ml-2'} `} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                {' '}
                                {openCalendar && (
                                    <div className="bg-white">
                                        <SideCalendar
                                            onclick={() => {
                                                setShowArrowButton(true);
                                                setOpenCalendar(!openCalendar);
                                            }}
                                        />
                                    </div>
                                )}
                                {taskOpen && (
                                    <div>
                                        <MyTask
                                            onclick={() => {
                                                setShowArrowButton(true);
                                                setTaskOpen(false);
                                            }}
                                        />
                                    </div>
                                )}
                                {contactOpen && (
                                    <div className="">
                                        <MyContact
                                            onclick={() => {
                                                setShowArrowButton(true);
                                                setContactOpen(false);
                                            }}
                                        />
                                    </div>
                                )}
                                {todoOpen && (
                                    <div className=" ">
                                        <Todo
                                            onclick={() => {
                                                setShowArrowButton(true);
                                                setTodoOpen(false);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Tabs>
            </div>

            {/* ///-----------------create folder-------------------//
            //  */}
            {plusOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font_lato_light">
                    <div className="w-1/3 bg-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-2xl shadow-lg p-6 relative">
                        <form onSubmit={creatNewFolder}>
                            <h1 className="text-2xl dark:text-[#fff] lightmint:text-white">{editFolderId ? 'Edit Folder' : 'New Folder'}</h1>
                            <div className="py-3 w-full dark:text-[#fff] lightmint:text-white">
                                <p>Please enter a new folder name:</p>
                                <input
                                    type="text"
                                    value={labelData.name}
                                    onChange={(e) => setLabelData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter something"
                                    className="border dark:border-gray-600 dark:text-[#fff] lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] px-3 py-4 mt-3 rounded w-full"
                                />
                            </div>
                            <div className="flex justify-end pt-3">
                                <button
                                    onClick={() => setPlusOpen(!plusOpen)}
                                    className="mr-3 peach:bg-[#1b2e4b] border classic:hover:bg-[#a8c7fa] classic:hover:text-black teansition hover:text-white  cornflower:hover:bg-[#6BB8C5] cornflower:hover:text-white text-black peach:text-white hover:bg-[#1a488e] lightmint:bg-green-50 lightmint:hover:text-black dark:bg-[#2F2F2F] dark:text-[#fff]  px-7 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#1a488e] peach:bg-[#1b2e4b] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-[#6BB8C5] cornflower:text-white text-white peach:text-white lightmint:bg-green-50 dark:bg-[#2F2F2F] lightmint:text-black dark:text-[#fff]   px-7 py-2 rounded-md softazure:bg-[#363852] softazure:hover:bg-[#4a4e69]"
                                >
                                    {editFolderId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ////---------------delete folder -----------------------// */}

            {deleteConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white lightmint:text-white lightmint:bg-[#629e7c] dark:bg-[#202127] rounded-xl p-6 w-[90%] max-w-md shadow-lg">
                        <h2 className=" font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this folder? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setDeleteConfirmOpen(false);
                                    setFolderToDelete(null);
                                }}
                                className="px-4 py-2 rounded-md border peach:bg-[#1b2e4b] peach:text-white lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:text-[#fff] border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (folderToDelete) {
                                        await deleteFolder(folderToDelete);
                                        setDeleteConfirmOpen(false);
                                        setFolderToDelete(null);
                                    }
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-[#1e1e2f] rounded-xl p-6 max-w-lg w-full shadow-lg">
                        <h3 className=" font-semibold text-gray-800 dark:text-white mb-2">
                            Confirm Deletion
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300  mb-2">
                            Are you sure you want to delete your account? <br />
                            <strong>This action cannot be undone.</strong>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300  mb-4">
                            All your data will be permanently deleted. <br />
                            If you'd like to keep a copy, you can{' '}
                            <a
                                href="/download-my-data" // ✅ Update this with the actual route or file
                                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
                            >
                                download it here
                            </a>.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setShowModal(false)}
                                className="text-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAccDelete}
                                className="bg-red-600 hover:bg-red-800 text-white"
                            >
                                Confirm Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default SettingsPage;

const users = [
    {
        id: 1,
        name: 'Eric Norbert',
        initials: 'EN',
        role: 'Primary admin',
        email: 'eric.norbert@privacybydefault.com',
        storage: '3.51 GB / 7 GB',
        vpn: '10 VPN connections',
        tags: [
            { text: "It's you", type: 'primary' },
            { text: 'Private', type: 'secondary' },
            { text: '2FA', type: 'secondary' },
        ],
    },
    {
        id: 2,
        name: 'Bernd Siegmart',
        initials: 'BS',
        role: 'Member',
        email: 'bernd.siegmart@privacybydefault.com',
        storage: '3.51 GB / 7 GB',
        vpn: '10 VPN connections',
        tags: [{ text: 'Invite sent', type: 'default' }],
    },
    {
        id: 3,
        name: 'Esme Gonzalez',
        initials: 'EG',
        role: 'Member',
        email: 'esme.gonzalez@privacybydefault.com',
        storage: '3.51 GB / 7 GB',
        vpn: '10 VPN connections',
        tags: [{ text: 'Invite sent', type: 'default' }],
    },
    {
        id: 4,
        name: 'Esme Gonzalez',
        initials: 'EG',
        role: 'Member',
        email: 'esme.gonzalez@privacybydefault.com',
        storage: '3.51 GB / 7 GB',
        vpn: '10 VPN connections',
        tags: [{ text: 'Invite sent', type: 'default' }],
    },
    {
        id: 5,
        name: 'Esme Gonzalez',
        initials: 'EG',
        role: 'Member',
        email: 'esme.gonzalez@privacybydefault.com',
        storage: '3.51 GB / 7 GB',
        vpn: '10 VPN connections',
        tags: [{ text: 'Invite sent', type: 'default' }],
    },
];

const identities = ['himansingh9@UB.me', 'admin@himansingh.com', 'contact@himansingh.com', 'support@himansingh.com'];