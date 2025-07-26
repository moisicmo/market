import { memo } from "react";

interface Props {
  id?: string;
  name: string;
  value: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
  mode?: 'date' | 'time' | 'datetime';
  minDate?: Date;
  maxDate?: Date;
  minTime?: Date;
  maxTime?: Date;
}

export const DateTimePickerCustom = memo((props: Props) => {
  const {
    id,
    name,
    value,
    onChange,
    label,
    placeholder,
    error = false,
    helperText = '',
    className = '',
    mode = 'datetime',

    minDate,
    maxDate,
    minTime,
    maxTime,
  } = props;

  const inputType = mode === 'date' ? 'date' : mode === 'time' ? 'time' : 'datetime-local';


  const formatValue = () => {
    if (!value) return '';
    if (mode === 'date') return value.toISOString().slice(0, 10);
    if (mode === 'time') return value.toTimeString().slice(0, 5);
    return value.toISOString().slice(0, 16);
  };

  // Funciones para formatear min y max según tipo
  const formatMinMax = (date: Date | undefined, isMin: boolean) => {
    if (!date) return undefined;
    if (mode === 'date') return date.toISOString().slice(0, 10);
    if (mode === 'time') return date.toTimeString().slice(0, 5);
    if (mode === 'datetime') return date.toISOString().slice(0, 16);
    return undefined;
  };

  const min = mode === 'date' ? formatMinMax(minDate, true) :
    mode === 'time' ? formatMinMax(minTime, true) :
      formatMinMax(minDate ?? minTime, true);

  const max = mode === 'date' ? formatMinMax(maxDate, false) :
    mode === 'time' ? formatMinMax(maxTime, false) :
      formatMinMax(maxDate ?? maxTime, false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) {
      onChange?.(null);
      return;
    }

    let result: Date;

    if (mode === 'date') {
      result = new Date(`${raw}T00:00`);
    } else if (mode === 'time') {
      const [hours, minutes] = raw.split(':');
      const now = new Date('1970-01-01T00:00');
      now.setHours(Number(hours), Number(minutes), 0, 0);
      result = now;

      if (minTime && now < minTime) return;
      if (maxTime && now > maxTime) return;

    } else {
      result = new Date(raw);

      if (minDate && result < minDate) return;
      if (maxDate && result > maxDate) return;
    }

    onChange?.(result);
  };


  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={inputType}
        value={formatValue()}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        min={min}
        max={max}
        className={`
          mt-1 block w-full rounded-md border px-3 py-2 text-sm
          focus:outline-none focus:ring-2
          focus:ring-[var(--color-primary)]
          focus:border-[var(--color-primary)]
          acent:color-[var(--color-primary)]
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
      />
      {helperText && (
        <p className={`text-sm mt-1 ${error ? 'text-error' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});
