import React, { useEffect, useRef, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { IoMdStarOutline } from 'react-icons/io';
import { IoArrowBack, IoCloseSharp, IoLocationOutline, IoSearch } from 'react-icons/io5';
import avatar from '../../assets/images/user.png';
import { LuUser } from 'react-icons/lu';
import { MdMailOutline, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp, MdOutlinePhone } from 'react-icons/md';
import { PiBuildingApartmentBold } from 'react-icons/pi';
import TextField from '@mui/material/TextField';
import { FaCaretDown, FaChevronDown, FaPhone, FaSearch } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { GoPlus } from 'react-icons/go';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaRegNoteSticky } from 'react-icons/fa6';
import zIndex from '@mui/material/styles/zIndex';
import { BsCake } from 'react-icons/bs';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IN', name: 'India' },
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'BE', name: 'Belgium' },
];

const regions = {
    US: [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
    ],
    CA: [
        'Alberta',
        'British Columbia',
        'Manitoba',
        'New Brunswick',
        'Newfoundland and Labrador',
        'Northwest Territories',
        'Nova Scotia',
        'Nunavut',
        'Ontario',
        'Prince Edward Island',
        'Quebec',
        'Saskatchewan',
        'Yukon',
    ],
    IN: [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal',
    ],
    GB: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    AU: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'],
};

interface MyContactProps {
    onclick: () => void;
}

