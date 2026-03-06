export enum WriteoffReason {
  VENCIMIENTO = 'VENCIMIENTO',
  DANIO = 'DANIO',
  ROBO = 'ROBO',
  PERDIDA = 'PERDIDA',
  OTRO = 'OTRO',
}

export const WriteoffReasonLabels: Record<WriteoffReason, string> = {
  [WriteoffReason.VENCIMIENTO]: 'Vencimiento',
  [WriteoffReason.DANIO]: 'Daño',
  [WriteoffReason.ROBO]: 'Robo',
  [WriteoffReason.PERDIDA]: 'Pérdida',
  [WriteoffReason.OTRO]: 'Otro',
};

export interface WriteoffItemRequest {
  productId: string;
  quantity: number;
}

export interface WriteoffRequest {
  branchId: string;
  reason: WriteoffReason;
  description?: string;
  items: WriteoffItemRequest[];
}

export interface WriteoffItemFormModel {
  productId: string;
  productName: string;
  productCode?: string;
  stock: number;
  quantity: number;
}
