// src/context/EmailFetchContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Email {
  id: string;
  subject: string;
  body: string;
  created_at?: string;
  thread_id?: string;
  // Add other fields as needed
}

interface Pagination {
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
}

interface EmailFetchContextType {
  emails: Email[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  fetchEmails: (page?: number, perPage?: number) => void;
}

const EmailFetchContext = createContext<EmailFetchContextType | undefined>(undefined);

export const EmailFetchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const fetchEmails = (page = 1, perPage = 50) => {
  const token = localStorage.getItem('token'); // 🔄 Move here

  if (!token) {
    console.error('❌ Token not found. User might not be logged in.');
    setError('Authentication token is missing.');
    return;
  }

  console.log('📩 Starting email fetch...', { page, perPage });
  setIsLoading(true);
  setError(null);

  axios({
    url: `https://api.ubshq.com/mails?folder=Inbox&page=${page}&perPage=${perPage}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
    .then((response) => {
      console.group('✅ Email fetch successful');
      console.log('📊 Response data:', response.data);
      console.log('📩 Emails received:', response.data.emails.length);
      console.log('🔢 Pagination info:', response.data.pagination);
      console.groupEnd();

      setEmails(response.data.emails);
      setPagination(response.data.pagination);
    })
    .catch((err) => {
      console.group('❌ Email fetch failed');
      if (err.response) {
        console.error('🚨 Server responded with error:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
        setError(`Error ${err.response.status}: ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        console.error('🚨 No response received:', err.request);
        setError(`Network Error: ${err.message}`);
      } else {
        console.error('🚨 Request setup error:', err.message);
        setError(`Request Error: ${err.message}`);
      }
      console.groupEnd();
    })
    .finally(() => {
      console.log('🏁 Email fetch completed', { loading: false });
      setIsLoading(false);
    });
};

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <EmailFetchContext.Provider value={{ emails, pagination, isLoading, error, fetchEmails }}>
      {children}
    </EmailFetchContext.Provider>
  );
};

export const useEmailFetch = (): EmailFetchContextType => {
  const context = useContext(EmailFetchContext);
  if (!context) {
    throw new Error('useEmailFetch must be used within an EmailFetchProvider');
  }
  return context;
};
