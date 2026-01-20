import { InputCustom, SelectCustom, type ValueSelect } from "@/components";
import type { BranchModel, FormPriceModel } from "@/models";
import { Copy, DollarSign, Trash2 } from "lucide-react";
import React from "react";

interface ExpandedPriceViewProps {
  price: FormPriceModel;
  index: number;
  dataBranch: BranchModel[];
  typeUnitOptions: ValueSelect[];
  pricesValid?: any;
  formSubmitted: boolean;
  onRemovePrice: (index: number) => void;
  onCreateCopy: (index: number) => void;
  onPriceChange: (index: number, field: string, value: any) => void;
}

export const ExpandedPriceView = React.memo(({
  price,
  index,
  dataBranch,
  typeUnitOptions,
  pricesValid,
  formSubmitted,
  onRemovePrice,
  onCreateCopy,
  onPriceChange,
}: ExpandedPriceViewProps) => {
  return (
    <div className="border-2 border-blue-200 p-2 rounded-lg bg-blue-50 relative">
      <div className="absolute top-3 right-3 flex items-center gap-1 sm:gap-2">
        <button type="button" onClick={() => onRemovePrice(index)}>
          <Trash2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => onCreateCopy(index)}>
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <SelectCustom
          label="Sucursal"
          options={dataBranch.map(b => ({ id: b.id, value: b.name }))}
          selected={price.branch ? { id: price.branch.id, value: price.branch.name } : null}
          onSelect={(value) => value && !Array.isArray(value) && onPriceChange(index, 'branch', value)}
          error={!!pricesValid?.itemsValid?.[index]?.branchValid && formSubmitted}
          helperText={formSubmitted ? pricesValid?.itemsValid?.[index]?.branchValid : ''}
        />
        {
          typeUnitOptions.map((option) => (
            <>
              <InputCustom
                label={`Precio (S/${option.value})`}
                name={`prices.${index}.price`}
                value={price.price}
                tabIndex={index + 1}
                onChange={(e) => {
                  onPriceChange(index, 'price', e.target.value);
                }}
                error={!!pricesValid?.itemsValid?.[index]?.priceValid && formSubmitted}
                helperText={formSubmitted ? pricesValid?.itemsValid?.[index]?.priceValid : ''}
              />
            </>
          ))
        }
        {/* <SelectCustom
          label="Tipo Unidad"
          options={typeUnitOptions}
          selected={typeUnitOptions.find(opt => opt.id === price.typeUnit) ?? null}
          onSelect={(value) => value && !Array.isArray(value) && onPriceChange(index, 'typeUnit', value.id)}
        /> */}
        {/* <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            Precio (S/)
          </label>
          <InputCustom
            name={`prices.${index}.price`}
            value={price.price}
            tabIndex={index + 1}
            onChange={(e) => {
              onPriceChange(index, 'price', e.target.value);
            }}
            error={!!pricesValid?.itemsValid?.[index]?.priceValid && formSubmitted}
            helperText={formSubmitted ? pricesValid?.itemsValid?.[index]?.priceValid : ''}
          />
        </div> */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            Precio Promocional (S/)
          </label>
          <InputCustom
            name={`prices.${index}.promoPrice`}
            value={price.promoPrice}
            tabIndex={index + 1}
            onChange={(e) => {
              onPriceChange(index, 'promoPrice', e.target.value);
            }}
            error={!!pricesValid?.itemsValid?.[index]?.promoPriceValid && formSubmitted}
            helperText={formSubmitted ? pricesValid?.itemsValid?.[index]?.promoPriceValid : ''}
          />
        </div>
      </div>
    </div>
  );
});
