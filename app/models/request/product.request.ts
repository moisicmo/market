import { TypeUnit } from "..";
import type { BrandModel } from "../response/brand.response";
import type { CategoryModel } from "../response/category.response";
import { formPriceValidations, type FormPriceModel, type FormPriceValidations, type PriceRequest } from "./price.request";

export interface UnitConversion {
  fromUnit: string;
  toUnit: string;
  factor: number;
}
export interface ProductRequest {
  categoryId: string;
  brandId: string;
  code: string;
  name: string;
  description: string;
  barCode: string;
  promoPrice: number;
  refCost: number;
  prices: PriceRequest[];
  unitConversion: UnitConversion;
}
interface FormUnitConversion {
  fromUnit: string;
  toUnit: string;
  factor: number;
}
interface FormProductModel {
  category: CategoryModel | null;
  brand: BrandModel | null;
  code: string;
  name: string;
  description: string;
  barCode: string;
  promoPrice: string;
  refCost: string;
  unitConversion: FormUnitConversion;
  prices: FormPriceModel[];
};

export const formProductFields: FormProductModel = {
  category: null,
  brand: null,
  code: '',
  name: '',
  description: '',
  barCode: '',
  promoPrice: '0',
  refCost: '0.00',
  unitConversion: {
    fromUnit: TypeUnit.UNIDAD as string,
    toUnit: TypeUnit.UNIDAD as string,
    factor: 1,
  },
  prices: [],
};

interface FormProductValidations {
  category: [(value: CategoryModel) => boolean, string];
  brand: [(value: BrandModel) => boolean, string];
  code: [(value: string) => boolean, string];
  name: [(value: string) => boolean, string];
  promoPrice: [(value: string) => boolean, string];
  refCost: [(value: string) => boolean, string];
  unitConversion: {
    fromUnit: [(value: string) => boolean, string];
    toUnit: [(value: string) => boolean, string];
    factor: [(value: string) => boolean, string];
  },
  prices: {
    array: [(value: FormPriceModel[]) => boolean, string];
    item: FormPriceValidations; // <-- VALIDACIONES POR ITEM
  };
}

export const formProductValidations: FormProductValidations = {
  category: [(value) => value != null, 'Debe ingresar la categoria'],
  brand: [(value) => value != null, 'Debe ingresar la marca'],
  code: [(value) => value.length >= 1, 'Debe ingresar el código'],
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  promoPrice: [(value) => value !== "", 'Debe ingresar el precio promocional'],
  refCost: [(value) => value !== "", 'Debe ingresar el costo referencial'],
  unitConversion: {
    fromUnit: [(value) => value.length >= 1, 'Debe ingresar la unidad de origen'],
    toUnit: [(value) => value.length >= 1, 'Debe ingresar la unidad de destino'],
    factor: [(value) => !isNaN(Number(value)) && Number(value) > 0, 'Debe ingresar un factor válido mayor a 0'],
  },
  prices: {
    array: [(value) => value.length >= 1, "Debe ingresar al menos un precio"],
    item: formPriceValidations,
  },
};