import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useForm, useCategoryStore, useBrandStore, useAuthStore } from '@/hooks';
import { Button, InputCustom, SelectCustom } from '@/components';
import { formProductFields, formProductValidations, TypeUnit, type FormPriceModel, type ProductModel, type ProductRequest } from '@/models';
import { ImageUploader } from '@/components/input_image.custom';
import { PriceSection } from './prices.create';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: ProductModel | null;
  image?: string;
  onCreate: (body: ProductRequest, image: File | null) => void;
  onUpdate: (id: string, body: ProductRequest,  image: File | null) => void;
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

  const { dataBrand, getBrands } = useBrandStore();
  const { branchesUser } = useAuthStore();
  const { dataCategory, getCategories } = useCategoryStore();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const normalizedItem = useMemo(() => {
    if (!item) return null;
    return {
      ...item,
      code: item.code ?? '',
      description: item.description ?? '',
      barCode: item.barCode ?? '',
      promoPrice: String(item.promoPrice ?? 0),
      refCost: Number((item as any).refCost ?? 0).toFixed(2),
      unitConversion: (item as any).unitConversion ?? {
        fromUnit: TypeUnit.UNIDAD as string,
        toUnit: TypeUnit.UNIDAD as string,
        factor: 1,
      },
    };
  }, [item?.id]);

  const {
    category,
    brand,
    name,
    code,
    description,
    barCode,
    promoPrice,
    refCost,
    unitConversion,
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
    promoPriceValid,
    refCostValid,
    unitConversionValid,
    pricesValid,
  } = useForm(normalizedItem ?? formProductFields, formProductValidations);

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
      promoPrice: Number(promoPrice),
      refCost: Number(refCost),
      unitConversion: {
        fromUnit: unitConversion.fromUnit,
        toUnit: unitConversion.toUnit,
        factor: Number(unitConversion.factor),
      },
      prices: prices.map((p: any) => ({
        branchId: p.branch!.id,
        typeUnit: p.typeUnit,
        price: p.price,
      })),
    };

    if (item == null) {
      await onCreate(request, selectedImage);
    } else {
      await onUpdate(item.id, request, selectedImage);
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
    getBrands();
    getCategories();
  }, []);

  const branchesSucursal = branchesUser?.filter(
    (b) => b.type === 'sucursal'
  ) ?? [];

  const createPricesFromBranches = (): FormPriceModel[] => {
    return branchesSucursal.map((branch) => ({
      id: crypto.randomUUID(),   // 👈 CLAVE
      branch,
      typeUnit: TypeUnit.UNIDAD,
      price: '',
    }));
  };

  const addPrice = (newPrice: FormPriceModel) => {
    console.log('Adding price:', newPrice);
    onValueChange("prices", [...prices, newPrice]);
  };

  const removePrice = (index: number) => {
    const updated = prices.filter((_: any, i: number) => i !== index);
    onValueChange("prices", updated);
  };

  const handlePriceChange = (index: number, field: string, value: any) => {
    const updated = [...prices];

    if (field === 'branch') {
      const selected = branchesUser?.find((b: any) => b.id === value.id);
      updated[index].branch = selected ?? null;
    } else if (field === 'typeUnit') {
      updated[index].typeUnit = value as TypeUnit;
    } else if (field === 'price') {
      updated[index].price = value;
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
                {/* CONVERSIÓN DE UNIDADES */}
                  <p className="text-sm font-semibold mb-1">
                    Conversión de Unidades
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    Ej: 1 Caja = 12 Unidades. Por defecto 1 Unidad = 1 Unidad.
                  </p>

                  <div className="flex items-end gap-2">
                    <div className="flex-none">
                      <p className="text-xs text-gray-500 mb-1 text-center">1</p>
                    </div>
                    <div className="flex-1">
                      <SelectCustom
                        label="De"
                        options={Object.values(TypeUnit).map(u => ({
                          id: u,
                          value: u === TypeUnit.CAJA ? 'Caja' : 'Unidad',
                        }))}
                        selected={
                          unitConversion.fromUnit
                            ? { id: unitConversion.fromUnit, value: unitConversion.fromUnit === TypeUnit.CAJA ? 'Caja' : 'Unidad' }
                            : null
                        }
                        onSelect={(value) => {
                          if (value && !Array.isArray(value)) {
                            onValueChange('unitConversion', {
                              ...unitConversion,
                              fromUnit: value.id,
                            });
                          }
                        }}
                        error={!!unitConversionValid?.fromUnit && formSubmitted}
                        helperText={formSubmitted ? unitConversionValid?.fromUnit : ''}
                      />
                    </div>
                    <div className="flex-none pb-3">
                      <span className="text-sm font-medium text-gray-500">=</span>
                    </div>
                    <div className="flex-1">
                      <InputCustom
                        label="Equivale a"
                        name="unitConversion.factor"
                        value={unitConversion.factor}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val) || val === '') {
                            onValueChange('unitConversion', {
                              ...unitConversion,
                              factor: val,
                            });
                          }
                        }}
                        error={!!unitConversionValid?.factor && formSubmitted}
                        helperText={formSubmitted ? unitConversionValid?.factor : ''}
                      />
                    </div>
                    <div className="flex-1">
                      <SelectCustom
                        label="A"
                        options={Object.values(TypeUnit).map(u => ({
                          id: u,
                          value: u === TypeUnit.CAJA ? 'Caja' : 'Unidad',
                        }))}
                        selected={
                          unitConversion.toUnit
                            ? { id: unitConversion.toUnit, value: unitConversion.toUnit === TypeUnit.CAJA ? 'Caja' : 'Unidad' }
                            : null
                        }
                        onSelect={(value) => {
                          if (value && !Array.isArray(value)) {
                            onValueChange('unitConversion', {
                              ...unitConversion,
                              toUnit: value.id,
                            });
                          }
                        }}
                        error={!!unitConversionValid?.toUnit && formSubmitted}
                        helperText={formSubmitted ? unitConversionValid?.toUnit : ''}
                      />
                    </div>
                  </div>
                  {unitConversion.fromUnit && unitConversion.toUnit && Number(unitConversion.factor) > 0 && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      1 {unitConversion.fromUnit === TypeUnit.CAJA ? 'Caja' : 'Unidad'} = {unitConversion.factor} {unitConversion.toUnit === TypeUnit.CAJA ? 'Caja(s)' : 'Unidad(es)'}
                    </p>
                  )}
              </div>
              <div className="w-full lg:w-2/3 sm:space-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  <InputCustom
                    name="promoPrice"
                    value={promoPrice}
                    label="Precio Promocional (Bs.)"
                    type="number"
                    onChange={onInputChange}
                    error={!!promoPriceValid && formSubmitted}
                    helperText={formSubmitted ? promoPriceValid : ''}
                  />
                  <InputCustom
                    name="refCost"
                    value={refCost}
                    label="Costo Referencial (Bs.)"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
                        onValueChange('refCost', val);
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(refCost);
                      if (!isNaN(num)) {
                        onValueChange('refCost', num.toFixed(2));
                      }
                    }}
                    error={!!refCostValid && formSubmitted}
                    helperText={formSubmitted ? refCostValid : ''}
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
              onAddPrice={addPrice}
              onRemovePrice={removePrice}
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