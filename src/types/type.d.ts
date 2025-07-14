// types.ts

// types.ts

export interface EncryptedEmail {
  id: string;
  subject: string;      
  body: string;         
  plain_text?: string;
  from?: string;
  from_email?: string;
  created_at?:string;
  thread_id?:string;
  folder_info?: {
    type?: string;
  };
  type?:string
}


// This is the decrypted version that your app uses after decryption
export interface DecryptedEmail {
  id: string;
  subject: string;
  body: string;
  plain_text?: string;
  to_email?: string;
  to?: string;
  from?: string;
  from_email?: string;
  created_at?:string;
  thread_id?:string;
   folder_info?: {
    type?: string;
  };
  type?:string
}
