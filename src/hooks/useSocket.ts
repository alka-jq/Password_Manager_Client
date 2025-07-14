import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { decrypt, readKey, readMessage, readPrivateKey } from 'openpgp';
import { useAuth } from '@/useContext/AppState';
import { fetchUserKeys, initializeCrypto } from '@/utils/cryptoUtils';

type EventCallback = (...args: any[]) => void;
type AckCallback = (...args: any[]) => void;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const { token } = useAuth();
  const [credentials, setCredentials] = useState<Record<string, unknown> | null>(null);

  const getDecryptedCred = useCallback(async () => {
    if (!token) return null;
    const encryptedCredentials = localStorage.getItem('encryptedCredentials');
    if (!encryptedCredentials) return null;

    try {
      await initializeCrypto(token);
      const encryptedKeys = await fetchUserKeys();
      const privateKey = await readPrivateKey({ armoredKey: encryptedKeys.privateKey });
      const message = await readMessage({ armoredMessage: encryptedCredentials });
      const { data: decryptedData } = await decrypt({
        message,
        decryptionKeys: privateKey,
        format: 'utf8'
      });

      setCredentials(JSON.parse(decryptedData));
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }, [token]);

  useEffect(() => {
    getDecryptedCred();
  }, [getDecryptedCred]);

  useEffect(() => {
    if (!credentials || !token) return;

    const newSocket = io(baseUrl, {
      auth: {
        token,
        imapCredentials: credentials
      },
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [credentials, token, baseUrl]);

  const subscribe = useCallback(
    (event: string, callback: EventCallback) => {
      if (!socket) return () => { };
      socket.on(event, callback);
      return () => socket.off(event, callback);
    },
    [socket]
  );

  const emit = useCallback(
    (event: string, data?: unknown, ackCallback?: AckCallback) => {
      if (!socket) return;
      socket.emit(event, data, ackCallback);
    },
    [socket]
  );

  const getStatus = useCallback(() => ({
    connected: socket?.connected || false,
    id: socket?.id || '',
  }), [socket]);

  return {
    subscribe,
    emit,
    getStatus,
    socket,
  };
}
