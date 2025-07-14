'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

interface Email {
  // Define the shape of an email based on your API
  id: string;
  subject: string;
  body: string;
  // Add more fields as needed
}

interface Pagination {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  perPage: number;
}

interface MailContextType {
  pagedMails: Email[];
  paginationData: Pagination | null;
  isLoading: boolean;
  fetchEmails: (page: number, perPage: number, token: string) => void;
}

const MailContext = createContext<MailContextType | undefined>(undefined);

export const MailProvider = ({ children }: { children: React.ReactNode }) => {
  const [pagedMails, setPagedMails] = useState<Email[]>([]);
  const [paginationData, setPaginationData] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmails = useCallback((page: number, perPage: number, token: string) => {
    setIsLoading(true);

    const config = {
      url: `https://api.ubshq.com/mails?folder=Inbox&page=${page}&perPage=${perPage}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    console.log('Fetching emails for page:', page);

    axios(config)
      .then((response) => {
        console.log('Response', response.data);
        setPagedMails(response.data.emails);
        setPaginationData(response.data.pagination);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response) {
          console.error('Error:', err.response.status);
          console.error('Backend Response:', err.response.data);
        } else {
          console.error('Request Error:', err.message);
        }
      });
  }, []);

  return (
    <MailContext.Provider
      value={{
        pagedMails,
        paginationData,
        isLoading,
        fetchEmails,
      }}
    >
      {children}
    </MailContext.Provider>
  );
};

export const useMail = (): MailContextType => {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
};
