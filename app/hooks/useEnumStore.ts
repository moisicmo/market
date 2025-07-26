import { DayOfWeek, PayMethod, TypeDebt } from '@/models';

export const useEnums = () => {

  // Genérica: convierte enum en lista de opciones
  const getOptions = <T extends Record<string, string>>(enumObj: T) => {
    return Object.entries(enumObj).map(([key, value]) => ({
      key,
      label: value,
    }));
  };

  // Genérica: busca el label por clave
  const getLabelFromOptions = (options: { key: string; label: string }[], key: string): string => {
    return options.find(option => option.key === key)?.label ?? key;
  };

  // === Opciones generadas UNA vez ===
  const dayOptions = getOptions(DayOfWeek);
  const typeDebtOptions = getOptions(TypeDebt);
  const payMethodOptions = getOptions(PayMethod);

  // === Métodos específicos ===
  const getDay = (day: string): string => getLabelFromOptions(dayOptions, day);

  const getTypeDebt = (type: string): string => getLabelFromOptions(typeDebtOptions, type);

  const getPayMethod = (method: string): string => getLabelFromOptions(payMethodOptions, method);

  const getTypeDebtClass = (type: string): string => {
    const label = getTypeDebt(type);
    switch (label) {
      case TypeDebt.INSCRIPTION:
        return 'bg-blue-100 text-blue-800';
      case TypeDebt.MONTH:
        return 'bg-green-100 text-green-800';
      case TypeDebt.BOOKING:
        return 'bg-red-100 text-red-800';
      case TypeDebt.PER_SESSION:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    // Métodos
    getDay,
    getTypeDebt,
    getTypeDebtClass,
    getPayMethod,

    // Opciones (por si las necesitas en selects)
    dayOptions,
    typeDebtOptions,
    payMethodOptions,
  };
};
