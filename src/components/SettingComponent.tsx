import React, { useEffect, useRef, useState } from 'react';
import { Switch } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSettings } from '@/useContext/useSettings';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '@/store/themeConfigSlice';
import { Toaster } from 'sonner';
import Tippy from '@tippyjs/react';

// ✅ Add these imports if you're using shadcn/ui or similar UI lib

const SettingComponent = () => {
    const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
    const [betaAccess, setBetaAccess] = useState(true);

    const dispatch = useDispatch();
    const { settingOpen, setSettingOpen, preferences, toggleAndUpdatePreference, updatePreferences, submitUpdatedPreferences } = useSettings();

    const handleThemeChange = (themeKey: string) => {
        toggleAndUpdatePreference('Theme', themeKey);
        dispatch(toggleTheme(themeKey));
    };
    console.log("check the font size in prefrences",preferences?.FontSize);
    
    const ref = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handler = (e:any) => {
            if (ref.current && !ref.current.contains(e.target)) setSettingOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const themes = [
        { key: 'Light', name: 'JQ', color: 'bg-white', bgcolor: "bg-[#133466]", text: 'text-gray-800' },
        { key: 'Dark', name: 'Dark', color: 'bg-[#2F2F2F]', bgcolor: "bg-[#202127]", text: 'text-gray-900' },
        { key: 'Classic', name: 'Classic', color: 'bg-gray-300', bgcolor: "bg-[#F8FAFD]", text: 'text-gray-800' },
        { key: 'Blue', name: 'Pale Sky Blue', color: 'bg-[#ACD8FC]', bgcolor: "bg-[#64b5f6]", text: 'text-gray-800' },
        { key: 'Peach', name: 'Dark Blue', color: 'bg-gray-200', bgcolor: "bg-[#1b2e4b]", text: 'text-gray-800' },
        { key: 'Softazu', name: 'Dusty Lavender', color: 'bg-gray-400', bgcolor: "bg-[#9a8c98]", text: 'text-gray-800' },
        { key: 'Lightmint', name: 'Light Green', color: 'bg-[#8ECEAA]', bgcolor: "bg-[#629e7c]", text: 'text-gray-800' },
        { key: 'Cornflower', name: 'Corn Blue', color: 'bg-gray-200', bgcolor: "bg-[#6BB8C5]", text: 'text-gray-800' },
        { key: 'Salmonpink', name: 'Deep Teal', color: 'bg-gray-100', bgcolor: "bg-[#005960]", text: 'text-gray-800' },
    ];

    return (
        <div ref={ref}
            className=" px-2 w-72 h-[90vh] py-2 rounded-2xl shadow-2xl  overflow-hidden  settingAnimation text-black bg-white dark:bg-[#2F2F2F]    
      blue:text-gray-800 space-y-2"
        >
            <div className="flex  justify-between text-lg font-medium text-black dark:text-white -mt-2 py-2 items-center">
                <h2>Settings</h2>
                <button onClick={() => setSettingOpen(!settingOpen)} className="text-gray-500  hover:bg-white-light/90   hover:text-black p-2 rounded-full dark:hover:text-black transition">
                    <XMarkIcon className="w-4" />
                </button>
            </div>

            <div className=" h-[80vh] overflow-y-auto thin-scrollbar  pr-2 -mr-2">
                <Link to="/settings">
                    <button
                        className="
          w-full py-1.5 rounded-md 
          bg-[#2565C7] text-white hover:bg-[#174ea6]  lightmint:bg-[#629e7c]
          peach:bg-[#1b2e4b] dark:bg-[#333] peach:text-gray-100 
          salmonpink:bg-[#005960] softazure:bg-[#8c7a88] blue:bg-[#4ea3e6] cornflower:bg-[#6BB8C5]
          transition"
                    >
                        All settings
                    </button>
                </Link>

                {/* <button className="
        w-full border border-gray-300 py-2 rounded-md 
        hover:bg-gray-100 dark:hover:bg-[#333] 
        peach:hover:bg-[#2c3e50] salmonpink:hover:bg-[#005960] 
        softazure:hover:bg-[#8c7a88] blue:hover:bg-[#4ea3e6] 
        transition"
      >
        Get the UB Mail apps
      </button> */}

                {/* <button className="
        w-full border border-gray-300 py-2 rounded-md 
        hover:bg-gray-100 dark:hover:bg-[#333] 
        peach:hover:bg-[#2c3e50] salmonpink:hover:bg-[#005960] 
        softazure:hover:bg-[#8c7a88] blue:hover:bg-[#4ea3e6] 
        transition"
      >
        Introduction
      </button> */}

                {/* <div className="flex  justify-between dark:text-white py-3 text-black items-center">
                    <span>Keyboard shortcuts</span>
                    <div className="relative inline-block w-11 h-6">
                        <input
                            type="checkbox"
                            className="peer appearance-none w-full h-full bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 focus:outline-none  checked:bg-blue-600"

                            id="toggle"
                        />
                        <label
                            htmlFor="toggle"
                            className="absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 peer-checked:translate-x-5"
                        ></label>
                    </div>
                </div> */}

                <div className='pt-5' >
                    <div className="text-sm py-1  flex justify-between font-medium dark:text-white text-black mb-4"><p>Theme </p>

                        <p className='text-[14px] bg-blue-100 text-blue-600 py-0.5 px-1.5 rounded-lg'>{preferences?.Theme || 'Default'}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 px-1.5 py-2 mb-3">
                        {themes.map((theme) => (
                            <Tippy key={theme.key} content={theme.name}>
                                <div
                                    onClick={() => handleThemeChange(theme.key)}
                                    className={`
          cursor-pointer transition-all duration-200
          ${preferences?.Theme === theme.key ?
                                            'ring-1 ring-offset-1 w-20 rounded-xl ring-[#2565C7] scale-105' :
                                            'opacity-90 hover:opacity-100 hover:scale-[1.02]'}
          
        `}
                                >
                                    <div className={`w-18 h-12 rounded-xl shadow-md flex overflow-hidden ${theme.color}`}>
                                       
                                        <div className={`w-1/3 p-1 flex flex-col items-center gap-1 rounded-l-xl ${theme.bgcolor}`}>
                                            {/* Status Lights - more polished version */}
                                            <div className="w-full h-1 bg-gray-800 rounded-full"></div>
                                            <div className="w-full h-1 bg-gray-300 rounded-full"></div>
                                            <div className="w-full h-1 border border-gray-500 rounded-full"></div>
                                            <div className="w-5 h-1 bg-black rounded-full"></div>
                                            <div className="w-2 h-1 bg-white rounded-full"></div>
                                            <div className="w-5 h-1 bg-gray-200 rounded-full"></div>
                                        </div>
                                        
                                        <div className="flex-1 p-1 flex flex-col">
                                            <div className="h-2 w-6 bg-gray-400 rounded-sm self-end"></div>
                                            <div className="mt-1 h-1 w-full bg-gray-300 rounded-sm"></div>
                                            <div className="mt-1 h-1 w-3/4 bg-gray-200 rounded-sm"></div>
                                        </div>
                                    </div>
                                    {/* {preferences?.Theme === theme.key && (
          <div className="text-center mt-1 text-xs font-medium text-gray-700 dark:text-gray-200">
            {theme.name}
          </div>
        )} */}
                                </div>
                            </Tippy>
                        ))}
                    </div>
                </div>

                {/* Font Preferences */}
                <div className="space-y-2 ">
                    <label htmlFor="font-family" className="block text-sm font-medium text-black dark:text-gray-200 lightmint:text-gray-900">
                        Font Family
                    </label>
                    <select
                        id="font-family"
                        value={preferences?.FontFamily}
                        onChange={(e) => toggleAndUpdatePreference('FontFamily', e.target.value)}
                        className="w-full border border-gray-300 rounded-md text-black dark:text-white p-2  dark:bg-transparent text-sm"
                    >
                        <option className="text-black" value="latoLight">
                            Lato
                        </option>
                        <option className="text-black" value="sans">
                            Sans-serif
                        </option>
                        <option className="text-black" value="serif">
                            Serif
                        </option>
                        <option className="text-black" value="mono">
                            Monospace
                        </option>
                        <option className="text-black" value="arial">
                            Arial
                        </option>
                        <option className="text-black" value="cursive">
                            Cursive
                        </option>
                        <option className="text-black" value="OpenDyslexic">
                            OpenDyslexic
                        </option>
                    </select>
                </div>

                <div className="space-y-2 pt-3">
                    <label htmlFor="font-size" className="block text-sm font-medium text-black dark:text-gray-200 lightmint:text-gray-900">
                        Font Size
                    </label>
                    <select
                        id="font-size"
                        value={preferences?.FontSize}
                        onChange={(e) => updatePreferences('FontSize', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-black bg-white dark:bg-transparent dark:text-white text-sm dark:border-gray-700"
                    >
                        <option className="dark:text-black" value="small">
                            Small
                        </option>
                        <option className="dark:text-black" value="medium">
                            Medium
                        </option>
                        <option className="dark:text-black" value="large">
                            Large
                        </option>
                    </select>
                </div>

                {/* <div className='space-y-2 py-5'>
                   <Link to='/' >
                        <div className='text-center text-gray-500 dark:text-white text-[13px]'>
                            <h3>Configure UB Mail as your primary <br /> Email Client.</h3>
                            <h3>Activate desktop alerts.</h3>

                        </div>

                   </Link>
                </div> */}
            </div>
        </div>
    );
};

export default SettingComponent;
