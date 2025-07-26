import { useDispatch } from 'react-redux';
import { setAddCart, setUpdateItemCart, setRemoveCart, setClearCart } from '@/store';
import type { FormPaymentModel } from '@/models';
import { useAlertStore, useAppSelector } from '.';

export const useCartStore = () => {
  const { cart } = useAppSelector(state => state.carts);
  const dispatch = useDispatch();
  const { showDesition } = useAlertStore();

  const addCard = async (formPaymentModel: FormPaymentModel) => {
    
    const isSameStudent = cart.every((e) => e.debt.inscription.student?.userId === formPaymentModel.debt.inscription.student?.userId);

    if (isSameStudent || cart.length === 0) {
      dispatch(setAddCart(formPaymentModel));
    } else {
      const result = await showDesition(
        'Estás agregando un pago de otro estudiante',
        '¿Deseas limpiar el carrito para agregar los pagos del nuevo estudiante?',
        '¡Sí, limpiar!'
      );
      if (result.isConfirmed) {
        dispatch(setClearCart());
        dispatch(setAddCart(formPaymentModel));
      }
    }
  };
  const updateItemCart = async (itemCart: FormPaymentModel) => {
    dispatch(setUpdateItemCart({ itemCart }));
  }

  const removeItemCart = async (itemCart: FormPaymentModel) => {
    dispatch(setRemoveCart(itemCart));
  }


  return {
    //* Propiedades
    cart,
    //* Métodos
    addCard,
    updateItemCart,
    removeItemCart,
  }
}