
import { decryptData, isEncrypted } from './cryptoUtils';

export const decryptEmailFields = async (mail:any) => {
  try {
    const [subject, body, plain_text] = await Promise.all([
      isEncrypted(mail.subject) ? decryptData(mail.subject) : mail.subject,
      isEncrypted(mail.body) ? decryptData(mail.body) : mail.body,
      mail.plain_text && isEncrypted(mail.plain_text) 
        ? decryptData(mail.plain_text) 
        : mail.plain_text
    ]);

    return {
      ...mail,
      subject,
      body,
      ...(plain_text && { plain_text })
    };
  } catch (error) {
    console.error(`Failed to decrypt mail ${mail.id}:`, error);
    return mail; // Return original if decryption fails
  }
};

export const decryptEmailBatch = async <T>(mails: T[] = []): Promise<T[]> => {
  try {
    return await Promise.all(mails.map(decryptEmailFields));
  } catch (error) {
    console.error('Batch decryption failed:', error);
    return mails;
  }
};