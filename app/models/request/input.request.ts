import type { ProductPresentationModel } from "..";


// request
export interface InputRequest {
  branchId: string;
  detail: string;
  presentations: Presentation[];
}

interface Presentation {
  productPresentationId: string;
  quantity: number;
  price: number;
}

// model
interface FormInputModel {
  detail: string;
  presentations: PresentationModel[];
};

export interface PresentationModel {
  productPresentation: ProductPresentationModel;
  quantity: number;
  price: number;
  dueDate: Date;
}

export const formInputFields: FormInputModel = {
  detail: 'compra',
  presentations: [],
};

// validaciones
interface FormInputValidations {
  detail: [(value: string) => boolean, string];
}
export const formInputValidations: FormInputValidations = {
  detail: [(value) => value.length > 0, 'Debe ingresar un detalle de ingreso'],
};
// validaciones de cada presentación individual
interface PresentationValidations {
  productPresentation: [(value: ProductPresentationModel | null) => boolean, string];
  quantity: [(value: number) => boolean, string];
  price: [(value: number) => boolean, string];
}

export const presentationValidations: PresentationValidations = {
  productPresentation: [(value) => value != null, 'Debe seleccionar una presentación de producto'],
  quantity: [(value) => value > 0, 'La cantidad debe ser mayor a 0'],
  price: [(value) => value > 0, 'El precio debe ser mayor a 0'],
};
