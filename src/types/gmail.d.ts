// TypeScript type definitions for Google API and Gmail
export interface Gapi {
  client: {
    init: (args: any) => Promise<any>;
    setToken: (args: { access_token: string | null }) => void;
    gmail: {
      users: {
        labels: {
          list: (args: { userId: string }) => Promise<{ result: { labels: GmailLabel[] } }>;
        };
        messages: {
          list: (args: { userId: string; labelIds: string[]; maxResults: number; pageToken?: string }) => Promise<{ result: { messages?: GmailMessageMeta[]; nextPageToken?: string } }>;
          get: (args: { userId: string; id: string; format: string }) => Promise<{ result: GmailMessage }>;
        };
      };
    };
  };
}

export interface GmailLabel {
  id: string;
  name: string;
}

export interface GmailMessageMeta {
  id: string;
  threadId: string;
}

export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailMessage {
  id: string;
  thread_id:string;
  plain_text:string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload: {
    headers: GmailHeader[];
    mimeType: string;
    body: { data?: string };
    parts?: any[];
  };
}

// Extend window type
declare global {
  interface Window {
    gapi: Gapi;
  }
}

// src/types/type.ts
export interface DecryptedEmail {
  id: string;
  thread_id: string; // Make sure this is required (not optional)
  subject: string;
  plain_text: string;
  from_email: string;
  from?: string;
  to_email?: string;
  to?: string;
  created_at?: string;
  folder_info?: {
    type: string;
  };
}