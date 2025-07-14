import { decryptAvatar } from '@/utils/image-encryption';
import Tippy from '@tippyjs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsGear } from 'react-icons/bs';
import { HiOutlineDotsVertical, HiPlus } from 'react-icons/hi';
import { IoIosSearch } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { PiDotsNineBold } from 'react-icons/pi';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import docs from '../../assets/images/UB_Logos/docs-logo.png';
import sheet from '../../assets/images/UB_Logos/sheet-logo.png';
import pad from '../../assets/images/UB_Logos/pad-logo.png';
import ppt from '../../assets/images/UB_Logos/ppt-logo.png';
import mail from '../../assets/images/UB_Logos/ublogo.png';
import drive from '../../assets/images/UB_Logos/ubdrive.png';
import contact from '../../assets/images/UB_Logos/contact.png';
import calendar from '../../assets/images/UB_Logos/calendar.png';
import meeting from '../../assets/images/UB_Logos/meet.png';
import form from '../../assets/images/UB_Logos/form-logo.png';
import pdf from '../../assets/images/UB_Logos/pdf-logo.png';
import esign from '../../assets/images/UB_Logos/e-sign-icons.png';
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useAuth } from '../../useContext/AppState';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import { useSettings } from '@/useContext/useSettings';
import { BiSupport } from "react-icons/bi";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

//-----------------search-----------------//from 'react';
import { DecryptedEmail } from '../../types/type';
import lunr from 'lunr';
import { useEmailSync } from '@/hooks/useEmailSync';
import { LiaSearchPlusSolid } from 'react-icons/lia';
import SearchPopup from '../searchAdvanceOption';
import { LuSettings2 } from 'react-icons/lu';
import { TbGridDots } from 'react-icons/tb';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { GoVersions } from 'react-icons/go';
import { RootState } from '@/store';
import { fr } from 'date-fns/locale';
import { setSearchTerm } from '@/store/Slices/taskSlice';
import { setSearchingData } from '@/store/Slices/taskSlice';

const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};

const colors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#00bcd4', '#4caf50', '#ff9800', '#795548', '#607d8b'];

const getColor = (text: string) => {
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};

interface UserType {
    first_name: string;
    email: string;
}

type UserProfile = {
    first_name?: string;
    email?: string;
    avatar?: string;
    // any other properties you expect
};

