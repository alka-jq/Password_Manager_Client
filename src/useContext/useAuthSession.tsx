import axios from "axios";
import { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const useSessionAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetch(`${baseUrl}/users/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json' // ✅ even though no body, ensures consistent CORS preflight
        },
        credentials: 'include' // ✅ send cookies like connect.sid
      })
        .then((res) => {
          if (!res.ok) throw new Error("Not authenticated");
          return res.json();
        })
        .then(() => setAuthenticated(true))
        .catch(() => setAuthenticated(false))
        .finally(() => setLoading(false));
    }, []);
  
    return { authenticated, loading };
  };
  export default useSessionAuth;