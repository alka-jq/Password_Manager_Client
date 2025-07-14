// encryption.ts
import { encrypt, readKey, createMessage } from 'openpgp';
import { generateUserKeyPair } from './key-generation';
import { em } from '@fullcalendar/core/internal-common';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
// List of internal domains
const INTERNAL_DOMAINS = ['ubmail.me', 'ubmail.co', 'ubmail.io', 'ubmail.ai', 'ubshq.com'];
interface EncryptionResult {
  encryptedBody: string;
  encryptedSubject: string;
  encryptionType: 'openpgp' | 'none';
  publicKeyUsed?: string;
}

export async function ensurePublicKeyExists(
  email: string,
  name: string,
  token: string
): Promise<string> {
  console.log("ENSURE ENCRYPTION KEY");
  try {
    const response = await fetch(`${baseUrl}/keys/user-keys?email=${encodeURIComponent(email)}`, {
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    if (response.ok) {
      const { publicKey } = await response.json();
      if (publicKey) return publicKey;
    }
  } catch (error) {
    console.error('Failed to fetch key:', error);
  }

  try {
    const response = await fetch(`${baseUrl}/keys/user-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, name })
    });

    if (response.ok) {
      const { publicKey } = await response.json();
      return publicKey;
    }
  } catch (error) {
    console.error('Failed to generate key:', error);
    throw new Error('Key generation failed');
  }

  throw new Error('No public key available');
}

async function fetchFromLocalCache(email: string): Promise<string | null> {
  const cachedKey = localStorage.getItem(`pgp-key-${email}`);
  if (cachedKey && isValidPGPKey(cachedKey)) {
    return cachedKey;
  }
  return null;
}

function isValidPGPKey(key: string): boolean {
  return key.includes('BEGIN PGP PUBLIC KEY BLOCK') && 
         key.includes('END PGP PUBLIC KEY BLOCK');
}

async function fetchProtonKey(email: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.protonmail.ch/pks/lookup?op=get&search=${encodeURIComponent(email)}`);
    if (response.ok) {
      const data = await response.text();
      return isValidPGPKey(data) ? data : null;
    }
  } catch (error) {
    console.warn('Proton key fetch failed:', error);
  }
  return null;
}

async function fetchTutanotaKey(email: string): Promise<string | null> {
    try {
      // Direct WKD URL (this is for a specific key hash — ideally you would compute it)
      const wkdURL = 'https://tutanota.com/.well-known/openpgpkey/tutamail.com/hu/ddf3f9ebd17b873a3818e85141b68abcb9d29f26';
  
      const response = await fetch(wkdURL);
  
      if (response.ok) {
        const keyData = await response.text();
        return isValidPGPKey(keyData) ? keyData : null;
      } else {
        console.warn(`Tutanota key fetch failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Tutanota key fetch error:', error);
    }
  
    return null;
  }
  

async function fetchFromKnownProviders(email: string): Promise<string | null> {
  const domain = email.split('@')[1];
  
  const providerHandlers: Record<string, (email: string) => Promise<string | null>> = {
    'proton.me': fetchProtonKey,
    'protonmail.com': fetchProtonKey,
    'tutamail.com': fetchTutanotaKey,
    'tutanota.com': fetchTutanotaKey,
  };

  const handler = providerHandlers[domain];
  return handler ? await handler(email) : null;
}

async function hashWKDEmailLocalPart(localPart: string): Promise<string> {
  const normalized = localPart.toLowerCase();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const digest = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function fetchViaWKD(email: string): Promise<string | null> {
  const [localPart, domain] = email.split('@');
  if (!domain) return null;

  const hashedLocalPart = await hashWKDEmailLocalPart(localPart);
  const urlsToTry = [
    `https://openpgpkey.${domain}/.well-known/openpgpkey/hu/${hashedLocalPart}`,
    `https://${domain}/.well-known/openpgpkey/hu/${hashedLocalPart}`,
    `https://${domain}/.well-known/openpgpkey/${domain}/hu/${hashedLocalPart}`,
  ];

  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 'Accept': 'application/pgp-keys' },
        redirect: 'follow'
      });
      if (response.ok) {
        const data = await response.text();
        if (isValidPGPKey(data)) return data;
      }
    } catch (error) {
      console.debug(`WKD fetch failed for ${url}:`, error);
    }
  }
  return null;
}

