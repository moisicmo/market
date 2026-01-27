import { InputCustom } from "@/components";
import type { FormPriceModel } from "@/models";
import { Trash2 } from "lucide-react";
import React from "react";

interface ExpandedPriceViewProps {
  price: FormPriceModel;
  index: number;
  pricesValid?: any;
  formSubmitted: boolean;
  onRemovePrice: (index: number) => void;
  onPriceChange: (index: number, field: string, value: any) => void;
}

export const ExpandedPriceView = React.memo(({
  price,
  index,
  pricesValid,
  formSubmitted,
  onRemovePrice,
  onPriceChange,
}: ExpandedPriceViewProps) => {
  return (
    <div className="border-2 border-blue-200 p-2 rounded-lg bg-blue-50 relative">
      {/* acciones */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button type="button" onClick={() => onRemovePrice(index)}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <InputCustom
        name={`prices.${index}.price`}
        label={`Precio (${price.branch?.name} / ${price.typeUnit})`}
        value={price.price}
        onChange={(e) =>
          onPriceChange(index, 'price', e.target.value)
        }
        error={!!pricesValid?.itemsValid?.[index]?.priceValid && formSubmitted}
        helperText={formSubmitted ? pricesValid?.itemsValid?.[index]?.priceValid : ''}
      />
    </div>
  );
});
