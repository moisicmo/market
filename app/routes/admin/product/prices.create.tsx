import { Info, Package } from "lucide-react";
import { SelectCustom, ValueSelect } from '@/components';
import { TypeUnit, type BranchModel, type FormPriceModel } from "@/models";
import { ExpandedPriceView } from "./prices";

interface PriceSectionProps {
  prices: FormPriceModel[];
  pricesValid?: any;
  formSubmitted: boolean;
  dataBranch: BranchModel[];
  onAddPrice: (price: FormPriceModel) => void;
  onRemovePrice: (index: number) => void;
  onPriceChange: (index: number, field: string, value: any) => void;
}

export const PriceSection = ({
  prices,
  pricesValid,
  formSubmitted,
  dataBranch,
  onAddPrice,
  onRemovePrice,
  onPriceChange,
}: PriceSectionProps) => {

  const availableOptions: ValueSelect[] = [];

  for (const branch of dataBranch) {
    for (const typeUnit of Object.values(TypeUnit)) {
      const exists = prices.some(
        p => p.branch?.id === branch.id && p.typeUnit === typeUnit
      );

      if (!exists) {
        availableOptions.push({
          id: `${branch.id}-${typeUnit}`,
          value: `${branch.name} / ${typeUnit}`,
        });
      }
    }
  }

  return (
    <div className="border-t pt-4 sm:pt-6">

      {/* UNA SOLA FILA */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {prices.length} precio(s)
        </span>
        <SelectCustom
          label="Agregar precios"
          multiple
          options={availableOptions}
          selected={null}
          onSelect={(values) => {
            console.log('Selected values to add:', values);
            if (!Array.isArray(values)) return;

            values.forEach(v => {
              const [branchId, typeUnit] = v.id.split(/-(?!.*-)/);
              console.log('Adding price for branchId:', branchId, 'typeUnit:', typeUnit);
              const branch = dataBranch.find(b => b.id === branchId);
              if (!branch) return;

              onAddPrice({
                id: crypto.randomUUID(),
                branch,
                typeUnit: typeUnit as TypeUnit,
                price: '',
              });
            });
          }}
        />
      </div>
      {/* GRID RESPONSIVO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {prices.length === 0 ? (
          <div className="col-span-full text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay precios configurados
            </p>
          </div>
        ) : (
          prices.map((price, index) => (
            <ExpandedPriceView
              key={price.id}
              price={price}
              index={index}
              pricesValid={pricesValid}
              formSubmitted={formSubmitted}
              onRemovePrice={onRemovePrice}
              onPriceChange={onPriceChange}
            />
          ))
        )}
      </div>

      {prices.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 flex gap-2">
            <Info className="w-4 h-4 mt-0.5" />
            Puedes tener precios distintos por sucursal y tipo de unidad
          </p>
        </div>
      )}
    </div>
  );
};
