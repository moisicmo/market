import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button, InputCustom, SelectCustom, ValueSelect } from '@/components';
import {
  TypeUnit,
  type BranchModel,
  type KardexModel,
  type CreateTransferRequestBody,
  type TransferRequestItemBody,
} from '@/models';
import { useKardexStore } from '@/hooks';
import { ArrowRight, Search, Trash2 } from 'lucide-react';

interface Props {
  branches: BranchModel[];
  currentBranchId: string;
  handleClose: () => void;
  onCreate: (body: CreateTransferRequestBody) => Promise<void>;
}

interface ItemForm {
  productId: string;
  productName: string;
  productCode?: string;
  stock: number;
  quantityRequested: number;
  typeUnit: TypeUnit;
  price: string;
  detail: string;
}

export const TransferRequestCreate = ({ branches, currentBranchId, handleClose, onCreate }: Props) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  // toBranchId = quien solicita (sucursal del usuario), fromBranchId = de donde pide
  const [toBranchId] = useState(currentBranchId);
  const [fromBranchId, setFromBranchId] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<ItemForm[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { dataKardexProduct, getKardexByBranchId } = useKardexStore();

  useEffect(() => {
    if (fromBranchId) {
      setItems([]);
      getKardexByBranchId(fromBranchId, 1, 200);
    }
  }, [fromBranchId]);

  const fromBranchOptions = branches
    .filter((b) => b.id !== toBranchId)
    .map((b) => new ValueSelect(b.id, b.name));

  const availableKardex = dataKardexProduct.data.filter((k) => k.stock > 0);

  const filteredKardex = availableKardex.filter((k) => {
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
        quantityRequested: 1,
        typeUnit: TypeUnit.UNIDAD,
        price: Number(k.product.refCost ?? 0).toFixed(2),
        detail: '',
      },
    ]);
    setProductSearch('');
    setShowDropdown(false);
  };

  const handleUpdateItem = (index: number, field: keyof ItemForm, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!fromBranchId || items.length === 0) return;
    const hasInvalid = items.some((i) => i.quantityRequested < 1 || Number(i.price) <= 0);
    if (hasInvalid) return;

    const body: CreateTransferRequestBody = {
      fromBranchId,
      toBranchId,
      note: note.trim() || undefined,
      items: items.map((i): TransferRequestItemBody => ({
        productId: i.productId,
        quantityRequested: i.quantityRequested,
        typeUnit: i.typeUnit,
        price: Number(i.price),
        detail: i.detail.trim() || undefined,
      })),
    };

    await onCreate(body);
    handleClose();
  };

  const fromBranchName = branches.find((b) => b.id === fromBranchId)?.name ?? '';
  const toBranchName = branches.find((b) => b.id === toBranchId)?.name ?? '';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 z-10">
          <h2 className="text-lg sm:text-xl font-bold">Nueva Solicitud de Traspaso</h2>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={sendSubmit} className="space-y-4">
            {/* Sucursales */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <SelectCustom
                label="Solicitar desde"
                options={fromBranchOptions}
                selected={fromBranchId ? new ValueSelect(fromBranchId, fromBranchName) : null}
                onSelect={(v) => {
                  if (v && !Array.isArray(v)) setFromBranchId(v.id);
                }}
                error={!!formSubmitted && !fromBranchId}
                helperText={formSubmitted && !fromBranchId ? 'Seleccione sucursal origen' : ''}
              />
              <div className="flex items-center justify-center pb-2">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mi sucursal</label>
                <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600">
                  {toBranchName || 'Sin sucursal'}
                </div>
              </div>
            </div>

            {/* Nota */}
            <InputCustom
              multiline
              name="note"
              value={note}
              label="Nota / Motivo de solicitud"
              onChange={(e) => setNote(e.target.value)}
              error={false}
            />

            {/* Buscador de productos */}
            {fromBranchId && (
              <div className="relative" ref={searchRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar producto en sucursal origen
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
                            className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 ${added ? 'opacity-40 pointer-events-none' : ''}`}
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
            )}

            {/* Lista de ítems */}
            {items.length > 0 && (
              <div className="space-y-2">
                {items.map((item, i) => {
                  const qtyError =
                    formSubmitted && item.quantityRequested < 1 ? 'Mínimo 1' : '';
                  const priceError =
                    formSubmitted && Number(item.price) <= 0 ? 'Debe ser mayor a 0' : '';
                  return (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                          {item.productCode && (
                            <p className="text-xs text-gray-400">Cód: {item.productCode}</p>
                          )}
                          <p className="text-xs text-gray-400">Stock disponible: {item.stock}</p>
                        </div>
                        <div className="w-24 shrink-0">
                          <InputCustom
                            name={`qty-${i}`}
                            value={item.quantityRequested}
                            label="Cantidad"
                            type="number"
                            onChange={(e) => handleUpdateItem(i, 'quantityRequested', Number(e.target.value))}
                            error={!!qtyError}
                            helperText={qtyError}
                          />
                        </div>
                        <div className="w-24 shrink-0">
                          <SelectCustom
                            label="Unidad"
                            options={Object.values(TypeUnit).map(u => ({
                              id: u,
                              value: u === TypeUnit.CAJA ? 'Caja' : 'Unidad',
                            }))}
                            selected={{ id: item.typeUnit, value: item.typeUnit === TypeUnit.CAJA ? 'Caja' : 'Unidad' }}
                            onSelect={(v) => {
                              if (v && !Array.isArray(v)) handleUpdateItem(i, 'typeUnit', v.id as TypeUnit);
                            }}
                            error={false}
                          />
                        </div>
                        <div className="w-28 shrink-0">
                          <InputCustom
                            name={`price-${i}`}
                            value={item.price}
                            label="Precio"
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
                                handleUpdateItem(i, 'price', val);
                              }
                            }}
                            onBlur={() => {
                              const num = parseFloat(item.price);
                              if (!isNaN(num)) handleUpdateItem(i, 'price', num.toFixed(2));
                            }}
                            error={!!priceError}
                            helperText={priceError}
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
                    </div>
                  );
                })}
              </div>
            )}

            {formSubmitted && items.length === 0 && (
              <p className="text-sm text-red-500">Debe agregar al menos un producto</p>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" color="bg-gray-400" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Enviar Solicitud
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
