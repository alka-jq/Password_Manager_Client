import { useState, useEffect } from 'react';
import { fetchEncryptedEmails } from '../api/emailAPI';
import { saveEmails, getAllEmails } from '../db/emailDb';
import { decryptEmailBatch } from '../utils/emailDecryptor';
import { DecryptedEmail } from '../types/type';
import { fetchUserKeys, initializeCrypto } from '@/utils/cryptoUtils';
import { useAuth } from '@/useContext/AppState';

// ✅ Corrected type guard based on expected structure
function isDecryptedEmail(email: any): email is DecryptedEmail {
  return email &&
    typeof email.subject === 'string' &&
    typeof email.body === 'string';
}

export const useEmailSync = () => {
  const [emails, setEmails] = useState<DecryptedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    // console.log("📥 useEmailSync useEffect fired");

    if (!token) {
      // console.warn("❌ No token found. Aborting sync.");
      return;
    }

    const syncEmails = async () => {
      // console.log("🔐 Running syncEmails()");

      try {
        setLoading(true);

        await initializeCrypto(token);
        // console.log("✅ Crypto initialized");

        await fetchUserKeys();
        // console.log("✅ User keys fetched");

        const encryptedEmails = await fetchEncryptedEmails();
        // console.log("📦 Encrypted emails fetched:", encryptedEmails);

        if (!encryptedEmails.length) {
          // console.warn("⚠️ No emails fetched.");
          return;
        }

        const decryptedResults = await decryptEmailBatch(encryptedEmails);
        // console.log("🔓 Raw decrypted emails:", decryptedResults);

        // ✅ Normalize if needed (e.g., map decryptedSubject -> subject)
        const normalizedResults: DecryptedEmail[] = decryptedResults.map((email) => ({
          ...email,
          subject: email.subject ,
          body: email.body,
        }));

        if (!normalizedResults.every(isDecryptedEmail)) {
          // console.error("🚨 Invalid structure in decrypted results:", normalizedResults);
          throw new Error("Invalid decrypted structure");
        }

        await saveEmails(normalizedResults);
        const allLocal = await getAllEmails();
        // console.log("📬 Emails stored in local DB:", allLocal);

        setEmails(allLocal);
      } catch (error) {
        // console.error("❌ Sync error:", error);
      } finally {
        setLoading(false);
      }
    };

    syncEmails();
  }, [token]);

  return { emails, loading };
};
