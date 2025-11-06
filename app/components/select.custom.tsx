import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

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
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
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
    setSearch('');
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

  // 🔍 Filtrado en tiempo real
  const filteredOptions = options.filter((opt) =>
    opt.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md cursor-pointer bg-white flex items-center justify-between`}
      >
        <span className="text-sm text-gray-800">{renderLabel()}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-1 z-[9999] bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
          {/* 🔍 Campo de búsqueda */}
          <div className="flex items-center border-b border-gray-200 px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full outline-none text-sm text-gray-700"
            />
          </div>

          {/* Lista filtrada */}
          <ul className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`transition-colors duration-150 px-4 py-2 cursor-pointer flex items-center justify-between ${
                    isSelected(opt.id)
                      ? 'bg-primary font-semibold text-white'
                      : 'hover:bg-primary-100'
                  }`}
                >
                  <span>{opt.value}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-400 text-center select-none">
                No se encontraron resultados
              </li>
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{helperText}</p>}
    </div>
  );
};
