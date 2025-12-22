import { Info, Plus, Package } from "lucide-react";
import { ValueSelect } from '@/components';
import type { BranchModel, FormPriceModel } from "@/models";
import { ExpandedPriceView } from "./prices";

interface PriceSectionProps {
  prices: FormPriceModel[];
  pricesValid?: any;
  formSubmitted: boolean;
  dataBranch: BranchModel[];
  typeUnitOptions: ValueSelect[];
  onAddPrice: () => void;
  onRemovePrice: (index: number) => void;
  onCreateCopy: (index: number) => void;
  onPriceChange: (index: number, field: string, value: any) => void;
}

export const PriceSection = (props: PriceSectionProps) => {
  const {
    prices,
    pricesValid,
    formSubmitted,
    dataBranch,
    typeUnitOptions,
    onAddPrice,
    onRemovePrice,
    onCreateCopy,
    onPriceChange,
  } = props;

  return (
    <div className="border-t pt-4 sm:pt-6">

      {/* Contador de precios */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          {prices.length} precio(s) configurado(s)
        </span>
        <button
          type="button"
          onClick={onAddPrice}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Precio
        </button>
      </div>

      {/* Lista de precios */}
      <div className="space-y-3">
        {prices.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay precios configurados. <br />
              <button
                type="button"
                onClick={onAddPrice}
                className="text-blue-600 hover:text-blue-700 font-medium mt-1"
              >
                Haz clic aquí para agregar el primero
              </button>
            </p>
          </div>
        ) : (
          prices.map((price, index) => (
            <div key={price.id}>
              <ExpandedPriceView
                price={price}
                index={index}
                dataBranch={dataBranch}
                typeUnitOptions={typeUnitOptions}
                pricesValid={pricesValid}
                formSubmitted={formSubmitted}
                onRemovePrice={onRemovePrice}
                onCreateCopy={onCreateCopy}
                onPriceChange={onPriceChange}
              />
            </div>
          ))
        )}
      </div>

      {/* Tips adicionales */}
      {prices.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Tip:</strong> Puedes tener múltiples precios para la misma sucursal con diferentes tipos de unidad,
              o diferentes precios para la misma unidad en distintas sucursales.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};