// key-generation.ts
import { generateKey } from 'openpgp';

export async function generateUserKeyPair(name: string, email: string) {
  const { privateKey, publicKey } = await generateKey({
    type: 'rsa', // Changed from 'ecc' to 'rsa'
    rsaBits: 2048, // Matches Python's key_length=2048
    userIDs: [{ name, email }],
    passphrase: '', // No passphrase to match Python's no_protection=True
    format: 'armored'
  });

  return { privateKey, publicKey };
}