async function fetchViaHKP(email: string): Promise<string | null> {
  const keyservers = [
    'https://keyserver.ubuntu.com',
    'https://pgp.mit.edu',
    'https://keys.openpgp.org'
  ];

  for (const server of keyservers) {
    try {
      const response = await fetch(`${server}/pks/lookup?op=get&search=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.text();
        if (isValidPGPKey(data)) return data;
      }
    } catch (error) {
      console.debug(`HKP fetch failed for ${server}:`, error);
    }
  }
  return null;
}

async function cachePublicKey(email: string, key: string, token: string): Promise<void> {
  localStorage.setItem(`pgp-key-${email}`, key);
  
  try {
    await fetch(`${baseUrl}/keys/cache-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, publicKey: key })
    });
  } catch (error) {
    console.warn('Failed to cache key on server:', error);
  }
}

export async function discoverPublicKey(email: string, token: string): Promise<string | null> {
    console.log("Discover Public Key Triggered for email:", email);
    const domain = email.split('@')[1]?.toLowerCase();
    
    // Special handling for internal domains
    if (domain && INTERNAL_DOMAINS.includes(domain)) {
        console.log("Internal Domain Detected");
        let internalRecipientKey = await fetchInternalPublicKey(email, token);
        console.log("Discover Public Key for internal recipient:", internalRecipientKey);
        return await fetchInternalPublicKey(email, token);
    }

    // Existing discovery methods for external domains
    const discoveryMethods = [
        fetchFromLocalCache,
        fetchFromKnownProviders,
        fetchViaWKD,
        fetchViaHKP
    ];

    for (const method of discoveryMethods) {
        try {
            const key = await method(email);
            if (key) {
                await cachePublicKey(email, key, token);
                return key;
            }
        } catch (error) {
            console.warn(`Key discovery method failed:`, error);
        }
    }

    return null;
}

