import { TransferRequestStatus, TypeUnit } from '../enums';

export interface TransferRequestItemModel {
  id: string;
  quantityRequested: number;
  quantityDispatched: number | null;
  typeUnit: TypeUnit;
  price: number;
  detail: string | null;
  product: { id: string; name: string; code: string | null };
}

export interface TransferRequestModel {
  id: string;
  status: TransferRequestStatus;
  note: string | null;
  rejectionNote: string | null;
  observationNote: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
  dispatchedByName: string | null;
  dispatchedAt: string | null;
  receivedByName: string | null;
  receivedAt: string | null;
  fromBranch: { id: string; name: string };
  toBranch: { id: string; name: string };
  items: TransferRequestItemModel[];
  _count: { items: number };
}
