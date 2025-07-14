import React, { ReactNode, useContext, useState } from 'react'
import AuthContext from './AppContext.js'


interface AppStateProps {
  children: ReactNode;
}

function AppState({ children }: AppStateProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId,setUserId] =  useState<string | null>(localStorage.getItem('userId'));
  const [menuBarOpen,setMenuBarOpen] = useState(false)
  const [searchData, setSearchData] = useState<any[]>([]);

  
  const setAuthToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const sideBartoggle = ()=>{
    setMenuBarOpen(!menuBarOpen)
    console.log('check')
  }

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };
  return (
   <AuthContext.Provider value={{ token, setAuthToken, logout,userId ,setUserId, menuBarOpen, setMenuBarOpen, sideBartoggle,searchData,setSearchData}}>
    {children}
   </AuthContext.Provider>
  )
}

export default AppState

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};