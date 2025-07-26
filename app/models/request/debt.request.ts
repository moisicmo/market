import type { DebtModel } from "..";


export interface PaymentRequest {
  debtId: string;
  amount: number;
  dueDate: Date|null;
}


export interface FormPaymentModel {
  debt: DebtModel,
  amount: number;
  dueDate: Date | null;
}

export interface FormPaymentValidations {
  amount: [(value: number) => boolean, string];
  dueDate: [(value: Date | null, formState: FormPaymentModel) => boolean, string];
}

export const formPaymentValidations: FormPaymentValidations = {
  amount: [(value) => value > 0, 'Debe ingresar un monto'],
  dueDate: [
    (value, formState) => {
      // Si no hay deuda o no se ingresó monto, no validamos aún
      if (!formState.debt) return true;

      const { remainingBalance } = formState.debt;

      if (formState.amount < remainingBalance) {
        // Si el monto es menor al saldo, dueDate es obligatorio
        return value !== null;
      }
      // Si el monto es igual al saldo, dueDate puede ser null
      return true;
    },
    'Debe ingresar una fecha de compromiso',
  ],
};
