import { openDB } from 'idb';
import { DecryptedEmail } from '../types/type';

const DB_NAME = 'EmailDB';
const STORE_NAME = 'emails';

export const initDB = async () => {
  try {
    console.log('📦 Initializing IndexedDB...');
    const db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          console.log(`🛠 Creating object store: ${STORE_NAME}`);
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        } else {
          console.log(`✅ Object store "${STORE_NAME}" already exists`);
        }
      }
    });
    console.log('✅ IndexedDB initialized');
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize DB:', error);
    throw error;
  }
};

export const saveEmails = async (emails: DecryptedEmail[]) => {
  try {
    console.log(`💾 Saving ${emails.length} emails to IndexedDB...`);
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const email of emails) {
      console.log(`➡️ Saving email with ID: ${email.id}`);
      await store.put(email);
    }

    await tx.done;
    console.log('✅ All emails saved to IndexedDB');
  } catch (error) {
    console.error('❌ Failed to save emails:', error);
  }
};

export const getAllEmails = async (): Promise<DecryptedEmail[]> => {
  try {
    console.log('📤 Fetching all emails from IndexedDB...');
    const db = await initDB();
    const emails = await db.getAll(STORE_NAME);
    console.log(`✅ Retrieved ${emails.length} emails from IndexedDB`);
    return emails;
  } catch (error) {
    console.error('❌ Failed to fetch emails:', error);
    return [];
  }
};

export const clearEmails = async () => {
  try {
    console.warn('🧹 Clearing all emails from IndexedDB...');
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.objectStore(STORE_NAME).clear();
    await tx.done;
    console.log('✅ IndexedDB store cleared');
  } catch (error) {
    console.error('❌ Failed to clear emails:', error);
  }
};
