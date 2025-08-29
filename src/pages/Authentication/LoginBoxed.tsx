import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import countries from 'world-countries';
import email from '../../assets/images/icons_bg_remove/15-removebg-preview.png';
import { useAuth } from '../../useContext/AppState';
// import { ChevronDown } from 'lucide-react';
import PageLoader from '@/components/Layouts/PageLoader';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { FiUser } from 'react-icons/fi';
import { PiKeyLight } from 'react-icons/pi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { fetchUserKeys, initializeCrypto } from '@/utils/cryptoUtils';
import { createMessage, encrypt, readKey } from 'openpgp';

const baseUrl = import.meta.env.VITE_API_BASE_URL; // ✅ Works with Vite
// console.log('API base URL:', baseUrl);

interface UserLogin {
    email: string;
    password: string;
}

interface CountryType {
    code: string;
    label: string;
    phone: string;
    suggested?: boolean;
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

export default function LoginBoxed() {
    const { token, setAuthToken, setUserId } = useAuth();
    const [showpassword, setShowpassword] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState({
        name: 'India',
        code: 'IN',
    });
    const navigate = useNavigate();

    const [inputData, setInputData] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});


    const [forgetOpen, setForgetOpen] = useState(false);
    // handleForm
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setInputData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        validateField(name, value);
    };

    const validateField = (name: string, value: string): void => {
        let message = '';
        if (name === 'email') {
            if (value === '') {
                message = 'Email is required.';
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    message = 'Enter a valid email address.';
                }
            }
        }

        if (name === 'password') {
            if (value === '') {
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



    useEffect(() => {
        if (token) {
            setTimeout(() => {
                setLoading(false);
                navigate('/');
            }, 2000);
        }
    }, []);

    const submitForm = async (event: any) => {
        event.preventDefault();

        const isProd = import.meta.env.MODE === 'production'; // For Vite
        // const isProd = process.env.NODE_ENV === 'production'; // For CRA or Webpack

        try {
            const loginResponse = await axios.post(`${baseUrl}/users/login`, inputData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // needed in both modes
            });

            console.log('🟢 Login response:', loginResponse.data);

            // if (isProd) {
            //     // ✅ Production: session-based check
            //     await axios
            //         .get(`${baseUrl}/debug/cookie`, { withCredentials: true })
            //         .then(() => console.log('✅ Cookie was sent'))
            //         .catch(() => console.warn('❌ Cookie not sent'));

            //     const sessionCheck = await axios.get(`${baseUrl}/users/session`, {
            //         withCredentials: true,
            //     });

            //     console.log('🟢 Session check result:', sessionCheck.data);

            //     if (sessionCheck.data?.authenticated) {
            //         console.log('✅ Session validated. Navigating to /');
            //         const token = loginResponse.data?.token;
            //         if (token) {
            //             setAuthToken(token); // 🔐 Save to localStorage or context
            //             console.log('✅ JWT stored. Navigating to /');
            //             navigate('/');
            //         } else {
            //             toast.error('No token received from server');
            //         }
            //     }
            // }
            // else {
            // Handle non-production case if needed
            const token = loginResponse.data?.token;
            if (token) {
                setAuthToken(token);
                console.log('✅ JWT stored (dev mode). Navigating to /');
                await initializeCrypto(token); // Initialize crypto with the token
                const encryptionKeys = await fetchUserKeys();
                const publicKey = await readKey({ armoredKey: encryptionKeys.publicKey });
                console.log(publicKey, "🔑 Public key fetched before cred2storage");
                const encryptedCred = await encrypt({
                    message: await createMessage({ text: JSON.stringify(inputData) }),
                    encryptionKeys: [publicKey],
                    format: 'armored'
                });
                localStorage.setItem('encryptedCredentials', encryptedCred)
                navigate('/');
            } else {
                toast.error('No token received from server');
            }
            // }
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                console.error('🚨 Error:', error.response.data);
                toast.error(error.response.data.error || 'Something went wrong');
            } else {
                console.error('🚨 Network error:', error.message);
                toast.error('Network error. Please try again.');
            }
        }
    };

    const toggleDropdown = () => setOpen(!open);

    const countryList = countries.map((country) => ({
        name: country.name.common,
        code: country.cca2,
    }));
    const getFlagUrl = (code: any) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [searchTerm, setSearchTerm] = useState('');
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

            <div className=" lg:h-screen flex font_lato flex-col  justify-center items-center lg:bg-[#4362ee2c] bg-[#ffffffd6] overflow-hidden">
                <div className=" shadow-sm shadow-black-dark-light lg:px-44 px-3 py-7 flex flex-col justify-center  w-full h-full">
                    <div className=" bg-[#ffffffd6] rounded-3xl md:py- flex flex-col justify-around w-full lg:px-10  lg:py-10 ">
                        <div className="flex flex-col md:flex-row p-4 ">
                            <div className="md:w-1/2 flex flex-col  justify-between md:mb-0 ">
                                <div className="">
                                    <div className="mb-4 md:mb-0 flex items-center  rounded-lg ">
                                        <img src={email} alt="Logo" className="w-10" />
                                        <h1 className=" text-2xl text-primary pr-4 ml-2 font-semibold"> JQ Mail</h1>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl lg:mt-16 text-black mb-4 leading-relaxed ">
                                        Sign in <span className="block pt-3 text-[16px] font-medium">to continue to JQ Mail</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="md:w-1/2 lg:pl-10 py-10">
                                <form className="space-y-" onSubmit={submitForm}>
                                    <div className="py-2">
                                        <TextField
                                            label="Email"
                                            name="email"
                                            placeholder=""
                                            value={inputData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            variant="outlined"
                                            error={Boolean(errors.email)}
                                            // helperText={errors.email}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },
                                            }}
                                        />
                                    </div>

                                    <div className="py-3">
                                        <TextField
                                            fullWidth
                                            id="password"
                                            name="password"
                                            label="Password"
                                            type={showpassword ? 'text' : 'password'}
                                            value={inputData.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            variant="outlined"
                                            error={Boolean(errors.password)}
                                            // helperText={errors.password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowpassword(!showpassword)} edge="end">
                                                            {showpassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },
                                            }}
                                        />
                                    </div>

                                    <div className="relative flex justify-between px-2 mt-4">
                                        <div className="flex">
                                            <input
                                                id="link-checkbox"
                                                type="checkbox"
                                                className="w-[15px] h-[15px] text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 mt-1 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                            />
                                            <label htmlFor="link-checkbox" className="ms-2 items-center text-sm text-black dark:text-gray-300 font-medium">
                                                Keep me signed in
                                                <span className="block text-gray-600">
                                                    Recommended on trusted devices.{' '}
                                                    <Link to="" className="text-[#4361ee] underline underline-offset-2">
                                                        Why?
                                                    </Link>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="underline underline-offset-2 flex text-black items-center hover:text-black outline-offset-8"
                                                onClick={() => setForgetOpen(!forgetOpen)}
                                            >
                                                Forgot? <TiArrowSortedDown size={20} className="text-[#4361ee]" />
                                            </button>
                                        </div>
                                        {forgetOpen && (
                                            <div className="absolute right-0 top-5 text-black font-medium  w-44 -ml-16 bg-white shadow-lg rounded-lg p-4 mt-1">
                                                <button className="py-2 flex text-[14px] items-center ">
                                                    <PiKeyLight className="mr-2 text-[#4361ee]" size={17} />
                                                    Forgot Password
                                                </button>
                                                <button className="py-2 flex text-[14px] items-center">
                                                    <FiUser className="mr-2 text-[#4361ee]" size={17} />
                                                    Forgot Username
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center justify-center mt-2 mx-1">
                                        <div className="flex w-full justify-center">
                                            <button
                                                type="submit"
                                                className="inline mt-3 w-full transition text-lg bg-[#2565C7] text-white hover:bg-[#215ab3] px-6 py-2 rounded-xl"
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                        <div className="flex items-center text-[15px] mt-4">
                                            <p className="text-black">New to UB Mail?</p>{' '}
                                            <Link to="/auth/boxed-signup" className="text-[#4361EE] ml-1 underline underline-offset-2">
                                                Create an account
                                            </Link>
                                        </div>
                                    </div>
                                </form>

                                <ToastContainer
                                    position="top-right"
                                    autoClose={2000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="colored"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col  px-5 lg:flex-row justify-between items-center mt- font-medium ">
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
                        <div className="">
                            <Link to="" className=" hover:bg-[#d3d5e0] transition p-2 rounded-md text-gray-500   text-[12px]">
                                Privacy
                            </Link>
                            <Link to="" className="mx-2 hover:bg-[#d3d5e0] transition p-2 rounded-md text-gray-500   text-[12px]">
                                Terms
                            </Link>

                            <Link to="" className="hover:bg-[#d3d5e0] transition p-2 rounded-md text-gray-500   text-[12px] ">
                                Help
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
            </div>
        </>
    );
}
