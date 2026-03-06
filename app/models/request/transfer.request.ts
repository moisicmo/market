import type { BranchModel, ProductPresentationModel } from "..";


// request
export interface TransferRequest {
  fromBranchId: string;
  toBranchId: string;
  detail: string;
  outputs: TransferOutputItem[];
}

export interface TransferOutputItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface TransferItemFormModel {
  productId: string;
  productName: string;
  productCode?: string;
  stock: number;
  quantity: number;
  price: number;
}

// model
interface FormTransferModel {
  detail: string;
  branch: BranchModel | null;
  presentations: PresentationModelz[];
};

export interface PresentationModelz {
  productPresentation: ProductPresentationModel;
  quantity: number;
  price: number;
  dueDate: Date;
}

export const formTransferFields: FormTransferModel = {
  detail: 'Transferencia de productos',
  branch: null,
  presentations: [],
};

// validaciones
interface FormTransferValidations {
  detail: [(value: string) => boolean, string];
  branch: [(value:BranchModel) => boolean, string];
}
export const formTransferValidations: FormTransferValidations = {
  detail: [(value) => value.length > 0, 'Debe ingresar un detalle de ingreso'],
  branch: [(value) => value != null, 'Debe ingresar una sucursal'],
};
// validaciones de cada presentación individual
// interface PresentationValidations {
//   productPresentation: [(value: ProductPresentationModel | null) => boolean, string];
//   quantity: [(value: number) => boolean, string];
//   price: [(value: number) => boolean, string];
// }

// export const presentationValidations: PresentationValidations = {
//   productPresentation: [(value) => value != null, 'Debe seleccionar una presentación de producto'],
//   quantity: [(value) => value > 0, 'La cantidad debe ser mayor a 0'],
//   price: [(value) => value > 0, 'El precio debe ser mayor a 0'],
// };
