import React, { useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import { MdMoveToInbox, MdOutlineCircle } from 'react-icons/md';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import logo from '../../assets/images/ubs icons/2-removebg-preview.png';
import { useAuth } from '../../useContext/AppState';
import { RiDeleteBinLine, RiDraftLine, RiSpam2Line } from 'react-icons/ri';
import { FiCreditCard, FiKey, FiPlus, FiUser, FiX } from 'react-icons/fi';
import { FaRegStar, FaRegTrashAlt } from 'react-icons/fa';
import { RxUpdate } from 'react-icons/rx';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { AiOutlineTeam } from 'react-icons/ai';
import { getCombinedItemCountsByTab } from '@/store/selectors/taskSelectors';
import { useDispatch, useSelector } from 'react-redux';
import { openAddModal } from '@/store/Slices/taskSlice';
import { CircleUserRound, FolderIcon, Pin, PlusIcon, Tag } from 'lucide-react';
import { BsGear } from 'react-icons/bs';
import CreateVaultDrawer from './CreateVaultDrawer';
import { Box } from '@mui/material';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { HiDotsVertical } from 'react-icons/hi';
import { GoPencil } from 'react-icons/go';
import ShareModal from '@/components/FormType/ShareModal';
import { FiUserPlus, FiLogIn } from 'react-icons/fi';
import { openAddModal as openCardAddModal } from '@/store/Slices/cardSlice';
import {
    Home,
    Briefcase,
    Gift,
    Store,
    Heart,
    AlarmClock,
    AppWindow,
    Settings,
    Users,
    Ghost,
    ShoppingCart,
    Leaf,
    Shield,
    Circle,
    CreditCard,
    Fish,
    Smile,
    Lock,
    UserCheck,
    Star,
    Flame,
    Wallet,
    Bookmark,
    IceCream,
    Laptop,
    BookOpen,
    Infinity,
    FileText,
} from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { openAddModal as openIdentityAddModal } from '@/store/Slices/identitySlice';
import { openPasswordGenerator } from '@/store/Slices/passwordSlice';
import PasswordGenerator from '@/components/FormType/passwordgenerator';
import { useVaults } from '@/useContext/VaultContext';
// import { getCount } from '@/service/TableDataService';
import type { RootState } from "@/store"
import { fetchItemCount } from '@/store/Slices/countSlice';
import type { AppDispatch } from '@/store';


interface CountState {
    count: {
        all_items_count: number;
        personal_count: number;
        pin_count: number;
        trash_count: number;
    } | null;
    loading: boolean;
    error: string | null;
}



interface Vault {
    id: string;
    name: string;
    path: string;
    key: string;
    icon: string;
    color: string;
}
const VAULTS_STORAGE_KEY = 'userVaults';

interface ModalItem {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
}

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: ModalItem[];
}

// Create Modal Component
const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, items }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#2a2f3b] rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create New Item</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="grid grid-cols-1 gap-3">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    item.action();
                                    onClose();
                                }}
                                className="flex items-center w-full p-4 rounded-lg text-left transition-all duration-200
                               bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20
                                  border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700
                                       hover:shadow-md group"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 mr-4">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">{item.label}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description || `Create a new ${item.label.toLowerCase()}`}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">Select an item type to create</p>
                </div>
            </div>
        </div>
    );
};

