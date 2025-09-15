import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import lunr from 'lunr';
import { DecryptedEmail } from '@/types/type';

// interface DecryptedEmail {
//   id: string;
//   thread_id: string;
//   subject: string;
//   plain_text: string;
//   from_email: string;
//   from?: string;
//   to_email?: string;
//   to?: string;
//   created_at?: string;
//   folder_info?: {
//     type: string;
//   };
// }

interface SearchPopupProps {
  openSearch: boolean;
  setOpenSearch: (value: boolean) => void;
  emails: DecryptedEmail[];
}

const SearchPopup: React.FC<SearchPopupProps> = ({ openSearch, setOpenSearch, emails }) => {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const popupInputRef = useRef<HTMLInputElement>(null);

  // Search states
  const [searchAdvanceTerm, setSearchAdvanceTerm] = useState('');
  const [lunrAdvIndex, setLunrAdvIndex] = useState<lunr.Index | null>(null);
  const [searchIn, setSearchIn] = useState('All mail');
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchOption, setSearchOption] = useState(false);
  const [isAdvancedSearchTriggered, setIsAdvancedSearchTriggered] = useState(false);

  // Set up Lunr index
  useEffect(() => {
    if (!emails.length) return;

    const idx = lunr(function () {
      this.ref('id');
      this.field('subject');
      this.field('plain_text');
      this.field('from_email');
      this.field('folder_type');

      emails.forEach((email) => {
        this.add({
          id: email.id.toString(),
          subject: email.subject || '',
          plain_text: email.plain_text || '',
          from_email: email.from_email || '',
          folder_type: email.folder_info?.type || '',
        });
      });
    });

    setLunrAdvIndex(idx);
  }, [emails]);

  const handleSearch = () => {
    setIsAdvancedSearchTriggered(true);
  };

  // Basic search (works by default)
  const basicFilteredEmails = useMemo(() => {
    const term = searchAdvanceTerm.trim();
    let results = emails;

    // Apply Lunr search if there's a search term
    if (term && lunrAdvIndex) {
      try {
        const searchResults = lunrAdvIndex.search(`*${term}*`);
        const emailMap = new Map(emails.map((e) => [e.id.toString(), e]));
        results = searchResults.map((r) => emailMap.get(r.ref)).filter(Boolean) as DecryptedEmail[];
      } catch (error) {
        // console.error('🔍 Lunr search error:', error);
        return [];
      }
    }

    // Apply folder filter
    if (searchIn !== 'All mail') {
      results = results.filter(email =>
        email.folder_info?.type?.toLowerCase() === searchIn.toLowerCase()
      );
    }

    return results;
  }, [searchAdvanceTerm, emails, lunrAdvIndex, searchIn]);

  // Advanced filters (only applied when search button is clicked)
  const finalFilteredEmails = useMemo(() => {
    if (!isAdvancedSearchTriggered) return basicFilteredEmails;

    let results = [...basicFilteredEmails];

    // Apply sender filter
    // Apply sender filter
    if (sender) {
      const senderLower = sender.toLowerCase();
      results = results.filter(email =>
      (email.from_email?.toLowerCase().includes(senderLower) ||
        email.from?.toLowerCase().includes(senderLower))
      );
    }

    // Apply recipient filter
    if (recipient) {
      const recipientLower = recipient.toLowerCase();
      results = results.filter(email =>
      (email.to_email?.toLowerCase().includes(recipientLower) ||
        email.to?.toLowerCase().includes(recipientLower))
      );
    }


    // Apply date range filter
    if (startDate || endDate) {
      results = results.filter(email => {
        if (!email.created_at) return false;

        const emailDate = new Date(email.created_at);
        emailDate.setHours(0, 0, 0, 0);

        let startMatch = true;
        let endMatch = true;

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          startMatch = emailDate >= start;
        }
        // console.log("start", startDate)
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          endMatch = emailDate <= end;
        }
        // console.log("end", endDate)
        return startMatch && endMatch;
      });
    }

    return results;
  }, [basicFilteredEmails, isAdvancedSearchTriggered, sender, recipient, startDate, endDate]);
  // console.log("filter data", finalFilteredEmails)
  // Reset all search filters
  const resetForm = () => {
    setSearchAdvanceTerm('');
    setSearchIn('All mail');
    setSender('');
    setRecipient('');
    setStartDate('');
    setEndDate('');
    setIsAdvancedSearchTriggered(false);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpenSearch(false);
        setIsAdvancedSearchTriggered(false);
      }
    };

    if (openSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      if (popupInputRef.current) {
        popupInputRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSearch, setOpenSearch]);

  if (!openSearch) return null;

  return (
    <div
      ref={popupRef}
      className="w-[540px]  settingAnimation peach:bg-gray-100 lightmint:bg-green-50 classic:bg-gray-100 salmonpink:bg-gray-100 cornflower:bg-gray-100 blue:bg-blue-50  bg-white dark:bg-[#202127] z-50 shadow-xl rounded-xl max-h-[80vh] flex flex-col"
    >
      {/* Header with search field */}
      <div className="p-6 pb-4 border-b dark: border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <input
            ref={popupInputRef}
            value={searchAdvanceTerm}
            onChange={(e) => setSearchAdvanceTerm(e.target.value)}
            type="text"
            placeholder="Search date, name, email address, or subject line"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none dark:bg-[#2F2F2F] dark:text-white"
          />
        </div>

        {/* Search in options */}
        {/* <div className="mb-4">
          <h3 className=" font-medium text-gray-700 dark:text-gray-300 mb-2">Search in</h3>
          <div className="flex flex-wrap gap-2">
            {['All mail', 'Inbox', 'Drafts', 'Sent'].map((option) => (
              <button
                key={option}
                type="button"
                className={`px-2 py-1  rounded-md  ${searchIn === option
                  ? 'bg-[#2565C7]  peach:bg-[#1b2e4b] lightmint:bg-[#629e7c] classic:bg-[#70a3f4] classic:text-black salmonpink:bg-[#006d77] cornflower:bg-[#6BB8C5] blue:bg-[#64b5f6] text-white dark:bg-[#2F2F2F] dark:text-blue-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                onClick={() => setSearchIn(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div> */}

        {/* <div className="flex justify-between items-center">
          <button
            onClick={() => setSearchOption(!searchOption)}
            className=" bg-[#2565C7] hover:bg-blue-600 lightmint:bg-[#629e7c] classic:bg-[#70a3f4] classic:text-black salmonpink:bg-[#006d77] cornflower:bg-[#6BB8C5] peach:bg-[#1b2e4b] blue:bg-[#64b5f6] dark:bg-[#2F2F2F] text-white px-4 py-2 rounded-md transition-colors"
          >
            {searchOption ? 'Fewer search options' : 'More search options'}
          </button>
        </div> */}
      </div>

      {/* Advanced Search options */}
      {searchOption && (
        <div className="p-6 border-b blue:bg-blue-50  peach:bg-gray-100 lightmint:bg-green-50 border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block  font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
                <input
                  type="text"
                  placeholder="Name or email address"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2F2F2F] dark:text-white"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>
              <div>
                <label className="block  font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                <input
                  type="text"
                  placeholder="Name or email address"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2F2F2F] dark:text-white"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block  font-medium text-gray-700 dark:text-gray-300 mb-1">Start date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2F2F2F] dark:text-white"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block  font-medium text-gray-700 dark:text-gray-300 mb-1">End date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2F2F2F] dark:text-white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email results */}
      <div className={`overflow-y-auto ${searchOption ? 'h-32' : 'max-h-[60vh]'} transition-all  thin-scrollbar duration-300 ease-in-out`}>
        <div className="overflow-x-auto rounded dark:border-gray-500 border">
          <table className="min-w-full divide-y divide-gray-200  dark:bg-[#202127] ">
            <tbody className="bg-white lightmint:bg-green-50 dark:bg-[#202127]  peach:bg-gray-100 divide-y divide-gray-200 dark:divide-gray-700">
              {finalFilteredEmails.length > 0 ? (
                finalFilteredEmails.map((email) => (
                  <tr
                    key={email.id}
                    onClick={() => {
                      setOpenSearch(false);
                      setIsAdvancedSearchTriggered(false);
                      navigate(`/mail_thread/${email.thread_id}`, {
                        state: {
                          id: email.id,
                          mail: email,
                          type: email.folder_info?.type || '',
                        },
                      });
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-3 whitespace-nowrap w-10">
                      <div className="flex justify-center">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="px-0 py-3">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate max-w-[300px]">{email.subject}</p>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{email.from_email || email.from}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end">
                        {email.created_at ? (
                          <>
                            <span className=" text-gray-500 dark:text-gray-400">
                              {new Date(email.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {new Date(email.created_at).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className=" text-gray-500 dark:text-gray-400">—</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500"></span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No matching emails found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="p-4 border-t border-gray-200  lightmint:bg-green-50 peach:bg-gray-100 salmonpink:bg-gray-100 dark:border-gray-700 bg-white dark:bg-[#202127]">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2  font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2  font-medium text-white lightmint:bg-[#629e7c]  classic:bg-[#70a3f4] classic:text-black salmonpink:bg-[#006d77] cornflower:bg-[#6BB8C5] peach:bg-[#1b2e4b] bg-[#2565C7] blue:bg-[#64b5f6] rounded-md hover:bg-blue-700 dark:bg-[#2F2F2F] transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;