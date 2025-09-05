// components/VaultDropdown.tsx
import { Menu } from "@headlessui/react";
import React from "react";
import { useVaults, Vault } from "@/useContext/VaultContext";
import {
  Home, Briefcase, Gift, Store, Heart, AlarmClock, AppWindow, Settings, Users, Ghost,
  ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
  Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText, User
} from 'lucide-react';

type Props = {
  selectedTab: string;
  setSelectedTab: (key: string) => void;
  defaultKey?: string;   // ✅ configurable default option
  defaultName?: string;  // ✅ configurable default option label
  defaultIcon?: string;  // ✅ configurable default icon key
  defaultColor?: string; // ✅ configurable default color
  vaults: Vault[]
};

const iconComponents: Record<string, JSX.Element> = {
  Home: <Home size={16} />,
  Briefcase: <Briefcase size={16} />,
  Gift: <Gift size={16} />,
  Store: <Store size={16} />,
  Heart: <Heart size={16} />,
  AlarmClock: <AlarmClock size={16} />,
  AppWindow: <AppWindow size={16} />,
  Settings: <Settings size={16} />,
  Users: <Users size={16} />,
  Ghost: <Ghost size={16} />,
  ShoppingCart: <ShoppingCart size={16} />,
  Leaf: <Leaf size={16} />,
  Shield: <Shield size={16} />,
  Circle: <Circle size={16} />,
  CreditCard: <CreditCard size={16} />,
  Fish: <Fish size={16} />,
  Smile: <Smile size={16} />,
  Lock: <Lock size={16} />,
  UserCheck: <UserCheck size={16} />,
  Star: <Star size={16} />,
  Flame: <Flame size={16} />,
  Wallet: <Wallet size={16} />,
  Bookmark: <Bookmark size={16} />,
  IceCream: <IceCream size={16} />,
  Laptop: <Laptop size={16} />,
  BookOpen: <BookOpen size={16} />,
  Infinity: <Infinity size={16} />,
  FileText: <FileText size={16} />,
  Personal: <User size={16} />, // ✅ Default personal icon
};

const VaultDropdown: React.FC<Props> = ({
  selectedTab,
  setSelectedTab,
  defaultKey = "personal",        // ✅ fallback values
  defaultName = "Personal ",
  defaultIcon = "Personal",
  defaultColor = "#2563eb",
}) => {
  const { vaults } = useVaults();

  // Agar selectedTab empty ho to default option
  const selectedVault = selectedTab
    ? vaults.find((v) => v.key === selectedTab)
    : { key: defaultKey, name: defaultName, icon: defaultIcon, color: defaultColor };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200">
        {iconComponents[selectedVault?.icon || defaultIcon]}
        {selectedVault?.name || defaultName}
        <svg
          className="w-4 h-4 ml-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.657a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </Menu.Button>

      <Menu.Items className="thin-scrollbar absolute z-50 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto">
        <div className="px-1 py-1">

          {/*  Default Option (configurable) */}
          <Menu.Item key={defaultKey}>
            {({ active }) => (
              <button
                onClick={() => setSelectedTab("")}
                className={`${selectedTab === ""
                    ? "bg-gray-300 text-black"
                    : active
                      ? "bg-gray-200 text-black"
                      : "text-gray-900"
                  } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150`}
              >
                <span className="flex items-center gap-2">
                  <span style={{ color: defaultColor }}>
                    {iconComponents[defaultIcon]}
                  </span>
                  {defaultName}
                </span>
              </button>
            )}
          </Menu.Item>

          {/* ✅ User-created Vaults */}
          {vaults.map((vault) => (
            <Menu.Item key={vault.id}>
              {({ active }) => (
                <button
                  onClick={() => setSelectedTab(vault.key)}
                  className={`${selectedTab === vault.key
                      ? "bg-gray-300 text-black"
                      : active
                        ? "bg-gray-200 text-black"
                        : "text-gray-900"
                    } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150`}
                >
                  <span className="flex items-center gap-2">
                    <span style={{ color: vault.color }}>
                      {iconComponents[vault.icon]}
                    </span>
                    {vault.name}
                  </span>
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default VaultDropdown;