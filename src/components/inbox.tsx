import React, { useState, useMemo, useEffect } from 'react';
import { DecryptedEmail } from '../types/type';
import lunr from 'lunr';
import { useEmailSync } from '@/hooks/useEmailSync';

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const Inbox: React.FC = () => {
  const { emails, loading } = useEmailSync();
  const [searchTerm, setSearchTerm] = useState('');
  const [lunrIndex, setLunrIndex] = useState<lunr.Index | null>(null);

  useEffect(() => {
    console.log("📦 Setting up Lunr index", emails);

    if (!emails.length) return;

    const idx = lunr(function () {
      this.ref('id');
      this.field('subject');
      this.field('plain_text');
      this.field('from_email'); // ✅ Searchable field

      emails.forEach((email) => {
        this.add({
          id: email.id.toString(),
          subject: email.subject || '',
          plain_text: email.plain_text || '',
          from_email: email.from_email || '',
        });
      });
    });

    console.log('✅ Built Lunr index');
    setLunrIndex(idx);
  }, [emails]);

  const filteredEmails = useMemo(() => {
    const term = searchTerm.trim();

    if (!term || !lunrIndex) return emails;

    try {
      const results = lunrIndex.search(`*${term}*`);
      const emailMap = new Map(emails.map((e) => [e.id.toString(), e]));

      return results.map((r) => emailMap.get(r.ref)).filter(Boolean) as DecryptedEmail[];
    } catch (error) {
      console.error('🔍 Lunr search error:', error);
      return [];
    }
  }, [searchTerm, emails, lunrIndex]);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading emails...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inbox (with Lunr.js)</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by subject, plain text, or from email..."
        className="w-full mb-4 p-2 border rounded"
      />

      {filteredEmails.length > 0 ? (
        <ul>
          {filteredEmails.map((email) => (
            <li key={email.id} className="border-b py-2">
              <h4 className="font-semibold">{email.subject}</h4>
              <p>{stripHtml(email.body)}</p>
              <p className="text-sm text-gray-500">From: {email.from_email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>No matching emails found.</div>
      )}
    </div>
  );
};

export default Inbox;
