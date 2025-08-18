// context/VaultContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Vault = {
  id: string;
  key: string;
  name: string;
  icon: string;
  color: string;
};

// const DEFAULT_VAULTS: Vault[] = [
//   { id: "1", key: "personal", name: "Personal", icon: "star", color: "#6b21a8" },
//   { id: "3", key: "work", name: "Work", icon: "settings", color: "#dc2626" },
// ];

type VaultContextType = {
  vaults: Vault[];
  setVaults: React.Dispatch<React.SetStateAction<Vault[]>>;
};

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider = ({ children }: { children: ReactNode }) => {
const [vaults, setVaults] = useState<Vault[]>(() => {
  try {
    const saved = localStorage.getItem("VAULTS_STORAGE_KEY");
    return saved ? JSON.parse(saved) : []; // Always return an array
  } catch (error) {
    console.error("Failed to parse vaults from localStorage", error);
    return []; // Fallback to empty array on error
  }
});
  useEffect(() => {
    localStorage.setItem("VAULTS_STORAGE_KEY", JSON.stringify(vaults));
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
