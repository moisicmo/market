import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useProviderStore } from '@/hooks';
import { Button, InputCustom, SelectCustom, ValueSelect } from '@/components';
import {
  formInputFields,
  formInputValidations,
  productValidations,
  type KardexModel,
  type InputRequest,
  type ProductInputModel,
  type ProductInputRequest,
} from '@/models';
import { Trash2 } from 'lucide-react';

interface Props {
  branchId: string;
  dataKardex: KardexModel[];
  handleClose: () => void;
  onInputCreate: (body: InputRequest) => void;
}

type ProductErrors = {
  quantity?: string;
  price?: string;
  provider?: string;
};

export const InputCreate = ({
  branchId,
  dataKardex,
  handleClose,
  onInputCreate,
}: Props) => {
  const {
    detail,
    onInputChange,
    onResetForm,
    isFormValid,
    detailValid,
  } = useForm(formInputFields, formInputValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [products, setProducts] = useState<ProductInputModel[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const { dataProvider, getProviders } = useProviderStore();

  const validateProducts = (products: ProductInputModel[]): ProductErrors[] => {
    return products.map((p) => {
      const errors: ProductErrors = {};
      const [validQty, msgQty] = productValidations.quantity;
      const [validPrice, msgPrice] = productValidations.price;

      if (!validQty(p.quantity)) errors.quantity = msgQty;
      if (!validPrice(p.price)) errors.price = msgPrice;
      if (!p.provider) errors.provider = 'Debe seleccionar un proveedor';

      return errors;
    });
  };


  const productErrors = validateProducts(products);
  const hasPresentationErrors = productErrors.some((err) =>
    Object.values(err).some(Boolean)
  );

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid || products.length === 0 || hasPresentationErrors) return;

    console.log('evaluando');


    const formattedProducts: ProductInputRequest[] = products.map((p) => ({
      productId: p.product.id,
      quantity: p.quantity,
      price: p.price,
      providerId: p.provider?.id,
    }));
    console.log('creando')
    await onInputCreate({
      branchId,
      detail: detail.trim(),
      products: formattedProducts,
    });

    handleClose();
    onResetForm();
    setProducts([]);
    setFormSubmitted(false);
  };

  const handleAddPresentation = () => {
    if (selectedIdx === null) return;
    const selected = dataKardex[selectedIdx].product;

    // Evitar duplicados
    if (products.find((p) => p.product.id === selected.id)) return;

    setProducts((prev) => [
      ...prev,
      {
        product: selected,
        quantity: 1,
        price: 0,
        provider: null,   // 👈 AQUÍ
        dueDate: new Date(),
      },
    ]);
  };


  const handleUpdate = (index: number, key: keyof ProductInputModel, value: any) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleRemove = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };
  useEffect(() => {
    getProviders();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
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
              label="Producto"
              options={dataKardex.map((k, i) => new ValueSelect(i.toString(), k.product.name))}
              selected={selectedIdx !== null ? new ValueSelect(selectedIdx.toString(), dataKardex[selectedIdx].product.name) : null}
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
          {products.length > 0 && (
            <div className="mt-4 space-y-3">
              {products.map((p, i) => (
                <div key={i} className="rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-semibold mb-2">{p.product.name}</p>
                    <button onClick={() => handleRemove(i)} title="Eliminar" className="cursor-pointer">
                      <Trash2 color="var(--color-error)" className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <InputCustom
                      name={`products[${i}].quantity`}
                      value={p.quantity}
                      label="Cantidad"
                      type="number"
                      onChange={(e) => handleUpdate(i, 'quantity', Number(e.target.value))}
                      error={!!productErrors[i]?.quantity && formSubmitted}
                      helperText={formSubmitted ? productErrors[i]?.quantity : ''}
                    />

                    <InputCustom
                      name={`products[${i}].price`}
                      value={p.price}
                      label="Precio"
                      type="number"
                      onChange={(e) => handleUpdate(i, 'price', Number(e.target.value))}
                      error={!!productErrors[i]?.price && formSubmitted}
                      helperText={formSubmitted ? productErrors[i]?.price : ''}
                    />
                    <SelectCustom
                      label="Proveedor"
                      options={
                        dataProvider.data?.map((provider) => ({
                          id: provider.id,
                          value: provider.name,
                        })) ?? []
                      }
                      selected={
                        p.provider
                          ? { id: p.provider.id, value: p.provider.name }
                          : null
                      }
                      onSelect={(value) => {
                        if (value && !Array.isArray(value)) {
                          const selectedProvider = dataProvider.data?.find(
                            (prov) => prov.id === value.id
                          );
                          handleUpdate(i, 'provider', selectedProvider);
                        }
                      }}
                      error={!!productErrors[i]?.provider && formSubmitted}
                      helperText={formSubmitted ? productErrors[i]?.provider : ''}
                    />

                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Validación general */}
          {formSubmitted && products.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Debe agregar al menos una presentación</p>
          )}
          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              color="bg-gray-400"
              onClick={() => {
                onResetForm();
                setProducts([]);
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
