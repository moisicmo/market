import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  value: string; // valor controlado desde useForm
  length?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  className?: string;
}

export const OtpCustom = ({
  name,
  value,
  length = 6,
  onChange,
  error,
  helperText,
  className,
}: Props) => {
  const values = (value || "").split("").slice(0, length);
  while (values.length < length) values.push("");

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return; // solo un dígito numérico

    const newValues = [...values];
    newValues[index] = val;
    const newValue = newValues.join("");

    // Crear un "evento fake" para useForm
    const event = {
      target: { name, value: newValue },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(event);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="grid gap-1.5">
      <div className="flex gap-2 justify-center">
        {values.map((val, i) => (
          <Input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold tracking-widest",
              error ? "border-red-500" : "border-gray-300",
              className
            )}
          />
        ))}
      </div>
      {helperText && (
        <p className={cn("text-sm text-center", error ? "text-red-600" : "text-muted-foreground")}>
          {helperText}
        </p>
      )}
    </div>
  );
};