async function fetchInternalPublicKey(email: string, token: string): Promise<string | null> {
  console.log("Fetching public key for email:", email);
  
  try {
    // First check local cache
    const cachedKey = localStorage.getItem(`pgp-key-${email}`);
    if (cachedKey) {
      console.log("Using cached public key for", email);
      return cachedKey;
    }

    const response = await fetch(`${baseUrl}/keys/user-key?email=${encodeURIComponent(email)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const keyData = await response.json();
      console.log("Response from internal key fetch:", keyData);
      if (keyData.publicKey) {
        console.log("Public key found for", email);
        // Cache the key locally
        localStorage.setItem(`pgp-key-${email}`, keyData.publicKey);
        return keyData.publicKey;
      }
    } else if (response.status === 404) {
      console.log("No public key found for", email);
      return null;
    }
    
    console.error("Failed to fetch public key:", response.status);
    return null;
  } catch (err) {
    console.error("Error fetching internal public key:", err);
    return null;
  }
}

export async function encryptEmailContent(
  email: string,
  subject: string,
  body: string,
  token: string
): Promise<EncryptionResult> {
  const publicKeyArmored = await discoverPublicKey(email, token);
  
  if (!publicKeyArmored) {
    return {
      encryptedBody: body,
      encryptedSubject: subject,
      encryptionType: 'none'
    };
  }

  const publicKey = await readKey({ armoredKey: publicKeyArmored });
  
  const encryptedBody = await encrypt({
    message: await createMessage({ text: body }),
    encryptionKeys: publicKey,
    format: 'armored'
  });

  const encryptedSubject = await encrypt({
    message: await createMessage({ text: subject }),
    encryptionKeys: publicKey,
    format: 'armored'
  });

  return {
    encryptedBody,
    encryptedSubject,
    encryptionType: 'openpgp',
    publicKeyUsed: publicKeyArmored
  };
}

export async function encryptForMultipleRecipients(
  recipients: { email: string, type: 'to' | 'cc' | 'bcc' }[],
  subject: string,
  body: string,
  token: string
): Promise<{
  encryptedData: Array<{
    email: string;
    type: 'to' | 'cc' | 'bcc';
    encryptedSubject: string;
    encryptedBody: string;
    publicKeyUsed?: string;
  }>;
  failedRecipients: string[];
}> {
  const results = await Promise.all(
    recipients.map(async ({ email, type }) => {
      console.log("Encrypting for recipient:", email);
      try {
        const { encryptedBody, encryptedSubject, publicKeyUsed } = 
          await encryptEmailContent(email, subject, body, token);
        return {
          email,
          type,
          encryptedSubject,
          encryptedBody,
          publicKeyUsed,
          error: null
        };
      } catch (error) {
        return { 
          email, 
          type, 
          error: error instanceof Error ? error.message : String(error) 
        };
      }
    })
  );

  return {
    encryptedData: results.filter(r => !r.error) as any,
    failedRecipients: results.filter(r => r.error).map(r => r.email)
  };
}

// Updated encryptEmailForBackend function
export async function encryptEmailForBackend(
    originalEmail: {
        to_email: string;
        cc?: string;
        bcc?: string;
        subject: string;
        body: string;
        plainText: string;
        is_reply?: boolean;
        in_reply_to?: string | null;
        is_draft?: boolean;
        attachments?: any[];
        message_id?: string | null;
    },
    token: string
): Promise<{
    encryptedEmail: any;
    failedRecipients: string[];
}> {
    // Extract all recipients
    const recipients = [
        { email: originalEmail.to_email, type: 'to' as const },
        ...(originalEmail.cc ? originalEmail.cc.split(',').map(email => ({
            email: email.trim(),
            type: 'cc' as const
        })) : []),
        ...(originalEmail.bcc ? originalEmail.bcc.split(',').map(email => ({
            email: email.trim(),
            type: 'bcc' as const
        })) : [])
    ];

    // Track if ALL recipients are internal
    let allInternal = true;
    let hasCustomDomain = false;

    // Try to encrypt for each recipient
    const encryptionResults = await Promise.all(
        recipients.map(async recipient => {
            const domain = recipient.email.split('@')[1]?.toLowerCase();
            const isInternal = domain && INTERNAL_DOMAINS.includes(domain);
            
            if (!isInternal) {
                allInternal = false;
                // Check if this is a custom domain (not internal and not known provider)
                const knownProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
                if (domain && !knownProviders.includes(domain)) {
                    hasCustomDomain = true;
                }
            }
            
            // Skip encryption for internal domains (for transmission only)
            if (isInternal) {
                return { 
                    email: recipient.email, 
                    type: recipient.type, 
                    skip: true, 
                    isInternal: true 
                };
            }
            
            // Skip known non-PGP providers
            const nonPgpDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
            if (domain && nonPgpDomains.includes(domain)) {
                return { 
                    email: recipient.email, 
                    type: recipient.type, 
                    skip: true 
                };
            }

            try {
                const publicKey = await discoverPublicKey(recipient.email, token);
                if (!publicKey) {
                    // For custom domains where we can't find a key, we'll fall back to unencrypted
                    if (domain && !nonPgpDomains.includes(domain) && !isInternal) {
                        return { 
                            email: recipient.email, 
                            type: recipient.type, 
                            skip: true,
                            isCustomDomain: true
                        };
                    }
                    return { 
                        email: recipient.email, 
                        type: recipient.type, 
                        skip: false 
                    };
                }

                const publicKeyObj = await readKey({ armoredKey: publicKey });
                
                return {
                    email: recipient.email,
                    type: recipient.type,
                    encryptedBody: await encrypt({
                        message: await createMessage({ text: originalEmail.body }),
                        encryptionKeys: publicKeyObj,
                        format: 'armored'
                    }),
                    encryptedSubject: await encrypt({
                        message: await createMessage({ text: originalEmail.subject }),
                        encryptionKeys: publicKeyObj,
                        format: 'armored'
                    }),
                    encryptedPlainText: await encrypt({
                        message: await createMessage({ text: originalEmail.plainText }),
                        encryptionKeys: publicKeyObj,
                        format: 'armored'
                    }),
                    publicKeyUsed: publicKey,
                    success: true
                };
            } catch (error) {
                return { 
                    email: recipient.email, 
                    type: recipient.type,
                    success: false,
                    skip: false,
                    error: error instanceof Error ? error.message : String(error) 
                };
            }
        })
    );

    // Separate results
    const successfulEncryptions = encryptionResults.filter(r => r.success);
    const skippedEncryptions = encryptionResults.filter(r => r.skip && !r.isInternal);
    const internalRecipients = encryptionResults.filter(r => r.isInternal);
    const failedEncryptions = encryptionResults.filter(r => !r.success && !r.skip);
    const customDomainRecipients = encryptionResults.filter(r => r.isCustomDomain);

    // Determine if we had any successful encryptions (for external recipients)
    const hasExternalEncryption = successfulEncryptions.length > 0;
    const hasCustomDomainFallback = customDomainRecipients.length > 0;

    // Prepare response with appropriate content
    const encryptedEmail = {
        // Basic email info
        to_email: originalEmail.to_email,
        cc: originalEmail.cc,
        bcc: originalEmail.bcc,
        
        // Thread/conversation info
        is_reply: originalEmail.is_reply,
        in_reply_to: originalEmail.in_reply_to,
        is_draft: originalEmail.is_draft,
        message_id: originalEmail.message_id,
        
        // Content - use original content if all internal, otherwise use encrypted
        subject: allInternal ? originalEmail.subject : 
                (hasExternalEncryption ? successfulEncryptions[0].encryptedSubject : originalEmail.subject),
        body: allInternal ? originalEmail.body : 
             (hasExternalEncryption ? successfulEncryptions[0].encryptedBody : originalEmail.body),
        plainText: allInternal ? originalEmail.plainText : 
                  (hasExternalEncryption ? successfulEncryptions[0].encryptedPlainText : originalEmail.plainText),
        
        // Attachments
        attachments: originalEmail.attachments?.map(att => ({
            id: att.id,
            name: att.name,
            size: att.size,
            type: att.type,
            encryptedData: att.encryptedData
        })) || [],
        
        // Encryption info
        encryptionType: allInternal ? 'none' : (hasExternalEncryption ? 'openpgp' : 'none'),
        encryptedData: successfulEncryptions.map(recipient => ({
            email: recipient.email,
            type: recipient.type,
            encryptedSubject: recipient.encryptedSubject,
            encryptedBody: recipient.encryptedBody,
            publicKeyUsed: recipient.publicKeyUsed
        })),
        
        // Internal recipients info
        internalRecipients: internalRecipients.map(r => ({
            email: r.email,
            type: r.type
        })),
        
        // Custom domain recipients (fallback to unencrypted)
        customDomainRecipients: customDomainRecipients.map(r => ({
            email: r.email,
            type: r.type
        })),
        
        // Fallback content
        fallbackSubject: originalEmail.subject,
        fallbackBody: originalEmail.body,
        fallbackPlainText: originalEmail.plainText,
        
        // Additional metadata
        is_encrypted: hasExternalEncryption,
        is_internal: allInternal,
        has_custom_domain_fallback: hasCustomDomainFallback,
        encryption_recipients: successfulEncryptions.map(r => r.email),
        skipped_recipients: skippedEncryptions.map(r => r.email),
        custom_domain_recipients: customDomainRecipients.map(r => r.email)
    };

    return {
        encryptedEmail,
        // Only report true failures (not custom domain fallbacks)
        failedRecipients: failedEncryptions.map(r => r.email)
    };
}

  
  // Helper function to get fingerprint from public key
  async function getFingerprint(publicKey: string): Promise<string | null> {
    try {
      const key = await readKey({ armoredKey: publicKey });
      return key.getFingerprint().toUpperCase();
    } catch {
      return null;
    }
  }
  

async function fetchAutocryptKey(email: string): Promise<string | null> {
  return null;
}

async function fetchManualKey(email: string): Promise<string | null> {
  return null;
}

// Helper functions
export async function getOrCreateSenderKey( token: string): Promise<string | null> {
  try {
    // First try to get existing key
    const getResponse = await fetch(`${baseUrl}/keys/user-key`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (getResponse.ok) {
      const keyData = await getResponse.json();
      console.log(keyData, "Response is okay");
      if (keyData.publicKey) return keyData.publicKey;
    }else{
            // If no key exists, create one
    const createResponse = await fetch(`${baseUrl}/keys/user-keys`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: "himan@ubmail.me", name: "Himanshu" })
      });
      
      if (createResponse.ok) {
        const keyData = await createResponse.json();
        return keyData.public_key;
      }
    }


    
    return null;
  } catch (err) {
    console.error("Error getting/sender key:", err);
    return null;
  }
}


export async function encryptForStorage(
    subject: string,
    body: string,
    plainText: string,
    publicKey: string,
    type="Send"
  ): Promise<{
    subject: string;
    body: string;
    plainText: string;
  }> {
    try {
      console.log("Encryption input:", { 
        subject: subject, 
        body: body, 
        plainText: plainText, 
        publicKey: publicKey ? "exists" : "missing" 
      });
  
      // if (!subject || !body || !plainText || !publicKey && type == 'Send') {
      //   throw new Error("Missing required parameters for encryption");
      // }
  
      // Import OpenPGP the same way as encryptEmailForBackend
      const { encrypt, readKey, createMessage } = await import('openpgp');
      
      // Parse public key with the same approach
      let publicKeyObj;
      try {
        publicKeyObj = await readKey({ armoredKey: publicKey });
        console.log("Public key parsed successfully");
      } catch (keyError) {
        console.error("Public key parsing failed:", keyError);
        throw new Error("Invalid public key format");
      }
  
      // Use the same encryption pattern as encryptEmailForBackend
      const encryptField = async (text: string, fieldName: string): Promise<string> => {
        try {
          const message = await createMessage({ text });
          const encrypted = await encrypt({
            message,
            encryptionKeys: publicKeyObj,
            format: 'armored'
          });
          
          // The working function doesn't check encrypted.data directly
          // Return the full encrypted object and extract data later
          return encrypted;
        } catch (err) {
          console.error(`Encryption failed for ${fieldName}:`, err);
          throw err;
        }
      };
  
      // Process fields sequentially like the working function
      const encryptedSubject = subject !=="" ? await encryptField(subject, 'subject') : "";
      const encryptedBody = body !== "" ? await encryptField(body, 'body') : "";
      const encryptedPlainText = plainText !== "" ? await encryptField(plainText, 'plainText') : "";
  
      console.log("Encryption results:", {
        subject:  encryptedSubject,
        body:  encryptedBody,
        plainText:  encryptedPlainText
      });
  
      // Return the .data property for each, matching the working function's structure
      return {
        subject: encryptedSubject || '',
        body: encryptedBody || '',
        plainText: encryptedPlainText || ''
      };
      
    } catch (err) {
      console.error("Encryption for storage failed:", err);
      throw err;
    }
  }