function MyContact({ onclick }: MyContactProps) {
    const [addContact, setAddContact] = useState(false);
    const [value, setValue] = useState<string | undefined>('');
    const [isOpen, setIsOpen] = useState(false);
    const [namedown, setNameDown] = useState(false);
    const [companyDown, setCompanyDown] = useState(false);

    const [addAddress, setAddAddress] = useState(false);
    const [valueTextarea, setValueTextarea] = useState('');

    const [emails, setEmails] = useState(['']);
    const [phones, setPhones] = useState(['']);
    const [country, setCountry] = useState('india');
    const [state, setState] = useState('Bihar');
    // const [country, setCountry] = useState("")
    const [region, setRegion] = useState('');

    const [selectedMonth, setSelectedMonth] = useState('');
    const [day, setDay] = useState('');

    const [year, setYear] = useState('');

    const handleChangeyear = (e: any) => {
        const value = e.target.value;

        // Ensure only 4 digits are allowed for the year (yyyy format)
        if (/^\d{0,4}$/.test(value)) {
            setYear(value);
        }
    };

    const handleChangedate = (e: any) => {
        const value = e.target.value;

        // Allow only numbers and ensure the value is between 1 and 31
        if (/^\d{0,2}$/.test(value)) {
            if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
                setDay(value);
            }
        }
    };

    const handleMonthChange = (event: any) => {
        setSelectedMonth(event.target.value);
    };

    // countrt picker

    const handleSetCountry = (country: string) => setCountry(country);

    const handleSetState = (e: any, value: any) => setState(value);

    //add phone button

    const handlePhoneChange = (phoneNumber: string, index: number) => {
        const newPhones = [...phones];
        newPhones[index] = phoneNumber;
        setPhones(newPhones);
    };

    const addPhoneField = () => {
        setPhones([...phones, '']);
    };

    const removePhoneField = (index: number) => {
        const newPhones = phones.filter((_, i) => i !== index);
        setPhones(newPhones);
    };

    // email add button

    const handleEmailChange = (e: any, index: number) => {
        const newEmails = [...emails];
        newEmails[index] = e.target.value;
        setEmails(newEmails);
    };

    const addEmailField = () => {
        setEmails([...emails, '']); // Add a new empty email input field
    };

    const removeEmailField = (index: number) => {
        const newEmails = emails.filter((_, i) => i !== index);
        setEmails(newEmails);
    };

    const handleChange = (e: any) => {
        setValueTextarea(e.target.value);
    };

    const handleInput = (e: any) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const divRef = useRef(null);

    // Open DatePicker when clicking anywhere in the div
    const handleDivClick = () => {
        setIsOpen(true);
    };

    const handleCountryChange = (e: any) => {
        const selectedCountry = e.target.value;
        setCountry(selectedCountry);
        setRegion(''); // Reset region when country changes
    };

    const handleRegionChange = (e: any) => {
        setRegion(e.target.value);
    };

    // const AnyCountryDropdown = CountryDropdown as any;

     const ref = useRef<HTMLDivElement>(null);
    
    
        useEffect(() => {
            const handler = (e:any) => {
                if (ref.current && !ref.current.contains(e.target)) onclick();
            };
            document.addEventListener("mousedown", handler);
            return () => document.removeEventListener("mousedown", handler);
        }, []);

    return (
        <div ref={ref} className="lg:w-72 h-[90vh] bg-gray-100 rounded-2xl py-3 settingAnimation">
            <div className={addContact ? 'hidden' : ''}>
                <div className="flex items-center px-4  justify-between">
                    <div>
                        <h1 className="textMedium text-xl ">Contacts</h1>
                    </div>
                    <div className="fleax gap-1">
                        <button className="hover:bg-[#DCDCDC] transition rounded-full p-2">
                            <IoSearch size={20} />
                        </button>
                        <button className="hover:bg-[#DCDCDC] transition rounded-full p-2">
                            <FiExternalLink size={20} />
                        </button>
                        <button onClick={onclick} className="hover:bg-[#DCDCDC] transition rounded-full p-2">
                            <IoCloseSharp size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center h-[80vh]">
                    <h1 className="textMedium text-xl">No contact yet</h1>
                    <p className="textMedium py-8 text-[15px] text-center">Contacts makes your contacts organized and clutter-free so you never lose touch</p>
                    <button
                        className="textMedium flex items-center justify-center transition hover:shadow-md  text-white bg-[#2565C7] px-4 py-3 rounded-full "
                        onClick={() => setAddContact(!addContact)}
                    >
                        <HiOutlinePlusSm size={18} className="mr-1" /> Create contact
                    </button>
                </div>
            </div>

            {/* after adding contact */}
            {addContact && (
                <div>
                    <div className="flex overflow-y-auto  px-3    items-center justify-between">
                        <div>
                            <button>
                                <IoArrowBack size={20} />
                            </button>
                        </div>
                        <div className="flex items-center">
                            <button>
                                <IoMdStarOutline size={20} />
                            </button>
                            <button className="mx-2 textMedium flex items-center justify-center transition hover:shadow-md  bg-[#2565C7] text-white px-5 py-2 rounded-full ">Save</button>
                            <button onClick={onclick}>
                                <IoCloseSharp size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="h-[80vh] px-2  overflow-y-auto thin-scrollbar ">
                        <div className="flex items-center justify-center w-full pt-10">
                            <img src={avatar} alt="" className="w-24" />
                        </div>
                        <form className="mt-5 flex flex-col items-center gap-8">
                            {/* First Name and Last Name */}
                            <div className="w-full max-w-md flex flex-col gap-4">
                                <div className="flex gap-2 ml-1 items-center">
                                    <LuUser size={24} className="text-gray-500" />
                                    <TextField label="First name" variant="outlined" fullWidth size="small" />

                                    <div className=" w-8 h-8 rounded-full">
                                        {namedown ? (
                                            <MdOutlineKeyboardArrowUp onClick={() => setNameDown(!namedown)} className="text-xl" />
                                        ) : (
                                            <MdOutlineKeyboardArrowDown onClick={() => setNameDown(!namedown)} className="text-xl" />
                                        )}
                                    </div>
                                </div>
                                {namedown && (
                                    <div className="px-8 flex flex-col gap-4">
                                        <TextField label="First name" variant="outlined" fullWidth size="small" />
                                        <TextField label="Middle name" variant="outlined" fullWidth size="small" />
                                        <TextField label="Last name" variant="outlined" fullWidth size="small" />
                                        <TextField label="Suffix" variant="outlined" fullWidth size="small" />
                                        <TextField label="Phonetic first" variant="outlined" fullWidth size="small" />
                                        <TextField label="Phonetic middle" variant="outlined" fullWidth size="small" />
                                        <TextField label="Phonetic last" variant="outlined" fullWidth size="small" />
                                        <TextField label="Nickname" variant="outlined" fullWidth size="small" />
                                        <TextField label="File ass" variant="outlined" fullWidth size="small" />
                                    </div>
                                )}

                                <div className={`${namedown ? 'hidden' : ''} flex gap-3 mr-7 items-center`}>
                                    <LuUser size={24} className="invisible" />
                                    <TextField label="Lastname" variant="outlined" fullWidth size="small" />
                                </div>
                            </div>

                            {/* Company and Job Title */}
                            <div className="w-full max-w-md -mt-3 flex flex-col gap-4">
                                <div className="flex gap-3   items-center">
                                    <PiBuildingApartmentBold size={24} className="text-gray-500 " />

                                    <TextField label="Company" variant="outlined" className="" fullWidth size="small" />

                                    <div className=" w-8 -ml-2 rounded-full  items-center flex justify-center h-7 ">
                                        {companyDown ? (
                                            <MdOutlineKeyboardArrowUp onClick={() => setCompanyDown(!companyDown)} className="text-xl" />
                                        ) : (
                                            <MdOutlineKeyboardArrowDown onClick={() => setCompanyDown(!companyDown)} className="text-xl" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 mr-7 items-center">
                                    <PiBuildingApartmentBold size={24} className="invisible" />

                                    <TextField label="Job Title" variant="outlined" fullWidth size="small" />
                                </div>

                                {companyDown && (
                                    <div className="px-8">
                                        <TextField label="Department" variant="outlined" fullWidth size="small" />
                                    </div>
                                )}
                            </div>

                            <div className=" w-full -mt-3 flex flex-col gap-5">
                                {/* Email */}

                                <div>
                                    {emails.map((email, index) => (
                                        <div key={index} className="w-full justify-center max-w-md flex items-center gap-3 mb-3">
                                            <MdMailOutline size={24} className="text-gray-500" />
                                            <div className="w-full group  flex items-center gap-2">
                                                <TextField label="Email" variant="outlined" fullWidth size="small" value={email} onChange={(e) => handleEmailChange(e, index)} />
                                                <button type="button" onClick={() => removeEmailField(index)} className="text-gray-400 w-7 h-7      hover:text-gray-600">
                                                    <RxCross2 className="hidden group-hover:block" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-center mb-4">
                                        <button
                                            onClick={addEmailField}
                                            type="button"
                                            className="px-12 py-2 flex justify-center items-center gap-2 border border-gray-300 rounded-full bg-[#2565C7] text-white font-semibold hover:shadow-md transition"
                                        >
                                            <GoPlus /> Add Email
                                        </button>
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="-mt-4">
                                    {phones.map((phone, index) => (
                                        <div key={index} className="w-full justify-center max-w-md flex items-center gap-2 mb-3">
                                            <FaPhone size={24} className="text-gray-500 rotate-90" />
                                            <div className="w-full flex group items-center gap-2">
                                                <PhoneInput
                                                    placeholder="Enter phone number"
                                                    className="w-full py-2 pl-2 border  rounded-md bg-transparent focus:outline-none  focus:border-transparent focus:ring-1 focus:ring-border-transparent "
                                                    value={phone}
                                                    defaultCountry="IN"
                                                    onChange={(value) => {
                                                        const newPhones = [...phones];
                                                        newPhones[index] = value || '';
                                                        setPhones(newPhones);
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.outline = 'none';
                                                        e.target.style.boxShadow = '0 0 0 2px rgba(37, 101, 199, 0.5)';
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoneField(index)}
                                                    className="text-gray-400 h-7 w-7 hover:text-gray-600 transition-colors"
                                                    aria-label="Remove phone number"
                                                >
                                                    <RxCross2 className="hidden group-hover:block" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-center mb-4">
                                        <button
                                            onClick={addPhoneField}
                                            type="button"
                                            className="px-12 py-2 flex justify-center items-center gap-2 border border-gray-300 rounded-full bg-[#2565C7] text-white font-semibold hover:shadow-md transition"
                                        >
                                            <GoPlus /> Add Phone
                                        </button>
                                    </div>
                                </div>

                                {/* Add Address */}

                                {addAddress && (
                                    <div className="flex flex-col">
                                        <div className="flex  px-3 ml-5 gap-2">
                                            <select
                                                value={country}
                                                onChange={handleCountryChange}
                                                className="px-4 py-2.5 border w-full border-gray-300 rounded-[4px] text-gray-600 focus:outline-none  text-sm"
                                            >
                                                <option value="">Select Country</option>
                                                {countries.map((country) => (
                                                    <option key={country.code} value={country.code}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button onClick={() => setAddAddress(!addAddress)} type="button" className="text-gray-400 hover:text-gray-600 ">
                                                <RxCross2 />
                                            </button>
                                        </div>
                                        <div className="px-8 pt-5 flex flex-col gap-4">
                                            <TextField label="Street address" variant="outlined" fullWidth size="small" />
                                            <TextField label="Street address line" variant="outlined" fullWidth size="small" />
                                            <TextField label="City" variant="outlined" fullWidth size="small" />
                                            <TextField label="Pincode" variant="outlined" fullWidth size="small" />
                                            <div className="flex gap-2">
                                                <select
                                                    value={region}
                                                    onChange={handleRegionChange}
                                                    disabled={!country || !regions[country as keyof typeof regions]}
                                                    className="px-4 py-2.5 border border-gray-300 w-full rounded-[4px]  text-gray-700 focus:outline-none  text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                >
                                                    <option value="">Select State/Region</option>
                                                    {country &&
                                                        regions[country as keyof typeof regions] &&
                                                        regions[country as keyof typeof regions].map((region: any) => (
                                                            <option key={region} value={region}>
                                                                {region}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                            <TextField label="PO Box" variant="outlined" fullWidth size="small" />
                                            <TextField label="Label" variant="outlined" fullWidth size="small" />
                                        </div>
                                    </div>
                                )}

                                <div className=" flex -mt-3  justify-center max-w-md">
                                    <button
                                        onClick={() => setAddAddress(!addAddress)}
                                        type="button"
                                        className="px-11 py-2 flex justify-center items-center gap-2 border border-gray-300 rounded-full bg-[#2565C7] text-white font-semibold hover:shadow-md transition"
                                    >
                                        <IoLocationOutline /> Add Address
                                    </button>
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div className="flex w-full items-center gap-8 justify-center">
                                {/* Month Selector */}
                                <div className="relative">
                                    <div className="flex items-center gap-3">
                                        <BsCake className="text-lg text-indigo-600" />
                                        <select
                                            id="month"
                                            value={selectedMonth}
                                            onChange={handleMonthChange}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        >
                                            <option value="">Month</option>
                                            {months.map((month, index) => (
                                                <option key={index} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Day Input */}
                                <div className="relative">
                                    <input
                                        id="day"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="DD"
                                        maxLength={2}
                                        className="w-14 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                                    />
                                </div>
                            </div>

                          
                                <div className="max-w-md px-5 mx-auto">
                                    <TextField
                                        label="Year"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        onChange={handleChange}
                                        placeholder="YYYY"
                                        inputProps={{
                                            maxLength: 4, // Ensures only 4 digits can be entered
                                        }}
                                        className="bg-white border border-gray-300 rounded-lg"
                                    />
                                </div>
                           

                            {/* Notes */}

                            <div className="w-full max-w-md -mt-3 mr-4 flex items-start gap-3 px-4 p-3">
                                <FaRegNoteSticky size={24} className="text-gray-500 mt-1" />
                                <TextField
                                    label="Notes"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    onChange={handleChange}
                                    onInput={handleInput}
                                    multiline
                                    minRows={3}
                                    InputProps={{
                                        style: {
                                            padding: '10px',
                                        },
                                    }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyContact;
