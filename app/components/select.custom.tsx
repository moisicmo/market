import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export class ValueSelect {
  id: string;
  value: string;

  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}

interface Props {
  label: string;
  options: ValueSelect[];
  selected: ValueSelect | ValueSelect[] | null;
  onSelect: (value: ValueSelect | ValueSelect[] | null) => void;
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
}

export const SelectCustom = ({
  label,
  options,
  selected,
  onSelect,
  multiple = false,
  error = false,
  helperText = '',
}: Props) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: any) => {
    const found = options.find((opt) => opt.id === id);
    if (!found) return;

    if (multiple) {
      const current = Array.isArray(selected) ? selected : [];
      const exists = current.find((item) => item.id === id);
      if (exists) {
        onSelect(current.filter((item) => item.id !== id));
      } else {
        onSelect([...current, found]);
      }
      setOpen(false);
    } else {
      onSelect(found);
      setOpen(false);
    }
  };

  const isSelected = (id: any) => {
    if (multiple && Array.isArray(selected)) {
      return selected.some((item) => item.id === id);
    }
    return (selected as ValueSelect | null)?.id === id;
  };

  const renderLabel = () => {
    if (multiple && Array.isArray(selected)) {
      if (selected.length === 0) return 'Seleccionar...';
      return selected.map((s) => s.value).join(', ');
    }
    if (!multiple && selected) return (selected as ValueSelect).value;
    return 'Seleccionar...';
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md cursor-pointer bg-white flex items-center justify-between`}
      >
        <span className={`text-sm ext-gray-800`}>
          {renderLabel()}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
      {open && (
        <ul className="absolute left-0 right-0 mt-1 z-[9999] bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => (
            <li
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`transition-colors duration-150 px-4 py-2 cursor-pointer flex items-center justify-between ${isSelected(opt.id) ? 'bg-primary font-semibold text-white' : 'hover:bg-primary-100'}`}
            >
              <span>{opt.value}</span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{helperText}</p>}
    </div>
  );
};
