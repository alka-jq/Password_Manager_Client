import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { GmailLabel, GmailMessage, GmailHeader } from '../../types/gmail';
import { useAuth } from '../../useContext/AppState';
import { useSettings } from '@/useContext/useSettings';
function GmailImport() {
  const [status, setStatus] = useState<string>('idle');
  const [importResult, setImportResult] = useState<null | { imported: number; messages: ProcessedEmail[] }>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userPassword, setUserPassword] = useState<string>('');
  const [labels, setLabels] = useState<GmailLabel[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({});
  const [countingProgress, setCountingProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
 const { token } = useAuth();
 const {profile} = useSettings();
 console.log(token)
  // Initialize Google API
  const loadGapiClient = async (): Promise<void> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        (window as any).gapi.load('client', () => {
          (window as any).gapi.client.init({
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
          }).then(resolve);
        });
      };
      document.body.appendChild(script);
    });
  };

  

  const startAuth = () => {
    setStatus('authenticating');
    const authWindow = window.open(`${baseUrl}/google/auth`, '_blank', 'width=500,height=600');
  
    const receiveMessage = (event: MessageEvent) => {
    //   if (event.origin !== 'https://api.ubshq.com') return;
      const { access_token } = event.data;
      if (access_token) {
        setAccessToken(access_token);
        setStatus('ready_to_import');
        window.removeEventListener('message', receiveMessage);
        if (authWindow) authWindow.close();
      }
    };
    window.addEventListener('message', receiveMessage, false);
  };

  // Fetch labels and EXACT message counts
  const fetchLabels = async () => {
    try {
      setStatus('loading_labels');
      await loadGapiClient();
      (window as any).gapi.client.setToken({ access_token: accessToken });
      
      // Get labels
      const labelsResponse = await (window as any).gapi.client.gmail.users.labels.list({
        userId: 'me'
      });
      
      const labelsData: GmailLabel[] = labelsResponse.result.labels || [];
      setLabels(labelsData);
      setCountingProgress({ current: 0, total: labelsData.length });
      
      // Get EXACT message counts for each label
      const counts: Record<string, number> = {};
      for (const [index, label] of labelsData.entries()) {
        try {
          let totalMessages = 0;
          let pageToken: string | undefined = undefined;
          
          do {
            const messagesResponse: { result: { messages?: { id: string }[]; nextPageToken?: string } } = await (window as any).gapi.client.gmail.users.messages.list({
              userId: 'me',
              labelIds: [label.id],
              maxResults: 500, // Maximum allowed by API
              pageToken: pageToken || undefined
            });
            
            totalMessages += messagesResponse.result.messages?.length || 0;
            pageToken = messagesResponse.result.nextPageToken;
            
            // For performance, we'll stop counting after 1000 messages per label
            if (totalMessages >= 1000) {
              totalMessages = 1000;
              break;
            }
          } while (pageToken);
          
          counts[label.id] = totalMessages;
        } catch (err) {
          console.error(`Error counting messages for label ${label.name}:`, err);
          counts[label.id] = 0;
        }
        
        setCountingProgress(prev => ({ ...prev, current: index + 1 }));
      }
      
      setMessageCounts(counts);
      setStatus('labels_loaded');
    } catch (err) {
      console.error('Failed to fetch labels:', err);
      setStatus('error');
    }
  };

  // Toggle label selection
  const toggleLabelSelection = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId) 
        : [...prev, labelId]
    );
  };
const storeImportedEmails = async (importedMessages: Map<string, ProcessedEmail>) => {
  // Convert Map to array of objects (flatten to include message_id)

  console.log("import inbox-0-----------", importedMessages)
  const emails = Array.from(importedMessages.entries()).map(([id, email]) => ({
    message_id: id,
    ...email
  }));
console.log("email----------------",emails)
  try {
    const response = await fetch(`${baseUrl}/mails/store-emails-to-db`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      body: JSON.stringify({ emails })
    });

    if (!response.ok) {
      console.error("Failed to store imported emails:", await response.text());
      return;
    }

    const data = await response.json();
    console.log("Emails stored:", data);
  } catch (error) {
    console.error("Error during email storage:", error);
  }
};


