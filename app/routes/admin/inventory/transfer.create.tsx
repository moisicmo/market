import { useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { Button, InputCustom, SelectCustom, ValueSelect } from '@/components';
import {
  presentationValidations,
  type KardexModel,
  type PresentationModel,
  type BaseResponse,
  type BranchModel,
  formTransferFields,
  formTransferValidations,
  type TransferRequest,
} from '@/models';
import { Trash2 } from 'lucide-react';

interface Props {
  branchId: string;
  dataKardex: KardexModel[];
  handleClose: () => void;
  onTransferCreate: (body: TransferRequest) => void;
  dataBranch: BaseResponse<BranchModel>;
}

type PresentationErrors = {
  quantity?: string;
  price?: string;
};

export const TransferCreate = ({
  branchId,
  dataKardex,
  handleClose,
  onTransferCreate,
  dataBranch,
}: Props) => {
  const {
    detail,
    branch,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    detailValid,
    branchValid,
  } = useForm(formTransferFields, formTransferValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [presentations, setPresentations] = useState<PresentationModel[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const validatePresentations = (
    presentations: PresentationModel[],
    dataKardex: KardexModel[]
  ): PresentationErrors[] => {
    return presentations.map((p) => {
      const errors: PresentationErrors = {};
      const [validQty, msgQty] = presentationValidations.quantity;
      const [validPrice, msgPrice] = presentationValidations.price;

      if (!validQty(p.quantity)) {
        errors.quantity = msgQty;
      } else {
        // ✅ Verificar stock
        const kardexItem = dataKardex.find(k => k.presentation.id === p.productPresentation.id);
        if (kardexItem && p.quantity > kardexItem.stock) {
          errors.quantity = `La cantidad (${p.quantity}) excede el stock disponible (${kardexItem.stock})`;
        }
      }

      if (!validPrice(p.price)) errors.price = msgPrice;

      return errors;
    });
  };


  const presentationErrors = validatePresentations(presentations, dataKardex);

  const hasPresentationErrors = presentationErrors.some((err) =>
    Object.values(err).some(Boolean)
  );

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);

    console.log('isFormValid:', isFormValid);
    console.log('presentations:', presentations);
    console.log('presentationErrors:', presentationErrors);
    console.log('hasPresentationErrors:', hasPresentationErrors);

    if (!isFormValid || presentations.length === 0 || hasPresentationErrors) return;

    console.log('evaluando');


    const formattedPresentations = presentations.map((p) => ({
      productPresentationId: p.productPresentation.id,
      quantity: p.quantity,
      price: p.price,
    }));
    console.log('transfiriendo', {
      fromBranchId: branchId,
      toBranchId: branch.id,
      detail: detail.trim(),
      outputs: formattedPresentations,
    })
    await onTransferCreate({
      fromBranchId: branchId,
      toBranchId: branch.id,
      detail: detail.trim(),
      outputs: formattedPresentations,
    });

    handleClose();
    onResetForm();
    setPresentations([]);
    setFormSubmitted(false);
  };

  const handleAddPresentation = () => {
    if (selectedIdx === null) return;
    const selected = dataKardex[selectedIdx].presentation;

    // Evitar duplicados
    if (presentations.find((p) => p.productPresentation.id === selected.id)) return;

    setPresentations((prev) => [
      ...prev,
      {
        productPresentation: selected,
        quantity: 1,
        price: 0,
        dueDate: new Date(),
      },
    ]);
  };

  const handleUpdate = (index: number, key: keyof PresentationModel, value: any) => {
    setPresentations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleRemove = (index: number) => {
    setPresentations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Nueva Transferencia</h2>
        <form onSubmit={sendSubmit} className="space-y-4">
          {/* Detalle */}
          <InputCustom
            name="detail"
            value={detail}
            label="Detalle"
            onChange={onInputChange}
            error={!!detailValid && formSubmitted}
            helperText={formSubmitted ? detailValid : ''}
          />
          <SelectCustom
            label="Sucursal destino"
            options={
              dataBranch.data
                ?.filter(branch => branch.id !== branchId)
                .map(branch => ({
                  id: branch.id,
                  value: branch.name
                })) ?? []
            }
            selected={branch ? { id: branch.id, value: branch.name } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const selectedCustomer = dataBranch.data?.find((c) => c.id === value.id);
                onValueChange('branch', selectedCustomer);
              }
            }}
            error={!!branchValid && formSubmitted}
            helperText={formSubmitted ? branchValid : ''}
          />

          {/* Selector de presentación */}
          <div className="flex items-end gap-2">
            <SelectCustom
              label="Presentación"
              options={dataKardex.map((k, i) => new ValueSelect(i.toString(), k.presentation.name))}
              selected={selectedIdx !== null ? new ValueSelect(selectedIdx.toString(), dataKardex[selectedIdx].presentation.name) : null}
              onSelect={(value) => {
                if (value && !Array.isArray(value)) {
                  setSelectedIdx(Number(value.id));
                } else {
                  setSelectedIdx(null);
                }
              }}
              error={false}
            />

            <Button type="button" onClick={handleAddPresentation}>Agregar</Button>
          </div>
          {/* Lista de presentaciones agregadas */}
          {presentations.length > 0 && (
            <div className="mt-4 space-y-3">
              {presentations.map((p, i) => (
                <div key={i} className="rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-semibold">{p.productPresentation.name}</p>
                      {/* 👇 Mostrar stock disponible */}
                      <p className="text-xs text-gray-700">
                        Stock disponible:{" "}
                        {
                          dataKardex.find(k => k.presentation.id === p.productPresentation.id)?.stock ?? 0
                        }
                      </p>
                    </div>
                    <button onClick={() => handleRemove(i)} title="Eliminar" className="cursor-pointer">
                      <Trash2 color="var(--color-error)" className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <InputCustom
                      name={`presentations[${i}].quantity`}
                      value={p.quantity}
                      label="Cantidad"
                      type="number"
                      onChange={(e) => handleUpdate(i, 'quantity', Number(e.target.value))}
                      error={!!presentationErrors[i]?.quantity && formSubmitted}
                      helperText={formSubmitted ? presentationErrors[i]?.quantity : ''}
                    />

                    <InputCustom
                      name={`presentations[${i}].price`}
                      value={p.price}
                      label="Precio"
                      type="number"
                      onChange={(e) => handleUpdate(i, 'price', Number(e.target.value))}
                      error={!!presentationErrors[i]?.price && formSubmitted}
                      helperText={formSubmitted ? presentationErrors[i]?.price : ''}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Validación general */}
          {formSubmitted && presentations.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Debe agregar al menos una presentación</p>
          )}
          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              color="bg-gray-400"
              onClick={() => {
                onResetForm();
                setPresentations([]);
                handleClose();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
