import { createContext } from "react";

interface AuthContextType {
  token: string | null;
  setAuthToken: (token: string) => void;
  setUserId: (userId: string) => void;
  logout: () => void;
  userId: string | null;
  menuBarOpen: boolean;
  sideBartoggle: () => void;
  searchData: any[];
  setSearchData: (data: any[]) => void;
  setMenuBarOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export default AuthContext;