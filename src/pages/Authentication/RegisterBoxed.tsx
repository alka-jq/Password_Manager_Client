import PageLoader from '@/components/Layouts/PageLoader';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import countries from 'world-countries';
import emailicon from '../../assets/images/icons_bg_remove/15-removebg-preview.png';
import { useAuth } from '../../useContext/AppState';
PageLoader;

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface UserRegister {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    mobile: string;
    dob: string;
}

interface Country {
    name: string;
    code: string;
}

const languages = [
    { code: 'ab', name: 'Аҧсуа' }, // Abkhazian
    { code: 'aa', name: 'Afaraf' }, // Afar
    { code: 'af', name: 'Afrikaans' }, // Afrikaans
    { code: 'ak', name: 'Akan' }, // Akan
    { code: 'sq', name: 'Shqip' }, // Albanian
    { code: 'am', name: 'አማርኛ' }, // Amharic
    { code: 'ar', name: 'العربية' }, // Arabic
    { code: 'an', name: 'Aragonés' }, // Aragonese
    { code: 'hy', name: 'Հայերեն' }, // Armenian
    { code: 'as', name: 'অসমীয়া' }, // Assamese
    { code: 'av', name: 'авар мацӀ' }, // Avaric
    { code: 'ae', name: 'avesta' }, // Avestan
    { code: 'ay', name: 'aymar aru' }, // Aymara
    { code: 'az', name: 'azərbaycan dili' }, // Azerbaijani
    { code: 'bm', name: 'bamanankan' }, // Bambara
    { code: 'ba', name: 'башҡорт теле' }, // Bashkir
    { code: 'eu', name: 'euskara' }, // Basque
    { code: 'be', name: 'беларуская мова' }, // Belarusian
    { code: 'bn', name: 'বাংলা' }, // Bengali
    { code: 'bh', name: 'भोजपुरी' }, // Bihari languages
    { code: 'bi', name: 'Bislama' }, // Bislama
    { code: 'bs', name: 'bosanski jezik' }, // Bosnian
    { code: 'br', name: 'brezhoneg' }, // Breton
    { code: 'bg', name: 'български език' }, // Bulgarian
    { code: 'my', name: 'ဗမာစာ' }, // Burmese
    { code: 'ca', name: 'català' }, // Catalan
    { code: 'ch', name: 'Chamoru' }, // Chamorro
    { code: 'ce', name: 'нохчийн мотт' }, // Chechen
    { code: 'ny', name: 'chiCheŵa' }, // Chichewa
    { code: 'zh', name: '中文' }, // Chinese
    { code: 'zh-CN', name: '中文 (简体)' }, // Chinese (Simplified)
    { code: 'zh-TW', name: '中文 (繁體)' }, // Chinese (Traditional)
    { code: 'cv', name: 'чӑваш чӗлхи' }, // Chuvash
    { code: 'kw', name: 'Kernewek' }, // Cornish
    { code: 'co', name: 'corsu' }, // Corsican
    { code: 'cr', name: 'ᓀᐦᐃᔭᐍᐏᐣ' }, // Cree
    { code: 'hr', name: 'hrvatski jezik' }, // Croatian
    { code: 'cs', name: 'čeština' }, // Czech
    { code: 'da', name: 'dansk' }, // Danish
    { code: 'dv', name: 'ދިވެހި' }, // Divehi
    { code: 'nl', name: 'Nederlands' }, // Dutch
    { code: 'dz', name: 'རྫོང་ཁ' }, // Dzongkha
    { code: 'en', name: 'English' }, // English
    { code: 'en-AU', name: 'English (Australia)' }, // English (Australia)
    { code: 'en-CA', name: 'English (Canada)' }, // English (Canada)
    { code: 'en-GB', name: 'English (United Kingdom)' }, // English (United Kingdom)
    { code: 'en-US', name: 'English (United States)' }, // English (United States)
    { code: 'eo', name: 'Esperanto' }, // Esperanto
    { code: 'et', name: 'eesti' }, // Estonian
    { code: 'ee', name: 'Eʋegbe' }, // Ewe
    { code: 'fo', name: 'føroyskt' }, // Faroese
    { code: 'fj', name: 'vosa Vakaviti' }, // Fijian
    { code: 'fi', name: 'suomi' }, // Finnish
    { code: 'fr', name: 'français' }, // French
    { code: 'fr-CA', name: 'français (Canada)' }, // French (Canada)
    { code: 'fr-FR', name: 'français (France)' }, // French (France)
    { code: 'ff', name: 'Fulfulde' }, // Fulah
    { code: 'gl', name: 'Galego' }, // Galician
    { code: 'ka', name: 'ქართული' }, // Georgian
    { code: 'de', name: 'Deutsch' }, // German
    { code: 'de-AT', name: 'Deutsch (Österreich)' }, // German (Austria)
    { code: 'de-DE', name: 'Deutsch (Deutschland)' }, // German (Germany)
    { code: 'de-CH', name: 'Deutsch (Schweiz)' }, // German (Switzerland)
    { code: 'el', name: 'Ελληνικά' }, // Greek
    { code: 'gn', name: "Avañe'ẽ" }, // Guarani
    { code: 'gu', name: 'ગુજરાતી' }, // Gujarati
    { code: 'ht', name: 'Kreyòl ayisyen' }, // Haitian Creole
    { code: 'ha', name: 'هَوُسَ' }, // Hausa
    { code: 'he', name: 'עברית' }, // Hebrew
    { code: 'hz', name: 'Otjiherero' }, // Herero
    { code: 'hi', name: 'हिन्दी' }, // Hindi
    { code: 'ho', name: 'Hiri Motu' }, // Hiri Motu
    { code: 'hu', name: 'magyar' }, // Hungarian
    { code: 'ia', name: 'Interlingua' }, // Interlingua
    { code: 'id', name: 'Bahasa Indonesia' }, // Indonesian
    { code: 'ie', name: 'Interlingue' }, // Interlingue
    { code: 'ga', name: 'Gaeilge' }, // Irish
    { code: 'ig', name: 'Asụsụ Igbo' }, // Igbo
    { code: 'ik', name: 'Iñupiaq' }, // Inupiaq
    { code: 'io', name: 'Ido' }, // Ido
    { code: 'is', name: 'Íslenska' }, // Icelandic
    { code: 'it', name: 'Italiano' }, // Italian
    { code: 'iu', name: 'ᐃᓄᒃᑎᑐᑦ' }, // Inuktitut
    { code: 'ja', name: '日本語' }, // Japanese
    { code: 'jv', name: 'basa Jawa' }, // Javanese
    { code: 'kl', name: 'kalaallisut' }, // Kalaallisut
    { code: 'kn', name: 'ಕನ್ನಡ' }, // Kannada
    { code: 'kr', name: 'Kanuri' }, // Kanuri
    { code: 'ks', name: 'कश्मीरी' }, // Kashmiri
    { code: 'kk', name: 'қазақ тілі' }, // Kazakh
    { code: 'km', name: 'ខ្មែរ' }, // Khmer
    { code: 'ki', name: 'Gĩkũyũ' }, // Kikuyu
    { code: 'rw', name: 'Ikinyarwanda' }, // Kinyarwanda
    { code: 'ky', name: 'Кыргызча' }, // Kirghiz
    { code: 'kv', name: 'коми кыв' }, // Komi
    { code: 'kg', name: 'Kikongo' }, // Kongo
    { code: 'ko', name: '한국어' }, // Korean
    { code: 'ku', name: 'Kurdî' }, // Kurdish
    { code: 'kj', name: 'Kuanyama' }, // Kuanyama
    { code: 'la', name: 'lingua latina' }, // Latin
    { code: 'lb', name: 'Lëtzebuergesch' }, // Luxembourgish
    { code: 'lg', name: 'Luganda' }, // Ganda
    { code: 'li', name: 'Limburgs' }, // Limburgan
    { code: 'ln', name: 'Lingála' }, // Lingala
    { code: 'lo', name: 'ພາສາລາວ' }, // Lao
    { code: 'lt', name: 'lietuvių kalba' }, // Lithuanian
    { code: 'lu', name: 'Kiluba' }, // Luba-Katanga
    { code: 'lv', name: 'latviešu valoda' }, // Latvian
    { code: 'gv', name: 'Gaelg' }, // Manx
    { code: 'mk', name: 'македонски јазик' }, // Macedonian
    { code: 'mg', name: 'fiteny malagasy' }, // Malagasy
    { code: 'ms', name: 'Bahasa Melayu' }, // Malay
    { code: 'ml', name: 'മലയാളം' }, // Malayalam
    { code: 'mt', name: 'Malti' }, // Maltese
    { code: 'mi', name: 'te reo Māori' }, // Maori
    { code: 'mr', name: 'मराठी' }, // Marathi
    { code: 'mh', name: 'Kajin M̧ajeļ' }, // Marshallese
    { code: 'mn', name: 'Монгол хэл' }, // Mongolian
    { code: 'na', name: 'Dorerin Naoero' }, // Nauru
    { code: 'nv', name: 'Diné bizaad' }, // Navajo
    { code: 'nd', name: 'isiNdebele' }, // North Ndebele
    { code: 'ne', name: 'नेपाली' }, // Nepali
    { code: 'ng', name: 'Owambo' }, // Ndonga
    { code: 'nb', name: 'Norsk bokmål' }, // Norwegian Bokmål
    { code: 'nn', name: 'Norsk nynorsk' }, // Norwegian Nynorsk
    { code: 'no', name: 'Norsk' }, // Norwegian
    { code: 'ii', name: 'ꆈꌠ꒿' }, // Sichuan Yi
    { code: 'nr', name: 'isiNdebele' }, // South Ndebele
    { code: 'oc', name: 'occitan' }, // Occitan
    { code: 'oj', name: 'ᐊᓂᔑᓈᐯᒧᐎᓐ' }, // Ojibwa
    { code: 'cu', name: 'ѩзыкъ словѣньскъ' }, // Church Slavic
    { code: 'om', name: 'Afaan Oromoo' }, // Oromo
    { code: 'or', name: 'ଓଡ଼ିଆ' }, // Oriya
    { code: 'os', name: 'ирон æвзаг' }, // Ossetian
    { code: 'pa', name: 'ਪੰਜਾਬੀ' }, // Punjabi
    { code: 'pi', name: 'पाऴि' }, // Pali
    { code: 'fa', name: 'فارسی' }, // Persian
    { code: 'pl', name: 'język polski' }, // Polish
    { code: 'ps', name: 'پښتو' }, // Pashto
    { code: 'pt', name: 'Português' }, // Portuguese
    { code: 'pt-BR', name: 'Português (Brasil)' }, // Portuguese (Brazil)
    { code: 'pt-PT', name: 'Português (Portugal)' }, // Portuguese (Portugal)
    { code: 'qu', name: 'Runa Simi' }, // Quechua
    { code: 'rm', name: 'rumantsch grischun' }, // Romansh
    { code: 'rn', name: 'Ikirundi' }, // Rundi
    { code: 'ro', name: 'Română' }, // Romanian
    { code: 'ru', name: 'русский' }, // Russian
    { code: 'sa', name: 'संस्कृतम्' }, // Sanskrit
    { code: 'sc', name: 'sardu' }, // Sardinian
    { code: 'sd', name: 'सिन्धी' }, // Sindhi
    { code: 'se', name: 'Davvisámegiella' }, // Northern Sami
    { code: 'sm', name: "gagana fa'a Samoa" }, // Samoan
    { code: 'sg', name: 'yângâ tî sängö' }, // Sango
    { code: 'sr', name: 'српски језик' }, // Serbian
    { code: 'gd', name: 'Gàidhlig' }, // Gaelic
    { code: 'sn', name: 'chiShona' }, // Shona
    { code: 'si', name: 'සිංහල' }, // Sinhala
    { code: 'sk', name: 'slovenčina' }, // Slovak
    { code: 'sl', name: 'slovenščina' }, // Slovenian
    { code: 'so', name: 'Soomaaliga' }, // Somali
    { code: 'st', name: 'Sesotho' }, // Southern Sotho
    { code: 'es', name: 'Español' }, // Spanish
    { code: 'es-AR', name: 'Español (Argentina)' }, // Spanish (Argentina)
    { code: 'es-419', name: 'Español (Latinoamérica)' }, // Spanish (Latin America)
    { code: 'es-MX', name: 'Español (México)' }, // Spanish (Mexico)
    { code: 'es-ES', name: 'Español (España)' }, // Spanish (Spain)
    { code: 'es-US', name: 'Español (Estados Unidos)' }, // Spanish (United States)
    { code: 'su', name: 'Basa Sunda' }, // Sundanese
    { code: 'sw', name: 'Kiswahili' }, // Swahili
    { code: 'ss', name: 'SiSwati' }, // Swati
    { code: 'sv', name: 'Svenska' }, // Swedish
    { code: 'ta', name: 'தமிழ்' }, // Tamil
    { code: 'te', name: 'తెలుగు' }, // Telugu
    { code: 'tg', name: 'тоҷикӣ' }, // Tajik
    { code: 'th', name: 'ไทย' }, // Thai
    { code: 'ti', name: 'ትግርኛ' }, // Tigrinya
    { code: 'bo', name: 'བོད་ཡིག' }, // Tibetan
    { code: 'tk', name: 'Türkmen' }, // Turkmen
    { code: 'tl', name: 'Wikang Tagalog' }, // Tagalog
    { code: 'tn', name: 'Setswana' }, // Tswana
    { code: 'to', name: 'faka Tonga' }, // Tonga
    { code: 'tr', name: 'Türkçe' }, // Turkish
    { code: 'ts', name: 'Xitsonga' }, // Tsonga
    { code: 'tt', name: 'татар теле' }, // Tatar
    { code: 'tw', name: 'Twi' }, // Twi
    { code: 'ty', name: 'Reo Tahiti' }, // Tahitian
    { code: 'ug', name: 'ئۇيغۇرچە' }, // Uighur
    { code: 'uk', name: 'Українська' }, // Ukrainian
    { code: 'ur', name: 'اردو' }, // Urdu
    { code: 'uz', name: 'Oʻzbek' }, // Uzbek
    { code: 've', name: 'Tshivenḓa' }, // Venda
    { code: 'vi', name: 'Tiếng Việt' }, // Vietnamese
    { code: 'vo', name: 'Volapük' }, // Volapük
    { code: 'wa', name: 'walon' }, // Walloon
    { code: 'cy', name: 'Cymraeg' }, // Welsh
    { code: 'wo', name: 'Wollof' }, // Wolof
    { code: 'fy', name: 'Frysk' }, // Western Frisian
    { code: 'xh', name: 'isiXhosa' }, // Xhosa
    { code: 'yi', name: 'ייִדיש' }, // Yiddish
    { code: 'yo', name: 'Yorùbá' }, // Yoruba
    { code: 'za', name: 'Saɯ cueŋƅ' }, // Zhuang
    { code: 'zu', name: 'isiZulu' }, // Zulu
];

