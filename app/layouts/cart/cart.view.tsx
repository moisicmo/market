import { useCartStore } from "@/hooks";
import { CartDetail, CartItemView } from '.';
import { ShoppingCart } from "lucide-react";
interface Props {
  onClose: () => void;
}

export const CartView = ({ onClose }: Props) => {

  const { cart, removeItemCart, updateItemCart } = useCartStore();


  return (
    <>
      <div className="flex flex-col h-full px-1">
        <h2 className="text-lg font-semibold mb-2">Carrito</h2>
        <div className="flex-1 overflow-y-auto px-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
              <ShoppingCart size={52} />
              <p className="text-lg font-semibold">El carrito está vacío</p>
              <p className="text-sm">Agrega elementos para comenzar a cobrar.</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItemView
                key={`${item.productModel.id}`}
                item={item}
                updateItem={(cartItem) => updateItemCart(cartItem)}
                removeItem={() => removeItemCart(item)}
              />
            ))
          )}
        </div>

        <div className="flex justify-between items-center py-2 text-base font-medium">
          <span>Total a pagar:</span>
          <span>{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)} Bs.</span>
        </div>

        {cart.length !== 0 && <CartDetail onClose={onClose} />}
      </div>
    </>
  );

};