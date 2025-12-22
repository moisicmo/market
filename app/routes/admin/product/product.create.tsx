import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useBranchStore, useCategoryStore, useBrandStore } from '@/hooks';
import { Button, InputCustom, SelectCustom, ValueSelect } from '@/components';
import { formProductFields, formProductValidations, TypeUnit, type FormPriceModel, type ProductModel, type ProductRequest } from '@/models';
import { ImageUploader } from '@/components/input_image.custom';
import { PriceSection } from './prices.create';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: ProductModel | null;
  image?: string;
  onCreate: (body: ProductRequest, image: File | null) => void;
  onUpdate: (id: string, body: ProductRequest) => void;
}

export const ProductCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    image,
    onCreate,
    onUpdate,
  } = props;

  const { dataBranch, getBranches } = useBranchStore();
  const { dataBrand, getBrands } = useBrandStore();
  const { dataCategory, getCategories } = useCategoryStore();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    category,
    brand,
    name,
    code,
    description,
    barCode,
    prices,

    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,

    categoryValid,
    brandValid,
    nameValid,
    codeValid,
    descriptionValid,
    barCodeValid,
    pricesValid,
  } = useForm(item ?? formProductFields, formProductValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;

    const request = {
      categoryId: category.id,
      brandId: brand.id,
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      barCode: barCode.trim(),
      prices: prices.map((p: any) => ({
        branchId: p.branch!.id,
        typeUnit: p.typeUnit,
        price: p.price,
        promoPrice: p.promoPrice,
      })),
    };

    if (item == null) {
      await onCreate(request, selectedImage);
    } else {
      await onUpdate(item.id, request);
    }

    handleClose();
    onResetForm();
    setSelectedImage(null);
  };

  useEffect(() => {
    if (item) {
      setFormSubmitted(false);
    }
  }, [item]);

  useEffect(() => {
    getBranches();
    getBrands();
    getCategories();
  }, []);

  const branchesSucursal = dataBranch.data?.filter(
    (b) => b.type === 'sucursal'
  ) ?? [];

  const createPricesFromBranches = (): FormPriceModel[] => {
    return branchesSucursal.map((branch) => ({
      id: crypto.randomUUID(),   // 👈 CLAVE
      branch,
      typeUnit: TypeUnit.UNIDAD,
      price: '',
      promoPrice: '',
    }));
  };

  const addPrice = () => {
    const newPrice: FormPriceModel = {
      id: crypto.randomUUID(),
      branch: null,
      typeUnit: '',
      price: '',
      promoPrice: '',
    };
    onValueChange("prices", [...prices, newPrice]);
  };


  const removePrice = (index: number) => {
    const updated = prices.filter((_: any, i: number) => i !== index);
    onValueChange("prices", updated);
  };

  const createCopyPrice = (index: number) => {
    const original = prices[index];
    if (!original) return;

    const copied: FormPriceModel = {
      ...original,
      id: crypto.randomUUID(), // 👈 NUEVO ID
    };

    onValueChange("prices", [...prices, copied]);
  };


  const handlePriceChange = (index: number, field: string, value: any) => {
    const updated = [...prices];

    if (field === 'branch') {
      const selected = dataBranch.data?.find((b: any) => b.id === value.id);
      updated[index].branch = selected ?? null;
    } else if (field === 'typeUnit') {
      updated[index].typeUnit = value as TypeUnit;
    } else if (field === 'price') {
      updated[index].price = value;
    } else if (field === 'promoPrice') {
      updated[index].promoPrice = value;
    }

    onValueChange('prices', updated);
  };

  useEffect(() => {
    // Solo cuando es producto nuevo
    if (!item && branchesSucursal.length > 0 && prices.length === 0) {
      const initialPrices = createPricesFromBranches();
      onValueChange('prices', initialPrices);
    }
  }, [branchesSucursal, item]);

  const typeUnitOptions: ValueSelect[] = Object.entries(TypeUnit).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 z-10">
          <h2 className="text-lg sm:text-xl font-bold">
            {item ? 'Editar Producto' : 'Producto Nuevo'}
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={sendSubmit} className="space-y-4 sm:space-y-6">
            {/* Sección de imagen y formulario básico */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="w-full lg:w-1/3">
                <ImageUploader
                  initialImageUrl={image ?? undefined}
                  onUpload={(file) => setSelectedImage(file)}
                  maxSize={10 * 1024 * 1024}
                  acceptedFormats={['image/jpeg', 'image/png']}
                />
              </div>
              <div className="w-full lg:w-2/3 sm:space-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                  <SelectCustom
                    label="Categoria"
                    options={dataCategory.data?.map((category) => ({ id: category.id, value: category.name })) ?? []}
                    selected={category ? { id: category.id, value: category.name } : null}
                    onSelect={(value) => {
                      if (value && !Array.isArray(value)) {
                        const select = dataCategory.data?.find((r) => r.id === value.id);
                        onValueChange('category', select);
                      }
                    }}
                    error={!!categoryValid && formSubmitted}
                    helperText={formSubmitted ? categoryValid : ''}
                  />
                  <SelectCustom
                    label="Marca"
                    options={dataBrand.data?.map((brand) => ({ id: brand.id, value: brand.name })) ?? []}
                    selected={brand ? { id: brand.id, value: brand.name } : null}
                    onSelect={(value) => {
                      if (value && !Array.isArray(value)) {
                        const select = dataBrand.data?.find((r) => r.id === value.id);
                        onValueChange('brand', select);
                      }
                    }}
                    error={!!brandValid && formSubmitted}
                    helperText={formSubmitted ? brandValid : ''}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputCustom
                    name="name"
                    value={name}
                    label="Nombre"
                    onChange={onInputChange}
                    error={!!nameValid && formSubmitted}
                    helperText={formSubmitted ? nameValid : ''}
                  />
                  <InputCustom
                    name="code"
                    value={code}
                    label="Código"
                    onChange={onInputChange}
                    error={!!codeValid && formSubmitted}
                    helperText={formSubmitted ? codeValid : ''}
                  />
                  <InputCustom
                    name="barCode"
                    value={barCode}
                    label="Código de barras"
                    onChange={onInputChange}
                    error={!!barCodeValid && formSubmitted}
                    helperText={formSubmitted ? barCodeValid : ''}
                  />
                </div>
                <InputCustom
                  multiline
                  name="description"
                  value={description}
                  label="Descripción"
                  onChange={onInputChange}
                  error={!!descriptionValid && formSubmitted}
                  helperText={formSubmitted ? descriptionValid : ''}
                />
              </div>
            </div>
            {/* Sección de precios como componente separado */}
            <PriceSection
              prices={prices}
              pricesValid={pricesValid}
              formSubmitted={formSubmitted}
              dataBranch={branchesSucursal}
              typeUnitOptions={typeUnitOptions}
              onAddPrice={addPrice}
              onRemovePrice={removePrice}
              onCreateCopy={createCopyPrice}
              onPriceChange={handlePriceChange}
            />
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 sm:pt-6 border-t">
              <Button
                type="button"
                onClick={() => {
                  onResetForm();
                  handleClose();
                }}
                color='bg-gray-400'
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className="w-full sm:w-auto order-1 sm:order-2 mb-2 sm:mb-0"
              >
                {item ? 'Editar' : 'Crear'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};