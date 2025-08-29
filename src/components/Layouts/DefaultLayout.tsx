import { PropsWithChildren, Suspense, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App from '../../App';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import Header from './Header';
import { IoIosInformationCircleOutline, IoMdAdd } from 'react-icons/io';
import { RiArrowLeftSLine } from 'react-icons/ri';
import SideCalendar from '../../pages/Components/SideCalendar';
import MyTask from '../../pages/Components/MyTask';
import MyContact from '../../pages/Components/MyContact';
import Todo from '../../pages/Components/Todo';
import Tippy from '@tippyjs/react';
import Mailbox from '../../pages/Apps/TaskList';
import SidePanel from '../../pages/Apps/SidePanel';
import pad from '../../assets/images/ubs icons/pad.png';
import contact from '../../assets/images/ubs icons/contect.png';
import meeting from '../../assets/images/ubs icons/meet.png';
import task from '../../assets/images/UB_Logos/task-logo.png';
import calendar from '../../assets/images/ubs icons/calender.png';
import { MdFeedback, MdHelpOutline } from 'react-icons/md';
import plus from '../../assets/images/Plus.png';
import { RxCross2 } from 'react-icons/rx';
import ComposeMail from '../../pages/Components/ComposeMail';
import './defaultlayout.css';
import { useComposeEmail } from '../../useContext/ComposeEmailContext';
import { useSettings } from '@/useContext/useSettings';
import SettingComponent from '../SettingComponent';
import PageLoader from './PageLoader';
import { Outlet } from 'react-router-dom';
import TaskModalUIOnly from './TaskModalUIOnly ';
import IframeTaskView from '@/pages/Apps/IframeTaskView';
import CardModalUIOnly from './CardModalUIOnly';
import IdentityModalUIOnly from './IdentityModalUIOnly';
import PasswordGenerator from '@/pages/Apps/passwordgenerator';



const DefaultLayout = ({ children }: PropsWithChildren) => {
    const themeConfig = useSelector((state: RootState) => state.themeConfig);
    const dispatch = useDispatch();
    const [showLoader, setShowLoader] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);
    const [rightSidePanel, setRightSidePanel] = useState(true);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [taskOpen, setTaskOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [todoOpen, setTodoOpen] = useState(false);
    const [showArrowButton, setShowArrowButton] = useState(true);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [plusOpen, setPlusOpen] = useState(false);
    const { isOpen } = useComposeEmail();
    const { settingOpen, setSettingOpen } = useSettings();
    const [isIframe, setIsIframe] = useState(false);
    const [showTaskIframeUI, setShowTaskIframeUI] = useState(false);
    const isDesktop = window.innerWidth >= 1024;



    const onScrollHandler = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
    };

    const isInIframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };


    useEffect(() => {
        if (isInIframe()) setIsIframe(true);
        window.addEventListener('scroll', onScrollHandler);
        console.log(isOpen, 'From COntent');

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            screenLoader[0].classList.add('animate__fadeOut');
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

        return () => {
            window.removeEventListener('onscroll', onScrollHandler);
        };
    }, []);

    const handleSectionChange = (section: any) => {
        setSettingOpen(false);
        setOpenCalendar(false);
        setTaskOpen(false);
        setContactOpen(false);
        setTodoOpen(false);
        if (section === 'calendar') setOpenCalendar(true);
        if (section === 'task') setTaskOpen(true);
        if (section === 'contact') setContactOpen(true);
        if (section === 'todo') setTodoOpen(true);
    };

    const popupRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node) && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setAboutOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef, triggerRef, setAboutOpen]);

    useEffect(() => {
        // Simulate loading time (e.g., API call)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const { preferences } = useSettings();
    return (
        <App>
            {isIframe ? (
                <IframeTaskView onclick={function (): void {
                    throw new Error('Function not implemented.');
                } } />
            ) : loading && !preferences ? (
                <PageLoader />
            ) : (
                <div className="relative w-full overflow-hidden h-screen">
                    <div className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 z-50 lg:hidden`} onClick={() => dispatch(toggleSidebar())}></div>
                    <div className={`${themeConfig.navbar} main-container  flex text-black dark:text-white-dark`}>
                        <div className="main-content w-full min-h-screen flex">
                            {!isIframe && <SidePanel />}
                            <div className="relative w-full lightmint:bg-[#629e7c] classic:bg-[#F8FAFD] cornflower:bg-[#6BB8C5] softazure:bg-[#9a8c98] blue:bg-[#64b5f6] salmonpink:bg-[#006d77] peach:bg-[#1b2e4b] lightmint:text-black dark:bg-[#202127] overflow-hidden">
                                {!isIframe && <Header />}
                                <div className={`flex `}>
                                    <Suspense>
                                        <div className={`${themeConfig.animation} h-[100vh] relative w-full animate__animated`}><Outlet></Outlet></div>
                                        <div className=" flex  absolute right-12 ">
                                            {settingOpen && (
                                                <SettingComponent
                                                />
                                            )}

                                            <div className={`${settingOpen ? "hidden" : ""}`}>
                                                {openCalendar && (
                                                    <div className="bg-white rounded-2xl">
                                                        <SideCalendar
                                                            onclick={() => {
                                                                setShowArrowButton(true);
                                                                setOpenCalendar(false);
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {taskOpen && (
                                                    <IframeTaskView
                                                        onclick={() => {
                                                            setShowArrowButton(true);
                                                            setTaskOpen(false);
                                                        }}
                                                    />
                                                )}

                                                {contactOpen && (
                                                    <MyContact
                                                        onclick={() => {
                                                            setShowArrowButton(true);
                                                            setContactOpen(false);
                                                        }}
                                                    />
                                                )}

                                                {todoOpen && (
                                                    <Todo
                                                        onclick={() => {
                                                            setShowArrowButton(true);
                                                            setTodoOpen(false);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Suspense>

                                    {!isIframe && rightSidePanel && (
                                        <div
                                            className={`bg-white salmonpink:bg-[#006d77] peach:border-[#1b2e4b] cornflower:border-[#6BB8C5] classic:bg-[#F8FAFD] blue:bg-[#64b5f6] cornflower:bg-[#6BB8C5] lightmint:border-[#629e7c] lightmint:bg-[#629e7c] px-1 peach:bg-[#1b2e4b] py-5 dark:bg-[#202127] dark:border-[#202127] h-[100vh] flex flex-col justify-between border-l-[2px] border-gray-300  softazure:bg-[#9a8c98] softazure:border-none blue:border-none salmonpink:border-none `}
                                        >
                                            <div className="text-primary ">
                                                <div className="mb-2">
                                                    <Tippy content="JQ Calendar">
                                                        <button
                                                            className="hover:bg-[#DCDCDC] p-2 flex items-center justify-center rounded-full transition"
                                                            onClick={() => {
                                                                handleSectionChange('calendar');
                                                                setShowArrowButton(false);
                                                            }}
                                                        >
                                                            <img src={calendar} alt="" className={"w-6 rounded-md"} />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                                <div className="mb-2">
                                                    <Tippy content="JQ Pad">
                                                        <button
                                                            className="hover:bg-[#DCDCDC] p-2 rounded-full transition"
                                                            onClick={() => {
                                                                handleSectionChange('todo');
                                                                setShowArrowButton(false);
                                                            }}
                                                        >
                                                            <img src={pad} alt="" className={"w-6 rounded-md"} />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                                <div className="mb-2">
                                                    <Tippy content="JQ Task">
                                                        <button
                                                            className="hover:bg-[#DCDCDC] p-2 rounded-full transition"
                                                            onClick={() => setTaskOpen((prev) => !prev)}
                                                        >
                                                            <img src={task} alt="" className={"w-6 rounded-md"} />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                                <div className="mb-2">
                                                    <Tippy content="JQ Contact">
                                                        <button
                                                            className="hover:bg-[#DCDCDC] p-2 rounded-full transition"
                                                            onClick={() => {
                                                                handleSectionChange('contact');
                                                                setShowArrowButton(false);
                                                            }}
                                                        >
                                                            <img src={contact} alt="" className={"w-6 rounded-md"} />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                                <div className=""></div>
                                                <div className="mb-2">
                                                    <Tippy content="JQ Meeting">
                                                        <button className="hover:bg-[#DCDCDC] p-2 rounded-full transition">
                                                            <img src={meeting} alt="" className={"w-6 rounded-md"} />
                                                        </button>
                                                    </Tippy>
                                                </div>

                                                <div className="mb-2">
                                                    <Tippy content="Get Add-ons">
                                                        <button
                                                            onClick={() => setPlusOpen(!plusOpen)}
                                                            className="hover:bg-[#DCDCDC] w-full flex justify-center items-center p-2 rounded-full transition iconColor blue:text-black"
                                                        >
                                                            <img src={plus} alt="" width={20} />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </div>

                                            {plusOpen && (
                                                <div className="fixed px-56 lg:hidden py-32 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div className="w-full h-full bg-white rounded-xl shadow-lg p-4 relative">
                                                        <span onClick={() => setPlusOpen(!plusOpen)} className="cursor-pointer flex w-full justify-end ">
                                                            <RxCross2 />
                                                        </span>
                                                        <p className="text-center text-gray-800">Hello</p>
                                                    </div>
                                                </div>
                                            )}

                                            {!showArrowButton && (
                                                <div ref={triggerRef} className="flex justify-center">
                                                    <Tippy content="About">
                                                        <span onClick={() => setAboutOpen(!aboutOpen)} className="w-10 text-white dark:text-black flex items-center  pb-20 justify-center">
                                                            <IoIosInformationCircleOutline />
                                                        </span>
                                                    </Tippy>
                                                </div>
                                            )}

                                            {aboutOpen && (
                                                <div ref={popupRef} className="absolute hidden bottom-10 right-48 w-48 rounded-xl py-5 shadow-xl bg-white border border-gray-200">
                                                    <h2 className=" font-semibold text-gray-800 px-5 mb-4">UNS KEEP</h2>
                                                    <div className="flex flex-col gap-2">
                                                        <button className="flex px-5 items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 py-2 transition">
                                                            <IoIosInformationCircleOutline className="" />
                                                            About
                                                        </button>
                                                        <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-5 py-2 transition">
                                                            <MdHelpOutline className="" />
                                                            Help
                                                        </button>
                                                        <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-5 py-2 transition">
                                                            <MdFeedback className="" />
                                                            Feedback
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {showArrowButton && (
                                    <div className={`${rightSidePanel ? 'right-0' : 'right-0'} fixed bottom-2 right-1 ${settingOpen ? 'hidden' : 'right-0'}`}>
                                        <button
                                            className={`${rightSidePanel ? 'rounded-full w-[40px] h-[40px] flex items-center justify-center' : 'hover:w-[50px] rounded-l-full'
                                                } w-[30px] transition-all duration-300 bg-[#DCDCDC] shadow-md text-[#000] py-2`}
                                            onClick={() => setRightSidePanel(!rightSidePanel)}
                                        >
                                            <RiArrowLeftSLine size={23} className={`${rightSidePanel ? '-rotate-180 transition-all duration-100' : 'transition-all ml-2'}`} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <TaskModalUIOnly />
           <CardModalUIOnly />
           <IdentityModalUIOnly />
           <PasswordGenerator />
            <ComposeMail />
        </App>
    );
}



export default DefaultLayout;