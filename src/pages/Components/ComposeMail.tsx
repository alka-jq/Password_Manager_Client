import Tippy from '@tippyjs/react';
import { useEffect, useRef, useState } from 'react';
import { FiMaximize2, FiMinus, FiX } from 'react-icons/fi';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';
import { MdAddToDrive, MdInsertEmoticon, MdOutlineFormatColorText, MdOutlineInsertLink, MdOutlineLockClock, MdOutlinePhotoSizeSelectActual, MdShortText } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import IconMenu from '../../components/Icon/IconMenu';
import { RootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useAuth } from '../../useContext/AppState';
// import MailThread from './MailThread';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Extension } from '@tiptap/core';
import BulletList from '@tiptap/extension-bullet-list';
import Color from '@tiptap/extension-color';
import { Link as TiptapLink } from '@tiptap/extension-link';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ChromePicker } from 'react-color';
import { FaAlignLeft, FaAlignRight, FaBold, FaFillDrip, FaItalic, FaListOl, FaListUl, FaPalette, FaUnderline } from 'react-icons/fa';
import { IoMdAttach, IoMdLink } from 'react-icons/io';
import { toast } from 'sonner';
import { useComposeEmail } from '../../useContext/ComposeEmailContext';
import { useSettings } from '../../useContext/useSettings';
import { encryptEmailForBackend, encryptForStorage, getOrCreateSenderKey } from '../../utils/encryption';
import DatePickerModal from '@/components/DatePickerModal';
import { fetchUserKeys, initializeCrypto } from '@/utils/cryptoUtils';
import { createMessage, encrypt, readKey } from 'openpgp';
import { encryptFileattachment } from '@/utils/attachments-encryption';
import { json } from 'stream/consumers';
interface EncryptedAttachment {
  id: string;  // Required
  name: string;
  type: string;
  size: number;
  encryptedData: string;
  metadata?: {
    encryptedAt: string;
    keyId?: string;
  };
}
const BackgroundColor = Extension.create({
    name: 'backgroundColor',
    addOptions() {
        return { types: ['textStyle'] };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    backgroundColor: {
                        default: null,
                        parseHTML: (element) => element.style.backgroundColor || null,
                        renderHTML: (attributes) => {
                            if (!attributes.backgroundColor) return {};
                            return {
                                style: `background-color: ${attributes.backgroundColor}`,
                            };
                        },
                    },
                },
            },
        ];
    },
});

interface Mail {
    id: number;
    subject: string;
    created_at: string;
    thread_id?: string;
    to_email?: string;
    is_read?: boolean;
    is_starred?: boolean;
    plain_text?: string;
    message_id?: string;
    type?: string;
    group?: string;
    isStar?: boolean;
    isImportant?: boolean;
    isUnread?: boolean;
    title?: string;
    firstName?: string;
    lastName?: string;
    displayDescription?: string;
}

interface InboxItem {
    id: number;
    // Add other properties as needed
}

interface Params {
    from_email: string;
    plainText: string;
    subject: string;
    body: string;
    to_email: string;
    cc: string;
    bcc: string;
    id?: string;
    attachments?: any[];
    is_reply?: boolean;
    in_reply_to?: string;
    message_id?: string;
    is_draft?: boolean;
}