const RegisterBoxed: React.FC = () => {
    const { token, setAuthToken, setUserId } = useAuth();
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedDomain, setSelectedDomain] = useState('gmail.com');
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState<UserRegister>({
        email: '',
        password: '',
        username: '',
        first_name: '',
        last_name: '',
        mobile: '',
        dob: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

    const isValidPhone = (phone: string): boolean => /^\+91[6-9]\d{9}$/.test(phone);

    const [selectedCountry, setSelectedCountry] = useState<Country>({
        name: 'India',
        code: 'IN',
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleDropdown = () => setOpen(!open);
    const togglePassword = () => setShowPassword(!showPassword);

    const countryList: Country[] = countries.map((country) => ({
        name: country.name.common,
        code: country.cca2,
    }));

    useEffect(() => {
        setInputData((prev) => ({
            ...prev,
            email: prev.username ? `${prev.username}@${selectedDomain}` : '',
        }));
    }, [selectedDomain, inputData.username]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
    };


    const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDomain(e.target.value);
        // email update handled by useEffect
    };

    const validateField = (name: string, value: string) => {
        let message = '';

        if (name === 'first_name') {
            if (!value.trim()) {
                message = `${name === 'first_name' ? 'First' : ''} name is required.`;
            } else if (/\d/.test(value)) {
                message = 'Numbers are not allowed.';
            }
        }

        if (name === 'username') {
            if (!value.trim()) {
                message = 'Email is required.';
            }
        }

        if (name === 'password') {
            if (!value) {
                message = 'Password is required.';
            } else if (value.length < 6) {
                message = 'Password must be at least 6 characters.';
            }
        }

        setErrors((prev) => ({
            ...prev,
            [name]: message,
        }));
    };



    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form errors
    if (Object.values(errors).some(Boolean)) {
        toast.error('Please fix the form errors before submitting');
        return;
    }

    try {
        const response = await axios.post(`${baseUrl}/users/register`, inputData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        // Store user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.id);
        setAuthToken(response.data.token);

        // Show success message and redirect after a delay
        toast.success('Signup successful! Redirecting to home page...');
        setTimeout(() => navigate('/'), 2000);

    } catch (error: any) {
        // Handle errors
        if (error.response?.data?.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error('Registration failed. Please try again.');
        }
    }
};

    const fullname = `${inputData.first_name} ${inputData.last_name}`.trim();

    const getFlagUrl = (code: string): string => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

    const fullEmail = `${email}@gmail.com`;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [searchTerm, setSearchTerm] = useState('');
    const [focusBorder , setFousBorder] = useState(false)
    const boxRef = useRef<HTMLDivElement>(null);

    const filteredLanguages = useMemo(() => {
        if (!searchTerm) return languages;
        return languages.filter((lang) => lang.name.toLowerCase().includes(searchTerm.toLowerCase()) || lang.code.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const currentLanguage = languages.find((lang) => lang.code === selectedLanguage);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFousBorder(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    return (
        <>
            {loading && <PageLoader />}
            <div className="lg:h-screen flex font_lato flex-col  justify-center items-center px-2 lg:py-7 lg:px-44 bg-[#ffffffd6] lg:bg-[#4362ee2c] overflow-hidden">
                <div className="bg-[#ffffffd6] rounded-3xl lg:px-16  p-5 lg:p-0 w-full  lg:py-14">
                    <div className="flex flex-col md:flex-row justify-between ">
                        <div className="lg:w-[50%]">
                            <div className="mb-4 md:mb-0 flex  items-center  rounded-lg ">
                                <img src={emailicon} alt="Logo" className="w-10" />
                                <h1 className=" text-2xl text-primary pr-4 ml-2 font-semibold"> UB Mail</h1>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:mt-16 text-black mb-4 leading-relaxed ">
                                Sign up <span className="block pt-3 text-[16px] font-medium">to continue to UB Mail</span>
                            </h2>
                        </div>

                        <div className="lg:w-[50%] mx-auto">
                            <form className="space-y-4" onSubmit={submitForm}>
                                <div className="space-y-4">
                                    <TextField
                                        id="first-name"
                                        label="First Name"
                                        name="first_name"
                                        placeholder="First Name"
                                        value={inputData.first_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.first_name}
                                        // helperText={errors.first_name}
                                        required
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                        fullWidth
                                    />
                                    <TextField
                                        id="last-name"
                                        label="Last Name (optional)"
                                        name="last_name"
                                        placeholder="Last Name"
                                        value={inputData.last_name}
                                        onChange={handleChange}
                                        // error={!!errors.last_name}
                                        // helperText={errors.last_name}
                                        onBlur={handleBlur}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                        fullWidth
                                    />
                                </div>

                                <div id={`${errors.username ? "username-label" : " text-black "}`}  onClick={()=> setFousBorder(true)} className="flex flex-col gap-1">
                                    <div ref={boxRef} className={`flex items-center rounded-lg transition-all   border-2 text-gray-400 border-gray-200 ${focusBorder ? "border-blue-500" : ""} ${errors.username ? "border-red-500  placeholder:text-red-600" : ""}`}>
                                        
                                        <TextField
                                            type="text"
                                            name="username"
                                            label="Email"
                                            id="username"
                                            placeholder="Email"
                                            className={`flex-1 focus:outline-none bg-none `}
                                            value={inputData.username}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/@/g, '');
                                                setInputData((prev) => ({
                                                    ...prev,
                                                    username: val,
                                                    email: `${val}@${selectedDomain}`,
                                                }));
                                            }}
                                            onBlur={handleBlur}
                                            required
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    backgroundColor: 'transparent',
                                                    padding: '0 4px',
                                                    borderRadius: '4px',
                                                    transition: 'background-color 0.2s',
                                                },
                                                '& .MuiInputLabel-shrink': {
                                                    backgroundColor: '#fff',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset': { border: 'none' },
                                                    '&:hover fieldset': { border: 'none' },
                                                    '&.Mui-focused fieldset': { border: 'none' },
                                                },
                                            }}

                                        />

                                        <div className="relative border-l border-gray-200">
                                            <select
                                                className="appearance-none bg-transparent pl-3 pr-8 py-2 focus:outline-none text-gray-700"
                                                value={selectedDomain}
                                                onChange={handleDomainChange}
                                            >
                                                <option value="ubmail.co">@ubmail.co</option>
                                                <option value="ubmail.me">@ubmail.me</option>
                                                <option value="ubmail.io">@ubmail.io</option>
                                                <option value="ubmail.ai">@ubmail.ai</option>
                                            </select>

                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <MdKeyboardArrowDown />
                                            </div>
                                        </div>
                                    </div>

                                   
                                </div>


                                <div className="space-y-4">
                                    <TextField
                                        id="password"
                                        label="Password"
                                        name="password"
                                        placeholder="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={inputData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.password}
                                        // helperText={errors.password}
                                        required
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={togglePassword} edge="end">
                                                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                    />

                                    <TextField
                                        id="re-password"
                                        label="Confirm Password"
                                        name="repeat_password"
                                        placeholder="Confirm Password"
                                        type={showRepeatPassword ? 'text' : 'password'}
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                        onBlur={handleBlur}
                                        error={!!errors.repeat_password}
                                        // helperText={errors.repeat_password}
                                        required
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                                        edge="end"
                                                    >
                                                        {showRepeatPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                    />
                                </div>

                                <div className="flex justify-center flex-col mx-1 items-center">
                                    <button
                                        type="submit"
                                        className="w-full text-[17px] transition bg-[#2565C7] text-white hover:bg-[#215ab3] py-3 rounded-xl px-8"
                                    >
                                        Sign Up
                                    </button>
                                    <p className="text-center text-[16px] text-gray-700 mt-3">
                                        Already have an account?
                                        <Link to="/auth/boxed-signin" className="text-primary underline mx-2">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </form>

                        </div>
                    </div>

                    <ToastContainer />
                </div>

                <div className="justify-between flex flex-col px-5 lg:flex-row items-center w-full">
                    <div className="relative w-40 pt-5 lg:pt-0  order-last lg:order-first">
                        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full gap-2 py-2 text-sm font-medium rounded-md border transition hover:bg-[#d3d5e0] px-1">
                            <Globe className="h-4 " />
                            {currentLanguage?.name || 'Select language'}
                            <ChevronDown className=" h-4 w-4 absolute right-2" />
                        </button>

                        {isOpen && (
                            <div ref={boxRef} className="absolute  w-full z-10 bottom-10 mt-1 rounded-md bg-white shadow-lg border border-gray-200">
                                <div className="p-1 max-h-96 overflow-auto">
                                    <input
                                        type="text"
                                        placeholder="Search languages..."
                                        className="w-full p-2 text-sm border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                    {filteredLanguages.length === 0 ? (
                                        <div className="p-2 text-sm text-gray-500">No language found</div>
                                    ) : (
                                        <ul>
                                            {filteredLanguages.map((language) => (
                                                <li key={language.code}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedLanguage(language.code);
                                                            setIsOpen(false);
                                                            setSearchTerm(''); // Clear search when selecting
                                                        }}
                                                        className={`w-full text-left p-2 text-sm flex items-center hover:bg-gray-100 ${selectedLanguage === language.code ? 'bg-indigo-50' : ''}`}
                                                    >
                                                        {selectedLanguage === language.code && <Check className="mr-2 h-4 w-4 text-indigo-600" />}
                                                        {language.name}
                                                        <span className="ml-2 text-xs text-gray-500">{language.code}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-center ">
                        <p className="text-xs  md:text-sm mr-2 text-gray-600  mb-0 ">By continuing, you agree to our </p>
                        <Link to="/terms" className="text-gray-500  underline text-[12px] font-medium">
                            Terms
                        </Link>
                        <Link to="/privacy" className="text-gray-500  underline mx-2 text-[12px] font-medium">
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterBoxed;
