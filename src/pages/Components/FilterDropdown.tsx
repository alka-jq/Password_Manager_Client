// FilterDropdown.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { filterConfig } from './filterConfig'; // Correct path se import karna

type Props = {
  selected: string;
  onChange: (val: string) => void;
};

const FilterDropdown = ({ selected, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const options = Object.keys(filterConfig);

  return (
    <div className="relative w-[12vw] ml-4 mt-2 text-sm z-20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center border px-3 py-2 bg-white rounded shadow-sm"
      >
        <span className="flex gap-2 items-center">
          {filterConfig[selected].icon}
          {filterConfig[selected].label}
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1">
          {options.map(option => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              {filterConfig[option].icon}
              {filterConfig[option].label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
