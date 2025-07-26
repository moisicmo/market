

export interface AddressModel {
  id: string;
  zone: string;
  detail: string;
  city: {
    id: string;
    name: string;
  }
}
