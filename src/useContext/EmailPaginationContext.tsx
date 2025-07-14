import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { useAuth } from '../useContext/AppState';
const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
interface PaginationState {
  inboxCount: number;
  draftsCount: number;
  starredCount: number;
  unreadCount: number;
  systemFolder: object;
}

interface EmailPaginationContextType {
  pagination: PaginationState;
  refreshCounts: () => void;
}

interface EmailPaginationProviderProps {
  children: ReactNode;
}

const EmailPaginationContext = createContext<EmailPaginationContextType | undefined>(undefined);

export const EmailPaginationProvider = ({ children }: EmailPaginationProviderProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    inboxCount: 0,
    draftsCount: 0,
    starredCount: 0,
    unreadCount: 0,
    systemFolder: {}
  });

  const { token } = useAuth();

  const fetchPagination = async () => {
    if (!token) {
      console.warn('🔐 No token found, skipping email count fetch.');
      return;
    }

    console.log('📬 Fetching email pagination counts...', token);

    try {
      const response = await fetch(`${baseUrl}/mails/counts`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("count-------------", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log('✅ Email pagination data:', json);
      console.log("system folder---------",json.counts.folders)
      const folders = json.counts?.folders || {};

      let inboxUnread = 0;
      let draftsTotal = 0;

      for (const folderId in folders) {
        const folder = folders[folderId];
        if (folder.type === 'inbox') {
          inboxUnread = folder.unread || 0;
        }
        if (folder.type === 'drafts') {
          draftsTotal = folder.total || 0;
        }
      }

      setPagination({
        inboxCount: inboxUnread,
        draftsCount: draftsTotal,
        starredCount: json.counts.starred || 0,
        unreadCount: json.counts.unread || 0,
        systemFolder: json.counts.folders || {}
      });

    } catch (err) {
      console.error("❌ Failed to fetch email counts:", err);
    }
  };

  useEffect(() => {
    fetchPagination();
  }, [token]);

  return (
    <EmailPaginationContext.Provider value={{ pagination, refreshCounts: fetchPagination }}>
      {children}
    </EmailPaginationContext.Provider>
  );
};

export const useEmailPagination = (): EmailPaginationContextType => {
  const context = useContext(EmailPaginationContext);
  if (!context) {
    throw new Error('useEmailPagination must be used within an EmailPaginationProvider');
  }
  return context;
};
