import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useForm, useProviderStore } from '@/hooks';
import { Button, InputCustom, SelectCustom, ValueSelect } from '@/components';
import {
  formPurchaseFields,
  formPurchaseValidations,
  purchaseItemValidations,
  PaymentType,
  TypeUnit,
  type PurchaseRequest,
  type PurchaseItemFormModel,
  type InstallmentFormModel,
  type KardexModel,
} from '@/models';
import type { ProviderModel } from '@/models';
import { Trash2, Search } from 'lucide-react';

interface Props {
  branchId: string;
  dataKardex: KardexModel[];
  handleClose: () => void;
  onPurchaseCreate: (body: PurchaseRequest) => void;
}

type ItemErrors = {
  quantity?: string;
  price?: string;
};

export const PurchaseCreate = ({
  branchId,
  dataKardex,
  handleClose,
  onPurchaseCreate,
}: Props) => {
  const {
    code,
    detail,
    onInputChange,
    onResetForm,
    isFormValid,
    codeValid,
    detailValid,
  } = useForm(formPurchaseFields, formPurchaseValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderModel | null>(null);
  const [providerError, setProviderError] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>(PaymentType.CONTADO);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeDateError, setDischargeDateError] = useState('');

  const [items, setItems] = useState<PurchaseItemFormModel[]>([]);
  const [installments, setInstallments] = useState<InstallmentFormModel[]>([]);
  // Cuotas UX helpers
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [numInstallments, setNumInstallments] = useState<number>(1);

  const [productSearch, setProductSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { dataProvider, getProviders } = useProviderStore();

  const validateItems = (list: PurchaseItemFormModel[]): ItemErrors[] =>
    list.map((p) => {
      const errors: ItemErrors = {};
      const [validQty, msgQty] = purchaseItemValidations.quantity;
      const [validPrice, msgPrice] = purchaseItemValidations.price;
      if (!validQty(p.quantity)) errors.quantity = msgQty;
      if (!validPrice(p.price)) errors.price = msgPrice;
      return errors;
    });

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const remaining = totalAmount - amountPaid;
  const totalInstallments = installments.reduce((s, i) => s + i.amount, 0);
  const difference = remaining - totalInstallments;

  const itemErrors = validateItems(items);
  const hasItemErrors = itemErrors.some((err) => Object.values(err).some(Boolean));

  // Auto-generate installment rows when numInstallments changes
  const handleGenerateInstallments = (n: number) => {
    setNumInstallments(n);
    if (n < 1) return;
    const perInstallment = remaining > 0 ? Math.round((remaining / n) * 100) / 100 : 0;
    const today = new Date();
    const generated: InstallmentFormModel[] = Array.from({ length: n }, (_, i) => {
      const due = new Date(today);
      due.setDate(due.getDate() + 30 * (i + 1));
      return {
        installmentNumber: i + 1,
        amount: i === n - 1 ? Math.round((remaining - perInstallment * (n - 1)) * 100) / 100 : perInstallment,
        dueDate: due,
      };
    });
    setInstallments(generated);
  };

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);

    const provErr = !selectedProvider ? 'Debe seleccionar un proveedor' : '';
    const dateErr = !dischargeDate ? 'Debe ingresar la fecha de descarga' : '';
    setProviderError(provErr);
    setDischargeDateError(dateErr);

    if (!isFormValid || items.length === 0 || hasItemErrors || !selectedProvider || !dischargeDate) return;
    if (selectedPaymentType === PaymentType.CUOTAS && installments.length === 0) return;

    const purchaseRequest: PurchaseRequest = {
      branchId,
      providerId: selectedProvider.id,
      code: (code as string).trim(),
      dischargeDate: new Date(dischargeDate),
      paymentType: selectedPaymentType,
      totalAmount,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
        typeUnit: item.typeUnit,
        detail: (detail as string).trim(),
      })),
      installments: selectedPaymentType === PaymentType.CUOTAS ? installments : undefined,
    };

    await onPurchaseCreate(purchaseRequest);
    handleReset();
  };

  const handleReset = () => {
    onResetForm();
    setItems([]);
    setInstallments([]);
    setSelectedProvider(null);
    setDischargeDate('');
    setSelectedPaymentType(PaymentType.CONTADO);
    setAmountPaid(0);
    setNumInstallments(1);
    setFormSubmitted(false);
    handleClose();
  };

  const filteredKardex = dataKardex.filter((k) => {
    const q = productSearch.toLowerCase();
    return (
      k.product.name.toLowerCase().includes(q) ||
      (k.product.code ?? '').toLowerCase().includes(q)
    );
  });

  const handleSelectProduct = (kardex: KardexModel) => {
    const { product } = kardex;
    if (items.find((p) => p.product.id === product.id)) return;
    setItems((prev) => [
      ...prev,
      { product, quantity: 1, price: product.refCost ?? 0, typeUnit: TypeUnit.UNIDAD },
    ]);
    setProductSearch('');
    setShowDropdown(false);
  };

  const handleUpdateItem = (index: number, key: keyof PurchaseItemFormModel, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateInstallment = (index: number, key: keyof InstallmentFormModel, value: any) => {
    setInstallments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleRemoveInstallment = (index: number) => {
    setInstallments((prev) =>
      prev.filter((_, i) => i !== index).map((inst, i) => ({ ...inst, installmentNumber: i + 1 }))
    );
    setNumInstallments((n) => Math.max(0, n - 1));
  };

  useEffect(() => {
    getProviders();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Nueva Compra</h2>

        <form onSubmit={sendSubmit} className="space-y-4">

          {/* ── Encabezado ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputCustom
              name="code"
              value={code}
              label="Código de compra"
              onChange={onInputChange}
              error={!!codeValid && formSubmitted}
              helperText={formSubmitted ? codeValid : ''}
            />
            <InputCustom
              name="detail"
              value={detail}
              label="Detalle"
              onChange={onInputChange}
              error={!!detailValid && formSubmitted}
              helperText={formSubmitted ? detailValid : ''}
            />
            <InputCustom
              name="dischargeDate"
              value={dischargeDate}
              label="Fecha de descarga"
              type="date"
              onChange={(e) => setDischargeDate(e.target.value)}
              error={!!dischargeDateError && formSubmitted}
              helperText={formSubmitted ? dischargeDateError : ''}
            />
            <SelectCustom
              label="Proveedor"
              options={dataProvider.data?.map((p) => new ValueSelect(p.id, p.name)) ?? []}
              selected={selectedProvider ? new ValueSelect(selectedProvider.id, selectedProvider.name) : null}
              onSelect={(value) => {
                if (value && !Array.isArray(value)) {
                  const found = dataProvider.data?.find((p) => p.id === value.id) ?? null;
                  setSelectedProvider(found);
                }
              }}
              error={!!providerError && formSubmitted}
              helperText={formSubmitted ? providerError : ''}
            />
            <SelectCustom
              label="Tipo de pago"
              options={[
                new ValueSelect(PaymentType.CONTADO, 'Al contado'),
                new ValueSelect(PaymentType.CUOTAS, 'A cuotas'),
              ]}
              selected={new ValueSelect(
                selectedPaymentType,
                selectedPaymentType === PaymentType.CONTADO ? 'Al contado' : 'A cuotas',
              )}
              onSelect={(value) => {
                if (value && !Array.isArray(value)) {
                  setSelectedPaymentType(value.id as PaymentType);
                  if (value.id === PaymentType.CONTADO) {
                    setInstallments([]);
                    setAmountPaid(0);
                    setNumInstallments(1);
                  }
                }
              }}
              error={false}
            />
          </div>

          {/* ── Cuotas ─────────────────────────────────────────────────── */}
          {selectedPaymentType === PaymentType.CUOTAS && (
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-sm text-amber-800">Pago a cuotas</h3>

              {/* Controles principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputCustom
                  name="amountPaid"
                  value={amountPaid}
                  label="Pago a cuenta (inicial)"
                  type="number"
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  error={false}
                />
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <InputCustom
                      name="numInstallments"
                      value={numInstallments}
                      label="Número de cuotas"
                      type="number"
                      onChange={(e) => setNumInstallments(Number(e.target.value))}
                      error={false}
                    />
                  </div>
                  <Button
                    type="button"
                    color="bg-amber-500"
                    onClick={() => handleGenerateInstallments(numInstallments)}
                  >
                    Generar
                  </Button>
                </div>
              </div>

              {/* Filas de cuotas */}
              {installments.length > 0 && (
                <div className="space-y-2">
                  {installments.map((inst, i) => (
                    <div key={i} className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-end bg-white border border-amber-100 rounded-lg px-3 py-2">
                      <span className="text-xs font-semibold text-amber-700 w-16">
                        Cuota {inst.installmentNumber}
                      </span>
                      <InputCustom
                        name={`inst[${i}].dueDate`}
                        value={inst.dueDate instanceof Date ? inst.dueDate.toISOString().split('T')[0] : ''}
                        label="Fecha de pago"
                        type="date"
                        onChange={(e) => handleUpdateInstallment(i, 'dueDate', new Date(e.target.value))}
                        error={false}
                      />
                      <InputCustom
                        name={`inst[${i}].amount`}
                        value={inst.amount}
                        label="Monto a cancelar"
                        type="number"
                        onChange={(e) => handleUpdateInstallment(i, 'amount', Number(e.target.value))}
                        error={false}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInstallment(i)}
                        className="mb-1 cursor-pointer"
                        title="Eliminar cuota"
                      >
                        <Trash2 color="var(--color-error)" className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formSubmitted && selectedPaymentType === PaymentType.CUOTAS && installments.length === 0 && (
                <p className="text-sm text-red-500">Debe generar al menos una cuota</p>
              )}

              {/* Resumen de pago */}
              {totalAmount > 0 && (
                <div className="bg-white border border-amber-200 rounded-lg px-4 py-3 text-sm space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Total compra:</span>
                    <span className="font-semibold">Bs. {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Pago a cuenta:</span>
                    <span className="font-semibold text-green-600">Bs. {amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-t pt-1">
                    <span>Total cuotas:</span>
                    <span className="font-semibold">Bs. {totalInstallments.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between font-bold border-t pt-1 ${Math.abs(difference) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                    <span>Diferencia (debe ser 0):</span>
                    <span>Bs. {difference.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Selector de producto ────────────────────────────────────── */}
          <div className="relative" ref={searchRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar producto (nombre o código)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={productSearch}
                placeholder="Escribe nombre o código..."
                onChange={(e) => { setProductSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {showDropdown && productSearch.trim() !== '' && (
              <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto">
                {filteredKardex.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-400">Sin resultados</li>
                ) : (
                  filteredKardex.map((k) => {
                    const alreadyAdded = items.some((i) => i.product.id === k.product.id);
                    return (
                      <li
                        key={k.product.id}
                        onMouseDown={() => handleSelectProduct(k)}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 ${alreadyAdded ? 'opacity-40 pointer-events-none' : ''}`}
                      >
                        <div>
                          <p className="font-medium text-gray-800">{k.product.name}</p>
                          {k.product.code && (
                            <p className="text-xs text-gray-400">Cód: {k.product.code}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 ml-4">Stock: {k.stock}</span>
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </div>

          {/* ── Lista de productos ──────────────────────────────────────── */}
          {items.length > 0 && (
            <div className="mt-4 space-y-3">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold">{item.product.name}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">
                        Subtotal:{' '}
                        <span className="font-semibold text-slate-700">
                          Bs. {(item.quantity * item.price).toFixed(2)}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(i)}
                        title="Eliminar"
                        className="cursor-pointer"
                      >
                        <Trash2 color="var(--color-error)" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <InputCustom
                      name={`items[${i}].quantity`}
                      value={item.quantity}
                      label="Cantidad"
                      type="number"
                      onChange={(e) => handleUpdateItem(i, 'quantity', Number(e.target.value))}
                      error={!!itemErrors[i]?.quantity && formSubmitted}
                      helperText={formSubmitted ? itemErrors[i]?.quantity : ''}
                    />
                    <InputCustom
                      name={`items[${i}].price`}
                      value={item.price}
                      label="Precio"
                      type="number"
                      onChange={(e) => handleUpdateItem(i, 'price', Number(e.target.value))}
                      error={!!itemErrors[i]?.price && formSubmitted}
                      helperText={formSubmitted ? itemErrors[i]?.price : ''}
                    />
                    <SelectCustom
                      label="Unidad"
                      options={[
                        new ValueSelect(TypeUnit.UNIDAD, 'Unidad'),
                        new ValueSelect(TypeUnit.CAJA, 'Caja'),
                      ]}
                      selected={new ValueSelect(
                        item.typeUnit,
                        item.typeUnit === TypeUnit.UNIDAD ? 'Unidad' : 'Caja',
                      )}
                      onSelect={(value) => {
                        if (value && !Array.isArray(value))
                          handleUpdateItem(i, 'typeUnit', value.id as TypeUnit);
                      }}
                      error={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {formSubmitted && items.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Debe agregar al menos un producto</p>
          )}

          {/* ── Total compra ────────────────────────────────────────────── */}
          {items.length > 0 && selectedPaymentType === PaymentType.CONTADO && (
            <div className="flex justify-end">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-3 text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total compra</p>
                <p className="text-2xl font-bold text-slate-800">Bs. {totalAmount.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* ── Acciones ───────────────────────────────────────────────── */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" color="bg-gray-400" onClick={handleReset}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Compra</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
