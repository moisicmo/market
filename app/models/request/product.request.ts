import type { BrandModel } from "../response/brand.response";
import type { CategoryModel } from "../response/category.response";
import type { ProviderModel } from "../response/provider.response";
import { formPriceValidations, type FormPriceModel, type FormPriceValidations, type PriceRequest } from "./price.request";


export interface ProductRequest {
  categoryId: string;
  brandId: string;
  providerId: string;
  code: string;
  name: string;
  description: string;
  barCode: string;
  prices: PriceRequest[];
}

interface FormProductModel {
  category: CategoryModel | null;
  brand: BrandModel | null;
  provider: BrandModel | null;
  code: string;
  name: string;
  description: string;
  barCode: string;
  prices: FormPriceModel[];
};

export const formProductFields: FormProductModel = {
  category: null,
  brand: null,
  provider: null,
  code: '',
  name: '',
  description: '',
  barCode: '',
  prices: [],
};

interface FormProductValidations {
  category: [(value: CategoryModel) => boolean, string];
  brand: [(value: BrandModel) => boolean, string];
  provider: [(value: ProviderModel) => boolean, string];
  code: [(value: string) => boolean, string];
  name: [(value: string) => boolean, string];
  prices: {
    array: [(value: FormPriceModel[]) => boolean, string];  
    item: FormPriceValidations; // <-- VALIDACIONES POR ITEM
  };
}

export const formProductValidations: FormProductValidations = {
  category: [(value) => value != null, 'Debe ingresar la categoria'],
  brand: [(value) => value != null, 'Debe ingresar la marca'],
  provider: [(value) => value != null, 'Debe ingresar el proveedor'],
  code: [(value) => value.length >= 1, 'Debe ingresar el código'],
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],

  prices: {
    array: [(value) => value.length >= 1, "Debe ingresar al menos un precio"],
    item: formPriceValidations,
  },
};