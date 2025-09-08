// context/VaultContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Vault = {
  [x: string]: string;
  id: string;
  key: string;
  name: string;
  icon: string;
  color: string;
  path: string;
};

type VaultContextType = {
  vaults: Vault[];
  setVaults: React.Dispatch<React.SetStateAction<Vault[]>>;
};

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const [vaults, setVaults] = useState<Vault[]>(() => {
    try {
      const saved = localStorage.getItem("userVaults");
      return saved ? JSON.parse(saved) : []; // Always return an array
    } catch (error) {
      console.error("Failed to parse vaults from localStorage", error);
      return []; // Fallback to empty array on error
    }
  });
  useEffect(() => {
    localStorage.setItem("userVaults", JSON.stringify(vaults));
  }, [vaults]);

  return (
    <VaultContext.Provider value={{ vaults, setVaults }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVaults = () => {
  const context = useContext(VaultContext);
  if (!context) throw new Error("useVaults must be used within VaultProvider");
  return context;
};
