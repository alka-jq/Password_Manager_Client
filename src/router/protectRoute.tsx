// src/components/ProtectedRoute.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../useContext/AppState';
import axios from 'axios';
import { EmailPaginationProvider } from '@/useContext/EmailPaginationContext';
import { ComposeEmailContextProvider } from '@/useContext/ComposeEmailContext';
import { EmailFetchProvider } from '@/useContext/EmailFetchContext';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { token } = useAuth();
  const isProd = import.meta.env.VITE_ENV === 'production';
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${baseUrl}/users/expireToken`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthenticated(res.data.valid && !res.data.expired);
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return <div>Checking session...</div>;
  }

  const isAuthenticated = isProd ? authenticated : !!token;
  if (!isAuthenticated) {
    return <Navigate to="/auth/boxed-signin" replace />;
  }

  return <>
    <EmailPaginationProvider>
      <ComposeEmailContextProvider>
        <EmailFetchProvider>
          <Outlet></Outlet>
        </EmailFetchProvider>
      </ComposeEmailContextProvider>
    </EmailPaginationProvider>
  </>;
};

export default ProtectedRoute;
