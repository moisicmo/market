import { useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { Button, DateTimePickerCustom, InputCustom, SelectCustom, ValueSelect } from '@/components';
import {
  formInputFields,
  formInputValidations,
  presentationValidations,
  type KardexModel,
  type InputRequest,
  type PresentationModel,
} from '@/models';
import { Trash2 } from 'lucide-react';

interface Props {
  branchId: string;
  dataKardex: KardexModel[];
  handleClose: () => void;
  onCreate: (body: InputRequest) => void;
}

type PresentationErrors = {
  quantity?: string;
  price?: string;
  dueDate?: string;
};

export const InputCreate = ({
  branchId,
  dataKardex,
  handleClose,
  onCreate,
}: Props) => {
  const {
    detail,
    onInputChange,
    onResetForm,
    isFormValid,
    detailValid,
  } = useForm(formInputFields, formInputValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [presentations, setPresentations] = useState<PresentationModel[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const validatePresentations = (presentations: PresentationModel[]): PresentationErrors[] => {
    return presentations.map((p) => {
      const errors: PresentationErrors = {};
      const [validQty, msgQty] = presentationValidations.quantity;
      const [validPrice, msgPrice] = presentationValidations.price;
      const [validDue, msgDue] = presentationValidations.dueDate;

      if (!validQty(p.quantity)) errors.quantity = msgQty;
      if (!validPrice(p.price)) errors.price = msgPrice;
      if (!validDue(p.dueDate)) errors.dueDate = msgDue;

      return errors;
    });
  };

  const presentationErrors = validatePresentations(presentations);
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
      dueDate: p.dueDate,
    }));
    console.log('creando')
    await onCreate({
      branchId,
      detail: detail.trim(),
      presentations: formattedPresentations,
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
        <h2 className="text-xl font-bold mb-4">Nueva Entrada</h2>

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
                    <p className="text-sm font-semibold mb-2">{p.productPresentation.name}</p>
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

                    <DateTimePickerCustom
                      name={`presentations[${i}].dueDate`}
                      value={p.dueDate}
                      label="Fecha vencimiento"
                      mode="date"
                      onChange={(date) => handleUpdate(i, 'dueDate', date)}
                      error={!!presentationErrors[i]?.dueDate && formSubmitted}
                      helperText={formSubmitted ? presentationErrors[i]?.dueDate : ''}
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