const SidePanel = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>()
    const { menuBarOpen, setMenuBarOpen } = useAuth();
    const [isEdit, setIsEdit] = useState(false);

    const { count, loading, error } = useSelector((state: RootState) => state.count);
    console.log("check ount", count)
    const [selectedTab, setSelectedTab] = useState(() => {
        return localStorage.getItem('selectedTab') || 'inbox';
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { vaults, setVaults } = useVaults();
    const [editingVault, setEditingVault] = useState<Vault | null>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [vaultToDelete, setVaultToDelete] = useState<Vault | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Changed from isDropdownOpen   
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const iconComponents: Record<string, JSX.Element> = {
        Home: <Home size={16} />,
        Briefcase: <Briefcase size={16} />,
        Gift: <Gift size={16} />,
        Store: <Store size={16} />,
        Heart: <Heart size={16} />,
        AlarmClock: <AlarmClock size={16} />,
        AppWindow: <AppWindow size={16} />,
        Settings: <Settings size={16} />,
        Users: <Users size={16} />,
        Ghost: <Ghost size={16} />,
        ShoppingCart: <ShoppingCart size={16} />,
        Leaf: <Leaf size={16} />,
        Shield: <Shield size={16} />,
        Circle: <Circle size={16} />,
        CreditCard: <CreditCard size={16} />,
        Fish: <Fish size={16} />,
        Smile: <Smile size={16} />,
        Lock: <Lock size={16} />,
        UserCheck: <UserCheck size={16} />,
        Star: <Star size={16} />,
        Flame: <Flame size={16} />,
        Wallet: <Wallet size={16} />,
        Bookmark: <Bookmark size={16} />,
        IceCream: <IceCream size={16} />,
        Laptop: <Laptop size={16} />,
        BookOpen: <BookOpen size={16} />,
        Infinity: <Infinity size={16} />,
        FileText: <FileText size={16} />,
    };

    // Update selectedTab based on current path
    useEffect(() => {
        const currentPath = location.pathname;

        // Check if current path matches any tab
        const matchedTab = tabs.find((tab) => tab.path === currentPath);
        if (matchedTab) {
            setSelectedTab(matchedTab.key);
            localStorage.setItem('selectedTab', matchedTab.key);
            return;
        }

        // Check if current path matches any vault
        const matchedVault = vaults.find((vault) => vault.path === currentPath);
        if (matchedVault) {
            setSelectedTab(matchedVault.key);
            localStorage.setItem('selectedTab', matchedVault.key);
            return;
        }

        // Default to 'inbox' if no match found
        setSelectedTab('inbox');
        localStorage.setItem('selectedTab', 'inbox');
    }, [location.pathname, vaults]);

    const handleCreateVault = (vaultName: string, iconName: string, color: string) => {
        const path = `/vault/${vaultName.toLowerCase().replace(/\s+/g, '-')}`;
        const newVault: Vault = {
            id: Date.now().toString(),
            name: vaultName,
            path,
            key: `vault-${Date.now()}`,
            icon: iconName,
            color: color,
        };

        // Completely safe update with multiple fallbacks
        setVaults((prevVaults) => {
            const currentVaults = Array.isArray(prevVaults) ? prevVaults : [];
            const updatedVaults = [...currentVaults, newVault];

            try {
                localStorage.setItem('VAULTS_STORAGE_KEY', JSON.stringify(updatedVaults));
            } catch (error) {
                console.error('Failed to save vaults to localStorage', error);
            }

            return updatedVaults;
        });

        // Set the new vault as selected
        setSelectedTab(newVault.key);
        localStorage.setItem('selectedTab', newVault.key);
        navigate(path);
    };

    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleUpdateVault = (vaultId: string, name: string, icon: string, color: string) => {
        setVaults(
            vaults.map((v) =>
                v.id === vaultId
                    ? {
                        ...v,
                        name,
                        icon,
                        color,
                        path: `/vault/${name.toLowerCase().replace(/\s+/g, '-')}`,
                    }
                    : v
            )
        );
        setEditingVault(null);
    };

    const handleEditVault = (vault: Vault) => {
        setEditingVault(vault);
        setIsDrawerOpen(true);
    };

    const handleShareVault = (vault: Vault) => {
        // You can also pass vault name or info if needed
        setIsShareModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsShareModalOpen(false);
    };

    const handleDeleteClick = (vault: Vault) => {
        setVaultToDelete(vault);
        setDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setVaultToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (vaultToDelete) {
            setVaults(vaults.filter((v) => v.id !== vaultToDelete.id));
            setDeleteModalOpen(false);
            setVaultToDelete(null);

            // If the deleted vault was selected, reset to inbox
            if (selectedTab === vaultToDelete.key) {
                setSelectedTab('inbox');
                localStorage.setItem('selectedTab', 'inbox');
                navigate('/all_items');
            }
        }
    };


    useEffect(() => {
        localStorage.setItem(VAULTS_STORAGE_KEY, JSON.stringify(vaults));
    }, [vaults]);


    useEffect(() => {
        dispatch(fetchItemCount());
    }, [dispatch]);

    const tabs = [
        { label: 'All Items', path: '/all_items', icon: MdMoveToInbox, key: 'inbox', count: count?.all_items_count || 0, },
        { label: 'Personal', path: '/personal', icon: CircleUserRound, key: 'done', count: count?.personal_count || 0, },
        { label: 'Pin', path: '/pin', icon: Pin, key: 'important', count: count?.pin_count || 0 },
        { label: 'Trash', path: '/trash', icon: RiDeleteBinLine, key: 'trash', count: count?.trash_count || 0, },
    ];
    const baseClasses =
        'mb-0.5 w-full flex justify-between blue:hover:text-white blue:text-black blue:hover:bg-[#4e96ca59] items-center px-3 py-2 rounded-md font-medium ' +
        'classic:hover:bg-[#a8c7fa] classic:hover:text-black ' +
        'cornflower:hover:bg-[#43aabcd5] cornflower:hover:text-white ' +
        'peach:hover:bg-[#132032] peach:hover:text-white ' +
        'hover:bg-[#162b4a] hover:text-[#fff] ' +
        'lightmint:hover:bg-[#477f5f67] lightmint:hover:text-white ' +
        'dark:hover:bg-[#2F2F2F] dark:hover:text-white ' +
        'salmonpink:hover:bg-[#34878e7a] salmonpink:hover:text-white salmonpink:font-normal ' +
        'softazure:hover:bg-[#4a4e69] softazure:hover:text-white';

    const activeClasses =
        'bg-[#162b4a] font-semibold text-white blue:bg-[#4e96ca59]  blue:text-white dark:bg-[#2F2F2F] dark:text-white ' +
        'classic:bg-[#a8c7fa]  classic:text-black ' +
        'cornflower:bg-[#43aabcd5] cornflower:text-white ' +
        'peach:bg-[#132032] peach:text-white ' +
        'lightmint:bg-[#477f5f67] lightmint:text-white ' +
        'salmonpink:bg-[#34878e7a] salmonpink:text-white ' +
        'softazure:bg-[#4a4e69]';

    const modalItems = [
        {
            id: 'login',
            label: 'Login',
            description: 'Secure username and password combination',
            icon: <FiLogIn size={18} />,
            action: () => dispatch(openAddModal()),
        },
        {
            id: 'card',
            label: 'Card',
            description: 'Credit or debit card information',
            icon: <FiCreditCard size={18} />,
            action: () => dispatch(openCardAddModal()),
        },
        {
            id: 'identity',
            label: 'Identity',
            description: 'Personal identification details',
            icon: <FiUser size={18} />,
            action: () => dispatch(openIdentityAddModal()),
        },
        {
            id: 'password',
            label: 'Password Generator',
            description: 'Create strong, secure passwords',
            icon: <FiKey size={18} />,
            action: () => dispatch(openPasswordGenerator()),
        },
    ];

    // Function to handle tab click
    const handleTabClick = (tabKey: string, tabPath: string) => {
        setSelectedTab(tabKey);
        localStorage.setItem('selectedTab', tabKey);
        navigate(tabPath);
    };

    // Function to handle vault click
    const handleVaultClick = (vault: Vault) => {
        setSelectedTab(vault.key);
        localStorage.setItem('selectedTab', vault.key);
        navigate(vault.path);
    };

    return (
        <>
            <div className="lg:flex lg:relative h-full text-[#fff] lightmint:bg-[#629e7c]">
                <div className={`overlay bg-black/60 z-[5] w-full h-full fixed inset-0 xl:!hidden ${menuBarOpen ? 'block' : 'hidden'}`} onClick={() => setMenuBarOpen(false)}></div>
                <div
                    className={`  lg:block dark:gray-50 classic:bg-[#F8FAFD] cornflower:bg-[#6BB8C5] bg-[#133466] peach:bg-[#1b2e4b] dark:bg-[#202127] w-[250px] max-w-full flex-none xl:relative lg:relative z-50 xl:h-auto h-auto hidden salmonpink:bg-[#006d77] softazure:bg-[#9a8c98] blue:bg-[#64b5f6] softazure:text-[#f7fff7] ${menuBarOpen ? '!block fixed inset-y-0 ltr:left-0 rtr:right-0' : ''
                        }`}
                >
                    <div className="lightmint:bg-[#629e7c]">
                        <div className="py-3 px-5 blue:bg-[#64b5f6]">
                            <Link to="/" className="font_woff main-logo flex pl-0.5 items-center gap-1 shrink-0">
                                <div className="logo_shadow">
                                    <img className="w-[33px] logo_shadow rounded-md inline" src={logo} alt="logo" />
                                </div>
                                <span className="font_woff text-2xl font-medium align-middle hidden md:inline blue:text-black classic:text-gray-900 dark:text-white-light transition-all duration-300 text-[#fff]">
                                    JQ Password
                                </span>
                            </Link>
                        </div>
                        <div className="flex flex-col h-full blue:bg-[#64b5f6] pb-8">
                            <div className="flex justify-center relative">
                                <div className="w-full max-w-xs px-4 ">
                                    <button
                                        className="btn hover:shadow-md mb-1 blue:bg-[#e3f2fd] blue:text-black salmonpink:bg-gray-100 salmonpink:text-black bg-[#2565C7] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-gray-200 cornflower:text-black peach:bg-gray-200 peach:text-black dark:bg-[#2F2F2F] lightmint:bg-green-50 lightmint:text-black border-none shadow-md py-3 font-medium rounded-lg w-full relative text-white softazure:bg-[#363852]"
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <FiPlus size={20} className="mr-1 inline" />
                                        Create item
                                    </button>

                                    {/* Modal Popup */}
                                    <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} items={modalItems} />
                                </div>
                            </div>

                            <div className="space-y-0 pl-3 pr-3 w-full mt-1  -mr-3  flex flex-col classic:text-gray-900">
                                <div>
                                    {tabs.map((tab) => (
                                        <Tippy content={tab.label} placement="right" key={tab.path}>
                                            <button type="button" onClick={() => handleTabClick(tab.key, tab.path)} className={`${baseClasses} ${selectedTab === tab.key ? activeClasses : ''}`}>
                                                <div className="flex items-center">
                                                    <tab.icon className="shrink-0 w-4 h-4" />
                                                    <div className="ltr:ml-2 rtl:mr-3 text-white font-medium text-sm truncate">{tab.label}</div>
                                                </div>
                                                {tab.count !== undefined && <div className="text-white text-xs font-semibold ml-auto">{tab.count}</div>}
                                            </button>
                                        </Tippy>
                                    ))}
                                </div>

                                <div className="border-t border-gray-600 py-3 items-center px-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-1 items-center cursor-pointer " onClick={openDrawer}>
                                            <Tag className="h-4 cursor-pointer" />
                                            My Cells
                                        </div>
                                        <div className="flex  gap-1">
                                            <PlusIcon className="h-4 cursor-pointer rounded-full hover:bg-white/20 transition duration-150" onClick={openDrawer} />
                                        </div>
                                    </div>
                                </div>

                                <CreateVaultDrawer
                                    open={isDrawerOpen}
                                    onClose={() => {
                                        setIsDrawerOpen(false);
                                        setEditingVault(null);
                                    }}
                                    onCreate={handleCreateVault}
                                    onEdit={handleUpdateVault}
                                    editVault={editingVault}
                                />

                                <div className="h-[50vh] overflow-hidden">
                                    {vaults && vaults.length > 0 && (
                                        <div className="">
                                            {vaults.map((vault) => (
                                                <div key={vault.id} className="relative group">
                                                    <Tippy content={vault.name} placement="right">
                                                        <div
                                                            className={`flex items-center justify-between px-2 py-2 rounded-lg dark:bg-white/10 hover:bg-[#1f2b3a] transition cursor-pointer ${selectedTab === vault.key ? 'bg-[#1f2b3a]' : ''
                                                                }`}
                                                            onClick={() => handleVaultClick(vault)}
                                                        >
                                                            {/* Left Icon and Name */}
                                                            <div className="flex items-center gap-1 w-full">
                                                                <Box sx={{ color: vault.color, display: 'flex', mr: 1 }}>{iconComponents[vault.icon]}</Box>
                                                                <span className="text-white font-medium text-sm truncate">{vault.name}</span>
                                                            </div>

                                                            {/* Dots Dropdown */}
                                                            <div className="relative flex-shrink-0 z-50">
                                                                <Menu as="div" className="relative inline-block text-left">
                                                                    <Menu.Button className="rounded-full p-1 hover:bg-white/20 transition duration-150" onClick={(e) => e.stopPropagation()}>
                                                                        <HiDotsVertical className="w-4 h-4 text-white" />
                                                                    </Menu.Button>

                                                                    <Menu.Items className="fixed left-[200px] mt-1 w-44 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none z-[100]">
                                                                        <div className="py-1 text-gray-900 dark:text-gray-100">
                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleEditVault(vault);
                                                                                        }}
                                                                                        className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                                                            } flex items-center w-full px-4 py-2 text-sm font-medium`}
                                                                                    >
                                                                                        <GoPencil className="mr-2 w-4 h-4" />
                                                                                        Edit Cell
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>

                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleShareVault(vault);
                                                                                        }}
                                                                                        className={`${active ? "bg-gray-100 dark:bg-gray-700" : ""
                                                                                            } flex items-center w-full px-4 py-2 text-sm font-medium`}
                                                                                    >
                                                                                        <FiUserPlus className="mr-2 w-4 h-4" />
                                                                                        Share Cell
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>


                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleDeleteClick(vault);
                                                                                        }}
                                                                                        className={`${active ? 'bg-red-100 dark:bg-red-900/30' : ''
                                                                                            } flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400`}
                                                                                    >
                                                                                        <FaRegTrashAlt className="mr-2 w-4 h-4" />
                                                                                        Delete Cell
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>
                                                                        </div>
                                                                    </Menu.Items>
                                                                </Menu>
                                                            </div>
                                                        </div>
                                                    </Tippy>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <DeleteConfirmationModal
                                    open={deleteModalOpen}
                                    onClose={handleCancelDelete}
                                    onConfirm={handleConfirmDelete}
                                    vaultName={vaultToDelete?.name || ""}
                                />

                                <ShareModal isOpen={isShareModalOpen} onClose={handleCloseModal} onConfirm={() => { }} vaultName={vaultToDelete?.name || ""} />

                                <div className="h-px dark:border-[#1b2e4b]"></div>
                            </div>

                            <div className="fixed classic:bg-[#F8FAFD] classic:text-gray-900 cornflower:bg-[#6BB8C5] peach:bg-[#1b2e4b] lightmint:bg-[#629e7c] dark:bg-[#202127] bottom-0 py-2 z-50 px-3 w-[250px] text-center salmonpink:bg-[#006d77] blue:bg-[#64b5f6] softazure:bg-[] blue:text-gray-900">
                                <div className="flex flex-col justify-center items-center h-full">
                                    <div className="h-1.5 bg-[#222222] flex w-full items-center rounded-full">
                                        <div className="h-1 bg-white w-7 rounded-full"></div>
                                    </div>
                                    <div className="flex w-full pt-2 justify-between font-medium">
                                        <span>
                                            6.84 MB / <span className="font-light">500.00 MB</span>
                                        </span>
                                        <span className="ml-2">v6.0.65.5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default SidePanel;