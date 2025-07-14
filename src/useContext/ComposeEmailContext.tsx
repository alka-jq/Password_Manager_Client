import { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the email data
interface EmailData {
  message_id?: string;
  thread_id?: string;
  isReply?: boolean;
  isForward?: boolean;
  is_reply_to?: string;
  subject?: string;
  to_email?:string;
  cc?: string;
  bcc?: string;
  is_reply?: boolean;
  body?: string;
  plainText?: string;
  // Add other fields as needed
}

// Define the context type
interface ComposeEmailContextType {
  isOpen: boolean;
  toggleComposeEmail: () => void;
  emailData: EmailData | null;
  setEmailData: (data: EmailData | null) => void;
  openWithData: (data: EmailData) => void;
  closeComposeEmail: () => void;
  openWithoutData: () =>void;
  resetData: ()=>void;
}

// Create context with default values
const ComposeEmailContext = createContext<ComposeEmailContextType>({
  isOpen: false,
  toggleComposeEmail: () => {},
  emailData: null,
  setEmailData: () => {},
  openWithData: () => {},
  closeComposeEmail: () => {},
  openWithoutData: ()=>{},
  resetData: ()=>{}
});

// Define props for the provider component
interface ComposeEmailContextProviderProps {
  children: ReactNode;
}

// Context Provider Component
export const ComposeEmailContextProvider = ({ children }: ComposeEmailContextProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailData, setEmailData] = useState<EmailData | null>(null);

  const toggleComposeEmail = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setEmailData(null); // Clear data when closing
    }
  };

  const openWithData = (data: EmailData) => {
    console.log(data, "Data in Context for compose email")
    setEmailData(data);
    setIsOpen(true);
  };

  const openWithoutData = ()=>{
    setIsOpen(true);
  }

  const closeComposeEmail = () => {
    setIsOpen(false);
    setEmailData(null);
  };

  // New reset function
  const resetData = () => {
    setEmailData({
      message_id: undefined,
      thread_id: undefined,
      isReply: false,
      isForward: false,
      is_reply_to: undefined,
      subject: '',
      to_email: '',
      cc: '',
      bcc: '',
      is_reply: false,
      body: '',
      plainText: ''
    });
  };

  return (
    <ComposeEmailContext.Provider
      value={{
        isOpen,
        toggleComposeEmail,
        emailData,
        setEmailData,
        openWithData,
        closeComposeEmail,
        openWithoutData,
        resetData
      }}
    >
      {children}
    </ComposeEmailContext.Provider>
  );
};

// Custom hook for easy access
export const useComposeEmail = () => {
  return useContext(ComposeEmailContext);
};