export interface EncryptedEmail {
  id: string;
  subject: string;
  body: string;
  // any other encrypted fields
}
const token = localStorage.getItem("token")
export const fetchEncryptedEmails = async (): Promise<EncryptedEmail[]> => {
  try {
    const response = await fetch('https://api.ubshq.com/mails?folder=Inbox,Sent,Draft,Archive', {
      method: 'GET',
        headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to fetch emails');

    const data = await response.json();
    console.log("data for search",data)
    return data.emails as EncryptedEmail[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
