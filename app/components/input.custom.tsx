import { memo, type ReactNode } from "react";

interface Props {
  id?: string;
  name: string;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  label?: string;
  placeholder?: string;
  endAdornment?: ReactNode;
  multiline?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
}


export const InputCustom = memo((props: Props) => {
  const {
    id,
    name,
    value,
    onChange,
    type = 'text',
    label,
    placeholder,
    endAdornment = null,
    multiline = false,
    error = false,
    helperText = '',
    className = '',
  } = props;
  const baseInputClass = `
  mt-1 block w-full rounded-md border text-sm
  px-3 py-2 pr-10
  focus:outline-none focus:ring-2 focus:ring-primary-400
  ${error ? 'border-red-500' : 'border-gray-300'}
  ${className}
`;

  return (
    <div className="mb-2 w-full">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {multiline ? (
          <textarea
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            className={baseInputClass}
            rows={4}
          />
        ) : (
          <input
            id={id || name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={baseInputClass}
            autoComplete="off"
          />
        )}

        {endAdornment && (
          <div className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && (
        <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});
