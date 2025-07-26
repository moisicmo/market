


import { useState } from "react";

interface InputPhonesCustomProps {
  name: string;
  value: string[]; // Lista de teléfonos
  onChange: (phones: string[]) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const InputPhonesCustom = ({
  name,
  value,
  onChange,
  label,
  error,
  helperText,
}: InputPhonesCustomProps) => {
  const [phones, setPhones] = useState<string[]>(value);

  const handleChange = (index: number, newValue: string) => {
    const updated = [...phones];
    updated[index] = newValue;
    setPhones(updated);
    onChange(updated);
  };

  const handleAddPhone = () => {
    const updated = [...phones, ''];
    setPhones(updated);
    onChange(updated);
  };

  const handleRemovePhone = (index: number) => {
    const updated = phones.filter((_, i) => i !== index);
    setPhones(updated);
    onChange(updated);
  };

  return (
    <div className="mb-2 w-full">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {phones.map((phone, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <input
            type="text"
            name={`${name}[${index}]`}
            value={phone}
            onChange={(e) => handleChange(index, e.target.value)}
            className={`block w-full rounded-md border text-sm px-3 py-2 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese número"
          />
          <button
            type="button"
            onClick={() => handleRemovePhone(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddPhone}
        className="text-blue-600 hover:text-blue-800 text-sm mt-1"
      >
        + Agregar teléfono
      </button>

      {helperText && (
        <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>{helperText}</p>
      )}
    </div>
  );
};
