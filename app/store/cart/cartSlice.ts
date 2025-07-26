import type { FormPaymentModel } from '@/models';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const dataInit: FormPaymentModel[] = [];

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: dataInit,
  },
  reducers: {
    setClearCart: (state,) => {
      state.cart = [];
    },

    setAddCart: (state, action: PayloadAction<FormPaymentModel>) => {
      const item = state.cart.find((item) => item.debt.id == action.payload.debt.id);
      if (!item) {
        state.cart = [...state.cart, action.payload]
      }
    },

    setUpdateItemCart: (state, { payload }) => {
      // const itemCart: CartModel = payload.itemCart;
      // state.cart = state.cart.map((item) => {
      //   if (item.DebtModel.id == itemCart.DebtModel.id) {
      //     return itemCart;
      //   }
      //   return item;
      // })
    },

    setRemoveCart: (state, action: PayloadAction<FormPaymentModel>) => {
      state.cart = state.cart.filter(
        (e) => e.debt.id !== action.payload.debt.id
      );
    },
  }
});


export const {
  setClearCart,
  setAddCart,
  setUpdateItemCart,
  setRemoveCart,
} = cartSlice.actions;