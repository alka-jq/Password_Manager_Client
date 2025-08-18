import React, { useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import { MdMoveToInbox, MdOutlineCircle } from 'react-icons/md';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import logo from '../../assets/images/ubs icons/2-removebg-preview.png';
import { useAuth } from '../../useContext/AppState';
import { RiDeleteBinLine, RiDraftLine, RiSpam2Line } from 'react-icons/ri';
import { FiCreditCard, FiKey, FiPlus, FiUser } from 'react-icons/fi';
import { FaRegStar, FaRegTrashAlt } from 'react-icons/fa';
import { RxUpdate } from 'react-icons/rx';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { AiOutlineTeam } from "react-icons/ai";
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
import { FiUserPlus, FiLogIn } from 'react-icons/fi';
import { getCardCountsByTab } from "@/store/selectors/cardSelectors"
import { openAddModal as openCardAddModal } from "@/store/Slices/cardSlice"
import {
    Home, Briefcase, Gift, Store, Heart, AlarmClock, AppWindow, Settings, Users, Ghost,
    ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
    Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText
} from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { openAddModal as openIdentityAddModal } from "@/store/Slices/identitySlice"
import { openPasswordGenerator } from "@/store/Slices/passwordSlice"
import PasswordGenerator from "./passwordgenerator"
import { useVaults } from '@/useContext/VaultContext';


interface Vault {
    id: string;
    name: string;
    path: string;
    key: string;
    icon: string;
    color: string;
}
const VAULTS_STORAGE_KEY = 'userVaults';
const SidePanel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { menuBarOpen, setMenuBarOpen } = useAuth();
    const [isEdit, setIsEdit] = useState(false);
    const counts = useSelector(getCombinedItemCountsByTab);
    const [selectedTab, setSelectedTab] = useState(() => {
        return localStorage.getItem('selectedTab') || 'inbox';
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { vaults, setVaults } = useVaults();
    const [editingVault, setEditingVault] = useState<Vault | null>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [vaultToDelete, setVaultToDelete] = useState<Vault | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

 const handleCreateVault = (vaultName: string, iconName: string, color: string) => {
  const path = `/Cell/${vaultName.toLowerCase().replace(/\s+/g, '-')}`;
  const newVault: Vault = {
    id: Date.now().toString(),
    name: vaultName,
    path,
    key: `vault-${Date.now()}`,
    icon: iconName,
    color: color,
  };

  // Completely safe update with multiple fallbacks
  setVaults(prevVaults => {
    const currentVaults = Array.isArray(prevVaults) ? prevVaults : [];
    const updatedVaults = [...currentVaults, newVault];
    
    try {
      localStorage.setItem("VAULTS_STORAGE_KEY", JSON.stringify(updatedVaults));
    } catch (error) {
      console.error("Failed to save vaults to localStorage", error);
    }
    
    return updatedVaults;
  });

  navigate(path);
};
    const openDrawer = () => {
        setIsDrawerOpen(true);
        //  setIsDrawerOpen();
    };

    const handleUpdateVault = (vaultId: string, name: string, icon: string, color: string) => {
        setVaults(vaults.map(v =>
            v.id === vaultId ? {
                ...v,
                name,
                icon,
                color,
                path: `/vault/${name.toLowerCase().replace(/\s+/g, '-')}`
            } : v
        ));
        setEditingVault(null);
    };

    const handleEditVault = (vault: Vault) => {
        setEditingVault(vault);
        setIsDrawerOpen(true);
    };

    const handleShareVault = (vault: Vault) => {
        setIsShareOpen(true);
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
            setVaults(vaults.filter(v => v.id !== vaultToDelete.id));
            setDeleteModalOpen(false);
            setVaultToDelete(null);
        }
    };

    useEffect(() => {
        localStorage.setItem(VAULTS_STORAGE_KEY, JSON.stringify(vaults));
    }, [vaults]);


    const tabs = [
        { label: 'All Items', path: '/all_items', icon: MdMoveToInbox, key: 'inbox', count: counts.inbox },
        { label: 'Personal', path: '/personal', icon: CircleUserRound, key: 'done', count: counts.done },
        { label: 'Pin', path: '/pin', icon: Pin, key: 'important', count: counts.important },
        { label: 'Trash', path: '/trash', icon: RiDeleteBinLine, key: 'trash', count: counts.trash },
    ];

    // const disclosureTabs = [
    //     { label: 'Team', path: '/team', icon: AiOutlineTeam, key: 'team', count: counts.team },
    //     { label: 'Update', path: '/update', icon: RxUpdate, key: 'update', count: counts.update },
    // ];

    // const priorityTabs = [
    //     { label: 'High', path: '/high', icon: IoAlertCircleOutline, key: 'high', count: counts.high },
    //     { label: 'Medium', path: '/medium', icon: MdOutlineCircle, key: 'medium', count: counts.medium },
    //     { label: 'Low', path: '/low', icon: MdOutlineCircle, key: 'low', count: counts.low },
    // ];

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


    const dropdownItems = [
        {
            id: 'login',
            label: 'Login',
            icon: <FiLogIn size={18} className="mr-2" />,
            action: () => dispatch(openAddModal())
        },
        {
            id: 'card',
            label: 'Card',
            icon: <FiCreditCard size={18} className="mr-2" />,
            action: () => dispatch(openCardAddModal()),// Add your action here

        },
        {
            id: 'identity',
            label: 'Identity',
            icon: <FiUser size={18} className="mr-2" />,
            action: () => dispatch(openIdentityAddModal()),
        },

        {
            id: 'password',
            label: 'Password Generator',
            icon: <FiKey size={18} className="mr-2" />,
            action: () => dispatch(openPasswordGenerator()),// Add your action here
        }
    ];

    //  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Click outside detection
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <>
            <div className="lg:flex lg:relative h-full text-[#fff] lightmint:bg-[#629e7c]">
                <div className={`overlay bg-black/60 z-[5] w-full h-full fixed inset-0 xl:!hidden ${menuBarOpen ? 'block' : 'hidden'}`} onClick={() => setMenuBarOpen(false)}></div>
                <div
                    className={`  lg:block dark:gray-50 classic:bg-[#F8FAFD] cornflower:bg-[#6BB8C5] bg-[#133466] peach:bg-[#1b2e4b] dark:bg-[#202127] w-[250px] max-w-full flex-none xl:relative lg:relative z-50 xl:h-auto h-auto hidden salmonpink:bg-[#006d77] softazure:bg-[#9a8c98] blue:bg-[#64b5f6] softazure:text-[#f7fff7] ${menuBarOpen ? '!block fixed inset-y-0 ltr:left-0 rtl:right-0' : ''}`}

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
                            <div className="flex justify-center relative" ref={dropdownRef}>
                                <div className="w-full max-w-xs px-4 ">
                                    <button
                                        className="btn hover:shadow-md mb-1 blue:bg-[#e3f2fd] blue:text-black salmonpink:bg-gray-100 salmonpink:text-black bg-[#2565C7] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-gray-200 cornflower:text-black peach:bg-gray-200 peach:text-black dark:bg-[#2F2F2F] lightmint:bg-green-50 lightmint:text-black border-none shadow-md py-3 font-medium rounded-lg w-full relative text-white softazure:bg-[#363852]"
                                        type="button"
                                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                                    >
                                        <FiPlus size={20} className="mr-1 inline" />
                                        Create item
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 w-52 bg-white dark:bg-[#2F2F2F] rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                                            {dropdownItems.map((item: any) => (
                                                <button
                                                    key={item.id}
                                                    className="flex items-center w-full px-4 py-3 text-left rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    onClick={() => {
                                                        item.action()
                                                        setIsDropdownOpen(false)
                                                    }}
                                                >
                                                    {item.icon}
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-0 pl-3 w-full mt-1  -mr-3  flex flex-col classic:text-gray-900">
                                <div>
                                    {tabs.map((tab) => (
                                        <Tippy content={tab.label} placement="right" key={tab.path}>
                                            <Link to={tab.path}>
                                                <button
                                                    type="button"
                                                    className={`${baseClasses} ${!isEdit && selectedTab === tab.key ? activeClasses : ''}`}
                                                >
                                                    <div className="flex items-center">
                                                        <tab.icon className="shrink-0 w-4 h-4" />
                                                        <div className="ltr:ml-2 rtl:mr-3">{tab.label}</div>
                                                    </div>
                                                    {tab.count !== undefined && (
                                                        <div className="text-white text-xs font-semibold ml-auto">
                                                            {tab.count}
                                                        </div>
                                                    )}
                                                </button>
                                            </Link>
                                        </Tippy>
                                    ))}
                                </div>

                                <div className='border-t border-gray-600 py-3 items-center px-2'>
                                    <div className='flex justify-between items-center'>
                                        <div
                                            className='flex gap-1 items-center cursor-pointer '
                                            onClick={openDrawer}
                                        >
                                            <Tag className="h-4 cursor-pointer" />
                                            My Cells
                                        </div>
                                        <div className='flex gap-1 '>
                                            <PlusIcon
                                                className="h-4 cursor-pointer rounded-full hover:bg-white/20 transition duration-150 "
                                                onClick={openDrawer}
                                            />
                                            <Link to="/setting">
                                                <BsGear className="h-4 cursor-pointer " />
                                            </Link>
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

                                <div className=" h-[50vh] thin-scrollbar  overflow-auto">
                                    {vaults && vaults.length > 0 && (
                                        <div className=" ">

                                            {vaults.map((vault) => (
                                                <div key={vault.id} className="relative group">
                                                    <Tippy content={vault.name} placement="right">
                                                        <div className="flex items-center justify-between px-2 py-2 rounded-lg  dark:bg-white/10 hover:bg-[#1f2b3a] transition cursor-pointer">
                                                            {/* Left Icon and Name */}
                                                            <div
                                                                onClick={() => {
                                                                    setSelectedTab(vault.key);
                                                                }}
                                                                className="flex items-center gap-2 w-full"
                                                            >
                                                                <Box sx={{ color: vault.color, display: 'flex', mr: 1 }}>
                                                                    {iconComponents[vault.icon]}
                                                                </Box>
                                                                <span className="text-white font-medium text-sm truncate">{vault.name}</span>
                                                            </div>

                                                            {/* Dots Dropdown (shown only on hover) */}
                                                            <div className="relative">
                                                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                                    <Menu as="div" className="relative inline-block text-left z-50">
                                                                        <Menu.Button className="p-1 rounded-full hover:bg-white/20 transition duration-150">
                                                                            <HiDotsVertical className="w-4 h-4 text-white" />
                                                                        </Menu.Button>



                                                                        <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none">
                                                                            <div className="py-1 text-gray-900 dark:text-gray-100">
                                                                                <Menu.Item>
                                                                                    {({ active }) => (
                                                                                        <button
                                                                                            onClick={() => handleEditVault(vault)}
                                                                                            className={`${active ? "bg-gray-100 dark:bg-gray-700" : ""
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
                                                                                            onClick={() => handleShareVault(vault)}
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
                                                                                            onClick={() => handleDeleteClick(vault)}
                                                                                            className={`${active ? "bg-red-100 dark:bg-red-900/30" : ""
                                                                                                } flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400`}
                                                                                        >
                                                                                            <FaRegTrashAlt className="mr-2 w-4 h-4" />
                                                                                            Delete Cell
                                                                                        </button>
                                                                                    )}
                                                                                </Menu.Item>
                                                                            </div>
                                                                        </Menu.Items>

                                                                        {/* Delete Confirmation Modal */}
                                                                        <DeleteConfirmationModal
                                                                            open={deleteModalOpen}
                                                                            onClose={handleCancelDelete}
                                                                            onConfirm={handleConfirmDelete}
                                                                            vaultName={vaultToDelete?.name || ""}
                                                                        />
                                                                    </Menu>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tippy>
                                                </div>

                                            ))}
                                        </div>
                                    )}
                                </div>

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