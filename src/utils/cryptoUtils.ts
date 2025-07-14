// src/utils/cryptoUtils.ts
import { readMessage, readPrivateKey, decrypt } from 'openpgp';

let privateKey: string | null = null;
let publicKey: string | null = null;
let authToken: string | null = null;

export const initializeCrypto = (token: string): void => {
  authToken = token;
};

export const fetchUserKeys = async (): Promise<{ publicKey: string; privateKey: string }> => {
  if (!authToken) {
    throw new Error('Authentication token not set');
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

  try {
    const response = await fetch(`${baseUrl}/keys/user-key`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch keys: ${response.status}`);
    }

    const { publicKey: pubKey, privateKey: privKey } = await response.json() as { publicKey: string, privateKey: string };
    
    // Validate keys
    if (!pubKey || !privKey) {
      throw new Error('Invalid keys received from server');
    }

    publicKey = pubKey;
    privateKey = privKey;
    
    return { publicKey, privateKey };
  } catch (error) {
    console.error('Key fetch failed:', error);
    throw error;
  }
};

export const getPrivateKey = (): string => {
  if (!privateKey) {
    throw new Error('Private key not loaded');
  }
  return privateKey;
};

export const getPublicKey = (): string => {
  if (!publicKey) {
    throw new Error('Public key not loaded');
  }
  return publicKey;
};

export const decryptData = async (encryptedData: string): Promise<string> => {
  if (!privateKey) {
    throw new Error('Private key not available');
  }

  try {
    const privateKeyObj = await readPrivateKey({ armoredKey: privateKey });
    const message = await readMessage({ armoredMessage: encryptedData });
    const { data: decrypted } = await decrypt({
      message,
      decryptionKeys: privateKeyObj,
      format: 'utf8'
    });
    return decrypted as string;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

export const isEncrypted = (data: string | undefined): boolean => {
  return data?.startsWith?.('-----BEGIN PGP MESSAGE-----') ?? false;
};