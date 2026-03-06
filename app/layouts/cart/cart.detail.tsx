import { Button, SelectCustom } from "@/components"
import { useAuthStore, useCartStore, useCustomerStore, useForm, usePaymentStore } from "@/hooks";
import { formCartInit, formCartValidations, type CartRequest, type CustomerRequest } from "@/models";
import { useEffect, useState, type FormEvent } from "react";
import { CustomerCreate } from "@/routes/admin/customer/customer.create";
import { UserPlus } from "lucide-react";

interface Props {
  onClose: () => void;
}

type PayType = 'CONTADO' | 'CUOTAS';

export const CartDetail = (props: Props) => {
  const { onClose } = props;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [paymentType, setPaymentType] = useState<PayType>('CONTADO');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const { branchSelect } = useAuthStore();
  const { cart, clearCart } = useCartStore();
  const { sentPayments } = usePaymentStore();
  const { dataCustomer, getCustomers, createCustomer } = useCustomerStore();

  const {
    customer,
    isFormValid,
    onResetForm,
    customerValid,
    onValueChange,
  } = useForm(formCartInit, formCartValidations);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const paid = parseFloat(amountPaid) || 0;
  const remaining = total - paid;

  const sendSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    if (paymentType === 'CUOTAS' && (paid <= 0 || paid > total)) return;

    const request: CartRequest = {
      customerId: customer?.user.id!,
      branchId: `${branchSelect?.id}`,
      amount: total,
      paymentType,
      amountPaid: paymentType === 'CUOTAS' ? paid : undefined,
      outputs: cart.map(c => ({
        productId: c.productModel.id,
        quantity: c.quantity,
        price: c.price,
      })),
    };
    sentPayments(request);
    clearCart();
    onResetForm();
    onClose();
  };

  const handleCreateCustomer = async (body: CustomerRequest) => {
    const newCustomer = await createCustomer(body);
    if (newCustomer) {
      onValueChange('customer', newCustomer);
    }
  };

  useEffect(() => {
    getCustomers(1, 50);
  }, []);

  return (
    <div>
      <form onSubmit={sendSubmit} className="space-y-4">
        {/* Cliente */}
        <div>
          <SelectCustom
            label="Cliente"
            options={dataCustomer.data?.map((c) => ({
              id: c.user.id,
              value: `${c.user.name} ${c.user.lastName ?? ''}`.trim(),
            })) ?? []}
            selected={customer ? {
              id: customer.user.id,
              value: `${customer.user.name} ${customer.user.lastName ?? ''}`.trim(),
            } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const selectedCustomer = dataCustomer.data?.find((c) => c.user.id === value.id);
                onValueChange('customer', selectedCustomer);
              }
            }}
            onSearch={(q) => getCustomers(1, 50, q)}
            error={!!customerValid && formSubmitted}
            helperText={formSubmitted ? customerValid : ''}
          />
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            <UserPlus className="w-3 h-3" />
            Crear nuevo cliente
          </button>
        </div>

        {/* Tipo de pago */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Forma de pago</p>
          <div className="flex gap-2">
            {(['CONTADO', 'CUOTAS'] as PayType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setPaymentType(t); setAmountPaid(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  paymentType === t
                    ? t === 'CONTADO'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {t === 'CONTADO' ? 'Al contado' : 'A cuotas'}
              </button>
            ))}
          </div>
        </div>

        {/* Pago a cuenta — solo cuando es CUOTAS */}
        {paymentType === 'CUOTAS' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
            <div>
              <label className="block text-xs font-medium text-amber-800 mb-1">
                Pago a cuenta (Bs.)
              </label>
              <input
                type="number"
                min={0}
                max={total}
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0.00"
                className={`w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  formSubmitted && (paid <= 0 || paid > total)
                    ? 'border-red-400 bg-red-50'
                    : 'border-amber-300 bg-white'
                }`}
              />
              {formSubmitted && paid <= 0 && (
                <p className="text-xs text-red-500 mt-0.5">Ingrese el monto a cuenta</p>
              )}
              {formSubmitted && paid > total && (
                <p className="text-xs text-red-500 mt-0.5">No puede superar el total</p>
              )}
            </div>

            <div className="text-xs space-y-1 pt-1 border-t border-amber-200">
              <div className="flex justify-between text-gray-600">
                <span>Total venta:</span>
                <span className="font-medium">Bs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>A cuenta:</span>
                <span className="font-medium text-green-700">Bs. {paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Saldo pendiente:</span>
                <span className={remaining > 0 ? 'text-red-600' : 'text-green-600'}>
                  Bs. {remaining.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button type="submit">
          {paymentType === 'CUOTAS' ? 'Registrar venta a cuotas' : 'Pagar'}
        </Button>
      </form>

      {showCreateModal && (
        <CustomerCreate
          handleClose={() => setShowCreateModal(false)}
          item={null}
          onCreate={handleCreateCustomer}
          onUpdate={() => {}}
        />
      )}
    </div>
  );
};
