import { useDispatch } from 'react-redux';
import { setAddCart, setUpdateItemCart, setRemoveCart, setClearCart } from '@/store';
import type { CartItem } from '@/models';
import { useAlertStore, useAppSelector } from '.';

export const useCartStore = () => {
  const { cart } = useAppSelector(state => state.carts);
  const dispatch = useDispatch();
  const { showDesition } = useAlertStore();

  const addCard = async (cartItem: CartItem) => {
    
    // const isSameStudent = cart.every((e) => e.debt.inscription.student?.userId === productPresentationModel.debt.inscription.student?.userId);

    // if (isSameStudent || cart.length === 0) {
      dispatch(setAddCart(cartItem));
    // } else {
    //   const result = await showDesition(
    //     'Estás agregando un pago de otro estudiante',
    //     '¿Deseas limpiar el carrito para agregar los pagos del nuevo estudiante?',
    //     '¡Sí, limpiar!'
    //   );
    //   if (result.isConfirmed) {
    //     dispatch(setClearCart());
    //     dispatch(setAddCart(productPresentationModel));
    //   }
    // }
  };
  const updateItemCart = async (cartItem: CartItem) => {
    dispatch(setUpdateItemCart(cartItem));
  }

  const removeItemCart = async (cartItem: CartItem) => {
    dispatch(setRemoveCart(cartItem));
  }

  const clearCart = async () => {
    dispatch(setClearCart());
  }


  return {
    //* Propiedades
    cart,
    //* Métodos
    addCard,
    updateItemCart,
    removeItemCart,
    clearCart,
  }
}