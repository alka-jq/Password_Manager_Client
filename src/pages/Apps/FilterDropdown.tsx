import React, { useState, useRef, useEffect } from "react";
import { FiLogIn, FiUser, FiChevronDown } from "react-icons/fi";
import { MdCreditCard, MdPerson, MdOutlineApps } from "react-icons/md";

interface FilterDropdownProps {
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ typeFilter, setTypeFilter }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    {
      value: "",
      label: "All Items",
      icon: <MdOutlineApps className="text-lg mr-2" />,
      color: "text-purple-500"
    },
    {
      value: "task",
      label: "Login",
      icon: <FiLogIn className="text-lg mr-2" />,
      color: "text-blue-500"
    },
    {
      value: "card",
      label: "Card",
      icon: <MdCreditCard className="text-lg mr-2" />,
      color: "text-green-500"
    },
    {
      value: "identity",
      label: "Identity",
      icon: <FiUser className="text-lg mr-2" />,
      color: "text-amber-500"
    },
  ];

  const selectedOption = options.find((opt) => opt.value === typeFilter) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm rounded-xl shadow-sm hover:shadow-md text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 w-44 text-left flex items-center justify-between"
      >
        <div className="flex items-center">
          <span className={`${selectedOption.color} mr-2`}>
            {selectedOption.icon}
          </span>
          <span className="font-medium">{selectedOption.label}</span>
        </div>
        <FiChevronDown 
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} 
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden border border-gray-200 dark:border-gray-700">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setTypeFilter(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm flex items-center transition-all duration-150 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 ${
                typeFilter === option.value 
                  ? "bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-600 dark:text-blue-400" 
                  : "font-medium"
              }`}
            >
              <span className={`${option.color} mr-2`}>
                {option.icon}
              </span>
              {option.label}
              {typeFilter === option.value && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;