function ComposeMail() {
    const { token, menuBarOpen } = useAuth();
    const [messages, setMessages] = useState<Mail[]>([]);
    const [sendOption, setSendOption] = useState(false);
    const totalPages = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const [moreOption, setmoreOption] = useState(false);
    const [InboxData, setInboxData] = useState<InboxItem[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);

    const [replyData, setReplyData] = useState({});

    const { isOpen, closeComposeEmail, emailData, resetData } = useComposeEmail();
    const { getPreferenceOptions } = useSettings();
    const { preferences } = useSettings();

    const { ComposerMode, DefaultComposerSize, includeSignatureByDefault } = getPreferenceOptions('ComposerMode', 'DefaultComposerSize', 'includeSignatureByDefault');

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const formatDate = (isoDateString: string) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
        });
    };

    // collapse

    useEffect(() => {
        if (InboxData.length > 0) {
            setOpenId(InboxData[InboxData.length - 1].id);
        }
    }, [InboxData]);

    const toggle = (id: any) => {
        setOpenId((prev) => (prev === id ? null : id)); // toggle open/close
    };


    const [mailList, setMailList] = useState<Mail[]>([]);

    const defaultParams = {
        from_email: '',
        plainText: '',
        subject: '',
        body: '',
        to_email: '',
        cc: '',
        bcc: '',
    };

    const [IsLoading, setIsLoading] = useState(true);

    const [isShowMailMenu, setIsShowMailMenu] = useState(false);
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [filteredMailList, setFilteredMailList] = useState<any>(mailList.filter((d) => d.type === 'inbox'));
    const [ids, setIds] = useState<any>([]);
    const [searchText, setSearchText] = useState<any>('');
    const [selectedMail, setSelectedMail] = useState<any>(null);
    const [params, setParams] = useState<Params>(JSON.parse(JSON.stringify(defaultParams)));
    // Add to your component state
    const [ccEmails, setCcEmails] = useState<string[]>([]);
    const [bccEmails, setBccEmails] = useState<string[]>([]);
    const [currentCcInput, setCurrentCcInput] = useState('');
    const [currentBccInput, setCurrentBccInput] = useState('');
    const [pagedMails, setPagedMails] = useState<any>([]);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [attachments, setAttachments] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const [isOpen, setIsOpen] = useState(true);
    // const [plusOpen, setPlusOpen] = useState(false);
    // console.log(isExpanded);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const quillRef = useRef(null);
    const isRtl = useSelector((state: RootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [pager] = useState<any>({
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
    });

    // fetching api
    useEffect(() => {
        searchMails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTab, searchText, mailList]);

    useEffect(() => {
        // console.log({ ComposerMode, DefaultComposerSize, includeSignatureByDefault }, 'Composer Mode');
        if (DefaultComposerSize == 'maximized') {
            setIsExpanded(true);
            setIsMinimized(false);
        } else if (DefaultComposerSize == 'minimized') {
            setIsExpanded(false);
            setIsMinimized(true);
        } else {
            setIsMinimized(false);
            setIsExpanded(false);
        }
    }, [ComposerMode, DefaultComposerSize, includeSignatureByDefault]);

    // Email validation function
    const isValidEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Common handler for both CC and BCC
    const handleEmailInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        currentInput: string,
        emails: string[],
        setEmails: React.Dispatch<React.SetStateAction<string[]>>,
        setCurrentInput: React.Dispatch<React.SetStateAction<string>>
    ) => {
        if (['Enter', 'Space', 'Tab', ','].includes(e.key)) {
            e.preventDefault();
            const email = currentInput.trim();

            if (email && isValidEmail(email)) {
                if (!emails.includes(email)) {
                    setEmails([...emails, email]);
                    setCurrentInput('');
                } else {
                    toast.error('Email already added');
                }
            } else if (email) {
                toast.error('Please enter a valid email address');
            }
        }
    };

    // Remove email from list
    const removeEmail = (index: number, emails: string[], setEmails: React.Dispatch<React.SetStateAction<string[]>>) => {
        const newEmails = [...emails];
        newEmails.splice(index, 1);
        setEmails(newEmails);
    };

    // Update params when emails change
    useEffect(() => {
        setParams((prev: Params) => ({
            ...prev,
            cc: ccEmails.join(', '),
            bcc: bccEmails.join(', '),
        }));
    }, [ccEmails, bccEmails]);

    const openMail = (type: string, item: any) => {
        if (type === 'add') {
            setIsShowMailMenu(false);
            setParams(JSON.parse(JSON.stringify(defaultParams)));
        } else if (type === 'draft') {
            let data = JSON.parse(JSON.stringify(item));
            setParams({ ...data, from: defaultParams.from_email, to: data.email, displayDescription: data.email });
        } else if (type === 'reply') {
            let data = JSON.parse(JSON.stringify(item));
            setParams({
                ...data,
                from: defaultParams.from_email,
                to: data.email,
                title: 'Re: ' + data.title,
                displayDescription: 'Re: ' + data.title,
            });
        } else if (type === 'forward') {
            let data = JSON.parse(JSON.stringify(item));
            setParams({
                ...data,
                from: defaultParams.from_email,
                to: data.email,
                title: 'Fwd: ' + data.title,
                displayDescription: 'Fwd: ' + data.title,
            });
        }
    };

    const searchMails = (isResetPage = true) => {
        if (isResetPage) {
            pager.currentPage = 1;
        }

        let res;
        if (selectedTab === 'important') {
            res = mailList.filter((d) => d.isImportant);
        } else if (selectedTab === 'star') {
            res = mailList.filter((d) => d.isStar);
        } else if (selectedTab === 'personal' || selectedTab === 'work' || selectedTab === 'social' || selectedTab === 'private') {
            res = mailList.filter((d) => d.group === selectedTab);
        } else {
            res = mailList.filter((d) => d.type === selectedTab);
        }

        let filteredRes = res.filter(
            (d) =>
                (d.title && d.title.toLowerCase().includes(searchText)) ||
                (d.firstName && d.firstName.toLowerCase().includes(searchText)) ||
                (d.lastName && d.lastName.toLowerCase().includes(searchText)) ||
                (d.displayDescription && d.displayDescription.toLowerCase().includes(searchText))
        );

        setFilteredMailList([
            ...res.filter(
                (d) =>
                    (d.title && d.title.toLowerCase().includes(searchText)) ||
                    (d.firstName && d.firstName.toLowerCase().includes(searchText)) ||
                    (d.lastName && d.lastName.toLowerCase().includes(searchText)) ||
                    (d.displayDescription && d.displayDescription.toLowerCase().includes(searchText))
            ),
        ]);

        if (filteredRes.length) {
            pager.totalPages = pager.pageSize < 1 ? 1 : Math.ceil(filteredRes.length / pager.pageSize);
            if (pager.currentPage > pager.totalPages) {
                pager.currentPage = 1;
            }
            pager.startIndex = (pager.currentPage - 1) * pager.pageSize;
            pager.endIndex = Math.min(pager.startIndex + pager.pageSize - 1, filteredRes.length - 1);
            setPagedMails([...filteredRes.slice(pager.startIndex, pager.endIndex + 1)]);
        } else {
            setPagedMails([]);
            pager.startIndex = -1;
            pager.endIndex = -1;
        }
        clearSelection();
    };

    useEffect(() => {
        setParams((prev: Params) => ({ ...prev, cc: ccEmails.join(',') }));
        setParams((prev: Params) => ({ ...prev, bcc: bccEmails.join(',') }));
    }, [ccEmails, bccEmails]);

    // Updated saveMail function
    // Updated saveMail function
    const [isSending, setIsSending] = useState(false);

 const saveMail = async () => {
    if (!params.to_email) {
        toast.error("Recipient can't be empty!");
        return;
    }
    if (!token) {
        toast.error('Authentication token missing!');
        return;
    }

    try {
        const emailData = {
            to_email: params.to_email,
            cc: params.cc || '',
            bcc: params.bcc || '',
            subject: params.subject,
            body: params.body,
            plainText: editor?.getText() || '',
            is_reply: params.is_reply || false,
            in_reply_to: params.in_reply_to || null,
            is_draft: params.is_draft || false,
            attachments: params.attachments || [],
            message_id: params.message_id || null,
        };

        // console.log(emailData, 'Email Data to be saved');

        const { encryptedEmail, failedRecipients } = await encryptEmailForBackend(emailData, token);

        if (failedRecipients.length > 0) {
            toast.error(`Encryption failed for: ${failedRecipients.join(', ')}`);
            return;
        }

        const undoPreference = preferences?.UndoSendTime || '5';
        const undoTimeMs = parseInt(undoPreference) * 1000;

        const toastId = toast(`Sending in ${undoPreference} seconds`, {
            duration: Infinity,
            action: {
                label: 'Undo',
                onClick: () => {
                    clearTimeout(sendTimeoutId);
                    toast.dismiss(toastId);
                    toast('Send cancelled');
                },
            },
        });

        const sendTimeoutId = setTimeout(async () => {
            try {
                const response = await fetch(`${baseUrl}/mails/send-mail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(encryptedEmail),
                });

                const result = await response.json();
                toast.dismiss(toastId);

                if (response.ok) {
                    try {
                        const senderEmail = 'himan@ubmail.me'; // Replace dynamically from context
                        const senderPublicKey = await getOrCreateSenderKey(token);

                        if (!senderPublicKey) {
                            throw new Error("Failed to get sender's public key");
                        }

                        const storageEncrypted = await encryptForStorage(
                            emailData.subject,
                            emailData.body,
                            emailData.plainText,
                            senderPublicKey
                        );

                        const metadata = {
                            from_email: senderEmail,
                            to_email: emailData.to_email,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            headers: {
                                'Message-ID': result.message_id,
                                Date: new Date().toUTCString(),
                                From: senderEmail,
                                ...(emailData.cc && { Cc: emailData.cc }),
                                ...(emailData.bcc && { Bcc: emailData.bcc }),
                                'X-Mailer': 'Abysfin Mail Server',
                            },
                            has_attachments: emailData.attachments.length > 0,
                            attachments: emailData.attachments,
                            is_encrypted: true,
                            encryption_type: 'pgp',
                        };

                        const storeResponse = await fetch(`${baseUrl}/mails/store-mail-to-db`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                to_email: emailData.to_email,
                                message_id: result.message_id,
                                in_reply_to: emailData.in_reply_to,
                                subject: storageEncrypted.subject,
                                body: storageEncrypted.body,
                                plainText: storageEncrypted.plainText,
                                cc: emailData.cc,
                                bcc: emailData.bcc,
                                is_reply: emailData.is_reply,
                                in_repy_to: emailData.in_reply_to,
                                is_draft: emailData.is_draft,
                                attachments: emailData.attachments.map(a => ({
                                id: a.id,
                                name: a.name,
                                size: a.size,
                                type: a.type,
                                encryptedData: a.encryptedData,
                                metadata: {
                                encryptedAt: a.metadata?.encryptedAt || new Date().toISOString(),
                                keyId: a.metadata?.keyId || 'unknown'
                                }
                                })),
                                metadata,
                                user_id: 'current_user_id', // Replace dynamically
                            }),
                        });

                        const storeResult = await storeResponse.json();

                        if (!storeResponse.ok) {
                            // console.error('Failed to store email:', storeResult.error);
                        }
                    } catch (storageError) {
                        // console.error('Error in storage process:', storageError);
                    }

                    if (result.fallback_used) {
                        toast.success('Email sent without encryption to external recipients');
                    } else if (result.encrypted) {
                        toast.success('Encrypted email sent successfully');
                    } else {
                        toast.success('Email sent successfully');
                    }

                    setParams(defaultParams);
                    resetData();
                    closeComposeEmail();
                } else {
                    toast.error(result.error || 'Failed to send email');
                }
            } catch (err) {
                toast.dismiss(toastId);
                // console.error('Error sending email:', err);
                toast.error('Email Not Sent!');
            }
        }, undoTimeMs);

    } catch (err) {
        // console.error('Outer catch error:', err);
        toast.error('Something went wrong while preparing the email!');
    }
};

    const getFileSize = (file_type: any) => {
        let type = 'file';
        if (file_type.includes('image/')) {
            type = 'image';
        } else if (file_type.includes('application/x-zip')) {
            type = 'zip';
        }
        return type;
    };

    const getFileType = (total_bytes: number) => {
        let size = '';
        if (total_bytes < 1000000) {
            size = Math.floor(total_bytes / 1000) + 'KB';
        } else {
            size = Math.floor(total_bytes / 1000000) + 'MB';
        }
        return size;
    };

    const clearSelection = () => {
        setIds([]);
    };

    const tabChanged = (tabType: any) => {
        setIsShowMailMenu(false);
        setSelectedMail(null);
    };

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        // console.log('test', linkUrl);
        if (id === 'linkUrl') {
            setLinkUrl(value);
        }

        setParams((prev: Params) => ({ ...prev, [id]: value }));
        // setParams({ ...params, [id]: value });
    };

    const handleCheckboxChange = (id: any) => {
        if (ids.includes(id)) {
            setIds((value: any) => value.filter((d: any) => d !== id));
        } else {
            setIds([...ids, id]);
        }
    };

    const checkAllCheckbox = () => {
        if (filteredMailList.length && ids.length === filteredMailList.length) {
            return true;
        } else {
            return false;
        }
    };

    const closeMsgPopUp = () => {
        setSelectedTab('inbox');
        searchMails();
    };

    // const handleSaveSnooze = (mailId: string, date: Date) => {
    //   console.log('Snoozed mail:', mailId, 'until:', date);
    //   setCustomDate(date); // ✅ date must be a real Date object
    //   setOpenDatePicker(false);
    // };
    const CustomToolbar = () => (
        <div id="toolbar">
            <select className="ql-header" defaultValue={''} onChange={(e) => e.persist()}>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="">Normal</option>
            </select>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-clean" />
        </div>
    );
    const modules = {
        toolbar: {
            container: '#toolbar',
        },
    };
    const [content, setContent] = useState('');
    const [showTextColorPicker, setShowTextColorPicker] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);
    type ButtonType = 'color' | 'bgColor' | 'bold' | 'italic' | 'underline' | 'bulletList' | 'orderedList' | 'alignLeft' | 'alignRight';
    const [activeButtons, setActiveButtons] = useState<ButtonType[]>([]);
    const colorBtnRef = useRef<HTMLDivElement>(null);
    const bgColorBtnRef = useRef<HTMLDivElement>(null);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
            }),
            Underline,
            TextStyle,
            Color,
            BulletList,
            OrderedList,
            TextAlign.configure({ types: ['paragraph'] }),
            BackgroundColor,
            TiptapLink.configure({
                openOnClick: true,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
        ],
        content: params.body,
        onUpdate: ({ editor }) => {
            setParams((prev: Params) => ({
                ...prev,
                body: editor.getHTML(),
                plainText: editor.getText(),
            }));
        },
    });

    function extractAndValidateEmail(emailStr: string) {
        // Regex to match "Name <email@domain.com>" format
        const emailWithNameRegex = /^[^<]*<([^>]+)>$/;
        // Standard email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let extractedEmail = emailStr.trim();
        let hasNameFormat = false;

        // Check if it's in "Name <email@domain.com>" format
        const match = emailStr.match(emailWithNameRegex);
        if (match) {
            hasNameFormat = true;
            extractedEmail = match[1].trim(); // Extract the email part
        }

        // Validate the email format
        const isValidEmail = emailRegex.test(extractedEmail);

        return {
            originalInput: emailStr,
            hasNameFormat,
            extractedEmail: isValidEmail ? extractedEmail : null,
            isValid: isValidEmail,
            error: isValidEmail ? null : 'Invalid email format',
        };
    }

    useEffect(() => {
        // console.log(emailData, 'EMail Data');
        let emailObj = extractAndValidateEmail(emailData?.to_email || '');
        // console.log(emailData, 'Email Data');
        if (emailData && emailData) {
            setParams({
                from_email: '',
                cc: '',
                bcc: '',
                in_reply_to: emailData?.is_reply_to || '',
                is_reply: emailData?.isReply ? true : false,
                subject: emailData?.subject || '',
                to_email: emailObj.extractedEmail || '',
                body: emailData?.body || '',
                plainText: emailData?.plainText || '',
                message_id: emailData?.message_id || '',
            });
        }
    }, [emailData]);

    useEffect(() => {
        if (emailData && emailData.body !== '') {
            // console.log('Found Body in COmpose');
            // console.log(emailData.body);
            editor?.commands.setContent(emailData.body || '');
        } else {
            editor?.commands.setContent(emailData?.plainText || '');
            // console.log(emailData?.plainText);
        }
    }, [isOpen, emailData]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (colorBtnRef.current && !colorBtnRef.current.contains(target) && bgColorBtnRef.current && !bgColorBtnRef.current.contains(target)) {
                setShowTextColorPicker(false);
                setShowBgColorPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) return null;

    // Function to toggle active button state
    const toggleButtonActive = (buttonName: ButtonType) => {
        setActiveButtons((prevState) => {
            if (prevState.includes(buttonName)) {
                return prevState.filter((name) => name !== buttonName);
            } else {
                return [...prevState, buttonName];
            }
        });
    };

    // Function to apply active selection color
    const applyActiveSelectionColor = (color: any) => {
        editor.chain().focus().setMark('textStyle', { backgroundColor: color }).run();
    };

    //  togle bar to change style of content

    const [showBar, setShowBar] = useState(false); // State to manage visibility of the bar

    // Function to toggle the bar's visibility
    const toggleBar = () => {
        setShowBar((prevState) => !prevState);
    };
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    // console.log('selected ', selectedFiles);
    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files;
    //     if (files && files.length > 0) {
    //         setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    //     }
    // };

   const removeFile = (index: number) => {
        // Create new arrays without the removed file
        const updatedSelectedFiles = [...selectedFiles].filter((_, i) => i !== index);
        const updatedAttachments = [...attachments].filter((_, i) => i !== index);

        // Update both states
        setSelectedFiles(updatedSelectedFiles);
        setAttachments(updatedAttachments);

        // Update the params with the new attachments
        setParams((prev: Params) => ({
            ...prev,
            attachments: updatedAttachments,
        }));
    };

    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);

    const popupRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const colorDivRef = useRef<HTMLDivElement>(null);
    const bgColorDivRef = useRef<HTMLDivElement>(null);
    const sendOptionDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (popupRef.current && !popupRef.current.contains(target) && triggerRef.current && !triggerRef.current.contains(target)) {
                setShowTextColorPicker(false);
                setShowBgColorPicker(false);
                setSendOption(false);
                setShowEmojiPicker(false);
                setShowLinkInput(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef, triggerRef]);
    const [showLinkInput, setShowLinkInput] = useState(false);

    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    // ✅ This is where your applyLink function goes
    const applyLink = () => {
        if (!linkUrl || !editor) return;

        const { state } = editor;

        editor.chain().focus();

        if (!state.selection.empty) {
            // Text is selected – apply link to selection
            editor.chain().extendMarkRange('link').setLink({ href: linkUrl }).run();
        } else if (linkText) {
            // No selection – insert linked text
            editor
                .chain()
                .insertContent({
                    type: 'text',
                    text: linkText,
                    marks: [{ type: 'link', attrs: { href: linkUrl } }],
                })
                .run();
        } else {
            alert('Select text or enter display text for the link.');
            return;
        }

        // setLinkShowDiv(linkUrl);
        setShowLinkInput(false);
        setLinkUrl('');
        setLinkText('');
    };

    const openLinkInput = () => {
        setShowLinkInput(true);
        setTimeout(() => {
            // Optionally focus the input field here if needed
            // console.log('Link input opened');
        }, 0);
    };

    function filterNonEmptyParams(params: any) {
        const result: any = {};

        for (const key in params) {
            // Check if the value exists and is a non-empty string
            if (params[key] !== undefined && params[key] !== null && (typeof params[key] !== 'string' || params[key].trim() !== '')) {
                result[key] = params[key];
            }
        }

        return result;
    }

    const saveAsDraft = async () => {
        try {
            // Filter out empty string properties

            const senderPublicKey = await getOrCreateSenderKey(token || '');

            if (!senderPublicKey) {
                throw new Error("Failed to get sender's public key");
            }

            // console.log('Input Draft for Encryption', { subject: params.subject || '', body: params.body || '', plainText: params.plainText || '', publicKey: senderPublicKey });
            const storageEncrypted = await encryptForStorage(params.subject || '', params.body || '', params.plainText || '', senderPublicKey, 'Draft');
            // console.log(storageEncrypted, 'Encrypted Output Draft');
            const filteredParams = filterNonEmptyParams(storageEncrypted);
            // console.log(filteredParams, 'PARAMS BEFORE SENDING TO DRAFT');

            const saveDraftTimeout = setTimeout(async () => {
                const response = await fetch(`${baseUrl}/mails/save-draft`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Fixed typo in 'Content-Type'
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ...params, ...filteredParams, attachments: JSON.stringify(params.attachments) }),
                });
            }, 1500);
            toast('Draft Saved', {
                action: {
                    label: 'Undo',
                    onClick: () => clearTimeout(saveDraftTimeout),
                },
            });
        } catch (err) {
            toast.error('Something went wrong!');
        }
    };

    // useEffect(() => {
    //     if (preferences?.UndoSendTime ) saveAsDraft();

    // }, [preferences]);

    // handle close compose
    const handleCloseCompose = () => {
        closeComposeEmail();
        if (params.plainText !== '' || params.subject !== '') {
            saveAsDraft();
        }
    };

    // Optional: Ctrl+K keyboard handler
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                openLinkInput();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [mangeButton, setManageButton] = useState(false);

    // -------------------lable code --------------------------------
    const [labelData, setLabelData] = useState<string>('');
    const [labels, setLabels] = useState<string[]>([]);
    const [plusOpen, setPlusOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [labelshow, setLableshow] = useState(false);

    const lableCreated = (e: React.FormEvent) => {
        e.preventDefault();
        if (!labelData?.trim()) return;

        setLabels((prev) => [...prev, labelData.trim()]);
        setLabelData('');
        setPlusOpen(false);
    };
    const handleDelete = (index: number) => {
        setLabels((prev) => prev.filter((_, i) => i !== index));
    };

    // Your existing editor and changeValue code remains the same...

    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };

    const generateKey = async () => {
        const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
        const exported = await crypto.subtle.exportKey('raw', key);
        return { key, raw: arrayBufferToBase64(exported) };
    };

    const encryptFile = async (file: File) => {
        if (file.size > 25 * 1024 * 1024) {
            // 25MB limit
            throw new Error('File size exceeds 25MB limit');
        }

        const { key, raw } = await generateKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const aad = new TextEncoder().encode('additional-data');

        const fileData = await file.arrayBuffer();
        const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, fileData);

        return {
            name: file.name,
            type: file.type,
            size: file.size,
            encryptedData: arrayBufferToBase64(encryptedData),
            key: raw,
            iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
            aad: arrayBufferToBase64(aad.buffer as ArrayBuffer),
        };
    };

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  try {
    // console.log('Starting file attachment processing...');
    // console.log(`Processing ${files.length} file(s)`);

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    // console.log('Authentication token verified');
    
    await initializeCrypto(token);
    // console.log('Crypto initialized');

    const { publicKey } = await fetchUserKeys();
    if (!publicKey) throw new Error('No encryption key available');
    // console.log('Public key retrieved:', publicKey.substring(0, 20) + '...');

    const newAttachments: EncryptedAttachment[] = [];
    const newSelectedFiles: File[] = [];

    for (const [index, file] of Array.from(files).entries()) {
    //   console.log(`\nProcessing file ${index + 1}/${files.length}:`);
    //   console.log('File name:', file.name);
    //   console.log('File type:', file.type);
    //   console.log('File size:', file.size, 'bytes');

      const encryptedAttachment = await encryptFileattachment(file, publicKey);
    //   console.log('File encrypted successfully');
    //   console.log('Encrypted data length:', encryptedAttachment.encryptedData.length);
      
      const completeAttachment: EncryptedAttachment = {
        id: crypto.randomUUID(),
        name: encryptedAttachment.name,
        type: encryptedAttachment.type,
        size: encryptedAttachment.size,
        encryptedData: encryptedAttachment.encryptedData,
        metadata: {
          encryptedAt: new Date().toISOString(),
          keyId: (await readKey({ armoredKey: publicKey })).getKeyID().toHex()
        }
      };

    //   console.log('Complete attachment object:', {
    //     ...completeAttachment,
    //     encryptedData: completeAttachment.encryptedData.substring(0, 20) + '...'
    //   });

      newAttachments.push(completeAttachment);
      
      newSelectedFiles.push(file);
    }

    // console.log('\nAll files processed. Updating state...');
    // console.log('New attachments count:', newAttachments.length);
    // console.log('Previous attachments count:', attachments?.length || 0);

    setAttachments(prev => [...(prev || []), ...newAttachments]);
    setSelectedFiles(prev => [...(prev || []), ...newSelectedFiles]);
    // console.log(newAttachments, "New Attachments Object")
    setParams(prev => ({
      ...prev,
      attachments: [
        ...(prev.attachments || []),
        ...newAttachments
      ]
    }));

    // console.log('State updated successfully');
    // console.log('Total attachments now:', (attachments?.length || 0) + newAttachments.length);

  } catch (error) {
    // console.error('\nFile processing error:', error);
    if (error instanceof Error) {
    //   console.error('Error stack:', error.stack);
      alert(error.message);
    } else {
      alert('File encryption failed');
    }
  } finally {
    if (e.target) {
      e.target.value = '';
    //   console.log('File input reset');
    }
    // console.log('File processing complete');
  }
};

    const removeAttachment = (index: number) => {
        const updatedAttachments = [...attachments];
        updatedAttachments.splice(index, 1);
        setAttachments(updatedAttachments);
        setParams((prev: Params) => ({
            ...prev,
            attachments: updatedAttachments,
        }));
    };

    useEffect(() => {
        // console.log(params, 'PARAMS');
    }, [fileInputRef]);

    const [openDatePicker, setOpenDatePicker] = useState(false);

    // tomorrow date
    const getTomorrowFormatted = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const day = tomorrow.getDate();
        const month = tomorrow.toLocaleString('default', { month: 'long' }); // e.g. "June"

        return `${day} ${month} at 08:00`;
    };

    // monday date
    const getNextMondayFormatted = () => {
        const today = new Date();
        const day = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
        const diff = (8 - day) % 7 || 7; // days until next Monday
        const nextMonday = new Date();
        nextMonday.setDate(today.getDate() + diff);

        const date = nextMonday.getDate();
        const month = nextMonday.toLocaleString('default', { month: 'long' }); // e.g. "May"

        return `${date} ${month} at 08:00`;
    };


    const formatCustomDate = (date: Date | null | string | undefined): string => {
        if (!date) return 'Pick a date';

        let dateObj: Date;

        if (typeof date === 'string') {
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return 'Pick a date';
        } else if (date instanceof Date) {
            dateObj = date;
        } else {
            return 'Pick a date';
        }

        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} at ${hours}:${minutes}`;
    };

    // In your component state
    const [customDate, setCustomDate] = useState<Date | null>(null);

    // In your date picker handling
    const handleSaveSnooze = (mailId: string, date: Date) => {
        // console.log('Snoozed mail:', mailId, 'until:', date);
        setCustomDate(date);
        setOpenDatePicker(false);
    };



    //   const handleSaveSnooze = (selectedDate: Date) => {
    //     setCustomDate(selectedDate);
    //     setOpenDatePicker(false);
    //   };

    return (
        <>
            {isOpen && (
                <div
                    className={`
                          font_lato  fixed z-50 shadow-2xl rounded-t-2xl softazure:bg-[#f2e9e4] peach:bg-gray-100 lightmint:bg-green-50 bg-white dark:bg-[#2F2F2F] transition-all duration-300 salmonpink:bg-[#edf6f9]

                            ${isMinimized
                            ? 'h-[50px] w-[300px] bottom-0 right-16 overflow-hidden'
                            : isExpanded
                                ? 'h-[80vh] w-[80vw] bottom-12 right-1/2 translate-x-1/2 overflow-auto'
                                : 'h-[75vh] w-[75vh] bottom-0 right-14 max-h-[90vh] overflow-hidden'
                        }
                          `}
                >
                    {/* Header */}

                    <div className="flex items-center justify-between px-4 py-3 softazure:bg-[#9a8c98] classic:bg-[#a8c7fa] classic:text-black bg-[#2565C7] text-white cornflower:text-black cornflower:bg-[#6BB8C5] rounded-t-2xl peach:bg-[#1b2e4b] peach:text-white lightmint:bg-[#629e7c]  lightmint:text-white dark:text-white dark:bg-[#202127] salmonpink:text-white salmonpink:bg-[#006d77] blue:bg-[#bbdefb] blue:text-gray-900">
                        <div className="flex items-center">
                            <button type="button" className="xl:hidden text-gray-600 dark:text-gray-300 hover:text-black mr-3" onClick={() => setIsShowMailMenu(!isShowMailMenu)}>
                                <IconMenu />
                            </button>

                            <h4 className="textMedium font-medium  blue:text-black classic:text-black text-white cornflower:text-black dark:text-gray-300 salmonpink:text-white">
                                New Message
                            </h4>
                        </div>
                        <div className="flex items-center  space-x-2">
                            <button onClick={() => setIsMinimized(!isMinimized)} title="Minimize">
                                <FiMinus size={18} />
                            </button>
                            <button onClick={() => setIsExpanded(!isExpanded)} title="Expand">
                                <FiMaximize2 size={18} />
                            </button>
                            <button onClick={handleCloseCompose} title="Close">
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-l from-indigo-900/20 dark:bg-[#2F2F2F] via-black dark:text-white to-indigo-900/20 opacity-10" />

                    {/* Form */}
                    <form className="grid gap-3 p-4">
                        <div className="space-y-2">
                            {/* Top Row: To + CC/BCC Toggles */}
                            <div className="flex justify-between items-center">
                                <label className="w-full border-b  flex">
                                    <span className="text-gray-500  font-medium">To</span>
                                    <input
                                        id="to_email"
                                        type="email"
                                        className={`
    w-full dark:default pb-2 bg-transparent
    dark:text-white 
    cornflower:placeholder:text-black
    peach:placeholder:text-black
    lightmint:placeholder:text-black
    dark:bg-transparent
    dark:placeholder:text-white
    dark:border-b-[white]
    focus:outline-none
    pl-2
    !font-normal
    dark:[&:-webkit-autofill]:-webkit-text-fill-white
    dark:[&:-webkit-autofill]:shadow-transparent
    dark:[&:-webkit-autofill]:caret-white
  `}
                                        defaultValue={emailData ? emailData.to_email : params.to_email}
                                        onChange={changeValue}
                                        name="to_email"
                                    />
                                </label>

                                <div className="flex gap-2  text-gray-600 dark:text-white cursor-pointer">
                                    {!showCc && (
                                        <span onClick={() => setShowCc(true)} className="hover:underline">
                                            Cc
                                        </span>
                                    )}
                                    {!showBcc && (
                                        <span onClick={() => setShowBcc(true)} className="hover:underline">
                                            Bcc
                                        </span>
                                    )}
                                </div>
                            </div>

                            {showCc && (
                                <div className="relative flex items-center flex-wrap gap-1  pb-2 border-b border-gray-300 focus-within:border-blue-500">
                                    <span className=" text-gray-600 whitespace-nowrap">Cc</span>
                                    <div className="flex flex-wrap items-center gap-1 flex-1">
                                        {ccEmails.map((email, index) => (
                                            <div key={index} className="flex items-center bg-blue-100 rounded-full px-2 py-0.5 ml-1">
                                                <span className="text-xs">{email}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        removeEmail(index, ccEmails, setCcEmails);
                                                        setShowCc(false);
                                                    }}
                                                    className="ml-1 text-gray-500 hover:text-gray-700 text-xs"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                        <input
                                            id="cc"
                                            type="email"
                                            className="flex-1 min-w-[100px] bg-transparent outline-none   px-1"
                                            value={currentCcInput}
                                            onChange={(e) => setCurrentCcInput(e.target.value)}
                                            onKeyDown={(e) => handleEmailInputKeyDown(e, currentCcInput, ccEmails, setCcEmails, setCurrentCcInput)}
                                            onBlur={() => {
                                                if (currentCcInput && isValidEmail(currentCcInput)) {
                                                    if (!ccEmails.includes(currentCcInput)) {
                                                        setCcEmails([...ccEmails, currentCcInput]);
                                                        setCurrentCcInput('');
                                                    }
                                                }
                                            }}
                                        />
                                        {/* New "cross" button to hide the entire Cc field */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCcEmails([]); // Clear all BCC emails
                                                setCurrentCcInput(''); // Clear input field
                                                setShowCc(false); // Hide BCC field
                                            }}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            )}

                            {showBcc && (
                                <div className="relative flex items-center flex-wrap gap-1  py-1 border-b border-gray-300 focus-within:border-blue-500">
                                    <span className=" text-gray-600 whitespace-nowrap">Bcc</span>
                                    <div className="flex flex-wrap items-center gap-1 flex-1">
                                        {bccEmails.map((email, index) => (
                                            <div key={index} className="flex items-center bg-purple-100 rounded-full px-2 py-0.5 ml-1">
                                                <span className="text-xs">{email}</span>
                                                <button type="button" onClick={() => removeEmail(index, bccEmails, setBccEmails)} className="ml-1 text-gray-500 hover:text-gray-700 text-xs">
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                        <input
                                            id="bcc"
                                            type="email"
                                            className="flex-1 min-w-[100px] bg-transparent outline-none  py-1 px-1"
                                            value={currentBccInput}
                                            onChange={(e) => setCurrentBccInput(e.target.value)}
                                            onKeyDown={(e) => handleEmailInputKeyDown(e, currentBccInput, bccEmails, setBccEmails, setCurrentBccInput)}
                                            onBlur={() => {
                                                if (currentBccInput && isValidEmail(currentBccInput)) {
                                                    if (!bccEmails.includes(currentBccInput)) {
                                                        setBccEmails([...bccEmails, currentBccInput]);
                                                        setCurrentBccInput('');
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    {/* Close button to hide AND clear BCC field */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBccEmails([]); // Clear all BCC emails
                                            setCurrentBccInput(''); // Clear input field
                                            setShowBcc(false); // Hide BCC field
                                        }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}

                            {/* Subject Field */}
                            <div>
                                <span className="text-gray-500 "></span>
                                <input
                                    id="subject"
                                    type="text"
                                    className="w-full py-2  cornflower:placeholder:text-black peach:placeholder:text-black lightmint:placeholder:text-black dark:text-white dark:placeholder:text-white bg-transparent  border-b dark:border-b-[white] focus:outline-none"
                                    placeholder="Subject"
                                    defaultValue={emailData ? emailData.subject : params.subject}
                                    onChange={changeValue}
                                    name="subject"
                                />
                            </div>
                        </div>

                        {/* <div className=" ">
                                        <ReactQuill
                                        ref={quillRef}
                                            modules={modules}
                                            theme="snow"
                                            defaultValue={params.body || ''}
                                            onChange={(content, delta, source, editor) => {
                                                params.description = content;
                                                params.displayDescription = editor.getText();
                                                setParams({ ...params });
                                            }}
                                        />
                                    </div>  */}
                        <div className="w-full h-[40vh] thin-scrollbar   max-w-full overflow-y-auto  rounded-2xl p-1">
                            <EditorContent
                                editor={editor}
                                onChange={changeValue}
                                name="body"
                                defaultValue={params.body}
                                className="outline-none focus:outline-none dark:text-white focus:ring-0 focus:border-none  h-full font-sans break-words"
                            />
                        </div>

                        {attachments.length > 0 && (
                            <div className={`space-y-2 w-[400px] transition-all duration-300 ${showBar ? 'absolute bottom-28 ' : 'absolute bottom-16'}`}>
                                {attachments.map((file, index) => (
                                    <div key={index} className="relative bg-gray-100 border border-gray-300 rounded-md px-4 py-2 shadow-md">
                                        {/* Close Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-1.5 right-1.5 text-gray-400 hover:text-red-500 "
                                            aria-label="Remove file"
                                        >
                                            ✖
                                        </button>

                                        {/* File Info */}
                                        <div className="flex items-start gap-2">
                                            <IoMdAttach className="text-blue-500 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-blue-600 truncate">
                                                    {file.name}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({Math.round(file.size / 1024)} KB)
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {showBar && (
                            <div className="mt-28 w-full dark:bg-[#202127] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] lightmint:bg-[#629e7c]  pt-2 -ml-5   absolute bottom-16 flex justify-center items-center bg-white shadow-md h-10 px-3 gap-1">
                                {/* Toolbar buttons */}
                                {[
                                    {
                                        icon: <FaBold />,
                                        action: () => {
                                            editor.chain().focus().toggleBold().run();
                                            toggleButtonActive('bold');
                                        },
                                        title: 'Bold',
                                        name: 'bold' as ButtonType,
                                    },
                                    {
                                        icon: <FaItalic />,
                                        action: () => {
                                            editor.chain().focus().toggleItalic().run();
                                            toggleButtonActive('italic');
                                        },
                                        title: 'Italic',
                                        name: 'italic' as ButtonType,
                                    },
                                    {
                                        icon: <FaUnderline />,
                                        action: () => {
                                            editor.chain().focus().toggleUnderline().run();
                                            toggleButtonActive('underline');
                                        },
                                        title: 'Underline',
                                        name: 'underline' as ButtonType,
                                    },
                                    {
                                        icon: <FaListUl />,
                                        action: () => {
                                            editor.chain().focus().toggleBulletList().run();
                                            toggleButtonActive('bulletList');
                                        },
                                        title: 'Bullet List',
                                        name: 'bulletList' as ButtonType,
                                    },
                                    {
                                        icon: <FaListOl />,
                                        action: () => {
                                            editor.chain().focus().toggleOrderedList().run();
                                            toggleButtonActive('orderedList');
                                        },
                                        title: 'Ordered List',
                                        name: 'orderedList' as ButtonType,
                                    },
                                    {
                                        icon: <FaAlignLeft />,
                                        action: () => {
                                            editor.chain().focus().setTextAlign('left').run();
                                            toggleButtonActive('alignLeft');
                                        },
                                        title: 'Align Left',
                                        name: 'alignLeft' as ButtonType,
                                    },
                                    {
                                        icon: <FaAlignRight />,
                                        action: () => {
                                            editor.chain().focus().setTextAlign('right').run();
                                            toggleButtonActive('alignRight');
                                        },
                                        title: 'Align Right',
                                        name: 'alignRight' as ButtonType,
                                    },
                                ].map(({ icon, action, title, name }, i) => (
                                    <button
                                        type="button"
                                        key={i}
                                        title={title}
                                        className={`p-2 mr-2 mb-2 border rounded flex items-center justify-center ${activeButtons.includes(name as ButtonType) ? ' bg-[#c2e7ff] text-black' : 'bg-gray-100'
                                            }`}
                                        onClick={action}
                                    >
                                        {icon}
                                    </button>
                                ))}

                                {/* Text Color */}
                                <div
                                    ref={colorDivRef}
                                    className={`relative p-2 mr-2 mb-2 border rounded flex items-center justify-center cursor-pointer ${activeButtons.includes('color') ? 'bg-[#c2e7ff] text-black' : 'bg-gray-100'
                                        }`}
                                    title="Text Color"
                                    onClick={() => {
                                        setShowTextColorPicker(!showTextColorPicker);
                                        setShowBgColorPicker(false);
                                        toggleButtonActive('color');
                                    }}
                                >
                                    <FaPalette />
                                    {showTextColorPicker && (
                                        <div ref={popupRef} className="absolute bottom-[110%] z-10">
                                            <ChromePicker color="#000000" onChange={(color: any) => editor.chain().focus().setColor(color.hex).run()} />
                                        </div>
                                    )}
                                </div>

                                {/* Background Color */}
                                <div
                                    ref={bgColorDivRef}
                                    className={`relative p-2 mr-2 mb-2 border rounded flex items-center justify-center cursor-pointer ${activeButtons.includes('bgColor') ? 'bg-[#c2e7ff] text-black' : 'bg-gray-100'
                                        }`}
                                    title="Background Color"
                                    onClick={() => {
                                        setShowBgColorPicker(!showBgColorPicker);
                                        setShowTextColorPicker(false);
                                        toggleButtonActive('bgColor');
                                    }}
                                >
                                    <FaFillDrip />
                                    {showBgColorPicker && (
                                        <div ref={popupRef} className="absolute bottom-[110%] z-10">
                                            <ChromePicker
                                                color="#ffffff"
                                                onChange={(color: any) =>
                                                    editor
                                                        .chain()
                                                        .focus()
                                                        .setMark('textStyle', {
                                                            backgroundColor: color.hex,
                                                        })
                                                        .run()
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {showLinkInput && (
                            <div
                                ref={popupRef}
                                className="absolute peach:bg-[#1b2e4b] bg-white cornflower:bg-[#6BB8C5] dark:bg-[#202127] lightmint:bg-[#629e7c]  shadow-xl p-4 border border-gray-200 rounded-lg z-50 mt-[80px] w-72"
                            >
                                {/* Text input at the top with icon */}
                                <div className="flex items-center mb-2 relative">
                                    <input
                                        type="text"
                                        placeholder="Text"
                                        value={linkText}
                                        onChange={(e) => setLinkText(e.target.value)}
                                        className="border border-gray-400 p-1   dark:bg-[#2F2F2F] flex-1 rounded pl-10 focus:border-2 focus:border-blue-500 focus:outline-none"
                                    />
                                    <MdShortText className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />

                                    <button type="button" className="ml-2  flex items-center gap-1 invisible w-[60px]">
                                        Apply
                                    </button>
                                </div>

                                {/* URL input at the bottom with icon + Apply button on right */}
                                <div className="flex items-center mb-2 relative">
                                    <input
                                        type="text"
                                        placeholder="Type or paste a link"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        className="border dark:bg-[#2F2F2F] border-gray-400 p-1  flex-1 rounded pl-10 focus:border-2 focus:border-blue-500 focus:outline-none"
                                    />
                                    <MdOutlineInsertLink className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />

                                    <button
                                        type="button"
                                        onClick={applyLink}
                                        className="ml-2 cornflower:text-black text-blue-600 peach:text-white lightmint:text-black dark:text-white  flex items-center gap-1"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* <input
                                        type="file"
                                        className="mt-3 file:py-2 file:px-4 file:border-0 file:font-medium file:bg-primary/90 file:text-white file:hover:bg-primary rounded-md"
                                        multiple
                                        accept="image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx"
                                    /> */}

                        {/* Action Buttons */}

                        {/* Left side<button className="w-full rounded-lg bg-white text-black font-bold test-base flex items-center py-2">: Send + Options + Icons */}
                        {!isMinimized && (
                            <div className="w-full absolute bottom-0 left-0 border-t softazure:bg-[#9a8c98] cornflower:bg-[#6BB8C5] dark:bg-[#202127] peach:text-white peach:bg-[#1b2e4b] lightmint:bg-[#629e7c] lightmint:text-white dark:text-white bg-white px-4 py-2 flex justify-between items-center salmonpink:bg-[#006d77] blue:bg-[#bbdefb]">
                                <div className="flex items-center space-x-3">
                                    <div className="flex">
                                        <button
                                            type="button"
                                            className={`border-r-[1] flex py-2 softazure:bg-[#f2e9e4] softazure:text-black classic:bg-[#a8c7fa] classic:text-black cornflower:bg-gray-100 cornflower:text-black lightmint:text-black peach:bg-gray-100 peach:text-black lightmint:bg-green-50 text-white pr-5 dark:bg-[#2F2F2F] dark:text-white bg-[#2565C7] pl-5 rounded-l-md items-center gap-2 mb-1 salmonpink:bg-[#edf6f9] salmonpink:text-gray-900 ${isSending ? 'opacity-75 cursor-not-allowed' : ''}`}
                                            onClick={() => saveMail()}
                                            disabled={isSending}
                                        >
                                            {isSending ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                'Send'
                                            )}
                                        </button>

                                        <div
                                            ref={sendOptionDivRef}
                                            onClick={() => setSendOption(!sendOption)}
                                            className="bg-[#2565C7]   dark:bg-[#2F2F2F] softazure:bg-[#f2e9e4] classic:bg-[#a8c7fa] classic:text-black cornflower:bg-gray-100 cornflower:text-black  peach:bg-gray-100   lightmint:bg-green-50 lightmint:text-white dark:text-white pr-3 flex cursor-pointer justify-center items-center pl-1 rounded-r-md border-l dark:border-white border-black h-9 salmonpink:bg-[#edf6f9] salmonpink:text-gray-900"
                                        >
                                            <span>
                                                {sendOption ? (
                                                    <>
                                                        <IoCaretUpOutline className="text-white  cornflower:text-black classic:text-black lightmint:text-black  peach:text-black dark:text-white" />
                                                        <div
                                                            ref={popupRef}
                                                            className="absolute left-5 bottom-16 shadow-md p-4 lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127]  dark:border-gray-900 w-[320px] bg-white rounded-lg  border border-gray-300 salmonpink:bg-[#42999b]"
                                                        >
                                                            <button className="w-full rounded-lg lightmint:bg-[#629e7c] lightmint:text-white dark:bg-[#202127] dark:text-white text-black font-bold text-base flex items-center salmonpink:bg-[#42999b]">
                                                                <span className="text-2xl text-gray-400">{/* <MdOutlineScheduleSend /> */}</span>
                                                                Schedule send
                                                            </button>

                                                            <p className=" text-gray-500 dark:text-white lightmint:text-white ">When do you want your message to be sent?</p>

                                                            {/* Divider that extends beyond the padding */}
                                                            <div className="-mx-4   bg-gray-300 my-3 w-[calc(100%+2rem)]"></div>

                                                            {/* Time options */}
                                                            <div className="flex flex-col  w-full ">
                                                                <div className="flex items-center justify-between group -mx-4 px-4 py-2 hover:bg-gray-100">
                                                                    <button className="text-left  group-hover:text-black dark:text-white lightmint:text-white text-slate-900 w-full">
                                                                        Tomorrow
                                                                    </button>
                                                                    <span className=" text-gray-500 ml-4 group-hover:text-black dark:text-white lightmint:text-white whitespace-nowrap">
                                                                        {getTomorrowFormatted()}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center justify-between group -mx-4 dark:hover:text-black px-4 py-2 hover:bg-gray-100">
                                                                    <button className="text-left  dark:text-white lightmint:text-white group-hover:text-black text-slate-900 w-full">
                                                                        Monday
                                                                    </button>
                                                                    <span className=" text-gray-500 dark:text-white lightmint:text-white group-hover:text-black ml-4 whitespace-nowrap">
                                                                        {getNextMondayFormatted()}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center justify-between hover:text-black group -mx-4 dark:hover:text-black px-4 py-2 hover:bg-gray-100">
                                                                    <span
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setOpenDatePicker(!openDatePicker);
                                                                        }}
                                                                        className="block text-left w-full h-full  cursor-pointer"
                                                                    >
                                                                        Custom
                                                                    </span>
                                                                    <span className=" text-gray-500 lightmint:text-white dark:text-white  group-hover:text-black ml-4 whitespace-nowrap">
                                                                        {formatCustomDate(customDate)}
                                                                    </span>
                                                                </div>

                                                                {openDatePicker && (
                                                                    <DatePickerModal
                                                                        onClose={() => setOpenDatePicker(false)}
                                                                        mailId="your-mail-id" // or use a proper mail ID
                                                                        onSave={(mailId, date) => handleSaveSnooze(mailId, date)}
                                                                        initialDate={customDate || new Date()} // Provide fallback
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <IoCaretDownOutline className="text-white cornflower:text-black classic:text-black lightmint:text-black peach:text-black dark:text-white" />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Icon Buttons */}
                                    <div className="flex items-center space-x-2  salmonpink:text-white">
                                        <Tippy content="Formatting option">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setManageButton((prev) => !prev); // toggle your state
                                                    toggleBar(); // call your existing function
                                                }}
                                                className="p-1 peach:text-white dark:hover:text-black peach:hover:text-black lightmint:text-white lightmint:hover:text-black hover:bg-gray-200 rounded transition salmonpink:hover:text-gray-900"
                                            >
                                                <MdOutlineFormatColorText size={18} />
                                            </button>
                                        </Tippy>
                                        {/* <Tippy content="Help me write (Alt + H) ">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition">
                        <MdOutlineEdit size={18} />
                    </button>
                </Tippy> */}
                                        <Tippy content="Attach file">
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('fileInput')?.click()}
                                                    className="p-1 hover:bg-gray-200 dark:hover:text-black peach:text-white peach:hover:text-black lightmint:text-white lightmint:hover:text-black rounded transition salmonpink:hover:text-gray-900"
                                                >
                                                    <IoMdAttach size={18} />
                                                </button>
                                                <input type="file" ref={fileInputRef} id="fileInput" multiple onChange={handleFileChange} className="hidden" />
                                            </div>
                                        </Tippy>
                                        <Tippy content="Insert link">
                                            <button
                                                ref={triggerRef}
                                                type="button"
                                                onClick={openLinkInput}
                                                className="p-1 peach:text-white dark:hover:text-black peach:hover:text-black lightmint:text-white lightmint:hover:text-black hover:bg-gray-200 rounded transition salmonpink:hover:text-gray-900"
                                            >
                                                <IoMdLink size={18} />
                                            </button>
                                        </Tippy>
                                        <div className="relative inline-block dark:hover:text-black">
                                            <Tippy content="Insert Emoji ">
                                                <button
                                                    ref={triggerRef}
                                                    type="button"
                                                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                                                    className="p-1 hover:bg-gray-200 dark:hover:text-black peach:text-white peach:hover:text-black lightmint:text-white lightmint:hover:text-black rounded transition salmonpink:hover:text-gray-900"
                                                >
                                                    <MdInsertEmoticon size={18} />
                                                </button>
                                            </Tippy>

                                            {showEmojiPicker && (
                                                <div
                                                    ref={popupRef}
                                                    className="absolute  bottom-full mb-2 left-1/2 -translate-x-2/4"
                                                    style={{
                                                        width: '380px',
                                                        maxHeight: '350px',
                                                        overflowY: 'hidden',
                                                        overflowX: 'hidden', // ⛔️ prevents horizontal scroll
                                                    }}
                                                >
                                                    <Picker
                                                        data={data}
                                                        onEmojiSelect={(emoji: any) => {
                                                            if (!editor) return;
                                                            editor.chain().focus().insertContent(emoji.native).run();
                                                            setShowEmojiPicker(false);
                                                        }}
                                                        theme="light"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <Tippy content="Insert File Using Drive">
                                            <button
                                                type="button"
                                                className="p-1 hover:bg-gray-200 dark:hover:text-black peach:text-white peach:hover:text-black lightmint:text-white lightmint:hover:text-black rounded transition salmonpink:hover:text-gray-900"
                                            >
                                                <MdAddToDrive size={18} />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Insert photo">
                                            <button
                                                type="button"
                                                className="p-1 hover:bg-gray-200 dark:hover:text-black peach:text-white peach:hover:text-black lightmint:text-white lightmint:hover:text-black rounded transition salmonpink:hover:text-gray-900"
                                            >
                                                <MdOutlinePhotoSizeSelectActual size={18} />
                                            </button>
                                        </Tippy>
                                        {/* <Tippy content="Toggle confidenntial mode">
                                            <button
                                                type="button"
                                                className="p-1 hover:bg-gray-200 dark:hover:text-black peach:text-white peach:hover:text-black lightmint:text-white lightmint:hover:text-black rounded transition salmonpink:hover:text-gray-900"
                                            >
                                                <MdOutlineLockClock size={18} />
                                            </button>
                                        </Tippy> */}
                                        {/* <Tippy content="More options">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition">
                        <BsThreeDotsVertical size={18} />
                    </button>
                </Tippy> */}
                                    </div>
                                </div>
                                <div>
                                    <Tippy content="Discard draft">
                                        <button
                                            onClick={handleCloseCompose}
                                            className="p-2 lightmint:text-white salmonpink:text-white  dark:hover:text-black peach:text-white peach:hover:text-black lightmint:hover:text-black hover:bg-gray-200 dark:text-white text-black rounded transition salmonpink:hover:text-gray-900"
                                        >
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </Tippy>
                                </div>
                                {/* Right side: Delete Button */}
                            </div>
                        )}
                    </form>
                </div>
            )}
        </>
    );
}

export default ComposeMail;
