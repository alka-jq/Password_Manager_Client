import {
  readKey,
  createMessage,
  encrypt,
  readPrivateKey,
  decryptKey,
  readMessage,
  decrypt
} from 'openpgp';
import { fetchUserKeys, initializeCrypto } from './cryptoUtils';

interface EncryptedAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  encryptedData: string;
  metadata?: {
    encryptedAt: string;
    keyId?: string;
  };
}

// Encryption function for files using same pattern as encryptAvatar
export const encryptFileattachment = async (file: File, publicKeyArmored: string): Promise<EncryptedAttachment> => {
  try {
    // 1. Read file as base64 (consistent with avatar approach)
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // 2. Extract just the base64 content
    const base64Content = base64Data.split(',')[1];
    
    // 3. Validate base64 (same as avatar)
    const cleanBase64 = base64Content.replace(/\s/g, '');
    if (!/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
      throw new Error('Invalid base64 data detected for file encryption.');
    }

    // 4. Convert base64 to binary (same as avatar)
    const binaryData = Uint8Array.from(atob(cleanBase64), (c) => c.charCodeAt(0));

    // 5. Get public key
    const publicKey = await readKey({ armoredKey: publicKeyArmored });
    console.log(publicKey, "PUBLIC Key for file encryption");

    // 6. Create message and encrypt (same as avatar)
    const message = await createMessage({ binary: binaryData });
    const encryptedData = await encrypt({
      message,
      encryptionKeys: publicKey
    });
 
    return {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      encryptedData,
      metadata: {
        encryptedAt: new Date().toISOString(),
        keyId: publicKey.getKeyID().toHex()
      }
    };
  } catch (err) {
    console.error('Error encrypting file:', err);
    throw err;
  }
};

// Decryption function using same pattern as decryptAvatar
export const decryptFile = async (encryptedData: string, type?: string): Promise<string> => {
  try {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error('Invalid or missing encrypted data');
    }

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    await initializeCrypto(token);

    const encryptionKey = await fetchUserKeys();
    const privateKeyArmored = encryptionKey.privateKey;
    if (!privateKeyArmored) throw new Error('Missing private key for decryption');

    const privateKey = await readPrivateKey({ armoredKey: privateKeyArmored });

    let decryptionKey;
    try {
      decryptionKey = await decryptKey({ privateKey, passphrase: '' });
    } catch {
      decryptionKey = privateKey;
    }

    const message = await readMessage({ armoredMessage: encryptedData });

    const { data: decryptedBinary } = await decrypt({
      message,
      decryptionKeys: decryptionKey,
      format: 'binary'
    });

    const base64 = btoa(String.fromCharCode(...new Uint8Array(decryptedBinary)));
    return `data:${type || 'application/octet-stream'};base64,${base64}`;
  } catch (err) {
    console.error('Error decrypting file:', err);
    throw err;
  }
};

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}




