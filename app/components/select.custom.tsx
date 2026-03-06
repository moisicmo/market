import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { useDebounce } from '@/hooks';

export class ValueSelect {
  id: string;
  value: string;

  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}

interface Props {
  label?: string;
  options: ValueSelect[];
  selected: ValueSelect | ValueSelect[] | null;
  onSelect: (value: ValueSelect | ValueSelect[] | null) => void;
  onSearch?: (value: string) => void;
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
  showSelectAll?: boolean;
  disabled?: boolean;
}

export const SelectCustom = ({
  label,
  options,
  selected,
  onSelect,
  onSearch,
  disabled,
  multiple = false,
  error = false,
  helperText = '',
  showSelectAll = true,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (onSearch) onSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        if (!multiple) setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [multiple]);

  const handleSelect = (id: string) => {
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
    } else {
      onSelect(found);
      setOpen(false);
    }

    if (!multiple) setSearch('');
  };

  const handleSelectAll = () => {
    if (multiple) {
      const current = Array.isArray(selected) ? selected : [];

      if (current.length === options.length) {
        onSelect([]);
      } else {
        const optionsToSelect = search ? filteredOptions : options;
        onSelect([...optionsToSelect]);
      }
    }
  };

  const isSelected = (id: string) => {
    if (multiple && Array.isArray(selected)) {
      return selected.some((item) => item.id === id);
    }
    return (selected as ValueSelect | null)?.id === id;
  };

  const isAllSelected = () => {
    if (!multiple) return false;
    const current = Array.isArray(selected) ? selected : [];

    if (search) {
      const filteredIds = filteredOptions.map(opt => opt.id);
      return filteredIds.length > 0 &&
        filteredIds.every(id => current.some(item => item.id === id));
    }

    return current.length === options.length && options.length > 0;
  };

  const isSomeSelected = () => {
    if (!multiple) return false;

    const current = Array.isArray(selected) ? selected : [];

    if (search) {
      const filteredIds = filteredOptions.map(opt => opt.id);
      return filteredIds.some(id =>
        current.some(item => item.id === id)
      );
    }

    return current.length > 0 && current.length < options.length;
  };


  const renderLabel = () => {
    if (multiple) return 'Agregar opciones...';
    if (!multiple && selected) return (selected as ValueSelect).value;
    return 'Seleccionar...';
  };

  const filteredOptions = onSearch
    ? options
    : options.filter((opt) => opt.value.toLowerCase().includes(search.toLowerCase()));

  const toggleDropdown = () => {
    if (!open) {
      const rect = dropdownRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setOpenUp(spaceBelow < 260 && spaceAbove > spaceBelow);
      }
    }
    setOpen(!open);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}

      {/* INPUT PRINCIPAL */}
      <div
        onClick={disabled ? undefined : toggleDropdown}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'
          } rounded-md bg-white cursor-pointer ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } px-3 py-2 flex items-center justify-between min-h-[42px]`}
      >
        <div className="flex flex-wrap gap-1 flex-1 items-center">
          {multiple ? (
            Array.isArray(selected) && selected.length > 0 ? (
              <>
                <span className="text-sm text-gray-700">
                  {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
                </span>
                <div className="flex flex-wrap gap-1">
                  {selected.slice(0, 3).map((item) => (
                    <span
                      key={item.id}
                      className="flex items-center gap-1 bg-primary text-white text-xs px-2 py-1 rounded-full"
                    >
                      {item.value}
                      <button
                        type="button"
                        className="ml-1 text-white/80 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(
                            selected.filter((s) => s.id !== item.id)
                          );
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {selected.length > 3 && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      +{selected.length - 3} más
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-400 select-none px-1">
                Seleccionar...
              </span>
            )
          ) : (
            <span
              className={`text-sm ${selected ? 'text-gray-800' : 'text-gray-400'
                } select-none px-1`}
            >
              {renderLabel()}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''
            }`}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className={`absolute left-0 right-0 z-[9999] bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden
            ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'}
          `}
        >
          {/* CABECERA CON CHECKBOX Y BÚSQUEDA EN MISMA LÍNEA */}
          <div className="flex items-center border-b border-gray-200 px-3 py-2 gap-2">
            {/* Checkbox de "Seleccionar todo" */}
            {multiple && showSelectAll && (
             <button
  type="button"
  onClick={!disabled ? handleSelectAll : undefined}
  className={`flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:border-primary transition-colors ${
    disabled ? 'cursor-not-allowed opacity-50' : ''
  }`}
  title={isAllSelected() ? "Deseleccionar todo" : "Seleccionar todo"}
  disabled={disabled}
>

                {isAllSelected() ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : isSomeSelected() ? (
                  <div className="w-3 h-3 bg-primary rounded-sm" />
                ) : null}
              </button>
            )}

            {/* Buscador */}
            <div className="flex items-center flex-1">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => !disabled && setSearch(e.target.value)}
                placeholder="Buscar..."
                className={`w-full outline-none text-sm text-gray-700 bg-transparent ${disabled ? 'cursor-not-allowed' : ''
                  }`}
                disabled={disabled}
              />

            </div>

            {/* Indicador de selección (opcional) */}
            {multiple && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {Array.isArray(selected) ? `${selected.length}/${options.length}` : '0'}
              </span>
            )}
          </div>

          {/* LISTA DE OPCIONES */}
          <ul className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`transition-colors duration-150 px-4 py-2 cursor-pointer flex items-center
                    ${isSelected(opt.id) ? 'bg-primary-50' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Checkbox de la opción */}
                  <div className={`flex items-center justify-center w-5 h-5 mr-3 border rounded
                    ${isSelected(opt.id) ? 'border-primary bg-primary' : 'border-gray-300'}
                  `}>
                    {isSelected(opt.id) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={`text-sm ${isSelected(opt.id) ? 'text-primary font-medium' : 'text-gray-700'
                    }`}>
                    {opt.value}
                  </span>
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

      {error && (
        <p className="text-sm text-red-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};