const handleImport = async () => {
  try {
    setStatus('importing');
    const importedMessages = new Map<string, ProcessedEmail>();

    // Fetch messages from selected labels
    for (const labelId of selectedLabels) {
      let pageToken: string | undefined = undefined;
      let messages: { id: string }[] = [];

      do {
        const messagesResponse: { result: { messages?: { id: string }[]; nextPageToken?: string } } = await (window as any).gapi.client.gmail.users.messages.list({
          userId: 'me',
          labelIds: [labelId],
          maxResults: 20,
          pageToken: pageToken || undefined
        });

        messages = messages.concat(messagesResponse.result.messages || []);
        pageToken = messagesResponse.result.nextPageToken;

        if (messages.length >= 20) break;
      } while (pageToken);

      // Process messages
      for (const message of messages) {
        if (importedMessages.has(message.id)) continue;

        try {
          const msgRes: { result: GmailMessage } = await (window as any).gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });

          const emailData = msgRes.result;

          const processed = processEmail(emailData,profile);
          console.log(processed, "Processed Emails")
          importedMessages.set(message.id, processed);
        } catch (err) {
          console.error(`Failed to process message ${message.id}:`, err);
        }
      }
    }

    // Finalize result
    const uniqueMessages = Array.from(importedMessages.values());
    setImportResult({
      imported: uniqueMessages.length,
      messages: uniqueMessages
    });
    setStatus('success');
   console.log(importedMessages,"imported message")
    // 🔥 Call your storage function right after import completes!
    await storeImportedEmails(importedMessages);

  } catch (err) {
    console.error('Import failed:', err);
    setStatus('error');
  }
};

  // Encryption functions
  const deriveKey = async (password: string, salt: Uint8Array = window.crypto.getRandomValues(new Uint8Array(16))) => {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    return {
      key: await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      ),
      salt
    };
  };

  const encryptData = async (data: string, keyObj: { key: CryptoKey; salt: Uint8Array }) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      keyObj.key,
      new TextEncoder().encode(data)
    );
    
    return {
      iv: Array.from(iv).join(','),
      ciphertext: Array.from(new Uint8Array(encrypted)).join(','),
      salt: Array.from(keyObj.salt).join(',')
    };
  };

  type ProcessedEmail = {
    headers: Record<string, string>;
    text: string | null;
    html: string | null;
    snippet?: string;
    id?: string;
    folder?: string;
    labels?: string[];
    is_read?:boolean;
    is_starred?: boolean;
    is_important?:boolean;
    direction?: string;
  };

  const processEmail = (emailData: GmailMessage, profile: { email: string }): ProcessedEmail => {
    // Parse headers into a more usable format
    const headers: Record<string, string> = {};
    emailData.payload.headers.forEach((header: GmailHeader) => {
        headers[header.name.toLowerCase()] = header.value;
    });

    console.log("Processing email for profile:", profile.email);
    
    const labels = emailData.labelIds || [];
    let folder = 'INBOX'; // Default folder
    const isSent = labels.includes('SENT');
    const isDraft = labels.includes('DRAFT');
    const isIncoming = !isSent && !isDraft;
    
    let body = { 
        text: null as string | null, 
        html: null as string | null, 
        is_starred: labels.includes('STARRED'),
        has_attachments: false
    };

    // Determine folder based on labels
    if (labels.includes('INBOX')) {
        folder = 'INBOX';
    } else if (isSent) {
        folder = 'SENT';
    } else if (isDraft) {
        folder = 'DRAFTS';
    } else if (labels.includes('TRASH')) {
        folder = 'TRASH';
    } else if (labels.includes('SPAM')) {
        folder = 'SPAM';
    }

    // Helper function to extract email from "Name <email@domain.com>" format
    const extractEmail = (emailString: string): string => {
        if (!emailString) return '';
        
        // Match email in angle brackets
        const match = emailString.match(/<([^>]+)>/);
        if (match) return match[1].toLowerCase().trim();
        
        // If no angle brackets, take the whole string
        return emailString.toLowerCase().trim();
    };

    // Process "from" and "to" headers based on email direction
    if (isSent || isDraft) {
        // Outgoing email - we sent it
        headers['from'] = profile.email;
        
        // For sent emails, keep the original "to" but ensure it's properly formatted
        if (headers['to']) {
            headers['to'] = extractEmail(headers['to']);
        }
    } else {
        // Incoming email - we received it
        headers['to'] = profile.email;
        
        // Format the "from" address if it exists
        if (headers['from']) {
            headers['from'] = extractEmail(headers['from']);
        }
    }

    // Process email body parts and check for attachments
    const processPart = (part: any) => {
        if (part.mimeType === 'text/plain' && part.body.data) {
            body.text = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (part.mimeType === 'text/html' && part.body.data) {
            body.html = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (part.filename && part.filename.length > 0) {
            body.has_attachments = true;
        }
        
        if (part.parts) {
            part.parts.forEach(processPart);
        }
    };
    
    processPart(emailData.payload);
    
    // Get custom labels (excluding system labels)
    const customLabels = labels.filter(label => 
        !label.startsWith('CATEGORY_') && 
        !['IMPORTANT', 'SENT', 'DRAFT', 'TRASH', 'SPAM', 'STARRED', 'INBOX', 'UNREAD'].includes(label)
    );

    return { 
        headers, 
        ...body, 
        snippet: emailData.snippet || '', 
        id: emailData.id, 
        folder, 
        labels: customLabels,
        direction: isSent ? 'outgoing' : isDraft ? 'draft' : 'incoming',
        is_read: !labels.includes('UNREAD'),
        is_important: labels.includes('IMPORTANT')
    };
};

  // Check for OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      setStatus('getting_token');
      axios.get(`${baseUrl}/google/callback?code=${code}`)
        .then(response => {
          setAccessToken(response.data.access_token);
          setStatus('ready_to_import');
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(error => {
          console.error('Token exchange failed:', error);
          setStatus('error');
        });
    }
  }, []);

  // Fetch labels when access token is available
  useEffect(() => {
    if (accessToken && status === 'ready_to_import') {
      fetchLabels();
    }
  }, [accessToken, status]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* <h1>Gmail Import</h1> */}
      
      {status === 'idle' && (
        <button 
          onClick={startAuth}
          className='softazure:bg-[#9a8c98] px-3 py-2.5  softazure:text-white cornflower:bg-[#6BB8C5] cornflower:text-white bg-[#133466] classic:bg-[#a8c7fa] classic:text-black peach:bg-[#1b2e4b] peach:text-white dark:bg-[#2F2F2F] lightmint:bg-green-50 dark:text-white rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
          // style={{ padding: '10px 15px', fontSize: '16px',backgroundColor:"#133466",color:"#fff", borderRadius:"5px" }}
        >
          Connect Gmail Account
        </button>
      )}
      
      {status === 'authenticating' && <p>Redirecting to Google...</p>}
      {status === 'getting_token' && <p>Authenticating...</p>}
      
      {status === 'ready_to_import' && (
        <div>
          <p>Successfully authenticated! Loading your labels...</p>
        </div>
      )}
      
      {status === 'loading_labels' && (
        <div>
          <p>Loading your Gmail labels...</p>
          <p>Counting messages: {countingProgress.current} of {countingProgress.total} labels processed</p>
          <progress 
            value={countingProgress.current} 
            max={countingProgress.total}
            style={{ width: '100%' }}
          />
        </div>
      )}
      
      {status === 'labels_loaded' && (
        <div>
          <h2>Select Folders/Labels to Import</h2>
          <div style={{ marginBottom: '20px' }}>
            <label>
              Encryption Password:
              <input 
                type="password" 
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
                placeholder="Enter encryption password"
              />
            </label>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
              Note: Message counts are accurate up to 1000 messages per label
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {labels.map(label => (
              <div 
                key={label.id}
                onClick={() => toggleLabelSelection(label.id)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedLabels.includes(label.id) ? '#e6f7ff' : '#fff',
                  position: 'relative'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{label.name}</div>
                <div>
                  {messageCounts[label.id] || 0} messages
                  {messageCounts[label.id] >= 1000 && (
                    <span style={{ fontSize: '0.8em', color: '#666' }}>+</span>
                  )}
                </div>
                {selectedLabels.includes(label.id) && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '15px',
                    height: '15px',
                    backgroundColor: '#1890ff',
                    borderRadius: '50%'
                  }}></div>
                )}
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleImport}
            disabled={selectedLabels.length === 0}
            style={{
              padding: '10px 15px',
              fontSize: '16px',
              backgroundColor: selectedLabels.length === 0 ? '#ccc' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedLabels.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Import Selected ({selectedLabels.length} labels)
          </button>
        </div>
      )}
      
      {status === 'importing' && (
        <div>
          <p>Importing emails from {selectedLabels.length} selected labels...</p>
          <p>This may take a few minutes depending on the number of messages.</p>
        </div>
      )}
      
      {status === 'success' && importResult && (
        <div>
          <h2>Import Results</h2>
          <p>Successfully imported {importResult.imported} messages from:</p>
          <ul>
            {selectedLabels.map(labelId => {
              const label = labels.find(l => l.id === labelId);
              return <li key={labelId}>{label?.name}</li>;
            })}
          </ul>
          {/* <h3>Sample Messages</h3> */}
          {/* <ul>
            {importResult.messages.slice(0, 5).map(msg => (
              <li key={msg.id} style={{ marginBottom: '10px' }}>
                <div><strong>Subject:</strong> {msg.headers?.subject}</div>
                <div><strong>From:</strong> {msg.headers?.from}</div>
                <div><strong>Snippet:</strong> {msg.snippet}</div>
              </li>
            ))}
          </ul> */}
        </div>
      )}
      
      {status === 'error' && (
        <p style={{ color: 'red' }}>An error occurred. Please try again.</p>
      )}
    </div>
  );
}

export default GmailImport;