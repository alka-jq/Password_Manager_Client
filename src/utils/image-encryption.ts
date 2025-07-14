import {
  readKey,
  readPrivateKey,
  createMessage,
  encrypt,
  decryptKey,
  readMessage,
  decrypt
} from 'openpgp';
import { fetchUserKeys, initializeCrypto } from './cryptoUtils';
import { useAuth } from '@/useContext/AppState';

export const encryptAvatar = async (
  base64Data: string,
  publicKeyArmored: string
): Promise<string> => {
  try {
    const publicKey = await readKey({ armoredKey: publicKeyArmored });
    console.log(publicKey, "PUBLIC Key for encrypting image")
    // Validate base64
    const cleanBase64 = base64Data.replace(/\s/g, '');
    if (!/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
      throw new Error('Invalid base64 data detected for avatar encryption.');
    }

    // Convert base64 to binary data
    const binaryData = Uint8Array.from(atob(cleanBase64), (c) => c.charCodeAt(0));

    // Create PGP message
    const message = await createMessage({ binary: binaryData });

    // Encrypt (returns armored text)
    const encrypted = await encrypt({
      message,
      encryptionKeys: publicKey
    });

    // 🚫 Do NOT modify or remove whitespace/linebreaks in armored data
    return encrypted;
  } catch (err) {
    console.error('Error encrypting avatar:', err);
    throw err;
  }
};



export const decryptAvatar = async (encryptedAvatar: string): Promise<string | null> => {
  try {
    const token = localStorage.getItem('token');
if (token !== null) {
  await initializeCrypto(token);
} else {
  console.error('Token not found!');
}

    const encryptionKey = await fetchUserKeys(); // Replace with secure storage
    const privateKeyArmored = encryptionKey.privateKey;
    console.log(privateKeyArmored, "Private Key")
    if (!privateKeyArmored) {
      throw new Error('Missing private key or passphrase for decryption.');
    }

    // First, read the private key
    const privateKey = await readPrivateKey({ armoredKey: privateKeyArmored });

    // Only try to decrypt if the key is encrypted (has a passphrase)
    let decryptionKey;
    try {
      decryptionKey = await decryptKey({
        privateKey,
        passphrase: '' // Try empty passphrase first
      });
    } catch (e) {
      // If empty passphrase fails, try with actual passphrase if you have one
      // decryptionKey = await decryptKey({
      //   privateKey,
      //   passphrase: 'your-actual-passphrase'
      // });
      // If no passphrase is needed, just use the key as-is
      decryptionKey = privateKey;
    }

    // Parse the PGP message
    const message = await readMessage({
      armoredMessage: encryptedAvatar
    });

    // Decrypt
    const { data: decryptedBinary } = await decrypt({
      message,
      decryptionKeys: decryptionKey,
      format: 'binary' // receive as Uint8Array
    });

    // Convert binary data to base64
    const binaryString = Array.from(decryptedBinary as Uint8Array)
      .map(byte => String.fromCharCode(byte))
      .join('');
    const base64Data = btoa(binaryString);

    return base64Data;
  } catch (err) {
    console.error('Error decrypting avatar:', err);
    return null;
  }
};

