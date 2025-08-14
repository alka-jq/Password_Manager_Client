import React, { useState, useRef, useEffect } from "react";
import { FiLogIn, FiUser } from "react-icons/fi";
import { MdCreditCard, MdPerson, MdOutlineApps } from "react-icons/md";

const FilterDropdown = ({ typeFilter, setTypeFilter }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    {
      value: "",
      label: "All Items",
      icon: <MdOutlineApps className="text-lg mr-2" />,
    },
    {
      value: "task",
      label: "Login",
      icon: <FiLogIn className="text-lg mr-2" />,
    },
    {
      value: "card",
      label: "Card",
      icon: <MdCreditCard className="text-lg mr-2" />,
    },
    {
      value: "identity",
      label: "Identity",
      icon: <FiUser className="text-lg mr-2" />,
    },
  ];

  const selectedOption = options.find((opt) => opt.value === typeFilter) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
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
        className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm rounded-lg shadow-sm text-gray-700 dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-gray-700 transition w-36 text-left flex items-center gap-2"
      >
        {selectedOption.icon}
        {selectedOption.label}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setTypeFilter(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center text-gray-700 dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-gray-700 ${
                typeFilter === option.value ? "font-medium text-blue-600" : ""
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
