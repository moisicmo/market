


export interface FormPriceModel {
  inscriptionPrice : number,
  monthPrice : number,
}

export interface FormPriceValidations {
  inscriptionPrice: [(value: number) => boolean, string];
  monthPrice: [(value: number) => boolean, string];
}