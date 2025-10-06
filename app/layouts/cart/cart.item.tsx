import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/models";

interface Props {
  item: CartItem;
  updateItem: (cartItem: CartItem) => void;
  removeItem: () => void;
}

export const CartItemView = ({ item, updateItem, removeItem }: Props) => {
  const handleIncrease = () => {
    if (item.stock > item.quantity) {
      updateItem({ ...item, quantity: item.quantity + 1 });
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateItem({ ...item, quantity: item.quantity - 1 });
    }
  };

  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="flex flex-col py-2 border-b border-gray-200 last:border-none">
      {/* 🧾 Encabezado: nombre + eliminar */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 leading-tight">
            {item.productPresentationModel.name}
          </h3>
          <p className="text-xs text-gray-600">
            Stock: {item.stock}
          </p>
        </div>
        <div className="items-end gap-2">

          {/* Controles de cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-[28px] text-center font-medium text-gray-900">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col flex-1">
          {/* Precio y subtotal */}
          <p className="text-xs text-gray-600">
            {item.price.toFixed(2)} Bs./{item.productPresentationModel.typeUnit}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            Subtotal: {subtotal} Bs.
          </p>
        </div>
        <button
          onClick={removeItem}
          className="p-1.5 hover:bg-red-100 rounded-full text-red-500 transition cursor-pointer"
          aria-label="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
