import { useRef, useState, type FormEvent } from 'react';
import { Button, InputCustom, SelectCustom, ValueSelect } from '@/components';
import { WriteoffReason, WriteoffReasonLabels, type WriteoffItemFormModel, type WriteoffRequest, type KardexModel } from '@/models';
import { Search, Trash2 } from 'lucide-react';

interface Props {
  branchId: string;
  dataKardex: KardexModel[];
  handleClose: () => void;
  onWriteoffCreate: (body: WriteoffRequest) => Promise<void>;
}

const REASON_OPTIONS = Object.values(WriteoffReason).map(
  (v) => new ValueSelect(v, WriteoffReasonLabels[v]),
);

export const WriteoffCreate = ({ branchId, dataKardex, handleClose, onWriteoffCreate }: Props) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [reason, setReason] = useState<WriteoffReason>(WriteoffReason.OTRO);
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<WriteoffItemFormModel[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredKardex = dataKardex.filter((k) => {
    if (!productSearch.trim()) return false;
    const q = productSearch.toLowerCase();
    return (
      k.product.name.toLowerCase().includes(q) ||
      (k.product.code ?? '').toLowerCase().includes(q)
    );
  });

  const handleSelectProduct = (k: KardexModel) => {
    if (items.find((i) => i.productId === k.product.id)) return;
    setItems((prev) => [
      ...prev,
      {
        productId: k.product.id,
        productName: k.product.name,
        productCode: k.product.code ?? undefined,
        stock: k.stock,
        quantity: 1,
      },
    ]);
    setProductSearch('');
    setShowDropdown(false);
  };

  const handleUpdateQty = (index: number, value: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: value };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (items.length === 0) return;

    const hasInvalid = items.some((i) => i.quantity < 1 || i.quantity > i.stock);
    if (hasInvalid) return;

    const body: WriteoffRequest = {
      branchId,
      reason,
      description: description.trim() || undefined,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    await onWriteoffCreate(body);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">New Write-off</h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          {/* Reason + description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectCustom
              label="Motivo"
              options={REASON_OPTIONS}
              selected={new ValueSelect(reason, WriteoffReasonLabels[reason])}
              onSelect={(v) => {
                if (v && !Array.isArray(v)) setReason(v.id as WriteoffReason);
              }}
              error={false}
            />
            <InputCustom
              name="description"
              value={description}
              label="Descripción (opcional)"
              placeholder="Ej: productos caducados del lote X"
              onChange={(e) => setDescription(e.target.value)}
              error={false}
            />
          </div>

          {/* Product search */}
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
              <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-52 overflow-y-auto">
                {filteredKardex.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-400">Sin resultados</li>
                ) : (
                  filteredKardex.map((k) => {
                    const added = items.some((i) => i.productId === k.product.id);
                    return (
                      <li
                        key={k.product.id}
                        onMouseDown={() => handleSelectProduct(k)}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-red-50 ${added ? 'opacity-40 pointer-events-none' : ''}`}
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

          {/* Item list */}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item, i) => {
                const qtyError =
                  formSubmitted && (item.quantity < 1 || item.quantity > item.stock)
                    ? item.quantity < 1
                      ? 'Mínimo 1'
                      : `Máximo ${item.stock} (stock disponible)`
                    : '';
                return (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                      {item.productCode && (
                        <p className="text-xs text-gray-400">Cód: {item.productCode}</p>
                      )}
                      <p className="text-xs text-gray-400">Stock actual: {item.stock}</p>
                    </div>
                    <div className="w-36 shrink-0">
                      <InputCustom
                        name={`qty-${i}`}
                        value={item.quantity}
                        label="Cantidad"
                        type="number"
                        onChange={(e) => handleUpdateQty(i, Number(e.target.value))}
                        error={!!qtyError}
                        helperText={qtyError}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(i)}
                      className="shrink-0 cursor-pointer"
                      title="Quitar"
                    >
                      <Trash2 color="var(--color-error)" className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {formSubmitted && items.length === 0 && (
            <p className="text-sm text-red-500">Debe agregar al menos un producto</p>
          )}

          {/* Summary */}
          {items.length > 0 && (
            <div className="flex justify-end">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-3 text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total unidades a dar de baja</p>
                <p className="text-2xl font-bold text-gray-800">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" color="bg-gray-400" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" color="bg-red-500">
              Registrar Baja
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
