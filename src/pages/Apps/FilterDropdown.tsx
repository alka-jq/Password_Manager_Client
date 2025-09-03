import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { filterConfig } from '../Components/filterConfig';

type FilterDropdownProps = {
  selected: string;
  onChange: (val: string) => void;
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const options = Object.keys(filterConfig);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-48 sm:w-56 ml-4 mt-2 text-sm z-30" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-[140px] flex justify-between items-center border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        <span className="flex gap-2 items-center text-gray-800 dark:text-gray-200 font-medium">
          {filterConfig[selected].icon}
          {filterConfig[selected].label}
        </span>
        <ChevronDown size={16} className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-2 overflow-hidden animate-fade-in-down">
          {options.map(option => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-colors ${
                option === selected ? 'bg-blue-100 dark:bg-gray-800 font-semibold' : ''
              }`}
            >
              {filterConfig[option].icon}
              <span className="text-gray-800 dark:text-gray-100">{filterConfig[option].label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;