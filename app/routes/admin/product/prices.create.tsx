import { Tag, Info, Trash2, Plus, Building, Package, DollarSign } from "lucide-react";
import { SelectCustom, InputCustom, ValueSelect } from '@/components';
import type { FormPriceModel } from "@/models";
import { useState } from "react";

interface PriceSectionProps {
  prices: FormPriceModel[];
  pricesValid?: any;
  formSubmitted: boolean;
  dataBranch: any;
  typeUnitOptions: ValueSelect[];
  onAddPrice: () => void;
  onRemovePrice: (index: number) => void;
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
    onPriceChange,
  } = props;

  const [expandedPrice, setExpandedPrice] = useState<number | null>(0);

  // Versión compacta para cuando hay muchos precios
  const CompactPriceView = ({ price, index }: { price: FormPriceModel; index: number }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Building className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {price.branch?.name || "Sin sucursal"}
          </span>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Package className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="text-sm truncate">
            {typeUnitOptions.find(opt => opt.id === price.typeUnit)?.value || "Sin tipo"}
          </span>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <DollarSign className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="text-sm font-semibold">
            S/ {Number(price.price).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-0">
        <button
          type="button"
          onClick={() => setExpandedPrice(expandedPrice === index ? null : index)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {expandedPrice === index ? "Ocultar" : "Editar"}
        </button>

        <button
          type="button"
          onClick={() => onRemovePrice(index)}
          className="text-red-500 hover:text-red-600 p-1 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Versión expandida para edición
  const ExpandedPriceView = ({ price, index }: { price: FormPriceModel; index: number }) => (
    <div className="border-2 border-blue-200 p-4 rounded-lg bg-blue-50 relative">
      <div className="absolute top-3 right-3">
        <button
          type="button"
          onClick={() => onRemovePrice(index)}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">


        <SelectCustom
          label="Sucursal"
          options={dataBranch.data?.map((b: any) => ({ id: b.id, value: b.name })) ?? []}
          selected={price.branch ? { id: price.branch.id, value: price.branch.name } : null}
          onSelect={(value) => {
            if (value && !Array.isArray(value)) {
              onPriceChange(index, 'branch', value);
            }
          }}
          error={!!pricesValid?.itemsValid?.[index]?.branchValid && formSubmitted}
          helperText={formSubmitted ? pricesValid?.itemsValid?.[index]?.branchValid : ''}
        />
        <SelectCustom
          label="Tipo Unidad"
          options={typeUnitOptions}
          selected={typeUnitOptions.find(opt => opt.id === price.typeUnit) ?? null}
          onSelect={(value) => {
            if (value && !Array.isArray(value)) {
              onPriceChange(index, 'typeUnit', value.id);
            }
          }}
          error={!!pricesValid?.itemsValid?.[index]?.typeUnitValid && formSubmitted}
          helperText={formSubmitted ? pricesValid?.itemsValid?.[index]?.typeUnitValid : ''}
        />

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            Precio (S/)
          </label>
          <InputCustom
            name={`prices.${index}.price`}
            value={price.price}
            onChange={(e) => {
              onPriceChange(index, 'price', Number(e.target.value));
            }}
            error={!!pricesValid?.itemsValid?.[index]?.priceValid && formSubmitted}
            helperText={formSubmitted ? pricesValid?.itemsValid?.[index]?.priceValid : ''}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpandedPrice(null)}
        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        ↑ Contraer
      </button>
    </div>
  );

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
            <div key={index}>
              {expandedPrice === index ? (
                <ExpandedPriceView price={price} index={index} />
              ) : (
                <CompactPriceView price={price} index={index} />
              )}
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