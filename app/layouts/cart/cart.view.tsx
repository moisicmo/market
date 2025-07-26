import { useEffect, useState } from "react";
import { useCartStore } from "@/hooks";
import type { FormPaymentModel } from "@/models";
import { CartDetail, CartItem } from '.';
import { ShoppingCart } from "lucide-react";

interface Props {
  onClose: () => void;
}

export const CartView = ({ onClose }: Props) => {

  const { cart, removeItemCart } = useCartStore();

  const [itemCart, setItemCart] = useState<FormPaymentModel | null>(null);


  return (
    <>
      <div className="flex flex-col h-full px-1">
        <h2 className="text-lg font-semibold mb-2">Cobro</h2>

        <div className="flex-1 overflow-y-auto px-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
              <ShoppingCart size={52} />
              <p className="text-lg font-semibold">Tu carrito está vacío</p>
              <p className="text-sm">Agrega elementos para comenzar a cobrar.</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={`${item.debt.id}`}
                item={item}
                updateItem={() => setItemCart(item)}
                removeItem={() => removeItemCart(item)}
              />
            ))
          )}
        </div>


        <div className="flex justify-between items-center py-2 text-base font-medium">
          <span>Total a pagar:</span>
          <span>{cart.reduce((acc, item) => acc + item.amount, 0)} Bs.</span>
        </div>

        {cart.length !== 0 && <CartDetail />}
      </div>
    </>
  );

};