const Header = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.task.tasks);
    const { logout, setAuthToken, token, sideBartoggle, searchData, menuBarOpen, setMenuBarOpen } = useAuth();
    console.log(searchData, 'search');
    const [userName, setUserName] = useState<string>('');
    const [userOption, setUserOption] = useState(false)
    const [openSearch, setOpenSearch] = useState(false);
    const [searchContent, setSearchContent] = useState(false);
    const [searchIn, setSearchIn] = useState('All mail');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sender, setSender] = useState('');
    const [recipient, setRecipient] = useState('');
    const [searchOption, setSearchOption] = useState(false);
    const [address, setAddress] = useState('All');
    const popupRef = useRef(null);
    const [userId, setUserId] = useState<UserType>({
        first_name: '',
        email: '',
    });
    const navigate = useNavigate();
    const themeConfig = useSelector((state: RootState) => state.themeConfig);
    const isRtl = useSelector((state: RootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [search, setSearch] = useState(false);
    const popupInputRef = useRef<HTMLInputElement>(null);
    const searchTerm = useSelector((state: RootState) => state.task.searchTerm);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setSearchTerm(value));
        dispatch(setSearchingData(value.trim().length > 0));
    };

    useEffect(() => {
        if (openSearch && popupInputRef.current) {
            popupInputRef.current.focus();
        }
    }, [openSearch]);

    //outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !(popupRef.current as HTMLElement).contains(event.target as Node)) {
                setOpenSearch(false);
                setSearchingData(false);
                setShowProfileBtn(false)
                setOpenHelp(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);


    const apps = [
        { src: mail, link: '/', title: 'ubMail', with: "w-10" },
        { src: drive, link: '/', title: 'ubDrive', with: "w-10" },
        { src: meeting, link: '/', title: 'ubMeeting', with: "w-12" },
        { src: docs, link: '/', title: 'ubDocument', with: "w-10" },
        { src: pad, link: '/', title: 'ubPad', with: "w-12" },
        { src: sheet, link: '/', title: 'ubSheet', with: "w-12" },
        { src: calendar, link: '/', title: 'ubCalendar', with: "w-14" },
        { src: ppt, link: '/', title: 'ubPpt', with: "w-12" },
        { src: contact, link: '/', title: 'ubContact', with: "w-14" },
        { src: pdf, link: '/', title: 'ubPDF', with: "w-12" },
        { src: form, link: '/', title: 'ubForm', with: "w-12" },
        // { src: esign, link: '/', title: 'ubE-Sign' , with : "w-22" },
    ];

    const { t } = useTranslation();
    const handleLogout = () => {
        logout();
        navigate('../auth/boxed-signin');
    };

    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${baseUrl}/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // If the server sends a JSON object directly:
                const userData = await response.json();

                // If it's a JSON string you need to parse again:
                // const userData = JSON.parse(await response.text());

                console.log(userData, 'data username');
                setUserId(userData);
                let decryptedImage = await decryptAvatarImg(userData.avatar);
                // console.log(decryptedImage, "Decrypted Image")
                setProfile({ ...userData, avatar: decryptedImage });
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const decryptAvatarImg = async (avatar: string) => {
        let decryptedAvatar = await decryptAvatar(avatar);
        //  console.log(decryptedAvatar, "decrtyped avatar")
        return decryptedAvatar;
    };

    const getRandomHexColor = (): string => {
        return (
            '#' +
            Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')
        );
    };

    const getColorFromString = (str: string): string => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#ff9800', '#795548', '#607d8b'];

        const hash = Array.from(str).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const nameSeed = userId?.first_name || userId?.email || 'guest';
    const bgColor = getColorFromString(nameSeed);
    const initial = nameSeed.charAt(0).toUpperCase();
    const { setSettingOpen } = useSettings();

    //-------------------search function  main----------------------//
    const { emails, loading } = useEmailSync();
    const [openHelp, setOpenHelp] = useState(false)
    const [openFeadback, setOpenFeadback] = useState(false);
    const [lunrIndex, setLunrIndex] = useState<lunr.Index | null>(null);

    useEffect(() => {
        console.log('📦 Setting up Lunr index header', emails);

        if (!emails.length) return;

        const idx = lunr(function () {
            this.ref('id');
            this.field('subject');
            this.field('plain_text');
            this.field('from_email'); // ✅ Searchable field

            emails.forEach((email) => {
                this.add({
                    id: email.id.toString(),
                    subject: email.subject || '',
                    plain_text: email.plain_text || '',
                    from_email: email.from_email || '',
                });
            });
        });

        console.log('✅ Built Lunr index');
        setLunrIndex(idx);
    }, [emails]);


    //-------------------search function  advance ----------------------//

    const [searchAdvanceTerm, setSearchAdvanceTerm] = useState('');
    const [lunrAdvIndex, setLunrAdvIndex] = useState<lunr.Index | null>(null);

    useEffect(() => {
        console.log('📦 Setting up Lunr index header', emails);

        if (!emails.length) return;

        const idx = lunr(function () {
            this.ref('id');
            this.field('subject');
            this.field('plain_text');
            this.field('from_email');

            emails.forEach((email) => {
                this.add({
                    id: email.id.toString(),
                    subject: email.subject || '',
                    plain_text: email.plain_text || '',
                    from_email: email.from_email || '',
                });
            });
        });

        console.log('✅ Built Lunr index');
        setLunrAdvIndex(idx); // <-- corrected setter
    }, [emails]);

    const filteredEmail = useMemo(() => {
        const term = searchAdvanceTerm.trim();

        if (!term || !lunrAdvIndex) return emails;

        try {
            const results = lunrAdvIndex.search(`*${term}*`);
            const emailMap = new Map(emails.map((e) => [e.id.toString(), e]));

            return results.map((r) => emailMap.get(r.ref)).filter(Boolean) as DecryptedEmail[];
        } catch (error) {
            console.error('🔍 Lunr search error:', error);
            return [];
        }
    }, [searchAdvanceTerm, emails, lunrAdvIndex]);

    const [showProfileBtn, setShowProfileBtn] = useState(false)
    // const location = useLocation();


    return (
        <header
            className={`z-40 ${menuBarOpen ? ' bg-black opacity-30 inset-0 pointer-events-none' : ''
                }  cornflower:bg-[#6BB8C5]  classic:bg-[#F8FAFD] classic:text-gray-900 shadow-none classic:border-[#F8FAFD] cornflower:border-[#6BB8C5]  bg-[#fff] border-b-[1px] peach:bg-[#1b2e4b] peach:border-[#1b2e4b] lightmint:border-[#629e7c] lightmint:bg-[#629e7c] dark:border-[#202127] border-gray-300 salmonpink:border-none blue:border-none softazure:border-none blue:bg-[#64b5f6] salmonpink:bg-[#006d77] softazure:bg-[#9a8c98] ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''
                }`}
        >
            <div className=" ">
                <div className="relative  flex w-full items-center px-4 py-2  salmonpink:bg-[#006d77]  dark:bg-[#202127]">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="font_woff main-logo  items-center shrink-0 hidden">
                            <img width={50} height={'auto'} className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/ubsmail_logo.png" alt="logo" />
                            <span className="font_woff text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle  md:inline dark:text-white-light transition-all duration-300">ubs</span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex-none text-black text-2xl  dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary block lg:hidden  ltr:ml-2 rtl:mr-2 p-2 rounded-full  dark:bg-dark/40  dark:hover:bg-dark/60"
                            onClick={() => setMenuBarOpen(!menuBarOpen)}
                        >
                            <IconMenu />
                        </button>
                    </div>

                    <div className="sm:flex-1 ltr:sm:ml-0  ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-0 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6] gap-1 lg:gap-">
                        <div className="sm:ltr:mr-auto w-full  sm:rtl:ml-auto ">
                            <form
                                className={`${search ? '!block' : ''} sm:relative absolute inset-x-0 sm:top-0 top-1/2 sm:translate-y-0 -translate-y-1/2 sm:mx-0 mx-4 z-10 sm:block hidden`}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setSearch(false);
                                }}
                            >
                                <div className="flex items-center gap-2   lg:w-[540px] relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onClick={() => dispatch(setSearchingData(true))}
                                        onChange={handleChange}
                                        className="textMedium py-2 ltr:pl-10 w-full placeholder: rounded-xl border peach:bg-gray-200 classic:bg-gray-100 lightmint:bg-green-50 blue:bg-[#e0edf7]  border-gray-300 bg-[#fbfbfb] dark:bg-[#2F2F2F] dark:border-[#2F2F2F]  dark:text-white dark:placeholder:text-white focus:outline-none focus:shadow-md transition peer"
                                        placeholder="Search items..."
                                    />
                                    <button type="button" className="absolute dark:text-white w-8 h-full flex items-center justify-center ml-1 inset-0 ltr:right-auto rtl:left-auto">
                                        <IoIosSearch size={20} className="mx-auto" />
                                    </button>
                                    
                                    {/* <button type="button" onClick={() => setSearch(false)} className="absolute lg:hidden dark:text-white w-8 h-8 mt-1 right-10">
                                        <IoClose size={20} />
                                    </button> */}

                                    {/* {searchingData && (
                                        <div ref={popupRef} className="absolute top-full w-[540px] dark:border-gray-500 peach:bg-gray-100 dark:bg-[#1F1F1F] blue:bg-blue-50 lightmint:bg-gray-50 max-h-[60vh] thin-scrollbar  overflow-y-auto border rounded bg-white ">
                                            {filteredEmails.length > 0 ? (
                                                <table className="min-w-full divide-y divide-gray-200 ">
                                                    <tbody className="divide-y divide-gray-200 ">
                                                        {filteredEmails.map((email) => (
                                                            <tr
                                                                key={email.id}
                                                                onClick={() => {
                                                                    setSearchingData(false);
                                                                    navigate(`/mail_thread/${email.thread_id}`, {
                                                                        state: {
                                                                            id: email.id,
                                                                            mail: email,
                                                                            type: email.folder_info?.type || '',
                                                                        },
                                                                    });
                                                                }}
                                                                className="hover:bg-gray-50 dark:hover:bg-[#2F2F2F] transition-colors duration-150 cursor-pointer"
                                                            >
                                                                <td onClick={() => setSearchingData(false)} className="px-6 py-3 whitespace-nowrap w-10">
                                                                    <div className="flex justify-center">
                                                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </td>
                                                                <td className="px-0 py-3">
                                                                    <div className="space-y-1">
                                                                        <p className="font-medium text-gray-900 dark:text-white truncate max-w-[300px]">{email.subject}</p>
                                                                        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                                            <span className="font-medium">{email.from_email || email.from}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-3 whitespace-nowrap text-right">
                                                                    <div className="flex flex-col items-end">
                                                                        {email.created_at ? (
                                                                            <>
                                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                                    {new Date(email.created_at).toLocaleDateString(undefined, {
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                    })}
                                                                                </span>
                                                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                                                    {new Date(email.created_at).toLocaleTimeString(undefined, {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span className="text-sm text-gray-500 dark:text-gray-400">—</span>
                                                                                <span className="text-xs text-gray-400 dark:text-gray-500"></span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="text-gray-500 text-center py-4">No matching emails found.</div>
                                            )}
                                        </div>
                                    )} */}
                                </div>

                                {openSearch && (
                                    <div ref={popupRef} className="absolute top-0 left-0 w-[540px] bg-white dark:bg-[#202127] z-50 shadow-xl rounded-xl max-h-[80vh] flex flex-col">
                                        <SearchPopup openSearch={openSearch} setOpenSearch={setOpenSearch} emails={emails} />
                                    </div>
                                )}
                            </form>

                            <button type="button" onClick={() => setSearch(!search)} className="search_btn sm:hidden text-black dark:bg-dark/40 mt-1 dark:hover:bg-dark/60">
                                <IoIosSearch className="w-5 h-5 mx-auto dark:text-white" />
                            </button>
                        </div>
                        <div

                            className="block p-2 relative  rounded-[30px]  softazure:hover:text-black  dark:text-white cornflower:text-white peach:hover:text-black peach:text-white cornflower:hover:text-black lightmint:hover:text-black lightmint:text-white cursor-pointer dark:bg-dark/40  hover:bg-white-light/90 dark:hover:bg-dark/60 softazure:text-white salmonpink:text-[#edf6f9] salmonpink:hover:text-[#000000] "
                        >
                            <div onClick={() => setOpenHelp(!openHelp)} className=''>
                                <Tippy content="Settings">
                                    <RxQuestionMarkCircled size={20} />
                                </Tippy>
                                {
                                    openHelp && (
                                        <div ref={popupRef} className=" z-10 absolute dark:bg-[#202127] lightmint:bg-green-50 dark:border-gray-600 -right-5 m-4  bg-white rounded-lg shadow-lg border border-gray-200 w-64">
                                            <div className="space-y- lightmint:text-black flex flex-col ">
                                                <a href="https://www.ubshq.com/support" target='_blank' className="px-4 py-2 hover:bg-gray-100 gap-2 tracking-wide  dark:hover:bg-[#2F2F2F] cursor-pointer flex items-center"><BiSupport />Support</a>
                                                <a href="https://www.ubshq.com/blog" target="_blank" className="px-4 py-2  flex items-center hover:bg-gray-100 gap-2 tracking-wide   dark:hover:bg-[#2F2F2F] cursor-pointer"><MdOutlineTipsAndUpdates />Updates</a>
                                                <a href="https://www.ubshq.com/insights" target="_blank" className="px-4 py-2 hover:bg-gray-100 gap-2 tracking-wide  flex items-center  dark:hover:bg-[#2F2F2F]  cursor-pointer"><GoVersions />
                                                    Beta Version</a>
                                                <div className='border'></div>

                                                <a href="https://www.ubshq.com/contact_us" target="_blank" className="px-4 py-2 hover:bg-gray-100  text-left  dark:hover:bg-[#2F2F2F]  cursor-pointer">Send a feedback</a>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        {location.pathname !== '/settings' && (
                            <div
                                onClick={(e) => { e.stopPropagation(); setSettingOpen(true) }}

                                className="block p-2  rounded-[30px]  softazure:hover:text-black  dark:text-white cornflower:text-white peach:hover:text-black peach:text-white cornflower:hover:text-black lightmint:hover:text-black lightmint:text-white cursor-pointer dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60 softazure:text-white salmonpink:text-[#edf6f9] salmonpink:hover:text-[#000000] "
                            >
                                <Tippy content="Settings">
                                    <BsGear size={20} />
                                </Tippy>
                            </div>
                        )}
                        <div className="">
                            <Dropdown
                                offset={[20, 15]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-[30px] softazure:text-white softazure:hover:text-black  salmonpink:text-white salmonpink:hover:text-[#000000] peach:hover:text-black peach:text-white dark:text-white peach:text-white cornflower:text-white cornflower:hover:text-black lightmint:hover:text-black lightmint:text-white  dark:bg-dark/40 hover:text-primary  hover:bg-white-light/90 dark:hover:bg-dark/60 transition text-slate-700"
                                button={<TbGridDots size={20} />}
                            >
                                <div className="profileShadow settingAnimation  max-h-[65vh] softazure:bg-[#9a8c98] salmonpink:bg-[#006d77] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] cornflower:bg-[#6BB8C5] lightmint:bg-[#629e7c] -mt-1 w-[350px] overflow-y-auto rounded-lg shadow-lg dark:bg-[#202127] bg-[#f2f5fa]  px-2 py-2 thin-scrollbar softazure:text-white salmonpink:text-[#edf6f9] salmonpink:hover:text-[#000000]">
                                    <ul className="softazure:bg-[#f2e9e4] -mr-1 grid grid-cols-3 overflow-y-auto px-7 lightmint:bg-green-50 lightmint:text-black py-10 rounded-[10px] dark:bg-[#2F2F2F] bg-white gap-7 ">
                                        {apps.map((app, index) => (
                                            <li>
                                                <Link to={app.link}>
                                                    <div className=" transition relative w-[80px] h-[80px] rounded-lg  flex flex-col items-center px-2">
                                                        <img src={app.src} alt="account" className={app.with} />
                                                        <p className="absolute bottom-0 font-medium text-slate-700 dark:text-white">{app.title}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Dropdown>
                        </div>

                        {/* profile */}

                        <div className="dropdown shrink-0 flex">
                            <Dropdown
                                offset={[-32, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={
                                    profile?.avatar ? (
                                        // If avatar is present, render the image
                                        <img src={`data:image/*;base64,${profile.avatar}`} alt="avatar" className="w-10 h-10 border-2 border-gray-300  rounded-full object-cover" />
                                    ) : (
                                        // If no avatar, show fallback
                                        <div style={{ backgroundColor: bgColor }} className="w-10 h-10   rounded-full flex items-center justify-center text-white  font-semibold">
                                            {initial}
                                        </div>
                                    )
                                }
                            >
                                <div className="profileShadow settingAnimation softazure:bg-[#f2e9e4] dark:border-[#1b2e4b] shrink py-2 lightmint:bg-green-50 lightmint:text-black dark:bg-[#2F2F2F] dark:text-white w-[350px] px-3 rounded-xl bg-white ">
                                    <h3 className="text-center py-2  text-slate-800   dark:text-white">{userId?.email}</h3>
                                    <div className="w-full flex pt-2 justify-center">
                                        {profile?.avatar ? (
                                            <img src={`data:image/*;base64,${profile.avatar}`} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
                                        ) : (
                                            <div style={{ backgroundColor: bgColor }} className="rounded-full text-white text-4xl w-20 h-20 flex items-center justify-center">
                                                {initial}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-center py-1 text-slate-800 dark:text-white text">Hey, {userId?.first_name}!</p>

                                    <div className='w-full px-2 mt-2'>
                                        <div className='flex items-center justify-between relative'>
                                            <h3 className='tracking-wide font-semibold'>Other accounts</h3>
                                            <button className='hover:bg-gray-200  w-7 justify-center flex items-center h-7 rounded-full ' onClick={(e) => {
                                                e.stopPropagation(),
                                                    setUserOption(!userOption)
                                            }}><HiOutlineDotsVertical size={16} /></button>
                                            {
                                                userOption && (
                                                    <div className='absolute right-3 profileShadow settingAnimation top-7 w-64 z-40 border-[1px] border-gray-100 bg-white  rounded-md'>
                                                        <div className='flex flex-col justify-start items-start'>
                                                            <button className='hover:bg-gray-100 w-full py-3 px-3 text-start flex items-center'>
                                                                <RiLogoutBoxRLine size={17} className='mr-2' />

                                                                Log out of all devices</button>
                                                            <button className='hover:bg-gray-100 w-full py-3 px-3 text-start flex items-center'>
                                                                <HiPlus size={17} className='mr-2' />
                                                                Add account</button>
                                                        </div>
                                                    </div>

                                                )
                                            }
                                        </div>

                                        <div className='pt-3 w-full space-y-2'>
                                            <div className='flex   items-center transition py-1 px-1 hover:bg-gray-200 bg-white shadow  rounded-lg'>
                                                <div className='mr-2'>
                                                    {profile?.avatar ? (
                                                        <img src={`data:image/*;base64,${profile.avatar}`} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                                                    ) : (
                                                        <div style={{ backgroundColor: bgColor }} className="rounded-full text-white text-xl w-7 h-7 flex items-center justify-center">
                                                            {initial}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='w-full '>
                                                    <div className=" flex justify-between items-center w-full">
                                                        <h6 className='leading-4'>{userId?.first_name} <span className='block text-gray-500'>{userId?.email}</span></h6>
                                                        <h2 className='text-green-950 bg-green-100 text-[12px] h-5 px-2 rounded-md'>Default</h2>
                                                    </div>



                                                </div>
                                            </div>
                                            <div className='flex   items-center transition py-1 px-1 hover:bg-gray-200 bg-white shadow  rounded-lg'>
                                                <div className='mr-2'>
                                                    {profile?.avatar ? (
                                                        <img src={`data:image/*;base64,${profile.avatar}`} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                                                    ) : (
                                                        <div style={{ backgroundColor: bgColor }} className="rounded-full text-white text-xl w-7 h-7 flex items-center justify-center">
                                                            {initial}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='w-full '>
                                                    <div className=" flex justify-between items-center w-full">
                                                        <h6 className='leading-4'>{userId?.first_name} <span className='block text-gray-500'>{userId?.email}</span></h6>
                                                        <h2 className='text-green-950 bg-green-100 text-[12px] h-5 px-2 rounded-md'>Default</h2>
                                                    </div>



                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className=" flex py-2 gap-2 mt-3">
                                        <button className=" py-2  hover:bg-[#DCDCDC] lightmint:bg-[#629e7c] lightmint:text-white hover:shadow-md dark:bg-[#202127] transition bg-[#e9eef6] py- w-full  dark:border-[#1b2e4b] rounded-md justify-center flex items-center gap-  font-medium text-slate-800 dark:text-white " onClick={() => navigate('../auth/boxed-signin')}>
                                            <span className=" rounded-full bg-[#e9eef6] lightmint:bg-[#629e7c]  dark:bg-[#202127]">
                                                <HiPlus size={17} className='mr-1' />
                                            </span>
                                            Add Account
                                        </button>

                                        <button
                                            className="py-2 hover:bg-[#DCDCDC] lightmint:bg-[#629e7c] lightmint:text-white hover:shadow-md transition bg-[#e9eef6] dark:bg-[#202127] w-full   dark:border-[#1b2e4b] rounded-md justify-center flex items-center gap-1 font-medium text-slate-800 dark:text-white "
                                            onClick={handleLogout}
                                        >
                                            <span className=" rounded-full">
                                                <RiLogoutBoxRLine size={17} />
                                            </span>
                                            Sign Out
                                        </button>
                                    </div>

                                    <div className="pb-3 text-slate-500 font-medium">
                                        <p className="text-center pt-4 dark:text-white text-[12px]">
                                            <button>Privacy Policy</button> | <button>Terms of Use</button>
                                        </p>
                                    </div>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>


            </div>
        </header>
    );
};

export default Header;
