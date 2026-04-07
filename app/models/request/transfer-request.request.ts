import type { TypeUnit } from '../enums';

export interface CreateTransferRequestBody {
  fromBranchId: string;
  toBranchId: string;
  note?: string;
  items: TransferRequestItemBody[];
}

export interface TransferRequestItemBody {
  productId: string;
  quantityRequested: number;
  typeUnit: TypeUnit;
  price: number;
  detail?: string;
}

export interface DispatchTransferRequestBody {
  note?: string;
  items: { itemId: string; quantityDispatched: number }[];
}

export interface ReceiveTransferRequestBody {
  observationNote?: string;
}

export interface RejectTransferRequestBody {
  rejectionNote: string;
}
