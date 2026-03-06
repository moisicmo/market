import { useState, type FormEvent } from 'react';
import { Button } from '@/components';
import type { SaleDebtModel, SalePaymentRequest } from '@/models';

interface Props {
  debt: SaleDebtModel;
  onPay: (id: string, body: SalePaymentRequest) => Promise<void>;
  onClose: () => void;
}

const PAY_METHOD_LABEL: Record<string, string> = {
  cash: 'Efectivo',
  qr: 'QR',
  deposit: 'Depósito',
};

export const SaleDebtPayment = ({ debt, onPay, onClose }: Props) => {
  const remaining = debt.totalAmount - debt.paidAmount;
  const [amount, setAmount] = useState<string>(remaining.toFixed(2));
  const [payMethod, setPayMethod] = useState<'cash' | 'qr' | 'deposit'>('cash');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const amountError = submitted && (amountNum <= 0 || amountNum > remaining + 0.01);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (amountNum <= 0 || amountNum > remaining + 0.01) return;

    setLoading(true);
    try {
      await onPay(debt.id, { amount: amountNum, payMethod, notes: notes || undefined });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-1">Registrar pago</h2>
        <p className="text-sm text-gray-500 mb-4">
          Cliente: <span className="font-medium text-gray-800">
            {debt.customer.user.name} {debt.customer.user.lastName}
          </span>
        </p>

        {/* Resumen */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mb-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Total deuda:</span>
            <span className="font-medium">Bs. {debt.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ya pagado:</span>
            <span className="font-medium text-green-700">Bs. {debt.paidAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-200 pt-1 mt-1">
            <span>Saldo pendiente:</span>
            <span className="text-red-600">Bs. {remaining.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto a pagar (Bs.)</label>
            <input
              type="number"
              min={0.01}
              max={remaining}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                amountError ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {amountError && (
              <p className="text-xs text-red-500 mt-0.5">
                {amountNum <= 0 ? 'Ingrese un monto válido' : `Máximo Bs. ${remaining.toFixed(2)}`}
              </p>
            )}
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
            <div className="flex gap-2">
              {(['cash', 'qr', 'deposit'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayMethod(m)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    payMethod === m
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {PAY_METHOD_LABEL[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Referencia, observación..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" color="bg-gray-400" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Confirmar pago'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
